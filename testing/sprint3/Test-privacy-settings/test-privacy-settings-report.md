# Sprint 3 — Privacy Settings Test Report

## 1. Test Information

| Field | Details |
|---|---|
| Project | Peer Circles |
| Sprint | Sprint 3 |
| Feature | Privacy Settings |
| User Story | Manage Privacy Preferences |
| Test Type | Manual Functional, Validation, Security, Integration, and Regression Testing |
| Environment | To be recorded at execution |
| Tester | To be assigned |
| Test Status | NOT RUN — report prepared for execution |
| Overall Result | NOT RUN |

## 2. Description and Test Objective

Test the privacy settings functionality. Verify that authenticated users can view their current privacy preferences, change each available preference, save changes, and see the saved values after returning to the screen or signing in again. Verify that settings affect the relevant application behavior, that users cannot view or change another user's settings, and that validation, errors, and unauthorized access are handled safely. Run regression checks on related messaging, profile, and authentication functionality. Record, fix, and retest any defects found.

This report is a test plan and execution record. Cases are marked **Not Run** until executed; no pass/fail result is claimed in advance.

## 3. Feature Details Under Test

The current Privacy Settings screen exposes these preferences:

| Preference | Meaning shown in the application | Expected behavior to verify |
|---|---|---|
| Allow Private Messages (`allow_private_messages`) | Let other members send direct messages | When disabled, another user should be prevented from starting/sending a private message to this user, with appropriate feedback. |
| Show Online Status (`show_online_status`) | Let others see when you are active | Verify the user's active/online indicator is hidden when disabled and visible when enabled, wherever presence is displayed. |
| Private Profile (`make_profile_private`) | Hide profile details from non-members | Verify profile details are restricted from non-members and available according to membership/access rules when enabled. |

## 4. Preconditions and Test Data

1. Frontend, backend, and database are running in the designated test environment.
2. The Sprint 3 privacy settings implementation is deployed.
3. Prepare separate authenticated accounts: **User A** (settings owner), **User B** (non-member/other user), and **User C** (group/community member where needed).
4. Store credentials and authentication tokens separately; do not use real user accounts or private data.
5. A relevant group/community and, for the messaging preference, messaging feature are available for behavior checks.
6. At execution, record build/version, browser/device, environment, date, and tester.

## 5. Test Scenarios and Results

### 5.1 View Settings and Update Each Preference

| ID | Test Scenario and Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-PS-001 | Sign in as User A, open Profile, then open Privacy Settings. | Settings page loads and shows the three available preferences and their current saved values. | — | Not Run |
| TC-PS-002 | Change only Allow Private Messages, save, and reopen the screen. | Change saves successfully and the selected value is displayed after reopening. | — | Not Run |
| TC-PS-003 | Change only Show Online Status, save, and reopen the screen. | Change saves successfully and the selected value is displayed after reopening. | — | Not Run |
| TC-PS-004 | Change only Private Profile, save, and reopen the screen. | Change saves successfully and the selected value is displayed after reopening. | — | Not Run |
| TC-PS-005 | Change all three preferences, save, then log out and sign back in as User A. | All saved values persist and are loaded correctly. | — | Not Run |
| TC-PS-006 | Toggle a preference, navigate away without saving, and reopen Privacy Settings. | Unsaved change is not persisted; previously saved value is shown. | — | Not Run |

### 5.2 Preference Behavior

| ID | Test Scenario and Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-PS-007 | As User A, disable Allow Private Messages; as User B, try to start a conversation with A. | Request is refused and B receives clear feedback; no unauthorized conversation/message is created. | — | Not Run |
| TC-PS-008 | Enable Allow Private Messages and retry the same conversation action as User B. | User B can start a conversation, subject to other messaging access rules. | — | Not Run |
| TC-PS-009 | As User A, disable Show Online Status; view presence as User B/C wherever online status is shown. | User A's online/active status is not exposed to other users. | — | Not Run |
| TC-PS-010 | Enable Show Online Status and view presence as another user. | Presence is shown according to the product's documented behavior. | — | Not Run |
| TC-PS-011 | As User A, enable Private Profile; view A's profile as non-member User B and eligible member User C. | Profile details are hidden from non-members and exposed only as allowed by the access rules. | — | Not Run |
| TC-PS-012 | Disable Private Profile and view A's profile as User B. | Profile visibility returns to the documented public/member behavior without exposing fields that should remain protected. | — | Not Run |

### 5.3 Validation, Error Handling, and Security

| ID | Test Scenario and Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-PS-013 | Send a settings update with one boolean field missing. | API rejects the incomplete request with a validation response; no partial/incorrect update is stored. | — | Not Run |
| TC-PS-014 | Send a settings update with a string, number, or null in place of a boolean. | API rejects invalid types and leaves the saved settings unchanged. | — | Not Run |
| TC-PS-015 | Submit an unauthenticated GET request for privacy settings. | Request is rejected; no settings are returned. | — | Not Run |
| TC-PS-016 | Submit an unauthenticated PATCH request to update settings. | Request is rejected; no settings are changed. | — | Not Run |
| TC-PS-017 | Sign in as User B and attempt to retrieve or update User A's settings by changing user IDs/request data. | Access is denied or server safely ignores supplied identity; User A's settings remain unchanged and undisclosed. | — | Not Run |
| TC-PS-018 | Use an invalid or expired token to retrieve/update settings. | Request is rejected and no settings are disclosed or changed. | — | Not Run |
| TC-PS-019 | Simulate backend/database failure while loading and saving settings. | UI displays a useful error, remains usable, and does not show failed changes as saved. | — | Not Run |
| TC-PS-020 | Rapidly toggle preferences and submit once; observe loading/saving controls and result. | Duplicate or conflicting submissions are prevented/handled; displayed values match the persisted response. | — | Not Run |

### 5.4 Integration and Regression

| ID | Test Scenario and Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-PS-021 | Inspect authenticated GET `/auth/privacy` and PATCH `/auth/privacy` requests while viewing/updating settings. | UI sends/receives the expected three preference values; response matches saved state. | — | Not Run |
| TC-PS-022 | Save settings, then verify the current user's database record and reload settings. | Only User A's three preference fields are updated; returned values match stored values. | — | Not Run |
| TC-PS-023 | Change Allow Private Messages and test starting a conversation as another account. | Messaging behavior follows the recipient's saved preference. | — | Not Run |
| TC-PS-024 | Change Private Profile and view profile access as member and non-member accounts. | Profile access follows the saved privacy preference and membership rules. | — | Not Run |
| TC-PS-025 | Log in/out and view/update the signed-in user's own profile. | Existing authentication and profile flows remain functional; users still see only their own editable settings. | — | Not Run |
| TC-PS-026 | Browse groups and use group membership, discussions, and comments. | Existing Sprint 2 features continue to work; privacy changes do not break unrelated group functionality. | — | Not Run |

## 6. Integration Flow

```text
User signs in
  → Opens Profile → Privacy Settings
  → Frontend requests current settings with authentication
  → Backend identifies the signed-in user and returns saved values
  → User changes one or more preferences and saves
  → Backend validates all values and updates the signed-in user's record
  → Frontend displays success or a useful error
  → Relevant messaging, presence, and profile behavior follows saved preferences
```

## 7. Defect Reporting and Verification

For each failure, record a defect ID, related case, build/environment, affected account role, reproduction steps, expected and actual results, severity, priority, and sanitized evidence. Do not include real users' profile data, passwords, or authentication tokens. After a fix, rerun the failed case and the related access-control, persistence, and regression cases. Record the retest result and close the defect only after verification.

## 8. Execution Summary

| Metric | Result |
|---|---:|
| Total Test Cases | 26 |
| Passed | 0 |
| Failed | 0 |
| Blocked | 0 |
| Not Run | 26 |
| Defects Opened | 0 (execution pending) |
| Overall Result | NOT RUN |

## 9. Implementation Review Notes

Repository review found a Privacy Settings screen and authenticated GET/PATCH `/auth/privacy` endpoints. The screen currently exposes the three boolean preferences listed above. The backend checks `allow_private_messages` when starting a conversation, and profile privacy is used when resolving a conversation participant. During code review, no consumer of `show_online_status` was found outside privacy settings persistence; verify the online-status behavior requirement and record a defect if the UI feature is expected to affect presence but does not.

These are implementation review observations, not results from executed test cases.

## 10. Conclusion and Sign-Off

**Current result: NOT RUN.** Execute the cases in the designated environment and replace the placeholders with observed results and evidence before approving the feature.

| Role | Name | Status |
|---|---|---|
| Tester | To be assigned | Pending execution |
| Development Team | Peer Circles Team | Pending review |
| Overall Test Status | — | NOT RUN |
