import React, { useState, useEffect } from "react";
import AddressCard from "../../AddressCard/AddressCard";
import "./DeliveryAddress.scss";
import search from "../../../assets/images/Finance/search.svg";
import GoogleMap from "./GoogleMap/GoogleMap";
import axios from "axios";
import request from "../../../request";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { t } from "i18next";

function DeliveryAddress({ title, newadd, handleNewPage, setNewUser }) {
  const [newbranch, setnewbranch] = useState([]);
  const [selected_Time, setSelected_Time] = useState([]);
  const [selected_day, setselected_day] = useState([]);
  const [billselect, setbillselect] = useState(false);
  const [shipselect, setshipselect] = useState(false);
  const [addressselection, setaddressselection] = useState();
  const [editaddress, seteditaddress] = useState();
  const [DistrictList, setDistrictList] = useState("");
  const [StateList, setStateList] = useState("");
  const [countryList, setCountryList] = useState("");
  const [delivery, setDelivery] = useState(false);
  const [deliveryAddressBack, setDeliveryAddressBack] = useState(false);
  let ref = React.useRef();
  const [latLonSet, setLatLonSet] = useState({
    lat: 15.431784870997344,
    lng: 100.85050886721454,
  });
  const [enterdelivery, setEnterDelivery] = useState(false);
  const [lat_lng, setLat_lng] = useState();
  const [SubDistrictList, setSubDistrictList] = useState("");
  const [errors, setErrors] = useState({});
  const history = useHistory();
  var lat;
  var lng;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentuser, setcurrentuser] = useState();
  useEffect(() => {
    let usercompany = JSON.parse(localStorage.getItem("company_role_id"));
    let companyroles = JSON.parse(localStorage.getItem("companyrolesdata"));
    const currentcompany = companyroles?.find(
      (data) => data.id === usercompany
    );
    setcurrentuser(currentcompany?.name);
  }, []);

  const fetchData = async () => {
    if (localStorage.getItem("userid") === null) return;
    try {
      const getbranch = await axios({
        method: "get",
        url: `${request.getAllBranch}/${localStorage.getItem("userid")}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setnewbranch(getbranch?.data);
      console.log("check all data", getbranch.data);
    } catch (e) {
      console.log(e);
      // toast.error(e.response?.data?.message);
    }
  };

  const [options, setoptions] = useState([]);
  useEffect(async () => {
    try {
      const deliverytime = await axios({
        method: "get",
        url: request.deliverytimelist,
      });

      const temp = [];
      deliverytime.data.filter((data) => {
        temp.push({
          label: data.name,
          value: data.name,
          id: data.id,
        });
      });

      setoptions(temp);
      console.log("prefered time 89", options);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const day_list = [
    { label: "Sunday", value: "d_sun" },
    { label: "Monday", value: "d_mon" },
    { label: "Tuesday", value: "d_tue" },
    { label: "Wednesday", value: "d_wed" },
    { label: "Thursday", value: "d_thu" },
    { label: "Friday", value: "d_fri" },
    { label: "Saturday", value: "d_sat" },
  ];

  //const

  const billing = (e) => {
    setbillselect(e.target.checked);
  };
  const shipping = (e) => {
    setshipselect(e.target.checked);
  };

  const savedelivery = () => {
    if (!lat_lng) {
      navigator.geolocation.getCurrentPosition(function (position) {
        lat = position?.coords?.latitude?.toString();
        lng = position?.coords?.longitude?.toString();
        FinalData();
      });
    } else {
      lat = lat_lng?.lat;
      lng = lat_lng?.lng;
      FinalData();
    }
  };

  const [time, setime] = useState();
  const [timedata, settimedata] = useState([]);
  useEffect(() => {
    let time = [];
    selected_Time.map((data) => {
      time.push({
        [data?.id]: data?.value,
      });
    });
    settimedata(time?.reduce((r, c) => Object.assign(r, c), {}));
  }, [selected_Time]);

  const FinalData = async () => {
    var temp_mon = selected_day.some((i) => i.label === "Monday");
    var temp_tue = selected_day.some((i) => i.label === "Tuesday");
    var temp_wed = selected_day.some((i) => i.label === "Wednesday");
    var temp_thurs = selected_day.some((i) => i.label === "Thursday");
    var temp_fri = selected_day.some((i) => i.label === "Friday");
    var temp_satur = selected_day.some((i) => i.label === "Saturday");
    var temp_sun = selected_day.some((i) => i.label === "Sunday");
    var address = deliverintialvalus?.street?.toString();
    // return;
    try {
      await axios({
        method: "post",
        url:
          editaddress === undefined
            ? request.createbranch
            : request.updatebranch,
        data: {
          data: {
            id: editaddress,
            company_id: localStorage.getItem("companyid"),
            customer_id: localStorage.getItem("userid"),
            branch_name: deliverintialvalus?.name,
            branch_code: "",
            edi_branch_code: "",
            contact: deliverintialvalus?.name,
            mobile: deliverintialvalus?.contactnumber,
            chk_default: "N",
            latitude: lat,
            longitude: lng,
            d_mon: temp_mon ? "Y" : "N",
            d_tue: temp_tue ? "Y" : "N",
            d_wed: temp_wed ? "Y" : "N",
            d_thu: temp_thurs ? "Y" : "N",
            d_fri: temp_fri ? "Y" : "N",
            d_sat: temp_satur ? "Y" : "N",
            d_sun: temp_sun ? "Y" : "N",
            time_from: "9 AM",
            time_to: "12 PM",
            moo_name: deliverintialvalus?.buildingname,
            moo_no: deliverintialvalus?.floornumber,
            sol: "",
            province: deliverintialvalus?.state,
            tumbol: deliverintialvalus?.subdistrict,
            amphur: deliverintialvalus?.district,
            address_line1: deliverintialvalus?.addressline1,
            address_line2: deliverintialvalus?.addressline2,
            address_line3: deliverintialvalus?.addressline3,
            street: address,
            addr_num: deliverintialvalus?.floornumber,
            state: deliverintialvalus?.state,
            country: deliverintialvalus?.country,
            post_code: pcode,
            telephone: deliverintialvalus?.contactnumber,
            shipping: shipselect === false ? 0 : 1,
            billing: billselect === false ? 0 : 1,
            preferred_time: timedata,
          },
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      history.push("/myaccount/deliveryadded");
    } catch (e) {
      console.log(e);
      // toast.error(e.response?.data?.message);
    }
  };

  const [deliverintialvalus, setDeliverintialvalus] = useState({
    name: "",
    contactnumber: "",
    country: "",
    state: "",
    buildingname: "",
    buildingno: "",
    floornumber: "",
    addressline1: "",
    addressline2: "",
    addressline3: "",
    street: [],
    district: "",
    subdistrict: "",
    pincode: "",
  });

  const [disabled, setDisabled] = useState(false);
  const [addressdisable, setaddressdisable] = useState(false);
  var daykeys = [];
  var plugininsidearr = [];
  //edit address
  useEffect(() => {
   

    //setselected_day(day_list)
    const data = newbranch.filter((data) => data.id === editaddress);
    if (data[0]) {
      console.log("data[0============================>", data);
      setDisabled(true);
      setaddressdisable(false);
      const selected = [];
      console.log("day.list",day_list);
      day_list.forEach((day) => {
        console.log("dayd",day);
       // console.log("if con",data[0][day.value] === "Y");
        if (data[0][day.value] === "Y") {
          selected.push(day);
        }
      });
      setselected_day(selected);
    }




 
    




















    // day_list.map((i) => {
    //   console.log("mmmmmmm tttt", i.key);
    //   if (data[0]) {
    //     console.log("keyssss", Object.keys(data[0]));
    //     daykeys.push(Object.keys(data[0]));
    //     console.log(
    //       "da",
    //       daykeys.map((j, l) => {
    //         console.log("jjj", j.includes(i.key));
    //         if (j.includes(i.key)) {
    //           // return
    //           var apivalue = data.map(
    //             ({ d_sun, d_mon, d_tue, d_wed, d_thu, d_fri, d_sat }) =>
    //               console.log(
    //                 "d_mon,d_tue",
    //                 d_sun,
    //                 d_mon,
    //                 d_tue,
    //                 d_wed,
    //                 d_thu,
    //                 d_fri,
    //                 d_sat
    //               )
    //           );

    //           // return data[0]?.d_mon
    //           // return data[0]?.d_tue
    //           // return data[0]?.d_wed
    //           // return data[0]?.d_thu
    //           // return data[0]?.d_fri
    //           // return data[0]?.d_sat
    //           // return data[0]?.d_sun
    //         }
    //         console.log("i.keyyeyeye", i.key);
    //         //return j.includes(i.key)=>data[0]?.d_mon)
    //       })
    //     );
    //   }

    //   //     if(i.label == "Monday"){
    //   // return data[0].d_mon=="Y"
    //   // //console.log("monday key only same",data[0].d_mon);
    //   //     }
    // });

    // var a = day_list.map((i) => {
    //   if (i.value == "d_mon" && "Y") {
    //     //return i.label
    //     console.log("i.labelll", i.label);
    //     //setselected_day(i.)
    //   } // setselected_day(a)

    //   // if(i.value =="d_mon" && "Y"){
    //   //   console.log("i.labelll",i.label);
    //   // }
    // });
    // setselected_day(a)
    // var b=daykeys.map((i)=>{return i});

    //console.log("two isequal",a==b);

    // }

    // setoptions([{ label: "All", value: "*" }, ...day_list]);
    //setaddressdisable(false)
    //setDisabled(!disabled)
    //changing
    //deliverintialvalus.name = data[0]?.contact;
    deliverintialvalus.name = data[0]?.branch_name;

    // chnaging
    // deliverintialvalus.contactnumber = data[0]?.telephone;
    deliverintialvalus.contactnumber = data[0]?.mobile;
    console.log("contact number", deliverintialvalus.contactnumber);
    deliverintialvalus.state = data[0]?.state;
    deliverintialvalus.country = data[0]?.country;
    // console.log("country--->",deliverintialvalus.country);
    deliverintialvalus.buildingname = data[0]?.moo_name;
    deliverintialvalus.buildingno = data[0]?.addr_num;
    deliverintialvalus.floornumber = data[0]?.moo_no;
    deliverintialvalus.addressline1 = data[0]?.address_line1;
    deliverintialvalus.addressline2 = data[0]?.address_line2;
    deliverintialvalus.addressline3 = data[0]?.address_line3;
    deliverintialvalus.street = data[0]?.street;
    deliverintialvalus.district = data[0]?.province;

    deliverintialvalus.subdistrict = data[0]?.amphur;
    deliverintialvalus.pincode = data[0]?.post_code;
    //setselected_day(selected_day)
    console.log("day of delivery==================>", data[0]?.d_fri);
    let lat = parseFloat(data[0]?.latitude);
    let lng = parseFloat(data[0]?.longitude);
    setLatLonSet({
      lat: lat,
      lng: lng,
    });
    if (editaddress === undefined) {
      deliverintialvalus.name = "";
      deliverintialvalus.contactnumber = "";
      deliverintialvalus.state = "";
      deliverintialvalus.district = "";
      deliverintialvalus.buildingname = "";
      deliverintialvalus.buildingno = "";
      deliverintialvalus.floornumber = "";
      deliverintialvalus.addressline1 = "";
      deliverintialvalus.addressline2 = "";
      deliverintialvalus.addressline3 = "";
      deliverintialvalus.street = "";
      deliverintialvalus.subdistrict = "";
      deliverintialvalus.pincode = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editaddress]);

  const addressSelection = [
    {
      label: "Use my current Location",
      value: "my_location",
      icon: "fas fa-thumbtack",
    },
    {
      label: "Add Address",
      value: "add_address",
      icon: "fas fa-map-marker-alt",
    },
  ];

  const openDeliveryform = () => {
    setEnterDelivery(true);
  };
  const selectedaddress = (value) => {
    setaddressselection(value);
    setEnterDelivery(true);
  };

  const inputsHandler = (event) => {
    console.log("event", event.target.value);
    if (
      event.target.name === "contactnumber" &&
      // validate keypress

      event.target.value.replace(/[0-9]*\.?[0-9]+/g, "")
      // event.target.value?.length > 10
    )
      return;
    setDeliverintialvalus({
      ...deliverintialvalus,
      [event.target.name]: event.target.value,
    });
  };
  const DeliveryAddressSaved = () => {
    const {
      name,
      contactnumber,
      buildingname,
      buildingno,
      floornumber,
      addressline1,
      addressline2,
      addressline3,
      street,
      pincode,
    } = deliverintialvalus;
    return (
      name?.length > 0 &&
      contactnumber?.length > 0 &&
      deliverintialvalus?.country?.length > 0 &&
      //buildingname?.length > 0 &&
      //floornumber?.length > 0 &&
      street?.length > 0 &&
      // pincode?.length > 0 &&
      deliverintialvalus?.state?.length > 0 &&
      deliverintialvalus?.district?.length > 0 &&
      deliverintialvalus?.subdistrict?.length > 0 &&
      selected_day?.length > 0 &&
      selected_Time?.length > 0
    );
  };
  const isEnabled = DeliveryAddressSaved();
  //
  const {
    name,
    contactnumber,
    buildingname,
    buildingno,
    floornumber,
    addressline1,
    addressline2,
    addressline3,
    street,
    pincode,
  } = deliverintialvalus;
  const googleMap_addressFetch_callback = (event) => {
    setEnterDelivery(true);
    let temp = [event?.city, event?.district, event.state, event?.country];
    temp.toString();
    setDeliverintialvalus({
      ...deliverintialvalus,
      street: temp,
    });
  };
  const get_lat_lng = (event) => {
    setLat_lng({ lat: event?.lat, lng: event.lng });
  };

  useEffect(async () => {
    let userdata = JSON.parse(localStorage.getItem("userdata"));
    const erptoken = await axios({
      method: "post",
      url: request.erplogin,
      data: {
        username: "jagota-iskula-b2b-team",
        password: "JIBT1234!@#$",
      },
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    const fetchCountryData = () => {
      axios({
        method: "GET",
        url: `${request?.erpgetcountry}${userdata?.extension_attributes?.customer_code}`,
        headers: {
          token: `Bearer ${erptoken.data.data.token}`,
        },
      })
        .then((response) => {
          setCountryList({ data: response?.data.data });
        })
        .catch((error) => {});
    };
    fetchCountryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(async () => {
    let userdata = JSON.parse(localStorage.getItem("userdata"));
    const erptoken = await axios({
      method: "post",
      url: request.erplogin,
      data: {
        username: "jagota-iskula-b2b-team",
        password: "JIBT1234!@#$",
      },
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const fetchStateData = () => {
      setStateList();
      if (deliverintialvalus?.country) {
        axios({
          method: "GET",
          // url: `${request.getstate}/${deliverintialvalus?.country}`,
          url: `${request?.erpgetstate}${userdata?.extension_attributes?.customer_code}&countryCode=${deliverintialvalus?.country}`,
          headers: {
            token: `Bearer ${erptoken.data.data.token}`,
          },
        })
          .then((response) => {
            setStateList({ data: response?.data.data });
          })
          .catch((error) => {});
      }
    };
    fetchStateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliverintialvalus?.country]);

  useEffect(async () => {
    let userdata = JSON.parse(localStorage.getItem("userdata"));
    const erptoken = await axios({
      method: "post",
      url: request.erplogin,
      data: {
        username: "jagota-iskula-b2b-team",
        password: "JIBT1234!@#$",
      },
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const fetchStateData = () => {
      setDistrictList();
      if (deliverintialvalus?.state) {
        axios({
          method: "GET",
          // url: `${request.getdistrict}/${deliverintialvalus?.state}`,
          url: `${request?.erpgetdistrict}${userdata?.extension_attributes?.customer_code}&region=${deliverintialvalus?.state}`,
          headers: {
            token: `Bearer ${erptoken.data.data.token}`,
          },
        })
          .then((response) => {
            setDistrictList({ data: response?.data.data });
          })
          .catch((error) => {});
      }
    };
    fetchStateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliverintialvalus?.state]);

  useEffect(async () => {
    let userdata = JSON.parse(localStorage.getItem("userdata"));
    const erptoken = await axios({
      method: "post",
      url: request.erplogin,
      data: {
        username: "jagota-iskula-b2b-team",
        password: "JIBT1234!@#$",
      },
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const fetchStateData = () => {
      setSubDistrictList();
      if (deliverintialvalus?.district) {
        axios({
          method: "POST",
          // url: `${request.getsubdistrict}/${deliverintialvalus?.district}`,
          url: request?.erpsubdistrict,
          data: {
            custCode: userdata?.extension_attributes?.customer_code,
            province: deliverintialvalus?.district,
          },
          headers: {
            token: `Bearer ${erptoken.data.data.token}`,
          },
        })
          .then((response) => {
            setSubDistrictList({ data: response?.data.data });
          })
          .catch((error) => {});
      }
    };
    fetchStateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliverintialvalus?.district]);
  const [pcode, setpcode] = useState();

  useEffect(async () => {
    let userdata = JSON.parse(localStorage.getItem("userdata"));
    const erptoken = await axios({
      method: "post",
      url: request.erplogin,
      data: {
        username: "jagota-iskula-b2b-team",
        password: "JIBT1234!@#$",
      },
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const fetchStateData = () => {
      setpcode();
      if (deliverintialvalus?.district) {
        axios({
          method: "POST",
          // url: `${request.getsubdistrict}/${deliverintialvalus?.district}`,
          url: request?.erppincode,
          data: {
            custCode: userdata?.extension_attributes?.customer_code,
            province: deliverintialvalus?.district,
            amphur: deliverintialvalus?.subdistrict,
          },
          headers: {
            token: `Bearer ${erptoken.data.data.token}`,
          },
        })
          .then((response) => {
            setpcode(response?.data.data[0].POST_CODE);
          })
          .catch((error) => {});
      }
    };
    fetchStateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliverintialvalus?.subdistrict]);

  const CountryChange = (event) => {
    setDeliverintialvalus((prevState) => ({
      ...prevState,
      country: event.target.value,
    }));
  };
  const StateChange = (event) => {
    setDeliverintialvalus((prevState) => ({
      ...prevState,
      state: event.target.value,
    }));
  };
  const DistrictChange = (event) => {
    setDeliverintialvalus((prevState) => ({
      ...prevState,
      district: event.target.value,
    }));
  };
  const SubDistrictChange = (event) => {
    setDeliverintialvalus((prevState) => ({
      ...prevState,
      subdistrict: event.target.value,
    }));
  };

  const handleSubmit = (e) => {
    let errors = {};
    if (deliverintialvalus.contactnumber.length !== 10) {
      errors.contactnumber = "Contact number must be in 10 digits ";
      document.getElementById("contactnumber")?.focus();
    }
    setErrors(errors);
    if (!errors?.contactnumber) {
      savedelivery();
    }
  };
  useEffect(() => {
    if (deliveryAddressBack) {
      fetchData();
    }
  }, [deliveryAddressBack]);
  var data = newbranch.filter((data) => data.id === editaddress);
  

  /******************** */

  return (
    <div className="deliveryaddress">
      {!newadd ? (
        <>
          <div className="deliveryaddress__header">
            <h4>
              {t("Delivery Address")}
              {/* {title} */}
            </h4>
            {currentuser !== "Purchaser" && (
              <p
                onClick={() => {
                  handleNewPage();
                  seteditaddress();
                  setEnterDelivery(false);
                  setDisabled(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                </svg>
                <span>{t("Address")}</span>
              </p>
            )}
          </div>
          <div className="deliveryaddress__addresscard">
            <AddressCard
              status="Active"
              addresslist={newbranch}
              seteditaddress={seteditaddress}
              handleNewPage={handleNewPage}
              setEnterDelivery={setEnterDelivery}
              setNewUser={setNewUser}
              setDeliveryAddressBack={setDeliveryAddressBack}
            />
            {currentuser !== "Purchaser" && (
              <div
                className="add___newaddaress__option "
                onClick={() => {
                  handleNewPage();
                  seteditaddress();
                  setEnterDelivery(false);
                }}
              >
                <p>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-plus-lg"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                    </svg>
                  </span>
                  <span>{t("Add New Address")}</span>
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <h4>{title}</h4>
          <p
            className={`deliveryaddress__locationchoose ${
              delivery && "deliveryaddress__locationchoose__open"
            }`}
            onClick={() => setDelivery(!delivery)}
          >
            <img src={search} alt="" />
            {addressselection ? addressselection?.label : "Select Location"}
            <ul>
              {addressSelection.map((a, i) => (
                <li key={i} onClick={() => selectedaddress(a)}>
                  <p>
                    <i className={`${a.icon} green`} />
                    <span>{a.label}</span>
                  </p>
                </li>
              ))}
            </ul>
          </p>

          <div className="deliveryaddress__googlemap">
            <GoogleMap
              fucCall={googleMap_addressFetch_callback}
              get_lat_lng={get_lat_lng}
              selectedLocation={addressselection?.value}
              latLonSet={latLonSet}
            />
          </div>
          {!enterdelivery ? (
            <p
              className="deliveryaddress__enter"
              onClick={() => openDeliveryform(ref)}
            >
              {t("Enter Delivery Location")}
            </p>
          ) : (
            <>
              <form name="add_delivery_address" ref={ref}>
                <div className="deliveryaddress__new">
                  <div>
                    <h6>
                      <span>{t("Name")}:</span>
                      <i className="fas fa-star-of-life" />
                    </h6>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={name}
                      placeholder="Enter your name"
                      onChange={inputsHandler}
                      disabled={disabled}
                    />
                  </div>
                  <div>
                    <h6>
                      <span>{t("Contact Number")}:</span>
                      <i className="fas fa-star-of-life" />
                    </h6>
                    <input
                      type="text"
                      className="form-control"
                      name="contactnumber"
                      id="contactnumber"
                      value={contactnumber}
                      placeholder="Contact number"
                      onChange={inputsHandler}
                      disabled={disabled}
                      // pattern="/([^+0-9]+)/gi"
                    />
                    {errors.contactnumber && (
                      <span className="error">{errors.contactnumber}</span>
                    )}
                  </div>
                  <div className="col-md-12">
                    <div className="form-group mx-2">
                      <h6>
                        <span>{t("Country/Region")}:</span>
                        <i className="fas fa-star-of-life" />
                      </h6>
                      <select
                        className="form-control custom-select"
                        name="country"
                        onChange={CountryChange}
                        id="country"
                        value={deliverintialvalus?.country}
                        disabled={disabled}
                      >
                        <option value="">{t("Select Country")}</option>
                        <option>{deliverintialvalus.country}</option>

                        {/* {countryList?.data !== undefined &&
                          countryList?.data !== null &&
                          countryList?.data !== [] &&
                          countryList.data.length > 0
                          ? countryList.data.map((ite) =>
                            countryList?.data.CODE === ite.CODE ? (
                              <option key={ite.CODE} value={ite.CODE}>
                                {ite.DESCRIPTION}
                              </option>
                            ) : (
                              <option key={ite.CODE} value={ite.CODE}>
                                {ite.DESCRIPTION}
                              </option>
                            )
                          )
                          : null} */}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group mx-2">
                      <h6>
                        <span>{t("State Province/City")}</span>
                        <i className="fas fa-star-of-life" />
                      </h6>
                      <select
                        className="form-control custom-select"
                        name="state"
                        onChange={StateChange}
                        id="state"
                        value={deliverintialvalus?.state}
                        disabled={disabled}
                      >
                        <option value="">{t("Select State")}</option>
                        <option>{deliverintialvalus?.state}</option>
                        {/* {StateList?.data !== undefined &&
                          StateList?.data !== null &&
                          StateList?.data !== [] &&
                          StateList?.data.length > 0
                          ? StateList?.data.map((ite) =>


                          
                            StateList?.data?.STATE === ite.STATE ? (
                              <option key={ite.STATE} value={ite.STATE}>
                                {ite.NAME}
                              </option>
                            ) : (
                              <option key={ite.STATE} value={ite.STATE}>
                                {ite.NAME}
                              </option>
                            )
                          )
                          : null} */}
                      </select>
                    </div>
                  </div>
                  <div>
                    <h6>
                      <span>{t("Building Name / House Name")}:</span>
                      <i className="fas fa-star-of-life" />
                    </h6>
                    <input
                      type="text"
                      className="form-control"
                      name="buildingname"
                      value={buildingname}
                      placeholder="Building Name"
                      onChange={inputsHandler}
                      disabled={disabled}
                    />
                  </div>
                  {/* Floor number */}
                  {/* <div>
                    <h6>
                      <span>{t("Floor Number")}:</span>
                    
                    </h6>
                    <input
                      type="text"
                      className="form-control"
                      name="floornumber"
                      value={floornumber}
                      placeholder="Floor Number"
                      onChange={inputsHandler}
                      disabled={disabled}
                    />
                  </div> */}
                  {/* Building NO */}
                  <div>
                    <h6>
                      <span>{t("Building No / House No")}:</span>
                      <i className="fas fa-star-of-life" />
                    </h6>
                    <input
                      type="text"
                      className="form-control"
                      name="buildingno"
                      value={buildingno}
                      placeholder="Building No"
                      onChange={inputsHandler}
                      disabled={disabled}
                    />
                  </div>

                  {/* Address line1 */}
                  <div>
                    <h6>
                      <span>{t("Address Line 1")}:</span>
                      {/* <i className="fas fa-star-of-life" /> */}
                    </h6>
                    <input
                      type="text"
                      className="form-control"
                      name="addressline1"
                      value={addressline1}
                      placeholder="Address Line 1"
                      onChange={inputsHandler}
                      disabled
                      // disable={true}
                      // disabled={disabled}
                      // addressdisable={addressdisable}
                    />
                  </div>
                  {/* Address line2 */}
                  <div>
                    <h6>
                      <span>{t("Address Line 2")}:</span>
                      {/* <i className="fas fa-star-of-life" /> */}
                    </h6>
                    <input
                      type="text"
                      className="form-control"
                      name="addressline2"
                      value={addressline2}
                      disabled
                      placeholder="Address Line 2"
                      onChange={inputsHandler}
                      //disabled={disabled}
                    />
                  </div>
                  {/* Address line3 */}
                  <div>
                    <h6>
                      <span>{t("Address Line 3")}:</span>
                      {/* <i className="fas fa-star-of-life" /> */}
                    </h6>
                    <input
                      type="text"
                      className="form-control"
                      name="addressline3"
                      value={addressline3}
                      placeholder="Address Line 3"
                      disabled
                      onChange={inputsHandler}
                      //disabled={disabled}
                    />
                  </div>
                  {/* Street Address */}

                  <div>
                    <h6>
                      <span>{t("Street Address")}:</span>
                      <i className="fas fa-star-of-life" />
                    </h6>
                    <input
                      type="text"
                      className="form-control"
                      name="street"
                      value={street}
                      placeholder="Street Address"
                      onChange={inputsHandler}
                      disabled={disabled}
                    />
                  </div>
                  <div className="col-md-12">
                    <div className="form-group mx-2">
                      <h6>
                        <span>{t("District")}</span>
                        <i className="fas fa-star-of-life" />
                      </h6>
                      <select
                        className="form-control custom-select"
                        name="district"
                        onChange={DistrictChange}
                        id="district"
                        value={deliverintialvalus?.district}
                        disabled={disabled}
                      >
                        <option value="">{t("Select district")}</option>
                        <option>{deliverintialvalus?.district}</option>
                        {/* {DistrictList?.data !== undefined &&
                          DistrictList?.data !== null &&
                          DistrictList?.data !== [] &&
                          DistrictList?.data.length > 0
                          ? DistrictList?.data.map((ite) =>
                            DistrictList?.data?.PROVINCE === ite.PROVINCE ? (
                              <option key={ite.PROVINCE} value={ite.PROVINCE}>
                                {ite.PROVINCE}
                              </option>
                            ) : (
                              <option key={ite.PROVINCE} value={ite.PROVINCE}>
                                {ite.PROVINCE}
                              </option>
                            )
                          )
                          : null} */}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group mx-2">
                      <h6>
                        <span>{t("Sub District")}</span>
                        <i className="fas fa-star-of-life" />
                      </h6>
                      <select
                        className="form-control custom-select"
                        name="subdistrict"
                        onChange={SubDistrictChange}
                        id="subdistrict"
                        value={deliverintialvalus?.subdistrict}
                        disabled={disabled}
                      >
                        <option value="">{t("Select Sub District")}</option>
                        <option>{deliverintialvalus?.subdistrict}</option>
                        {/* {SubDistrictList?.data !== undefined &&
                          SubDistrictList?.data !== null &&
                          SubDistrictList?.data !== [] &&
                          SubDistrictList?.data.length > 0
                          ? SubDistrictList?.data.map((ite) =>
                            SubDistrictList?.data?.AMPHUR === ite.AMPHUR ? (
                              <option key={ite.AMPHUR} value={ite.AMPHUR}>
                                {ite.AMPHUR}
                              </option>
                            ) : (
                              <option key={ite.AMPHUR} value={ite.AMPHUR}>
                                {ite.AMPHUR}
                              </option>
                            )
                          )
                          : null} */}
                      </select>
                    </div>
                  </div>
                  <div>
                    <h6>
                      <span>{t("Pincode")}:</span>
                      <i className="fas fa-star-of-life" />
                    </h6>
                    <input
                      type="text"
                      className="form-control"
                      name="pincode"
                      value={pcode ? pcode : deliverintialvalus?.pincode}
                      disabled
                      placeholder="Pincode"
                      // onChange={inputsHandler}
                    />
                  </div>
                  <div>
                    <h6>
                      <span>{t("Preferred Time")}</span>
                      <i className="fas fa-star-of-life" />
                    </h6>
                    <MultiSelect
                      options={options}
                      className="multiSelect_dropdown"
                      hasSelectAll={false}
                      disableSearch={true}
                      value={selected_Time}
                      selectSomeItems={"Select Time"}
                      onChange={setSelected_Time}
                      labelledBy="Select"
                      // disabled={disabled}
                    />
                  </div>
                  <div>
                    <h6>
                      <span>{t("Preferred Day of Delivery")}</span>
                      <i className="fas fa-star-of-life" />
                    </h6>
                    <MultiSelect
                      options={day_list}
                      className="multiSelect_dropdown"
                      hasSelectAll={false}
                      disableSearch={true}
                      // disabled={disabled}
                      value={
                      selected_day
                      }
                      
                    //disabled={!selected_day}

                      // value={disabled ? day_list:selected_day}
                      //selectSomeItems={"Select day"}

                      onChange={setselected_day}
                      labelledBy="Select"
                    />
                  </div>
                </div>
                <p className="check__box">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="default__shiping__address"
                    onChange={(e) => shipping(e)}
                  />
                  <label htmlFor="default__shiping__address">
                    {t("Make default shipping address")}
                  </label>
                </p>
                <p className="check__box">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="default__billing__address"
                    onChange={(e) => billing(e)}
                  />
                  <label htmlFor="default__billing__address">
                    {t("Make default billing address")}
                  </label>
                </p>
                <div className="form__button">
                  <button
                    type="button"
                    disabled={!isEnabled}
                    className="deliveryaddress__confirm"
                    onClick={handleSubmit}
                    aria-label="confirmaddress"
                  >
                    {t("Confirm Delivery Location")}
                  </button>
                </div>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default DeliveryAddress;


// ***********multi select************
// import React, { useEffect, useState } from "react";
// import { MultiSelect } from "react-multi-select-component";

// const day_list = [
//   { label: "Sunday", value: "d_sun" },
//   { label: "Monday", value: "d_mon" },
//   { label: "Tuesday", value: "d_tue" },
//   { label: "Wednesday", value: "d_wed" },
//   { label: "Thursday", value: "d_thu" },
//   { label: "Friday", value: "d_fri" },
//   { label: "Saturday", value: "d_sat" }
// ];
// const response = [
//   {
//     id: "2",
//     company_id: "48",
//     branch_name: "Villa-Thonglor",
//     branch_code: "000000",
//     customer_id: "188",
//     seq_of_branch: null,
//     chk_default: "N",
//     latitude: null,
//     longitude: null,
//     tax_id: null,
//     branch_tax: null,
//     d_mon: "Y",
//     d_tue: "Y",
//     d_wed: "Y",
//     d_thu: "Y",
//     d_fri: "Y",
//     d_sat: "Y",
//     d_sun: "N",
//     street: "DEL_STREET",
//     city: "",
//     country: "TH",
//     state: "BK",
//     state_id: null,
//     post_code: "10110",
//     telephone: null,
//     created_at: "2022-03-17 05:37:49",
//     edi_branch_code: "2",
//     contact: "ทับ",
//     mobile: "097-1298291",
//     time_from: "",
//     time_to: "",
//     moo_name: null,
//     moo_no: null,
//     sol: "สุขุมวิท 55 (ทองหล่อ)",
//     province: "กรุงเทพฯ",
//     tumbol: "คลองตันเหนือ",
//     amphur: "วัฒนา",
//     addr_num: "323",
//     address_id: "262",
//     status: "1",
//     preferred_time: "[]",
//     branch_erp: "2",
//     branch_seq: "2",
//     fax: null,
//     state_name: null,
//     address_line1: null,
//     address_line2: null,
//     address_line3: null,
//     country_name: null,
//     amphur_name: null,
//     tumbol_name: null
//   }
// ];
// export default function Example() {
//   const [selectedDays, setSelectedDays] = useState([]);
//   useEffect(() => {
//     const selected = [];
//     day_list.forEach((day) => {
//       if (response[0][day.value] === "Y") {
//         selected.push(day);
//       }
//     });
//     setSelectedDays(selected);
//   }, []);

//   return (
//     <div>
//       <h1>Select Fruits</h1>
//       <pre>{JSON.stringify(selectedDays)}</pre>
//       <MultiSelect
//         options={day_list}
//         value={selectedDays}
//         onChange={setSelectedDays}
//         labelledBy="Select"
//       />
//     </div>
//   );
// }




//********************* */