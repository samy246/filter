import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import FormInput from "../../../formInput/FormInput";
import ImagePreview from "../ImagePreview/ImagePreview";
import PasswordField from "../../../formInput/PasswordField/PasswordField";
import "./AddnewUser.scss";
import RoleDropdown from "./RoleDropdown/RoleDropdown";
import request from "../../../../request";
import AddnewuserValidation from "./AddnewuserValidation";
import { browserName, browserVersion } from "react-device-detect";
import { MultiSelect } from "react-multi-select-component";
import placeholder from "../../../../assets/images/avatar.jpeg";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function AddnewUser({ roles, action, updateuser }) {
  const { t } = useTranslation();
  const history = useHistory();
  const [status, setstatus] = useState(0);
  const [comid, setcomid] = useState(null);
  const intialvalues = {
    supervisorname: "",
    companyname: "",
    branchname: "",
    phone: "",
    email: "",
    // username: "",
    password: "",
    role: "Select_role_for_staff",
  };

  const [formvalues, setFormvalues] = useState(intialvalues);
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState({});
  const [loc, setloc] = useState([]);
  const [branch] = useState(null);
  const [options, setoptions] = useState([]);
  const [selected_branch, setSelected_branch] = useState([]);
  const [dataCorrect, setDataCorrect] = useState(false);
  const [orderimage, setorderimage] = useState(null);
  const [proimage, setproimage] = useState([]);
  const [{ alt, src }, setImg] = useState({
    src: placeholder,
    alt: "",
  });
  const [defaultaddData, setDefaultaddData] = useState()

  const submitform = () => {
    if (action === "update") {
      updateuserdata();
    } else {
      newuser();
    }
  };

  useEffect(() => {
    if(updateuser?.id == undefined) return
    async function fetchData() {
      try {
        const getimage = await axios({
          method: "get",
          url: `${request.getimagebyid}/${updateuser.id}`,
        });
        setImg({
          src: `${request.image}/${getimage.data[0]}`,
          alt: "",
        });
        var file = document.querySelector("input[type=file]")["files"];
        setorderimage(file);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [updateuser]);

  useEffect(() => {
    if(localStorage.getItem("companyid") == undefined) return
    async function fetchData() {
      try {
        const getbranch = await axios({
          method: "get",
          url: `${request.getcompanybranch}/${localStorage.getItem(
            "companyid"
          )}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        getbranch?.data?.filter((dat) =>
          setoptions((options1) => [
            ...options1,
            {
              label: dat?.branch_name,
              value: dat?.address_id,
            },
          ])
        );
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
  }, []);

  const [testdata, settestdata] = useState([])
  useEffect(async () => {
    if (localStorage.getItem("userid") === null || updateuser?.id == undefined) return;
    try {
      const address = await axios({
        method: "get",
        url: `${request.getbranch}/${updateuser?.id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      let temp = []
      address.data?.map(ad => {
        temp?.push({
          label: ad?.branch_name,
          value: ad?.address_id
        })
      })
      settestdata(address.data)
      let data = address.data?.find(ad => ad.chk_default == "Y")
      onChangehandler(temp)
      setDefaultaddData(parseInt(data?.address_id))
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateuser])

  const onChangehandler = (e) => {
    setSelected_branch(e)
  }

  useEffect(() => {
    formvalues.branchname = branch;
  }, [branch]);

  useEffect(() => {
    formvalues.role = comid;
    console.log(formvalues.role)
  }, [comid]);

  useEffect(() => {
    async function fetchData() {
      try {
        const listofcompanies = await axios({
          method: "get",
          url: request.companylist,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = listofcompanies.data.filter(
          (data) => data.id === localStorage.getItem("companyid")
        );
        setloc(data);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
  }, []);

  const newuser = async () => {
    if(defaultaddData == undefined) {
      return toast.error("Kindly select Default address")
    }
    let userdata = JSON.parse(localStorage.getItem("userdata"));
    let png;
    if (proimage.length > 0) {
      png = proimage?.replace("data:image/png;base64", "png;");
    }
    const branchid = selected_branch.map((data) => `${data.value}`);
    let ccode;
    userdata?.custom_attributes.find((ca) => {
      if (ca?.attribute_code == "customer_code") {
        ccode = ca?.value;
      }
    });
    try {
      const user = await axios({
        method: "post",
        url: request.addnewuser,
        data: {
          data: {
            firstname: formvalues.email,
            lastname: formvalues.supervisorname,
            email: formvalues.email,
            phone: formvalues.phone,
            password: formvalues.password,
            companyId: localStorage.getItem("companyid"),
            roleId: comid,
            groupId:
              userdata.extension_attributes?.aw_ca_company_user
                ?.company_group_id,
            is_root: comid === "Administrator" ? true : false,
            status: status,
            branches: branchid.toString(),
            profile: png ? png : "",
            customer_code: ccode,
            default_branch: defaultaddData
          },
        },
      });
      if (user?.data[0].errors === false) {
        toast.info(user.data[0]?.message);
      } else {
        history.push("/myaccount/useradded");
      }
      createlog();
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const createlog = async () => {
    try {
      const res = await axios.get("https://geolocation-db.com/json/");
      await axios({
        method: "post",
        url: request.newlog,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          data: {
            customer_id: localStorage.getItem("userid"),
            company_id: localStorage.getItem("companyid"),
            remote_ip: res.data.IPv4,
            user_agent: `${browserName} Version:${browserVersion}`,
            action: `${
              JSON.parse(localStorage.getItem("userdata")).firstname
            } created new user ${formvalues.email}`,
            action_type: "save",
            functioncall_url: "user/save/",
          },
        },
      });
      await axios({
        method: "post",
        url: request.createnotification,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          data: {
            customer_id: localStorage.getItem("userid"),
            company_id: localStorage.getItem("companyid"),
            remote_ip: res.data.IPv4,
            user_agent: `${browserName} Version:${browserVersion}`,
            action_data: `${
              JSON.parse(localStorage.getItem("userdata")).firstname
            } created new user ${formvalues.email}`,
            action_type: "save",
            functioncall_url: "user/save/",
            status: 0,
          },
        },
      });
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const fileuploaded = (e) => {
    if (e.target?.files[0]) {
      setImg({
        src: URL.createObjectURL(e.target?.files[0]),
        alt: e.target?.files[0].name,
      });
    }
    var file = document.querySelector("input[type=file]")["files"];
    setorderimage(file);
  };

  useEffect(() => {
    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }

    var file = orderimage?.length && orderimage[0];
    if (file) {
      getBase64(file).then((data) => {
        setproimage(data);
      });
    }
  }, [orderimage]);

  const updateuserdata = async () => {
    let userdata = JSON.parse(localStorage.getItem("userdata"));
    let png;
    if (proimage.length > 0) {
      png = proimage?.replace("data:image/png;base64,", "png;");
    }
    const isroot = roles.filter((data) => {
      if (data?.id === comid) {
        if (data?.name === "Administrator") return data;
      }
    });
    let ccode;
    userdata?.custom_attributes.find((ca) => {
      if (ca?.attribute_code == "customer_code") {
        ccode = ca?.value;
      }
    });
    const branchid = selected_branch?.map((data) => `${data.value}`);
    if (branchid.length === 0) {
      return toast.info("Please select Branch");
    }
    let data = testdata?.find(ad => ad.chk_default == "Y")
    try {
      await axios({
        method: "put",
        url: request.updateuser,
        data: {
          data: {
            id: updateuser.id,
            firstname: formvalues.email,
            lastname: formvalues.supervisorname,
            email: formvalues.email,
            phone: formvalues.phone,
            password: formvalues.password,
            companyId: localStorage.getItem("companyid"),
            roleId: comid,
            groupId:
              userdata.extension_attributes?.aw_ca_company_user
                ?.company_group_id,
            is_root: isroot[0]?.name === "Administrator" ? true : false,
            status: status,
            branches: branchid.toString(),
            profile: png ? png : "",
            customer_code: ccode,
            default_branch: defaultaddData ? defaultaddData : data?.address_id
          },
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      history.push("/myaccount/useradded");
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };
  const activeStatus = async (e) => {
    if (e.target.checked === true) {
      setstatus(1);
      setActive(1);
    } else {
      setstatus(0);
      setActive(0);
    }
  };

  useEffect(() => {
    if (action === "update") {
      setActive(updateuser?.extension_attributes.aw_ca_company_user.status);
      const updatedUser = {
        supervisorname: updateuser?.lastname,
        companyname: "",
        branchname: "",
        phone: updateuser?.extension_attributes.aw_ca_company_user.telephone,
        email: updateuser?.email,
        username: updateuser?.email,
        password: "test",
        role: "Select_role_for_staff",
      };
      setstatus(updateuser?.extension_attributes.aw_ca_company_user.status);
      setFormvalues(updatedUser);
    }
  }, [updateuser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormvalues({
      ...formvalues,
      [name]: value,
    });
  };
  const {
    supervisorname,
    phone,
    email,
    // username,
    password,
    // role,
  } = formvalues;


  const formcanBeSubmitted = () => {
    const { supervisorname, phone, email, password } = formvalues;
    return (
      supervisorname.length > 0 &&
      phone.length > 0 &&
      email.match(/^(([^<>()[\]\\,;:\s@"]+(\.[^<>()[\]\\,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) &&
      // username.length > 0 &&
      password.length > 0 && comid && selected_branch.length
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(AddnewuserValidation(formvalues));
    setDataCorrect(true);
  };
  useEffect(() => {
    if (Object.keys(errors).length === 0 && dataCorrect) {
      submitform();
      // history.push("/myaccount/useradded");
    }
  }, [errors]);

  return (
    <div className="addnew__user">
      <div className="addnew__user__topdiv">
        <span className="h3">
          <label>{t("Add New User")}</label>
        </span>
      </div>
      <div className="addnew__user__form">
        <div className="user__avatar">
          <div className="img__uploader">
            <form encType="multipart/form-data">
              <div className="form__img-input-container">
                <input
                  type="file"
                  accept="image/png"
                  id="photo"
                  className="visually-hidden"
                  onChange={fileuploaded}
                />
                <label htmlFor="photo" className="form-img__file-label">
                  {t("Add Image")}{" "}
                </label>
                <img src={src} alt={alt} className="form-img__img-preview" />
              </div>
            </form>
          </div>
        </div>
        <div className="form">
          <form name="addnewuser__form">
            <div className="mb-2">
              <FormInput
                adduser
                label={`${t("Name")}:`}
                type="text"
                className="form-control"
                id="name"
                name="supervisorname"
                placeholder="Enter Supervisor / Purchaser name"
                value={supervisorname}
                onChange={handleChange}
              />{" "}
              {errors.supervisorname && (
                <span className="error">{errors.supervisorname}</span>
              )}
            </div>{" "}
            <div className="mb-2">
              <h6 className="mt-2 mb-2" htmlFor="exampleInputEmail1">
                {t("Company Name")}:
              </h6>
              <div className="mb-4">
                <FormInput value={loc[0]?.name} disabled />
                {/* {errors.phone && <span className="error">{errors.phone}</span>} */}
              </div>{" "}
              {errors.companyname && (
                <span className="error">{errors.companyname}</span>
              )}
              <MultiSelect
                options={options}
                className="multiSelect_dropdown"
                hasSelectAll={false}
                disableSearch={true}
                value={selected_branch}
                onChange={onChangehandler}
                labelledBy="Select"
              />
              <h6 className="branches__label">{t("Select branches to assign for this user")}</h6>
              {errors.branchname && (
                <span className="error">{errors.branchname}</span>
              )}
            </div>{" "}
            <div className="mb-3 default__address">
              <hr />
              <RoleDropdown
                roles={selected_branch}
                setDefaultaddData={setDefaultaddData}
                comid={defaultaddData}
                type="defaultaddress"
                company={"Default Address"}
                value={defaultaddData}
              />
            </div>  
            <div className="mb-2">
              <FormInput
                adduser
                label={`${t("Phone")}:`}
                type="number"
                className="form-control"
                id="phone"
                name="phone"
                min={0}
                placeholder="Enter your mobile number"
                value={phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>{" "}
            <div className="mb-2">
              <FormInput
                adduser
                label={`${t("Email")}:`}
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter Supervisor / Purchaser email"
                value={email}
                onChange={handleChange}
                required
              />{" "}
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="mb-3 ">
              <h6 className="m-0" htmlFor="exampleInputEmail1">
                {t("Role")}:
              </h6>
              <hr />
              <RoleDropdown
                roles={roles}
                setcomid={setcomid}
                comid={comid}
                company={"Role"}
                type="roles"
                roleid={
                  updateuser?.extension_attributes?.aw_ca_company_user
                    ?.company_role_id
                }
              />
            </div>
            <h6>{t("Account")}:</h6>
            <hr />
            <div className="mb-2">
              <FormInput
                adduser
                label={`${t("Username")}:`}
                type="text"
                className="form-control"
                id="username:"
                name="username"
                placeholder="Enter username"
                value={email}
                onChange={handleChange}
                autoComplete="new-password"
                disabled
              />
              {/* {errors.username && (
                <span className="error">{errors.username}</span>
              )} */}
            </div>{" "}
            {/* {localStorage.getItem("currentrole") != "Purchaser" && ( */}
            <div className="mb-2">
              <PasswordField
                label={`${t("Password")}:`}
                className="form-control"
                id="password:"
                name="password"
                placeholder="Enter Your Password"
                ng-model="dataItem.password"
                value={password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
            {/* )} */}
            <div className="user__status">
              <h6 className="m-0">{t("Status")}</h6>
              <div className="myprofile__active">
                {" "}
                <div className="myprofile__active_check">
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    {active ? t("Active") : t("In Active")}
                  </label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckChecked"
                      checked={active}
                      onChange={(e) => activeStatus(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              {action === "update" ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className=" adduser__save w-100"
                  aria-label="saveuser"
                >
                  {t("Save")}
                </button>
              ) : (
                <button
                  type="button"
                  className=" adduser__save w-100"
                  disabled={!formcanBeSubmitted()}
                  onClick={handleSubmit}
                  aria-label="saveuser"
                >
                  {t("Save")}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddnewUser;
