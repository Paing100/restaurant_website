package rhul.cs2810.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.UrlResource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ImageUploaderServiceTest {
  private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

  @InjectMocks
  ImageUploaderService imageUploaderService;

  @Mock
  ResourceLoader resourceLoader;

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

  @Test
  void testGetImage() throws IOException {
    byte[] content = "Hello, world!".getBytes();
    MultipartFile file = new MockMultipartFile("file", "hello.txt", "text/plain", content);

    imageUploaderService.setUploadDir(tempDir.toString() + "/");

    // Upload the file
    String imageURL = imageUploaderService.uploadImage(file);
    String savedFileName = imageURL.substring(imageURL.lastIndexOf("/") + 1);

    // Now test getImage
    Resource resource = imageUploaderService.getImage(savedFileName);

    // Validate that the resource exists and matches content
    assertTrue(resource.exists(), "Resource should exist");
    assertTrue(resource.isReadable(), "Resource should be readable");

    // Read the content back and compare
    byte[] readBytes = resource.getInputStream().readAllBytes();
    assertArrayEquals(content, readBytes, "Content should match original file bytes");
  }
}
