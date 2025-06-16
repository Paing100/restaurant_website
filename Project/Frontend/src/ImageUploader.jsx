import { useState } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';

function ImageUploader({ setImagePath }) {
  // state to store the preview URL of uploaded image 
  const [previewURL, setPreviewURL] = useState("");

  // function to handle file upload 
  const handleFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      // send the image to the server using the API 
      const response = await axios.post("http://localhost:8080/api/images/upload", formData);

      if (response.status >= 200 && response.status < 300) {
        const imageUrl = await response.text(); // get uploaded image URL from server 
        setImagePath(imageUrl); // Pass image URL to parent (EditMenu)
        setPreviewURL(imageUrl); // update the preview URL for display 
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // handle drag-and-drop image upload 
  const handleDrop = (event) => {
    event.preventDefault(); // prevent default browser behavior 
    let imageFile = event.dataTransfer.files[0]; // get dropped file (image)
    handleFile(imageFile); // process the image file 
  };

  return (
    <div className="image-upload-wrapper">
      {/* Drop area for drag-and-drop image upload */}
      <div className="drop" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <p>Drop your image here...</p>
      </div>
      
      {/* Display the preview of the uploaded image */}
      {previewURL && <img src={previewURL} width="100px" alt="Preview" />}
    </div>
  );
}

ImageUploader.propTypes = {
  setImagePath: PropTypes.func.isRequired
};

export default ImageUploader;
