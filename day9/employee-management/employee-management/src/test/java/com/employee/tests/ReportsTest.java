package com.employee.tests;

import com.employee.base.BaseTest;
import com.employee.pages.ReportsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ReportsTest extends BaseTest {

    @Test(priority = 23, description = "Verify navigation to Reports page")
    public void verifyReportsPage() {
        System.out.println("Opening Reports...");
        ReportsPage page = new ReportsPage(driver);
        page.navigateTo();
        
        Assert.assertTrue(page.isPageLoaded(), "Reports page failed to load.");
        System.out.println("Reports Loaded Successfully\n");
    }

    @Test(priority = 24, description = "Verify statistics cards load data")
    public void testVerifyStatistics() {
        System.out.println("Verifying report statistics...");
        ReportsPage page = new ReportsPage(driver);
        
        Assert.assertTrue(page.areStatsVisible(), "Statistics cards are not visible.");
        String totalEmployees = page.getTotalEmployeesStat();
        Assert.assertFalse(totalEmployees.isEmpty(), "Total employees stat is empty.");
    }

    @Test(priority = 25, description = "Export reports as PDF and Excel")
    public void testExportReports() {
        System.out.println("Exporting reports...");
        ReportsPage page = new ReportsPage(driver);
        
        page.exportPDF();
        page.exportExcel();
        System.out.println("Export triggered successfully.");
    }
}
