#!/bin/bash
# usage: ./scripts/reset-polis-codebase.sh

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
