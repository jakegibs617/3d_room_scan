import Capacitor
import Foundation

@objc(RoomPlanScannerPlugin)
public class RoomPlanScannerPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "RoomPlanScannerPlugin"
    public let jsName = "RoomPlanScanner"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "startScan", returnType: CAPPluginReturnPromise)
    ]

    @objc func startScan(_ call: CAPPluginCall) {
        call.resolve([
            "success": true,
            "message": "Native plugin connected",
            "timestamp": ISO8601DateFormatter().string(from: Date())
        ])
    }
}
