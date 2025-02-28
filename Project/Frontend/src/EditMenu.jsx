import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageUploader from "./ImageUploader";
import { TextField, Button, Box, Typography, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert } from "@mui/material";
function EditMenu(){

  const [menuItem, setMenuItem] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [severity, setSeverity] = useState('success');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState('');

  const ALLERGENS_OPTIONS = ["GLUTEN", "DAIRY", "PEANUTS", "SHELLFISH"];
  const DIETARY_RESTRICTIONS_OPTIONS = ["VEGETERIAN", "VEGAN", "HALAL"];

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetch(`http://localhost:8080/MenuItems/get/${id}`)
    .then(response => response.json())
    .then(data => {
      setMenuItem({ ...data }); 
    })
    .catch(error => console.log(error))
  }, [id]);

  const handleChange = (event) => {
    setMenuItem({ ...menuItem, [event.target.name]: event.target.value });
  };

  const handleImageUpload = (file) => {
    setImageFile(file);
  }

  const handleSubmit = async(e) => {
    e.preventDefault(); 
    const response = await fetch(`http://localhost:8080/MenuItems/edit/${id}`, {
      method: "PUT", 
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(menuItem)
    });
    if (response.ok) {
      setSeverity('success');
      setMessage("Menu Updated Successfully!");
      console.log("Snackbar should open - success");
      setOpen(true);
      setTimeout(() => {
        navigate("/waiter_menu");  
      }, 3000);
    } else {
      console.error("Failed to update menu item:", response.statusText);
    }  };
  if (!menuItem) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography>Edit menu item</Typography>
      <form onSubmit={handleSubmit}>
        <TextField sx={{ mb: 2 }}label="Name" name="name" value={menuItem.name} onChange={handleChange} fullWidth />
        <TextField sx={{ mb: 2 }} label="Description" name="description" value={menuItem.description} onChange={handleChange} fullWidth />
        <TextField sx={{ mb: 2 }} label="Price" name="price" type="number" value={menuItem.price} onChange={handleChange} fullWidth />
        <TextField sx={{ mb: 2 }} label="Calories" name="calories" type="number" value={menuItem.calories} onChange={handleChange} fullWidth />
        <TextField sx={{ mb: 2 }} label="Category" name="category" type="number" value={menuItem.category} onChange={handleChange} fullWidth />
        {/* <TextField sx={{ mb: 2 }} label="Image Path" name="imagePath" value={menuItem.imagePath} onChange={handleChange} fullWidth disabled/> */}
        <ImageUploader onImageUpload={handleImageUpload}></ImageUploader>

        {/* Multi-Select for Allergens */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Allergens</InputLabel>
          <Select
            name="allergens"
            multiple
            value={menuItem.allergens}
            onChange={handleChange}
          >
            {ALLERGENS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Multi-Select for Dietary Restrictions */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Dietary Restrictions</InputLabel>
          <Select
            name="dietaryRestrictions"
            multiple
            value={menuItem.dietaryRestrictions}
            onChange={handleChange}
          >
            {DIETARY_RESTRICTIONS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Boolean Dropdown for "Available" */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Available</InputLabel>
          <Select name="available" value={menuItem.available} onChange={handleChange}>
            <MenuItem value={true}>Available</MenuItem>
            <MenuItem value={false}>Not Available</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained">Save Changes</Button>
      </form>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
      </Snackbar>
    </Box>
  );
}

export default EditMenu;