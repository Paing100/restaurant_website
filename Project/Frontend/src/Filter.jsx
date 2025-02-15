import { Select, MenuItem, FormControl, InputLabel,Button, Box} from "@mui/material";
import PropTypes from "prop-types";


function Filter({ selectedFilter, onFilterChange }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
      <FormControl fullWidth variant="outlined" sx={{ width: 400 }}>
        <InputLabel>Filter by</InputLabel>
        <Select
          multiple
          value={selectedFilter}
          onChange={onFilterChange}
          label="Filter by"
          renderValue={(selected) => selected.join(", ")}
        >
          <MenuItem value="Vegetarian">Vegetarian</MenuItem>
          <MenuItem value="Gluten-Free">Gluten-Free</MenuItem>
          <MenuItem value="Vegan">Vegan</MenuItem>
          <MenuItem value="Halal">Halal</MenuItem>
          <MenuItem value="Avocado">Avocado</MenuItem>
          <MenuItem value="Tomato">Tomato</MenuItem>
          <MenuItem value="Dairy">Dairy</MenuItem>
          <MenuItem value="Wheat">Wheat</MenuItem>
          <MenuItem value="Egg">Egg</MenuItem>
          <MenuItem value="Corn">Corn</MenuItem>
          <MenuItem value="Citrus">Citrus</MenuItem>
          <MenuItem value="None">None</MenuItem>
        </Select>
      </FormControl>

      
      <Button variant="contained">Filter</Button>
    </Box>
  );
}

Filter.propTypes = {
  selectedFilter: PropTypes.array.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default Filter;
