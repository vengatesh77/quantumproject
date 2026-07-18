package com.employee.utilities;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * NavigationUtil — Reusable sidebar navigation and page verification helper.
 *
 * Every page class delegates sidebar navigation here to avoid duplication.
 * All navigation is done via:
 *   1. Sidebar NavLink click  (preferred)
 *   2. Direct URL navigation  (fallback)
 *
 * Sidebar links in Sidebar.jsx use className="sidebar-link" with a <span>
 * containing the label text (e.g. "Dashboard", "Employees", etc.).
 */
public class NavigationUtil {

    private final WebDriver driver;
    private final WaitUtility waitUtil;

    public NavigationUtil(WebDriver driver) {
        this.driver   = driver;
        this.waitUtil = new WaitUtility(driver);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Sidebar Navigation
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Clicks a sidebar navigation link by its visible label text.
     *
     * Sidebar link XPath pattern (from Sidebar.jsx):
     *   <NavLink className="sidebar-link"><Icon/><span>Label</span><ChevronRight/></NavLink>
     *
     * @param label  The sidebar menu label, e.g. "Dashboard", "Employees"
     */
    public void clickSidebarLink(String label) {
        System.out.println("[NAV] Clicking sidebar link: " + label);

        // Primary: any element with sidebar-link class containing a span with the label text
        By primaryLocator = By.xpath(
                "//*[contains(@class,'sidebar-link') and .//span[normalize-space()='" + label + "']]");

        // Fallback: any anchor or button whose text contains the label
        By fallbackLocator = By.xpath(
                "//*[contains(@class,'sidebar-link') and contains(normalize-space(),'" + label + "')]");

        try {
            waitUtil.waitForElementClickable(primaryLocator);
            waitUtil.safeClick(primaryLocator);
        } catch (Exception e) {
            System.out.println("[NAV] Primary locator failed for '" + label + "', trying fallback.");
            waitUtil.safeClick(fallbackLocator);
        }

        waitUtil.waitForPageToLoad();
        System.out.println("[NAV] Sidebar link '" + label + "' clicked — page loading...");
    }

    /**
     * Navigates directly to a URL path (fallback for pages that can't be reached via sidebar).
     *
     * @param path  Path segment, e.g. "/departments"
     */
    public void navigateToPath(String path) {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        String fullUrl = baseUrl + path;
        driver.get(fullUrl);
        System.out.println("[NAV] Direct URL navigation to: " + fullUrl);
        waitUtil.waitForPageToLoad();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Page Verification Helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Checks if the current URL contains the expected path segment.
     *
     * @param pathSegment  e.g. "dashboard", "employees", "departments"
     * @return true if URL matches
     */
    public boolean isOnPage(String pathSegment) {
        String url = driver.getCurrentUrl();
        // Root "/" is matched by "dashboard" check as a special case
        boolean matches = url.contains(pathSegment) ||
                (pathSegment.equals("dashboard") && (url.endsWith("/") || url.endsWith("#/")));
        System.out.println("[NAV] URL check for '" + pathSegment + "': " + matches + " | URL: " + url);
        return matches;
    }

    /**
     * Waits for and returns the text of the page's <h1> element.
     * Most pages in this app use a single <h1> as their main heading.
     *
     * @param timeoutSeconds max wait time
     * @return heading text or empty string if not found
     */
    public String getPageHeading(int timeoutSeconds) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
            WebElement h1 = wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("h1")));
            String heading = h1.getText().trim();
            System.out.println("[NAV] Page heading found: '" + heading + "'");
            return heading;
        } catch (Exception e) {
            System.out.println("[NAV] WARNING — <h1> not found within " + timeoutSeconds + "s: " + e.getMessage());
            return "";
        }
    }

    /**
     * Returns true if a <h1> with the given text is visible on the page.
     *
     * @param expectedText  text to match (case-insensitive, partial match)
     */
    public boolean isHeadingVisible(String expectedText) {
        try {
            By locator = By.xpath(
                    "//h1[contains(translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ'," +
                    "'abcdefghijklmnopqrstuvwxyz'),'" + expectedText.toLowerCase() + "')]");
            waitUtil.waitForElementVisible(locator);
            System.out.println("[NAV] Heading '" + expectedText + "' is visible.");
            return true;
        } catch (Exception e) {
            System.out.println("[NAV] Heading '" + expectedText + "' NOT found.");
            return false;
        }
    }

    /**
     * Returns true if any element matching the given CSS selector is visible.
     * Use this as a supplementary check when a page doesn't have a clear <h1>.
     *
     * @param cssSelector  CSS selector of the unique element
     * @param description  human-readable description for logging
     */
    public boolean isElementVisible(String cssSelector, String description) {
        try {
            waitUtil.waitForElementVisible(By.cssSelector(cssSelector));
            System.out.println("[NAV] Element visible: " + description);
            return true;
        } catch (Exception e) {
            System.out.println("[NAV] Element NOT visible: " + description + " | " + e.getMessage());
            return false;
        }
    }

    /**
     * Demo pause — 3 seconds for visualization only.
     * Not for synchronization (use WebDriverWait methods for that).
     */
    public void demoPause() {
        waitUtil.waitForDemo();
    }

    /** Expose the underlying WaitUtility for callers that need it. */
    public WaitUtility getWaitUtil() {
        return waitUtil;
    }
}
