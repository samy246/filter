import React from "react";
import "./RegisterHomeCookingInformSuccessScreen.scss";
import { useHistory } from "react-router-dom";

function RegisterHomeCookingInformSuccessScreen() {
  const history = useHistory();
  const Nexthandler = () => {
    history.push("./login");
  };
  return (
    <div className="RegisterHomeCookingInformSuccessScreen">
      <div className="bg-white">
        <h1 className="text-center p-2 text-success m-0">JAGOTA</h1>
      </div>
      <div className="RegisterHomeCookingInformSuccessScreen_main">
        <div className="RegisterHomeCookingInformSuccessScreen_info">
          <h4>Thank you!!</h4>
          <i className="far fa-check-circle fa-7x RegisterHomeCookingInformSuccessScreen_icon pt-4" />
          <div className="RegisterHomeCookingInformSuccessScreen_text">
            <p className="m-0">
              <small> We have Received your information.</small>
            </p>
            <p className="m-0">
              <small>Our team will get in touch with you shortly</small>
            </p>
          </div>
          <button
            onClick={Nexthandler}
            className=" Register_b2c_success_button"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterHomeCookingInformSuccessScreen;
