import {useState} from "react";
import PropTypes from 'prop-types';

function ImageUploader({setImagePath}) {

  const [image, setImage] = useState("");
  const [previewURL, setPreviewURL] = useState("");

  const handleFile = file => {
    setImage(file);
    setPreviewURL(URL.createObjectURL(file));
    const imagePath = `assets/${file.name}`;
    setImagePath(imagePath);
  }

  const handleDragOver = (event) => {
    event.preventDefault();
  }

  const handleOnDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    let imageFile = event.dataTransfer.files[0];
    handleFile(imageFile);
  }

  return (
    <>
      <div className="image-upload-wrapper">
        <div className="drop" onDragOver={handleDragOver} onDrop={handleOnDrop}>
          <p>Drop you image here...</p>
        </div>
        {
          previewURL && <div className="image">
            <img src={previewURL} width="100px"/><span>{image.name}</span>
            </div>
        }
      </div>
    </>
  );
}

ImageUploader.propTypes = {
  setImagePath: PropTypes.string.isReuqired
};

export default ImageUploader; 