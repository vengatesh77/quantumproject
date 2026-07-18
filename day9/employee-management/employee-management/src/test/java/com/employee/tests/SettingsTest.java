package com.employee.tests;

import com.employee.base.BaseTest;
import com.employee.pages.SettingsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class SettingsTest extends BaseTest {

    @Test(priority = 26, description = "Verify navigation to Settings page")
    public void verifySettingsPage() {
        System.out.println("Opening Settings...");
        SettingsPage page = new SettingsPage(driver);
        page.navigateTo();
        
        Assert.assertTrue(page.isPageLoaded(), "Settings page failed to load.");
        System.out.println("Settings Loaded Successfully\n");
    }

    @Test(priority = 27, description = "Update Admin Profile")
    public void testUpdateProfile() {
        System.out.println("Updating Admin Profile...");
        SettingsPage page = new SettingsPage(driver);
        
        page.updateProfile("Super Admin", "super@admin.com", "1234567890");
        Assert.assertTrue(page.isSuccessMessageVisible(), "FAIL — Profile update success message not visible.");
    }

    @Test(priority = 28, description = "Change Password")
    public void testChangePassword() {
        System.out.println("Changing Password...");
        SettingsPage page = new SettingsPage(driver);
        
        page.changePassword("admin123", "admin321", "admin321");
        Assert.assertTrue(page.isSuccessMessageVisible(), "FAIL — Password change success message not visible.");
        
        // Change it back to original for subsequent test runs
        page.changePassword("admin321", "admin123", "admin123");
    }
}
