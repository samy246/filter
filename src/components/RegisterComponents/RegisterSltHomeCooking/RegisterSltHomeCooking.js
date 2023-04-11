import React, { useState } from "react";
import Navbar from "../../Jagota_nav_bar/Navbar";
import businessIcon from "../../../assets/images/register_module_slt/for-business.png";
import homeCookingIcon from "../../../assets/images/register_module_slt/home-Cooking.png";
import "./RegisterSltHomeCooking.scss";
import RegisterHomeCookingInform from "../RegisterHomeCookingInform/RegisterHomeCookingInform";

function RegisterSltHomeCooking() {
  const [B2c_inform, setB2c_inform] = useState(false);
  const B2C_inform_handler = () => {
    setB2c_inform(true);
  };

  if (B2c_inform) {
    return <RegisterHomeCookingInform />;
  } else {
    return (
      <div className="registerSltHomeCooking">
        <Navbar />
        <p className="registerSltHomeCooking_heading m-0 text-secondary">
          I am Shopping for ?
        </p>
        <div className="text-center">
          <div className="d-flex justify-content-center pt-4">
            <div className="text-center padding">
              <img
                className="registerSltHomeCooking_business_img"
                src={businessIcon}
                alt="businessIcon"
                width="300"
              />
              <p className="p gray">Business</p>
            </div>
            <div className="text-center padding  ">
              <img
                className="registerSltHomeCooking_cooking_img  border_img rounded "
                src={homeCookingIcon}
                alt="home_oocking"
                width="300"
              />
              <p className="p color_g">Home Cooking</p>
            </div>
          </div>
          <div className="registerSltHomeCooking_footer">
            <button
              className="registerSltHomeCooking_button"
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

export default RegisterSltHomeCooking;
