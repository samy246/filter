import React, { useState } from "react";
import Navbar from "../../../components/Jagota_nav_bar/Navbar";
import businessIcon from "../../../assets/images/register_module_slt/for-business.png";
import homeCookingIcon from "../../../assets/images/register_module_slt/home-coocking.png";
import "./register_module_slt.styles.scss";
import Register_slt_B2B from "../Register_slt_B2B/Register_slt_B2B";
import Register_slt_B2C_home from "../Register_slt_B2C_home/Register_slt_B2C_home";

function Register_module_slt() {
  const [Business, setBusiness] = useState(false);

  const handlesetBusinessClick = () => {
    setBusiness(true);
  };
  const [homecooking, sethomecoocking] = useState(false);

  const handlesethomecoockingClick = () => {
    sethomecoocking(true);
  };
  if (Business) {
    return <Register_slt_B2B />;
  } else if (homecooking) {
    return <Register_slt_B2C_home />;
  } else {
    return (
      <div className="register_module_slt">
        <Navbar />
        <p className="register_module_slt_heading m-0">I am Shopping for ?</p>
        <div className="d-flex justify-content-center">
          <div className="text-center padding ">
            <img
              className="register_module_sl_business_business_img"
              src={businessIcon}
              alt="businessIcon"
              width="300"
              onClick={() => handlesetBusinessClick()}
            />
            <p className="register_module_sl_business_p">Business</p>
          </div>
          <div className="text-center padding">
            <img
              className="register_module_sl_business_home_img"
              src={homeCookingIcon}
              alt="home_oocking"
              width="300"
              onClick={() => handlesethomecoockingClick()}
            />
            <p className="register_module_sl_home_p">Home Cooking</p>
          </div>
          <div className="Register_slt_B2C_home_footer">
            <button
              className="Register_slt_B2C_home_button"
              // onClick={() => B2C_inform_handler()}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>{" "}
            <button
              className="Register_slt_B2C_home_button"
              // onClick={() => B2C_inform_handler()}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Register_module_slt;
