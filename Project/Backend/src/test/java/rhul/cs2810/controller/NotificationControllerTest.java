package rhul.cs2810.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import rhul.cs2810.model.Notification;
import rhul.cs2810.service.NotificationService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class NotificationControllerTest {

  @MockBean
  NotificationService notificationService;

  @Autowired
  private MockMvc mockMvc;

  private ObjectMapper objectMapper = new ObjectMapper();

  Notification notification;

  @BeforeEach
  void beforeEach(){
    notification = new Notification("TYPE", 1, "RECIPIENT", "MESSAGE");
  }

//  @Test
//  void testSendNotification() throws Exception {
//    mockMvc.perform(post("/api/notification/send")
//      .contentType(MediaType.APPLICATION_JSON)
//      .content(objectMapper.writeValueAsString(notification))
//      .accept(MediaType.APPLICATION_JSON)
//    ).andExpect(status().isOk());
//
//    verify(notificationService, times(1)).sendNotification("TYPE", 1, "RECIPIENT", "MESSAGE");
//  }


}
