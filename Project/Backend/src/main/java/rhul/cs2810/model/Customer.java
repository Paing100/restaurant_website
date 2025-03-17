package rhul.cs2810.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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

  @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JsonManagedReference
  private List<Order> orders = new ArrayList<>();

  public Customer() {}

  /**
   * Constructs a Customer with specified name.
   *
   * @param name the name of customer
   */
  public Customer(String name) {
    this.name = name;
  }

  /**
   * Gets the name of the customer.
   *
   * @return the name
   */
  public String getName() {
    return name;
  }

  /**
   * Sets the name of the customer.
   *
   * @param name of the customer
   */
  public void setName(String name) {
    this.name = name;
  }

  /**
   * Gets the order that the customer submitted.
   *
   * @return the order
   */
  public List<Order> getOrders() {
    return orders;
  }

  /**
   * Sets the order for the customer.
   *
   * @param order of the customer
   */
  public void addOrder(Order order) {
    this.orders.add(order);
  }

  /**
   * Gets the customer id.
   *
   * @return the unique id of the customer
   */
  public int getCustomerId() {
    return customerId;
  }
}
