package rhul.cs2810.model;

import jakarta.persistence.*;

/**
 * Entity representing a Waiter in the restaurant system.
 * Each waiter is linked to an employee and can be assigned tables.
 */
@Entity
@Table(name = "waiter")
public class Waiter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "waiter_id")
    private int waiterId;

    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "employeeId", nullable = false)
    private Employee employee;

    public Waiter() {}

    public Waiter(Employee employee) {
        this.employee = employee;
    }

    public int getWaiterId() {
        return waiterId;
    }

    public void setWaiterId(int waiterId) {
        this.waiterId = waiterId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    /**
     * Gets the default section tables for this waiter based on their ID.
     * Each waiter is assigned 5 consecutive tables by default.
     * @return array of table numbers in their default section
     */
    public int[] getDefaultSectionTables() {
        int startTable = (waiterId - 1) * 5 + 1;
        return new int[] {
            startTable,
            startTable + 1,
            startTable + 2,
            startTable + 3,
            startTable + 4
        };
    }
} 