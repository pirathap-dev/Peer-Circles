# View and Update Profile Testing Report

## 1. Test Information

| Item | Details |
|---|---|
| Project | Peer Circles |
| Sprint | Sprint 1 |
| User Story | View and Update Profile |
| Test Type | Functional / UI / Backend / Integration Testing |
| Tester | Hamsiga |
| Test Environment | Local Development Environment |
| Overall Status | PASS |

## 2. User Story

**As a registered user, I want to view and update my profile information so that I can keep my personal information up to date.**

## 3. Testing Objective

The objective of this testing is to verify that an authenticated user can correctly view their existing profile information and update permitted profile fields. The testing also verifies validation, error handling, persistence of updated information, authentication requirements, and frontend-backend integration.

## 4. Test Scope

The following areas were tested:

- Profile page availability
- Display of existing profile information
- Profile field values
- Edit/update profile functionality
- Valid profile updates
- Empty and invalid input validation
- Save/update action
- Successful update feedback
- Persistence of updated information
- Unauthorized access protection
- Backend API communication
- Database persistence
- Error handling

## 5. Preconditions

1. A valid registered user account exists.
2. The user can successfully log in.
3. The user is authenticated before accessing the profile.
4. Frontend, backend, and database services are running.
5. Test data is available for profile updates.

## 6. Test Cases

### TC-PROFILE-001 — Verify Profile Page Loads

**Steps**
1. Log in with a valid user account.
2. Navigate to the Profile page.

**Expected Result**
- Profile page loads successfully.
- No unexpected error is displayed.

**Actual Result**
Profile page loaded successfully without errors.

**Status: PASS**

---

### TC-PROFILE-002 — Verify Existing Profile Information

**Steps**
1. Open the Profile page.
2. Observe the displayed profile information.

**Expected Result**
- Existing user information is displayed correctly.
- Information belongs to the currently authenticated user.

**Actual Result**
Existing profile information was displayed correctly for the authenticated user.

**Status: PASS**

---

### TC-PROFILE-003 — Verify Profile Fields

**Steps**
1. Open the Profile page.
2. Inspect the available profile fields.

**Expected Result**
- Required profile fields are displayed.
- Fields contain the user's current information where applicable.

**Actual Result**
Required profile fields were displayed correctly.

**Status: PASS**

---

### TC-PROFILE-004 — Verify Edit Profile Functionality

**Steps**
1. Open the Profile page.
2. Select the Edit/Update Profile option.

**Expected Result**
- Profile fields become editable according to the application design.
- Current values are available for editing.

**Actual Result**
Profile editing functionality worked correctly.

**Status: PASS**

---

### TC-PROFILE-005 — Update Profile with Valid Information

**Steps**
1. Open the Edit Profile section.
2. Modify permitted profile information using valid data.
3. Click Save/Update.

**Expected Result**
- Valid information is accepted.
- Profile update request is processed successfully.
- Appropriate success feedback is displayed.

**Actual Result**
Valid profile information was updated successfully.

**Status: PASS**

---

### TC-PROFILE-006 — Verify Updated Information Is Displayed

**Steps**
1. Update profile information with valid data.
2. Save the changes.
3. Return to or refresh the Profile page.

**Expected Result**
- Updated information is displayed correctly.
- Previous information is replaced by the new saved information.

**Actual Result**
Updated profile information was displayed correctly.

**Status: PASS**

---

### TC-PROFILE-007 — Verify Update Persistence

**Steps**
1. Update profile information.
2. Save the changes.
3. Refresh the application or log out and log in again.
4. Open the Profile page.

**Expected Result**
- Updated information remains saved.
- Profile displays the latest stored information.

**Actual Result**
Updated information persisted successfully.

**Status: PASS**

---

### TC-PROFILE-008 — Empty Required Field Validation

**Steps**
1. Open Edit Profile.
2. Clear a required profile field.
3. Click Save/Update.

**Expected Result**
- Update should not be completed with invalid required data.
- Appropriate validation message should be displayed.

**Actual Result**
Required-field validation worked correctly.

**Status: PASS**

---

### TC-PROFILE-009 — Invalid Profile Data Validation

**Steps**
1. Open Edit Profile.
2. Enter invalid data into a field that has format requirements.
3. Click Save/Update.

**Expected Result**
- Invalid data should be rejected.
- Appropriate validation feedback should be displayed.
- Invalid information should not be saved.

**Actual Result**
Invalid profile data was rejected correctly.

**Status: PASS**

---

### TC-PROFILE-010 — Cancel Profile Update

**Steps**
1. Open Edit Profile.
2. Modify profile information.
3. Select Cancel/Back without saving.

**Expected Result**
- Changes should not be saved.
- Existing saved profile information should remain unchanged.

**Actual Result**
Unsaved changes were discarded correctly.

**Status: PASS**

---

### TC-PROFILE-011 — Verify Update API Communication

**Steps**
1. Open browser Developer Tools.
2. Open the Network tab.
3. Update valid profile information.
4. Save the changes.
5. Inspect the profile update request.

**Expected Result**
- Frontend sends the correct update request to the backend.
- Required profile data is sent correctly.
- Backend returns the expected response.

**Actual Result**
Frontend communicated successfully with the profile update API.

**Status: PASS**

---

### TC-PROFILE-012 — Verify Database Persistence

**Steps**
1. Record the existing profile information.
2. Update the profile with valid information.
3. Save the changes.
4. Verify the corresponding user record.

**Expected Result**
- Updated information is stored correctly in the database.
- The correct user's record is updated.

**Actual Result**
Updated profile information was persisted correctly for the authenticated user.

**Status: PASS**

---

### TC-PROFILE-013 — Unauthorized Profile Access

**Steps**
1. Ensure the user is logged out.
2. Attempt to access the Profile page directly.

**Expected Result**
- Unauthenticated users should not access protected profile information.
- User should be redirected to Login or shown an appropriate authorization response.

**Actual Result**
Unauthorized profile access was prevented correctly.

**Status: PASS**

---

### TC-PROFILE-014 — Unauthorized Profile Update

**Steps**
1. Ensure the user is unauthenticated.
2. Attempt to submit a profile update request without valid authentication.

**Expected Result**
- Update request should be rejected.
- No profile information should be modified.

**Actual Result**
Unauthenticated profile update was rejected correctly.

**Status: PASS**

---

### TC-PROFILE-015 — Verify User Can Update Only Their Own Profile

**Steps**
1. Log in as a valid user.
2. Access the profile functionality.
3. Verify the profile information being viewed and updated.

**Expected Result**
- The authenticated user can view and update their own profile.
- The user cannot modify another user's profile through the normal profile functionality.

**Actual Result**
The authenticated user could access and update only their own profile.

**Status: PASS**

---

### TC-PROFILE-016 — Update Error Handling

**Steps**
1. Attempt a profile update under an unavailable or failed backend condition.
2. Observe the application response.

**Expected Result**
- Application handles the failure gracefully.
- Appropriate error feedback is displayed.
- Application does not crash.
- Unsuccessful changes are not incorrectly reported as saved.

**Actual Result**
Profile update errors were handled appropriately.

**Status: PASS**

---

### TC-PROFILE-017 — Verify Profile After Re-login

**Steps**
1. Update profile information successfully.
2. Log out.
3. Log in again with the same account.
4. Open the Profile page.

**Expected Result**
- Updated profile information should still be displayed.
- Data should belong to the logged-in user.

**Actual Result**
Updated profile information remained available after re-login.

**Status: PASS**

## 7. Test Summary

| Metric | Result |
|---|---:|
| Total Test Cases | 17 |
| Passed | 17 |
| Failed | 0 |
| Blocked | 0 |
| Overall Result | PASS |

## 8. Defect Summary

No defects were identified during the executed View and Update Profile testing.

## 9. Overall Conclusion

**PASS**

The View and Update Profile user story was successfully tested across the user interface, backend/API, database persistence, authentication, validation, and frontend-backend integration scenarios. All 17 executed test cases passed successfully, with no blocking or failed test cases identified.

The feature is considered ready for the next stage of the project workflow, subject to team review and acceptance criteria.
