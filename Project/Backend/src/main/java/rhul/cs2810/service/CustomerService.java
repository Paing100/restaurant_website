package rhul.cs2810.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import rhul.cs2810.model.Customer;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderStatus;
import rhul.cs2810.model.Waiter;
import rhul.cs2810.repository.CustomerRepository;
import rhul.cs2810.repository.OrderRepository;

import java.util.Optional;

/**
 * Service class for handling customer-related business logic.
 */
@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private WaiterService waiterService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    /**
     * Constructor for CustomerService.
     *
     * @param customerRepository repository for customer operations
     * @param bCryptPasswordEncoder password encoder
     */
    @Autowired
    public CustomerService(CustomerRepository customerRepository,
                         BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.customerRepository = customerRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    /**
     * Create a new customer and add it to the repository.
     * @param name name of the customer
     * @param tableNum table number of the customer
     * @param email email of the customer
     * @param password customer's password
     * @return Customer object
     * @throws IllegalArgumentException
     */
    public Customer createCustomerAndAdd(String name, int tableNum, String email, String password) throws IllegalArgumentException {
        // Check if email is provided and already exists
        if (email != null && customerRepository.findByEmail(email) != null) {
            throw new IllegalArgumentException("Email already exists!");
        }

        // Create and save customer with hashed password
        Customer newCustomer = saveCustomer(email, password, name);
        newCustomer = this.saveCustomer(newCustomer); // with hashed password

        // Create order linked to the persisted customer
        Order order = createOrder(tableNum, newCustomer);

        // Try to assign a waiter
        Optional<Waiter> waiter = waiterService.findWaiterForTable(tableNum);
        if (waiter.isEmpty()) {
            throw new IllegalArgumentException("No waiter available!"); // No waiter available
        }
        order.setWaiter(waiter.get());

        newCustomer.addOrder(order);

        // Save the order
        orderRepository.save(order);

        return newCustomer;
    }


    /**
     * Create a customer object with the necessary attributes
     * @param email customer's email
     * @param password customer's password
     * @param name customer's name
     * @return Customer object
     */
    private Customer saveCustomer(String email, String password, String name) {
        Customer customer = (email != null && password != null)
          ? new Customer(name, email, password)
          : new Customer(name);
        return customer;
    }

    /**
     * Create a order object with required attributes
     * @param tableNum customer's table number
     * @param customer customer object
     * @return Order object
     */
    private Order createOrder(int tableNum, Customer customer) {
        Order order = new Order();
        order.setTableNum(tableNum);
        order.setCustomer(customer);
        order.setOrderStatus(OrderStatus.CREATED);
        return order;
    }

    /**
     * Create a new order from the existing customer
     * @param customerId existing customer's id
     * @param tableNum customer's table number
     * @return Order object 
     * @throws IllegalArgumentException
     */
    public Order createNeworder(int customerId, int tableNum) throws IllegalArgumentException{
        Optional<Customer> customerOptional = customerRepository.findById(customerId);

        if (customerOptional.isEmpty()) {
            throw new IllegalArgumentException("No such customer exists!");
        }

        Customer customer = customerOptional.get();

        // Create a new order for the existing customer
        Order newOrder = createOrder(tableNum, customer);

        // Try to assign a waiter
        Optional<Waiter> waiter = waiterService.findWaiterForTable(tableNum);
        if (waiter.isEmpty()) {
            throw new IllegalArgumentException("No waiter available!"); // No waiter available
        }
        newOrder.setWaiter(waiter.get());

        // Save the new order
        Order savedOrder = orderRepository.save(newOrder);

        return savedOrder;
    }


    /**
     * Authenticate a customer based on email and password.
     *
     * @param email the customer's email
     * @param password the customer's password
     * @return Customer if authentication successful, empty Optional otherwise
     */
    public Optional<Customer> authenticateCustomer(String email, String password) {
        Customer customer = customerRepository.findByEmail(email);
        if (customer != null && bCryptPasswordEncoder.matches(password, customer.getPassword())) {
            return Optional.of(customer);
        }
        return Optional.empty();
    }

    /**
     * Creates or updates a customer with hashed password.
     *
     * @param customer the customer to create/update
     * @return the saved customer
     */
    public Customer saveCustomer(Customer customer) {
        if (customer.getPassword() != null) {
            String hashedPassword = bCryptPasswordEncoder.encode(customer.getPassword());
            customer.setPassword(hashedPassword);
        }
        return customerRepository.save(customer);
    }

    /**
     * Creates an account for an existing customer.
     *
     * @param customerId the ID of the customer
     * @param email the email for the account
     * @param password the password for the account
     * @return Customer if successful, empty Optional if customer not found or email exists
     */
    public Optional<Customer> createAccount(int customerId, String email, String password) {
        if (customerRepository.findByEmail(email) != null) {
            return Optional.empty();
        }

        Optional<Customer> customerOptional = customerRepository.findById(customerId);
        if (customerOptional.isEmpty()) {
            return Optional.empty();
        }

        Customer customer = customerOptional.get();
        customer.setEmail(email);
        customer.setPassword(bCryptPasswordEncoder.encode(password));
        return Optional.of(customerRepository.save(customer));
    }
}
