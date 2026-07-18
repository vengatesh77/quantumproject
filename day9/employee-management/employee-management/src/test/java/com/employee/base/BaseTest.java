package com.employee.base;

import com.employee.pages.LoginPage;
import com.employee.utilities.ConfigReader;
import com.employee.utilities.DriverFactory;
import com.employee.utilities.WaitUtility;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeSuite;

/**
 * BaseTest — Foundation class for the entire POM framework.
 *
 * Lifecycle:
 *   @BeforeSuite  → Open browser once + Login once for the whole suite
 *   @BeforeClass  → Assign shared driver to each test class
 *   @AfterSuite   → Quit browser after all tests finish
 *
 * Why no @BeforeMethod navigation?
 *   Every test class is responsible for its own page state.
 *   Injecting a redirect in @BeforeMethod breaks tests that intentionally
 *   navigate to specific pages (e.g. LogoutTest redirects to /login).
 */
public class BaseTest {

    /** Shared driver reference — set by @BeforeClass for every test class. */
    protected WebDriver driver;

    // ─────────────────────────────────────────────────────────────────────────
    // @BeforeSuite — runs ONCE before the entire test suite
    // ─────────────────────────────────────────────────────────────────────────

    @BeforeSuite
    public void setUpSuite() {
        System.out.println("╔══════════════════════════════════════════════╗");
        System.out.println("║   Employee Management POM Suite — STARTING   ║");
        System.out.println("╚══════════════════════════════════════════════╝");

        String browser = ConfigReader.getProperty("browser");
        int    timeout = Integer.parseInt(ConfigReader.getProperty("timeout"));

        // 1. Open browser (once for the whole suite)
        DriverFactory.initDriver(browser, timeout);
        WebDriver suiteDriver = DriverFactory.getDriver();
        System.out.println("[SUITE] Browser opened: " + browser.toUpperCase());

        WaitUtility waitUtil = new WaitUtility(suiteDriver);

        // 2. Navigate to application
        String baseUrl = ConfigReader.getProperty("baseUrl");
        suiteDriver.get(baseUrl + "/login");
        System.out.println("[SUITE] Navigated to: " + baseUrl + "/login");
        waitUtil.waitForPageToLoad();
        waitUtil.waitForDemo();

        // 3. Login ONCE — all subsequent tests inherit this authenticated session
        String username = ConfigReader.getProperty("username");
        String password = ConfigReader.getProperty("password");
        LoginPage loginPage = new LoginPage(suiteDriver);
        loginPage.loginAs(username, password);
        System.out.println("[SUITE] Login completed as: " + username);
        waitUtil.waitForDemo();

        System.out.println("[SUITE] Suite setup complete — browser session is ready.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // @BeforeClass — runs before each test class to assign the shared driver
    // ─────────────────────────────────────────────────────────────────────────

    @BeforeClass
    public void setUpClass() {
        this.driver = DriverFactory.getDriver();
        System.out.println("\n─── Starting: " + this.getClass().getSimpleName() + " ───");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // @AfterSuite — runs ONCE after all tests finish
    // ─────────────────────────────────────────────────────────────────────────

    @AfterSuite
    public void tearDownSuite() {
        System.out.println("\n╔══════════════════════════════════════════════╗");
        System.out.println("║   Employee Management POM Suite — FINISHED   ║");
        System.out.println("╚══════════════════════════════════════════════╝");
        DriverFactory.quitDriver();
    }
}
