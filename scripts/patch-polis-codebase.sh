#!/bin/bash
# usage: ./path_to_this_script 

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

# Apply selected patches

# patch 0: fix math server entrypoint script line feeds, this is done to be sure the file is having Unix LF
dos2unix -q math/bin/run

# patch 1: enable sending with mailgun EU endpoint
dos2unix -q ./server/src/email/senders.ts
patch --no-backup-if-mismatch ./server/src/email/senders.ts < ../patches/server/src/email/senders.ts.patch

# patch 2: fix client-report urls
#dos2unix -q ./client-report/src/util/url.js
#patch ./client-report/src/util/url.js <  ../client-report/src/util/url.js.patch

# patch 3: 
#  - comment out block that saves encrypted IPs to database when x-forwarded-for header is set in request
#  - force exempt=true to disable http->https redirect to enable working internal LB health checks and Pod readiness probes on GKE
dos2unix -q ./server/src/server.ts
patch --no-backup-if-mismatch ./server/src/server.ts <  ../patches/server/src/server.ts.patch

# patch 4: hide social media opt in settings for conversation setup and set opt-in defaults as false
dos2unix -q ./server/src/utils/constants.ts
patch ./server/src/utils/constants.ts < ../patches/server/src/utils/constants.ts.patch
dos2unix -q ./client-admin/src/components/conversation-admin/conversation-config.js
patch ./client-admin/src/components/conversation-admin/conversation-config.js < ../patches/client-admin/src/components/conversation-admin/conversation-config.js.patch

# patch 5:
# - hide facebook login/user creation on admin signin page
# - add dev env warning before login form
dos2unix -q ./client-admin/src/components/landers/signin.js
patch  ./client-admin/src/components/landers/signin.js < ../patches/client-admin/src/components/landers/signin.js.patch

# patch 6: hide TOS link and replace privacy policy link on admin page footer
dos2unix -q ./client-admin/src/components/landers/lander-footer.js
patch ./client-admin/src/components/landers/lander-footer.js < ../patches/client-admin/src/components/landers/lander-footer.js.patch

# patch 7: hide footer (logo with pol.is link and other links to privacy policy & terms pages)
dos2unix -q ./client-participation/js/templates/participation.handlebars 
patch ./client-participation/js/templates/participation.handlebars < ../patches/client-participation/js/templates/participation.handlebars.patch

# patch 8: add finnish and swedish translations
cp -r ../translations/client-participation/js/strings/* ./client-participation/js/strings/
dos2unix -q ./client-participation/js/strings.js
patch ./client-participation/js/strings.js < ../patches/client-participation/js/strings.js.patch

cp -r ../translations/client-report/locales ./client-report/locales
cp -r ../translations/client-report/src/i18n.js ./client-report/src/i18n.js
dos2unix -q ./client-report/gulpfile.js
dos2unix -q ./client-report/src/index.js
dos2unix -q ./client-report/package.json
dos2unix -q ./client-report/package-lock.json
dos2unix -q ./client-report/src/components/overview.js
dos2unix -q ./client-report/src/components/controls/controls.js
patch ./client-report/gulpfile.js < ../patches/client-report/gulpfile.js.patch
patch ./client-report/src/index.js < ../patches/client-report/src/index.js.patch
patch ./client-report/package.json < ../patches/client-report/package.json.patch
patch ./client-report/package-lock.json < ../patches/client-report/package-lock.json.patch
patch ./client-report/src/components/overview.js < ../patches/client-report/src/components/overview.js.patch
patch ./client-report/src/components/controls/controls.js < ../patches/client-report/src/components/controls/controls.js.patch

# patch 9: redirect to /signin instead of /home after sign out
dos2unix -q ./client-admin/src/components/landers/signout.js
patch  ./client-admin/src/components/landers/signout.js < ../patches/client-admin/src/components/landers/signout.js.patch

# patch 10: change amount of unmoderated comments visible in admin moderate page
dos2unix -q ./client-admin/src/components/conversation-admin/comment-moderation/moderate-comments-todo.js
patch  ./client-admin/src/components/conversation-admin/comment-moderation/moderate-comments-todo.js < ../patches/client-admin/src/components/conversation-admin/comment-moderation/moderate-comments-todo.js.patch

# patch 11: change max heap memory for math worker
dos2unix -q ./math/bin/run
patch ./math/bin/run < ../patches/math/bin/run.patch

# patch 12: Draw only isSelf icon
dos2unix -q ./client-participation/vis2/components/graphParticipants.js
patch ./client-participation/vis2/components/graphParticipants.js < ../patches/client-participation/vis2/components/graphParticipants.js.patch

