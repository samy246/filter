import React, { useState, useEffect, useMemo } from "react";
import "./MiniCart.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import request from "../../../request";
import { useStateValue } from "../../../store/state";
import { Modal } from "react-responsive-modal";
import { browserName, browserVersion } from "react-device-detect";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function MiniCart() {
  const [{ cstatus, gt, cart }, dispatch] = useStateValue();
  const [allcart, setallcart] = useState([]);
  const [updatecart, setupdatecart] = useState(cstatus);
  const [spinner, setspinner] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentvalue, setcurrentvalue] = useState();
  const { t } = useTranslation();
  const onOpenModal = (itemid, sku) => {
    setcurrentvalue({ itemid: itemid, sku: sku });
    setOpen(true);
  };
  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    fetchcartlist();
  }, []);

  useEffect(() => {
    setupdatecart(cstatus);
  }, [cstatus]);

  useEffect(() => {
    fetchcartlist();
  }, [cstatus, updatecart, gt, localStorage.getItem("userdata")]);

  const [cartsummary, setcartsummary] = useState([]);

  // Cart list API
  const fetchcartlist = async () => {
    // debugger;
    const rolesdata = JSON.parse(localStorage.getItem("companyrolesdata"));
    const userdata = JSON.parse(localStorage.getItem("userdata"));
    let aid = rolesdata?.some(
      (rd) =>
        rd?.name === "Administrator" &&
        rd?.id ===
          userdata?.extension_attributes?.aw_ca_company_user?.company_role_id
    );
    let sid = rolesdata?.some(
      (rd) =>
        rd?.name === "Supervisor" &&
        rd?.id ===
          userdata?.extension_attributes?.aw_ca_company_user?.company_role_id
    );
    let pid = rolesdata?.some(
      (rd) =>
        rd?.name === "Purchaser" &&
        rd?.id ===
          userdata?.extension_attributes?.aw_ca_company_user?.company_role_id
    );
    let rolesid = aid ? 0 : sid ? 1 : pid ? 2 : null;
    let local_user_id = localStorage.getItem("userid");
    let local_company_id = localStorage.getItem("companyid");

    if (rolesid === null) return;
    try {
      // Get Cart Data
      const cartdata = await axios({
        method: "get",
        url: `${request.getcart}/${local_company_id}/${local_user_id}/${rolesid}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setallcart(cartdata?.data[0]?.items);
      setcartsummary(cartdata.data[3]?.summary);
      setupdatecart(false);
      dispatch({
        type: "UPDATE_CART",
        data: cartdata?.data[0]?.items,
      });
      dispatch({
        type: "SELECTED_DATA",
        data: cartdata.data[1]?.product_selected,
      });
      dispatch({
        type: "VAT_DATA",
        data: cartdata.data[2]?.vat_product,
      });
      dispatch({
        type: "SUMMARY_DATA",
        data: cartdata.data[3]?.summary,
      });
      dispatch({
        type: "PRODUCT_COUNT",
        data: cartdata.data[4]?.product_count,
      });
      dispatch({
        type: "CURRENT_ORDER",
        data: cartdata.data[5]?.current_order_id,
      });
      setspinner(false);
    } catch (e) {
      console.log(e);
      // toast.error(e.response?.data?.message);
    }
  };

  // API to delete the item from the cart list
  const deletecartitem = async () => {
    try {
      await axios({
        method: "post",
        url: `${request.deletecartitem}${localStorage.getItem("userid")}/${
          currentvalue.itemid
        }/${currentvalue.sku}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setupdatecart(true);
      onCloseModal();
      createlog();
      dispatch({
        type: "CART_STATUS",
      });
      let tempcart = JSON.parse(localStorage.getItem("orders"));
      let temp = tempcart.filter((cart) =>
        cart.items?.filter((item, i) => {
          if (item.item_id === currentvalue.itemid) {
            cart.items.splice(i, 1);
          }
        })
      );
      localStorage.setItem("orders", JSON.stringify(temp));
      await axios({
        method: "post",
        url: request.splitorderdelete,
        data: {
          data: {
            id: 1,
          },
        },
      });
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const [name, setName] = useState("");
  // API to create a log, if any actions made in the cart list.
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
            } deleted ${name} from the cart`,
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
            } deleted ${name} from the cart`,
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

  // Function form currency format
  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // API call to increase qty of the item in the cart list
  const addqty = async (itemid, quantity, sku, quoteid, product_id) => {
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
        defaultaddress = data;
      }
    });
    let defaultbranch = [];
    cart.filter((c) => {
      if (c.item_id === itemid) {
        c.splitorder.find((spo) => {
          if (spo.branch_id === defaultaddress?.address_id) {
            defaultbranch = spo;
          }
        });
      }
    });
    try {
      setspinner(true);
      window.qtyupdate = itemid;
      const itemupdate = await axios({
        method: "post",
        url: request.cartupdate,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          data: {
            sku: sku,
            qty: Math.round(parseInt(quantity)) + 1,
            quote_id: quoteid,
            item_id: itemid,
            customer_id: localStorage.getItem("userid"),
          },
          splitorder: {
            company_id: localStorage.getItem("companyid"),
            customer_id: localStorage.getItem("userid"),
            branch_id: defaultaddress?.address_id,
            product_id: product_id,
            qty: parseInt(defaultbranch?.quantity) + 1,
            item_id: itemid,
            name: name,
            sku: sku,
            delivery_date: "2022/08/03",
          },
        },
      });
      if (itemupdate?.data[0]?.errors === false) {
        toast.info(itemupdate?.data[0]?.message);
      }
      setupdatecart(true);
      setspinner(false);
      window.qtyupdate = "";
      dispatch({
        type: "CART_STATUS",
      });
    } catch (e) {
      setspinner(false);
      window.qtyupdate = "";
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  // API call to decrease qty of the item in the cart list
  const minusqty = async (itemid, quantity, sku, quoteid, product_id) => {
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
        defaultaddress = data;
      }
    });
    let defaultbranch = [];
    cart.filter((c) => {
      if (c.item_id === itemid) {
        c.splitorder.find((spo) => {
          if (spo.branch_id === defaultaddress?.address_id) {
            defaultbranch = spo;
          }
        });
      }
    });
    try {
      window.qtyupdate = itemid;
      setspinner(true);
      await axios({
        method: "post",
        url: request.cartupdate,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          data: {
            sku: sku,
            qty: Math.round(parseInt(quantity)) - 1,
            // qty: 1,
            quote_id: quoteid,
            item_id: itemid,
            customer_id: localStorage.getItem("userid"),
          },
          splitorder: {
            company_id: localStorage.getItem("companyid"),
            customer_id: localStorage.getItem("userid"),
            branch_id: defaultaddress?.address_id,
            product_id: product_id,
            qty: parseInt(defaultbranch?.quantity) - 1,
            // qty: 1,
            item_id: itemid,
            name: name,
            sku: sku,
            delivery_date: "2022/08/03",
          },
        },
      });
      setupdatecart(true);
      setspinner(false);
      window.qtyupdate = "";
      dispatch({
        type: "CART_STATUS",
      });
    } catch (e) {
      setspinner(false);
      window.qtyupdate = "";
      console.log(e)
      // toast.error(e.response?.data?.message);
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
      type: "SEARCHBAR__CLOSEOPEN",
    });
  };

  // UseMemo - Minicart items
  const miniCartMemo = useMemo(() => {
    return allcart?.map((data) => (
      <>
        <div
          className="minicart__detail"
          key={data?.item_id}
          onMouseEnter={() => setName(data.name)}
        >
          <div className="minicart__image">
            <img
              alt=""
              src={`${request.image}/media/catalog/product/${data.image}`}
            ></img>
          </div>
          <div className="minicart__info">
            <h6>{data.name}</h6>
            <div className="minicart__price">
              <p className="minicart__price__single">
                {data.price % 1 === 0
                  ? `฿ ${formatToCurrency(parseInt(data.price))}.00`
                  : `฿ ${formatToCurrency(
                      parseFloat(data.price).toFixed(2)
                    )}`}{" "}
                / <span>{data.unit}</span>
              </p>
              <p className="minicart__price__total">
                {data.price % 1 === 0
                  ? `฿ ${formatToCurrency(parseInt(data.price * data.qty))}.00`
                  : `฿ ${formatToCurrency(
                      parseFloat(data.price * data.qty).toFixed(2)
                    )}`}
              </p>
            </div>
            <div className="minicart__quantity">
              <div className="minicart__buttons">
                <button
                  className="minicart__subtract"
                  aria-label="cartSubtract"
                  onClick={() =>
                    minusqty(
                      data.item_id,
                      data.qty,
                      data.sku,
                      data.quote_id,
                      data.product_id
                    )
                  }
                >
                  -
                </button>
                {spinner && window.qtyupdate === data?.item_id ? (
                  <div className="minicart__spinner">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <span>{parseInt(data.qty).toFixed(0)}</span>
                  // <input 
                  //   className="cart__inputqty" 
                  //   value={parseInt(data.qty).toFixed(0)}
                  //   type="number"
                  //   onChange={e => updateqty(Math.trunc(e.target.value))}
                  //  />
                )}
                <button
                  className="minicart__addition"
                  aria-label="cartAdd"
                  onClick={() =>
                    addqty(
                      data.item_id,
                      data.qty,
                      data.sku,
                      data.quote_id,
                      data.product_id
                    )
                  }
                >
                  +
                </button>
                <span>{data.unit}</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash"
                viewBox="0 0 16 16"
                // onClick={() => onOpenModal(data.item_id, data.quote_id)}
                onClick={() => onOpenModal(data.item_id, data.sku)}
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path
                  fillRule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                />
              </svg>
            </div>
          </div>
        </div>
      </>
    ));
  }, [allcart]);

  return (
    <div className="minicart">
      <div className="minicart__container">
        <div className="mini__cart__header">
          <div className="minicart__title">
            <i className="fas fa-shopping-cart"></i>{" "}
            <h5>{t("Cart Summary")}({allcart?.length})</h5>
          </div>
          <hr />
        </div>
        <div className="minicart__details">
          {miniCartMemo}
          <Modal open={open} onClose={onCloseModal} classNames={{
          overlay: 'customOverlay',
          modal: 'customModal__minicart',
        }}>
            <h3>
            {t("Are you sure you would like to remove the product from shopping cart")}?
            </h3>
            <div className="minicart__deleteconfirm">
              <p
                className="minicart__deleteconfirm__close"
                onClick={onCloseModal}
              >
                {t("Cancel")}
              </p>
              <p
                className="minicart__deleteconfirm__delete"
                onClick={deletecartitem}
              >
                {t("Delete")}
              </p>
            </div>
          </Modal>
        </div>
      </div>
      <div className="minicart__footer">
        <div className="minicart__summarydetails">
          <p className="minicart__cartButton">
            <span className="cart__summary">{t("Cart Summary")}</span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-up-right-square"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
                />
              </svg>
            </span>
          </p>
          <p>
            <span>{t("Total Quantity")}</span>
            <span>{cartsummary?.totalQty}</span>
          </p>
          <p className="minicart__subtotal">
            <span>{t("Cart Subtotal")}</span>
            <span className="cart__summary__price">
              {cartsummary?.subtotal
                ? cartsummary?.subtotal % 1 === 0
                  ? `฿ ${formatToCurrency(parseInt(cartsummary?.subtotal))}.00`
                  : `฿ ${formatToCurrency(
                      parseFloat(cartsummary?.subtotal)?.toFixed(2)
                    )}`
                : "฿ 0"}
            </span>
          </p>
        </div>
        <div className="minicart__summarybuttons">
          <Link to="/cartPage/OrdertoDelivery" onClick={closeSide}>
            <button className="minicart__checkout">
              {t("Go to Cart")}
              <span>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="angle-right"
                  className="svg-inline--fa fa-angle-right fa-w-8"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 512"
                >
                  <path
                    fill="currentColor"
                    d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"
                  ></path>
                </svg>
              </span>
            </button>
          </Link>
          <button onClick={closeSide} className="minicart__cancel">
            {t("Cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MiniCart;
