import React from "react";
import "./Maintenance.scss";
import wrench from "../../assets/images/maintenance/wrench.svg";
import hammer from "../../assets/images/maintenance/hammer.svg";
import maintenanceImg from "../../assets/images/maintenance/maintenance_img.svg";

function Maintenance() {
  return (
    <div className="maintenance">
      <div className="maintenance__top">
        <img src={wrench} alt="" />
        <h4>Sorry, our website is currently under maintenance</h4>
        <img src={hammer} alt="" />
      </div>
      <div className="maintenance__bottom">
        <img src={maintenanceImg} alt="" />
      </div>
    </div>
  );
}

export default Maintenance;
