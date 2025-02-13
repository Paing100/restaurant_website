package rhul.cs2810.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "employee")
public class Employee {
  @Id
  @GeneratedValue
  private long id;

  @Column(nullable = false, unique = true, name = "employeeId")
  private String employeeId;

  @Column(nullable = false)
  private String password;

  public Employee() {

  }

  public Employee(String employeeId, String password) {
    this.employeeId = employeeId;
    this.password = password;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getEmployeeId() {
    return employeeId;
  }

  public void setEmployeeId(String employeeId) {
    this.employeeId = employeeId;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }



}
