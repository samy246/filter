import React, { useState } from "react";
import Navbar from "../../../components/Jagota_nav_bar/Navbar";
import { Link } from "react-router-dom";
import "./register_B2C_inform.scss";
import FormInput from "../../../components/formInput/FormInput";
import { Form } from "react-bootstrap";
import Register_b2c_success_screen from "../Register_b2c_success_screen/Register_b2c_success_screen";

const Register_B2C_inform = () => {
  const [initialState, setInitialState] = useState({
    Name: "",
    birthday: "",
    address: "",
    district: "",
    fulladdress: "",
    contactnumber: "",
    email: "",
    username: "",
    password: "",
    conformpassword: "",
    success: false,
  });
  const successhandler = () => {
    setInitialState({ ...initialState, success: true });
  };
  const handleInputs = (e) => {
    setInitialState({ ...initialState, [e.target.name]: e.target.value });
  };
  const formcanBeSubmitted = () => {
    const {
      Name,
      birthday,
      address,
      district,
      fulladdress,
      contactnumber,
      email,
      username,
      password,
      conformpassword,
    } = initialState;
    return (
      Name.length > 0 &&
      birthday.length > 0 &&
      address.length > 0 &&
      district.length > 0 &&
      fulladdress.length > 0 &&
      contactnumber.length > 0 &&
      email.length > 0 &&
      username.length > 0 &&
      password.length > 0 &&
      conformpassword.length > 0
    );
  };
  const isEnabled = formcanBeSubmitted();

  if (initialState?.success) {
    return <Register_b2c_success_screen />;
  } else {
    return (
      <div className="Register_B2C_inform">
        <Navbar />
        <div className="col-md-12 p-4">
          <div className="row">
            <div className="col-md-6 Register_B2C_inform_col-1">
              {" "}
              <div className="Register_B2C_inform_main">
                <div className="pt-4 Register_B2C_inform_top_section pb-4">
                  <span className="Register_B2C_inform_top_section_span">
                    <i className="fas fa-chevron-left" />
                    &nbsp;{" "}
                    <Link
                      className="Register_B2C_inform_top_section_span text-success"
                      to="./"
                    >
                      Back to previous page
                    </Link>
                  </span>
                </div>
                <Form className="detiles_form" name="jagota_form">
                  <h5 className="text-success">
                    Please fill for Yourinformation
                  </h5>
                  <div className="row">
                    <div className="col-md-8">
                      <FormInput
                        type="text"
                        label="Name"
                        name="Name"
                        placeholder="Enter your name of business"
                        value={initialState?.Name}
                        onChange={handleInputs}
                      />
                    </div>
                    <div className="col-md-4 ">
                      <FormInput
                        type="date"
                        label="Birthday"
                        name="birthday"
                        placeholder="Enter your birthday"
                        value={initialState?.birthday}
                        onChange={handleInputs}
                      />
                    </div>
                  </div>{" "}
                  <div className="row">
                    <div className="col-md-4">
                      <FormInput
                        type="text"
                        label="Address"
                        name="address"
                        value={initialState?.address}
                        onChange={handleInputs}
                        placeholder="Enter your postcode"
                      />{" "}
                    </div>
                    <div className="col-md-4">
                      <FormInput
                        type="text"
                        name="district"
                        placeholder="District"
                        value={initialState?.district}
                        onChange={handleInputs}
                        label="&nbsp;"
                      />
                    </div>
                    <div className="col-md-4">
                      <div className="p-1">
                        <div className="text-end">
                          <small>
                            {" "}
                            <i className="fas fa-map-marked-alt" /> &nbsp;
                            <Link className="text-success" to="./">
                              select on maps
                            </Link>
                          </small>
                        </div>

                        <Form.Select
                          className="text-secondary"
                          aria-label="Floating label select example"
                        >
                          <option>Sub-District</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </Form.Select>
                      </div>
                    </div>{" "}
                    <div className="col-md-12">
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="fulladdress"
                          value={initialState?.fulladdress}
                          onChange={handleInputs}
                          placeholder="Enter your address - no.suite, soi etc."
                        />
                      </Form.Group>{" "}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <FormInput
                        type="number"
                        label="Contact"
                        name="contactnumber"
                        min="0"
                        value={initialState?.contactnumber}
                        onChange={handleInputs}
                        placeholder="Enter your contact number"
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        type="email"
                        label="Email"
                        name="email"
                        required
                        value={initialState?.email}
                        onChange={handleInputs}
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <h2>Account</h2>
                    <hr />
                    <div className="col-md-8 user_name">
                      {" "}
                      <FormInput
                        type="text"
                        label="User Name"
                        name="username"
                        value={initialState?.username}
                        onChange={handleInputs}
                        placeholder="Enter username"
                      />{" "}
                    </div>
                    <div className="col-md-8 password">
                      {" "}
                      <FormInput
                        type="password"
                        label="Password"
                        name="password"
                        value={initialState?.password}
                        onChange={handleInputs}
                        placeholder="Must be at least 6 charecters"
                      />
                    </div>
                    <div className="col-md-8 renew__password">
                      {" "}
                      <FormInput
                        type="Password"
                        label="Renew Password"
                        value={initialState?.conformpassword}
                        onChange={handleInputs}
                        name="conformpassword"
                        placeholder="Conform password"
                      />{" "}
                    </div>
                    <div className="col-md-8">
                      <button type="button" className="otp_btn">
                        Send OTP
                      </button>
                    </div>{" "}
                    <div className="col-md-12">
                      <div className="d-flex pt-2 pb-2">
                        {" "}
                        <Form.Group
                          className="p-2"
                          controlId="formBasicCheckbox"
                        >
                          <Form.Check
                            type="checkbox"
                            label="Make Default Shipping Address"
                          />
                        </Form.Group>
                        <Form.Group
                          className=" p-2"
                          controlId="formBasicCheckbox"
                        >
                          <Form.Check
                            type="checkbox"
                            label="Make Default Shipping Address"
                          />
                        </Form.Group>
                      </div>
                      <div className="pb-3">
                        <small className="text-secondary f_9">
                          Full details of how we use your information can be
                          found in our
                          <Link className="text-secondary" to="./">
                            Privacy & Cookie Policy.
                          </Link>{" "}
                          By registering you confirm you accept our{" "}
                          <Link className="text-secondary" to="./">
                            Terms & Conditions.
                          </Link>
                        </small>
                      </div>
                      <button
                        type="button"
                        className="rounded-pill w-100 btn submit_button"
                        disabled={!isEnabled}
                        onClick={() => successhandler()}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            <div className="col-md-6 Register_B2C_inform_col-2">
              <div className="Register_B2C_inform_main_2 w-100"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Register_B2C_inform;
