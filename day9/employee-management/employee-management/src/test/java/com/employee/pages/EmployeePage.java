package com.employee.pages;

import com.employee.utilities.ConfigReader;
import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * EmployeePage — Represents the Employee List page (/employees).
 *
 * Responsibilities:
 *  - Navigate to the employee list page
 *  - Verify the employee table is visible
 *
 * NOTE: CRUD actions (Add, Search, Edit, Delete) are handled by
 *       their own dedicated Page classes to follow strict POM separation.
 */
public class EmployeePage {

    private final WebDriver driver;
    private final WaitUtility waitUtil;

    // ── Locators ─────────────────────────────────────────────────────────────
    private final By employeeTable       = By.className("employee-table-container");
    private final By addEmployeeButton   = By.xpath("//button[contains(normalize-space(),'Add Employee')]");

    public EmployeePage(WebDriver driver) {
        this.driver  = driver;
        this.waitUtil = new WaitUtility(driver);
    }

    // ── Page Actions ─────────────────────────────────────────────────────────

    /**
     * Navigates directly to the /employees page via the URL.
     * Use this as a fallback if sidebar navigation is not needed.
     */
    public void navigateTo() {
        String url = ConfigReader.getProperty("baseUrl") + "/employees";
        driver.get(url);
        System.out.println("[EMPLOYEE PAGE] Navigated to: " + url);
        waitUtil.waitForPageToLoad();
        waitUtil.waitForDemo();
    }

    /**
     * Waits for the employee table container to be visible on screen.
     * Call this after navigation to confirm the page has fully loaded.
     *
     * @return true if the table is visible
     */
    public boolean isTableVisible() {
        try {
            waitUtil.waitForElementVisible(employeeTable);
            System.out.println("[EMPLOYEE PAGE] Employee table is visible.");
            return true;
        } catch (Exception e) {
            System.out.println("[EMPLOYEE PAGE] Employee table NOT visible: " + e.getMessage());
            return false;
        }
    }

    /**
     * Checks whether the 'Add Employee' button is present (confirms page rendered correctly).
     *
     * @return true if button is visible
     */
    public boolean isAddButtonVisible() {
        try {
            waitUtil.waitForElementVisible(addEmployeeButton);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
