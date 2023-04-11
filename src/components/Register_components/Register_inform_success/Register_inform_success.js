import React, { useState } from "react";
import Navbar from "../../../components/Jagota_nav_bar/Navbar";
import businessIcon from "../../../assets/images/register_module_slt/for-business.png";
import FormInput from "../../../components/formInput/FormInput";
import Mandatery_Input_feeld from "../../../components/formInput/Mandatery_feelds/Mandatery_Input_feeld";
import "./register_inform_success.scss";
import { Link } from "react-router-dom";
import Register_b2b_upload_topic from "../Register_b2b_upload_topic/Register_b2b_upload_topic";

function Register_inform_success() {
  const [register_b2b_upload_topic, setRegister_b2b_upload_topic] =
    useState(false);

  const Register_b2b_upload_topic_hanhler = () => {
    setRegister_b2b_upload_topic(true);
  };
  if (register_b2b_upload_topic) {
    return <Register_b2b_upload_topic />;
  } else {
    return (
      <div className="Register_inform_success_div">
        <Navbar />
        <div className="Register_inform_success">
          <div className="Register_inform_success_steps d-flex justify-content-center text-center ">
            <div className="Register_inform_success__business d-flex">
              <div>
                <span className="Register_inform_success__business_circle">
                  1
                </span>
                <p className="m-0 green fw-bold">Basic information</p>
              </div>
            </div>

            <div className="Register_inform_success_categery d-flex ">
              <div>
                <span className="Register_inform_success_categery_circle">
                  2
                </span>
                <p className="m-0 gray fw-bold">Choose categary</p>
              </div>
            </div>

            <div className="Register_inform_success_adddocument">
              <span className="Register_inform_success_addbocument_circle gray">
                3
              </span>
              <p className="m-0 gray fw-bold">Add document</p>
            </div>
          </div>
          <div className="text-center pb-4">
            <h4 className="m-0 green">For Business</h4>
            <img src={businessIcon} alt="businessIcon" />
          </div>
        </div>
        <div className="form_division">
          <i className="cor"></i>
          <div className="form_div  w-50 m-auto">
            <form className="Register_b2b_form">
              <h4 className="Register_b2b_form_heading">
                Please fill your business information
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
              {/* <div>
            <FormInput
              name="Contact"
              type="text"
              label="Address "
              placeholder="search Location"
            />
            <iframe
              width="100%"
              height="600"
              src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;coord=52.70967533219885, -8.020019531250002&amp;q=1%20Grafton%20Street%2C%20Dublin%2C%20Ireland&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
            ></iframe>
          </div>
          <div className="row">
            <div className="col-md-6">
              {" "}
              <Mandatery_Input_feeld
                name="BranchName"
                type="tel"
                label="Branch Name "
                placeholder="samyam Mitrtown"
              />
            </div>{" "}
            <div className="col-md-6">
              {" "}
              <Mandatery_Input_feeld
                name="MobileNumber"
                type="tel"
                label="Mobile Number "
                placeholder="02-235900"
              />
            </div>
          </div>
          <Mandatery_Input_feeld
            name="delivery address"
            type="text"
            label="Delivery Address "
            placeholder="944 Rama IV Road,Wang Mai. "
          />
          <div className="row">
            <div className="col-md-8">
              <Mandatery_Input_feeld
                name="BranchName"
                type="tel"
                label=" "
                placeholder="Pathum Wan, Bangkok, Thailand"
              />
            </div>
            <div className="col-md-4">
            <Mandatery_Input_feeld
                name="PinCode"
                type="number"
                label="PostCode "
                placeholder="10330"
              />
            </div>
          </div>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Make Default Shipping Address" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Make Default Billing Address" />
          </Form.Group> */}
            </form>
          </div>
        </div>
        <footer className="jagota_footer bg-light text-end">
          <Link className="jagota_footer-link" to="./">
            Cancel
          </Link>
          <button
            type="button"
            className="footer_button btn  btn-lg"
            onClick={Register_b2b_upload_topic_hanhler}
          >
            Next &nbsp;
            <i
              className="fas fa-chevron-right footer_button_icon"
              aria-hidden="true"
            />
          </button>{" "}
        </footer>
      </div>
    );
  }
}

export default Register_inform_success;
// Register_b2b_upload_topic;
