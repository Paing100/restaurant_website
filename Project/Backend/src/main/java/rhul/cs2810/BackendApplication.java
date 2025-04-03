package rhul.cs2810;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Backend application.
 * This class initializes and starts the Spring Boot application.
 */
@SpringBootApplication
public class BackendApplication {

    /**
     * Main method to launch the application.
     *
     * @param args command-line arguments passed to the application
     */
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}
