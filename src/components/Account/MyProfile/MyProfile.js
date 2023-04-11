import React, { useState, useRef, useEffect } from "react";
import "./MyProfile.scss";
import Pencil from "../../../assets/images/Account/pencil.svg";
import axios from "axios";
import request from "../../../request";
import { toast } from "react-toastify";
import { t } from "i18next";

function MyProfile() {
  const [active, setActive] = useState();
  const [user, setUser] = useState("disabled");
  const [phone, setPhone] = useState("disabled");
  const [email, setEmail] = useState("disabled");
  const [errors, setErrors] = useState({});

  const [intialValues, setintialValues] = useState({
    username: "",
    phone: "",
    email: "",
  });
  const [root, setroot] = useState();
  const userNameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    setroot(JSON.parse(localStorage.getItem("userdata")));
  }, [localStorage.getItem("userdata")]);

  const changeuserstatus = () => {
    setUser("");
  };
  const changephonestatus = () => {
    setPhone("");
  };
  const changeemailstatus = () => {
    setEmail("");
  };

  const disableuserstatus = () => {
    setUser("disabled");
  };
  const disablephonestatus = () => {
    setPhone("disabled");
  };
  const disableemailstatus = () => {
    setEmail("disabled");
  };

  const activeStatus = () => {
    setActive(!active);
  };

  useEffect(() => {
    if (user === "") {
      userNameRef.current.focus();
    }
  }, [user]);
  useEffect(() => {
    if (phone === "") {
      phoneRef.current.focus();
    }
  }, [phone]);
  useEffect(() => {
    if (email === "") {
      emailRef.current.focus();
    }
  }, [email]);

  const handleChange = (e) => {
    if (e.target.name === "phone" && e.target.value.length > 10) return;
    setintialValues({ ...intialValues, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = {};
    if (!intialValues.username) {
      errors.username = "Username is required.";
    }
    if (!intialValues.phone) {
      errors.phone = "Phone number required";
    } else if (intialValues.phone.length !== 10) {
      errors.phone = "Phone number must be in 10 digits ";
    }
    if (!intialValues.email) {
      errors.email = "Email is required";
    } else if (
      !intialValues?.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      // /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(intialValues.email)
    ) {
      errors.email = "Email is Invalid";
    }
    setErrors(errors);
    if (!(errors?.phone || errors?.email || errors?.username)) {
      updateuser();
    }
  };

  const [localdata] = useState(JSON.parse(localStorage.getItem("userdata")));

  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("userdata"));
    let role_user = JSON.parse(localStorage.getItem("companyrolesdata"));
    let role_id = JSON.parse(localStorage.getItem("company_role_id"));
    let role_data = role_user?.filter((itm) => itm.id === role_id);

    setintialValues({
      username: userdata?.firstname,
      phone: userdata?.extension_attributes?.aw_ca_company_user?.telephone,
      email: userdata?.email,
      role: role_data?.[0]?.name,
    });
    if (userdata?.extension_attributes.customer_status === "0") {
      setActive(false);
    } else {
      setActive(true);
    }
  }, []);

  useEffect(() => {
    if (localdata?.extension_attributes.customer_status === "0") {
      setActive(false);
    } else {
      setActive(true);
    }
  }, [localdata?.extension_attributes.customer_status]);

  const updateuser = async () => {
    let status = null;
    if (active === true) {
      status = 1;
    } else {
      status = 0;
    }

    try {
      let user = JSON.parse(localStorage.getItem("userdata"));
      const userdata = await axios({
        method: "post",
        url: request.updateprofile,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          user: {
            id: localStorage.getItem("userid"),
            email: intialValues.email,
            firstname: intialValues.username,
            lastname: user?.lastname,
            website_id: 1,
            extension_attributes: {
              aw_ca_company_user: {
                telephone: intialValues.phone,
                is_root:
                  user?.extension_attributes?.aw_ca_company_user?.is_root,
              },
            },
            custom_attributes: {
              customer_status: status,
            },
          },
        },
      });
      if (userdata.data) {
        const userData = await axios({
          method: "get",
          url: request.userData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        localStorage.setItem("userdata", JSON.stringify(userData.data));
        localStorage.setItem(
          "address",
          JSON.stringify(userData.data.addresses)
        );
        localStorage.setItem("userid", userData.data.id);
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
      }
      toast?.success("User Details Updated Successfully");
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

  const [orderimage, setorderimage] = useState(null);

  const fileuploaded = (e) => {
    var file = document.querySelector("input[type=file]")["files"];
    setorderimage(file);
    file = ''
  };


  const [proimage, setproimage] = useState([]);
  useEffect(() => {
    if(orderimage == null) return
    for (let i in orderimage) {
      const data = new Promise((resolve) => {
        var file = new File([orderimage[i]], orderimage[i]);
        var reader = new FileReader();
        // Read file content on file loaded event
        reader.onload = function (event) {
          resolve(event.target.result);
        };
        // Convert data to base64
        reader.readAsDataURL(file);
      }).then((result) => {
        // setb64png(`png:${result}`);
        setproimage((proimage) => [...proimage, `${result}`]);
      });
    }
  }, [orderimage]);

  useEffect(() => {
    if(orderimage == null) return;
    async function fetchData() {
      if (proimage[0]) {
        let png = proimage[0]?.replace(
          "data:application/octet-stream;base64,",
          "png;"
        );
        try {
          const uploadpic = await axios({
            method: "post",
            url: request.profileimage,
            data: {
              profile: png,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (uploadpic.data) {
            const userData = await axios({
              method: "get",
              url: request.userData,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
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
          }
          window.location.reload();
          toast?.success("User Profile Updated Successfully");
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
            window.location.reload();
          }
        }
      }
    }
    fetchData();
    setorderimage(null);
    setproimage([])
  }, [proimage[0]]);

  return (
    <div className="myprofile">
      <h3>{t("My Profile")}</h3>
      <div className="myprofile__topContent">
        <div className="myprofile__img">
          <div className="myprofile__imgdata">
            <img
              src={`${request.image}/${root?.extension_attributes?.profile}`}
              alt=""
            />
            <label>
              <input
                type="file"
                size="60"
                onChange={fileuploaded}
                className="fileuploader"
                accept="image/png"
              />
              {t("Edit Image")}
            </label>
          </div>
          <div className="myprofile__namerole">
            <div className="myprofile__img__edit">
              <h4>{localStorage.getItem("username")}</h4>
            </div>
            <p>
              {t("Position")} : {intialValues?.role}
            </p>
          </div>
        </div>
        <div className="myprofile__active">
          <div className="myprofile__active_check">
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckChecked"
            >
              {active ? `${t("Active")}` : `${t("In Active")}`}
            </label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckChecked"
                checked={active}
                onChange={activeStatus}
              />
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="myprofile__form">
          <h6>{t("Username")}: </h6>
          <div
            className={`myprofile__value ${!user && "myprofile__value__edit"}`}
          >
            <input
              type="text"
              name="username"
              value={intialValues.username}
              ref={userNameRef}
              disabled={user}
              onChange={handleChange}
            />
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}
            {user ? (
              <img alt="" src={Pencil} onClick={changeuserstatus} />
            ) : (
              <p onClick={disableuserstatus}>{t("Save")}</p>
            )}
          </div>
          <h6>{t("Phone")}: </h6>
          <div
            className={`myprofile__value ${!phone && "myprofile__value__edit"}`}
          >
            <input
              type="number"
              name="phone"
              ref={phoneRef}
              value={intialValues?.phone}
              disabled={phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
            {phone ? (
              <img alt="" src={Pencil} onClick={changephonestatus} />
            ) : (
              <p onClick={disablephonestatus}>{t("Save")}</p>
            )}
          </div>
          <h6>{t("Email")}: </h6>
          <div
            className={`myprofile__value ${!email && "myprofile__value__edit"}`}
          >
            <input
              type="email"
              name="email"
              value={intialValues.email}
              ref={emailRef}
              disabled={email}
              required
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
            {email ? (
              <img alt="" src={Pencil} onClick={changeemailstatus} />
            ) : (
              <p onClick={disableemailstatus}>Save</p>
            )}
          </div>
          <h6>{t("Role")}: </h6>
          <div className="myprofile__value">
            <input className="admin" disabled value={intialValues?.role} />
          </div>
        </div>
        <div className="myprofile__buttons">
          <button
            type="submit"
            className="myprofile__save border-0"
            aria-label="profilesave"
          >
            {t("Save")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MyProfile;
