import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import PropTypes from "prop-types";
import {inputStyle} from '../useCommonInputStyle';


function EditMenuForm( {imageComponent, handleSubmit, menuItem, handleChange, errors} ) { 

  // Options for allergens and dietary restrictions 
  const ALLERGENS_OPTIONS = ["GLUTEN", "DAIRY", "PEANUTS", "SHELLFISH"];
  const DIETARY_RESTRICTIONS_OPTIONS = ["VEGETARIAN", "VEGAN", "HALAL"];

  const selectStyles = {
    color: "white",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
  };

  return (
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <TextField
              label="Name"
              name="name"
              value={menuItem.name}
              onChange={handleChange}
              fullWidth
              required
              error={errors.name}
              helperText={errors.name ? "Name must be 3-50 characters, only letters, spaces, and hyphens" : ""}
              sx={{mb: 2, ...inputStyle}}
            />
    
            {/* Description Field */}
            <TextField
              label="Description"
              name="description"
              value={menuItem.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={3}
              error={errors.description}
              helperText={errors.description ? "Description must be 10-250 characters" : ""}
              sx={{mb:2, ...inputStyle}}
            />
    
            {/* Price Field */}
            <TextField
              label="Price"
              name="price"
              type="number"
              value={menuItem.price}
              onChange={handleChange}
              fullWidth
              required
              error={errors.price}
              helperText={errors.price ? "Price must be between 0 and 21" : ""}
              inputProps={{ step: "0.01", min: "0", max: "1000" }}
              sx={inputStyle}
            />
    
            {/* Image Upload */}
            {imageComponent}
    
            {/* Calories Field */}
            <TextField
              label="Calories"
              name="calories"
              type="number"
              value={menuItem.calories}
              onChange={handleChange}
              fullWidth
              required
              error={errors.calories}
              helperText={errors.calories ? "Calories must be between 0 and 2000" : ""}
              inputProps={{ min: "0", max: "2000" }}
              sx={inputStyle}
            />
    
            {/* Category Field */}
            <TextField
              label="Category"
              name="category"
              type="number"
              value={menuItem.category}
              onChange={handleChange}
              fullWidth
              required
              error={errors.category}
              helperText={errors.category ? "Category must be between 0 and 3" : ""}
              inputProps={{ min: "0", max: "3" }}
              sx={inputStyle}
            />
    
            {/* Allergens Multi-Select */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "white" }}>Allergens</InputLabel>
              <Select
                name="allergens"
                multiple
                value={menuItem.allergens}
                onChange={handleChange}
                sx={selectStyles}
              >
                {ALLERGENS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
    
            {/* Dietary Restrictions Multi-Select */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "white" }}>Dietary Restrictions</InputLabel>
              <Select
                name="dietaryRestrictions"
                multiple
                value={menuItem.dietaryRestrictions}
                onChange={handleChange}
                sx={selectStyles}
              >
                {DIETARY_RESTRICTIONS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
    
            {/* Availability Dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "white" }}>Available</InputLabel>
              <Select
                name="available"
                value={menuItem.available}
                onChange={handleChange}
                sx={selectStyles}
              >
                <MenuItem value={true}>Available</MenuItem>
                <MenuItem value={false}>Not Available</MenuItem>
              </Select>
            </FormControl>
    
            {/* Submit Button */}
            <Button
              type="submit" 
              variant="contained"
              sx={{
                backgroundColor: "#5762d5",
                color: "white",
                "&:hover": { backgroundColor: "#4751b3" },
              }}
            >
              Save Changes
            </Button>
          </form>
  );
}

EditMenuForm.propTypes = {
  imageComponent: PropTypes.element.isRequired, 
  handleSubmit: PropTypes.func.isRequired, 
  menuItem: PropTypes.object.isRequired, 
  handleChange: PropTypes.func.isRequired, 
  errors: PropTypes.object.isRequired
}


export default EditMenuForm;