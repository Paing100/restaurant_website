package rhul.cs2810.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageUploaderService {

  private String uploadDir = "src/main/resources/static/uploads/";

  public void setUploadDir(String uploadDir) {
    this.uploadDir = uploadDir;
  }

  public String uploadImage(MultipartFile file) throws IOException {
    if (file.isEmpty()) {
      throw new IllegalArgumentException("Empty file!");
    }
    // Ensure the upload directory exists
    Files.createDirectories(Paths.get(uploadDir));

    // Generate a unique filename
    String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
    Path filePath = Paths.get(uploadDir + filename);

    // Save the file
    Files.write(filePath, file.getBytes());

    // Return the full image URL
    String imageUrl = "http://localhost:8080/api/images/view/" + filename;

    return imageUrl;
  }

  public Resource getImage(String filename) throws IOException {
    Path imagePath = Paths.get(uploadDir + filename);
    Resource resource = new UrlResource(imagePath.toUri());

    if (resource.exists() || resource.isReadable()) {
      return resource;
    }
    throw new FileNotFoundException("File not found " + filename);
  }
}
