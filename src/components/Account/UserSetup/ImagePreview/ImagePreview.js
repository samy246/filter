import React, { useState } from "react";
import placeholder from "../../../../assets/images/avatar.jpeg";
import "./ImagePreview.scss";
function ImagePreview() {
  const [{ alt, src }, setImg] = useState({
    src: placeholder,
    alt: "Upload an Image",
  });

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        src: URL.createObjectURL(e.target.files[0]),
        alt: e.target.files[0].name,
      });
    }
  };

  return (
    <div className="img__uploader">
      <form encType="multipart/form-data">
        <div className="form__img-input-container">
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            id="photo"
            className="visually-hidden"
            onChange={handleImg}
          />
          <label htmlFor="photo" className="form-img__file-label">
            Add Image{" "}
          </label>
          <img src={src} alt={alt} className="form-img__img-preview" />
        </div>
      </form>
    </div>
  );
}

export default ImagePreview;
