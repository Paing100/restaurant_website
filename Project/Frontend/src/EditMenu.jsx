import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";

function EditMenu() {
  const [menuItem, setMenuItem] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [severity, setSeverity] = useState("success");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    price: false,
    calories: false,
    category: false
  });

  const ALLERGENS_OPTIONS = ["GLUTEN", "DAIRY", "PEANUTS", "SHELLFISH"];
  const DIETARY_RESTRICTIONS_OPTIONS = ["VEGETARIAN", "VEGAN", "HALAL"];

  useEffect(() => {
    fetch(`http://localhost:8080/MenuItems/get/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setMenuItem(data);
        setImagePath(data.imagePath || "");
      })
      .catch((error) => console.error("Error fetching menu item:", error));
  }, [id]);

  const validateName = (name) => {
    // Name should be 3-50 characters, only letters, spaces, and hyphens
    return /^[A-Za-z\s-]{3,50}$/.test(name);
  };

  const validateDescription = (description) => {
    // Description should be 10-250 characters
    return description.length >= 10 && description.length <= 250;
  };

  const validatePrice = (price) => {
    // Price should be a positive number between 0 and 21
    return price > 0 && price < 21;
  };

  const validateCalories = (calories) => {
    // Calories should be between 0 and 2000
    return calories >= 0 && calories <= 2000;
  };

  const validateCategory = (category) => {
    // Category should be between 0 and 3
    return category >= 0 && category <= 3;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Validate inputs based on field name
    if (name === 'name') {
      setErrors(prev => ({ ...prev, name: !validateName(value) }));
    } else if (name === 'description') {
      setErrors(prev => ({ ...prev, description: !validateDescription(value) }));
    } else if (name === 'price') {
      setErrors(prev => ({ ...prev, price: !validatePrice(value) }));
    } else if (name === 'calories') {
      setErrors(prev => ({ ...prev, calories: !validateCalories(value) }));
    } else if (name === 'category') {
      setErrors(prev => ({ ...prev, category: !validateCategory(value) }));
    }

    setMenuItem({ ...menuItem, [name]: value });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:8080/api/images/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const imageUrl = await response.text();
        setImagePath(imageUrl);
        setMenuItem({ ...menuItem, imagePath: imageUrl });
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const nameValid = validateName(menuItem.name);
    const descriptionValid = validateDescription(menuItem.description);
    const priceValid = validatePrice(menuItem.price);
    const caloriesValid = validateCalories(menuItem.calories);
    const categoryValid = validateCategory(menuItem.category);

    // Update errors state
    setErrors({
      name: !nameValid,
      description: !descriptionValid,
      price: !priceValid,
      calories: !caloriesValid,
      category: !categoryValid
    });

    // Check if any validation failed
    if (!nameValid || !descriptionValid || !priceValid || !caloriesValid || !categoryValid) {
      setSeverity("error");
      setMessage("Please correct the errors before submitting.");
      setOpen(true);
      return;
    }

    const updatedMenuItem = { ...menuItem, imagePath };

    try {
      const response = await fetch(`http://localhost:8080/MenuItems/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMenuItem),
      });

      if (response.ok) {
        setSeverity("success");
        setMessage("Menu Updated Successfully!");
        setOpen(true);
        setTimeout(() => navigate("/waiter_menu"), 3000);
      } else {
        throw new Error("Failed to update menu item.");
      }
    } catch (error) {
      console.error(error);
      setSeverity("error");
      setMessage("Failed to update menu item.");
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!menuItem) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: 3, maxWidth: "600px", margin: "0 auto", color: "white" }}>
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        sx={{
          backgroundColor: "#333",
          color: "white",
          "&:hover": { backgroundColor: "darkgray" },
          marginBottom: 3,
        }}
      >
        ← Back
      </Button>

      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3 }}>
        Edit Menu Item
      </Typography>

      {/* Form */}
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
          sx={textFieldStyles}
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
          sx={textFieldStyles}
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
          sx={textFieldStyles}
        />

        {/* Image Upload */}
        <Box
          sx={{
            border: "2px dashed white",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            mb: 2,
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Typography sx={{ color: "white" }}>
            Drag & drop an image here, or click to select
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outlined" component="span" sx={{ mt: 1, color: "white", borderColor: "white" }}>
              Select File
            </Button>
          </label>
        </Box>
        {imagePath && <img src={imagePath} alt="Menu Item" width="150px" />}

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
          sx={textFieldStyles}
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
          sx={textFieldStyles}
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

      {/* Snackbar for Notifications */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const textFieldStyles = {
  mb: 2,
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiInputLabel-root": { color: "white" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "white" },
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
};

const selectStyles = {
  color: "white",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
};

export default EditMenu;