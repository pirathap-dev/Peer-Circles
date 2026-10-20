# Sprint 4 Review

## Date
07/10/2026

## Participants
- Varshan (Product Owner / Frontend & UI Development)
- Avishka M G D (Scrum Master / Backend & API Development)
- S.K.Hamsiga (QA & Testing)
- S Pirathap (Database & Integration)

## Sprint Goal
The goal of Sprint 4 was to enrich the Peer Circles mobile application with supportive community extensions and complete group lifecycle management. This entailed delivering an educational resources hub for mental wellness materials, an event directory for upcoming peer workshops and support sessions, an in-app notification center for engagement alerts, and the functionality for members to leave support groups gracefully.

## Completed Stories
- PC-16 (US-15) — Access Educational Resources (3 Story Points)
- PC-17 (US-16) — View Relevant Events (3 Story Points)
- PC-18 (US-17) — Receive Notifications (5 Story Points)
- PC-19 (US-18) — Leave a Support Group (2 Story Points)

**Total Planned & Completed:** 4 user stories — 13 story points.

## Incomplete Stories
- None (100% of planned user stories and story points completed)

## Demonstration

The team conducted a comprehensive demonstration of all Sprint 4 features, as well as an end-to-end regression demonstration of the entire application:

1. **Accessing Educational Resources (PC-16):**
   - Navigating to the Educational Resources catalog.
   - Filtering articles, guides, and mental wellness materials by categories (e.g., Anxiety Management, Coping Mechanisms, Crisis Resources).
   - Viewing detailed resource articles with rich content formatting, author credits, and external resource links.
2. **Viewing Relevant Events (PC-17):**
   - Accessing the Events screen displaying upcoming peer-support workshops, group meetings, and webinars.
   - Inspecting event cards with date, time, host details, and virtual meeting links.
   - Filtering events by category and viewing detailed event descriptions.
3. **Receiving In-App Notifications (PC-18):**
   - Demonstrating triggered notifications when another user comments on a post, replies to a discussion, or sends a private message.
   - Displaying the notification badge count in the app header.
   - Navigating to the Notification Center, viewing notification items with relative timestamps, marking individual notifications as read, and using "Mark all as read".
4. **Leaving a Support Group (PC-19):**
   - Navigating to a joined group's profile and clicking "Leave Group".
   - Confirming the action via a modal confirmation dialog.
   - Verifying database membership removal, decrementing the group's total member count, and updating the UI state back to non-member with "Join Group" option restored.
5. **Full System End-to-End Regression Walkthrough:**
   - Demonstrating the complete user journey: registration/login (Sprint 1), group browsing, joining, and discussion participation (Sprint 2), anonymous posting and private messaging (Sprint 3), alongside resources, events, notifications, and group exit (Sprint 4).

## Feedback
- Stakeholders noted that Educational Resources and Events transform Peer Circles from a simple discussion forum into a comprehensive, holistic support ecosystem.
- The Notification Center successfully provides the critical feedback loops needed for continuous user engagement.
- The "Leave Group" flow was validated for clean edge-case handling (user's past posts and comments remain intact while membership access is revoked).
- UI responsiveness, theme consistency, and error handling across all modules were commended.
- The Product Owner formally verified all acceptance criteria and accepted all Sprint 4 deliverables.

## Decisions
- All 4 Sprint 4 user stories (PC-16 through PC-19) totaling 13 story points are officially accepted as Done according to the Definition of Done.
- The entire Product Backlog across Sprints 0, 1, 2, 3, and 4 is now 100% complete.
- Feature development is frozen; the team will transition to final submission preparation, repository polish, and demonstration rehearsals for the academic presentation and viva.

## Action Items
- Perform the final code merge into the `main` branch and create a release tag (`v1.0.0-release`).
- Verify that all sprint documentation, architecture documents, and test evidence files across `docs/` and `testing/` are committed and synchronized.
- Consolidate final regression testing documentation and performance metrics.
- Prepare the final project presentation slides, system demonstration video, and viva defense documentation.
