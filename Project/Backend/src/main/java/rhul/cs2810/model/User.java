package rhul.cs2810.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class User {
  @Id
  @GeneratedValue
  private long id;

  @Column(nullable = false, unique = true)
  private String userId;

  @Column(nullable = false)
  private String password;

  public User() {

  }

  public User(String userId, String password) {
    this.userId = userId;
    this.password = password;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }



}
