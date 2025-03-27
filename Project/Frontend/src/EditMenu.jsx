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

  const handleChange = (event) => {
    setMenuItem({ ...menuItem, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          sx={textFieldStyles}
        />

        {/* Calories Field */}
        <TextField
          label="Calories"
          name="calories"
          type="number"
          value={menuItem.calories}
          onChange={handleChange}
          fullWidth
          required
          sx={textFieldStyles}
        />

        {/* Category Field */}
        <TextField
          label="Category"
          name="category"
          value={menuItem.category}
          onChange={handleChange}
          fullWidth
          required
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