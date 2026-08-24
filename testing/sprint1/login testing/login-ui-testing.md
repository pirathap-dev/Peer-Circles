# Login UI Testing Report

## Test Information

| Item | Details |
|---|---|
| Project | Peer Circles |
| Sprint | Sprint 1 |
| User Story | Login |
| Test Type | Frontend / UI Testing |
| Tester | QA Team Member |
| Environment | Local Development |
| Browser | Google Chrome |
| Overall Result | PASS |

## User Story

**As a registered user, I want to log into my account so that I can access Peer Circles.**

## Testing Objective

Verify that the Login user interface works correctly for valid input, invalid input, validation, error handling, and successful authentication.

## Test Cases

| ID | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-LOGIN-UI-001 | Login page loads | Login page displays correctly | Login page displayed correctly | PASS |
| TC-LOGIN-UI-002 | Login form elements | Email, password and Login button are displayed | All required elements displayed correctly | PASS |
| TC-LOGIN-UI-003 | Valid email | Valid email is accepted | Valid email accepted | PASS |
| TC-LOGIN-UI-004 | Valid password | Password is accepted and masked | Password accepted and masked correctly | PASS |
| TC-LOGIN-UI-005 | Empty email | Validation message is displayed | Email validation displayed correctly | PASS |
| TC-LOGIN-UI-006 | Empty password | Validation message is displayed | Password validation displayed correctly | PASS |
| TC-LOGIN-UI-007 | Invalid email format | Invalid email is rejected | Invalid email rejected correctly | PASS |
| TC-LOGIN-UI-008 | Incorrect password | Login fails with appropriate error | Incorrect password rejected correctly | PASS |
| TC-LOGIN-UI-009 | Successful login | User is authenticated and redirected appropriately | Login successful and user redirected appropriately | PASS |
| TC-LOGIN-UI-010 | Login button | Login request is submitted | Login request submitted correctly | PASS |
| TC-LOGIN-UI-011 | Password visibility | Password visibility works correctly | Password visibility worked correctly | PASS |
| TC-LOGIN-UI-012 | Error message display | Appropriate error is shown without crashing | Error displayed correctly | PASS |

## Summary

- Total Test Cases: **12**
- Passed: **12**
- Failed: **0**
- Blocked: **0**
- Overall Result: **PASS**

## Conclusion

All Login UI test cases passed successfully. The Login interface, input validation, error handling, and successful Login flow behaved as expected.
