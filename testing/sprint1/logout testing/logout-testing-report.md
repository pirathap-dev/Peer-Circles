# Logout Feature Testing Report

## 1. Test Information

| Item | Details |
|---|---|
| Project | Peer Circles |
| Sprint | Sprint 1 |
| User Story | Logout |
| Test Type | Frontend / Backend / Integration Testing |
| Tester | Hamsiga |
| Test Environment | Local Development Environment |
| Overall Status | PASS |

## 2. User Story

**As a logged-in user, I want to log out of my account so that I can securely end my session.**

## 3. Testing Objective

The objective of this testing is to verify that the Logout feature works correctly across the frontend, backend/authentication layer, and complete application integration.

The testing verifies that:

- The Logout option is available to authenticated users.
- A user can successfully log out.
- The authentication state/session is cleared correctly.
- The user is redirected appropriately after logout.
- Protected pages cannot be accessed after logout.
- Logout handles authentication/session data correctly.
- The application provides appropriate behaviour when logout is attempted without an active session.

# 4. Frontend / UI Testing

| ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-LOGOUT-UI-001 | Logout option is displayed for logged-in user | Logout option is visible to authenticated users | Logout option displayed correctly | PASS |
| TC-LOGOUT-UI-002 | Click Logout | Logout action is triggered | Logout action triggered successfully | PASS |
| TC-LOGOUT-UI-003 | Logout feedback/navigation | User is redirected or shown the expected logged-out state | Expected logout navigation/state displayed | PASS |
| TC-LOGOUT-UI-004 | Authentication UI after logout | Login option/state is displayed after logout | Logged-out UI displayed correctly | PASS |
| TC-LOGOUT-UI-005 | Protected page after logout | User cannot continue using protected content | Protected access was blocked correctly | PASS |
| TC-LOGOUT-UI-006 | Refresh after logout | Logged-out state remains after refresh | Logged-out state remained correctly | PASS |

# 5. Backend / Authentication Testing

| ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-LOGOUT-BE-001 | Successful logout request | Logout/authentication state is cleared correctly | Authentication state cleared successfully | PASS |
| TC-LOGOUT-BE-002 | Authentication data handling | Authentication credentials/session data are handled according to implementation | Authentication data handled correctly | PASS |
| TC-LOGOUT-BE-003 | Access after logout | Authenticated-only request is rejected after logout where applicable | Unauthenticated access was rejected correctly | PASS |
| TC-LOGOUT-BE-004 | Logout without active session | Request is handled safely without unauthorized access | Request handled correctly | PASS |
| TC-LOGOUT-BE-005 | Logout error handling | Backend handles logout errors without crashing | Logout errors handled appropriately | PASS |

# 6. Integration Testing

| ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-LOGOUT-INT-001 | Complete logout flow | Frontend, authentication layer, and backend work together correctly | Complete logout flow worked successfully | PASS |
| TC-LOGOUT-INT-002 | Frontend to logout mechanism | Frontend correctly triggers the logout mechanism | Logout mechanism triggered successfully | PASS |
| TC-LOGOUT-INT-003 | Authentication state after logout | User becomes unauthenticated | User became unauthenticated correctly | PASS |
| TC-LOGOUT-INT-004 | Protected route access after logout | Protected routes are inaccessible | Protected routes were inaccessible | PASS |
| TC-LOGOUT-INT-005 | Browser refresh after logout | Logout state persists after refresh | Logout state persisted correctly | PASS |
| TC-LOGOUT-INT-006 | Re-login after logout | User can log in again using valid credentials | User was able to log in again successfully | PASS |

# 7. Test Summary

| Testing Area | Total Test Cases | Passed | Failed | Overall Result |
|---|---:|---:|---:|---|
| Frontend / UI | 6 | 6 | 0 | PASS |
| Backend / Authentication | 5 | 5 | 0 | PASS |
| Integration | 6 | 6 | 0 | PASS |
| **Total** | **17** | **17** | **0** | **PASS** |

# 8. Defect Summary

| Metric | Result |
|---|---:|
| Total Test Cases | 17 |
| Passed | 17 |
| Failed | 0 |
| Blocked | 0 |
| Defects Found | 0 |

# 9. Overall Result

**PASS**

All planned Logout feature test cases passed successfully. The Logout functionality was verified at the frontend/UI, backend/authentication, and integration levels.

The feature correctly ends the authenticated user's session/state, prevents unauthorized access to protected functionality after logout, and allows the user to authenticate again when valid credentials are provided.

# 10. Conclusion

Based on the executed test cases, the Peer Circles Logout feature is functioning as expected and satisfies the tested Logout requirements.

**Testing Status: PASS**

**Tested By: Hamsiga**
