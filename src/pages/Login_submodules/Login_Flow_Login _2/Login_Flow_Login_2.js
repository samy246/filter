import React, { useState } from "react";
import { Link } from "react-router-dom";
import Organic from "../../../assets/images/house/organic.png";
import Burger_house from "../../../assets/images/house/burger_house.png";
import Steak_house from "../../../assets/images/house/steak_house.png";
import "./login_Flow_Login_2.scss";

function Login_Flow_Login_2() {
  const [Steekhouse, setSteekhouse] = useState(false);
  const [Organichouse, setOrganichouse] = useState(false);
  const [Burgarhouse, setBurgarhouse] = useState(false);

  const SteekhouseHandler = () => {
    setSteekhouse(true);
    setOrganichouse(false);
    setBurgarhouse(false);
  };
  const OrganichouseHandler = () => {
    setOrganichouse(true);
    setBurgarhouse(false);
    setSteekhouse(false);
  };
  const BurgerhouseHandler = () => {
    setBurgarhouse(true);
    setSteekhouse(false);
    setOrganichouse(false);
  };

  return (
    <div className="Login_Flow_Login_2">
      <div className="bg-white">
        <h1 className="text-center p-2 green m-0">JAGOTA</h1>
      </div>
      <div className="Login_Flow_Login_2_main container">
        <div className="pt-4 Login_Flow_Login_2_main_top_section">
          <span className="Login_Flow_Login_2_main_top_section_span_1">
            <i className="fas fa-chevron-left" />
            &nbsp;{" "}
            <Link
              className="Login_Flow_Login_2_main_top_section_span_1 green"
              to="./"
            >
              Back to Login
            </Link>
          </span>
        </div>
        <div className="Login_Flow_Login_2_sub_div p-4 text-center ">
          <h5 className="text-muted pb-4 gray"> Select your Company...</h5>
          <div className="Login_Flow_Login_2_houses m-auto ">
            <div
              className={`p-4 && ${
                Organichouse ? "selected" : "Login_Flow_Login_2_organic_form "
              }`}
              onClick={() => OrganichouseHandler()}
            >
              <div>
                <img src={Organic} alt="organic_form" />
                <span className="fn">Organic Farm</span>
              </div>

              <span>
                <i
                  className={`far fa-check-circle fa-2x && ${
                    Organichouse ? "green" : "gray"
                  }`}
                />
              </span>
            </div>{" "}
            <div
              className={`p-4 && ${
                Steekhouse ? "selected" : "Login_Flow_Login_2_steak_house  "
              }`}
              onClick={() => SteekhouseHandler()}
            >
              <div>
                <img src={Steak_house} alt="steak_house" />
                <span className="fn">Steak House</span>
              </div>

              <span>
                <i
                  className={`far fa-check-circle fa-2x && ${
                    Steekhouse ? "green" : "gray"
                  }`}
                />
              </span>
            </div>{" "}
            <div
              className={`p-4 && ${
                Burgarhouse ? "selected" : "Login_Flow_Login_2_burger_house "
              }`}
              onClick={() => BurgerhouseHandler()}
            >
              <div>
                <img src={Burger_house} alt="burger_house" />
                <span className="fn">Burger_house</span>
              </div>
              <span>
                <i
                  className={`far fa-check-circle fa-2x && ${
                    Burgarhouse ? "green" : "gray"
                  }`}
                />
              </span>
            </div>
          </div>

          <Link to="/" className="Login_Flow_Login_2_btn">
            Next <i className="fas fa-chevron-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login_Flow_Login_2;
