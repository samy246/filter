import React from "react";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Jagota_nav_bar/Navbar";
import businessIcon from "../../../assets/register_module_slt/for-business.png";
import "./register_b2b_inform.scss";
import FormInput from "../../../components/formInput/FormInput";

function Register_b2b_inform() {
  return (
    <div>
      <Navbar />
      <div className="Register_b2b_inform">
        <div className="Register_b2b_inform_steps d-flex justify-content-center text-center ">
          <div className="Register_b2b_inform__business d-flex">
            <div>
              <span className="Register_b2b_inform__business_circle">1</span>
              <p className="m-0">Basic Information</p>
            </div>
          </div>

          <div className="Register_b2b_inform_categery d-flex ">
            <div>
              <span className="Register_b2b_inform_categery_circle">2</span>
              <p className="m-0">Choose Categary</p>
            </div>
          </div>

          <div className="Register_b2b_inform_adddocument">
            <span className="Register_b2b_inform_addbocument_circle">3</span>
            <p className="m-0">Add Document</p>
          </div>
        </div>
        <div className="text-center pb-4">
          <h4 className="m-0 ">For Business</h4>
          <img src={businessIcon} alt="businessIcon" />
        </div>
      </div>
      <div className="form_division">
        <i className="cor"></i>
        <form className="Register_b2b_form w-50 m-auto">
          <h4 className="Register_b2b_form_heading">
            please fill your business information
          </h4>
          <hr />
          <FormInput
            name="NameOfBusiness"
            type="text"
            label="Name Of Business "
            placeholder="Enter Name Of Business"
          />
          <FormInput
            name="TypeOfBusiness"
            type="text"
            label="Type Of Business "
            placeholder="Enter Type Of Business"
          />
          <FormInput
            name="Contact"
            type="tel"
            label="Contact "
            placeholder="Enter Telephone Number"
          />
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Register_b2b_inform;
