# Sprint 3 Review

## Date
28/09/2026

## Participants
- Avishka M G D (Product Owner / Backend & API Development)
- Varshan (Scrum Master / Frontend & UI Development)
- S.K.Hamsiga (QA & Testing)
- S Pirathap (Database & Integration)

## Sprint Goal
The goal of Sprint 3 was to implement essential privacy, safety, and peer-to-peer communication capabilities for Peer Circles. This included allowing users to participate anonymously in group discussions, enabling secure private 1-on-1 support messaging between peers, and providing comprehensive privacy controls for profile visibility and communication permissions.

## Completed Stories
- US-12 — Participate Anonymously (5 Story Points)
- US-13 — Send Private Support Messages (5 Story Points)
- US-14 — Manage Privacy Settings (5 Story Points)

**Total Planned & Completed:** 3 user stories — 15 story points.

## Incomplete Stories
- None (100% of planned user stories and story points completed)

## Demonstration

The team demonstrated all completed Sprint 3 functionality:

1. **Anonymous Participation in Discussions (US-12):**
   - Toggling the "Post Anonymously" switch when creating a new discussion post.
   - Verifying that the post displays an anonymous moniker (e.g., "Anonymous Peer") and a default masked avatar across group feeds.
   - Submitting anonymous comments on existing posts, ensuring that author identity is hidden from other group members while maintaining server-side integrity.
2. **Private Support Messaging (US-13):**
   - Navigating to the Messages section and viewing existing conversation threads with peer members.
   - Initiating a new 1-on-1 private support conversation with a group member.
   - Sending and receiving text messages in real time within the active chat thread, with accurate timestamps and delivery status.
3. **Managing Privacy Settings (US-14):**
   - Accessing the Privacy Settings screen from the user profile.
   - Configuring profile visibility toggles (e.g., Public, Group Members Only, Hidden).
   - Managing direct messaging permissions (e.g., Allow from Members, Nobody).
   - Toggling default anonymous participation preferences and verifying that changes persist across user sessions.
4. **End-to-End Privacy & Integration Enforcement:**
   - Demonstrating that backend APIs enforce privacy configurations, preventing direct messages when privacy rules disallow them.
   - Verifying that sensitive user identifiers are stripped from API responses when anonymous mode is active.

## Feedback
- The anonymous posting and commenting mechanism was highly praised as a crucial feature for mental health peer support, ensuring psychological safety.
- The 1-on-1 private messaging interface is clean, responsive, and easy to navigate.
- The privacy configuration panel provides clear and granular control over user data and visibility.
- Suggested that introducing notifications for incoming messages and replies would be an ideal addition in Sprint 4 to complement the messaging experience.
- The Product Owner confirmed that all acceptance criteria have been satisfied and officially accepted the increment.

## Decisions
- All 3 user stories (US-12, US-13, US-14) totaling 15 story points are accepted as Done according to the Definition of Done.
- Anonymity masking logic is enforced strictly on the backend to prevent client-side inspection or data leaks.
- Proceed to Sprint 4 to implement Educational Resources, Events, Notifications, and Leaving a Support Group.

## Action Items
- Merge the Sprint 3 integration branch into the main development branch.
- Finalize and archive all Sprint 3 test reports in `testing/sprint3`.
- Update Jira to mark all Sprint 3 user stories and tasks as Closed.
- Conduct Sprint 4 Planning and backlog refinement for educational resources, events, notifications, and group exit functionality.
- Begin Sprint 4 implementation.
