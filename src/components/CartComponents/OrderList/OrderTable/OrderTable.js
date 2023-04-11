import React, { useState, useEffect } from "react";
import Incrementoptions from "../Incrementoptions/Incrementoptions";
import "./OrderTable.scss";
import OrderListDropdown from "../OrderListDropdown/OrderListDropdown";
import axios from "axios";
import request from "../../../../request";
import { useStateValue } from "../../../../store/state";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function OrderTable({
  deliveryTable,
  orderdropdown,
  cartdata,
  addresslist,
  addlist,
  currentid,
  page,
}) {
  const { t } = useTranslation();
  const [cartstatus, setcartstatus] = useState(null);
  const [{ ordercollections, cstatus }, dispatch] = useStateValue();
  const [enableOptions, setEnableOptions] = useState(true);
  const [locspinner, setlocspinner] = useState(false);
  const [spinner] = useState(false);
  const [localorder, setlocalorder] = useState([]);

  const closeCalendar = () => {
    dispatch({
      type: "CAL__CLOSE",
      cal: false,
    });
  };

  useEffect(() => {
    localStorage.setItem("selectedorders", JSON.stringify(localorder));
  }, [ordercollections]);

  const addtowishlist = async (pid) => {
    window.selectedpid = pid;
    const userid = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    try {
      const favPost = await axios({
        method: "post",
        url: request.addWishlist,
        data: {
          customerId: parseInt(userid),
          productId: parseInt(pid),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product added to the Wishlist");
      window.selectedpid = "";
      dispatch({
        type: "TRIGGER_WISHLIST",
        status: true,
      });
    } catch (e) {
      window.selectedpid = "";
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const deletecart = async (itemid, sku) => {
    try {
      setcartstatus("100");
      window.selectedpid = itemid;
      await axios({
        method: "post",
        url: `${request.deletefromcart}/${localStorage.getItem(
          "userid"
        )}/${itemid}/${sku}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setcartstatus(cartdata.status);
      dispatch({
        type: "CART_STATUS",
      });
      window.selectedpid = "";
    } catch (e) {
      window.selectedpid = "";
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const QuantityOptionhandler = (i) => {
    setEnableOptions(i);
  };
  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const [checkedcart, setcheckedcart] = useState([]);
  const [checked, setchecked] = useState(true);

  useEffect(() => {
    // debugger;
    let temp = cartdata?.map((cd) => ({
      ...cd,
      checkedstatus: true,
    }));
    setchecked(true);
    let temp1 = cartdata?.find((cd) => cd.item_selected !== "1");
    if (temp1) {
      setchecked(false);
    }
    setcheckedcart(temp);
    dispatch({
      type: "SET_MEGAMENU_HIDE",
      value: false,
    });
  }, [cartdata]);

  useEffect(() => {
    cartdata?.map((cc) => (cc.checkedstatus = checked));
    dispatch({
      type: "SET_MEGAMENU_HIDE",
      value: false,
    });
  }, [checked, cstatus]);

  const checkboxSelection = (bool) => {
    setlocspinner(true);
    let addid = [];
    let removeid = [];
    if (bool === true) {
      cartdata.map((cd) => addid.push(cd?.item_id));
    } else {
      cartdata.map((cd) => removeid.push(cd?.item_id));
    }
    if (addid.length > 0) {
      addid.filter(async (a) => {
        try {
          await axios({
            method: "post",
            url: request.quoteitemupdate,
            data: {
              cartId: localStorage.getItem("cartid"),
              value: 1,
              itemId: addid,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setchecked(bool);
          setlocspinner(false);
        } catch (e) {
          setlocspinner(false);
          console.log(e);
        }
      });
    }

    if (removeid.length > 0) {
      removeid.filter(async (r) => {
        try {
          await axios({
            method: "post",
            url: request.quoteitemupdate,
            data: {
              cartId: localStorage.getItem("cartid"),
              value: 0,
              itemId: removeid,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setchecked(bool);
          setlocspinner(false);
        } catch (e) {
          setlocspinner(false);
          console.log(e);
        }
      });
    }

    dispatch({
      type: "SET_MEGAMENU_HIDE",
      value: false,
    });
    dispatch({
      type: "CART_STATUS",
    });
  };

  const selectproduct = (status, item_id) => {
    let addid = [];
    let removeid = [];
    setlocspinner(true);
    if (status === true) {
      cartdata.map((cd) => {
        if (cd?.item_selected === "1" && cd?.item_id !== item_id) {
          addid.push(cd?.item_id);
        }
      });
      cartdata.map((cd) => {
        if (cd?.item_id === item_id) {
          addid.push(cd?.item_id);
        }
      });
    } else {
      cartdata.map((cd) => {
        if (cd?.item_selected === "0" && cd?.item_id !== item_id) {
          removeid.push(cd?.item_id);
        }
      });
      cartdata.map((cd) => {
        if (cd?.item_id === item_id) {
          removeid.push(cd?.item_id);
        }
      });
    }

    if (addid.length > 0) {
      addid.filter(async (a) => {
        try {
          await axios({
            method: "post",
            url: request.quoteitemupdate,
            data: {
              cartId: localStorage.getItem("cartid"),
              value: 1,
              itemId: addid,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        } catch (e) {
          console.log(e);
        }
      });
    }

    if (removeid.length > 0) {
      removeid.filter(async (r) => {
        try {
          await axios({
            method: "post",
            url: request.quoteitemupdate,
            data: {
              cartId: localStorage.getItem("cartid"),
              value: 0,
              itemId: removeid,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        } catch (e) {
          console.log(e);
        }
      });
    }

    dispatch({
      type: "SET_MEGAMENU_HIDE",
      value: false,
    });
    dispatch({
      type: "CART_STATUS",
    });
    // if (addid?.length === cartdata?.length) {
    //   setchecked(true);
    // } else {
    //   setchecked(true);
    // }
    setlocspinner(false);
  };

  return (
    <>
      {locspinner ? (
        <div className="incrementoptions__spinner">
          <div className="spinner-grow" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="orderTable test">
          <table className="table">
            <thead onClick={() => closeCalendar()}>
              <tr>
                <th>
                  <input
                    className="form-check-input checkbox__width"
                    type="checkbox"
                    checked={checked}
                    onChange={() => checkboxSelection(!checked)}
                    id="flexCheckDefault"
                  />
                </th>
                <th>{t("Product")}</th>
                <th>{t("Price")}</th>
                <th className="text-center">{t("Quantity")}</th>
                <th className="text-center">{t("Unit")}</th>
                <th>{t("Subtotal")}</th>
              </tr>
            </thead>
            <tbody>
              {checkedcart?.map((data, i) => (
                <>
                  <tr
                    className="table__row"
                    key={i}
                    onClick={() => closeCalendar()}
                  >
                    <td style={{ width: "3%" }}>
                      <input
                        className="form-check-input checkbox__width"
                        type="checkbox"
                        checked={data?.item_selected === "1" ? true : false}
                        onChange={(e) =>
                          selectproduct(e.target.checked, data.item_id)
                        }
                      />
                    </td>
                    {!spinner && window.selectedpid !== data.item_id ? (
                      <>
                        <td colSpan="1">
                          <div className="d-flex table_img_div">
                            <img
                              className="order_img"
                              src={`${request.image}/media/catalog/product/${data.image}`}
                              alt=""
                            />
                            <p className="table__row__name">{data?.name}</p>
                          </div>
                        </td>
                        <td>
                          <p className="price__num" style={{ margin: "0" }}>
                            ฿{" "}
                            {data.price % 1 === 0
                              ? `${formatToCurrency(parseInt(data?.price))}.00`
                              : formatToCurrency(
                                  parseFloat(data.price).toFixed(2)
                                )}
                          </p>
                        </td>
                        {window.innerWidth > 580 &&
                          <td className="text-center">
                            <Incrementoptions
                              quantity={data.qty}
                              sku={data.sku}
                              itemid={data.item_id}
                              enableOptions={enableOptions}
                              index={i}
                              product_id={data.product_id}
                              quoteid={data.quote_id}
                            />
                          </td>
                        }
                        
                        <td>
                          <p>
                            <span>{data.unit}</span>
                          </p>
                        </td>
                        <td>
                          <div className="icon__div">
                            <p>
                              ฿{" "}
                              {(data.price * data.qty) % 1 === 0
                                ? `${formatToCurrency(
                                    data.price * data.qty
                                  )}.00`
                                : formatToCurrency(data.price * data.qty)}
                            </p>
                            <p className="order_icons">
                              <i
                                className="far fa-trash-alt"
                                onClick={() =>
                                  deletecart(data.item_id, data.sku)
                                }
                              />
                            </p>
                          </div>
                        </td>
                      </>
                    ) : (
                      <div className="ordertable__spinner">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    )}
                  </tr>
                  {page === "cartpage" || (
                    <tr>
                      <td colSpan="6">
                        <div className={`${orderdropdown ? "" : "d-none"}`}>
                          <OrderListDropdown
                            deliveryTable={deliveryTable}
                            addresslist={addresslist}
                            quantity={data.qty}
                            sku={data.sku}
                            product_id={data.product_id}
                            price={data.price}
                            name={data.name}
                            item_id={data.item_id}
                            localorder={localorder}
                            setlocalorder={setlocalorder}
                            unit={data.unit}
                            addlist={addlist}
                            splitorder={data.splitorder}
                            currentid={currentid}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default OrderTable;
