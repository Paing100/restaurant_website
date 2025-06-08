import { TextField, Button } from "@mui/material";
import PropTypes from "prop-types";

function PriceForm({ handleSubmit, cost, profitMargin, setCost, setProfitMargin }) {

  return (
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
        {/* Input field for cost */}
        <TextField
          label="Cost"
          name="cost"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          fullWidth
          required
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
        
        {/* Input field for profit margin */}
        <TextField
          label="Profit Margin (in %)"
          name="profit-margin"
          type="number"
          value={profitMargin}
          onChange={(e) => setProfitMargin(e.target.value)}
          fullWidth
          required
          inputProps={{ 
            min: 0, 
            max: 99, 
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
  );
}

PriceForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  cost: PropTypes.string.isRequired,
  profitMargin: PropTypes.string.isRequired,
  setCost: PropTypes.func.isRequired,
  setProfitMargin: PropTypes.func.isRequired
}


export default PriceForm;