package rhul.cs2810.model;

public class Manager {

  private int managerId;

  private Employee employee;

  public Manager() {}

  public Manager(Employee employee) {
    this.setEmployee(employee);
  }

  public int getManagerId() {
    return managerId;
  }

  public void setManagerId(int managerId) {
    this.managerId = managerId;
  }

  public Employee getEmployee() {
    return employee;
  }

  public void setEmployee(Employee employee) {
    this.employee = employee;
  }



}
