# Registration Integration Testing Report

## 1. Test Information

| Item | Details |
|---|---|
| Project | Peer Circles |
| Sprint | Sprint 1 |
| User Story | Registration |
| Test Type | Integration Testing |
| Tester | QA Team Member |
| Test Environment | Local Development Environment |
| Status | Completed |

---

## 2. User Story

**As a user, I want to register an account so that I can access Peer Circles.**

---

## 3. Testing Objective

The objective of this testing is to verify that the Registration frontend, backend API, and database work together correctly as a complete feature.

The integration flow tested is:

```text
Registration UI
       ↓
Frontend API Request
       ↓
Backend Registration API
       ↓
Validation
       ↓
Database
       ↓
API Response
       ↓
Registration UI
```

---

## 4. Test Environment

| Component | Environment |
|---|---|
| Project | Peer Circles |
| Frontend | React |
| Backend | Node.js / Express |
| Database | Project-configured database |
| Browser | Google Chrome |
| API | Local Development API |
| Testing Type | End-to-End Integration Testing |

---

## 5. Integration Test Cases

### TC-REG-INT-001 — Successful registration end-to-end

**Objective:** Verify the complete registration flow from the frontend to the database.

**Test Data:**

```text
Name: Integration Test User
Email: integration@example.com
Password: Test@123
```

**Steps:**

1. Open the Peer Circles application.
2. Navigate to the Registration page.
3. Enter valid registration information.
4. Click Register.
5. Observe the network request.
6. Verify that the backend receives the request.
7. Verify that the database creates the user.
8. Verify the response displayed by the frontend.

**Expected Result:**

- Registration form accepts valid data.
- Frontend sends the registration request.
- Backend receives the request.
- Backend validates the information.
- User is created in the database.
- Successful response is returned.
- Frontend displays appropriate success feedback or redirects the user.

**Actual Result:** Complete registration flow worked successfully.

**Status:** PASS

---

### TC-REG-INT-002 — Duplicate email integration

**Objective:** Verify that duplicate email validation works across the frontend, backend, and database.

**Precondition:**

A user with the test email already exists.

**Steps:**

1. Open Registration.
2. Enter the existing email.
3. Enter valid remaining information.
4. Submit the form.

**Expected Result:**

- Frontend sends the request.
- Backend identifies the existing email.
- Database prevents duplicate user creation.
- Backend returns an appropriate error.
- Frontend displays the error to the user.

**Actual Result:** Duplicate email was handled correctly across all layers.

**Status:** PASS

---

### TC-REG-INT-003 — Empty required fields

**Objective:** Verify validation across the registration flow.

**Steps:**

1. Open Registration.
2. Leave required fields empty.
3. Submit the form.

**Expected Result:**

- Frontend should validate the required fields.
- Registration request should not proceed if client-side validation prevents it.
- If the request reaches the backend, backend validation should also reject it.
- No database record should be created.

**Actual Result:** Empty required fields were handled correctly.

**Status:** PASS

---

### TC-REG-INT-004 — Invalid email integration

**Objective:** Verify invalid email handling across frontend and backend.

**Test Data:**

```text
Email: invalid@
```

**Steps:**

1. Enter an invalid email.
2. Complete other required fields.
3. Submit the form.

**Expected Result:**

- Invalid email should be rejected.
- Appropriate validation feedback should be shown.
- No invalid user should be stored in the database.

**Actual Result:** Invalid email was rejected successfully.

**Status:** PASS

---

### TC-REG-INT-005 — Backend unavailable

**Objective:** Verify frontend behaviour when the backend is unavailable.

**Steps:**

1. Stop the backend server.
2. Open the Registration page.
3. Enter valid registration information.
4. Click Register.

**Expected Result:**

- Frontend should handle the failed API request gracefully.
- User should receive an appropriate error message.
- Application should not crash.

**Actual Result:** Backend connection failure was handled appropriately.

**Status:** PASS

---

### TC-REG-INT-006 — Database failure handling

**Objective:** Verify application behaviour when the database is unavailable.

**Steps:**

1. Make the database unavailable in the test environment.
2. Open Registration.
3. Submit valid registration information.

**Expected Result:**

- Backend should detect the database failure.
- Appropriate error response should be returned.
- Frontend should display an appropriate error message.
- No misleading success message should be shown.

**Actual Result:** Database failure was handled appropriately.

**Status:** PASS

---

### TC-REG-INT-007 — Verify database persistence

**Objective:** Verify that data submitted through the UI is correctly persisted in the database.

**Steps:**

1. Register a new user through the Registration UI.
2. Wait for the successful response.
3. Open the database.
4. Search for the registered email.
5. Compare the stored information with the submitted information.

**Expected Result:**

- A user record should exist.
- Required user information should be stored correctly.
- Password should follow the application's security implementation.
- No unintended duplicate records should be created.

**Actual Result:** Registration data was persisted correctly.

**Status:** PASS

---

### TC-REG-INT-008 — API response and UI feedback

**Objective:** Verify that backend responses are correctly handled by the frontend.

**Steps:**

1. Submit valid registration information.
2. Observe the backend response.
3. Observe the frontend.

**Expected Result:**

- Successful backend response should result in appropriate frontend success feedback.
- Error responses should result in appropriate frontend error feedback.
- The frontend should not display a success message when registration fails.

**Actual Result:** Backend responses were handled correctly by the frontend.

**Status:** PASS

---

## 6. Integration Testing Summary

| Test Area | Result |
|---|---|
| Frontend → Backend Communication | PASS |
| Backend → Database Communication | PASS |
| Successful Registration | PASS |
| Duplicate Email Handling | PASS |
| Validation | PASS |
| Backend Failure Handling | PASS |
| Database Failure Handling | PASS |
| Database Persistence | PASS |
| API Response → UI Feedback | PASS |

---

## 7. Overall Integration Result

**PASS**

The Registration frontend, backend API, and database were successfully integrated and tested as a complete user flow.

The tested flow successfully demonstrated:

```text
User
 ↓
Registration UI
 ↓
Frontend API Request
 ↓
Registration Backend
 ↓
Database
 ↓
Backend Response
 ↓
Registration UI
```

---

## 8. Conclusion

The Registration feature was tested at the integration level to verify communication and data flow between the frontend, backend, and database.

The tested scenarios passed successfully, and the Registration feature is considered ready for the next stage of the project workflow, subject to team review and acceptance criteria.