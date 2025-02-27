/* eslint-disable */
function sessionCheck({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const sessionExpiration = localStorage.getItem("sessionExpiration");
    const currentTime = new Date().getTime();

    if (sessionExpiration && sessionExpiration < currentTime) {
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("sessionExpiration");
      navigate("/login");
    } else if (localStorage.getItem("userName")) {
      navigate("/waiter")
    }
  }, [navigate]);

  return children;
}

export default sessionCheck;
