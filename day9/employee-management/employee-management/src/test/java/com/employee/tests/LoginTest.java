package com.employee.tests;

import com.employee.base.BaseTest;
import com.employee.utilities.WaitUtility;
import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * LoginTest — Verifies that the @BeforeSuite login in BaseTest was successful.
 *
 * Since login is performed once in @BeforeSuite, this test class
 * validates the post-login application state:
 *   1. URL must NOT contain "/login" (we should be on the dashboard)
 *   2. The sidebar logout button must be visible (proves authenticated session)
 *
 * Priority = 0 → runs first in the sequential suite.
 */
public class LoginTest extends BaseTest {

    @Test(
        priority    = 0,
        description = "Verify admin can login with valid credentials and land on the dashboard"
    )
    public void verifySuccessfulLogin() {
        System.out.println("[LOGIN TEST] Verifying post-login application state...");

        WaitUtility waitUtil = new WaitUtility(driver);

        // ── Assertion 1: URL should NOT be the login page ─────────────────────
        String currentUrl = driver.getCurrentUrl();
        System.out.println("[LOGIN TEST] Current URL after login: " + currentUrl);

        Assert.assertFalse(
            currentUrl.contains("/login"),
            "FAIL — Still on login page after @BeforeSuite login. URL: " + currentUrl
        );
        System.out.println("[LOGIN TEST] PASS — URL is not the login page.");

        // ── Assertion 2: Sidebar logout button is visible ─────────────────────
        // The logout button appears only for authenticated users (requires React Router + ProtectedRoute)
        boolean logoutVisible = false;
        try {
            waitUtil.waitForElementVisible(By.cssSelector(".sidebar-link.logout-link"));
            logoutVisible = true;
        } catch (Exception e) {
            System.out.println("[LOGIN TEST] Sidebar logout not found: " + e.getMessage());
        }

        Assert.assertTrue(
            logoutVisible,
            "FAIL — Sidebar logout button not visible. Login may have failed or app did not render."
        );
        System.out.println("[LOGIN TEST] PASS — Sidebar logout button is visible (authenticated session confirmed).");

        waitUtil.waitForDemo();
        System.out.println("[LOGIN TEST] ✅ Login verification PASSED.");
    }
}
