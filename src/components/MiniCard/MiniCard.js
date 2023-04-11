import React, { useEffect, useState } from "react";
import "./MiniCard.scss";
import request from "../../request";
import axios from "axios";
import { useStateValue } from "../../store/state";
import { toast } from "react-toastify";
import { Modal } from "react-responsive-modal";
import { injectStyle } from "react-toastify/dist/inject-style";
import { Link } from "react-router-dom";
import { browserName, browserVersion } from "react-device-detect";

if (typeof window !== "undefined") {
  injectStyle();
}
function MiniCard({
  pid,
  sku,
  token,
  setMiniCard,
  name,
  ordertaking,
  stock,
  quty,
  currentunits,
  price,
  options,
  setunitprice,
  unitprice,
  quoteunit,
  specialprice,
  dunit,
}) {
  const [unit, setUnit] = useState(false);
  const [qty, setQty] = useState(1);
  const [cartstatus, setcartstatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [unit0, setunit0] = useState();
  const [unit1, setunit1] = useState();
  const [selectedunit, setselectedunit] = useState();

  useEffect(() => {
    if (options !== undefined) {
      // setunit0(options[0] ? options[0] : defaultunit);
      setunit0(options[0]);
      setunit1(options[1]);
      selectPC(options[0]);
      setselectedunit(options[0]);
    }
  }, [options]);

  const [{}, dispatch] = useStateValue();

  const selectPC = (value) => {
    if (value === undefined) return;
    setUnit(false);
    setunitprice(value.price);
    setselectedunit(value);
  };

  const selectKg = (value) => {
    if (value === undefined) return;
    setUnit(true);
    setunitprice(value.price);
    setselectedunit(value);
  };

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
    if (unitprice === undefined && specialprice === undefined)
      return toast.info(
        "Unit is missing and hence cannot add the product to the cart"
      );
    if (ordertaking === "N" && stock == 0) {
      return toast.info(`${name} is Out of Stock`);
    }
    if (
      (ordertaking === "N" &&
        stock === "1" &&
        parseInt(quty).toFixed(0) >= 1) ||
      ordertaking === "Y"
    ) {
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
              price: specialprice ? specialprice : selectedunit.price,
              extension_attributes: {
                unit: quoteunit ? quoteunit : dunit,
              },
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
    } else {
      return toast.info(`${name} is Out of Stock`);
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

  const ministatus = () => {
    setMiniCard(true);
  };

  return (
    <div className="minicard">
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
      <div className="minicard_container" onClick={() => ministatus()}>
        <div className="minicard__quantity">
          <button
            onClick={subtractQuantity}
            className="miniCard__subtract"
            aria-label="subtractqty"
          ></button>
          <input type="number" value={qty} />
          <button
            onClick={addQuantity}
            className="miniCard__add"
            aria-label="addqty"
          ></button>
        </div>
        <div className="minicard__units">
          {quoteunit ? (
            <p
              onClick={() => selectPC(unit0)}
              className={`${!unit && "minicard__unitSelected"}`}
            >
              {quoteunit}
            </p>
          ) : (
            <>
              <p
                onClick={() => selectPC(unit0)}
                className={`${!unit && "minicard__unitSelected"}`}
              >
                {unit0 ? unit0.title : "KG"}
              </p>
              {unit1 ? (
                <p
                  onClick={() => selectKg(unit1)}
                  className={`${unit && "minicard__unitSelected"}`}
                >
                  {unit1?.title}
                </p>
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </div>
      <div className="minicard__addtocart">
        <button onClick={() => addtocartHandler(qty)} disabled={buttonstatus}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default MiniCard;
