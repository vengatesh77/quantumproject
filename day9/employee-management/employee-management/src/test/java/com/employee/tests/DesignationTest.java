package com.employee.tests;

import com.employee.base.BaseTest;
import com.employee.pages.DesignationPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DesignationTest extends BaseTest {

    private final String testTitle = "Test Role Auto";
    private final String editedTitle = "Test Role Edited";

    @Test(priority = 12, description = "Verify navigation to Designations page")
    public void verifyDesignationsPage() {
        System.out.println("Opening Designations...");
        DesignationPage page = new DesignationPage(driver);
        page.navigateTo();
        
        Assert.assertTrue(page.isPageLoaded(), "Designations page failed to load.");
        System.out.println("Designations Loaded Successfully\n");
    }

    @Test(priority = 13, description = "Add a new Designation")
    public void testAddDesignation() {
        System.out.println("Adding Designation: " + testTitle);
        DesignationPage page = new DesignationPage(driver);
        page.clickAddDesignation();
        // Provide a valid department to pass HTML5 validation
        page.fillDesignationDetails(testTitle, "Human Resources", "50000", "80000", "2-4 Years", "Active");
        page.saveDesignation();
    }

    @Test(priority = 14, description = "Search for the newly added Designation")
    public void testSearchDesignation() {
        System.out.println("Searching Designation: " + testTitle);
        DesignationPage page = new DesignationPage(driver);
        page.searchDesignation(testTitle);
        
        boolean found = page.isDesignationVisible(testTitle);
        Assert.assertTrue(found, "FAIL — Newly added designation not found.");
    }

    @Test(priority = 15, description = "Edit the newly added Designation")
    public void testEditDesignation() {
        System.out.println("Editing Designation: " + testTitle);
        DesignationPage page = new DesignationPage(driver);
        page.editDesignation(testTitle, editedTitle);
        
        page.searchDesignation(editedTitle);
        boolean foundEdited = page.isDesignationVisible(editedTitle);
        Assert.assertTrue(foundEdited, "FAIL — Edited designation name not found.");
    }

    @Test(priority = 16, description = "Delete the newly edited Designation")
    public void testDeleteDesignation() {
        System.out.println("Deleting Designation: " + editedTitle);
        DesignationPage page = new DesignationPage(driver);
        page.deleteDesignation(editedTitle);
        
        page.searchDesignation(editedTitle);
        boolean isStillVisible = page.isDesignationVisible(editedTitle);
        Assert.assertFalse(isStillVisible, "FAIL — Designation was not deleted.");
    }
}
