/* eslint-disable */
import { Select, MenuItem, FormControl, InputLabel, Button, Box } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

function Filter({ selectedFilter, onFilterChange }) {
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);

  const handleDietaryChange = (event) => {
    setSelectedDietary(event.target.value);
  };

  const handleAllergenChange = (event) => {
    setSelectedAllergens(event.target.value);
  };

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

  const handleClearFilters = () => {
    setSelectedDietary([]);
    setSelectedAllergens([]);
    onFilterChange({
      target: {
        value: {
          dietaryRestrictions: [],
          allergens: []
        }
      }
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 2 }}>
      <FormControl fullWidth variant="outlined" sx={{ width: 400, backgroundColor: '#3c3a3a', border: '1px solid #5762d5', borderRadius: '4px' }}>
        <InputLabel sx={{ color: '#5762d5' }}>Dietary Restrictions</InputLabel>
        <Select
          multiple
          value={selectedDietary}
          onChange={handleDietaryChange}
          label="Dietary Restrictions"
          renderValue={(selected) => selected.join(", ")}
        >
          <MenuItem value="Vegetarian">Vegetarian</MenuItem>
          <MenuItem value="GlutenFree">Gluten-Free</MenuItem>
          <MenuItem value="Vegan">Vegan</MenuItem>
          <MenuItem value="Halal">Halal</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined" sx={{ width: 400, backgroundColor: '#3c3a3a', border: '1px solid #5762d5', borderRadius: '4px' }}>
        <InputLabel sx={{ color: '#5762d5' }}>Allergens</InputLabel>
        <Select
          multiple
          value={selectedAllergens}
          onChange={handleAllergenChange}
          label="Exclude Allergens"
          renderValue={(selected) => selected.join(", ")}
        >
          <MenuItem value="Dairy">Dairy</MenuItem>
          <MenuItem value="Egg">Egg</MenuItem>
          <MenuItem value="Nuts">Nuts</MenuItem>
          <MenuItem value="Shellfish">Shellfish</MenuItem>
          <MenuItem value="Soya">Soya</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }} onClick={handleApplyFilter}>Filter</Button>
        <Button variant="outlined" sx={{ borderColor: '#5762d5', color: '#5762d5', '&:hover': { borderColor: 'darkgray', color: 'darkgray' } }} onClick={handleClearFilters}>Reset</Button>
      </Box>
    </Box>
  );
}

Filter.propTypes = {
  selectedFilter: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default Filter;
