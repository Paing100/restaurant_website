import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  validateName,
  validateDescription,
  validatePrice,  
  validateCalories, 
  validateCategory
} from "./EditMenu/menuValidations";

import ImageUpload from "./EditMenu/ImageUpload";
import EditMenuForm from "./EditMenu/EditMenuForm";

function EditMenu() {
  // state variables 
  const [menuItem, setMenuItem] = useState(null); // stores menu item being edited 
  const [imagePath, setImagePath] = useState(""); // stores uploaded image path 
  const { id } = useParams(); // get menu item id from the URL 
  const navigate = useNavigate(); // hook for navigation 
  const [severity, setSeverity] = useState("success");  // snack bar severity 
  const [open, setOpen] = useState(false); // snackbar visibility 
  const [message, setMessage] = useState(""); // snackbar message 
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    price: false,
    calories: false,
    category: false
  }); // validation errors for form fields 

  // fetch the menu item details when component loads
  useEffect(() => {
    fetch(`http://localhost:8080/MenuItems/get/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setMenuItem(data);
        setImagePath(data.imagePath || "");
      })
      .catch((error) => console.error("Error fetching menu item:", error));
  }, [id]);

  // handle changes to the form fields 
  // validate functions are imported from EditMenu/ 
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

  // handle image upload 
  const handleImageUpload = async (file) => {
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

  // handle form submission 
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
        setTimeout(() => navigate("/waiter_menu"), 3000); // redirect to waiter menu pager after success after 3 seconds 
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

  // close the snackbar 
  const handleClose = () => {
    setOpen(false);
  };

  // show loading message if the item is not yet loaded 
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
      <EditMenuForm 
          imageComponent={
              <ImageUpload imagePath={imagePath} onImageChange={handleImageUpload}></ImageUpload>
          }
          handleSubmit={handleSubmit}
          menuItem={menuItem}
          handleChange={handleChange}
          errors={errors}
      ></EditMenuForm>

      {/* Snackbar for Notifications */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EditMenu;