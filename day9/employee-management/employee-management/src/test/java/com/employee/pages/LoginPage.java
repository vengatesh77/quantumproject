package com.employee.pages;

import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage {
    private WebDriver driver;
    private WaitUtility waitUtil;

    // Locators
    private By usernameField = By.id("username");
    private By passwordField = By.id("password");
    private By loginButton = By.id("loginBtn");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.waitUtil = new WaitUtility(driver);
    }

    public void enterUsername(String username) {
        waitUtil.waitForElementVisible(usernameField).sendKeys(username);
        System.out.println("[LOGIN] Username entered.");
        waitUtil.waitForDemo();
    }

    public void enterPassword(String password) {
        waitUtil.waitForElementVisible(passwordField).sendKeys(password);
        System.out.println("[LOGIN] Password entered.");
        waitUtil.waitForDemo();
    }

    public void clickLogin() {
        waitUtil.safeClick(loginButton);
        System.out.println("[LOGIN] Login button clicked.");
        waitUtil.waitForDemo();
    }

    public void loginAs(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }
}
