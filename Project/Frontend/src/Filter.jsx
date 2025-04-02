import { Select, MenuItem, FormControl, InputLabel, Button, Box } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

function Filter({ onFilterChange }) {
  // state variables 
  const [selectedDietary, setSelectedDietary] = useState([]); // stores selected dietary restrctions 
  const [selectedAllergens, setSelectedAllergens] = useState([]); // stores selected allergens 

  // handle changes to dietary restrictions selection
  const handleDietaryChange = (event) => {
    setSelectedDietary(event.target.value); // update the selection 
  };

  // handle changes to allergens selection 
  const handleAllergenChange = (event) => {
    setSelectedAllergens(event.target.value); // update the selection 
  };

  // Apply the filters 
  const handleApplyFilter = () => {
    onFilterChange({
      target: {
        value: {
          dietaryRestrictions: selectedDietary,
          allergens: selectedAllergens
        }
      }
    });
  };

  // Clear all filters 
  const handleClearFilters = () => {
    setSelectedDietary([]); // reset dietary restrictions 
    setSelectedAllergens([]); // reset allergens 
    onFilterChange({
      target: {
        value: {
          dietaryRestrictions: [], // empty array 
          allergens: [] // empty array 
        }
      }
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 2 }}>
      {/* Dropdown for selecting dietary restrictions */}
      <FormControl fullWidth variant="outlined" sx={{ width: 400, backgroundColor: '#3c3a3a', border: '1px solid #5762d5', borderRadius: '4px' }}>
        <InputLabel sx={{ color: '#5762d5' }}>Dietary Restrictions</InputLabel>
        <Select
          multiple
          value={selectedDietary}
          onChange={handleDietaryChange}
          label="Dietary Restrictions"
          renderValue={(selected) => selected.join(", ")}
        >
        {/* Options for dietary restrictions */}
          <MenuItem value="Vegetarian">Vegetarian</MenuItem>
          <MenuItem value="GlutenFree">Gluten-Free</MenuItem>
          <MenuItem value="Vegan">Vegan</MenuItem>
          <MenuItem value="Halal">Halal</MenuItem>
        </Select>
      </FormControl>

      {/* Dropdown for selecting allergens */}
      <FormControl fullWidth variant="outlined" sx={{ width: 400, backgroundColor: '#3c3a3a', border: '1px solid #5762d5', borderRadius: '4px' }}>
        <InputLabel sx={{ color: '#5762d5' }}>Allergens</InputLabel>
        <Select
          multiple
          value={selectedAllergens}
          onChange={handleAllergenChange}
          label="Exclude Allergens"
          renderValue={(selected) => selected.join(", ")}
        >
        {/* Options for allergens */}
          <MenuItem value="Dairy">Dairy</MenuItem>
          <MenuItem value="Egg">Egg</MenuItem>
          <MenuItem value="Nuts">Nuts</MenuItem>
          <MenuItem value="Shellfish">Shellfish</MenuItem>
          <MenuItem value="Soya">Soya</MenuItem>
        </Select>
      </FormControl>
      
      {/* Buttons for applying and clearing filters */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }} onClick={handleApplyFilter}>Filter</Button>
        <Button variant="outlined" sx={{ borderColor: '#5762d5', color: '#5762d5', '&:hover': { borderColor: 'darkgray', color: 'darkgray' } }} onClick={handleClearFilters}>Reset</Button>
      </Box>
    </Box>
  );
}

Filter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default Filter;
