package com.employee.pages;

import com.employee.utilities.NavigationUtil;
import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class SettingsPage {

    private final WebDriver driver;
    private final NavigationUtil nav;
    private final WaitUtility waitUtil;

    public static final String PAGE_NAME    = "Settings";
    public static final String URL_SEGMENT  = "settings";
    public static final String HEADING_TEXT = "Settings";

    // ── Locators ─────────────────────────────────────────────────────────────
    // Profile
    private final By fullNameInput  = By.xpath("//label[text()='Full Name']/following-sibling::input");
    private final By emailInput     = By.xpath("//label[text()='Email Address']/following-sibling::input");
    private final By phoneInput     = By.xpath("//label[text()='Phone']/following-sibling::input");
    private final By saveProfileBtn = By.xpath("//button[contains(normalize-space(),'Save Profile')]");
    
    // Password
    private final By currentPwdInput= By.xpath("//label[text()='Current Password']/following-sibling::div/input");
    private final By newPwdInput    = By.xpath("//label[text()='New Password']/following-sibling::div/input");
    private final By confirmPwdInput= By.xpath("//label[text()='Confirm New Password']/following-sibling::div/input");
    private final By updatePwdBtn   = By.xpath("//button[contains(normalize-space(),'Update Password')]");
    
    // Messages
    private final By successMsg     = By.className("success-msg");

    public SettingsPage(WebDriver driver) {
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
        boolean headingVisible = nav.isHeadingVisible(HEADING_TEXT);
        return urlOk && headingVisible;
    }

    public void updateProfile(String name, String email, String phone) {
        waitUtil.waitForElementVisible(fullNameInput).clear();
        driver.findElement(fullNameInput).sendKeys(name);
        
        driver.findElement(emailInput).clear();
        driver.findElement(emailInput).sendKeys(email);
        
        driver.findElement(phoneInput).clear();
        driver.findElement(phoneInput).sendKeys(phone);
        
        waitUtil.safeClick(saveProfileBtn);
    }
    
    public void changePassword(String current, String newPass, String confirm) {
        waitUtil.waitForElementVisible(currentPwdInput).clear();
        driver.findElement(currentPwdInput).sendKeys(current);
        
        driver.findElement(newPwdInput).clear();
        driver.findElement(newPwdInput).sendKeys(newPass);
        
        driver.findElement(confirmPwdInput).clear();
        driver.findElement(confirmPwdInput).sendKeys(confirm);
        
        waitUtil.safeClick(updatePwdBtn);
    }

    public boolean isSuccessMessageVisible() {
        return waitUtil.isElementVisible(successMsg, 3);
    }
}
