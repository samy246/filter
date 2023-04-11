import React from "react";
import Navbar from "../../JagotaNavBar/Navbar";
import businessIcon from "../../../assets/images/register_module_slt/for-business.png";
import FormInput from "../../formInput/FormInput";
import "./RegisterInformSuccess.scss";
import { Link } from "react-router-dom";

function RegisterInformSuccess({ setTab }) {
  const Tab = () => {
    setTab("Register_b2b_upload_topic_top_section");
  };

  return (
    <div className="registerInformSuccess_div">
      <Navbar />
      <div className="registerInformSuccess">
        <div className="registerInformSuccess_steps d-flex justify-content-center text-center ">
          <div className="registerInformSuccess__business d-flex">
            <div>
              <span className="registerInformSuccess__business_circle">1</span>
              <p className="m-0 green">Basic information</p>
            </div>
          </div>

          <div className="registerInformSuccess_categery d-flex ">
            <div>
              <span className="registerInformSuccess_categery_circle">2</span>
              <p className="m-0 gray">Choose category</p>
            </div>
          </div>

          <div className="registerInformSuccess_adddocument">
            <span className="registerInformSuccess_addbocument_circle gray">
              3
            </span>
            <p className="m-0 gray">Add documents</p>
          </div>
        </div>
        <div className="text-center pb-4">
          <h4 className="m-0 green for__business__heding">For Business</h4>
          <img src={businessIcon} alt="" />
        </div>
      </div>
      <div className="form_division">
        <p className="cor"></p>
        <div className="form_div  w-50 m-auto">
          <form className="Register_b2b_form">
            <h4 className="Register_b2b_form_heading">
              Please fill for Business information{" "}
            </h4>
            <hr />
            <FormInput
              name="NameOfBusiness"
              type="text"
              label="Name Of Business :"
              placeholder="Enter name of business"
            />
            <FormInput
              name="TypeOfBusiness"
              type="text"
              label="Type Of Business :"
              placeholder="Enter type of business"
            />
            <FormInput
              name="Contact"
              type="tel"
              label="Contact :"
              placeholder="Enter telephone number"
            />
          </form>
        </div>
      </div>
      <footer className="jagota_footer bg-light text-end">
        <Link className="jagota_footer-link" to="./">
          Cancel
        </Link>
        <button className="footer_button btn btn-lg" onClick={Tab}>
          Next &nbsp;
          <i
            className="fas fa-chevron-right footer_button_icon"
            aria-hidden="true"
          />
        </button>
      </footer>
    </div>
  );
}

export default RegisterInformSuccess;
