# BathForge

BathForge is an Ionic + Capacitor iOS proof of concept for launching a native bathroom scan flow and returning scan metadata to the Ionic UI.

This first slice implements the app shell and a fake native `RoomPlanScanner.startScan()` bridge response. It intentionally stops before RoomPlan capture so the JavaScript-to-Swift bridge can be tested independently on a physical iPhone.

## Prerequisites

- Node.js 18+ for this starter; Node 22+ is recommended for newer Ionic/Capacitor tooling.
- npm.
- Xcode 14+ with an iOS SDK.
- CocoaPods.
- A physical iPhone for native testing.
- A LiDAR-capable iPhone will be required once RoomPlan scanning is implemented.

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
3. Confirm the UI displays JSON with:

```json
{
  "success": true,
  "message": "Native plugin connected"
}
```

## Current Limitations

- RoomPlan scanning is not implemented yet.
- Android is intentionally not included.
- The web browser fallback only verifies UI state and unsupported handling.
- A physical-device run is still required to prove the fake native bridge end to end.

## Troubleshooting

- If the app crashes before scanning, confirm `NSCameraUsageDescription` is present in `ios/App/App/Info.plist`.
- If the native plugin is unavailable, confirm `Main.storyboard` uses `MainViewController` and that `RoomPlanScannerPlugin.swift` is included in the App target sources.
- If Xcode cannot find a destination, install the missing iOS platform/runtime from Xcode Settings, then reopen `ios/App/App.xcworkspace`.
- After editing web code, run `npm run build && npx cap copy ios` before rebuilding in Xcode.
