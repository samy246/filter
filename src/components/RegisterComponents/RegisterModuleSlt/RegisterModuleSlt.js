import React, { useState } from "react";
import Navbar from "../../Jagota_nav_bar/Navbar";
import businessIcon from "../../../assets/images/RegisterModuleSlt/for-business.png";
import homeCookingIcon from "../../../assets/images/RegisterModuleSlt/home-Cooking.png";
import "./RegisterModuleSlt.styles.scss";
import Register_slt_B2B from "../Register_slt_B2B/Register_slt_B2B";
import Register_slt_B2C_home from "../Register_slt_B2C_home/Register_slt_B2C_home";

function RegisterModuleSlt() {
  const [Business, setBusiness] = useState(false);

  const handlesetBusinessClick = () => {
    setBusiness(true);
  };
  const [homecooking, sethomeCooking] = useState(false);

  const handlesethomeCookingClick = () => {
    sethomeCooking(true);
  };
  if (Business) {
    return <Register_slt_B2B />;
  } else if (homecooking) {
    return <Register_slt_B2C_home />;
  } else {
    return (
      <div className="registerModuleSlt">
        <Navbar />
        <p className="registerModuleSlt_heading m-0">I am Shopping for ?</p>
        <div className="d-flex justify-content-center">
          <div className="text-center padding ">
            <img
              className="register_module_sl_business_business_img"
              src={businessIcon}
              alt=""
              width="300"
              onClick={() => handlesetBusinessClick()}
            />
            <p className="register_module_sl_business_p">Business</p>
          </div>
          <div className="text-center padding">
            <img
              className="register_module_sl_business_home_img"
              src={homeCookingIcon}
              alt=""
              width="300"
              onClick={() => handlesethomeCookingClick()}
            />
            <p className="register_module_sl_home_p">Home Cooking</p>
          </div>
          <div className="Register_slt_B2C_home_footer">
            <button className="Register_slt_B2C_home_button">
              Next <i className="fas fa-chevron-right"></i>
            </button>{" "}
            <button className="Register_slt_B2C_home_button">
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterModuleSlt;
