import React, { useState } from "react";
import Navbar from "../../../components/Jagota_nav_bar/Navbar";
import businessIcon from "../../../assets/images/register_module_slt/for-business.png";
import homeCoockingIcon from "../../../assets/images/register_module_slt/home-coocking.png";
import "./register_slt_B2C_home.scss";
import Register_B2C_inform from "../Register_B2C_inform/Register_B2C_inform";

function Register_slt_B2C_home() {
  const [B2c_inform, setB2c_inform] = useState(false);
  const B2C_inform_handler = () => {
    setB2c_inform(true);
  };

  if (B2c_inform) {
    return <Register_B2C_inform />;
  } else {
    return (
      <div className="Register_slt_B2C_home">
        <Navbar />
        <p className="Register_slt_B2C_home_heading m-0 text-secondary">
          I am Shopping for ?
        </p>
        <div className="text-center">
          <div className="d-flex justify-content-center pt-4">
            <div className="text-center padding">
              <img
                className="Register_slt_B2C_home_business_img"
                src={businessIcon}
                alt="businessIcon"
                width="300"
              />
              <p className="p gray">Business</p>
            </div>
            <div className="text-center padding  ">
              <img
                className="Register_slt_B2C_home_cooking_img  border_img rounded "
                src={homeCoockingIcon}
                alt="home_oocking"
                width="300"
              />
              <p className="p color_g">Home Cooking</p>
            </div>
          </div>
          <div className="Register_slt_B2C_home_footer">
            <button
              className="Register_slt_B2C_home_button"
              onClick={() => B2C_inform_handler()}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Register_slt_B2C_home;
