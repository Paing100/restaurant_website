import { Typography, Box } from "@mui/material";
import { useState } from "react";
import PriceForm from "./CalculatePrice/PriceForm";
import BackButton from "./BackButton";
import axios from 'axios';

function CalculatePrice() {
  // State variables for cost, profit margin, result and error
  const [cost, setCost] = useState('');
  const [profitMargin, setProfitMargin] = useState('');
  const [result, setResult] = useState(null);


  // Function to handle form submission 
  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent default form submission behavior 
    
    // Clear previous result
    setResult(null);

    try {
      // API call to calculate the price 
      const {data: data} = await axios.get(
        `http://localhost:8080/Manager/calculateRecommendedPrice?cost=${cost}&margin=${parseFloat(profitMargin)/100}`);

      console.log("Price calculated successfully " + data);
      setResult(data); // update the result with the calculated price 
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "75vh",
        padding: 3,
      }}
    >
      {/* Back button */}
      <BackButton></BackButton>
      
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: 3, color: "white" }}
      >
        Calculate Price
      </Typography>
      
      {/* Form for entering cost and profit margin */}
      <PriceForm handleSubmit={handleSubmit} 
                cost={cost} 
                profitMargin={profitMargin} 
                setCost={setCost} 
                setProfitMargin={setProfitMargin}/>
      
      {/* Display the calculated recommended price */}
      <Typography
        variant="h6"
        sx={{ marginTop: 3, color: "white", fontWeight: "bold" }}
      >
        Recommended Price: {result ? `£${result.toFixed(2)}` : "N/A"}
      </Typography>
    </Box>
  );
}

export default CalculatePrice;