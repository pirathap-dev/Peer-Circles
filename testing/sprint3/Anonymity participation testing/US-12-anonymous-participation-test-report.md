# Sprint 3 – Anonymous Participation Test Report

## 1. Test Information

| Field              | Details                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| **Project**        | Peer Circles                                                              |
| **Sprint**         | Sprint 3                                                                  |
| **Feature**        | Anonymous Participation                                                   |
| **User Story**     | US-12 – Participate Anonymously                                           |
| **Test Type**      | Manual Testing                                                            |
| **Tester**         | Dilan                                                                     |
| **Testing Method** | Manual Functional, Validation, Security, Integration & Regression Testing |
| **Test Status**    | **PASSED**                                                                |
| **Overall Result** | All test cases passed successfully                                        |

---

## 2. Test Objective

The objective of this testing was to verify that the **Anonymous Participation** functionality in the Peer Circles system works correctly and securely.

The testing focused on verifying that users can participate anonymously, that their real identity is not exposed to other users, and that normal non-anonymous participation continues to function correctly.

The testing also covered validation, error handling, access control, integration with existing functionality, regression testing, and defect verification.

---

## 3. Test Environment

| Item             | Details                                                      |
| ---------------- | ------------------------------------------------------------ |
| **Testing Type** | Manual Testing                                               |
| **Application**  | Peer Circles                                                 |
| **Environment**  | Development/Test Environment                                 |
| **Browser**      | Web Browser                                                  |
| **Test Data**    | Test user accounts and sample peer-circle participation data |
| **Tester**       | Dilan                                                        |

---

## 4. Test Scenarios and Results

### TC-01 – Enable Anonymous Participation

**Objective:**
Verify that a user can enable anonymous participation when participating in a peer circle.

**Test Steps:**

1. Log in using a valid user account.
2. Navigate to the relevant peer circle.
3. Start the participation process.
4. Select/enable the anonymous participation option.
5. Submit the participation.

**Expected Result:**
The user should be able to enable anonymous participation and successfully submit their participation.

**Actual Result:**
Anonymous participation was successfully enabled and submitted.

**Status:** PASS

---

### TC-02 – Verify Anonymous Identity Display

**Objective:**
Verify that a user who participates anonymously is displayed without their real identity.

**Test Steps:**

1. Participate in a peer circle with anonymous participation enabled.
2. Navigate to the relevant participation/content view.
3. Check how the participant is displayed.
4. Verify whether the participant's real name or identifying information is visible.

**Expected Result:**
The participant should be displayed anonymously. Their real identity should not be visible to other users.

**Actual Result:**
The participant was displayed anonymously and the real identity was not exposed.

**Status:** PASS

---

### TC-03 – Verify Non-Anonymous Participation

**Objective:**
Verify that normal participation continues to work when anonymous participation is disabled.

**Test Steps:**

1. Log in using a valid user account.
2. Navigate to a peer circle.
3. Disable/leave the anonymous participation option.
4. Submit the participation.
5. Check the resulting participation display.

**Expected Result:**
The participation should be submitted successfully and the user's identity should be displayed according to the normal participation behaviour.

**Actual Result:**
Non-anonymous participation worked correctly and the expected user identity was displayed.

**Status:** PASS

---

### TC-04 – Validation Testing

**Objective:**
Verify that the system properly validates user input and participation requirements.

**Test Steps:**

1. Attempt to submit participation without completing required information.
2. Test the anonymous participation option with different valid and invalid inputs.
3. Observe the validation messages.
4. Verify that invalid submissions are prevented.

**Expected Result:**
The system should prevent invalid submissions and display appropriate validation feedback.

**Actual Result:**
Validation worked correctly and invalid submissions were handled appropriately.

**Status:** PASS

---

### TC-05 – Error Handling

**Objective:**
Verify that errors occurring during anonymous participation are handled correctly.

**Test Steps:**

1. Perform the anonymous participation process.
2. Test invalid or incomplete participation conditions.
3. Observe the system response when an error occurs.
4. Verify that the user receives appropriate feedback.

**Expected Result:**
The system should handle errors without breaking the application and provide appropriate feedback to the user.

**Actual Result:**
Error handling worked correctly and the application remained functional.

**Status:** PASS

---

### TC-06 – Unauthorized Access to Identity Information

**Objective:**
Verify that unauthorized users cannot access the real identity of an anonymous participant.

**Test Steps:**

1. Create/submit an anonymous participation using a test account.
2. Access the participation using another user account.
3. Check the information displayed for the anonymous participant.
4. Attempt to access protected identity information through the available application functionality.

**Expected Result:**
Unauthorized users should not be able to view the real identity or protected identity information of an anonymous participant.

**Actual Result:**
The anonymous participant's real identity was not exposed to unauthorized users.

**Status:** PASS

---

### TC-07 – Integration Testing

**Objective:**
Verify that anonymous participation works correctly with the other components of the Peer Circles system.

**Test Steps:**

1. Enable anonymous participation.
2. Submit the participation.
3. Verify that the request is processed correctly.
4. Verify that the participation is stored and displayed correctly.
5. Verify the interaction between the frontend and backend functionality.

**Expected Result:**
Anonymous participation should work correctly across the integrated frontend and backend components.

**Actual Result:**
The anonymous participation functionality integrated correctly with the existing system.

**Status:** PASS

---

### TC-08 – Regression Testing

**Objective:**
Verify that implementing anonymous participation has not negatively affected existing participation functionality.

**Test Steps:**

1. Test anonymous participation.
2. Test normal/non-anonymous participation.
3. Verify existing peer-circle participation functionality.
4. Check related functionality for unexpected behaviour.

**Expected Result:**
The new anonymous participation functionality should work correctly without causing failures in existing functionality.

**Actual Result:**
Existing related functionality continued to work correctly after implementing the anonymous participation feature.

**Status:** PASS

---

### TC-09 – Defect Verification

**Objective:**
Verify whether any defects were identified during testing and confirm the status of reported defects.

**Test Steps:**

1. Execute all planned anonymous participation test cases.
2. Record any unexpected behaviour.
3. Verify reported defects where applicable.
4. Re-test corrected functionality.

**Expected Result:**
All identified defects should be documented and corrected before the feature is considered complete.

**Actual Result:**
No outstanding defects were identified during the manual testing of the anonymous participation functionality.

**Status:** PASS

---

## 5. Test Summary

| Category                      | Result |
| ----------------------------- | ------ |
| Anonymous participation       | PASS   |
| Anonymous identity protection | PASS   |
| Non-anonymous participation   | PASS   |
| Input validation              | PASS   |
| Error handling                | PASS   |
| Unauthorized identity access  | PASS   |
| Integration testing           | PASS   |
| Regression testing            | PASS   |
| Defect verification           | PASS   |

### Overall Test Result

**Total Test Cases:** 9
**Passed:** 9
**Failed:** 0
**Blocked:** 0
**Defects Outstanding:** 0

**Overall Status: PASSED**

---

## 6. Defect Summary

No outstanding defects were identified during the manual testing of the Anonymous Participation functionality.

| Defect ID | Description           | Severity | Status |
| --------- | --------------------- | -------- | ------ |
| None      | No defects identified | —        | —      |

---

## 7. Conclusion

The **Anonymous Participation (US-12)** functionality was manually tested by **Dilan** during Sprint 3.

The testing covered anonymous participation, identity protection, normal participation, validation, error handling, unauthorized access protection, integration, regression, and defect verification.

All planned test cases passed successfully. The anonymous participation feature behaved as expected, and no outstanding defects were identified during testing.

**Final Test Status: PASSED**