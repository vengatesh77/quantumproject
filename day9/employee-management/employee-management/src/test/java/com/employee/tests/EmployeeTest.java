package com.employee.tests;

import com.employee.base.BaseTest;
import com.employee.pages.*;
import org.testng.Assert;
import org.testng.annotations.Test;

public class EmployeeTest extends BaseTest {

    private final String testEmpName = "TestEmp Auto";
    private final String editedEmpName = "TestEmp Edited";

    @Test(priority = 3, description = "Verify navigation to Employee List page")
    public void verifyEmployeePage() {
        System.out.println("Opening Employees List...");
        EmployeePage empPage = new EmployeePage(driver);
        empPage.navigateTo();
        
        Assert.assertTrue(empPage.isTableVisible(), "Employee List page failed to load.");
        System.out.println("Employee List Loaded Successfully\n");
    }

    @Test(priority = 4, description = "Add a new Employee")
    public void testAddEmployee() {
        System.out.println("Adding Employee: " + testEmpName);
        AddEmployeePage addPage = new AddEmployeePage(driver);
        addPage.addEmployee(testEmpName, "auto@test.com", "9999999999", "80000", "Engineering", "2026-07-01");
    }

    @Test(priority = 5, description = "Search for the newly added Employee")
    public void testSearchEmployee() {
        System.out.println("Searching Employee: " + testEmpName);
        SearchEmployeePage searchPage = new SearchEmployeePage(driver);
        searchPage.searchFor(testEmpName);
        
        boolean found = searchPage.isEmployeeNameVisible(testEmpName);
        Assert.assertTrue(found, "FAIL — Newly added employee not found in search results.");
    }

    @Test(priority = 6, description = "Edit the newly added Employee")
    public void testEditEmployee() {
        System.out.println("Editing Employee: " + testEmpName);
        SearchEmployeePage searchPage = new SearchEmployeePage(driver);
        searchPage.searchFor(testEmpName);

        EditEmployeePage editPage = new EditEmployeePage(driver);
        editPage.editFirstEmployeeName(editedEmpName);
        
        searchPage.searchFor(editedEmpName);
        boolean foundEdited = searchPage.isEmployeeNameVisible(editedEmpName);
        Assert.assertTrue(foundEdited, "FAIL — Edited employee name not found.");
    }

    @Test(priority = 7, description = "Delete the newly edited Employee")
    public void testDeleteEmployee() {
        System.out.println("Deleting Employee: " + editedEmpName);
        SearchEmployeePage searchPage = new SearchEmployeePage(driver);
        searchPage.searchFor(editedEmpName);

        DeleteEmployeePage deletePage = new DeleteEmployeePage(driver);
        deletePage.deleteFirstEmployee();
        
        searchPage.searchFor(editedEmpName);
        boolean isStillVisible = searchPage.isEmployeeNameVisible(editedEmpName);
        Assert.assertFalse(isStillVisible, "FAIL — Employee was not deleted.");
        
        searchPage.clearSearch();
    }
}
