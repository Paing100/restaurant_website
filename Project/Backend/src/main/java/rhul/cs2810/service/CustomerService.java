package rhul.cs2810.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import rhul.cs2810.model.Customer;
import rhul.cs2810.repository.CustomerRepository;

import java.util.Optional;

/**
 * Service class for handling customer-related business logic.
 */
@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

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
     * Authenticate a customer based on email and password.
     *
     * @param email the customer's email
     * @param password the customer's password
     * @return Optional<Customer> if authentication successful, empty Optional otherwise
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
     * @return Optional<Customer> if successful, empty Optional if customer not found or email exists
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
