import React from "react";
import "./drag_and_drop.scss";

function Drag_and_drop({ label, id }) {
  return (
    <div className=" Drag_and_drop pt-3">
      <p className="Drag_and_drop_lable">{label}</p>
      <div className="Drag_and_drop_file-drop-area  d-flex justify-content-center">
        <div className="file-drop-area">
          <i className="fas fa-file-upload fa-2x file-drop-area_icon"></i>
          <div className="file-drop-area_text">
            <p className="file-message m-0" htmlFor={id}>
              drag and drop files here
            </p>
            <small>file support</small>
          </div>
        </div>
        <h4 className="m-4">or</h4>
        <div className="file-drop-area_input">
          <label className="btn file-drop-area_btn" id="image-event-label">
            Choose file
            <input type="file" name={id} id={id} hidden />
          </label>
        </div>
      </div>
    </div>
  );
}

export default Drag_and_drop;
