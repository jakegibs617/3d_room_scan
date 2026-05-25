import Capacitor
import Foundation
import RoomPlan
import UIKit

@objc(RoomPlanScannerPlugin)
public class RoomPlanScannerPlugin: CAPPlugin, CAPBridgedPlugin, RoomPlanScanViewControllerDelegate {
    public let identifier = "RoomPlanScannerPlugin"
    public let jsName = "RoomPlanScanner"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "startScan", returnType: CAPPluginReturnPromise)
    ]

    private static let timestampFormatter = ISO8601DateFormatter()

    private var scanCall: CAPPluginCall?

    @objc func startScan(_ call: CAPPluginCall) {
        guard scanCall == nil else {
            call.resolve(scanResult(
                success: false,
                message: "A bathroom scan is already in progress."
            ))
            return
        }

        guard RoomCaptureSession.isSupported else {
            call.resolve(scanResult(
                success: false,
                message: "RoomPlan scanning requires a LiDAR-capable iPhone or iPad running iOS 16 or later."
            ))
            return
        }

        scanCall = call

        DispatchQueue.main.async {
            guard let presentingViewController = self.bridge?.viewController else {
                self.scanCall = nil
                call.resolve(self.scanResult(
                    success: false,
                    message: "Unable to find a view controller to present the scanner."
                ))
                return
            }

            let scanViewController = RoomPlanScanViewController()
            scanViewController.delegate = self

            let navigationController = UINavigationController(rootViewController: scanViewController)
            navigationController.modalPresentationStyle = .fullScreen
            presentingViewController.present(navigationController, animated: true)
        }
    }

    func roomPlanScanViewControllerDidCancel(_ viewController: RoomPlanScanViewController) {
        finishScan(from: viewController, result: scanResult(
            success: false,
            cancelled: true,
            message: "Bathroom scan cancelled."
        ))
    }

    func roomPlanScanViewController(_ viewController: RoomPlanScanViewController, didFailWithMessage message: String) {
        finishScan(from: viewController, result: scanResult(
            success: false,
            message: message
        ))
    }

    func roomPlanScanViewController(_ viewController: RoomPlanScanViewController, didFinishWith capturedRoom: CapturedRoom) {
        let scanFileName = "bathforge-scan-\(UUID().uuidString)"
        var result = scanResult(
            success: true,
            message: "Bathroom scan completed.",
            wallCount: capturedRoom.walls.count,
            objectCount: capturedRoom.objects.count,
            roomName: "Bathroom Scan"
        )

        if #available(iOS 16.1, *) {
            do {
                let exportResult = try export(capturedRoom, fileName: scanFileName)
                result["usdzPath"] = exportResult.path
                result["usdzUrl"] = exportResult.url
            } catch {
                result["message"] = "Bathroom scan completed, but USDZ export failed: \(error.localizedDescription)"
            }
        } else {
            result["message"] = "Bathroom scan completed. USDZ export requires iOS 16.1 or later."
        }

        do {
            let metadataResult = try writeMetadata(result, fileName: scanFileName)
            result["jsonPath"] = metadataResult.path
            result["jsonUrl"] = metadataResult.url
        } catch {
            result["message"] = "\(result["message"] ?? "Bathroom scan completed."), and metadata export failed: \(error.localizedDescription)"
        }

        finishScan(from: viewController, result: result)
    }

    private func finishScan(from viewController: UIViewController, result: [String: Any]) {
        DispatchQueue.main.async {
            viewController.dismiss(animated: true) {
                self.scanCall?.resolve(result)
                self.scanCall = nil
            }
        }
    }

    @available(iOS 16.1, *)
    private func export(_ capturedRoom: CapturedRoom, fileName: String) throws -> (path: String, url: String?) {
        let destinationURL = try scansDirectory().appendingPathComponent("\(fileName).usdz")

        try capturedRoom.export(to: destinationURL, exportOptions: .parametric)
        let portableURL = bridge?.portablePath(fromLocalURL: destinationURL)?.absoluteString
        return (destinationURL.path, portableURL)
    }

    private func writeMetadata(_ metadata: [String: Any], fileName: String) throws -> (path: String, url: String?) {
        let destinationURL = try scansDirectory().appendingPathComponent("\(fileName).json")
        let data = try JSONSerialization.data(withJSONObject: metadata, options: [.prettyPrinted, .sortedKeys])
        try data.write(to: destinationURL, options: .atomic)

        let portableURL = bridge?.portablePath(fromLocalURL: destinationURL)?.absoluteString
        return (destinationURL.path, portableURL)
    }

    private func scansDirectory() throws -> URL {
        let documentsDirectory = try FileManager.default.url(
            for: .documentDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        )
        let scansDirectory = documentsDirectory.appendingPathComponent("RoomPlanScans", isDirectory: true)
        try FileManager.default.createDirectory(at: scansDirectory, withIntermediateDirectories: true)
        return scansDirectory
    }

    private func scanResult(
        success: Bool,
        cancelled: Bool? = nil,
        message: String,
        wallCount: Int? = nil,
        objectCount: Int? = nil,
        roomName: String? = nil
    ) -> [String: Any] {
        var result: [String: Any] = [
            "success": success,
            "message": message,
            "cancelled": cancelled ?? false,
            "timestamp": Self.timestampFormatter.string(from: Date())
        ]

        if let wallCount = wallCount {
            result["wallCount"] = wallCount
        }

        if let objectCount = objectCount {
            result["objectCount"] = objectCount
        }

        if let roomName = roomName {
            result["roomName"] = roomName
        }

        return result
    }
}
