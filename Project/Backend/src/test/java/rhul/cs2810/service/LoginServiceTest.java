package rhul.cs2810.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import rhul.cs2810.model.Employee;
import rhul.cs2810.model.Waiter;
import rhul.cs2810.repository.EmployeeRepository;
import rhul.cs2810.repository.WaiterRepository;

public class LoginServiceTest {

  @Mock
  EmployeeRepository mockEmployeeRepository;

  @Mock
  BCryptPasswordEncoder mockBCryptPasswordEncoder;

  @Mock
  WaiterRepository mockWaiterRepository;

  @Mock
  WaiterService mockWaiterService;

  @InjectMocks
  LoginService mockLoginService;

  @BeforeEach
  void beforeEach() {
    MockitoAnnotations.openMocks(this);
    when(mockWaiterRepository.save(any(Waiter.class))).thenReturn(new Waiter());
  }

  @Test
  void testAuthenticateUserCredentials() {
    Employee mockEmployee = new Employee();
    mockEmployee.setEmployeeId("101");
    mockEmployee.setPassword(mockBCryptPasswordEncoder.encode("123"));

    when(mockEmployeeRepository.findByEmployeeId("101")).thenReturn(Optional.of(mockEmployee));
    when(mockBCryptPasswordEncoder.matches("123", mockEmployee.getPassword())).thenReturn(true);

    Optional<Employee> employeeOptional = mockLoginService.authenticateUser("101", "123");

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
        mockLoginService.authenticateUser("111", "Wrong password");

    assertFalse(employeeOptional.isPresent());
  }

  @Test
  void testAuthenticateUserCredentialsUserNotFound() {
    Employee mockEmployee = new Employee();

    when(mockEmployeeRepository.findByEmployeeId("Wrong User")).thenReturn(Optional.empty());

    Optional<Employee> employeeOptional = mockLoginService.authenticateUser("Wrong User", "123");

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

    when(mockEmployeeRepository.findByEmployeeId("101")).thenReturn(Optional.empty());
    when(mockBCryptPasswordEncoder.encode(mockEmployee.getPassword())).thenReturn("123");

    Map<String, String> response = mockLoginService.register(mockEmployee);

    assertEquals(mockEmployee.getEmployeeId(), response.get("employeeId"));
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

    Map<String, String> response1 = mockLoginService.register(mockEmployee);
    assertEquals("101", response1.get("employeeId"));

    mockEmployee.setPassword("111");
    when(mockEmployeeRepository.findByEmployeeId("101")).thenReturn(Optional.of(mockEmployee));

    Map<String, String> response2 = mockLoginService.register(mockEmployee);
    assertEquals(mockEmployee.getPassword(), response2.get("password"));
  }

  @Test
  void testRegisterUserNullCredentials() {
    Employee mockEmployee = new Employee();
    assertThrows(IllegalArgumentException.class, () -> {
      mockLoginService.register(mockEmployee);
    });
  }

  @Test
  void testLogin() {
    Employee inputEmployee = new Employee();
    inputEmployee.setEmployeeId("1");
    inputEmployee.setPassword("abc");

    Employee storedEmployee = new Employee();
    storedEmployee.setEmployeeId("1");
    storedEmployee.setPassword("hashed_password");
    storedEmployee.setFirstName("A");
    storedEmployee.setRole("Waiter");

    when(mockEmployeeRepository.findByEmployeeId("1")).thenReturn(Optional.of(storedEmployee));
    when(mockBCryptPasswordEncoder.matches("abc", "hashed_password")).thenReturn(true);

    Map<String, String> response = mockLoginService.login(inputEmployee);

    assertEquals("A", response.get("firstName"));
    assertEquals("WAITER", response.get("role"));
  }


}


