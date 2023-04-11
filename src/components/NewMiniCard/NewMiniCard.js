import React, { useEffect, useState } from "react";
import "./NewMiniCard.scss";
import request from "../../request";
import axios from "axios";
import { useStateValue } from "../../store/state";
import { toast } from "react-toastify";
import { Modal } from "react-responsive-modal";
import { injectStyle } from "react-toastify/dist/inject-style";
import { Link } from "react-router-dom";
import { browserName, browserVersion } from "react-device-detect";
import moment from "moment";
import { useTranslation } from "react-i18next";

if (typeof window !== "undefined") {
  injectStyle();
}
function NewMiniCard({
  pid,
  sku,
  name,
  ordertaking,
  order_taking_end_date,
  price,
  options,
  setunitprice,
  specialprice,
  dunit,
  stock,
  product_status
}) {
  const { t } = useTranslation();
  const [qty, setQty] = useState(1);
  const [cartstatus, setcartstatus] = useState(null);
  const [open, setOpen] = useState(false);

  const [{ cart }, dispatch] = useStateValue();

  const subtractQuantity = () => {
    if (qty === 1) {
      return;
    } else {
      setQty(qty - 1);
    }
  };

  const addQuantity = () => {
    setQty(qty + 1);
  };

  const updateqty = (value) => {
    if(value?.toString()?.length > 4) return
    setQty(value)
  }

  const addtocartHandler = (value) => {
    let ctoken = localStorage.getItem("token");
    if (ctoken === null || ctoken === "" || ctoken === undefined) {
      setOpen(true);
    } else {
      addtocart(value);
    }
  };

  const [buttonstatus, setbuttonstatus] = useState(false);

  // Add to cart (single product)
  const addtocart = async (value) => {
    let addressdata = [];
    try {
      const address = await axios({
        method: "get",
        url: `${request.getbranch}/${localStorage.getItem("userid")}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // addlist.current = address.data;
      addressdata.push(address.data);
    } catch (e) {
    console.log(e)
      // toast.error(e.response?.data?.message);
    }
    let defaultaddress;
    addressdata[0]?.find((data) => {
      if (data?.chk_default == "Y") {
        console.log(data);
        defaultaddress = data;
      }
    });
    const findsku = cart.find((c) => c.sku === sku);
    // return;
    let erp;
    try {
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
      erp = erptoken.data.data.token;
    } catch (e) {
      console.log(e);
    }
    let date;
    try {
      const datechk = await axios({
        method: "get",
        // url: `${request.erprequest}/products/order-period?PRODUCT_CODE=${sku}`,
        url: `${request.erprequest}/products/${sku}/delivery-date`,
        headers: {
          token: `Bearer ${erp}`,
        },
      });
      date = datechk.data.data[0].DELIVER_DATE[0].DD;
    } catch (e) {
      console.log(e);
    }
    if (date) {
      try {
        setbuttonstatus(true);
        const cartdata = await axios({
          method: "post",
          url: request.cartadd,
          data: {
            cartItem: {
              sku: sku,
              quote_id: localStorage.getItem("cartid"),
              qty: qty,
              price: specialprice ? specialprice : price,
              extension_attributes: {
                // unit: quoteunit ? quoteunit : dunit,
                unit: dunit,
              },
            },
            splitorder: {
              company_id: localStorage.getItem("companyid"),
              customer_id: localStorage.getItem("userid"),
              branch_id: defaultaddress?.address_id,
              product_id: pid,
              item_id: findsku?.item_id ? findsku?.item_id : 0,
              name: name,
              sku: sku,
              delivery_date: moment(date).format("YYYY-MM-DD"),
            },
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setcartstatus(cartdata.status);
        if (cartdata.data[0].errors == false) {
          toast.info("The Requested qty is not available");
        }
        if (cartdata.data[0].success) {
          createlog();
          toast.success(`${name} added to the cart Successfully`);
        }
        dispatch({
          type: "CART_STATUS",
          status: cartstatus,
        });
        setbuttonstatus(false);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
        setbuttonstatus(false);
      }
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
            } added ${qty} ${name} in the cart`,
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
            } added ${qty} ${name} in the cart`,
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
  return (
    <>
      {product_status == "1" && <p className="notavail">{t("Out of Stock")}</p>}
      {product_status == "2" && <p className="notavail">{t("Not available")}</p>}
      {product_status == "3" && <div className="newminicard">
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "alertmodal",
          }}
        >
          <div className="login_alertmodal text-center">
            <div>
              <p className="modal__icon">
                <i className="fas text-danger fa-exclamation-triangle" />
              </p>
              <p>Please Login to add the product to cart.</p>
            </div>
            <Link className="modal__login" to="/login">
              Login
            </Link>
          </div>
        </Modal>
        <div className="minicard_container">
          <div className="minicard__quantity">
            <button
              onClick={subtractQuantity}
              className="miniCard__subtract"
              aria-label="subtractqty"
            >
              {/* <i className="fas fa-plus" /> */}
            </button>
            <input 
              type="number" 
              value={qty} 
              disabled
              onChange={e => updateqty(Math.trunc(e.target.value))}
            />
            <button
              onClick={addQuantity}
              className="miniCard__add"
              aria-label="addqty"
            >
              {/* <i className="fas fa-plus" /> */}
              </button>
          </div>
        </div>
        <div className="minicard__addtocart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-cart4"
            viewBox="0 0 16 16"
          >
            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
          </svg>
          <button onClick={() => addtocartHandler(qty)} disabled={buttonstatus}>
            {t("Add")}
          </button>
        </div>
      </div>}
    </>
  )

  // return stock == 0 && ordertaking === "N" ? (
  //   <p className="notavail">{t("Out of Stock")}</p>
  // ) : ordertaking === "N" ||
  //   (ordertaking === "Y" && order_taking_end_date !== "") ? (
  //   <div className="newminicard">
  //     <Modal
  //       open={open}
  //       onClose={() => setOpen(false)}
  //       center
  //       classNames={{
  //         overlay: "customOverlay",
  //         modal: "alertmodal",
  //       }}
  //     >
  //       <div className="login_alertmodal text-center">
  //         <div>
  //           <p className="modal__icon">
  //             <i className="fas text-danger fa-exclamation-triangle" />
  //           </p>
  //           <p>Please Login to add the product to cart.</p>
  //         </div>
  //         <Link className="modal__login" to="/login">
  //           Login
  //         </Link>
  //       </div>
  //     </Modal>
  //     <div className="minicard_container">
  //       <div className="minicard__quantity">
  //         <button
  //           onClick={subtractQuantity}
  //           className="miniCard__subtract"
  //           aria-label="subtractqty"
  //         >
  //           {/* <i className="fas fa-plus" /> */}
  //         </button>
  //         <input 
  //           type="number" 
  //           value={qty} 
  //           disabled
  //           onChange={e => updateqty(Math.trunc(e.target.value))}
  //         />
  //         <button
  //           onClick={addQuantity}
  //           className="miniCard__add"
  //           aria-label="addqty"
  //         >
  //           {/* <i className="fas fa-plus" /> */}
  //           </button>
  //       </div>
  //     </div>
  //     <div className="minicard__addtocart">
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="32"
  //         height="32"
  //         fill="currentColor"
  //         className="bi bi-cart4"
  //         viewBox="0 0 16 16"
  //       >
  //         <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
  //       </svg>
  //       <button onClick={() => addtocartHandler(qty)} disabled={buttonstatus}>
  //         {t("Add")}
  //       </button>
  //     </div>
  //   </div>
  // ) : (
  //   ordertaking === "Y" &&
  //   order_taking_end_date === "" && (
  //     <p className="notavail">{t("Not available")}</p>
  //   )
  // );
}

export default NewMiniCard;
