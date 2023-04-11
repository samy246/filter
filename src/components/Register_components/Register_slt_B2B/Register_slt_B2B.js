import React, { useState } from "react";
import Navbar from "../../../components/Jagota_nav_bar/Navbar";
import businessIcon from "../../../assets/images/register_module_slt/for-business.png";
import homeCookingIcon from "../../../assets/images/register_module_slt/home-coocking.png";
import "./register_slt_b2b.scss";
import Register_inform_success from "../Register_inform_success/Register_inform_success";
import Register_B2C_inform from "../Register_B2C_inform/Register_B2C_inform";

function Register_slt_B2B() {
  const [register_inform_success, setRegister_inform_success] = useState(false);
  const [register_B2C_inform, setRegister_B2C_inform] = useState(false);

  const [register_inform_success_page, setRegister_inform_success_page] =
    useState(false);
  const [register_B2C_inform_page, setRegister_B2C_inform_page] =
    useState(false);

  const Register_inform_success_handler = () => {
    setRegister_inform_success(true);
    setRegister_B2C_inform(false);
  };
  const register_B2C_inform_handler = () => {
    setRegister_B2C_inform(true);
    setRegister_inform_success(false);
  };
  const Register_inform_success_page_handler = () => {
    setRegister_inform_success_page(true);
    setRegister_B2C_inform_page(false);
  };
  const register_B2C_inform_page_handler = () => {
    setRegister_B2C_inform_page(true);
    setRegister_inform_success_page(false);
  };
  if (register_inform_success_page) {
    return <Register_inform_success />;
  } else if (register_B2C_inform_page) {
    return <Register_B2C_inform />;
  } else {
    return (
      <div className="Register_slt_B2B">
        <Navbar />
        <p className="Register_slt_B2B_heading m-0">I am Shopping for ?</p>
        <div className="text-center">
          <div className="d-flex justify-content-center">
            <div
              className="text-center padding Register_slt_B2B_business"
              onClick={() => Register_inform_success_handler()}
            >
              <img
                className={`Register_slt_B2B_business_img rounded && ${
                  register_inform_success ? "border_img" : ""
                }`}
                src={businessIcon}
                alt="businessIcon"
                width="300"
              />
              <p
                className={`  ${
                  register_inform_success
                    ? "color_g"
                    : "Register_slt_B2B_business_p"
                }`}
              >
                Business
              </p>
            </div>
            <div
              className="text-center padding Register_slt_B2B_home"
              onClick={() => register_B2C_inform_handler()}
            >
              <img
                className={`Register_slt_B2B_home_img rounded && ${
                  register_B2C_inform ? "border_img" : ""
                }`}
                src={homeCookingIcon}
                alt="home_oocking"
                width="300"
              />
              <p
                className={`  ${
                  register_B2C_inform ? "color_g" : "Register_slt_B2B_home_p"
                }`}
              >
                Home Coocking
              </p>
            </div>
          </div>
          <div className="Register_slt_B2B_footer">
            <button
              className={` ${
                register_inform_success ? "Register_slt_B2B_button" : "d-none"
              }`}
              onClick={() => Register_inform_success_page_handler()}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
            <button
              className={` ${
                register_B2C_inform ? "Register_slt_B2B_button" : "d-none"
              }`}
              onClick={() => register_B2C_inform_page_handler()}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Register_slt_B2B;
