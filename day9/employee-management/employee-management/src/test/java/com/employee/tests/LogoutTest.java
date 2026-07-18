package com.employee.tests;

import com.employee.base.BaseTest;
import com.employee.pages.LogoutPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LogoutTest extends BaseTest {

    @Test(priority = 9, description = "Verify user can logout and is redirected to the login page")
    public void verifyLogout() {
        System.out.println("Logging out...");
        
        LogoutPage logoutPage = new LogoutPage(driver);
        logoutPage.logout();

        boolean onLoginPage = logoutPage.isOnLoginPage();
        Assert.assertTrue(onLoginPage, "FAIL — After logout, URL does not contain '/login'.");

        boolean loginFormVisible = logoutPage.isLoginFormVisible();
        Assert.assertTrue(loginFormVisible, "FAIL — Login form is not visible after logout.");

        System.out.println("Logout Successful\n");
    }
}

