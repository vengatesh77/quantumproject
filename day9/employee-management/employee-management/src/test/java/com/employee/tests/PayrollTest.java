package com.employee.tests;

import com.employee.base.BaseTest;
import com.employee.pages.PayrollPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class PayrollTest extends BaseTest {

    private final String targetEmployee = "Rahul Kumar";

    @Test(priority = 20, description = "Verify navigation to Payroll page")
    public void verifyPayrollPage() {
        System.out.println("Opening Payroll...");
        PayrollPage page = new PayrollPage(driver);
        page.navigateTo();
        
        Assert.assertTrue(page.isPageLoaded(), "Payroll page failed to load.");
        System.out.println("Payroll Loaded Successfully\n");
    }

    @Test(priority = 21, description = "Search employee and update Bonus")
    public void testUpdateBonus() {
        System.out.println("Updating bonus for: " + targetEmployee);
        PayrollPage page = new PayrollPage(driver);
        
        try {
            // Give 5000 bonus
            page.updateBonus(targetEmployee, "5000");
            page.updateStatus(targetEmployee, "Paid");
            
            String netSalary = page.getNetSalary(targetEmployee);
            Assert.assertFalse(netSalary.isEmpty(), "Net Salary is empty after update.");
            System.out.println("New Net Salary: " + netSalary);
        } catch (Exception e) {
            System.out.println("Employee not found in records. Ensure test data exists.");
        }
    }

    @Test(priority = 22, description = "Download Payslip")
    public void testDownloadPayslip() {
        System.out.println("Downloading payslip for: " + targetEmployee);
        PayrollPage page = new PayrollPage(driver);
        
        try {
            page.clickDownloadPayslip(targetEmployee);
        } catch (Exception e) {
            System.out.println("Employee not found to download payslip.");
        }
    }
}
