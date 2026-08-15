#!/bin/bash
set -e
cd "$(dirname "$0")"

# Copy web content
cp ../academia_pro_embed.html AcademiaPro/index.html

# Generate Xcode project
xcodegen generate

# Build
xcodebuild -project AcademiaPro.xcodeproj \
  -scheme AcademiaPro \
  -configuration Release \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -archivePath build/AcademiaPro.xcarchive \
  archive \
  CODE_SIGN_IDENTITY="-" \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGNING_ALLOWED=NO

# Package IPA
mkdir -p build/Payload
cp -r build/AcademiaPro.xcarchive/Products/Applications/AcademiaPro.app build/Payload/
cd build && zip -r ../AcademiaPro.ipa Payload
cd ..
rm -rf build
echo "Created AcademiaPro.ipa"
