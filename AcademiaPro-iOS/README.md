# AcademiaPro iOS Wrapper

This directory contains the source code for an iOS app wrapper for the AcademiaPro web application.

## GitHub Actions Auto-Build

The project is configured to automatically build a sideloadable `.ipa` file using GitHub Actions.

1. **Automatic Build:** Every push to the `main` branch will trigger a build.
2. **Manual Build:** You can trigger a build manually by going to the "Actions" tab in GitHub, selecting the "Build iOS IPA" workflow, and clicking "Run workflow".
3. **Downloading the IPA:** Once the action completes, the `.ipa` file is uploaded as a workflow artifact named `AcademiaPro-IPA`. You can download it directly from the summary page of the action run.
4. **Releases:** If you push a tag, the `.ipa` file will be automatically attached to the GitHub Release.

## Sideloading

Once you have the `.ipa` file, you can sideload it onto your iOS device using:
- **AltStore / AltServer**
- **Sideloadly**
- **TrollStore** (if your device is compatible)

*Note: The generated IPA is intentionally unsigned. The tools above will re-sign it with your own developer certificate during sideloading.*

## Local Build (macOS)

If you have a macOS machine with Xcode and Homebrew installed, you can build locally:

1. Install XcodeGen:
   ```bash
   brew install xcodegen
   ```
2. Run the build script:
   ```bash
   ./build-ipa-macos.sh
   ```
   This will generate `AcademiaPro.ipa` in this directory.

## Features
- Full-screen web view without Safari UI
- Proper safe area handling (Dynamic Island / notch support)
- LocalStorage persistence
- Dark/Light mode support based on system settings
- Handles JavaScript alerts and confirmations natively
