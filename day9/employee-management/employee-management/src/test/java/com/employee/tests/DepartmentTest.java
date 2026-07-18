package com.employee.tests;

import com.employee.base.BaseTest;
import com.employee.pages.DepartmentPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DepartmentTest extends BaseTest {

    private final String testDeptName = "Test Dept Auto";
    private final String editedDeptName = "Test Dept Edited";

    @Test(priority = 7, description = "Verify navigation to Departments page")
    public void verifyDepartmentsPage() {
        System.out.println("Opening Departments...");
        DepartmentPage page = new DepartmentPage(driver);
        page.navigateTo();
        
        Assert.assertTrue(page.isPageLoaded(), "Departments page failed to load.");
        System.out.println("Departments Loaded Successfully\n");
    }

    @Test(priority = 8, description = "Add a new Department")
    public void testAddDepartment() {
        System.out.println("Adding Department: " + testDeptName);
        DepartmentPage page = new DepartmentPage(driver);
        page.clickAddDepartment();
        page.fillDepartmentDetails(testDeptName, "John Manager", "New York", "Active");
        page.saveDepartment();
    }

    @Test(priority = 9, description = "Search for the newly added Department")
    public void testSearchDepartment() {
        System.out.println("Searching Department: " + testDeptName);
        DepartmentPage page = new DepartmentPage(driver);
        page.searchDepartment(testDeptName);
        
        boolean found = page.isDepartmentVisible(testDeptName);
        Assert.assertTrue(found, "FAIL — Newly added department not found.");
    }

    @Test(priority = 10, description = "Edit the newly added Department")
    public void testEditDepartment() {
        System.out.println("Editing Department: " + testDeptName);
        DepartmentPage page = new DepartmentPage(driver);
        page.editDepartment(testDeptName, editedDeptName);
        
        page.searchDepartment(editedDeptName);
        boolean foundEdited = page.isDepartmentVisible(editedDeptName);
        Assert.assertTrue(foundEdited, "FAIL — Edited department name not found.");
    }

    @Test(priority = 11, description = "Delete the newly edited Department")
    public void testDeleteDepartment() {
        System.out.println("Deleting Department: " + editedDeptName);
        DepartmentPage page = new DepartmentPage(driver);
        page.deleteDepartment(editedDeptName);
        
        page.searchDepartment(editedDeptName);
        boolean isStillVisible = page.isDepartmentVisible(editedDeptName);
        Assert.assertFalse(isStillVisible, "FAIL — Department was not deleted.");
    }
}
