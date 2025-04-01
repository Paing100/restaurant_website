package rhul.cs2810.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import rhul.cs2810.model.Customer;
import rhul.cs2810.repository.CustomerRepository;

import java.util.Optional;

public class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @InjectMocks
    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAuthenticateCustomerSuccess() {
        Customer customer = new Customer("John", "john@email.com", "hashedPassword123");
        when(customerRepository.findByEmail("john@email.com")).thenReturn(customer);
        when(bCryptPasswordEncoder.matches("password123", "hashedPassword123")).thenReturn(true);

        Optional<Customer> result = customerService.authenticateCustomer("john@email.com", "password123");

        assertTrue(result.isPresent());
        assertEquals("john@email.com", result.get().getEmail());
    }

    @Test
    void testAuthenticateCustomerFailWrongPassword() {
        Customer customer = new Customer("John", "john@email.com", "hashedPassword123");
        when(customerRepository.findByEmail("john@email.com")).thenReturn(customer);
        when(bCryptPasswordEncoder.matches("wrongpassword", "hashedPassword123")).thenReturn(false);

        Optional<Customer> result = customerService.authenticateCustomer("john@email.com", "wrongpassword");

        assertTrue(result.isEmpty());
    }

    @Test
    void testAuthenticateCustomerFailEmailNotFound() {
        when(customerRepository.findByEmail("nonexistent@email.com")).thenReturn(null);

        Optional<Customer> result = customerService.authenticateCustomer("nonexistent@email.com", "password123");

        assertTrue(result.isEmpty());
    }

    @Test
    void testSaveCustomerWithPassword() {
        Customer customer = new Customer("John", "john@email.com", "password123");
        when(bCryptPasswordEncoder.encode("password123")).thenReturn("hashedPassword123");
        when(customerRepository.save(any(Customer.class))).thenAnswer(i -> i.getArguments()[0]);

        Customer savedCustomer = customerService.saveCustomer(customer);

        assertEquals("hashedPassword123", savedCustomer.getPassword());
    }

    @Test
    void testSaveCustomerWithoutPassword() {
        Customer customer = new Customer("John");
        when(customerRepository.save(any(Customer.class))).thenAnswer(i -> i.getArguments()[0]);

        Customer savedCustomer = customerService.saveCustomer(customer);

        assertNull(savedCustomer.getPassword());
    }

    @Test
    void testCreateAccountSuccess() {
        Customer existingCustomer = new Customer("John");
        when(customerRepository.findByEmail("john@email.com")).thenReturn(null);
        when(customerRepository.findById(1)).thenReturn(Optional.of(existingCustomer));
        when(bCryptPasswordEncoder.encode("password123")).thenReturn("hashedPassword123");
        when(customerRepository.save(any(Customer.class))).thenAnswer(i -> i.getArguments()[0]);

        Optional<Customer> result = customerService.createAccount(1, "john@email.com", "password123");

        assertTrue(result.isPresent());
        assertEquals("john@email.com", result.get().getEmail());
        assertEquals("hashedPassword123", result.get().getPassword());
    }

    @Test
    void testCreateAccountFailEmailExists() {
        Customer existingCustomer = new Customer("John", "john@email.com", "hashedPassword123");
        when(customerRepository.findByEmail("john@email.com")).thenReturn(existingCustomer);

        Optional<Customer> result = customerService.createAccount(1, "john@email.com", "password123");

        assertTrue(result.isEmpty());
    }

    @Test
    void testCreateAccountFailCustomerNotFound() {
        when(customerRepository.findByEmail("john@email.com")).thenReturn(null);
        when(customerRepository.findById(1)).thenReturn(Optional.empty());

        Optional<Customer> result = customerService.createAccount(1, "john@email.com", "password123");

        assertTrue(result.isEmpty());
    }
}
