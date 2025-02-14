package rhul.cs2810.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
  int customerID;

  @ManyToMany
  @JoinTable(name = "customer_menu_items", joinColumns = @JoinColumn(name = "customer_id"),
      inverseJoinColumns = @JoinColumn(name = "item_id"))
  List<MenuItem> menuItems; // why was this transient...

  @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  Order order;

  /**
   * Constructs a Customer with specified order number, ordered items, menu items.
   *
   * @param menuItems the list of available menu items
   */
  public Customer(List<MenuItem> menuItems) {
    this.menuItems = menuItems;
  }

  /**
   * Constructs a Customer with an empty order list and a given ID.
   */
  public Customer(int customerID) {
    this.customerID = customerID;
    this.menuItems = new ArrayList<>();
  }

  /**
   * Constructs a Customer with an empty order list.
   */
  public Customer() {
    this.menuItems = new ArrayList<>();
  }

  /**
   * Gets the list of available menu items.
   *
   * @return the list of menu items
   */
  public List<MenuItem> getMenuItems() {
    return menuItems;
  }

  /**
   * Sets the list of available menu items.
   *
   * @param menuItems the list of menu items to set
   */
  public void setMenuItems(List<MenuItem> menuItems) {
    this.menuItems = menuItems;
  }


  /**
   * Filters the menu based on dietary restrictions and allergens.
   *
   * @param dietaryRestrictions the set of dietary restrictions
   * @param allergens the set of allergens
   * @return a list of menu items that meet the dietary restrictions
   */
  public List<MenuItem> filterMenu(Set<DietaryRestrictions> dietaryRestrictions,
      Set<Allergen> allergens, List<MenuItem> menu) {
    if (dietaryRestrictions == null && allergens == null) {
      return this.menuItems;
    }

    List<MenuItem> filteredMenuItems = new ArrayList<>();
    for (MenuItem item : menu) {
      boolean add = true;
      if (dietaryRestrictions != null) {
        add = add && item.getDietaryRestrictions().equals(dietaryRestrictions);
      }

      if (allergens != null) {
        add = add && !item.getAllergens().equals(allergens);
      }
      if (add) {
        filteredMenuItems.add(item);
      }
    }
    return filteredMenuItems;
  }

  /**
   * Get the order from the customer.
   *
   * @return order in order
   */
  public Order getOrder() {
    return order;
  }

  /**
   * Set the order for the customer.
   * 
   * @param order made by the customer
   */
  public void setOrder(Order order) {
    this.order = order;
  }

  public int getCustomerID() {
    return customerID;
  }


}
