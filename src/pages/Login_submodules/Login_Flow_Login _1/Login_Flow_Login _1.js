import React from "react";
import Organic from "../../../assets/images/house/organic.png";
import Burger_house from "../../../assets/images/house/burger_house.png";
import Steak_house from "../../../assets/images/house/steak_house.png";
import "./login_Flow_Login _1.scss";

function Login_Flow_Login_1() {
  return (
    <div className="Login_Flow_Login_1">
      <div className="bg-white">
        <h1 className="text-center p-2 text-success m-0">JAGOTA</h1>
      </div>
      <div className="Login_Flow_Login_1_main container">
        <div className="pt-4 Login_Flow_Login_1_main_top_section">
          <span className="Login_Flow_Login_1_main_top_section_span_1">
            <i className="fas fa-chevron-left" />
            &nbsp;{" "}
            <a
              className="Login_Flow_Login_1_main_top_section_span_1 text-success"
              to="/"
            >
              Back to Login
            </a>
          </span>
        </div>
        <div className="Login_Flow_Login_1_sub_div p-4 text-center">
          <h4 className="text-muted pb-4"> Select your Company</h4>
          <div className="Login_Flow_Login_1_houses m-auto">
            {" "}
            <div className="Login_Flow_Login_1_organic_form  p-4">
              <div>
                {" "}
                <img src={Organic} alt="organic_form" />
                <span>Organic Farm</span>
              </div>

              <i className="far fa-check-circle fa-2x text-secondary" />
            </div>{" "}
            <div className="Login_Flow_Login_1_steak_house  p-4">
              <div>
                {" "}
                <img src={Steak_house} alt="steak_house" />
                <span>Steak House</span>
              </div>

              <i className="far fa-check-circle fa-2x text-secondary" />
            </div>{" "}
            <div className="Login_Flow_Login_1_burger_house  p-4">
              <div>
                {" "}
                <img src={Burger_house} alt="burger_house" />
                <span>Burger_house</span>
              </div>

              <i className="far fa-check-circle fa-2x text-secondary" />
            </div>
          </div>
          <button className="Login_Flow_Login_1_btn">
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login_Flow_Login_1;
