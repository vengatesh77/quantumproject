package com.employee.utilities;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Reads key-value pairs from config.properties on the classpath.
 * Using getResourceAsStream ensures this works regardless of the
 * working directory Maven sets during test execution.
 */
public class ConfigReader {

    private static final Properties properties = new Properties();

    static {
        try (InputStream stream = ConfigReader.class
                .getClassLoader()
                .getResourceAsStream("config.properties")) {

            if (stream == null) {
                throw new RuntimeException(
                        "config.properties not found on classpath. " +
                        "Ensure src/test/resources/config.properties exists.");
            }
            properties.load(stream);

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to load config.properties: " + e.getMessage());
        }
    }

    public static String getProperty(String key) {
        String value = properties.getProperty(key);
        if (value == null) {
            throw new RuntimeException("Property '" + key + "' not found in config.properties");
        }
        return value.trim();
    }
}
