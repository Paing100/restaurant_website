package rhul.cs2810.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import rhul.cs2810.model.Employee;
import rhul.cs2810.repository.EmployeeRepository;
import rhul.cs2810.service.LoginService;


@SpringBootTest
@AutoConfigureMockMvc
public class ImageUploadControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private ImageUploadController imageUploadController;

  @Autowired
  private EmployeeRepository employeeRepository;

  @Autowired
  private LoginService loginService;

  private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

  private Employee employee;

  /**
   * Sets up the test environment before each test.
   * 
   * @throws Exception if an error occurs while creating the upload directory or registering the
   *         employee
   */
  @BeforeEach
  void setUp() throws Exception {
    mockMvc = MockMvcBuilders.standaloneSetup(imageUploadController).build();
    Files.createDirectories(Paths.get(UPLOAD_DIR)); // Ensure test directory exists

    // Create and register the employee
    employee = new Employee();
    employee.setEmployeeId("1019");
    employee.setPassword("string");
    employee.setFirstName("Williams");
    employee.setLastName("James");
    employee.setRole("WAITER");

    // Register the employee
    loginService.registerUser(employee);
    employeeRepository.save(employee);
  }

  /**
   * Cleans up the test environment after each test.
   * 
   * @throws Exception if an error occurs while deleting test files or removing the employee
   */
  @AfterEach
  void tearDown() throws Exception {
    Files.walk(Paths.get(UPLOAD_DIR)).filter(Files::isRegularFile)
        .forEach(path -> path.toFile().delete());

    employeeRepository.deleteAll(); // Clean up the employee records
  }

  /**
   * Test #1: Uploads a valid image file and verifies a successful response.
   * 
   * @throws Exception if an error occurs during the request
   */
  @Test
  void uploadImageTest() throws Exception {
    MockMultipartFile file =
        new MockMultipartFile("image", "test.jpg", "image/jpeg", "image-data".getBytes());

    mockMvc.perform(multipart("/api/images/upload").file(file)).andExpect(status().isOk())
        .andExpect(content().string(
            org.hamcrest.Matchers.containsString("http://localhost:8080/api/images/view/")));
  }
  /**
   * Test #2: Attempts to upload an empty file and expects a bad request response.
   * 
   * @throws Exception if an error occurs during the request
   */
  @Test
  void uploadImageEmptyTest() throws Exception {
    MockMultipartFile file = new MockMultipartFile("image", "", "image/jpeg", new byte[0]);

    mockMvc.perform(multipart("/api/images/upload").file(file)).andExpect(status().isBadRequest())
        .andExpect(content().string("No file uploaded"));
  }

  /**
   * Test #3: Retrieves an existing image file and verifies a successful response.
   * 
   * @throws Exception if an error occurs during the request
   */
  @Test
  void getImageTest() throws Exception {
    String filename = "test.jpg";
    Path filePath = Paths.get(UPLOAD_DIR + filename);
    Files.write(filePath, "image-data".getBytes());

    mockMvc.perform(get("/api/images/view/" + filename)).andExpect(status().isOk())
        .andExpect(header().exists("Content-Type"));
  }

  /**
   * Test #4: Attempts to retrieve a non-existent image file and expects a 404 response.
   * 
   * @throws Exception if an error occurs during the request
   */
  @Test
  void getImageNotFoundTest() throws Exception {
    mockMvc.perform(get("/api/images/view/nonexistent.jpg")).andExpect(status().isNotFound());
  }

}
