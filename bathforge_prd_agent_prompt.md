# BathForge MVP PRD + Agent Implementation Prompt

## 1. Product Name

**BathForge**

## 2. One-Sentence Product Summary

BathForge is an iPhone-first bathroom scanning and renovation planning app that lets a user scan a bathroom, generate a basic 3D room model, and begin planning custom builds, tile, grout, and fixture placement.

## 3. MVP Goal

Build a minimal Ionic + Capacitor iOS proof of concept that proves the core technical workflow:

1. User opens the app.
2. User taps **Start Bathroom Scan**.
3. App launches a native iOS RoomPlan scanner.
4. User scans one room.
5. User completes the scan.
6. App saves scan output locally.
7. App returns scan metadata to the Ionic UI.
8. Ionic UI displays the scan result.

The first milestone is not a full bathroom design tool. The first milestone is a technical proof that Ionic can call a native Swift RoomPlan scanner and receive usable scan output.

---

# 4. Problem Statement

Homeowners planning a bathroom renovation often need a fast way to capture existing room dimensions and visualize ideas like tile, grout, vanities, shelving, shower benches, niches, and custom built-ins. Existing 3D scanning tools are powerful but broad. BathForge focuses specifically on bathroom renovation planning.

The MVP should prove that we can capture bathroom geometry using Apple-native scanning and bring that data back into a web-based Ionic interface for future planning features.

---

# 5. Target User

Primary user:

- A homeowner or DIY renovator with an iPhone.
- Wants to scan a bathroom and plan renovations.
- Wants to experiment with tile, grout, fixtures, and custom builds.
- Does not need contractor-grade CAD in the MVP.

Secondary future users:

- Interior designers.
- Contractors.
- Tile installers.
- Cabinet/custom-build fabricators.

---

# 6. MVP Scope

## In Scope for MVP

### Ionic App

- Create a new Ionic + Capacitor app.
- iOS only for this milestone.
- Home screen with app title and scan button.
- Button labeled **Start Bathroom Scan**.
- Display scan result JSON after completion.
- Display success/failure state.
- Basic local project state is acceptable but not required.

### Native iOS Plugin

- Create a custom Capacitor iOS plugin named `RoomPlanScanner` as an **inline plugin** embedded directly in the generated iOS Xcode project (not as a standalone npm package).
- Expose a JavaScript method:

```ts
RoomPlanScanner.startScan(): Promise<RoomPlanScanResult>
```

- Implement the plugin in Swift.
- Use Apple RoomPlan to launch a native room scanning experience.
- Allow the user to scan one room.
- Allow the user to complete or cancel the scan.
- Export/save scan output locally when possible.
- Return structured data to Ionic.

### Expected Return Shape

```ts
export interface RoomPlanScanResult {
  success: boolean;
  cancelled?: boolean;
  message: string;
  usdzPath?: string;
  wallCount?: number;
  objectCount?: number;
  roomName?: string;
  timestamp: string;
}
```

### Local Output

Save generated files to a local app-accessible directory. Prefer paths that can be retrieved by the Ionic layer.

Acceptable first outputs:

- USDZ file path if export succeeds.
- JSON file path if room data is serialized.
- Minimal metadata if full export is not ready.

### Testing

- Must run on a physical iPhone.
- Simulator support is not required.
- App should handle unsupported devices gracefully.
- App should handle scan cancellation gracefully.

---

# 7. Explicitly Out of Scope for MVP

Do not implement these in the first milestone:

- Android support.
- Web-only scanning.
- Cloud sync.
- Authentication.
- User accounts.
- Payments.
- App Store release.
- TestFlight distribution.
- AI rendering.
- Photogrammetry.
- Polycam clone features.
- Full 3D mesh editing.
- Contractor-grade measurement guarantees.
- Object marketplace.
- Product catalog.
- Material price lookup.
- Backend API.
- Rails backend.
- Blender rendering pipeline.
- Multi-room project management.
- Measurement annotations.
- Tile layout engine.
- Grout preview.
- Fixture drag/drop editor.

These are future milestones only.

---

# 8. Technical Architecture

## Recommended Stack

### Frontend

- Ionic
- Capacitor 6 (pin to major version 6)
- React or Angular
- TypeScript

Use whichever Ionic starter is easiest to maintain. React is acceptable. Angular is acceptable. Do not over-engineer the UI.

### Native iOS

- Swift
- Capacitor iOS inline plugin (embedded in the generated Xcode project, not a standalone npm package)
- RoomPlan (requires iOS 16.0+; `CapturedRoom.export(to:)` for USDZ requires iOS 16.1+)
- ARKit / RealityKit as required by RoomPlan
- Minimum deployment target: **iOS 16.0**

### Storage

- Local filesystem only.
- No backend.
- No cloud.

---

# 9. UI Design System

## Design Approach

Use Ionic's built-in components in **iOS mode** (the default on iOS devices). This gives the app a native iOS look and feel with no additional dependencies or custom design work required for the MVP.

## Principles

- Let Ionic's iOS component defaults drive the visual language.
- Do not install additional UI libraries (no Angular Material, no MUI, no Tailwind).
- Do not write custom component styles unless Ionic's defaults cannot meet the need.
- Prefer `ion-button`, `ion-card`, `ion-content`, `ion-header`, `ion-toolbar` over raw HTML elements.

## Home Screen Layout

- `ion-header` with `ion-toolbar` showing app title **BathForge**.
- Centered `ion-button` labeled **Start Bathroom Scan** (fill: solid, color: primary).
- Loading spinner (`ion-spinner`) displayed while scan is in progress.
- `ion-card` below the button to display scan result JSON after completion.
- Error state displayed as a styled `ion-card` or `ion-text` with color: danger.

## Color and Theme

- Use Ionic's default iOS color palette.
- Primary color: Ionic default blue (acceptable for MVP; can be customized post-spike).
- No custom fonts for the MVP.

## What Not to Do

- Do not build a custom design system.
- Do not add Tailwind CSS.
- Do not add Google Material components.
- Do not add icon packs beyond what Ionicons provides.
- Do not design post-scan 3D preview UI in the MVP.

---

# 10. High-Level App Flow

```text
User opens BathForge
  ↓
Home screen loads
  ↓
User taps Start Bathroom Scan
  ↓
Ionic calls RoomPlanScanner.startScan()
  ↓
Capacitor bridge invokes Swift plugin
  ↓
Swift presents RoomPlan scanning view controller
  ↓
User scans room
  ↓
User taps Done or Cancel
  ↓
Swift processes captured room
  ↓
Swift saves scan files locally if possible
  ↓
Swift resolves plugin promise with result JSON
  ↓
Ionic displays scan result
```

---

# 11. Suggested Repository Structure

```text
bathforge/
  README.md
  package.json
  capacitor.config.ts
  ionic.config.json
  src/
    main.tsx or main.ts
    App.tsx or app.module.ts
    app/
      pages/
        home/
      plugins/
        room-plan-scanner.ts
      types/
        room-plan-scan-result.ts
  ios/
    App/
      App/
      Plugins/
        RoomPlanScannerPlugin.swift
        RoomPlanScanViewController.swift
```

Exact Ionic/Capacitor-generated paths may differ. Prefer the conventional generated structure over forcing this exact tree.

---

# 12. Milestone Checklist

## Milestone 0: Environment Verification

Goal: Confirm local dev environment works before building native scanning.

Checklist:

- [ ] Confirm Node.js is installed.
- [ ] Confirm npm is installed.
- [ ] Confirm Xcode 14+ is installed (required for RoomPlan and iOS 16 SDK).
- [ ] Confirm iPhone can connect to Xcode.
- [ ] Confirm Apple ID is added to Xcode.
- [ ] Confirm app can be deployed to physical iPhone.
- [ ] Confirm iPhone supports RoomPlan/LiDAR (iPhone 12 Pro or later Pro model), or gracefully handle lack of support.
- [ ] Confirm iOS deployment target is set to 16.0 in Xcode project settings.

Acceptance criteria:

- A blank Ionic/Capacitor app can run on the physical iPhone.

---

## Milestone 1: Create Ionic + Capacitor App

Goal: Build the base app shell.

Checklist:

- [ ] Create new Ionic app named `bathforge`.
- [ ] Add Capacitor iOS platform.
- [ ] Create home screen.
- [ ] Add app title: `BathForge`.
- [ ] Add button: `Start Bathroom Scan`.
- [ ] Add area to display JSON output.
- [ ] Add basic loading state.
- [ ] Add basic error state.

Acceptance criteria:

- App runs in browser.
- App runs on iPhone.
- Button click can call a placeholder function.

---

## Milestone 2: Create Fake Native Plugin Bridge

Goal: Prove Ionic can call native iOS code through Capacitor before adding RoomPlan.

Checklist:

- [ ] Create Capacitor **inline** plugin named `RoomPlanScanner` (embed directly in the iOS Xcode project, do not scaffold a separate npm package).
- [ ] Expose `startScan()` to TypeScript.
- [ ] Add required Info.plist usage descriptions: `NSCameraUsageDescription` (required for RoomPlan; app will crash on launch without it).
- [ ] Implement native Swift method that returns fake data.
- [ ] Return this shape:

```json
{
  "success": true,
  "message": "Native plugin connected",
  "timestamp": "ISO_DATE_STRING"
}
```

- [ ] Display returned data in Ionic UI.

Acceptance criteria:

- Tapping `Start Bathroom Scan` on iPhone displays fake native result in Ionic UI.
- No RoomPlan code is required yet.

---

## Milestone 3: Add RoomPlan Availability Check

Goal: Confirm device/framework support before attempting scan.

Checklist:

- [ ] Add native check for RoomPlan support.
- [ ] If unsupported, return clear error result.
- [ ] Ionic UI displays unsupported-device message.
- [ ] Do not crash on simulator or unsupported iPhone.

Acceptance criteria:

- Unsupported environment returns a clean error.
- Supported iPhone proceeds toward scanner flow.

---

## Milestone 4: Present Native RoomPlan Scanner

Goal: Launch the native scan view from Ionic.

Checklist:

- [ ] Implement `RoomPlanScanViewController` in Swift.
- [ ] Present scanner from Capacitor plugin.
- [ ] Allow user to start scanning.
- [ ] Add Done/Cancel flow.
- [ ] Dismiss scanner cleanly.
- [ ] Resolve or reject plugin promise correctly.

Acceptance criteria:

- Tapping `Start Bathroom Scan` opens native RoomPlan scanner on iPhone.
- User can cancel and return to Ionic without app crash.
- User can complete scan and return to Ionic.

---

## Milestone 5: Capture and Return Basic Room Metadata

Goal: Return useful scan metadata to Ionic.

Checklist:

- [ ] Capture completed RoomPlan result.
- [ ] Count walls if available.
- [ ] Count objects/openings if available.
- [ ] Include timestamp.
- [ ] Return success response to Ionic.
- [ ] Display returned JSON on screen.

Acceptance criteria:

- After scan completion, Ionic displays `success: true` and metadata.

---

## Milestone 6: Export Scan File Locally

Goal: Save generated scan output locally.

Checklist:

- [ ] Export USDZ if RoomPlan API supports it in current implementation.
- [ ] Save file to local app documents/cache directory.
- [ ] Return `usdzPath` to Ionic.
- [ ] If USDZ export fails, return graceful error message.
- [ ] Do not block core success if only metadata is available.

Acceptance criteria:

- Completed scan returns a local file path when export succeeds.
- Failure to export does not crash the app.

---

## Milestone 7: README and Testing Instructions

Goal: Make the project easy to rerun.

Checklist:

- [ ] Add setup instructions.
- [ ] Add iOS build instructions.
- [ ] Add physical-device testing instructions.
- [ ] Add known limitations.
- [ ] Add troubleshooting section.

Acceptance criteria:

- A developer can clone the repo, install dependencies, open iOS project, and run on iPhone.

---

# 13. Future Milestones After Technical Spike

These are not part of the first implementation request.

## Future Milestone A: Project Saving

- Save multiple scans locally.
- Add project list.
- Rename projects.
- Delete projects.

## Future Milestone B: Basic 3D Preview

- Preview exported USDZ or simplified room model.
- Show room dimensions.
- Rotate/pan/zoom.

## Future Milestone C: Bathroom Planning Tools

- Select wall/floor surfaces.
- Apply tile colors.
- Apply grout colors.
- Add vanity/toilet/tub/shower placeholders.
- Add custom boxes for shelves, benches, cabinets, niches.

## Future Milestone D: Parametric Custom Builds

- Create custom rectangular objects.
- Set width/height/depth.
- Position objects in room.
- Export dimension summary.

## Future Milestone E: AI Design Assistant

- Let user describe desired style.
- Generate suggested materials.
- Generate renovation notes.
- Eventually generate visual render concepts.

---

# 14. Agent Guardrails

The implementation agent must follow these rules:

1. Do not build backend features.
2. Do not add auth.
3. Do not add payments.
4. Do not add cloud services.
5. Do not add Android support.
6. Do not implement a full design editor yet.
7. Do not add AI image generation.
8. Do not add external paid vendors.
9. Do not require paid dependencies.
10. Keep the app iOS-first.
11. Prefer simple working code over abstractions.
12. Add comments where native bridge logic is non-obvious.
13. Make each milestone testable before moving forward.
14. Commit or clearly separate changes by milestone.
15. Do not continue to advanced features until the fake native bridge works.
16. Do not continue to export logic until the scanner can present and dismiss cleanly.
17. Use Capacitor 6. Do not upgrade or downgrade without explicit instruction.
18. Build the RoomPlanScanner plugin as an inline Capacitor plugin inside the generated iOS Xcode project. Do not scaffold it as a separate standalone npm package.
19. Set the iOS deployment target to 16.0. RoomPlan is unavailable below this version.
20. `CapturedRoom.export(to:)` (USDZ export) requires iOS 16.1+. Gate this with an availability check and handle failure gracefully without blocking the scan result.

---

# 15. Acceptance Criteria for Entire MVP

The MVP is complete when:

- [ ] The Ionic app runs on a physical iPhone.
- [ ] The home screen has a Start Bathroom Scan button.
- [ ] The button calls a Capacitor native iOS plugin.
- [ ] The native plugin presents a RoomPlan scanning interface.
- [ ] The user can complete or cancel a scan.
- [ ] The app returns to the Ionic UI after scanning.
- [ ] The Ionic UI displays a structured scan result.
- [ ] The result includes success/cancel/error state.
- [ ] The result includes at least a timestamp and message.
- [ ] The result includes room metadata if available.
- [ ] The result includes local file path if export succeeds.
- [ ] Unsupported devices are handled gracefully.
- [ ] README explains setup and testing.

---

# 16. Long-Running Agent Implementation Prompt

Copy and paste this prompt into the coding agent:

```text
You are implementing a new app called BathForge.

Build a minimal Ionic + Capacitor iOS proof of concept that proves an Ionic app can launch Apple RoomPlan through a native Swift Capacitor plugin and receive scan results back in the Ionic UI.

Product goal:
BathForge will eventually be a bathroom renovation planning app. The first milestone is only a technical spike: scan one bathroom/room with RoomPlan and return result data to Ionic.

Hard constraints:
- iOS only.
- Use Ionic + Capacitor.
- Use TypeScript for the Ionic app.
- Use Swift for the native iOS plugin.
- Use Apple RoomPlan for scanning.
- Do not add Android support.
- Do not add backend.
- Do not add auth.
- Do not add payments.
- Do not add cloud sync.
- Do not add AI rendering.
- Do not add external paid vendors.
- Do not build full bathroom editing features yet.
- Keep implementation small and testable.

Required app behavior:
1. Create an Ionic + Capacitor app named bathforge.
2. Add iOS platform support.
3. Create a home screen with:
   - App title: BathForge
   - Button: Start Bathroom Scan
   - Result display area showing returned JSON
   - Loading state
   - Error state
4. Create a custom Capacitor iOS plugin named RoomPlanScanner.
5. Expose a TypeScript method:

   RoomPlanScanner.startScan(): Promise<RoomPlanScanResult>

6. Define RoomPlanScanResult as:

   interface RoomPlanScanResult {
     success: boolean;
     cancelled?: boolean;
     message: string;
     usdzPath?: string;
     wallCount?: number;
     objectCount?: number;
     roomName?: string;
     timestamp: string;
   }

7. First implement the plugin with a fake native response:

   {
     success: true,
     message: "Native plugin connected",
     timestamp: "ISO_DATE_STRING"
   }

8. After the fake bridge works on a physical iPhone, implement the native RoomPlan scanner.
9. Add a native Swift view controller that presents the RoomPlan scanning experience.
10. Support completing and cancelling a scan.
11. Return to the Ionic UI after completion/cancellation.
12. On successful scan, return metadata such as wallCount/objectCount if available.
13. Export USDZ locally if supported by the RoomPlan API in the current implementation.
14. Return usdzPath if export succeeds.
15. If export fails but scanning succeeds, still return success with a clear message.
16. If the device does not support RoomPlan, return a clean error result instead of crashing.
17. Add a README with:
    - prerequisites
    - install commands
    - iOS setup
    - Xcode signing notes
    - physical iPhone testing steps
    - known limitations
    - troubleshooting

Implementation sequence (matches Section 11 milestone checklist):
- Milestone 0: Verify environment — Node, Xcode 14+, iPhone connected, deployment target set to iOS 16.0.
- Milestone 1: Create Ionic + Capacitor 6 app and run it in browser and on iPhone.
- Milestone 2: Add inline RoomPlanScanner plugin with fake response; prove JS-to-Swift bridge works on physical iPhone. Add NSCameraUsageDescription to Info.plist.
- Milestone 3: Add RoomPlan availability check in Swift; return clean error on unsupported device.
- Milestone 4: Present native RoomPlan scanner view controller.
- Milestone 5: Capture and return basic room metadata (wallCount, objectCount, timestamp).
- Milestone 6: Export USDZ locally (requires iOS 16.1+; handle gracefully if unavailable). Return usdzPath.
- Milestone 7: Write README and testing instructions.

Important debugging expectations:
- Do not attempt RoomPlan before proving the fake native plugin bridge works.
- Do not implement extra features before the scanner can present and dismiss cleanly.
- Keep changes small and milestone-based.
- Explain any RoomPlan API limitations encountered.
- If a compile error occurs due to API version mismatch, inspect the local Xcode/SDK API and adapt rather than guessing.
- Prefer working minimal code over architecture complexity.

Final deliverable:
A local repo that can be opened in Xcode and deployed to a physical iPhone. The app should let the user tap Start Bathroom Scan, perform or cancel a RoomPlan scan, and display the returned JSON result in the Ionic UI.
```

---

# 17. Manual Test Script

Use this script to test the app after each milestone.

## Test 1: Ionic App Loads

Steps:

1. Install dependencies.
2. Run the Ionic app locally.
3. Confirm the home screen loads.
4. Confirm the Start Bathroom Scan button appears.

Expected result:

- App loads without errors.

## Test 2: iOS Build Opens

Steps:

1. Add iOS platform.
2. Open iOS project in Xcode.
3. Select physical iPhone.
4. Build and run.

Expected result:

- App opens on iPhone.

## Test 3: Fake Native Plugin

Steps:

1. Tap Start Bathroom Scan.
2. Wait for result.

Expected result:

- UI displays JSON containing:

```json
{
  "success": true,
  "message": "Native plugin connected"
}
```

## Test 4: Unsupported Device Handling

Steps:

1. Run on simulator or unsupported device.
2. Tap Start Bathroom Scan.

Expected result:

- App shows a clean unsupported-device result.
- App does not crash.

## Test 5: RoomPlan Scanner Opens

Steps:

1. Run on supported physical iPhone.
2. Tap Start Bathroom Scan.

Expected result:

- Native RoomPlan scanning interface opens.

## Test 6: Cancel Scan

Steps:

1. Open scanner.
2. Tap Cancel.

Expected result:

- App returns to Ionic UI.
- UI shows cancelled result.

## Test 7: Complete Scan

Steps:

1. Open scanner.
2. Scan bathroom/room.
3. Tap Done.

Expected result:

- App returns to Ionic UI.
- UI shows success result.
- Result includes timestamp and message.
- Result includes metadata/file path if available.

---

# 18. Notes for Future Product Direction

Once the technical spike works, the product should evolve toward bathroom-specific renovation planning rather than generic scanning.

The differentiator should be:

- Tile preview.
- Grout preview.
- Custom shelves.
- Shower benches.
- Niches.
- Vanities.
- Cabinets.
- Fixture placement.
- Dimension notes.
- Renovation concept exports.

The app should not try to compete with broad 3D scanning apps directly. It should compete by being more useful for bathroom renovation planning.

