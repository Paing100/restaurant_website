package rhul.cs2810.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import rhul.cs2810.model.Employee;
import rhul.cs2810.repository.EmployeeRepository;
import rhul.cs2810.service.EmployeeService;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class LoginControllerTest {
  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  EmployeeRepository employeeRepository;

  @Autowired
  EmployeeService employeeService;

  Employee employee;

  @BeforeEach
  void beforeEach() {
    employee = new Employee();
    employee.setEmployeeId("1019");
    employee.setPassword("string");
    employee.setFirstName("Williams");
    employee.setLastName("James");
    employee.setRole("Waiter");
    employeeService.registerUser(employee);
    employeeRepository.save(employee);
  }

  @AfterEach
  void afterEach() {
    employee = null;
    employeeRepository.deleteAll();
  }

  @Test
  void testRegister() throws JsonProcessingException, Exception {
    MvcResult mvcResult = mockMvc
        .perform(MockMvcRequestBuilders.post("/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(employee)).accept(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.message").value("Register Successful"))
        .andExpect(jsonPath("$.firstName").value("Williams"))
        .andExpect(jsonPath("$.role").value("Waiter"))
        .andExpect(jsonPath("$.employeeId").value("1019")).andReturn();

    Employee testedEmployee =
        objectMapper.readValue(mvcResult.getResponse().getContentAsString(), Employee.class);
    assertEquals(testedEmployee.getEmployeeId(), employee.getEmployeeId());
    assertEquals(testedEmployee.getFirstName(), employee.getFirstName());
    assertEquals(testedEmployee.getRole(), employee.getRole());

    int status = mvcResult.getResponse().getStatus();
    assertEquals(HttpStatus.OK.value(), status);
  }

  @Test
  void testLogin() throws Exception {
    Employee loginEmployee = new Employee();
    loginEmployee.setEmployeeId("1019");
    loginEmployee.setPassword("string");
    MvcResult mvcResult = mockMvc
        .perform(MockMvcRequestBuilders.post("/auth/login").contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginEmployee))
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.message").value("Login Successful!"))
        .andExpect(jsonPath("$.firstName").value("Williams"))
        .andExpect(jsonPath("$.role").value("Waiter")).andReturn();
  }


}
