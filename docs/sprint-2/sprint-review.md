# Sprint 2 Review

## Date
30/08/2026

## Participants
- S.K.Hamsiga (Product Owner / QA & Testing)
- S Pirathap (Scrum Master / Database & Integration)
- Avishka M G D (Backend & API Development)
- Varshan (Frontend & UI Development)

## Sprint Goal
The goal of Sprint 2 was to enable users to discover, explore, and actively participate in peer-support communities within the Peer Circles application. This encompassed browsing and searching support groups, viewing comprehensive group details, joining support groups, viewing group discussion feeds, creating new discussion posts, and commenting on existing posts.

## Completed Stories
- US-05 — Browse Support Groups (3 Story Points)
- US-06 — Search Support Groups (3 Story Points)
- US-07 — View Support Group Details (3 Story Points)
- US-08 — Join a Support Group (3 Story Points)
- US-09 — View Group Discussions (3 Story Points)
- US-10 — Create a Discussion Post (5 Story Points)
- US-11 — Comment on Discussion Posts (3 Story Points)

**Total Planned & Completed:** 7 user stories — 23 story points.

## Incomplete Stories
- None (100% of planned user stories and story points completed)

## Demonstration

The team conducted a live demonstration of all completed Sprint 2 functionality, including:

1. **Browsing Support Groups (US-05):** Navigating through the support groups directory, viewing curated group cards with category tags, member counts, and short descriptions.
2. **Searching Support Groups (US-06):** Performing real-time search queries by group title, description keywords, and category filters to locate specific peer communities.
3. **Viewing Support Group Details (US-07):** Accessing comprehensive group profiles displaying group rules, descriptions, moderator information, member statistics, and membership status.
4. **Joining a Support Group (US-08):** Selecting the "Join Group" action, verifying immediate membership registration in the database, and observing UI state transition from visitor to active member.
5. **Viewing Group Discussions (US-09):** Opening a joined group's discussion forum to view threaded posts, post authors, timestamps, and comment counters.
6. **Creating a Discussion Post (US-10):** Authoring and publishing a new discussion post with title and content validation, and seeing it appear at the top of the group feed.
7. **Commenting on Discussion Posts (US-11):** Writing and submitting comments on existing discussion posts, with instant feed updates and comment count increments.
8. **End-to-End System Integration:** Demonstrating seamless interaction between the React Native mobile UI, Express.js REST APIs, and MySQL relational tables (`groups`, `group_members`, `discussions`, `comments`).

## Feedback
- The browsing and search features were reviewed and commended for rapid response times and intuitive UI layout.
- The join group transition works reliably and enforces access control appropriately.
- The discussion board and commenting flows are smooth, with robust client-side and server-side validation against empty submissions.
- Stakeholders noted that introducing privacy controls and anonymous participation options would further encourage users to share sensitive experiences comfortably (validating Sprint 3 priorities).
- All functional and non-functional acceptance criteria were met, and the completed increment was accepted by the Product Owner.

## Decisions
- All 7 Sprint 2 user stories (US-05 through US-11) totaling 23 story points are officially accepted as Done according to the Definition of Done.
- Non-members are permitted to browse groups and view basic group information, while posting and commenting are strictly restricted to joined members.
- The team will proceed with the planned Sprint 3 backlog focusing on Privacy, Safety & Messaging.

## Action Items
- Merge Sprint 2 feature and integration branches into the main branch.
- Ensure all Sprint 2 QA test reports and execution logs are archived in `testing/sprint2`.
- Update Jira to mark all Sprint 2 user stories, tasks, and subtasks as Closed/Done.
- Conduct Sprint 3 Planning to finalize user story estimates and allocate tasks for Privacy, Safety & Messaging.
- Begin development of Sprint 3 user stories (US-12, US-13, US-14).
