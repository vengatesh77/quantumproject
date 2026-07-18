Feature: Employee Management

  Background:
    Given the user is on the login page

  Scenario: Scenario 1 - Open Employee Page
    Given the user logs in as admin
    When the user navigates to the employee page
    Then the employee list should be displayed

  Scenario: Scenario 2 - Verify Employee List is displayed
    Then the employee list should be displayed

  Scenario: Scenario 3 - Search Employee
    When the user searches for an employee
    Then the search results should be displayed

  Scenario: Scenario 4 - Add Employee
    When the user adds a new employee
    Then the new employee should be saved

  Scenario: Scenario 5 - Verify Employee Added
    Then the added employee should be in the list

  Scenario: Scenario 6 - Edit Employee
    When the user edits the employee
    Then the changes should be saved

  Scenario: Scenario 7 - Verify Employee Updated
    Then the employee details should be updated

  Scenario: Scenario 8 - Delete Employee
    When the user deletes the employee
    Then the employee should be removed from the list

  Scenario: Scenario 9 - Verify Employee Deleted
    Then the deleted employee should not be in the list

  Scenario: Scenario 10 - Logout
    When the user logs out
    Then the user should be on the login page
