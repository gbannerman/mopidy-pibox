#!/bin/bash

# Script to increment version in setup.cfg
# Usage: ./bump_version.sh [major|minor|patch]

if [ $# -eq 0 ]; then
    echo "Usage: $0 [major|minor|patch]"
    exit 1
fi

BUMP_TYPE=$1
CONFIG_FILE="setup.cfg"
PACKAGE_JSON="package.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: $CONFIG_FILE not found"
    exit 1
fi

if [ ! -f "$PACKAGE_JSON" ]; then
    echo "Error: $PACKAGE_JSON not found"
    exit 1
fi

# Extract current version from setup.cfg
PYTHON_PACKAGE_VERSION=$(grep "^version = " "$CONFIG_FILE" | sed 's/version = //')

if [ -z "$PYTHON_PACKAGE_VERSION" ]; then
    echo "Error: Could not find version in $CONFIG_FILE"
    exit 1
fi

# Extract current version from package.json
JS_PACKAGE_VERSION=$(grep '"version":' "$PACKAGE_JSON" | sed 's/.*"version": *"\([^"]*\)".*/\1/')

if [ -z "$JS_PACKAGE_VERSION" ]; then
    echo "Error: Could not find version in $PACKAGE_JSON"
    exit 1
fi

# Check if versions are in sync
if [ "$PYTHON_PACKAGE_VERSION" != "$JS_PACKAGE_VERSION" ]; then
    echo "Error: Version mismatch!"
    echo "  $CONFIG_FILE: $PYTHON_PACKAGE_VERSION"
    echo "  $PACKAGE_JSON: $JS_PACKAGE_VERSION"
    echo "Please sync the versions before bumping."
    exit 1
fi

echo "Current version: $PYTHON_PACKAGE_VERSION"

# Split version into major, minor, patch
IFS='.' read -r MAJOR MINOR PATCH <<< "$PYTHON_PACKAGE_VERSION"

# Increment based on argument
case $BUMP_TYPE in
    major)
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        ;;
    minor)
        MINOR=$((MINOR + 1))
        PATCH=0
        ;;
    patch)
        PATCH=$((PATCH + 1))
        ;;
    *)
        echo "Error: Invalid argument. Use 'major', 'minor', or 'patch'"
        exit 1
        ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "New version: $NEW_VERSION"

# Update package.json using npm version
echo "Updating package.json..."
npm version "$NEW_VERSION" --no-git-tag-version

# Update the version in setup.cfg
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS requires -i '' for in-place editing
    sed -i '' "s/^version = .*/version = $NEW_VERSION/" "$CONFIG_FILE"
else
    # Linux
    sed -i "s/^version = .*/version = $NEW_VERSION/" "$CONFIG_FILE"
fi

echo "Version updated successfully in $CONFIG_FILE and $PACKAGE_JSON"