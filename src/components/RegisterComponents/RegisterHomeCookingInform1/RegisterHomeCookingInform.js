import React, { useState } from "react";
import Navbar from "../../JagotaNavBar/Navbar";
import { Link } from "react-router-dom";
import "./RegisterHomeCookingInform.scss";
import FormInput from "../../formInput/FormInput";
import { Form } from "react-bootstrap";
import RegisterHomeCookingInformSuccessScreen from "../RegisterHomeCookingInformSuccessScreen/RegisterHomeCookingInformSuccessScreen";
import axios from "axios";
import request from "../../../request";
import { toast } from "react-toastify";

const RegisterHomeCookingInform = ({ setTab }) => {
  const [spinner, setspinner] = useState(false);
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
    defaultBilling: false,
    defaultShipping: false,
    success: false,
    loading: false,
  });

  const successhandler = () => {
    b2cregister();
  };

  const b2cregister = async () => {
    setspinner(true);
    setInitialState({ ...initialState, loading: true });
    try {
      await axios({
        method: "post",
        url: request.b2cRegister,
        data: {
          customer: {
            firstname: initialState.Name,
            lastname: initialState.username,
            email: initialState.email,
            store_id: 1,
            website_id: 1,
            addresses: [
              {
                defaultBilling: initialState.defaultBilling,
                defaultShipping: initialState.defaultShipping,
                firstname: initialState.Name,
                lastname: initialState.username,
                region: {
                  region: initialState.district,
                },
                countryId: "TH",
                postcode: "10755",
                city: initialState.district,
                street: [initialState.address],
                telephone: initialState.contactnumber,
              },
            ],
          },
          password: initialState.password,
        },
      });
      setspinner(false);
      setInitialState({ ...initialState, loading: true });
      setInitialState({ ...initialState, loading: false, success: true });
    } catch (e) {
      setspinner(false);
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
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

  return (
    <>
      {spinner ? (
        <div className="ordertable__spinner register__wait">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {initialState.success ? (
            <>
              {!initialState.loading ? (
                <RegisterHomeCookingInformSuccessScreen setTab={setTab} />
              ) : (
                <div className="ordertable__spinner">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="registerHomeCookingInform">
              <Navbar />
              <div className="col-md-12 p-4">
                <div className="row">
                  <div className="col-md-6 registerHomeCookingInform_col-1">
                    {" "}
                    <div className="registerHomeCookingInform_main">
                      <div className="pt-4 registerHomeCookingInform_top_section pb-4">
                        <span
                          className="registerHomeCookingInform_top_section_span"
                          onClick={setTab}
                        >
                          <i className="fas fa-chevron-left" />
                          &nbsp;{" "}
                          <span className="registerHomeCookingInform_top_section_span_text green">
                            Back to previous page
                          </span>
                        </span>
                      </div>
                      <Form className="detiles_form" name="jagota_form">
                        <h5 className="green">
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
                            <div className="datepicker__icon">
                              <FormInput
                                type="date"
                                label="Birthday"
                                name="birthday"
                                placeholder="Enter your birthday"
                                value={initialState?.birthday}
                                onChange={handleInputs}
                              />
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-calendar3"
                                viewBox="0 0 16 16"
                              >
                                <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
                                <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                              </svg>
                            </div>
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
                            <div className="mb-3">
                              <div className="text-end">
                                <small>
                                  {" "}
                                  <i className="fas fa-map-marked-alt" /> &nbsp;
                                  <Link className="green" to="./">
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
                          <h2 className="account__lable">Account</h2>
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
                              placeholder="Confirm password"
                            />{" "}
                          </div>
                          <div className="col-md-8 otp__button">
                            <button type="button" className="otp_btn">
                              Send OTP
                            </button>
                          </div>{" "}
                          <div className="col-md-12">
                            <div className="checkbox__options pt-2 pb-2">
                              {" "}
                              <Form.Group
                                className="p-2"
                                controlId="formBasicCheckbox"
                              >
                                <Form.Check
                                  type="checkbox"
                                  label="Send me new promotions and offers"
                                />
                              </Form.Group>
                              <Form.Group
                                className=" p-2"
                                controlId="formBasicCheckbox_2"
                              >
                                <Form.Check
                                  type="checkbox"
                                  label="Subscribe to Jagota Newsletter"
                                />
                              </Form.Group>
                            </div>
                            <div className="pb-3">
                              <small className="f_9">
                                Full details of how we use your information can
                                be found in our{" "}
                                <Link to="./">Privacy & Cookie Policy.</Link> By
                                registering you confirm you accept our{" "}
                                <Link to="./">Terms & Conditions.</Link>
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
                  <div className="col-md-6 registerHomeCookingInform_col-2">
                    <div className="registerHomeCookingInform_main_2 w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RegisterHomeCookingInform;
