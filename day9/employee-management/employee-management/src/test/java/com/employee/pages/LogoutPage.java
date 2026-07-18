package com.employee.pages;

import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * LogoutPage — Handles the logout action from the sidebar.
 *
 * Responsibilities:
 *  - Click the Logout button in the sidebar footer
 *  - Accept the browser confirm("Are you sure you want to logout?") dialog
 *  - Wait for redirect to /login page
 *  - Verify the login page URL and elements
 *
 * Locators based on Sidebar.jsx:
 *  - Logout button: className="sidebar-link logout-link"
 *  - Login page indicator: URL contains "/login" after redirect
 */
public class LogoutPage {

    private final WebDriver driver;
    private final WaitUtility waitUtil;

    // ── Locators ─────────────────────────────────────────────────────────────

    // Logout button in the sidebar footer
    private final By logoutBtn      = By.cssSelector(".sidebar-link.logout-link");

    // Login page elements (used to verify redirect)
    private final By loginUsernameField = By.id("username");
    private final By loginBtn           = By.id("loginBtn");

    public LogoutPage(WebDriver driver) {
        this.driver   = driver;
        this.waitUtil = new WaitUtility(driver);
    }

    // ── Page Actions ─────────────────────────────────────────────────────────

    /**
     * Clicks the Logout button in the sidebar.
     */
    public void clickLogout() {
        waitUtil.safeClick(logoutBtn);
        System.out.println("[LOGOUT] Logout button clicked.");
        waitUtil.waitForDemo();
    }

    /**
     * Accepts the browser confirm() dialog shown by the logout handler.
     * Sidebar.jsx calls: window.confirm('Are you sure you want to logout?')
     * If the dialog does not appear within 5 seconds, logs and continues
     * (some React router setups may skip it).
     */
    public void acceptLogoutConfirm() {
        try {
            WebDriverWait alertWait = new WebDriverWait(driver, Duration.ofSeconds(5));
            alertWait.until(ExpectedConditions.alertIsPresent());
            driver.switchTo().alert().accept();
            System.out.println("[LOGOUT] Logout confirmation dialog accepted.");
        } catch (Exception e) {
            System.out.println("[LOGOUT] No confirm dialog appeared — " +
                    "redirect may happen directly.");
        }
        waitUtil.waitForDemo();
    }

    /**
     * Waits for the browser to redirect to the /login page.
     * Times out after 10 seconds.
     */
    public void waitForLoginPage() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            wait.until(ExpectedConditions.urlContains("/login"));
            System.out.println("[LOGOUT] Redirected to login page: " + driver.getCurrentUrl());
        } catch (Exception e) {
            System.out.println("[LOGOUT] WARNING — did not redirect to /login within 10s. " +
                    "Current URL: " + driver.getCurrentUrl());
        }
        waitUtil.waitForDemo();
    }

    /**
     * Complete logout flow: click Logout → accept confirm → wait for /login redirect.
     */
    public void logout() {
        clickLogout();
        acceptLogoutConfirm();
        waitForLoginPage();
        System.out.println("[LOGOUT] Logout complete.");
    }

    // ── Verification Helpers ─────────────────────────────────────────────────

    /**
     * Returns true if the current URL contains "/login".
     * This confirms the user was successfully logged out and redirected.
     */
    public boolean isOnLoginPage() {
        boolean onLogin = driver.getCurrentUrl().contains("/login");
        System.out.println("[LOGOUT] Is on login page: " + onLogin
                + " | URL: " + driver.getCurrentUrl());
        return onLogin;
    }

    /**
     * Returns true if the username input field on the login page is visible.
     * More robust check than URL alone.
     */
    public boolean isLoginFormVisible() {
        try {
            waitUtil.waitForElementVisible(loginUsernameField);
            System.out.println("[LOGOUT] Login form is visible — logout confirmed.");
            return true;
        } catch (Exception e) {
            System.out.println("[LOGOUT] Login form NOT visible: " + e.getMessage());
            return false;
        }
    }
}
