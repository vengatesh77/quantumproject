package com.employee.pages;

import com.employee.utilities.NavigationUtil;
import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class DepartmentPage {

    private final WebDriver driver;
    private final NavigationUtil nav;
    private final WaitUtility waitUtil;

    public static final String PAGE_NAME    = "Departments";
    public static final String URL_SEGMENT  = "departments";
    public static final String HEADING_TEXT = "Departments";

    private final By heading        = By.xpath("//h1[normalize-space()='Departments']");
    private final By tableWrapper   = By.className("table-wrapper");
    private final By addBtn         = By.xpath("//button[contains(normalize-space(),'Add Department')]");
    private final By searchInput    = By.cssSelector(".search-input-wrap input.form-control");
    
    // Modal Locators
    private final By nameInput      = By.xpath("//label[contains(text(),'Department Name')]/following-sibling::input");
    private final By managerInput   = By.xpath("//label[contains(text(),'Manager Name')]/following-sibling::input");
    private final By locationInput  = By.xpath("//label[contains(text(),'Location')]/following-sibling::input");
    private final By statusSelect   = By.xpath("//label[contains(text(),'Status')]/following-sibling::select");
    private final By saveBtn        = By.xpath("//button[@type='submit']");
    private final By cancelBtn      = By.xpath("//button[contains(text(),'Cancel')]");
    
    // Table Rows
    private final By tableRows      = By.cssSelector("table.table tbody tr");

    public DepartmentPage(WebDriver driver) {
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
        boolean tableVisible   = nav.isElementVisible(".table-wrapper", "Departments table wrapper");
        return headingVisible && tableVisible;
    }

    public void clickAddDepartment() {
        waitUtil.safeClick(addBtn);
        waitUtil.waitForElementVisible(nameInput);
    }

    public void fillDepartmentDetails(String name, String manager, String location, String status) {
        waitUtil.waitForElementVisible(nameInput).clear();
        driver.findElement(nameInput).sendKeys(name);
        
        driver.findElement(managerInput).clear();
        driver.findElement(managerInput).sendKeys(manager);
        
        driver.findElement(locationInput).clear();
        driver.findElement(locationInput).sendKeys(location);
        
        driver.findElement(statusSelect).sendKeys(status);
    }

    public void saveDepartment() {
        waitUtil.safeClick(saveBtn);
        waitUtil.waitForDemo();
    }

    public void searchDepartment(String searchText) {
        WebElement search = waitUtil.waitForElementVisible(searchInput);
        search.clear();
        search.sendKeys(searchText);
        waitUtil.waitForDemo();
    }

    public boolean isDepartmentVisible(String name) {
        List<WebElement> rows = driver.findElements(tableRows);
        for (WebElement row : rows) {
            if (row.getText().contains(name)) {
                return true;
            }
        }
        return false;
    }

    public void editDepartment(String oldName, String newName) {
        searchDepartment(oldName);
        By editIcon = By.xpath("//tr[contains(.,'" + oldName + "')]//button[contains(@class,'edit')]");
        waitUtil.safeClick(editIcon);
        
        waitUtil.waitForElementVisible(nameInput);
        WebElement nameField = driver.findElement(nameInput);
        // workaround for React input clearing
        nameField.sendKeys(org.openqa.selenium.Keys.CONTROL + "a");
        nameField.sendKeys(org.openqa.selenium.Keys.BACK_SPACE);
        nameField.sendKeys(newName);
        
        saveDepartment();
    }

    public void deleteDepartment(String name) {
        searchDepartment(name);
        By deleteIcon = By.xpath("//tr[contains(.,'" + name + "')]//button[contains(@class,'delete')]");
        waitUtil.safeClick(deleteIcon);
        
        // Handle window confirm dialog
        waitUtil.waitForDemo();
        driver.switchTo().alert().accept();
        waitUtil.waitForDemo();
    }
}

