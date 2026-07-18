package hooks;

import com.employee.pages.LoginPage;
import com.employee.utilities.ConfigReader;
import com.employee.utilities.DriverFactory;
import com.employee.utilities.WaitUtility;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

public class Hooks {

    private static boolean isInitialized = false;
    private WebDriver driver;

    @Before
    public void setUp() {
        if (!isInitialized) {
            System.out.println("╔══════════════════════════════════════════════╗");
            System.out.println("║   Cucumber BDD Suite — STARTING              ║");
            System.out.println("╚══════════════════════════════════════════════╝");

            String browser = ConfigReader.getProperty("browser");
            int timeout = Integer.parseInt(ConfigReader.getProperty("timeout"));

            // 1. Open browser (once for all scenarios)
            DriverFactory.initDriver(browser, timeout);
            WebDriver suiteDriver = DriverFactory.getDriver();
            System.out.println("[HOOKS] Browser opened: " + browser.toUpperCase());

            // We do not login here in the hook, because the first scenario covers login.
            // Wait, the user said "11. Login only once." and the first scenario is:
            // "Given the user logs in as admin".
            // Let's just navigate to login page, and let the step definition do the login.
            String baseUrl = ConfigReader.getProperty("baseUrl");
            suiteDriver.get(baseUrl + "/login");
            System.out.println("[HOOKS] Navigated to: " + baseUrl + "/login");

            WaitUtility waitUtil = new WaitUtility(suiteDriver);
            waitUtil.waitForPageToLoad();
            waitUtil.waitForDemo();

            isInitialized = true;
        }
        
        this.driver = DriverFactory.getDriver();
    }

    @After
    public void tearDown(Scenario scenario) {
        if (scenario.isFailed()) {
            System.out.println("[HOOKS] Scenario failed. Capturing screenshot...");
            try {
                final byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
                scenario.attach(screenshot, "image/png", "Failed_Screenshot");
            } catch (Exception e) {
                System.out.println("Failed to capture screenshot: " + e.getMessage());
            }
        }
        // Note: We don't quit the driver here to keep the browser open for all scenarios.
    }

    @io.cucumber.java.AfterAll
    public static void afterAll() {
        System.out.println("\n╔══════════════════════════════════════════════╗");
        System.out.println("║   Cucumber BDD Suite — FINISHED              ║");
        System.out.println("╚══════════════════════════════════════════════╝");
        DriverFactory.quitDriver();
    }
}
