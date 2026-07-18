package com.employee.tests;

import com.employee.base.BaseTest;
import com.employee.pages.AttendancePage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class AttendanceTest extends BaseTest {

    // Use an employee from the seeded data that won't be deleted by EmployeeTest
    private final String targetEmployee = "Rahul Kumar";

    @Test(priority = 17, description = "Verify navigation to Attendance page")
    public void verifyAttendancePage() {
        System.out.println("Opening Attendance...");
        AttendancePage page = new AttendancePage(driver);
        page.navigateTo();
        
        Assert.assertTrue(page.isPageLoaded(), "Attendance page failed to load.");
        System.out.println("Attendance Loaded Successfully\n");
    }

    @Test(priority = 18, description = "Generate today's attendance records")
    public void testGenerateRecords() {
        System.out.println("Generating attendance records...");
        AttendancePage page = new AttendancePage(driver);
        page.clickGenerateRecords();
    }

    @Test(priority = 19, description = "Mark attendance as Absent")
    public void testMarkAttendance() {
        System.out.println("Marking attendance for: " + targetEmployee);
        AttendancePage page = new AttendancePage(driver);
        
        try {
            // Because seed data is mostly Present, change to Absent to ensure a state change
            page.markAttendance(targetEmployee, "Absent");
            boolean isAbsent = page.verifyAttendanceStatus(targetEmployee, "Absent");
            Assert.assertTrue(isAbsent, "FAIL — Attendance status did not update to Absent.");
        } catch (Exception e) {
            System.out.println("Employee not found in records. Ensure test data exists.");
        }
    }
}
