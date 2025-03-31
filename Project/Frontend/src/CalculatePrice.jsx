import { TextField, Button, Typography, Box } from "@mui/material";
import { useState } from "react";

function CalculatePrice() {
  const [cost, setCost] = useState('');
  const [profitMargin, setProfitMargin] = useState('');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({
    cost: '',
    profitMargin: ''
  });

  const validateInputs = () => {
    const newErrors = {
      cost: '',
      profitMargin: ''
    };

    // Validate cost
    if (cost === '' || cost === null) {
      newErrors.cost = 'Cost is required';
    } else if (parseFloat(cost) < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }

    // Validate profit margin
    if (profitMargin === '' || profitMargin === null) {
      newErrors.profitMargin = 'Profit margin is required';
    } else {
      const marginValue = parseFloat(profitMargin);
      if (isNaN(marginValue)) {
        newErrors.profitMargin = 'Invalid profit margin';
      } else if (marginValue < 0) {
        newErrors.profitMargin = 'Profit margin cannot be negative';
      } else if (marginValue > 100) {
        newErrors.profitMargin = 'Profit margin cannot exceed 100%';
      }
    }

    setErrors(newErrors);
    return !newErrors.cost && !newErrors.profitMargin;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Clear previous result
    setResult(null);

    // Validate inputs before submission
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/Manager/calculateRecommendedPrice?cost=${cost}&margin=${parseFloat(profitMargin)/100}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Price calculated successfully " + data);
        setResult(data);
      } else {
        console.error("Failed to calculate price:", response.statusText);
      }
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
      <Button
        onClick={() => window.history.back()}
        sx={{
          position: "absolute",
          top: "100px",
          left: "30px",
          backgroundColor: "#333",
          color: "white",
          "&:hover": {
            backgroundColor: "darkgray",
          },
        }}
      >
        ← Back
      </Button>
      
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: 3, color: "white" }}
      >
        Calculate Price
      </Typography>
      
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <TextField
          label="Cost"
          name="cost"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          fullWidth
          required
          error={!!errors.cost}
          helperText={errors.cost}
          inputProps={{ 
            min: 0, 
            step: 0.01 
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "white",
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
          }}
        />
        
        <TextField
          label="Profit Margin (in %)"
          name="profit-margin"
          type="number"
          value={profitMargin}
          onChange={(e) => setProfitMargin(e.target.value)}
          fullWidth
          required
          error={!!errors.profitMargin}
          helperText={errors.profitMargin}
          inputProps={{ 
            min: 0, 
            max: 100, 
            step: 0.1 
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "white",
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
          }}
        />
        
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#333",
            color: "white",
            "&:hover": {
              backgroundColor: "#666",
            },
          }}
        >
          Calculate
        </Button>
      </form>
      
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