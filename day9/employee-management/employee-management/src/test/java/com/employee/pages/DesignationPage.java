package com.employee.pages;

import com.employee.utilities.NavigationUtil;
import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class DesignationPage {

    private final WebDriver driver;
    private final NavigationUtil nav;
    private final WaitUtility waitUtil;

    public static final String PAGE_NAME    = "Designations";
    public static final String URL_SEGMENT  = "designations";
    public static final String HEADING_TEXT = "Designations";

    // ── Locators ─────────────────────────────────────────────────────────────
    private final By heading        = By.xpath("//h1[normalize-space()='Designations']");
    private final By tableWrapper   = By.className("table-wrapper");
    private final By addBtn         = By.xpath("//button[contains(normalize-space(),'Add Designation')]");
    private final By searchInput    = By.cssSelector(".search-input-wrap input.form-control");

    // Modal Locators
    private final By titleInput      = By.xpath("//label[contains(text(),'Job Title')]/following-sibling::input");
    private final By departmentSelect= By.xpath("//label[contains(text(),'Department')]/following-sibling::select");
    private final By minSalaryInput  = By.xpath("//label[contains(text(),'Min Salary')]/following-sibling::input");
    private final By maxSalaryInput  = By.xpath("//label[contains(text(),'Max Salary')]/following-sibling::input");
    private final By experienceInput = By.xpath("//label[contains(text(),'Experience')]/following-sibling::input");
    private final By statusSelect    = By.xpath("//label[contains(text(),'Status')]/following-sibling::select");
    private final By saveBtn         = By.cssSelector(".modal-footer button[type='submit']");
    
    // Table Rows
    private final By tableRows      = By.cssSelector("table.table tbody tr");

    public DesignationPage(WebDriver driver) {
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
        boolean tableVisible   = nav.isElementVisible(".table-wrapper", "Designations table wrapper");
        return headingVisible && tableVisible;
    }

    public void clickAddDesignation() {
        waitUtil.safeClick(addBtn);
        waitUtil.waitForElementVisible(titleInput);
    }

    public void fillDesignationDetails(String title, String department, String minSalary, String maxSalary, String experience, String status) {
        waitUtil.waitForElementVisible(titleInput).clear();
        driver.findElement(titleInput).sendKeys(title);
        
        if (!department.isEmpty()) {
            driver.findElement(departmentSelect).sendKeys(department);
        }
        
        driver.findElement(minSalaryInput).clear();
        driver.findElement(minSalaryInput).sendKeys(minSalary);
        
        driver.findElement(maxSalaryInput).clear();
        driver.findElement(maxSalaryInput).sendKeys(maxSalary);
        
        driver.findElement(experienceInput).clear();
        driver.findElement(experienceInput).sendKeys(experience);
        
        driver.findElement(statusSelect).sendKeys(status);
    }

    public void saveDesignation() {
        waitUtil.safeClick(saveBtn);
        waitUtil.waitForDemo();
    }

    public void searchDesignation(String searchText) {
        WebElement search = waitUtil.waitForElementVisible(searchInput);
        search.clear();
        search.sendKeys(searchText);
        waitUtil.waitForDemo();
    }

    public boolean isDesignationVisible(String title) {
        List<WebElement> rows = driver.findElements(tableRows);
        for (WebElement row : rows) {
            if (row.getText().contains(title)) {
                return true;
            }
        }
        return false;
    }

    public void editDesignation(String oldTitle, String newTitle) {
        searchDesignation(oldTitle);
        By editIcon = By.xpath("//tr[contains(.,'" + oldTitle + "')]//button[contains(@class,'edit')]");
        waitUtil.safeClick(editIcon);
        
        waitUtil.waitForElementVisible(titleInput);
        WebElement titleField = driver.findElement(titleInput);
        titleField.sendKeys(org.openqa.selenium.Keys.CONTROL + "a");
        titleField.sendKeys(org.openqa.selenium.Keys.BACK_SPACE);
        titleField.sendKeys(newTitle);
        
        saveDesignation();
    }

    public void deleteDesignation(String title) {
        searchDesignation(title);
        By deleteIcon = By.xpath("//tr[contains(.,'" + title + "')]//button[contains(@class,'delete')]");
        waitUtil.safeClick(deleteIcon);
        
        waitUtil.waitForDemo();
        driver.switchTo().alert().accept();
        waitUtil.waitForDemo();
    }
}
