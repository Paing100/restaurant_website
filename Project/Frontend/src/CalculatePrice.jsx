import { TextField, Button, Typography, Box } from "@mui/material";
import { useState } from "react";

function CalculatePrice() {
  const [cost, setCost] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0.0);
  const [result, setResult] = useState(0.0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Calculating price");
    const response = await fetch(
      `http://localhost:8080/Manager/calculateRecommendedPrice?cost=${cost}&margin=${profitMargin / 100}`,
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
          onChange={(e) => setCost(parseFloat(e.target.value))}
          fullWidth
          required
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
          onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
          fullWidth
          required
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
