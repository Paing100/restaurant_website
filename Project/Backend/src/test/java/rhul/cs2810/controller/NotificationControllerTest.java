package rhul.cs2810.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import rhul.cs2810.model.Notification;
import rhul.cs2810.repository.NotificationRepository;
import rhul.cs2810.service.NotificationService;

class NotificationControllerTest {

  private static final Logger log = LoggerFactory.getLogger(NotificationControllerTest.class);
  @Mock
  private NotificationService notificationService;

  @Mock
  private NotificationRepository notificationRepository;

  @InjectMocks
  private NotificationController notificationController;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    // Initialize mocks (this is important to initialize mocks manually in case they aren't.)
    MockitoAnnotations.openMocks(this);


    mockMvc = MockMvcBuilders.standaloneSetup(notificationController).build();
  }

  @Test
  void testSendNotification() throws Exception {
    String json = """
    {
      "type": "type1",
      "orderId": 123,
      "recipient": "recipient@example.com",
      "message": "This is a test message",
      "waiterId": "1"
    }
    """;
    Notification notification =
        new Notification("type1", 123, "recipient@example.com", "This is a test message", "1");

    mockMvc.perform(post("/api/notification/send").contentType("application/json").content(json))
        .andExpect(status().isOk());

    // Verify that the NotificationService's sendNotification method was called once with the
    // correct parameters
    // refEq is used just to compare the content. not to check the exact same instance
    verify(notificationService, times(1)).processNotification(refEq(notification));
  }

  @Test
  void testRemoveMessages() throws Exception {
    int notiId = 1;
    notificationController.removeMessages(notiId);
    verify(notificationRepository, times(1)).deleteById(notiId);
    Optional<Notification> notification = notificationRepository.findById(notiId);
    assertEquals(notification, Optional.empty());
  }

  @Test
  void testGetMessages() throws Exception {
    Notification notification =
      new Notification("type1", 123, "recipient@example.com", "This is a test message", "1");

    when(notificationService.getMessages()).thenReturn(List.of(notification));

    mockMvc.perform(get("/api/notification/getMessages").contentType(MediaType.APPLICATION_JSON))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$", hasSize(1)))
      .andExpect(jsonPath("$[0].orderId").value(123))
      .andExpect(jsonPath("$[0].type").value("type1"))
      .andExpect(jsonPath("$[0].recipient").value("recipient@example.com"))
      .andExpect(jsonPath("$[0].message").value("This is a test message"))
      .andExpect(jsonPath("$[0].waiterId").value("1"));

    verify(notificationService, times(1)).getMessages();
  }

}
