/* eslint-disable */
function sessionCheck({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const sessionExpiration = sessionStorage.getItem("sessionExpiration");
    const currentTime = new Date().getTime();
    const role = sessionStorage.getItem("userRole");

    if (sessionExpiration && sessionExpiration < currentTime) {
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("sessionExpiration");
      navigate("/login");
    } else if (role) {
      if (role === "WAITER") {
        navigate("/waiter");
      } else if (role === "KITCHEN") {
        navigate("/kitchen");
      }
    }
  }, [navigate]);

  return children;
}

export default sessionCheck;
