package pages;

import com.employee.pages.AddEmployeePage;
import com.employee.pages.DeleteEmployeePage;
import com.employee.pages.EditEmployeePage;
import com.employee.pages.SearchEmployeePage;
import org.openqa.selenium.WebDriver;

public class EmployeePage {

    private final com.employee.pages.EmployeePage baseEmployeePage;
    private final AddEmployeePage addEmployeePage;
    private final EditEmployeePage editEmployeePage;
    private final DeleteEmployeePage deleteEmployeePage;
    private final SearchEmployeePage searchEmployeePage;

    public EmployeePage(WebDriver driver) {
        this.baseEmployeePage = new com.employee.pages.EmployeePage(driver);
        this.addEmployeePage = new AddEmployeePage(driver);
        this.editEmployeePage = new EditEmployeePage(driver);
        this.deleteEmployeePage = new DeleteEmployeePage(driver);
        this.searchEmployeePage = new SearchEmployeePage(driver);
    }

    public void navigateTo() {
        baseEmployeePage.navigateTo();
    }

    public boolean isEmployeeListDisplayed() {
        return baseEmployeePage.isTableVisible();
    }

    public void searchEmployee(String name) {
        searchEmployeePage.searchFor(name);
    }

    public boolean isSearchResultDisplayed(String expectedName) {
        return searchEmployeePage.isEmployeeNameVisible(expectedName);
    }

    public void addEmployee(String name, String email, String phone, String salary, String department, String date) {
        addEmployeePage.addEmployee(name, email, phone, salary, department, date);
    }

    public String getFirstEmployeeName() {
        return addEmployeePage.getFirstEmployeeNameInTable();
    }

    public void editFirstEmployee(String newName) {
        editEmployeePage.editFirstEmployeeName(newName);
    }

    public void deleteFirstEmployee() {
        deleteEmployeePage.deleteFirstEmployee();
    }
}
