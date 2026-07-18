package com.employee.pages;

import com.employee.utilities.NavigationUtil;
import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class DashboardPage {

    private final WebDriver driver;
    private final NavigationUtil nav;
    private final WaitUtility waitUtil;

    // Navigation Locators
    private final By employeesMenu = By.xpath("//a[@href='#/employees' or @href='/employees']");
    private final By dashboardMenu = By.xpath("//a[contains(@class,'sidebar-link') and .//span[text()='Dashboard']]");

    // Dashboard Widget Locators
    private final By totalEmployeesCard  = By.xpath("//h3[text()='Total Employees']/following-sibling::h2");
    private final By activeEmployeesCard = By.xpath("//h3[text()='Active Employees']/following-sibling::h2");
    private final By departmentsCard     = By.xpath("//h3[text()='Departments']/following-sibling::h2");
    private final By monthlySalaryCard   = By.xpath("//h3[text()='Monthly Salary']/following-sibling::h2");
    private final By attendanceWidget    = By.xpath("//h3[text()=\"Today's Attendance\"]");
    private final By companyNoticesWidget = By.xpath("//h3[text()='Company Notices']");
    private final By upcomingEventsWidget = By.xpath("//h3[text()='Upcoming Events']");

    public DashboardPage(WebDriver driver) {
        this.driver   = driver;
        this.nav      = new NavigationUtil(driver);
        this.waitUtil = new WaitUtility(driver);
    }

    public void clickEmployeesMenu() {
        waitUtil.waitForElementClickable(employeesMenu);
        driver.findElement(employeesMenu).click();
        waitUtil.waitForPageToLoad();
    }

    public void navigateTo() {
        nav.clickSidebarLink("Dashboard");
        nav.demoPause();
    }
    
    public boolean isDashboardLoaded() {
        return waitUtil.isElementVisible(totalEmployeesCard, 5);
    }
    
    public String getTotalEmployees() {
        return waitUtil.waitForElementVisible(totalEmployeesCard).getText();
    }

    public String getActiveEmployees() {
        return waitUtil.waitForElementVisible(activeEmployeesCard).getText();
    }

    public String getDepartments() {
        return waitUtil.waitForElementVisible(departmentsCard).getText();
    }

    public String getMonthlySalary() {
        return waitUtil.waitForElementVisible(monthlySalaryCard).getText();
    }

    public boolean isAttendanceWidgetVisible() {
        return waitUtil.isElementVisible(attendanceWidget, 3);
    }

    public boolean isCompanyNoticesVisible() {
        return waitUtil.isElementVisible(companyNoticesWidget, 3);
    }

    public boolean isUpcomingEventsVisible() {
        return waitUtil.isElementVisible(upcomingEventsWidget, 3);
    }
}
