import { useState } from "react";
import PropTypes from 'prop-types';

function ImageUploader({ setImagePath }) {
  const [previewURL, setPreviewURL] = useState("");

  const handleFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:8080/api/images/upload", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const imageUrl = await response.text();
        setImagePath(imageUrl); // Pass image URL to parent (EditMenu)
        setPreviewURL(imageUrl);
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    let imageFile = event.dataTransfer.files[0];
    handleFile(imageFile);
  };

  return (
    <div className="image-upload-wrapper">
      <div className="drop" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <p>Drop your image here...</p>
      </div>
      {previewURL && <img src={previewURL} width="100px" alt="Preview" />}
    </div>
  );
}

ImageUploader.propTypes = {
  setImagePath: PropTypes.func.isRequired
};

export default ImageUploader;
