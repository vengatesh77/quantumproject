package com.employee.pages;

import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.stream.Collectors;

/**
 * SearchEmployeePage — Handles the employee search / filter functionality.
 *
 * Responsibilities:
 *  - Clear the search box and type a query
 *  - Wait for the table to update
 *  - Return the list of employee names currently shown in the table
 *
 * Locators based on EmployeeManagement.jsx:
 *  - Search input: className="input-field search-input" inside .controls-bar .search-box
 *  - Employee name cells: .emp-name inside tbody rows
 */
public class SearchEmployeePage {

    private final WebDriver driver;
    private final WaitUtility waitUtil;

    // ── Locators ─────────────────────────────────────────────────────────────
    // The search input inside the employee controls bar
    private final By searchInput        = By.cssSelector(".controls-bar .search-input");

    // All employee name cells in the visible table rows
    private final By employeeNameCells  = By.cssSelector(
            ".employee-table-container tbody tr .emp-name");

    // The "no results" message shown when no employees match the filter
    private final By noResultsCell      = By.cssSelector(
            ".employee-table-container tbody tr td.text-center");

    // First employee name (used for quick single-result assertions)
    private final By firstEmployeeName  = By.cssSelector(
            ".employee-table-container tbody tr:first-child .emp-name");

    public SearchEmployeePage(WebDriver driver) {
        this.driver   = driver;
        this.waitUtil = new WaitUtility(driver);
    }

    // ── Page Actions ─────────────────────────────────────────────────────────

    /**
     * Clears the search box and types the given query.
     * Waits for the table to re-render before returning.
     *
     * @param query the text to search for
     */
    public void searchFor(String query) {
        WebElement input = waitUtil.waitForElementVisible(searchInput);
        input.clear();
        input.sendKeys(query);
        System.out.println("[SEARCH] Typed search query: '" + query + "'");
        waitUtil.waitForDemo();
    }

    /**
     * Clears the search box (resets the table to show all employees).
     */
    public void clearSearch() {
        WebElement input = waitUtil.waitForElementVisible(searchInput);
        input.clear();
        System.out.println("[SEARCH] Search box cleared.");
        waitUtil.waitForDemo();
    }

    // ── Verification Helpers ─────────────────────────────────────────────────

    /**
     * Returns all employee name texts currently visible in the table.
     *
     * @return list of employee names (may be empty)
     */
    public List<String> getVisibleEmployeeNames() {
        try {
            List<WebElement> cells = driver.findElements(employeeNameCells);
            return cells.stream()
                    .map(WebElement::getText)
                    .map(String::trim)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("[SEARCH] Could not retrieve employee name cells: " + e.getMessage());
            return List.of();
        }
    }

    /**
     * Returns true if at least one employee row is visible in the table.
     */
    public boolean hasResults() {
        try {
            List<WebElement> cells = driver.findElements(employeeNameCells);
            boolean found = !cells.isEmpty();
            System.out.println("[SEARCH] Has results: " + found + " (" + cells.size() + " rows)");
            return found;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Returns true if any visible employee name contains the given text (case-insensitive).
     *
     * @param name partial or full name to check
     */
    public boolean isEmployeeNameVisible(String name) {
        List<String> names = getVisibleEmployeeNames();
        boolean found = names.stream()
                .anyMatch(n -> n.toLowerCase().contains(name.toLowerCase()));
        System.out.println("[SEARCH] Employee '" + name + "' visible in table: " + found
                + " | All visible: " + names);
        return found;
    }

    /**
     * Returns true if the "No employees found" message is displayed.
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
     * Returns the name text of the first table row.
     */
    public String getFirstVisibleEmployeeName() {
        try {
            return waitUtil.waitForElementVisible(firstEmployeeName).getText().trim();
        } catch (Exception e) {
            System.out.println("[SEARCH] Could not get first employee name: " + e.getMessage());
            return "";
        }
    }
}
