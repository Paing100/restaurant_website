package rhul.cs2810.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import rhul.cs2810.model.User;
import rhul.cs2810.model.UserService;

@RestController
@RequestMapping("/auth")
public class LoginController {
  @Autowired
  private UserService userService;

  @PostMapping("/login")
  public String login(@RequestParam String userId, @RequestParam String password) {
    Optional<User> userOptional = userService.authenticateUser(userId, password);
    return userOptional.isPresent() ? "Login Successful!" : "Invalid Credientials";
  }
}
