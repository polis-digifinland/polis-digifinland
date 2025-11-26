#!/bin/bash
# Array of files
FILES=(
file-server/nginx/nginx-ssl.site.default.conf
math/bin/run # patch1 change max heap memory for math worker
server/src/email/senders.ts # patch2 enable sending with mailgun EU endpoint
server/src/server.ts # patch3 1 comment out block that saves encrypted IPs to database when x-forwarded-for header is set in request | 2 force exempt=true to disable http->https redirect to enable working internal LB health checks and Pod readiness probes on GKE
server/src/utils/constants.ts # patch4 hide social media opt in settings for conversation setup and set opt-in defaults as false
server/src/utils/cookies.ts # add custom domain for cookies
client-admin/src/components/conversation-admin/conversation-config.js # patch4 hide social media opt in settings for conversation setup and set opt-in defaults as false
client-admin/src/components/landers/signin.js # patch5 1 hide facebook login/user creation on admin signin page | 2 add dev env warning before login form
client-admin/src/components/landers/lander-footer.js # patch6 hide TOS link and replace privacy policy link on admin page footer patch8 add finnish and swedish translations
client-admin/src/components/landers/lander-header.js # patch8 add finnish and swedish translations
client-report/webpack.common.js # patch8 add finnish and swedish translations
client-report/src/index.js # patch8 add finnish and swedish translations
client-report/package.json # patch8 add finnish and swedish translations
client-report/package-lock.json # patch8 add finnish and swedish translations
client-report/src/components/app.jsx
client-report/src/components/overview.jsx # patch8 add finnish and swedish translations
client-report/src/components/controls/controls.jsx # patch8 add finnish and swedish translations
client-report/src/components/beeswarm/beeswarm.jsx # patch8 add finnish and swedish translations
client-report/src/components/framework/heading.jsx # patch8 add finnish and swedish translations
client-report/src/components/framework/Footer.jsx # patch7 custom footer | patch8 add finnish and swedish translations
client-report/src/components/framework/legend.jsx # patch8 add finnish and swedish translations
client-report/src/components/lists/allCommentsModeratedIn.jsx # patch8 add finnish and swedish translations
client-report/src/components/lists/commentList.jsx # patch8 add finnish and swedish translations
client-report/src/components/lists/majorityStrict.jsx # patch8 add finnish and swedish translations
client-report/src/components/lists/metadata.jsx # patch8 add finnish and swedish translations
client-report/src/components/lists/participantGroup.jsx # patch8 add finnish and swedish translations
client-report/src/components/lists/participantGroups.jsx # patch8 add finnish and swedish translations
client-report/src/components/lists/uncertainty.jsx # patch8 add finnish and swedish translations
client-report/src/components/participantsGraph/participantsGraph.jsx # patch8 add finnish and swedish translations
client-admin/src/index.js # patch8 add finnish and swedish translations
client-admin/src/app.js # patch8 add finnish and swedish translations
client-admin/src/components/interior-header.js # patch8 add finnish and swedish translations
client-admin/package.json # patch8 add finnish and swedish translations
client-admin/package-lock.json # patch8 add finnish and swedish translations
client-admin/src/components/landers/createuser.js # patch8 add finnish and swedish translations
client-admin/src/components/landers/password-reset.js # patch8 add finnish and swedish translations
client-admin/src/components/landers/password-reset-init.js # patch8 add finnish and swedish translations
client-admin/src/components/landers/password-reset-init-done.js # patch8 add finnish and swedish translations
client-admin/src/components/landers/signout.js # patch8 add finnish and swedish translations and patch9 redirect to /signin instead of /home after sign out
client-admin/src/components/conversations-and-account/account.js # patch8 add finnish and swedish translations
client-admin/src/components/conversations-and-account/conversation.js # patch8 add finnish and swedish translations
client-admin/src/components/conversations-and-account/conversations.js # patch8 add finnish and swedish translations
client-admin/src/components/conversations-and-account/integrate.js # patch8 add finnish and swedish translations
client-admin/src/components/conversation-admin/report/reports-list.js # patch8 add finnish and swedish translations
client-admin/src/components/conversation-admin/index.js # patch8 add finnish and swedish translations
client-admin/src/components/conversation-admin/seed-comment.js # patch8 add finnish and swedish translations
client-admin/src/components/conversation-admin/share-and-embed.js # patch8 add finnish and swedish translations
client-admin/src/components/conversation-admin/comment-moderation/comment.js # patch8 add finnish and swedish translations
client-admin/src/components/conversation-admin/comment-moderation/index.js # patch8 add finnish and swedish translations
client-admin/src/components/conversation-admin/comment-moderation/moderate-comments-accepted.js # patch8 add finnish and swedish translations
client-admin/src/components/conversation-admin/comment-moderation/moderate-comments-rejected.js # patch8 add finnish and swedish translations
client-admin/src/components/conversation-admin/comment-moderation/moderate-comments-todo.js # patch8 add finnish and swedish translations AND patch10 change amount of unmoderated comments visible in admin moderate page
client-admin/src/components/conversation-admin/stats/index.js # patch8 add finnish and swedish translations
client-admin/src/components/conversation-admin/stats/commenters.js # patch8 add finnish and swedish translations
client-admin/src/components/conversation-admin/stats/conversation-stats-number-cards.js # patch8 add finnish and swedish translations
client-admin/src/components/conversation-admin/stats/voters.js # patch8 add finnish and swedish translations
)
