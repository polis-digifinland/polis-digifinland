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

# Create selected patches

# Array of files
FILES=(
math/bin/run # patch1 change max heap memory for math worker
server/src/email/senders.ts # patch2 enable sending with mailgun EU endpoint
server/src/server.ts # patch3 1 comment out block that saves encrypted IPs to database when x-forwarded-for header is set in request | 2 force exempt=true to disable http->https redirect to enable working internal LB health checks and Pod readiness probes on GKE
server/src/utils/constants.ts # patch4 hide social media opt in settings for conversation setup and set opt-in defaults as false
client-admin/src/components/conversation-admin/conversation-config.js # patch4 hide social media opt in settings for conversation setup and set opt-in defaults as false
client-admin/src/components/landers/signin.js # patch5 1 hide facebook login/user creation on admin signin page | 2 add dev env warning before login form
client-admin/src/components/landers/lander-footer.js # patch6 hide TOS link and replace privacy policy link on admin page footer
client-participation/js/templates/participation.handlebars # patch7 hide footer (logo with pol.is link and other links to privacy policy & terms pages)
client-participation/js/strings.js # patch8 add finnish and swedish translations
client-report/gulpfile.js # patch8 add finnish and swedish translations
client-report/src/index.js # patch8 add finnish and swedish translations
client-report/package.json # patch8 add finnish and swedish translations
client-report/package-lock.json # patch8 add finnish and swedish translations
client-report/src/components/overview.js # patch8 add finnish and swedish translations
client-report/src/components/controls/controls.js # patch8 add finnish and swedish translations
client-report/src/components/beeswarm/beeswarm.js # patch8 add finnish and swedish translations
client-report/src/components/framework/heading.js # patch8 add finnish and swedish translations
client-report/src/components/framework/legend.js # patch8 add finnish and swedish translations
client-report/src/components/lists/allCommentsModeratedIn.js # patch8 add finnish and swedish translations
client-report/src/components/lists/commentList.js # patch8 add finnish and swedish translations
client-report/src/components/lists/majorityStrict.js # patch8 add finnish and swedish translations
client-report/src/components/lists/metadata.js # patch8 add finnish and swedish translations
client-report/src/components/lists/participantGroup.js # patch8 add finnish and swedish translations
client-report/src/components/lists/participantGroups.js # patch8 add finnish and swedish translations
client-report/src/components/lists/uncertainty.js # patch8 add finnish and swedish translations
client-report/src/components/participantsGraph/participantsGraph.js # patch8 add finnish and swedish translations
client-admin/src/index.js # patch8 add finnish and swedish translations
client-admin/src/app.js # patch8 add finnish and swedish translations
client-admin/src/components/interior-header.js # patch8 add finnish and swedish translations
client-admin/package.json # patch8 add finnish and swedish translations
client-admin/package-lock.json # patch8 add finnish and swedish translations
client-admin/src/components/landers/signout.js # patch9 redirect to /signin instead of /home after sign out
client-admin/src/components/conversation-admin/comment-moderation/moderate-comments-todo.js # patch10 change amount of unmoderated comments visible in admin moderate page
client-participation/vis2/components/graphParticipants.js # patch12 Draw only isSelf icon
)

for f in "${FILES[@]}"
do
    #echo "$f"

    # Make sure all files are Unix LF
    # This is needed for patching to function correctly
    dos2unix -q "./$f"
    dos2unix -q "../patches/$f"
    dos2unix -q "../patches/$f.patch"

    # Create patch diffs for each file in FILES array
    # Using label to drop the timestamps, easier to rerun this script and not have all patch-files modified in git
    diff -u --label "./$f" --label "../patches/$f" "./$f" "../patches/$f" > "../patches/$f.patch"

done

