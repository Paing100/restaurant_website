import { TextField, Button, Typography } from "@mui/material";
import { useState } from "react";

function CalculatePrice(){
  const [cost, setCost] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0.0);
  const [result, setResult] = useState(0.0);

  const handleSubmit = async (event) =>{
    event.preventDefault();
    console.log("Calculating price" );
    const response = await fetch(`http://localhost:8080/Manager/calculateRecommendedPrice?cost=${cost}&margin=${profitMargin/100}`, {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Price calculated successfully " + data);
      setResult(data);
    } else {
      console.error("Failed to calculate price:", response.statusText);
    } 
  }

  return(
    <> 
      <Typography>Calculate Price</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          sx={{ mb: 2 }}
          label="Cost"
          name="cost"
          type="number"
          value={cost}
          onChange={(e) => setCost(parseFloat(e.target.value))}
        />
        <TextField
          sx={{ mb: 2 }}
          label="Profit Margin (in %)"
          name="profit-margin"
          type="number"
          value={profitMargin}
          onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
        />
        <Button type="submit" variant="contained">
          Calculate
        </Button>
        <Typography>Recommended Price: {result}</Typography>
      </form>
    </>
  );

}

export default CalculatePrice;
