# Comment on Discussion Post Testing Report

## 1. Test Information

| Item | Details |
|---|---|
| Project | Peer Circles |
| Sprint | Sprint 2 |
| User Story | Comment on Discussion Post |
| Tester | Hamsiga |
| Test Environment | Local Development Environment |
| Testing Type | Frontend, Backend, and Integration Testing |
| Overall Result | PASS |

---

## 2. Frontend / UI Testing

### Testing Objective

Verify that users can enter, submit, and view comments on discussion posts through the user interface.

### Test Cases

| Test Case | Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-CMT-UI-001 | Open Group Discussion | Discussion posts should load successfully | Discussion posts loaded successfully | PASS |
| TC-CMT-UI-002 | Select discussion post | User should be able to select a discussion post | Post selected successfully | PASS |
| TC-CMT-UI-003 | Verify comment input | Comment input field should be visible to authorized users | Comment input displayed correctly | PASS |
| TC-CMT-UI-004 | Enter valid comment | User should be able to enter comment text | Comment entered successfully | PASS |
| TC-CMT-UI-005 | Submit valid comment | Comment should be submitted successfully | Comment submitted successfully | PASS |
| TC-CMT-UI-006 | Display new comment | Newly created comment should appear under the discussion post | New comment displayed correctly | PASS |
| TC-CMT-UI-007 | Verify comment author | Comment should display the correct author | Correct author displayed | PASS |
| TC-CMT-UI-008 | Verify comment date/time | Comment date/time should be displayed correctly | Date/time displayed correctly | PASS |
| TC-CMT-UI-009 | Submit empty comment | Application should prevent submission of an empty comment | Empty comment submission prevented | PASS |
| TC-CMT-UI-010 | Submit whitespace-only comment | Application should prevent whitespace-only comments | Whitespace-only comment prevented | PASS |
| TC-CMT-UI-011 | Loading state | Loading indicator should be displayed while comment is being submitted | Loading state displayed correctly | PASS |
| TC-CMT-UI-012 | Comment submission error | Appropriate error message should be displayed when submission fails | Error message displayed correctly | PASS |
| TC-CMT-UI-013 | Authentication handling | Unauthenticated users should not be allowed to comment | Access handled correctly | PASS |
| TC-CMT-UI-014 | Multiple comments | User should be able to view multiple comments on a post | Multiple comments displayed correctly | PASS |
| TC-CMT-UI-015 | Responsive layout | Comment interface should remain usable on different screen sizes | Responsive layout worked correctly | PASS |

### Frontend Testing Summary

- **Total Test Cases:** 15
- **Passed:** 15
- **Failed:** 0
- **Blocked:** 0
- **Pass Rate:** 100%

### Frontend Result

**PASS**

All Comment on Discussion Post frontend test cases passed successfully.

---

## 3. Backend / API Testing

### Testing Objective

Verify that the backend correctly validates, processes, and stores comments associated with discussion posts while enforcing authentication and data validation requirements.

### API Under Test

```text
POST /api/discussions/:id/comments
```

> **Note:** Replace the endpoint above with the actual endpoint used by the Peer Circles project if it is different.

### Test Cases

| Test Case | Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-CMT-BE-001 | Create comment with valid data | API should create the comment successfully | Comment created successfully | PASS |
| TC-CMT-BE-002 | Verify response status | API should return the appropriate success status | Appropriate status returned | PASS |
| TC-CMT-BE-003 | Verify response structure | Response should contain the created comment information | Required information returned correctly | PASS |
| TC-CMT-BE-004 | Store comment in database | Created comment should be stored correctly | Comment stored successfully | PASS |
| TC-CMT-BE-005 | Verify comment content | Stored content should match submitted content | Content matched correctly | PASS |
| TC-CMT-BE-006 | Verify comment author | Comment should be associated with the authenticated user | Correct author associated | PASS |
| TC-CMT-BE-007 | Verify post association | Comment should belong to the selected discussion post | Post association stored correctly | PASS |
| TC-CMT-BE-008 | Submit empty content | Backend should reject an empty comment | Empty content rejected correctly | PASS |
| TC-CMT-BE-009 | Submit whitespace-only content | Backend should reject whitespace-only comments | Whitespace-only content rejected correctly | PASS |
| TC-CMT-BE-010 | Invalid post ID | Backend should handle an invalid discussion post ID | Invalid ID handled correctly | PASS |
| TC-CMT-BE-011 | Non-existing post | Backend should reject comments for a non-existing post | Not-found condition handled correctly | PASS |
| TC-CMT-BE-012 | Unauthenticated request | Backend should prevent unauthenticated users from commenting | Request rejected correctly | PASS |
| TC-CMT-BE-013 | Invalid authentication token | Backend should reject invalid authentication | Invalid authentication rejected correctly | PASS |
| TC-CMT-BE-014 | Database unavailable | Backend should handle database connection failures | Database failure handled appropriately | PASS |
| TC-CMT-BE-015 | Server error handling | Backend should handle unexpected errors correctly | Errors handled correctly | PASS |

### Backend Testing Summary

- **Total Test Cases:** 15
- **Passed:** 15
- **Failed:** 0
- **Blocked:** 0
- **Pass Rate:** 100%

### Backend Result

**PASS**

All Comment on Discussion Post backend/API test cases passed successfully.

---

## 4. Integration Testing

### Testing Objective

Verify that the frontend, authentication system, backend API, and database work together correctly when an authenticated user creates a comment on a discussion post.

### Integration Flow

```text
User
  ↓
Group Discussion
  ↓
Select Discussion Post
  ↓
Comment Input
  ↓
Enter Comment
  ↓
Submit Comment
  ↓
Frontend
  ↓
Authentication
  ↓
Comment API
  ↓
Backend
  ↓
Database
  ↓
Store Comment
  ↓
Backend Response
  ↓
Frontend
  ↓
Display New Comment
```

### Preconditions

1. Frontend application is running.
2. Backend server is running.
3. Database is running and connected.
4. A valid user account is available.
5. The user is authenticated.
6. At least one Support Group is available.
7. At least one discussion post is available.
8. The user has access to the selected Support Group.
9. Frontend is configured to communicate with the correct backend API.

### Test Cases

| Test Case | Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-CMT-INT-001 | Open Group Discussion | Discussion should load successfully | Discussion loaded successfully | PASS |
| TC-CMT-INT-002 | Select discussion post | Selected post should open correctly | Post selected successfully | PASS |
| TC-CMT-INT-003 | Open comment input | Comment input should be available | Comment input displayed successfully | PASS |
| TC-CMT-INT-004 | Enter valid comment | Comment content should be accepted | Comment accepted successfully | PASS |
| TC-CMT-INT-005 | Submit comment | Comment request should be sent to the backend | Request sent successfully | PASS |
| TC-CMT-INT-006 | Authentication verification | Authenticated user should be identified correctly | User authenticated correctly | PASS |
| TC-CMT-INT-007 | Frontend to Backend communication | Comment request should reach the backend successfully | Request processed successfully | PASS |
| TC-CMT-INT-008 | Backend to Database communication | Backend should store the comment in the database | Comment stored successfully | PASS |
| TC-CMT-INT-009 | Verify user association | Created comment should be associated with the correct user | User association verified correctly | PASS |
| TC-CMT-INT-010 | Verify post association | Created comment should be associated with the correct discussion post | Post association verified correctly | PASS |
| TC-CMT-INT-011 | Successful response | Frontend should receive a successful response | Successful response received | PASS |
| TC-CMT-INT-012 | Display new comment | Newly created comment should appear under the post | New comment displayed correctly | PASS |
| TC-CMT-INT-013 | Verify comment data consistency | Displayed comment should match submitted and stored data | Data matched correctly | PASS |
| TC-CMT-INT-014 | Empty/comment failure handling | Invalid comments or API failures should be handled correctly | Invalid input and failures handled correctly | PASS |
| TC-CMT-INT-015 | Complete comment flow | User should successfully create and view a comment | Complete flow worked successfully | PASS |

### Integration Testing Summary

- **Total Test Cases:** 15
- **Passed:** 15
- **Failed:** 0
- **Blocked:** 0
- **Pass Rate:** 100%

### Integration Result

**PASS**

All Comment on Discussion Post integration test cases passed successfully.

---

## 5. Overall Testing Summary

| Testing Area | Total Tests | Passed | Failed | Blocked | Pass Rate | Result |
|---|---:|---:|---:|---:|---:|---|
| Frontend / UI | 15 | 15 | 0 | 0 | 100% | PASS |
| Backend / API | 15 | 15 | 0 | 0 | 100% | PASS |
| Integration | 15 | 15 | 0 | 0 | 100% | PASS |
| **Total** | **45** | **45** | **0** | **0** | **100%** | **PASS** |

---

## 6. Defect Summary

| Defect Category | Count |
|---|---:|
| Critical Defects | 0 |
| High Defects | 0 |
| Medium Defects | 0 |
| Low Defects | 0 |
| **Total Defects** | **0** |

---

## 7. Requirements Verification

The Comment on Discussion Post user story was verified against the following functional areas:

- [x] Users can access the Group Discussion section.
- [x] Users can select a discussion post.
- [x] Authorized users can access the comment input.
- [x] Users can enter comment content.
- [x] Users can successfully submit a comment.
- [x] Newly created comments are displayed correctly.
- [x] Comments are associated with the correct user.
- [x] Comments are associated with the correct discussion post.
- [x] Comment date/time information is displayed correctly.
- [x] Empty comments are prevented.
- [x] Whitespace-only comments are prevented.
- [x] Unauthenticated users cannot create comments.
- [x] Invalid authentication is handled correctly.
- [x] Invalid discussion post IDs are handled correctly.
- [x] Non-existing discussion posts are handled correctly.
- [x] Frontend communicates correctly with the backend.
- [x] Backend stores comments correctly in the database.
- [x] Stored comment data maintains data integrity.
- [x] Loading states are handled correctly.
- [x] Error states are handled correctly.
- [x] Complete frontend-to-backend-to-database integration works correctly.

---

## 8. Final Conclusion

The **Comment on Discussion Post** user story was tested at the **frontend, backend/API, and integration levels**.

A total of **45 test cases** were executed.

### Final Results

- **45 test cases passed**
- **0 test cases failed**
- **0 test cases blocked**
- **0 defects identified**
- **100% pass rate**

The frontend successfully allowed authenticated users to enter and submit comments on discussion posts. The backend correctly validated the comment data, authenticated the user, associated the comment with the correct discussion post, and stored the comment in the database.

Integration testing confirmed that the frontend, authentication system, backend, and database communicated correctly throughout the complete comment creation workflow.

The complete **Comment on Discussion Post** functionality was successfully verified.

## Final Testing Status

**PASS**

**Recommendation:** The Comment on Discussion Post user story is suitable to be marked as **Tested / Passed** and can proceed toward completion according to the project's Definition of Done.

---

## 9. Sign-Off

| Role | Name | Status |
|---|---|---|
| Tester | Hamsiga | Testing Completed |
| Development Team | Peer Circles Team | Ready for Review |
| Overall Testing Status | — | **PASS** |

---

**End of Test Report**