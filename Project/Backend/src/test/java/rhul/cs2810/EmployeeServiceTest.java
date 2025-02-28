package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import rhul.cs2810.model.Employee;
import rhul.cs2810.repository.EmployeeRepository;
import rhul.cs2810.service.EmployeeService;

public class EmployeeServiceTest {

  @Mock
  EmployeeRepository mockEmployeeRepository;

  @Mock
  BCryptPasswordEncoder mockBCryptPasswordEncoder;

  @InjectMocks
  EmployeeService mockEmployeeService;

  @BeforeEach
  void beforeEach() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testAuthenticateUserCredentials() {
    Employee mockEmployee = new Employee();
    mockEmployee.setEmployeeId("101");
    mockEmployee.setPassword(mockBCryptPasswordEncoder.encode("123"));

    when(mockEmployeeRepository.findByEmployeeId("101")).thenReturn(Optional.of(mockEmployee));
    when(mockBCryptPasswordEncoder.matches("123", mockEmployee.getPassword())).thenReturn(true);

    Optional<Employee> employeeOptional = mockEmployeeService.authenticateUser("101", "123");

    assertTrue(employeeOptional.isPresent());
    assertEquals("101", employeeOptional.get().getEmployeeId());
  }


  @Test
  void testAuthenticateUserCredentialsIncorrectPassword() {
    Employee mockEmployee = new Employee();
    mockEmployee.setEmployeeId("101");
    mockEmployee.setPassword(mockBCryptPasswordEncoder.encode("123"));

    when(mockEmployeeRepository.findByEmployeeId("101")).thenReturn(Optional.of(mockEmployee));
    when(mockBCryptPasswordEncoder.matches("Wrong password", "Wrong")).thenReturn(false);

    Optional<Employee> employeeOptional =
        mockEmployeeService.authenticateUser("111", "Wrong password");

    assertFalse(employeeOptional.isPresent());
  }

  @Test
  void testAuthenticateUserCredentialsUserNotFound() {
    Employee mockEmployee = new Employee();

    when(mockEmployeeRepository.findByEmployeeId("Wrong User")).thenReturn(Optional.empty());

    Optional<Employee> employeeOptional = mockEmployeeService.authenticateUser("Wrong User", "123");

    assertFalse(employeeOptional.isPresent());
  }

  @Test
  void testRegisterNewUser() {
    Employee mockEmployee = new Employee();
    mockEmployee.setEmployeeId("101");
    mockEmployee.setPassword("123");
    mockEmployee.setFirstName("Jame");
    mockEmployee.setLastName("W");
    mockEmployee.setRole("Waiter");

    boolean registered = mockEmployeeService.registerUser(mockEmployee);

    when(mockEmployeeRepository.findByEmployeeId("101")).thenReturn(Optional.empty());
    when(mockBCryptPasswordEncoder.encode(mockEmployee.getPassword())).thenReturn("123");

    assertTrue(registered);
    assertEquals(mockBCryptPasswordEncoder.encode("123"), mockEmployee.getPassword());

  }

  @Test
  void testRegisterExistingUser() {
    Employee mockEmployee = new Employee();
    mockEmployee.setEmployeeId("101");
    mockEmployee.setPassword("123");
    mockEmployee.setFirstName("Jame");
    mockEmployee.setLastName("W");
    mockEmployee.setRole("Waiter");

    when(mockEmployeeRepository.findByEmployeeId("101")).thenReturn(Optional.empty());

    boolean firstRegistered = mockEmployeeService.registerUser(mockEmployee);
    assertTrue(firstRegistered);

    mockEmployee.setPassword("111");
    when(mockEmployeeRepository.findByEmployeeId("101")).thenReturn(Optional.of(mockEmployee));

    boolean secondRegistered = mockEmployeeService.registerUser(mockEmployee);
    assertTrue(secondRegistered);
  }

  @Test
  void testRegisterUserNullCredentials() {
    Employee mockEmployee = new Employee();
    assertFalse(mockEmployeeService.registerUser(mockEmployee));
  }

}


