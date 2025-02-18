import { Typography } from "@mui/material";
import axios from "axios";

function Home() {


  async function testButton() {
    const response = await axios.post("http://localhost:8080/MenuItems/addMenuItem",
      {
        "name": "Burger",
        "description": "Delicious",
        "price": 12.03,
        "calories": 450,
        "available": true,
        "allergens": "NUTS",
        "dietaryRestrictions": "VEGAN"
      });
    console.log(response);
  }

  return (
    <>
      <div className="content">
        <Typography
          variant="h2"
          component="h2"
          color="primary"
          align="center"
        >
          Welcome to Oaxaca!!!
          <button onClick={testButton}>Click here</button>
        </Typography>
      </div>
    </>
  );

}

export default Home; 