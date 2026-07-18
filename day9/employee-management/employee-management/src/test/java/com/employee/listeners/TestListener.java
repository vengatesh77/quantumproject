package com.employee.listeners;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.employee.utilities.DriverFactory;
import com.employee.utilities.ExtentManager;
import com.employee.utilities.ScreenshotUtility;
import org.openqa.selenium.WebDriver;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class TestListener implements ITestListener {

    private static ExtentReports extent = ExtentManager.getInstance();
    private static ThreadLocal<ExtentTest> test = new ThreadLocal<>();

    @Override
    public void onTestStart(ITestResult result) {
        ExtentTest extentTest = extent.createTest(result.getMethod().getMethodName(), result.getMethod().getDescription());
        test.set(extentTest);
        test.get().log(Status.INFO, result.getMethod().getMethodName() + " started.");
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        test.get().log(Status.PASS, "Test Passed");
    }

    @Override
    public void onTestFailure(ITestResult result) {
        test.get().log(Status.FAIL, "Test Failed: " + result.getThrowable().getMessage());
        
        WebDriver driver = DriverFactory.getDriver();
        if (driver != null) {
            String screenshotPath = ScreenshotUtility.captureScreenshot(driver, result.getMethod().getMethodName());
            if (!screenshotPath.isEmpty()) {
                test.get().addScreenCaptureFromPath(screenshotPath);
            }
        }
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        String reason = (result.getThrowable() != null)
                ? result.getThrowable().getMessage()
                : "Skipped due to dependency failure";
        test.get().log(Status.SKIP, "Test Skipped: " + reason);
    }

    @Override
    public void onFinish(ITestContext context) {
        if (extent != null) {
            extent.flush();
        }
    }
}
