package rhul.cs2810.controller;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;
import rhul.cs2810.model.Employee;
import rhul.cs2810.repository.EmployeeRepository;
import rhul.cs2810.service.ImageUploaderService;
import rhul.cs2810.service.LoginService;


@SpringBootTest
@AutoConfigureMockMvc
public class ImageUploaderControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @InjectMocks
  private ImageUploaderController imageUploadController;

  @MockBean
  private ImageUploaderService imageUploaderService;

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
    Files.createDirectories(Paths.get(UPLOAD_DIR)); // Ensure test directory exists

    // Create and register the employee
    employee = new Employee();
    employee.setEmployeeId("1019");
    employee.setPassword("string");
    employee.setFirstName("Williams");
    employee.setLastName("James");
    employee.setRole("WAITER");

    // Register the employee
    loginService.register(employee);
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

  @Test
  void uploadImageTest() throws Exception {
    MockMultipartFile file =
        new MockMultipartFile("image", "test.jpg", "image/jpeg", "image-data".getBytes());

    when(imageUploaderService.uploadImage(file)).thenReturn("http://localhost:8080/api/images/view/test.jpg");

    mockMvc.perform(multipart("/api/images/upload").file(file)).andExpect(status().isOk())
      .andExpect(content().string(containsString("http://localhost:8080/api/images/view/test.jpg")));

    verify(imageUploaderService, times(1)).uploadImage(file);
  }

  @Test
  void uploadImageTest_IllegalArgumentException() throws Exception {
    MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "image-data".getBytes());
    when(imageUploaderService.uploadImage(file)).thenThrow(IllegalArgumentException.class);

    mockMvc.perform(multipart("/api/images/upload").file(file)).andExpect(status().isNotFound());
    verify(imageUploaderService, times(1)).uploadImage(file);
  }

  @Test
  void uploadImageEmptyTest() throws Exception {
    MockMultipartFile file = new MockMultipartFile("image", "", "image/jpeg", new byte[0]);

    mockMvc.perform(multipart("/api/images/upload").file(file)).andExpect(status().isBadRequest())
        .andExpect(content().string("No file uploaded"));
  }

  @Test
  void getImageTest() throws Exception {
    String filename = "test.jpg";
    Path filePath = Paths.get(UPLOAD_DIR + filename);
    Files.write(filePath, "image-data".getBytes());

    mockMvc.perform(get("/api/images/view/" + filename)).andExpect(status().isOk())
        .andExpect(header().exists("Content-Type"));
  }

  @Test
  void getImageNotFoundTest() throws Exception {
    mockMvc.perform(get("/api/images/view/nonexistent.jpg")).andExpect(status().isNotFound());
  }

}
