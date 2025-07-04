package rhul.cs2810.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A class representing an Employee.
 */
@Entity
@Table(name = "employee")
public class Employee {
  @Id
  @Column(nullable = false, unique = true, name = "employeeId")
  private String employeeId;
  
  //@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  @Column(nullable = false, name = "password")
  private String password;

  @Column(nullable = false, name = "firstName")
  private String firstName;

  @Column(nullable = false, name = "lastName")
  private String lastName;

  @Column(nullable = false, name = "role")
  private String role;

  /**
   * Empty Constructor
   */
  public Employee() {}

  /**
   * An Employee constructor with parameters.
   * 
   * @param employeeId the unique id of the employee
   * @param password the password of the employee to login
   */
  public Employee(String employeeId, String password, String firstName, String lastName, String role) {
    this.employeeId = employeeId;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
  }

  /**
   * Getter for employee id.
   *
   * @return the id of the employee
   */
  public String getEmployeeId() {
    return employeeId;
  }

  /**
   * Setter for employee id.
   *
   * @param employeeId of the employee
   */
  public void setEmployeeId(String employeeId) {
    this.employeeId = employeeId;
  }

  /**
   * Getter for password.
   *
   * @return the password of the employee
   */
  public String getPassword() {
    return password;
  }

  /**
   * Setter for password.
   *
   * @param password of the employee
   */
  public void setPassword(String password) {
    this.password = password;
  }

  /**
   * Getter for employee's first name.
   * 
   * @return employee's first name.
   */
  public String getFirstName() {
    return firstName;
  }

  /**
   * Setter for employee's first name.
   *
   * @param firstName of the employee
   */
  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  /**
   * Getter for employee's last name.
   *
   * @return lastName of the employee
   */
  public String getLastName() {
    return lastName;
  }

  /**
   * Setter for the employee's last name.
   *
   * @param lastName of the employee.
   */
  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  /**
   * Getter for employee's role.
   *
   * @return the role of the employee
   */
  public String getRole() {
    return role;
  }

  /**
   * Setter for employee's role.
   *
   * @param role of the employee
   */
  public void setRole(String role) {
    if (role == null || role.trim().isEmpty()) {
        this.role = "WAITER"; // Default to WAITER if null
    } else {
        this.role = role.toUpperCase();
    }
  }

}
