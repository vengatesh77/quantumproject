package com.employee.pages;

import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * DeleteEmployeePage — Handles the "Delete Employee" action.
 *
 * Responsibilities:
 *  - Click the Delete (trash) icon on the first employee row
 *  - Accept the browser confirm() dialog that appears
 *  - Wait for the table to refresh after deletion
 *  - Provide helpers to verify the deletion result
 *
 * Locators based on EmployeeManagement.jsx:
 *  - Delete button: btn-icon text-danger inside .table-actions in the first tbody row
 *  - No-results cell: .text-center.py-8.text-muted td inside tbody
 */
public class DeleteEmployeePage {

    private final WebDriver driver;
    private final WaitUtility waitUtil;

    // ── Locators ─────────────────────────────────────────────────────────────

    // Delete button — second (last) action button in the first table row
    private final By firstRowDeleteBtn = By.cssSelector(
            ".employee-table-container tbody tr:first-child .table-actions .btn-icon.text-danger");

    // Fallback locator (last button in the row)
    private final By firstRowDeleteBtnFallback = By.cssSelector(
            ".employee-table-container tbody tr:first-child .table-actions button:last-child");

    // All employee name cells (to count rows after deletion)
    private final By allNameCells      = By.cssSelector(
            ".employee-table-container tbody tr .emp-name");

    // "No employees found" message after all employees are deleted
    private final By noResultsCell     = By.cssSelector(
            ".employee-table-container tbody tr td.text-center");

    public DeleteEmployeePage(WebDriver driver) {
        this.driver   = driver;
        this.waitUtil = new WaitUtility(driver);
    }

    // ── Page Actions ─────────────────────────────────────────────────────────

    /**
     * Clicks the Delete button on the first employee row.
     */
    public void clickDeleteOnFirstRow() {
        try {
            waitUtil.safeClick(firstRowDeleteBtn);
        } catch (Exception e) {
            System.out.println("[DELETE EMPLOYEE] Primary locator failed — trying fallback.");
            waitUtil.safeClick(firstRowDeleteBtnFallback);
        }
        System.out.println("[DELETE EMPLOYEE] Delete button clicked on first row.");
        waitUtil.waitForDemo();
    }

    /**
     * Accepts the browser confirm() dialog triggered by the delete action.
     * If no alert appears within 5 seconds, logs a warning and continues.
     */
    public void acceptConfirmDialog() {
        try {
            WebDriverWait alertWait = new WebDriverWait(driver, Duration.ofSeconds(5));
            alertWait.until(ExpectedConditions.alertIsPresent());
            String alertText = driver.switchTo().alert().getText();
            driver.switchTo().alert().accept();
            System.out.println("[DELETE EMPLOYEE] Confirm dialog accepted. Text was: '" + alertText + "'");
        } catch (Exception e) {
            System.out.println("[DELETE EMPLOYEE] No confirm dialog appeared — " +
                    "delete may have been handled inline by the app.");
        }
        waitUtil.waitForDemo();
    }

    /**
     * Complete delete flow: click Delete → accept dialog → wait for refresh.
     */
    public void deleteFirstEmployee() {
        clickDeleteOnFirstRow();
        acceptConfirmDialog();
        // Give the API call and re-render time to complete
        waitUtil.waitForPageToLoad();
        waitUtil.waitForDemo();
        System.out.println("[DELETE EMPLOYEE] Deletion flow complete.");
    }

    // ── Verification Helpers ─────────────────────────────────────────────────

    /**
     * Returns the number of employee rows currently visible in the table.
     *
     * @return row count (0 if table is empty or shows no-results message)
     */
    public int getVisibleRowCount() {
        try {
            return driver.findElements(allNameCells).size();
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * Returns true if the "No employees found" message is displayed.
     * Use this to confirm the table is empty after all deletions.
     */
    public boolean isNoResultsMessageVisible() {
        try {
            String text = driver.findElement(noResultsCell).getText();
            return text.contains("No employees found");
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Returns true if any row in the table contains the given name.
     * Use to confirm a specific employee has been removed.
     *
     * @param name the employee name to look for
     * @return true if name is STILL in the table (i.e., deletion did NOT happen)
     */
    public boolean isNameStillPresent(String name) {
        try {
            return driver.findElements(allNameCells).stream()
                    .map(WebElement::getText)
                    .anyMatch(t -> t.toLowerCase().contains(name.toLowerCase()));
        } catch (Exception e) {
            return false;
        }
    }
}
