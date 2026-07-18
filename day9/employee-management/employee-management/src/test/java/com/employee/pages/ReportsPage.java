package com.employee.pages;

import com.employee.utilities.NavigationUtil;
import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ReportsPage {

    private final WebDriver driver;
    private final NavigationUtil nav;
    private final WaitUtility waitUtil;

    public static final String PAGE_NAME    = "Reports";
    public static final String URL_SEGMENT  = "reports";
    public static final String HEADING_TEXT = "Reports & Analytics";

    // ── Locators ─────────────────────────────────────────────────────────────
    private final By exportPdfBtn   = By.xpath("//button[contains(text(),'Export PDF')]");
    private final By exportExcelBtn = By.xpath("//button[contains(text(),'Export Excel')]");
    private final By statCards      = By.className("stat-card");
    private final By totalEmployees = By.xpath("//h4[text()='Total Employees']/following-sibling::h2");

    public ReportsPage(WebDriver driver) {
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
        boolean headingVisible = nav.isHeadingVisible(HEADING_TEXT);
        return nav.isOnPage(URL_SEGMENT) && headingVisible;
    }

    public boolean areStatsVisible() {
        return driver.findElements(statCards).size() > 0;
    }
    
    public String getTotalEmployeesStat() {
        return waitUtil.waitForElementVisible(totalEmployees).getText();
    }

    public void exportPDF() {
        waitUtil.safeClick(exportPdfBtn);
        waitUtil.waitForDemo();
    }

    public void exportExcel() {
        waitUtil.safeClick(exportExcelBtn);
        waitUtil.waitForDemo();
    }
}
