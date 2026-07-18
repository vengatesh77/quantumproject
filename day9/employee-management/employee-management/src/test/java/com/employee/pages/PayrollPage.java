package com.employee.pages;

import com.employee.utilities.NavigationUtil;
import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PayrollPage {

    private final WebDriver driver;
    private final NavigationUtil nav;
    private final WaitUtility waitUtil;

    public static final String PAGE_NAME   = "Payroll";
    public static final String URL_SEGMENT = "payroll";

    // ── Locators ─────────────────────────────────────────────────────────────
    private final By searchInput    = By.xpath("//input[@placeholder='Search employee...']");
    private final By tableRows      = By.cssSelector("table.table tbody tr");

    public PayrollPage(WebDriver driver) {
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
        boolean headingVisible = nav.isHeadingVisible("Payroll");
        return urlOk && headingVisible;
    }

    public void searchEmployee(String name) {
        WebElement search = waitUtil.waitForElementVisible(searchInput);
        search.clear();
        search.sendKeys(name);
        waitUtil.waitForDemo();
    }

    public void updateBonus(String employeeName, String bonusAmount) {
        searchEmployee(employeeName);
        By bonusInput = By.xpath("//tr[contains(.,'" + employeeName + "')]//td[3]//input");
        WebElement input = waitUtil.waitForElementVisible(bonusInput);
        input.clear();
        input.sendKeys(bonusAmount);
        waitUtil.waitForDemo();
    }
    
    public void updateStatus(String employeeName, String status) {
        searchEmployee(employeeName);
        By statusSelect = By.xpath("//tr[contains(.,'" + employeeName + "')]//td[6]//select");
        waitUtil.waitForElementClickable(statusSelect).sendKeys(status);
        waitUtil.waitForDemo();
    }

    public String getNetSalary(String employeeName) {
        searchEmployee(employeeName);
        By netSalaryCell = By.xpath("//tr[contains(.,'" + employeeName + "')]//td[5]");
        return waitUtil.waitForElementVisible(netSalaryCell).getText();
    }

    public void clickDownloadPayslip(String employeeName) {
        searchEmployee(employeeName);
        By downloadBtn = By.xpath("//tr[contains(.,'" + employeeName + "')]//button[contains(normalize-space(),'Payslip')]");
        waitUtil.safeClick(downloadBtn);
        waitUtil.waitForDemo();
    }
}
