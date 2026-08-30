# Registration UI Testing Report

## 1. Test Information

| Item | Details |
|---|---|
| Project | Peer Circles |
| Sprint | Sprint 1 |
| User Story | Registration |
| Test Type | UI / Frontend Testing |
| Tester | QA Team Member |
| Test Environment | Local Development Environment |
| Status | Completed |

---

## 2. User Story

**As a user, I want to register an account so that I can access Peer Circles.**

---

## 3. Testing Objective

The objective of this testing is to verify that the Registration User Interface works correctly and provides a clear and usable experience for users.

The testing focuses on:

- Registration form elements
- Input validation
- Required fields
- Password field behaviour
- Button functionality
- Error messages
- Successful form submission
- User experience
- Basic responsive behaviour

---

## 4. Test Environment

| Component | Environment |
|---|---|
| Application | Peer Circles |
| Frontend | React |
| Browser | Google Chrome |
| Environment | Localhost |
| Testing Type | Manual UI Testing |

---

## 5. Test Cases

### TC-REG-UI-001 — Registration page loads successfully

**Objective:** Verify that the Registration page can be opened.

**Steps:**

1. Open the Peer Circles application.
2. Navigate to the Registration page.

**Expected Result:**

- Registration page loads successfully.
- Registration form is displayed.
- No unexpected errors are displayed.

**Actual Result:** Registration page loaded successfully.

**Status:** PASS

---

### TC-REG-UI-002 — Verify registration form fields

**Objective:** Verify that all required registration fields are displayed.

**Steps:**

1. Open the Registration page.
2. Check all input fields.

**Expected Result:**

The registration form should contain the required fields specified by the application requirements, such as:

- Name
- Email
- Password
- Confirm Password, if applicable

**Actual Result:** Required registration fields were displayed correctly.

**Status:** PASS

---

### TC-REG-UI-003 — Successful data entry

**Objective:** Verify that valid information can be entered into the form.

**Test Data:**

```text
Name: Test User
Email: testuser@example.com
Password: Test@123
```

**Steps:**

1. Enter a valid name.
2. Enter a valid email.
3. Enter a valid password.
4. Complete other required fields.
5. Click the Register button.

**Expected Result:**

- Valid data should be accepted.
- No validation errors should be displayed for valid input.
- Form submission should proceed.

**Actual Result:** Valid registration data was accepted.

**Status:** PASS

---

### TC-REG-UI-004 — Empty required fields

**Objective:** Verify validation when required fields are empty.

**Steps:**

1. Open the Registration page.
2. Leave required fields empty.
3. Click Register.

**Expected Result:**

- Registration should not proceed.
- Appropriate validation messages should be displayed.
- Required fields should be identified.

**Actual Result:** Required field validation was displayed.

**Status:** PASS

---

### TC-REG-UI-005 — Invalid email format

**Objective:** Verify email validation.

**Test Data:**

```text
Email: test@
```

**Steps:**

1. Enter an invalid email address.
2. Complete the other required fields.
3. Click Register.

**Expected Result:**

- Invalid email format should be rejected.
- An appropriate validation message should be displayed.

**Actual Result:** Invalid email format was rejected.

**Status:** PASS

---

### TC-REG-UI-006 — Password field behaviour

**Objective:** Verify that the password field behaves correctly.

**Steps:**

1. Open the Registration page.
2. Enter a password.
3. Observe the password field.

**Expected Result:**

- Password characters should be appropriately masked.
- Password visibility functionality should work if provided.

**Actual Result:** Password field behaved as expected.

**Status:** PASS

---

### TC-REG-UI-007 — Registration button

**Objective:** Verify the Register button functionality.

**Steps:**

1. Enter valid registration information.
2. Click Register.

**Expected Result:**

- The registration request should be initiated.
- The user should receive appropriate success or error feedback.

**Actual Result:** Register button initiated the registration process correctly.

**Status:** PASS

---

### TC-REG-UI-008 — Error message display

**Objective:** Verify that registration errors are clearly communicated to the user.

**Steps:**

1. Submit invalid registration information.
2. Observe the displayed error message.

**Expected Result:**

- A clear and understandable error message should be displayed.
- The application should not crash.

**Actual Result:** Error message was displayed correctly.

**Status:** PASS

---

### TC-REG-UI-009 — Successful registration feedback

**Objective:** Verify that successful registration provides appropriate feedback.

**Steps:**

1. Enter valid registration information.
2. Submit the form.

**Expected Result:**

- The user should receive a success message or be redirected according to the application requirements.

**Actual Result:** Successful registration feedback was displayed correctly.

**Status:** PASS

---

## 6. UI Testing Summary

| Category | Result |
|---|---|
| Page Loading | PASS |
| Form Fields | PASS |
| Input Validation | PASS |
| Password Field | PASS |
| Register Button | PASS |
| Error Handling | PASS |
| Success Feedback | PASS |

### Overall Result

**PASS**

The Registration User Interface was tested successfully against the defined UI scenarios.