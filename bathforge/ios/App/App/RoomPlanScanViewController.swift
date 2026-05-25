import RoomPlan
import UIKit

protocol RoomPlanScanViewControllerDelegate: AnyObject {
    func roomPlanScanViewControllerDidCancel(_ viewController: RoomPlanScanViewController)
    func roomPlanScanViewController(_ viewController: RoomPlanScanViewController, didFailWithMessage message: String)
    func roomPlanScanViewController(_ viewController: RoomPlanScanViewController, didFinishWith capturedRoom: CapturedRoom)
}

@MainActor
class RoomPlanScanViewController: UIViewController, @preconcurrency RoomCaptureViewDelegate {
    weak var delegate: RoomPlanScanViewControllerDelegate?

    private let roomCaptureView = RoomCaptureView(frame: .zero)
    private var hasStartedScanning = false
    private var hasResolvedScan = false

    override func viewDidLoad() {
        super.viewDidLoad()

        title = "Bathroom Scan"
        view.backgroundColor = .systemBackground

        navigationItem.leftBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .cancel,
            target: self,
            action: #selector(cancelScan)
        )
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .done,
            target: self,
            action: #selector(finishScan)
        )

        roomCaptureView.delegate = self
        roomCaptureView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(roomCaptureView)

        NSLayoutConstraint.activate([
            roomCaptureView.topAnchor.constraint(equalTo: view.topAnchor),
            roomCaptureView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            roomCaptureView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            roomCaptureView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        guard !hasStartedScanning else {
            return
        }

        hasStartedScanning = true
        let configuration = RoomCaptureSession.Configuration()
        roomCaptureView.captureSession.run(configuration: configuration)
    }

    @objc private func cancelScan() {
        guard !hasResolvedScan else {
            return
        }

        hasResolvedScan = true
        roomCaptureView.captureSession.stop()
        delegate?.roomPlanScanViewControllerDidCancel(self)
    }

    @objc private func finishScan() {
        guard hasStartedScanning, !hasResolvedScan else {
            return
        }

        title = "Processing Scan"
        navigationItem.leftBarButtonItem?.isEnabled = false
        navigationItem.rightBarButtonItem?.isEnabled = false
        roomCaptureView.captureSession.stop()
    }

    func captureView(shouldPresent roomDataForProcessing: CapturedRoomData, error: Error?) -> Bool {
        if let error = error {
            hasResolvedScan = true
            roomCaptureView.captureSession.stop()
            delegate?.roomPlanScanViewController(self, didFailWithMessage: error.localizedDescription)
            return false
        }

        return !hasResolvedScan
    }

    func captureView(didPresent processedResult: CapturedRoom, error: Error?) {
        guard !hasResolvedScan else {
            return
        }

        hasResolvedScan = true

        if let error = error {
            delegate?.roomPlanScanViewController(self, didFailWithMessage: error.localizedDescription)
            return
        }

        delegate?.roomPlanScanViewController(self, didFinishWith: processedResult)
    }
}
