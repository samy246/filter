import React from "react";
import Navbar from "../../JagotaNavBar/Navbar";
import "./RegisterB2BSuccessScreen.styles.scss";

function RegisterB2BSuccessScreen({ setTab }) {
  return (
    <div className="registerB2BSuccessScreen">
      <Navbar />
      <div className="registerB2BSuccessScreen_main">
        <div className="registerB2BSuccessScreen_main_info">
          <h4>Thank you!!</h4>
          <i className="far fa-check-circle fa-7x registerB2BSuccessScreen_icon pt-4" />
          <div className="registerB2BSuccessScreen_text">
            <p className="m-0">
              <small> We have Received your information.</small>
            </p>
            <p className="m-0">
              <small>Our team will get in touch with you shortly</small>
            </p>
          </div>
          <button
            type="button"
            className=" register_b2b_success_button"
            onClick={setTab}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterB2BSuccessScreen;
