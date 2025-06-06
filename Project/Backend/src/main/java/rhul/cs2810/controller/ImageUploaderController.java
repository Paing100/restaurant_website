package rhul.cs2810.controller;

import java.awt.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import rhul.cs2810.service.ImageUploaderService;

/**
 * Controller for handling image upload and retrieval.
 */
@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*") // Allow frontend access
public class ImageUploaderController {

  private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

  @Autowired
  private ImageUploaderService imageUploaderService;

  /**
   * Handles the upload of an image file.
   *
   * @param file the image file to be uploaded.
   * @return a ResponseEntity containing the URL of the uploaded image if successful, or an error
   *         message if the upload fails.
   */
  @PostMapping("/upload")
  public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile file) {
    try {
      String imageUrl = imageUploaderService.uploadImage(file);
      return ResponseEntity.ok(imageUrl);
    }
    catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Empty file");
    }
    catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
    }
  }

  /**
   * Retrieves an image file by its filename.
   *
   * @param filename the name of the file to be retrieved.
   * @return a ResponseEntity containing the image file if found, or an error response if not found.
   */
  @GetMapping("/view/{filename}")
  public ResponseEntity<Resource> getImage(@PathVariable String filename) {
    try {
      Path imagePath = Paths.get(UPLOAD_DIR + filename);
      Resource resource = new UrlResource(imagePath.toUri());

      if (resource.exists() || resource.isReadable()) {
        // Automatically determine the content type for any image format
        String contentType = Files.probeContentType(imagePath);
        if (contentType == null) {
          contentType = "application/octet-stream"; // Default if content type can't be determined
        }

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)) // Dynamically
                                                                                      // set content
                                                                                      // type
            .body(resource);
      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (Exception e) {
      return ResponseEntity.internalServerError().build();
        }
    }
}
