# BathForge

BathForge is an Ionic + Capacitor iOS proof of concept for launching a native Apple RoomPlan bathroom scan flow and returning scan metadata to the Ionic UI.

This slice implements the app shell, an inline Capacitor iOS plugin named `RoomPlanScanner`, RoomPlan availability handling, native scan presentation, cancellation, metadata return, and best-effort USDZ export.

## Prerequisites

- Node.js 18+ for this starter; Node 22+ is recommended for newer Ionic/Capacitor tooling.
- npm.
- Xcode 14+ with an iOS SDK.
- CocoaPods.
- A physical iPhone for native testing.
- A LiDAR-capable iPhone or iPad that supports RoomPlan.
- iOS 16.0+ for scanning. iOS 16.1+ is required for USDZ export.

## Install

```sh
npm install
```

## Run In Browser

```sh
npm run dev
```

Open the local Vite URL printed by the command. Browser mode returns a clean unsupported response because RoomPlan is only available in the native iOS app.

## Build Web Assets

```sh
npm run build
```

Copy updated web assets into the iOS project:

```sh
npx cap copy ios
```

## iOS Setup

Install pods after dependency or platform changes:

```sh
cd ios/App
pod install
open App.xcworkspace
```

In Xcode:

- Select the `App` target.
- Confirm the deployment target is iOS 16.0.
- Set your signing team.
- Select a physical iPhone.
- Build and run.

## Manual Test

1. Launch BathForge on the iPhone.
2. Tap **Start Bathroom Scan**.
3. On a supported device, confirm the native RoomPlan scanner opens.
4. Tap **Cancel** and confirm the Ionic UI displays a cancelled response.
5. Start another scan, scan a bathroom, then tap **Done**.
6. Confirm the Ionic UI displays JSON with:

```json
{
  "success": true,
  "cancelled": false,
  "message": "Bathroom scan completed.",
  "wallCount": 4,
  "objectCount": 1,
  "roomName": "Bathroom Scan",
  "usdzPath": "/path/to/bathforge-scan.usdz",
  "usdzUrl": "capacitor://localhost/_capacitor_file_/path/to/bathforge-scan.usdz"
}
```

Exact counts, `usdzPath`, and `usdzUrl` vary by scan and OS version. `roomName` is a fixed display label because RoomPlan does not provide a room name. Use `usdzUrl` for web-view loading and `usdzPath` for native file operations such as sharing through Capacitor plugins. Unsupported devices should display a clean error response instead of crashing.

## Current Limitations

- Android is intentionally not included.
- The web browser fallback only verifies UI state and unsupported handling.
- A physical-device run is required to verify RoomPlan capture end to end.
- USDZ export is skipped on iOS 16.0 and may fail independently of scan metadata.

## Troubleshooting

- If the app crashes before scanning, confirm `NSCameraUsageDescription` is present in `ios/App/App/Info.plist`.
- If the native plugin is unavailable, confirm `Main.storyboard` uses `MainViewController` and that `RoomPlanScannerPlugin.swift` is included in the App target sources.
- If Xcode cannot find a destination, install the missing iOS platform/runtime from Xcode Settings, then reopen `ios/App/App.xcworkspace`.
- If the scanner reports unsupported hardware, test on a LiDAR-capable device such as an iPhone Pro model that supports RoomPlan.
- After editing web code, run `npm run build && npx cap copy ios` before rebuilding in Xcode.
