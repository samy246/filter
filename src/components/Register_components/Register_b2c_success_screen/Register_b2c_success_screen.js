import React from "react";
import "./register_b2c_success_screen.scss";
import { Link } from "react-router-dom";

function Register_b2c_success_screen() {
  return (
    <div className="Register_b2c_success_screen">
      <div className="bg-white">
        <h1 className="text-center p-2 text-success m-0">JAGOTA</h1>
      </div>
      <div className="Register_b2c_success_screen_main">
        <div className="Register_b2c_success_screen_info">
          <h4>Thank you!!</h4>
          <i className="far fa-check-circle fa-7x Register_b2c_success_screen_icon pt-4" />
          <div className="Register_b2c_success_screen_text">
            <p className="m-0">
              <small> We have Received your information.</small>
            </p>
            <p className="m-0">
              <small>Our team will get in touch with you shortly</small>
            </p>
          </div>
          <Link to="./" className=" Register_b2c_success_button">
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register_b2c_success_screen;
