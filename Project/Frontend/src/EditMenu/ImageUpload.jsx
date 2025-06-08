import { Box, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";

function ImageUpload({imagePath, onImageChange}) {
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    onImageChange(file);
  };

  // handle drag-and-drop image upload 
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
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
                {imagePath && <img src={imagePath} alt="Menu Item" width="150px" />}
            </Box>
    
  )
}

ImageUpload.propTypes = {
  imagePath: PropTypes.string.isRequired,
  onImageChange: PropTypes.func.isRequired
}

export default ImageUpload;