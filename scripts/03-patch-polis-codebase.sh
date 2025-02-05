#!/bin/bash
# usage: ./scripts/patch-polis-codebase.sh

# First reset polis submodule to official stable OR edge branch, or at certain commit usable for DigiFinland version.

# Init and update submodule contents
git submodule update --init --recursive --force

# Run git commands in polis dir to reset submodule codebase
cd ./polis/

# Download changes
git fetch

# To use latest version from git tracked submodule version, use:
git reset --hard

# To use latest version from edge branch, use:
#git reset --hard origin/edge

# To get specific commits, use alternative commands below:
# 
# 1. last working version before Polis configuration unification changes:
# git reset --hard ad23ff57566ffe6be7d441709c235c574e5f97d7
# 2. Polis the first "configuration unification" version changes:
# git reset --hard 5ecaf99d890615e72225f0ff7d3afc847a9f35e7
# 4. to use stable branch (not yet recommended by CompDem for DigiFinland)
# git reset --hard origin/stable

# Remove untracked files
git clean -fdx

# Apply patches in a loop

# Array of files
source ../scripts/00-files.sh

for f in "${FILES[@]}"
do
    #echo "$f"

    # Make sure all files are Unix LF
    # This is needed for patching to function correctly
    dos2unix -q "./$f"
    dos2unix -q "../patches/$f"
    dos2unix -q "../patches/$f.patch"

    # Apply patches to each file in FILES array
    patch --no-backup-if-mismatch "./$f" < "../patches/$f.patch"

done

# patch8 copy files related to finnish and swedish translations
cp -r ../translations/client-participation/js/strings/* ./client-participation/js/strings/
cp -r ../translations/client-report/locales ./client-report/locales
cp -r ../translations/client-report/src/i18n.js ./client-report/src/i18n.js
cp -r ../translations/client-admin/public/locales ./client-admin/public/locales
cp -r ../translations/client-admin/src/i18n.js ./client-admin/src/i18n.js

