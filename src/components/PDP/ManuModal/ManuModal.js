import React from "react";
import "./ManuModal.scss";

function ManuModal() {
  return (
    <div className="manumodal">
      <div className="manumodal__header">
        <h4>Manufacturing, Packaging and Important Info</h4>
      </div>
      <div className="manumodal__content">
        <p>
          <span className="label">Genertic Name: </span>
          <span className="value">Passion Premium</span>
        </p>
        <p>
          <span className="label">Expiry Date: </span>
          <span className="value">31/12/2021</span>
        </p>
        <p>
          <span className="label">Country of Origin: </span>
          <span className="value">Japan</span>
        </p>
      </div>
      <div className="manumodal__footer">
        <p className="footer__heading">Packer's Details</p>
        <hr />
        <p className="manumodal__address">
          91/7 sukhumvit Soi 54 Prakanong Bangjak Bangkok 10260 Thailand
        </p>
      </div>
    </div>
  );
}

export default ManuModal;
