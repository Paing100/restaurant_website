package rhul.cs2810.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ImageUploaderServiceTest {
  private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

  @InjectMocks
  ImageUploaderService imageUploaderService;

  @TempDir
  Path tempDir;

  @Test
  void testUploadImage() throws IOException {
    byte[] content = "Hello, world!".getBytes();
    MultipartFile file = new MockMultipartFile("file", "hello.txt", "text/plain", content);

    imageUploaderService.setUploadDir(tempDir.toString() + "/");
    String imageURL = imageUploaderService.uploadImage(file);
    String savedFileName = imageURL.substring(imageURL.lastIndexOf("/") + 1);

    File savedFile = new File(tempDir.toFile(), savedFileName);
    assertTrue(savedFile.exists(), "Upload file should exist");
    assertNotNull(savedFileName, "Returned file name should not be null");

  }

}
