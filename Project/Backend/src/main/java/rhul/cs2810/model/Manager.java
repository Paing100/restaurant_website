package rhul.cs2810.model;

/**
 * Represents a manager in the system.
 */
public class Manager {

  private int managerId;

  private Employee employee;

  /**
   * Default constructor for the Manager class.
   */
  public Manager() {}

  /**
   * Constructs a Manager object with the specified employee.
   *
   * @param employee the employee which is associated with the manager
   */
  public Manager(Employee employee) {
    this.setEmployee(employee);
  }

  /**
   * Gets the manager's ID.
   *
   * @return the manager's ID
   */
  public int getManagerId() {
    return managerId;
  }

  /**
   * Sets the manager's ID.
   *
   * @param managerId the manager's ID to be set
   */
  public void setManagerId(int managerId) {
    this.managerId = managerId;
  }

  /**
   * Gets the employee who is associated with the manager.
   *
   * @return the associated employee
   */
  public Employee getEmployee() {
    return employee;
  }

  /**
   * Sets the employee who is associated with the manager.
   *
   * @param employee the employee to be set as associated with the manager
   */
  public void setEmployee(Employee employee) {
    this.employee = employee;
  }
}
