#!/bin/bash
set -e

cd "$(dirname "$0")"

BUILD_DIR="ios-build"
APP_DIR="$BUILD_DIR/Payload/AcademiaPro.app"

echo "Building standalone web bundle..."
node build-embed.js

echo "Creating build directories..."
mkdir -p "$APP_DIR"

echo "Copying web app..."
cp academia_pro_embed.html "$APP_DIR/index.html"

echo "Copying Info.plist..."
cp AcademiaPro-iOS/AcademiaPro/Info.plist "$APP_DIR/Info.plist"

echo "Generating placeholder app icons..."
# Create simple icons using imagemagick if available, otherwise just touch the files
if command -v convert &> /dev/null; then
    convert -size 120x120 xc:"#f8fafc" -fill "#333333" -gravity center -pointsize 24 -draw "text 0,0 'AP'" "$APP_DIR/AppIcon60x60@2x.png"
    convert -size 152x152 xc:"#f8fafc" -fill "#333333" -gravity center -pointsize 30 -draw "text 0,0 'AP'" "$APP_DIR/AppIcon76x76@2x.png"
else
    echo "ImageMagick not found, creating dummy PNG files..."
    touch "$APP_DIR/AppIcon60x60@2x.png"
    touch "$APP_DIR/AppIcon76x76@2x.png"
fi

# A real iOS app needs a compiled Mach-O executable.
# Without Xcode on macOS, we can't compile the Swift wrapper.
# If you have a pre-compiled placeholder binary, you would copy it here:
# cp placeholder_binary "$APP_DIR/AcademiaPro"
# chmod +x "$APP_DIR/AcademiaPro"

echo ""
echo "==========================================================="
echo "WARNING: This IPA will not be installable via standard tools"
echo "like AltStore or Sideloadly because it lacks a compiled"
echo "Mach-O binary executable (AcademiaPro). You must compile"
echo "the wrapper on a Mac using Xcode or xcodebuild."
echo "==========================================================="
echo ""

echo "Packaging IPA..."
cd "$BUILD_DIR"
zip -r AcademiaPro.ipa Payload

echo "Done! Created $BUILD_DIR/AcademiaPro.ipa"
