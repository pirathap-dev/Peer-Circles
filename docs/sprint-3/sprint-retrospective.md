# Sprint 3 Retrospective

## Date
28/09/2026

## Participants
- Avishka M G D (Product Owner / Backend & API Development)
- Varshan (Scrum Master / Frontend & UI Development)
- S.K.Hamsiga (QA & Testing)
- S Pirathap (Database & Integration)

## What Went Well?
- Successfully delivered all 3 planned Sprint 3 user stories (15 story points), completing complex privacy and messaging modules on time.
- Right-sizing the sprint to 15 story points established a sustainable pace and allowed deeper architectural focus on privacy and data security.
- The Scrum role rotation (Dilan as Product Owner, Varshan as Scrum Master) functioned smoothly, broadening team ownership and leadership.
- Solid technical design: privacy settings and anonymity masking were centralized within backend middleware and services, avoiding duplicated logic.
- Comprehensive QA testing covered both positive and negative validation paths (e.g., verifying that privacy restrictions block unauthorized message creation).
- Daily standups facilitated by the new Scrum Master kept blockers visible and quickly resolved.
- Clean database migrations created for private conversations, messages, and privacy settings tables.

## What Didn't Go Well?
- Initial API payloads accidentally exposed user IDs in nested comment objects when anonymous mode was active; this required emergency backend response sanitization and re-testing.
- Optimistic UI updates for new chat messages occasionally showed out-of-order timestamps before server acknowledgment was received.
- Merge conflicts occurred during the integration of message routes with existing user controller middleware, requiring extra code review time.
- Simulating multi-user real-time message exchange required manual session switching during local development and testing.

## What Will We Improve in Sprint 4?
- Establish strict DTO (Data Transfer Object) response filters early in the design stage to guarantee sensitive user data cannot leak through API responses.
- Implement structured automated integration test scripts to test multi-user scenarios more efficiently.
- Plan code merges and integration milestones at least 2 days before the sprint review to allow adequate time for comprehensive regression testing.
- Maintain versioned database migration scripts to eliminate schema discrepancies across team developer environments.
- Prepare documentation concurrently with code integration to prevent documentation crunch at sprint close.

## Retrospective Conclusion
Sprint 3 successfully tackled some of the most sensitive and technically demanding features of Peer Circles: anonymous participation, private messaging, and user privacy configuration. By recalibrating our story point commitment to 15 points, the team produced higher quality code and achieved thorough test coverage.

With core community interactions, discussions, and privacy foundations fully in place, the team is well-prepared to execute Sprint 4, delivering educational resources, events, notifications, and group exit management to complete the application.
