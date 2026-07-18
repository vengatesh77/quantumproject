package com.employee.pages;

import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

/**
 * EditEmployeePage — Handles the "Edit Employee" modal.
 *
 * Responsibilities:
 *  - Click the Edit (pencil) button on the first employee row
 *  - Clear and update the employee's name field
 *  - Submit the form and wait for the modal to close
 *  - Provide helpers to verify the updated record in the table
 *
 * Locators based on EmployeeManagement.jsx + EmployeeForm.jsx:
 *  - Edit button: first btn-icon in the first table row's .table-actions
 *  - Name field: name="name" (inside modal)
 *  - Submit: .modal-footer .btn.btn-primary (text: "Update Employee")
 */
public class EditEmployeePage {

    private final WebDriver driver;
    private final WaitUtility waitUtil;

    // ── Locators ─────────────────────────────────────────────────────────────

    // Edit button — first action button in the first table row
    private final By firstRowEditBtn    = By.cssSelector(
            ".employee-table-container tbody tr:first-child .table-actions .btn-icon:first-child");

    // Modal form field
    private final By nameField          = By.name("name");
    private final By emailField         = By.name("email");

    // Modal action buttons
    private final By updateBtn          = By.cssSelector(".modal-footer .btn.btn-primary");
    private final By cancelBtn          = By.cssSelector(".modal-footer .btn.btn-outline");

    // Verification
    private final By firstRowNameCell   = By.cssSelector(
            ".employee-table-container tbody tr:first-child .emp-name");
    private final By allNameCells       = By.cssSelector(
            ".employee-table-container tbody tr .emp-name");

    public EditEmployeePage(WebDriver driver) {
        this.driver   = driver;
        this.waitUtil = new WaitUtility(driver);
    }

    // ── Page Actions ─────────────────────────────────────────────────────────

    /**
     * Clicks the Edit button on the first employee row to open the modal.
     */
    public void clickEditOnFirstRow() {
        waitUtil.safeClick(firstRowEditBtn);
        System.out.println("[EDIT EMPLOYEE] Edit button clicked on first row — modal opening...");
        waitUtil.waitForDemo();
    }

    /**
     * Clears the name field and types the new name.
     * Uses JavaScript clear to ensure React state is reset properly.
     *
     * @param newName updated employee name
     */
    public void updateName(String newName) {
        WebElement field = waitUtil.waitForElementVisible(nameField);

        // Clear via JS first (React controlled input requires full replacement)
        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].value = '';", field);
        field.clear();
        field.sendKeys(newName);

        // Trigger a React change event by dispatching input event
        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", field);
        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", field);

        System.out.println("[EDIT EMPLOYEE] Name updated to: " + newName);
        waitUtil.waitForDemo();
    }

    /**
     * Clicks the "Update Employee" submit button and waits for modal to close.
     */
    public void clickUpdate() {
        waitUtil.safeClick(updateBtn);
        System.out.println("[EDIT EMPLOYEE] 'Update Employee' button clicked.");
        waitUtil.waitForModalToClose();
        waitUtil.waitForDemo();
        System.out.println("[EDIT EMPLOYEE] Modal closed — record updated.");
    }

    /**
     * Clicks Cancel to dismiss the modal without saving.
     */
    public void clickCancel() {
        waitUtil.safeClick(cancelBtn);
        System.out.println("[EDIT EMPLOYEE] Edit modal cancelled.");
        waitUtil.waitForModalToClose();
        waitUtil.waitForDemo();
    }

    /**
     * Complete edit flow: open modal → update name → save.
     *
     * @param newName the new employee name to set
     */
    public void editFirstEmployeeName(String newName) {
        clickEditOnFirstRow();
        updateName(newName);
        clickUpdate();
        System.out.println("[EDIT EMPLOYEE] Edit complete — new name: " + newName);
    }

    // ── Verification Helpers ─────────────────────────────────────────────────

    /**
     * Returns the name text of the first row in the table.
     *
     * @return trimmed name text, or empty string if not found
     */
    public String getFirstRowName() {
        try {
            return waitUtil.waitForElementVisible(firstRowNameCell).getText().trim();
        } catch (Exception e) {
            System.out.println("[EDIT EMPLOYEE] Could not read first row name: " + e.getMessage());
            return "";
        }
    }

    /**
     * Returns true if any visible employee row contains the given name (case-insensitive).
     *
     * @param name name to search for in the table
     */
    public boolean isNameVisibleInTable(String name) {
        try {
            return driver.findElements(allNameCells).stream()
                    .map(WebElement::getText)
                    .anyMatch(t -> t.toLowerCase().contains(name.toLowerCase()));
        } catch (Exception e) {
            return false;
        }
    }
}
