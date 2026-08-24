# Login Backend API Testing Report

## Test Information

| Item | Details |
|---|---|
| Project | Peer Circles |
| Sprint | Sprint 1 |
| User Story | Login |
| Test Type | Backend / API Testing |
| Tester | QA Team Member |
| Environment | Local Development |
| API Tool | Postman / Apidog |
| Overall Result | PASS |

## User Story

**As a registered user, I want to log into my account so that I can access Peer Circles.**

## Testing Objective

Verify that the Login backend API correctly authenticates registered users and handles invalid requests, credentials, database interaction, and authentication responses.

## API Under Test

```text
POST /api/auth/login
```

## Test Cases

| ID | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-LOGIN-BE-001 | Successful Login | Registered user is authenticated | User authenticated successfully | PASS |
| TC-LOGIN-BE-002 | Non-existent user | Authentication is rejected | Non-existent user rejected correctly | PASS |
| TC-LOGIN-BE-003 | Incorrect password | Authentication fails | Incorrect password rejected correctly | PASS |
| TC-LOGIN-BE-004 | Missing email | Request is rejected | Request rejected correctly | PASS |
| TC-LOGIN-BE-005 | Missing password | Request is rejected | Request rejected correctly | PASS |
| TC-LOGIN-BE-006 | Empty request body | Validation error is returned | Empty request rejected correctly | PASS |
| TC-LOGIN-BE-007 | Invalid email format | Invalid email is rejected | Invalid email rejected correctly | PASS |
| TC-LOGIN-BE-008 | Authentication response | Correct authentication response is returned | Response returned correctly | PASS |
| TC-LOGIN-BE-009 | Password security | Password is securely verified | Password security worked correctly | PASS |
| TC-LOGIN-BE-010 | Invalid credentials response | Appropriate error/status is returned | Invalid credentials handled correctly | PASS |
| TC-LOGIN-BE-011 | Database user lookup | Correct user is retrieved | User retrieved correctly | PASS |
| TC-LOGIN-BE-012 | Database unavailable | Error is handled without crashing | Database failure handled appropriately | PASS |

## Summary

- Total Test Cases: **12**
- Passed: **12**
- Failed: **0**
- Blocked: **0**
- Overall Result: **PASS**

## Conclusion

All Login backend API test cases passed successfully. Authentication, validation, database interaction, password verification, responses, and error handling worked as expected.
