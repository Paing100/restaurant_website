import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SessionCheck({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const sessionExpiration = sessionStorage.getItem("sessionExpiration"); // Retrieve session expiration time
    const currentTime = new Date().getTime(); // Get the current time in milliseconds
    const role = sessionStorage.getItem("userRole"); // Retrieve the user's role from session storage

     // If the session has expired, clear session storage and redirect to login
    if (sessionExpiration && sessionExpiration < currentTime) {
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("sessionExpiration");
      navigate("/login");

      // If the user has a role, navigate them to the appropriate page
    } else if (role) {
      if (role === "WAITER") {
        navigate("/waiter");
      } else if (role === "KITCHEN") {
        navigate("/kitchen");
      } else if (role === "MANAGER") {
        navigate("/manager")
      }
    }
  }, [navigate]);

  return children;
}

export default SessionCheck;
