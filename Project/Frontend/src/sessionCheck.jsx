/* eslint-disable */
function sessionCheck({children}) {
  const navigate = useNavigate();

  useEffect(() => {
    const sessionExpiration = localStorage.getItem("sessionExpiration");
    const currentTime = new Date().getTime();
    const role = localStorage.getItem("userRole");

    if (sessionExpiration && sessionExpiration < currentTime) {
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("sessionExpiration");
      navigate("/login");
    } else if (localStorage.getItem("userName")) {
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
