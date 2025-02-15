import {useNavigate} from "react-router-dom";

function Waiter () {
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  return (
    <>  
      <div>
        <h1>Welcome {userName}!</h1>
        <h2>Role: {userRole}</h2>
      </div>
    </>
  );
}

export default Waiter;