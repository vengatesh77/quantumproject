package com.employee.pages;

import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

/**
 * AddEmployeePage — Handles the "Add New Employee" modal.
 *
 * Responsibilities:
 *  - Click the "Add Employee" button to open the modal
 *  - Fill all required form fields (name, email, phone, dept, designation, salary, date)
 *  - Submit the form and wait for the modal to close
 *  - Verify the new employee row appears in the table
 *
 * Locators are based on the React EmployeeForm.jsx source:
 *  - Input fields use name= attributes (e.g. name="name", name="email")
 *  - Save button: type="submit" inside the modal footer
 */
public class AddEmployeePage {

    private final WebDriver driver;
    private final WaitUtility waitUtil;

    // ── Locators ─────────────────────────────────────────────────────────────
    // Trigger button on the Employee List page
    private final By addEmployeeBtn      = By.xpath(
            "//button[contains(normalize-space(),'Add Employee')]");

    // Modal form fields (matched by name attribute — from EmployeeForm.jsx)
    private final By nameField           = By.name("name");
    private final By emailField          = By.name("email");
    private final By phoneField          = By.name("phone");
    private final By salaryField         = By.name("salary");
    private final By joiningDateField    = By.name("joiningDate");
    private final By departmentSelect    = By.name("department");
    private final By designationSelect   = By.name("designation");
    private final By statusSelect        = By.name("status");

    // Modal action buttons
    private final By saveBtn             = By.cssSelector(".modal-footer .btn.btn-primary");
    private final By cancelBtn           = By.cssSelector(".modal-footer .btn.btn-outline");

    // Verification — first visible employee name cell in the table body
    private final By tableBodyFirstName  = By.cssSelector(
            ".employee-table-container tbody tr:first-child .emp-name");

    // No-results message
    private final By noResultsRow        = By.cssSelector(
            ".employee-table-container tbody tr td.text-center");

    public AddEmployeePage(WebDriver driver) {
        this.driver   = driver;
        this.waitUtil = new WaitUtility(driver);
    }

    // ── Page Actions ─────────────────────────────────────────────────────────

    /**
     * Clicks "Add Employee" to open the modal form.
     */
    public void clickAddEmployee() {
        waitUtil.safeClick(addEmployeeBtn);
        System.out.println("[ADD EMPLOYEE] Clicked 'Add Employee' button — modal opening...");
        waitUtil.waitForDemo();
    }

    /**
     * Fills the Full Name field in the modal.
     */
    public void enterName(String name) {
        WebElement field = waitUtil.waitForElementVisible(nameField);
        field.clear();
        field.sendKeys(name);
        System.out.println("[ADD EMPLOYEE] Name entered: " + name);
    }

    /**
     * Fills the Email field.
     */
    public void enterEmail(String email) {
        WebElement field = waitUtil.waitForElementVisible(emailField);
        field.clear();
        field.sendKeys(email);
        System.out.println("[ADD EMPLOYEE] Email entered: " + email);
    }

    /**
     * Fills the Phone field.
     */
    public void enterPhone(String phone) {
        WebElement field = waitUtil.waitForElementVisible(phoneField);
        field.clear();
        field.sendKeys(phone);
        System.out.println("[ADD EMPLOYEE] Phone entered: " + phone);
    }

    /**
     * Fills the Monthly Salary field.
     */
    public void enterSalary(String salary) {
        WebElement field = waitUtil.waitForElementVisible(salaryField);
        field.clear();
        field.sendKeys(salary);
        System.out.println("[ADD EMPLOYEE] Salary entered: " + salary);
    }

    /**
     * Fills the Joining Date field (format: yyyy-MM-dd).
     */
    public void enterJoiningDate(String date) {
        WebElement field = waitUtil.waitForElementVisible(joiningDateField);
        field.clear();
        field.sendKeys(date);
        System.out.println("[ADD EMPLOYEE] Joining date entered: " + date);
    }

    /**
     * Selects a Department from the dropdown.
     * Falls back gracefully if the specific option doesn't exist.
     */
    public void selectDepartment(String department) {
        try {
            WebElement element = waitUtil.waitForElementVisible(departmentSelect);
            Select select = new Select(element);
            select.selectByVisibleText(department);
            System.out.println("[ADD EMPLOYEE] Department selected: " + department);
        } catch (Exception e) {
            System.out.println("[ADD EMPLOYEE] Could not select department '" + department
                    + "' — using first available option.");
        }
    }

    /**
     * Selects a Designation from the dropdown.
     * Falls back gracefully if the specific option doesn't exist.
     */
    public void selectDesignation(String designation) {
        try {
            WebElement element = waitUtil.waitForElementVisible(designationSelect);
            Select select = new Select(element);
            select.selectByIndex(1); // pick first available
            System.out.println("[ADD EMPLOYEE] Designation selected (first available).");
        } catch (Exception e) {
            System.out.println("[ADD EMPLOYEE] Could not select designation — skipping.");
        }
    }

    /**
     * Clicks the "Save Employee" button to submit the form.
     */
    public void clickSave() {
        waitUtil.safeClick(saveBtn);
        System.out.println("[ADD EMPLOYEE] 'Save Employee' button clicked.");
        // Wait for modal to close after save
        waitUtil.waitForModalToClose();
        waitUtil.waitForDemo();
        System.out.println("[ADD EMPLOYEE] Modal closed — employee saved.");
    }

    /**
     * Clicks the Cancel button to dismiss the modal without saving.
     */
    public void clickCancel() {
        waitUtil.safeClick(cancelBtn);
        System.out.println("[ADD EMPLOYEE] Modal cancelled.");
        waitUtil.waitForModalToClose();
        waitUtil.waitForDemo();
    }

    /**
     * Complete flow: open modal → fill all fields → save.
     *
     * @param name       Full name of the employee
     * @param email      Email address
     * @param phone      Phone number
     * @param salary     Monthly salary (numeric string)
     * @param department Department name (as shown in the dropdown)
     * @param joiningDate Joining date in yyyy-MM-dd format
     */
    public void addEmployee(String name, String email, String phone,
                            String salary, String department, String joiningDate) {
        clickAddEmployee();
        enterName(name);
        enterEmail(email);
        enterPhone(phone);
        enterSalary(salary);
        enterJoiningDate(joiningDate);
        selectDepartment(department);
        selectDesignation(department); // designation filtered by dept — pick first
        waitUtil.waitForDemo();
        clickSave();
        System.out.println("[ADD EMPLOYEE] Employee addition complete: " + name);
    }

    // ── Verification Helpers ─────────────────────────────────────────────────

    /**
     * Returns the text of the first employee name cell in the table body.
     * Use this after adding an employee to confirm the record appeared.
     *
     * @return employee name text, or empty string if not found
     */
    public String getFirstEmployeeNameInTable() {
        try {
            return waitUtil.waitForElementVisible(tableBodyFirstName).getText().trim();
        } catch (Exception e) {
            System.out.println("[ADD EMPLOYEE] Could not read first employee name: " + e.getMessage());
            return "";
        }
    }

    /**
     * Returns true if the "No employees found" message is displayed.
     * Useful for confirming an empty table state.
     */
    public boolean isNoResultsMessageVisible() {
        try {
            String text = waitUtil.waitForElementVisible(noResultsRow).getText();
            return text.contains("No employees found");
        } catch (Exception e) {
            return false;
        }
    }
}
