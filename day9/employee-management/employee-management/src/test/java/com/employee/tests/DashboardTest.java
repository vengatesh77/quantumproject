package com.employee.tests;

import com.employee.base.BaseTest;
import com.employee.pages.DashboardPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DashboardTest extends BaseTest {

    @Test(priority = 1, description = "Verify navigation to Dashboard module and check all widgets")
    public void verifyDashboard() {
        System.out.println("Opening Dashboard...");

        DashboardPage page = new DashboardPage(driver);
        // It's the first page after login, so we're already here, but let's ensure it's loaded
        Assert.assertTrue(page.isDashboardLoaded(), "Dashboard failed to load.");
        
        System.out.println("Verifying Dashboard statistics...");
        
        String totalEmployees = page.getTotalEmployees();
        Assert.assertFalse(totalEmployees.isEmpty(), "Total Employees is empty.");
        
        String activeEmployees = page.getActiveEmployees();
        Assert.assertFalse(activeEmployees.isEmpty(), "Active Employees is empty.");
        
        String departments = page.getDepartments();
        Assert.assertFalse(departments.isEmpty(), "Departments is empty.");
        
        String salary = page.getMonthlySalary();
        Assert.assertFalse(salary.isEmpty(), "Monthly Salary is empty.");
        
        Assert.assertTrue(page.isAttendanceWidgetVisible(), "Attendance widget missing.");
        Assert.assertTrue(page.isCompanyNoticesVisible(), "Company notices missing.");
        Assert.assertTrue(page.isUpcomingEventsVisible(), "Upcoming events missing.");
        
        System.out.println("Dashboard Loaded Successfully\n");
    }
}
