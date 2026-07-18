package com.employee.pages;

import com.employee.utilities.NavigationUtil;
import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class AttendancePage {

    private final WebDriver driver;
    private final NavigationUtil nav;
    private final WaitUtility waitUtil;

    public static final String PAGE_NAME   = "Attendance";
    public static final String URL_SEGMENT = "attendance";

    // ── Locators ─────────────────────────────────────────────────────────────
    private final By dateFilter     = By.xpath("//input[@type='date']");
    private final By searchInput    = By.xpath("//input[@placeholder='Search employee...']");
    private final By generateBtn    = By.xpath("//button[contains(text(),'Generate Records')]");
    private final By tableRows      = By.cssSelector("table.table tbody tr");

    public AttendancePage(WebDriver driver) {
        this.driver   = driver;
        this.nav      = new NavigationUtil(driver);
        this.waitUtil = new WaitUtility(driver);
    }

    public void navigateTo() {
        System.out.println("\nOpening " + PAGE_NAME + "...");
        nav.clickSidebarLink(PAGE_NAME);
        nav.demoPause();
    }

    public boolean isPageLoaded() {
        boolean urlOk = nav.isOnPage(URL_SEGMENT);
        boolean dateFilterVisible = nav.isElementVisible("input[type='date']", "Attendance date filter");
        return urlOk && dateFilterVisible;
    }

    public void clickGenerateRecords() {
        waitUtil.safeClick(generateBtn);
        waitUtil.waitForDemo();
    }

    public void searchEmployee(String name) {
        WebElement search = waitUtil.waitForElementVisible(searchInput);
        search.clear();
        search.sendKeys(name);
        waitUtil.waitForDemo();
    }

    public void markAttendance(String employeeName, String status) {
        searchEmployee(employeeName);
        
        // Find the row containing the employee name, then find the select dropdown in that row
        By statusDropdown = By.xpath("//tr[contains(.,'" + employeeName + "')]//select");
        waitUtil.waitForElementClickable(statusDropdown).sendKeys(status);
        waitUtil.waitForDemo();
    }

    public boolean verifyAttendanceStatus(String employeeName, String expectedStatus) {
        searchEmployee(employeeName);
        By statusBadge = By.xpath("//tr[contains(.,'" + employeeName + "')]//span[contains(@class,'badge')]");
        String actualStatus = waitUtil.waitForElementVisible(statusBadge).getText();
        return actualStatus.equals(expectedStatus);
    }
}
