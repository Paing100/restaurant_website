import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert } from "@mui/material";

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

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetch(`http://localhost:8080/MenuItems/get/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setMenuItem(data);
        setImagePath(data.imagePath || "");
      })
      .catch((error) => console.log(error));
  }, [id]);

  const handleChange = (event) => {
    setMenuItem({ ...menuItem, [event.target.name]: event.target.value });
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
    const updatedMenuItem = { ...menuItem, imagePath };

    const response = await fetch(`http://localhost:8080/MenuItems/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMenuItem),
    });

    if (response.ok) {
      setSeverity("success");
      setMessage("Menu Updated Successfully!");
      setOpen(true);
      setTimeout(() => {
        navigate("/waiter_menu");
      }, 3000);
    } else {
      console.error("Failed to update menu item:", response.statusText);
    }
  };

  if (!menuItem) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography sx={{ color: "white" }}>Edit menu item</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          sx={{
            mb: 2,
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiInputLabel-root": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
          }}
          label="Name"
          name="name"
          value={menuItem.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          sx={{
            mb: 2,
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiInputLabel-root": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
          }}
          label="Description"
          name="description"
          value={menuItem.description}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          sx={{
            mb: 2,
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiInputLabel-root": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
          }}
          label="Price"
          name="price"
          type="number"
          value={menuItem.price}
          onChange={handleChange}
          fullWidth
        />

        {/* Drag & Drop File Upload */}
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
            <Button variant="outlined" component="span" sx={{ mt: 1 }}>
              Select File
            </Button>
          </label>
        </Box>
        {imagePath && <img src={imagePath} alt="Menu Item" width="150px" />}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: "white" }}>Allergens</InputLabel>
          <Select
            name="allergens"
            multiple
            value={menuItem.allergens}
            onChange={handleChange}
            sx={{ color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" } }}
          >
            {ALLERGENS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: "white" }}>Dietary Restrictions</InputLabel>
          <Select
            name="dietaryRestrictions"
            multiple
            value={menuItem.dietaryRestrictions}
            onChange={handleChange}
            sx={{ color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" } }}
          >
            {DIETARY_RESTRICTIONS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: "white" }}>Available</InputLabel>
          <Select
            name="available"
            value={menuItem.available}
            onChange={handleChange}
            sx={{ color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" } }}
          >
            <MenuItem value={true}>Available</MenuItem>
            <MenuItem value={false}>Not Available</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained">
          Save Changes
        </Button>
      </form>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EditMenu;
