package rhul.cs2810.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import rhul.cs2810.model.Notification;
import rhul.cs2810.service.NotificationService;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class NotificationControllerTest {

    @Mock
    private NotificationService notificationService;

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
        Notification notification = new Notification("type1", 123, "recipient@example.com", "This is a test message");


        mockMvc.perform(post("/api/notification/send")
                .contentType("application/json")
                .content("{\"type\":\"type1\",\"orderId\":123,\"recipient\":\"recipient@example.com\",\"message\":\"This is a test message\"}"))
                .andExpect(status().isOk());

        // Verify that the NotificationService's sendNotification method was called once with the correct parameters
        verify(notificationService, times(1)).sendNotification("type1", 123, "recipient@example.com", "This is a test message");
    }
}
