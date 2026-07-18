package com.employee.utilities;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class WaitUtility {

    private WebDriver driver;
    private WebDriverWait wait;
    private JavascriptExecutor js;

    public WaitUtility(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        this.js = (JavascriptExecutor) driver;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DEMO PAUSE UTILITIES
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Pauses execution for the given number of seconds.
     * Use ONLY for demo / observation purposes — NOT for synchronization.
     * All synchronization is handled by WebDriverWait methods below.
     *
     * @param seconds number of seconds to pause
     */
    public void pauseExecution(int seconds) {
        try {
            System.out.println("[DEMO] Pausing for " + seconds + " second(s)...");
            Thread.sleep(seconds * 1000L);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println("[DEMO] Pause interrupted.");
        }
    }

    /**
     * Convenience wrapper — pauses for the standard 3-second demo interval.
     * Call this after every major user action so the tester can observe it.
     */
    public void waitForDemo() {
        pauseExecution(3);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SYNCHRONIZATION UTILITIES  (WebDriverWait — production-grade)
    // ─────────────────────────────────────────────────────────────────────────

    public void waitForPageToLoad() {
        wait.until(webDriver -> js.executeScript("return document.readyState").equals("complete"));
    }

    public WebElement waitForElementClickable(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    public WebElement waitForElementVisible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    public boolean isElementVisible(By locator) {
        return isElementVisible(locator, 3);
    }

    public boolean isElementVisible(By locator, int timeoutSeconds) {
        try {
            WebDriverWait shortWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
            shortWait.until(ExpectedConditions.visibilityOfElementLocated(locator));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void waitForModalToClose() {
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className("modal")));
    }

    public void waitForOverlayToDisappear() {
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className("modal-backdrop")));
    }

    public void scrollIntoView(WebElement element) {
        js.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SAFE CLICK  (retry + JS fallback — no demo pause here)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Clicks an element safely: waits until clickable, scrolls into view,
     * retries on ElementClickInterceptedException, and falls back to a JS click.
     * The caller is responsible for calling waitForDemo() after this if needed.
     */
    public void safeClick(By locator) {
        waitForPageToLoad();
        WebElement element = null;
        int maxRetries = 3;

        for (int i = 0; i < maxRetries; i++) {
            try {
                element = waitForElementClickable(locator);
                scrollIntoView(element);

                // Short stabilisation pause — not a demo pause
                pauseExecution(0); // effectively instant; keeps the pattern consistent
                element.click();
                return; // success
            } catch (Exception e) {
                System.out.println("[safeClick] Attempt " + (i + 1) + " failed for: "
                        + locator + " | Reason: " + e.getClass().getSimpleName());
                if (i == maxRetries - 1 && element != null) {
                    System.out.println("[safeClick] Falling back to JavaScript click for: " + locator);
                    js.executeScript("arguments[0].click();", element);
                    return;
                }
                // Brief retry pause (not a demo pause)
                try { Thread.sleep(500); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
            }
        }
    }
}
