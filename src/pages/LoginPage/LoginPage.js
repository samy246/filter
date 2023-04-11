import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import FormInput from "../../components/formInput/FormInput";
import googleicon from "../../assets/images/Login_imgs/google.png";
import lineicon from "../../assets/images/Login_imgs/line.png";
import "./loginPage.styles.scss";
import axios from "axios";
import logo from "../../assets/images/jagota_logo.png";
import PasswordField from "../../components/formInput/PasswordField/PasswordField";
import instance from "../../request";
import { toast } from "react-toastify";
import request from "../../request";


function LoginPage() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [alert, setAlert] = useState(false);
  const history = useHistory();
  const [checkterms, setcheckterms] = useState(false)

  useEffect(async() => {
    if (localStorage.getItem("userdata") !== null) {
      try {
        const getTerms = await axios({
          method: 'get',
          url: `${request?.getTerms}${localStorage.getItem('userid')}`
        })
        
        console.log(getTerms?.data[0]?.termsConditionStatus)
        if(getTerms?.data[0]?.termsConditionStatus == "0") {
          setShow(true)
        } else {
          history.push("/");
        }
      } catch(e) {
        console.log(e)
      }
    }
  }, [checkterms]);

  const [errors, seterrors] = useState({
    username: "",
    password: "",
  });

  const SubmitHandler = async (e, val) => {
    e.preventDefault();
    if (username.length === 0) {
      seterrors((data) => ({
        ...data,
        username: "Please enter your username",
      }));
    } else {
      seterrors((data) => ({
        ...data,
        username: "",
      }));
    }

    if (password.length === 0) {
      seterrors((data) => ({
        ...data,
        password: "Please enter your username",
      }));
    } else {
      seterrors((data) => ({
        ...data,
        password: "",
      }));
    }

    if (username?.length === 0 || password?.length === 0) return;

    try {
      const token = await axios({
        method: "post",
        url: instance.userLogin,
        data: {
          username: username,
          password: password,
        },
      });
      if (token.data[0].status == false) {
        return toast.error(token.data[0].message)
      }
      localStorage.setItem("token", token.data);
      localStorage.setItem("user", username);

      if (token.data) {
        try {
          const userData = await axios({
            method: "get",
            url: instance.userData,
            headers: {
              Authorization: `Bearer ${token.data}`,
            },
          });
          localStorage.setItem('cookiespop', true)
          localStorage.setItem("userdata", JSON.stringify(userData.data));
          localStorage.setItem(
            "address",
            JSON.stringify(userData.data.addresses)
          );
          localStorage.setItem("userid", userData.data.id);
          localStorage.setItem(
            "username",
            `${userData.data.firstname} ${userData.data.lastname}`
          );
          localStorage.setItem(
            "companyid",
            `${userData.data.extension_attributes.aw_ca_company_user.company_id}`
          );
          localStorage.setItem(
            "company_group_id",
            `${userData.data.extension_attributes.aw_ca_company_user.company_group_id}`
          );
          localStorage.setItem(
            "company_role_id",
            `${userData.data.extension_attributes.aw_ca_company_user.company_role_id}`
          );
          setcheckterms(!checkterms)
        } catch (e) {
          if (
            e.response?.data?.message ===
            "The consumer isn't authorized to access %resources."
          ) {
            localStorage.removeItem("token");
            localStorage.removeItem("userid");
            localStorage.removeItem("userdata");
            localStorage.removeItem("address");
            localStorage.removeItem("cartid");
            localStorage.removeItem("user");
            localStorage.removeItem("companyid");
            localStorage.removeItem("companyrolesdata");
            localStorage.removeItem("company_role_id");
            localStorage.removeItem("company_group_id");
            localStorage.removeItem("timer");
            // window.location.reload();
          }
        } finally {
        }
      }
      getroles();
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
      setAlert(true);
    }
  };

  const getroles = async () => {
    if (localStorage.getItem("companyid") === null) return;
    try {
      const rolesdata = await axios({
        method: "get",
        url: `${request.allroles
          }?searchCriteria[filterGroups][0][filters][0][field]=company_id&searchCriteria[filterGroups][0][filters][0][value]=${localStorage.getItem(
            "companyid"
          )}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.setItem(
        "companyrolesdata",
        JSON.stringify(rolesdata.data.items)
      );
    } catch (e) {
      if (
        e.response?.data?.message ===
        "The consumer isn't authorized to access %resources."
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("userid");
        localStorage.removeItem("userdata");
        localStorage.removeItem("address");
        localStorage.removeItem("cartid");
        localStorage.removeItem("user");
        localStorage.removeItem("companyid");
        localStorage.removeItem("companyrolesdata");
        localStorage.removeItem("company_role_id");
        localStorage.removeItem("company_group_id");
        localStorage.removeItem("timer");
        // window.location.reload();
      }
    }
  };
  const [checkingTerms, setCheckingTerms] = useState(false)
  const termsCheck = (value) => {
    setCheckingTerms(value)
  }

  const termsAgreed = async() => {
    try {
      await axios({
        method: 'post',
        url: `${request?.setTerms}${localStorage.getItem('userid')}`
      })
      history.push("/")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="loginPage">
      <div className="loginPage__subDiv">
        <div className="loginPage__container">
          <div className=" container">
            <Form className="login__form" onSubmit={(e) => SubmitHandler(e)}>
              <div className="loginform__top__section text-end text-white">
                <span>
                  <p className="loginpage___nomember">Not a Member?</p>
                  <Link
                    to="./register"
                    className=" btn btn-success loginform__top_section_buttton rounded-pill"
                  >
                    Register
                  </Link>
                </span>
              </div>
              <div className="text-center pt-4 pb-4">
                <Link className="h1 jagota-img text-white">
                  <img src={logo} alt="" />
                </Link>
              </div>

              <h4 className="login__heading">Login</h4>
              <hr className="login__hr" />
              <FormInput
                name="username"
                type="text"
                label="Email"
                // required
                onChange={(e) => setusername(e.target.value)}
              />
              {errors?.username && (
                <p style={{ color: "#9c3030" }}>{errors.username}</p>
              )}
              <div className="position-relative">
                <PasswordField
                  label="Password"
                  onChange={(e) => setpassword(e.target.value)}
                  name="password"
                // required
                />
                {errors?.password && (
                  <p style={{ color: "#9c3030" }}>{errors.password}</p>
                )}
              </div>
              <Form.Group
                className="mb-3 form_check_box"
                controlId="formBasicCheckbox"
              >
                <Form.Check type="checkbox" label="keep me logged in" />
              </Form.Group>
              <Button
                type="submit"
                className="w-100 login__button"
                variant="success"
              >
                LOG IN
              </Button>
              {alert ? (
                <p className="loginpage__alert">Invalid Username or Password</p>
              ) : (
                ""
              )}
            </Form>
            <div className="loginPage__footer text-center mt-3 text-white">
              <p className="m-0 font-10 ">
                By continuing, you agree to accept our Privacy Policy & Terms of
                Service.
              </p>{" "}
              <p className="font-13 pt-1 ">
                Forgot Password ?{" "}
                <Link className="text-white" to="/">
                  Click
                </Link>
              </p>
              <div>
                <p className="login__with">Or Log In With</p>
                <span>
                  <img src={googleicon} alt="googleicon" />{" "}
                  <img src={lineicon} alt="lineicon" />
                </span>
              </div>
            </div>
            <div className="mt-3 font-10 text-white d-flex justify-content-between">
              <p className="m-0">Version 1.0.0.1</p>{" "}
              <p className="m-0">License</p>
            </div>
          </div>
        </div>
      </div>
      <Modal show={show}  size="lg" style={{overflow:"hidden", maxHeight: '100vh'}} >
        <Modal.Header>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-grid align-items-left justify-content-left modalbody" 
        >
          <div className="overflow-scroll mainbody"
          >
            <p>Our desire to do better and be the best drives the passion and commitment behind everything we do. Therefore it is our passion and commitment to excellence that has established JAGOTA as one of the most creative and innovative companies in Thailand today, bringing trend setting and bespoke food solutions.</p>
            <p> As a dedicated company, we are constantly evolving with new ideas, concepts, events and solutions that further drive the success of our customers wherever they are and whatever their business, Modern Trade, Food Service, Catering, E-commerce… In this fiercely competitive market, we are constantly learning, from our environment, customer’s needs, market trends… and growing in the process, to consistently delight </p>
        </div>
        <div className="termsmsg">
          <input type="checkbox" id="acceptcheck" onChange={(e) => termsCheck(e.target.checked)}/>
          <p>I have read and agree terms and condition  <span style={{fontSize:"20px"}}>*</span></p>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => termsAgreed()}
            id="regclosemodal"
            style={{ borderRadius: "unset", backgroundColor: "#37bfa7", border: "none" }}
            disabled={!checkingTerms}
          >
            Agree
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LoginPage;
