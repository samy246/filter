import React, { useState, useEffect, lazy } from "react";
import Verification from "../../components/Verfication/Verification";
import "./ChangePassword.scss";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useStateValue } from "../../store/state";
import { useHistory } from "react-router-dom";
import PasswordField from "../../components/formInput/PasswordField/PasswordField";
import { toast } from "react-toastify";
import back from "../../assets/images/catalog/back.png";
import axios from "axios";
import request from "../../request";
const VerificationSuccess = lazy(() => "../../components/Verfication/VerificationSucces/VerificationSuccess");

function ChangePassword({ token }) {
  const [{}, dispatch] = useStateValue();
  useEffect(() => {
    closeSide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [errors, setErrors] = useState({});
  const [Password, setPassword] = useState({
    old_pass: "",
    new_pass: "",
    confrim_pass: "",
  });

  // user will route to login page, if not loggedin
  useEffect(() => {
    if (token === null || "" || undefined) {
      history.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Function to save the password input to the state 
  const handleChange = (event) => {
    setPassword((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const [passwordChecker, setpasswordChecker] = useState({
    count: false,
    lower: false,
    upper: false,
    special: false,
    numeric: false,
  })

  useEffect(() => {
    if(Password?.new_pass.match(/.{8,}/g)) {
      setpasswordChecker(prevState => ({
        ...prevState,
        count: true
      }))
    } else {
      setpasswordChecker(prevState => ({
        ...prevState,
        count: false
      }))
    }

    if(Password?.new_pass.match(/[a-z]/g)) {
      setpasswordChecker(prevState => ({
        ...prevState,
        lower: true
      }))
    } else {
      setpasswordChecker(prevState => ({
        ...prevState,
        lower: false
      }))
    }

    if(Password?.new_pass.match(/[A-Z]/g)) {
      setpasswordChecker(prevState => ({
        ...prevState,
        upper: true
      }))
    } else {
      setpasswordChecker(prevState => ({
        ...prevState,
        upper: false
      }))
    }

    if(Password?.new_pass.match(/[#?!@$%^&*-]/g)) {
      setpasswordChecker(prevState => ({
        ...prevState,
        special: true
      }))
    } else {
      setpasswordChecker(prevState => ({
        ...prevState,
        special: false
      }))
    }

    if(Password?.new_pass.match(/[0-9]/g)) {
      setpasswordChecker(prevState => ({
        ...prevState,
        numeric: true
      }))
    } else {
      setpasswordChecker(prevState => ({
        ...prevState,
        numeric: false
      }))
    }
  }, [Password])

  // Change password API and if the change is successfull, local storage will be cleared and user will logout
  const changepasswordapi = async () => {
    // Functionality to check for password validation - length, uppercase, lowercase, special charecters and number
    if(!Password?.new_pass.match(/.{8,}/g)) {
      return toast.info("Password must contain atleast 8 Charecters")
    }
    if(!Password?.new_pass.match(/[a-z]/g)) {
      return toast.info("Password must contain atleast one Lowercase letter")
    }
    if(!Password?.new_pass.match(/[A-Z]/g)) {
      return toast.info("Password must contain atleast one Uppercase letter")
    }
    if(!Password?.new_pass.match(/[0-9]/g)) {
      return toast.info("Password must contain atleast one Number")
    }
    if(!Password?.new_pass.match(/[#?!@$%^&*-]/g)) {
      return toast.info("Password must contain atleast one special charecters")
    }
    let userdata = JSON.parse(localStorage.getItem("userdata"));
    let ccode;
    userdata?.custom_attributes.find((ca) => {
      if (ca?.attribute_code == "customer_code") {
        ccode = ca?.value;
      }
    });
    try {
      const passwordchange = await axios({
        method: "put",
        url: request.changepassword,
        data: {
          data: {
            customer_id: localStorage.getItem('userid'),
            customer_code: ccode,
            // old_password: Password?.old_pass,
            password: Password?.new_pass,
            confirm_password: Password?.confrim_pass,
          }
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if(!passwordchange?.data[0]?.status) {
        return toast.info(passwordchange?.data[0]?.message)
      }
      if (passwordchange?.data[0]?.status) {
        toast.success("Your Password is changed Successfully");
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
        history.push("/login");
      }
    } catch (e) {
      console.log(e)
    }
  };

  const closeSide = () => {
    dispatch({
      type: "SET_MINICART",
      value: false,
    });
    dispatch({
      type: "SET_MINIMENU",
      value: false,
    });
    dispatch({
      type: "SET_NOTIFICATION",
      value: false,
    });
    dispatch({
      type: "SET_LANGUAGE",
    });
    dispatch({
      type: "SEARCHBAR__CLOSEOPEN",
    });
  };

  const handleClosed = () => {
    setOpened(false);
  };
  // const onOpenModal = () => {
  //   handleSubmit();
  // };

  const onCloseModal = () => {
    setOpen(false);
    setOpened(true);
  };

  const handleSubmit = (e) => {
    let errors = {};
    let error = false;
    // if (Password.old_pass?.length <= 0) {
    //   errors.old_pass = "Old Password is Empty";
    //   document.getElementById("old_pass")?.focus();
    //   error = true;
    // }
    if (Password.new_pass?.length <= 0) {
      errors.new_pass = "New Password is Empty";
      document.getElementById("new_pass")?.focus();
      error = true;
    }
    if (Password.confrim_pass?.length <= 0) {
      errors.confrim_pass = "Confrim Password is Empty";
      document.getElementById("confrim_pass")?.focus();
      error = true;
    } else if (Password.new_pass !== Password.confrim_pass) {
      errors.confrim_pass =
        "Confrim Password is not matching with New Password";
      document.getElementById("confrim_pass")?.focus();
      error = true;
    }
    setErrors(errors);
    if (!error) {
      changepasswordapi();
    }
  };

  return (
    <div className="changepassword" onClick={closeSide}>
      <div className="changepassword__back">
        <span onClick={() => history.goBack()}>
          <img src={back} alt="" />
        </span>
      </div>

      <div className="cp__container">
        <div className="changepassword__container">
          <h2>Reset Password</h2>
          <div className="changepassword__form">
            {/* <PasswordField
              label="Enter Old Password:"
              className="form-control"
              id="old_pass"
              name="old_pass"
              onChange={handleChange}
            />
            {errors?.old_pass && <h6 className="error">{errors.old_pass}</h6>} */}
            <PasswordField
              label="Enter New Password:"
              className="form-control"
              id="new_pass"
              name="new_pass"
              onChange={handleChange}
            />
            {errors?.new_pass && <h6 className="error">{errors.new_pass}</h6>}
            <PasswordField
              label="Re-Enter New Password:"
              className="form-control"
              id="confrim_pass"
              name="confrim_pass"
              onChange={handleChange}
            />
            {errors?.confrim_pass && (
              <h6 className="error">{errors.confrim_pass}</h6>
            )}
          </div>
          <div className="changepassword__buttondiv">
            <p
              className="changepassword__button"
              //  onClick={() => onOpenModal()}
              onClick={(e) => handleSubmit(e)}
            >
              Change Password
            </p>
          </div>
        </div>
        <ol className="validatorText">
          <strong>Password Conditions</strong>
          <li className="validator">
            <span className={`${passwordChecker?.count ? "seafoam" : "notseafoam"}`}></span>
            <span className={`${passwordChecker?.count ? "textseafoam" : "nottextseafoam"}`}>{"Please enter minimum 8 character."}</span>
          </li>
          <li className="validator">
            <span className={`${passwordChecker?.lower ? "seafoam" : "notseafoam"}`}></span>
            <span className={`${passwordChecker?.lower ? "textseafoam" : "nottextseafoam"}`}>{"Please enter atleast one Lower case character"}</span>
          </li>
          <li className="validator">
            <span className={`${passwordChecker?.upper ? "seafoam" : "notseafoam"}`}></span>
            <span className={`${passwordChecker?.upper ? "textseafoam" : "nottextseafoam"}`}>{"Please enter atleast one Upper case character"}</span>
          </li>
          <li className="validator">
            <span className={`${passwordChecker?.special ? "seafoam" : "notseafoam"}`}></span>
            <span className={`${passwordChecker?.special ? "textseafoam" : "nottextseafoam"}`}>{"Please enter atleast one Special character"}</span>
            <span className={`${passwordChecker?.special ? "textseafoam" : "nottextseafoam"}`} style={{display: "block"}}>(!, @, #, $, %, ^, &, *, ?)</span>
          </li>
          <li className="validator">
            <span className={`${passwordChecker?.numeric ? "seafoam" : "notseafoam"}`}></span>
            <span className={`${passwordChecker?.numeric ? "textseafoam" : "nottextseafoam"}`}>{"Please enter atleast one Number"}</span>
          </li>
        </ol>
      </div>

      <div className="cangepassword__modal">
        <Modal
          open={open}
          onClose={() => onCloseModal()}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal",
          }}
        >
          <div className="changepassword__verification">
            <Verification data={() => onCloseModal()} />
          </div>
        </Modal>
        <Modal
          open={opened}
          onClose={() => handleClosed()}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "VerificationModal",
          }}
        >
          <div className="changepassword__verification">
            <VerificationSuccess />
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default ChangePassword;
