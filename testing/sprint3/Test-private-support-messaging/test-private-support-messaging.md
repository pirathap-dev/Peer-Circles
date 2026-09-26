# test-Private Support Messaging Testing Report

## 1. Test Information

| Item | Details |
|---|---|
| Project | Peer Circles |
| Sprint | Sprint 3 |
| User Story | Private Support Messaging |
| Test Type | Functional, Security, Integration, and Regression Testing |
| Test Environment | To be recorded at execution |
| Tester | To be assigned |
| Overall Status | NOT RUN — report prepared for execution |

## 2. User Story

**As an authenticated Peer Circles user, I want to send private messages to another user so that we can communicate confidentially outside public group discussions.**

## 3. Testing Objective and Description

Verify the private messaging workflow from choosing a recipient and composing a message through sending, receiving, displaying, storing, and retrieving the conversation. Confirm input validation, correct sender and recipient attribution, conversation separation, authentication, and authorization. Verify that only the conversation participants can view its messages, including when requests are made directly to the API. Check frontend, backend, and database integration, error handling, and regression of existing Sprint 1 and Sprint 2 features.

This file is a prepared test report and execution record. Test cases remain **Not Run** until executed. Record actual results and evidence after testing; do not report planned cases as passed.

## 4. Sprint 1 and Sprint 2 Review

Sprint 1 testing covered Registration, Login, Logout, and View/Update Profile. Relevant coverage to carry into Sprint 3 includes authentication state, protected access, empty and invalid inputs, data persistence, and frontend/backend/database integration.

Sprint 2 testing covered Support Group browsing, searching, details, joining, discussion posts, and comments. Relevant coverage includes correct user and group associations, invalid identifiers, API validation, error handling, and complete user workflows.

Private messaging adds conversation-level privacy to these existing patterns. Tests must check authorization for both conversation retrieval and individual message retrieval, rather than relying only on whether the UI hides another user's messages.

## 5. Scope

### In Scope

- Open or start a private conversation with an eligible user.
- Send a valid message and display it in the correct conversation.
- Receive and view messages as the intended recipient.
- Keep separate conversations and message histories correctly associated.
- Validate empty, whitespace-only, invalid, and over-limit input.
- Enforce authentication and participant-only access through UI and API.
- Persist and retrieve conversation history after refresh, navigation, and re-login.
- Check API/database integration, failure handling, and Sprint 1/2 regression.

### Confirm Before Execution

Confirm recipient eligibility, maximum message length, conversation creation rules, API contract, and whether real-time delivery, notifications, attachments, read receipts, editing, or deletion are part of the Sprint 3 acceptance criteria. Those behaviors are not assumed by this report.

## 6. Preconditions and Test Data

1. Frontend, backend, and database are running in an approved test environment with the messaging implementation deployed.
2. Three separate test accounts are available: User A (sender), User B (intended recipient), and User C (unrelated user for authorization checks).
3. Each account can authenticate independently; keep test credentials and tokens separate.
4. The supported maximum message length and recipient rules are documented.
5. Test data is disposable or uniquely identifiable and can be safely cleaned up.
6. At execution, record build/version, environment, browser/device, date, and tester.

## 7. Functional / UI Testing

| ID | Scenario and Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-PSM-F-001 | Sign in as User A; open messaging; start or open a conversation with User B. | Messaging view opens and identifies User B as the intended participant. | — | Not Run |
| TC-PSM-F-002 | As User A, enter a valid message and send it to User B. | Message is accepted once, attributed to User A, and displayed in the A–B conversation. | — | Not Run |
| TC-PSM-F-003 | Sign in as User B and open the A–B conversation. | User B sees the message with correct content, sender, and ordering. | — | Not Run |
| TC-PSM-F-004 | As User B, reply to User A; reopen the conversation as both users. | The reply appears in the same conversation for both participants. | — | Not Run |
| TC-PSM-F-005 | As User A, exchange messages separately with Users B and C; inspect both histories. | Each message appears only in its intended conversation; histories and participants do not cross over. | — | Not Run |
| TC-PSM-F-006 | Submit an empty message. | Submission is prevented or rejected with clear feedback; no message is stored. | — | Not Run |
| TC-PSM-F-007 | Submit spaces, tabs, or line breaks without other content. | Whitespace-only content is prevented or rejected; no message is stored. | — | Not Run |
| TC-PSM-F-008 | Submit a message exactly at the documented maximum length. | Input is accepted and displayed according to requirements without corruption or unintended truncation. | — | Not Run |
| TC-PSM-F-009 | Submit a message one character over the documented maximum. | Input is rejected or limited according to requirements; no over-limit message is stored. | — | Not Run |
| TC-PSM-F-010 | Submit malformed or unsupported input, including unusual encoding or unexpected data types where applicable. | Invalid input is safely rejected; the application remains usable and no unintended data is stored or rendered. | — | Not Run |

## 8. Security Testing

Run API authorization checks with distinct accounts and tokens. Use only test accounts and test messages.

| ID | Scenario and Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-PSM-S-001 | Attempt to send a message without an authentication token. | Request is denied; no message or conversation is created. | — | Not Run |
| TC-PSM-S-002 | Attempt to send with an invalid or expired token. | Request is denied; no message is stored. | — | Not Run |
| TC-PSM-S-003 | As User C, request the A–B conversation by changing its conversation ID in the UI/API request. | Access is denied; conversation details and messages are not disclosed. | — | Not Run |
| TC-PSM-S-004 | As User C, request a message by changing its message ID. | Access is denied; message content and private metadata are not disclosed. | — | Not Run |
| TC-PSM-S-005 | As User A, alter the sender or recipient identifier in the send request. | Server derives sender identity from authentication and enforces recipient rules; spoofing is rejected. | — | Not Run |
| TC-PSM-S-006 | As User A, request conversation history using another user's account ID. | Only conversations User A is authorized to access are returned. | — | Not Run |
| TC-PSM-S-007 | Send markup/script-like text and view it in the conversation as each participant. | Content is safely encoded; script does not execute and markup does not alter the application. | — | Not Run |
| TC-PSM-S-008 | Inspect unauthorized responses and application errors. | Responses do not expose private message content, credentials, tokens, or unnecessary internal details. | — | Not Run |

## 9. Integration Testing

### Integration Flow

```text
User A signs in
  → Opens or starts a conversation with User B
  → Composes and sends a message
  → Frontend sends authenticated API request
  → Backend validates input and participant authorization
  → Database stores message and conversation association
  → Backend responds
  → Sender sees the sent message
  → User B retrieves and views the same message
```

| ID | Scenario and Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-PSM-I-001 | Send a message through the UI and inspect the sanitized network request/response. | Frontend sends intended recipient and content with authentication; UI handles success or error response correctly. | — | Not Run |
| TC-PSM-I-002 | After successful send, verify the corresponding test record in the database. | Stored sender, recipient/conversation association, content, and timestamp are correct. | — | Not Run |
| TC-PSM-I-003 | Refresh, navigate away and back, then retrieve the conversation. | Persisted messages reload in the correct conversation with consistent content and ordering. | — | Not Run |
| TC-PSM-I-004 | Log out and back in as User A and User B; retrieve the conversation as each. | Both participants can retrieve the authorized history and see consistent messages. | — | Not Run |
| TC-PSM-I-005 | Make messaging API or database unavailable during send/retrieval, then restore it. | UI reports failure clearly, does not claim an unsaved message was delivered, and recovers after service returns. | — | Not Run |

## 10. Regression Testing

| ID | Scenario and Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-PSM-R-001 | Register, log in, log out, and view/update the signed-in user's profile. | Sprint 1 account and profile flows still work; protected profile access remains enforced. | — | Not Run |
| TC-PSM-R-002 | Browse/search groups, view group details, and join or leave a group as supported. | Sprint 2 Support Group flows still work. | — | Not Run |
| TC-PSM-R-003 | View discussions and create/comment on a post as an authorized user. | Discussion flows still work; private messages do not appear in public discussions. | — | Not Run |

## 11. Defect Reporting and Verification

For each failure, create a defect record with:

- Defect ID and concise title, related test case ID, build, environment, and affected roles.
- Reproduction steps using sanitized test data.
- Expected and actual results, severity, priority, and affected screen or endpoint if known.
- Evidence reference and retest result after a fix.

For security defects, use the smallest safe reproduction and limit access to evidence. Do not include real users' private messages, passwords, or access tokens. Retest the failing case and the relevant allowed-participant and unrelated-user authorization cases after a fix.

## 12. Test Execution Summary

| Metric | Result |
|---|---:|
| Total Test Cases | 26 |
| Passed | 0 |
| Failed | 0 |
| Blocked | 0 |
| Not Run | 26 |
| Defects Opened | 0 (none recorded; execution pending) |
| Overall Result | NOT RUN |

## 13. Readiness Notes and Conclusion

Repository review found no private messaging screen or messaging API route. The current database schema has a notifications table with a message text field, but no private conversation/message tables or relationships. This is a feature readiness gap, not an executed test failure. Execute this report when the feature and its acceptance criteria are available, and revise cases to match the agreed behavior.

**Current conclusion: NOT RUN.** No pass/fail conclusion or defect count can be made until execution evidence is recorded.

## 14. Sign-Off (Complete After Execution)

| Role | Name | Status |
|---|---|---|
| Tester | To be assigned | Pending |
| Development Team | Peer Circles Team | Pending Review |
| Overall Testing Status | — | NOT RUN |
