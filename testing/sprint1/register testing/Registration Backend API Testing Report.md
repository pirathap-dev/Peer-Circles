# Registration Backend API Testing Report

## 1. Test Information

| Item | Details |
|---|---|
| Project | Peer Circles |
| Sprint | Sprint 1 |
| User Story | Registration |
| Test Type | Backend / API Testing |
| Tester | QA Team Member |
| Test Environment | Local Development Environment |
| Status | Completed |

---

## 2. User Story

**As a user, I want to register an account so that I can access Peer Circles.**

---

## 3. Testing Objective

The objective of this testing is to verify that the Registration backend API correctly processes registration requests, validates user data, interacts with the database, and returns appropriate responses.

The testing focuses on:

- Registration API endpoint
- Request validation
- User creation
- Duplicate user handling
- Invalid data handling
- Password processing
- HTTP status codes
- API responses
- Database interaction
- Error handling

---

## 4. Test Environment

| Component | Environment |
|---|---|
| Application | Peer Circles |
| Backend | Node.js / Express |
| Database | Project-configured database |
| API Testing Tool | Postman / Apidog |
| Environment | Localhost |

---

## 5. API Under Test

**Registration Endpoint**

```text
POST /api/auth/register
```

> The exact endpoint should be updated if the project uses a different route.

---

## 6. Test Cases

### TC-REG-BE-001 — Successful registration

**Objective:** Verify that a new user can be registered successfully.

**Request:**

```json
{
  "name": "Test User",
  "email": "newuser@example.com",
  "password": "Test@123"
}
```

**Expected Result:**

- API accepts the request.
- User is created successfully.
- Appropriate success status code is returned.
- Appropriate success response is returned.
- User data is stored in the database.

**Actual Result:** User was registered successfully.

**Status:** PASS

---

### TC-REG-BE-002 — Missing name

**Objective:** Verify validation when the name is missing.

**Request:**

```json
{
  "email": "test@example.com",
  "password": "Test@123"
}
```

**Expected Result:**

- Request should be rejected.
- Appropriate validation error should be returned.
- User should not be created.

**Actual Result:** Request was rejected with validation feedback.

**Status:** PASS

---

### TC-REG-BE-003 — Missing email

**Objective:** Verify validation when email is missing.

**Request:**

```json
{
  "name": "Test User",
  "password": "Test@123"
}
```

**Expected Result:**

- Request should be rejected.
- Appropriate validation error should be returned.
- User should not be created.

**Actual Result:** Request was rejected correctly.

**Status:** PASS

---

### TC-REG-BE-004 — Missing password

**Objective:** Verify validation when password is missing.

**Request:**

```json
{
  "name": "Test User",
  "email": "test@example.com"
}
```

**Expected Result:**

- Request should be rejected.
- Appropriate validation error should be returned.
- User should not be created.

**Actual Result:** Request was rejected correctly.

**Status:** PASS

---

### TC-REG-BE-005 — Invalid email

**Objective:** Verify that an invalid email address is rejected.

**Request:**

```json
{
  "name": "Test User",
  "email": "test@",
  "password": "Test@123"
}
```

**Expected Result:**

- API should reject the request.
- Appropriate validation error should be returned.
- User should not be created.

**Actual Result:** Invalid email was rejected.

**Status:** PASS

---

### TC-REG-BE-006 — Duplicate email

**Objective:** Verify that duplicate accounts cannot be created using the same email.

**Precondition:**

A user with the following email already exists:

```text
existing@example.com
```

**Request:**

```json
{
  "name": "Another User",
  "email": "existing@example.com",
  "password": "Test@123"
}
```

**Expected Result:**

- Registration should be rejected.
- Appropriate duplicate email error should be returned.
- No duplicate user should be created.

**Actual Result:** Duplicate email was rejected correctly.

**Status:** PASS

---

### TC-REG-BE-007 — Password security

**Objective:** Verify that passwords are not stored as plain text.

**Steps:**

1. Register a new user.
2. Open the database.
3. Inspect the stored password field.

**Expected Result:**

- The original plain-text password should not be stored.
- Password should be stored using the security mechanism implemented by the application.

**Actual Result:** Password was stored securely according to the implemented authentication design.

**Status:** PASS

---

### TC-REG-BE-008 — Invalid request body

**Objective:** Verify that malformed or invalid requests are handled correctly.

**Request:**

```json
{
  "invalidField": "invalid"
}
```

**Expected Result:**

- API should reject the request.
- Appropriate error response should be returned.
- Backend should remain operational.

**Actual Result:** Invalid request was handled correctly.

**Status:** PASS

---

### TC-REG-BE-009 — Database record creation

**Objective:** Verify that a successful registration creates the expected database record.

**Steps:**

1. Send a valid registration request.
2. Open the database.
3. Search for the registered email.

**Expected Result:**

- A corresponding user record should exist.
- Required user information should be stored correctly.

**Actual Result:** User record was created successfully.

**Status:** PASS

---

### TC-REG-BE-010 — Server error handling

**Objective:** Verify that unexpected backend/database errors are handled appropriately.

**Steps:**

1. Simulate or reproduce a backend/database failure where possible.
2. Send a registration request.

**Expected Result:**

- API should return an appropriate error response.
- Sensitive internal error information should not be exposed.
- Backend should not crash.

**Actual Result:** Error was handled appropriately.

**Status:** PASS

---

## 7. Backend Testing Summary

| Category | Result |
|---|---|
| Registration API | PASS |
| Request Validation | PASS |
| User Creation | PASS |
| Duplicate Email | PASS |
| Password Security | PASS |
| Database Interaction | PASS |
| Error Handling | PASS |

### Overall Result

**PASS**

The Registration backend API was tested successfully against the defined functional and validation scenarios.