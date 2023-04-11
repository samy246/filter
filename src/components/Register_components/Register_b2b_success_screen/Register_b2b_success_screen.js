import React, { useState } from "react";
import Navbar from "../../../components/Jagota_nav_bar/Navbar";
import LoginPage from "../../../pages/LoginPage/LoginPage";
import "./register_b2b_success_screen.styles.scss";

function Register_b2b_success_screen() {
  const [login_page, setLogin_page] = useState(false);

  const LoginHandler = () => {
    setLogin_page(true);
  };
  if (login_page) {
    return <LoginPage />;
  } else {
    return (
      <div className="Register_b2b_success_screen">
        <Navbar />
        <div className="Register_b2b_success_screen_main">
          <div className="Register_b2b_success_screen_main_info">
            <h4>Thank you!!</h4>
            <i className="far fa-check-circle fa-7x Register_b2b_success_screen_icon pt-4" />
            <div className="Register_b2b_success_screen_text">
              <p className="m-0">
                <small> We have Received your information.</small>
              </p>
              <p className="m-0">
                <small>Our team will get in touch with you shortly</small>
              </p>
            </div>
            <button
              type="button"
              className=" Register_b2b_success_button"
              onClick={() => LoginHandler()}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Register_b2b_success_screen;
