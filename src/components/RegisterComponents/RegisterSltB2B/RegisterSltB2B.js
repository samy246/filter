import React, { useState } from "react";
import Navbar from "../../JagotaNavBar/Navbar";
import businessIcon from "../../../assets/images/register_module_slt/for-business.png";
import homeCookingIcon from "../../../assets/images/register_module_slt/home-coocking.png";
import "./RegisterSltB2B.scss";

function RegisterSltB2B({
  RedirectToInform__success,
  Redirect__B2C__ToInform__success,
}) {
  const [register_inform_success, setRegister_inform_success] = useState(false);
  const [register_B2C_inform, setRegister_B2C_inform] = useState(false);

  const Register_inform_success_handler = () => {
    setRegister_inform_success(true);
    setRegister_B2C_inform(false);
  };
  const register_B2C_inform_handler = () => {
    setRegister_B2C_inform(true);
    setRegister_inform_success(false);
  };

  return (
    <div className="registerSltB2B">
      <Navbar />
      <p className="registerSltB2B_heading m-0">I am Shopping for ?</p>

      <div className="text-center">
        <div className="d-flex justify-content-center reg__select">
          <div
            className="text-center padding registerSltB2B_business"
            onClick={() => Register_inform_success_handler()}
          >
            <img
              className={`registerSltB2B_business_img rounded && ${
                register_inform_success ? "border_img" : ""
              }`}
              src={businessIcon}
              alt=""
              width="300"
            />
            <p
              className={`  ${
                register_inform_success
                  ? "color_g"
                  : "registerSltB2B_business_p"
              }`}
            >
              Business
            </p>
          </div>
          <div
            className="text-center padding registerSltB2B_home"
            onClick={() => register_B2C_inform_handler()}
          >
            <img
              className={`registerSltB2B_home_img rounded && ${
                register_B2C_inform ? "border_img" : ""
              }`}
              src={homeCookingIcon}
              alt=""
              width="300"
            />
            <p
              className={`  ${
                register_B2C_inform ? "color_g" : "registerSltB2B_home_p"
              }`}
            >
              Home Cooking
            </p>
          </div>
        </div>
        <div className="registerSltB2B_footer">
          <button
            className={` ${
              register_inform_success ? "registerSltB2B_button" : "d-none"
            }`}
            onClick={RedirectToInform__success}
          >
            Next <i className="fas fa-chevron-right"></i>
          </button>
          <button
            className={` ${
              register_B2C_inform ? "registerSltB2B_button" : "d-none"
            }`}
            onClick={Redirect__B2C__ToInform__success}
          >
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterSltB2B;
