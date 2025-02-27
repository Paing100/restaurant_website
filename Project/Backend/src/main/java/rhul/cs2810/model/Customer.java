package rhul.cs2810.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Represents a customer in the restaurant system.
 */
@Entity
@Table(name = "customer")
public class Customer {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "customer_id")
  private int customerId;

  @Column(name = "name")
  private String name;

  @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JsonManagedReference
  private Order order;

  public Customer() {}

  /**
   * Constructs a Customer with specified name.
   *
   * @param name the name of customer
   */
  public Customer(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Order getOrder() {
    return order;
  }

  public void setOrder(Order order) {
    this.order = order;
  }

  public int getCustomerId() {
    return customerId;
  }

  /*
   * @Override public boolean equals(Object o) { if (this == o) return true; if (o == null ||
   * getClass() != o.getClass()) return false; Customer customer = (Customer) o; return customerId
   * == customer.customerId && Objects.equals(name, customer.name); }
   * 
   * @Override public int hashCode() { return Objects.hash(customerId, name); }
   * 
   */


}
