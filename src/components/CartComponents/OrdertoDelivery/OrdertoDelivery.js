import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import AddressTable from "../AddressTable/AddressTable";
import "./OrdertoDelivery.scss";
import AlsoLike from "../../Home/AlsoLike/AlsoLike";
import CartPrograss from "../CartPrograss/CartPrograss";
import SummaryTable from "../OrderList/SummaryTable/SummaryTable";
import OrderTable from "../OrderList/OrderTable/OrderTable";
import { useStateValue } from "../../../store/state";
import { toast } from "react-toastify";
import delivery from "../../../assets/images/cart/delivery.png";
import orderimg from "../../../assets/images/cart/order.png";
import remarks from "../../../assets/images/cart/remark.png";
import { useTranslation } from "react-i18next";
import axios from "axios";
import request from "../../../request";
import Slider from "react-slick";

function OrdertoDelivery() {
  const { t } = useTranslation();
  const [{ cart }, dispatch] = useStateValue();
  const [deliverylocations, setdeliverylocations] = useState([]);
  const [customerpo, setcustomerpo] = useState();
  const [customerremarks, setcustomerremarks] = useState();

  const history = useHistory();
  const [imageIndex, setImageIndex] = useState(0);
  const [allsplit, setallsplit] = useState([]);

  const [addressdata, setaddressdata] = useState([]);
  useEffect(async () => {
    if (localStorage.getItem("userid") === null) return;
    try {
      const address = await axios({
        method: "get",
        url: `${request.getbranch}/${localStorage.getItem("userid")}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      addlist.current = address.data;
      setaddressdata(address.data);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allsplit]);

  const settings = {
    infinite: false,
    dots: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: window.innerWidth > 1300 ? 4 : window.innerWidth > 820 ? 3 : window.innerWidth > 768 ? 3 : window.innerWidth > 300 && 1,
    slidesToShow: window.innerWidth > 1300 ? 4 : window.innerWidth > 820 ? 3 : window.innerWidth > 768 ? 3 : window.innerWidth > 300 && 1,
    initialSlide: 0,
    swipeToSlide: true,
    focusOnSelect: false,
    cssEase: "linear",
    lazyLoad: true,
    beforeChange: (current, next) => setImageIndex(next),
  };

  useEffect(() => {
    let data = [];
    let data1 = [];

    cart?.filter((c) =>
      c?.splitorder.filter((split) => {
        if (
          data?.length < c?.splitorder?.length &&
          split?.item_id === cart[0]?.item_id
        ) {
          data?.push(split.branch_id);
        } else {
          data1.push(split.branch_id);
        }
        if (data && data1.length > 0) {
          const filteredArray = data.filter((value) => data1.includes(value));
          setallsplit(filteredArray);
        }
        if (data && data1.length === 0) {
          setallsplit(data);
        }
      })
    );
    // setallsplit(data);
  }, [cart]);

  const [currentid, setcurrentid] = useState([]);

  useEffect(() => {
    let uniqueChars = [...new Set(allsplit)];
    setcurrentid(uniqueChars);
  }, [allsplit]);

  useEffect(() => {
    if (localStorage.getItem("token") === null || "" || undefined) {
      history.push("/login");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("po", customerpo);
  }, [customerpo]);

  useEffect(() => {
    localStorage.setItem("remarks", customerremarks);
  }, [customerremarks]);

  let previd = [];
  const handleSelectaddress = (id) => {
    let checkid = previd?.some((pid) => pid.id === id);
    if (checkid === true) return;
    const data = addlist.current?.find((list) => list.address_id === id);
    previd.push({ id: id });
    setdeliverylocations((a) => [
      ...a,
      {
        city: data?.city,
        country_name: data?.country_name,
        customer_id: data?.customer_id,
        firstname: data?.firstname,
        id: data?.address_id,
        branch_id: data?.address_id,
        lastname: data?.lastname,
        postalcode: data?.post_code,
        region: data?.state_name,
        region_code: data?.state,
        region_id: data?.state_id,
        street: data?.street,
        telephone: data?.telephone,
        branch: data.branch_name,
        items: [],
      },
    ]);
  };

  const removeaddressHandler = (id) => {
    let temp = addlist.current?.filter((list) => list.address_id !== id);
    setdeliverylocations(temp);
    cart?.filter((c) => {
      c?.splitorder?.filter((cpo) => {
        if (cpo.branch_id === id) {
        }
      });
    });
    // debugger;
    cart?.filter((c) => {
      c?.splitorder?.filter(async (cpo) => {
        if (cpo.branch_id === id) {
          try {
            const cartdata = await axios({
              method: "post",
              url: request.cartupdate,
              data: {
                data: {
                  sku: cpo?.sku,
                  quote_id: localStorage.getItem("cartid"),
                  qty: parseInt(c.qty) - parseInt(cpo?.quantity),
                  customer_id: localStorage.getItem("userid"),
                  item_id: cpo?.item_id,
                },
                splitorder: {
                  company_id: localStorage.getItem("companyid"),
                  customer_id: localStorage.getItem("userid"),
                  branch_id: cpo.branch_id,
                  qty: 0,
                  product_id: cpo?.product_id,
                  item_id: cpo?.item_id,
                  name: cpo?.name,
                  sku: cpo?.sku,
                  delivery_date: cpo?.delivery_date,
                },
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            dispatch({
              type: "CART_STATUS",
              status: cartdata.status,
            });
          } catch (e) {
            console.log(e);
          }
        }
      });
    });
    return;
  };

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(deliverylocations));
  }, [deliverylocations]);

  const addlist = useRef();

  const [orderimage, setorderimage] = useState(null);

  const fileuploaded = (e) => {
    var file = document.querySelector("input[type=file]")["files"];
    setorderimage(file);
  };

  const [b64png, setb64png] = useState([]);
  const [b64pdf, setb64pdf] = useState([]);
  // Convert png image to base64 format
  useEffect(() => {
    setb64pdf([]);
    setb64png([]);
    for (let i in orderimage) {
      if (orderimage[i].type === "image/png") {
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
          setb64png((b64png) => [...b64png, `${result}`]);
        });
      } else if (orderimage[i].type === "application/pdf") {
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
          setb64pdf((b64pdf) => [...b64pdf, `${result}`]);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderimage]);

  useEffect(() => {
    localStorage.setItem("png_b64", b64png);
  }, [b64png]);
  useEffect(() => {
    localStorage.setItem("pdf_b64", b64pdf);
  }, [b64pdf]);

  const [cartitems, setCartitems] = useState([]);

  const clearCart = async () => {
    if (cart?.length === 0) return;
    try {
      const cartclear = await axios({
        method: "delete",
        url: `${request.clearcart}/${localStorage.getItem("cartid")}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch({
        type: "CART_STATUS",
      });
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const LengthHandler = () => {
    return cartitems.length > 0;
  };
  const isEnable = LengthHandler();

  const closeCalendar = () => {
    dispatch({
      type: "CAL__CLOSE",
      cal: false,
    });
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

  return (
    <div className="ordertodelivery" onClick={closeSide}>
      <CartPrograss Delivery={"Delivery"} selected={"selected"} />
      <div className="ordertodelivery__top" onClick={() => closeCalendar()}>
        <span className="ordertodelivery__top__span">
          <img src={delivery} alt="" /> &nbsp;
          <b className="green">{t("Delivery")} </b> {t("To")}&nbsp;
          <Link className="edit__address" to="/myaccount/deliveryaddress">
            ({t("Edit delivery Address")})
          </Link>
        </span>
      </div>
      <div id="address__table" onClick={() => closeCalendar()}>
        <Slider {...settings}>
          {addressdata?.map((data) => (
            <div key={data.id}>
              <AddressTable
                name={data.branch_name}
                telephone={data.mobile}
                contact={data.contact}
                branch={data.lastname}
                address={data.street}
                post_code={data.post_code}
                state={data.state}
                id={data.address_id}
                handleSelectaddress={handleSelectaddress}
                removeaddressHandler={removeaddressHandler}
                defaultaddress={data?.chk_default}
                amphur={data?.amphur}
                moo_name={data?.moo_name}
                sol={data?.sol}
                tumbol={data?.tumbol}
                currentid={currentid}
              />
            </div>
          ))}
        </Slider>
      </div>
      <div>
        <p
          className="fs__14 mb-4"
          style={{ marginTop: "3em" }}
          onClick={() => closeCalendar()}
        >
          <span className="green">
            <img src={orderimg} at="" />{" "}
            <b
              className="order__word"
              style={{ color: "#37bfa7", fontSize: "16px" }}
            >
              {t("Order")}
            </b>
          </span>
          <span>
            {" "}
            {t("Lists")} ({cart ? cart.length : 0} {t("Items")})
          </span>
        </p>
        <div className="orderDelivery__table ">
          <div className="orderDelivery__list p-3 bg-white">
            <OrderTable
              cartdata={cart}
              orderdropdown={"orderdropdown"}
              deliveryTable={"deliveryTable"}
              addresslist={deliverylocations}
              addlist={addlist.current}
              currentid={currentid}
            />
            <div
              className="order_table_buttons"
              onClick={() => closeCalendar()}
            >
              <button
                className="clear_shopping_cart_button"
                type="button"
                // disabled={!isEnable}
                onClick={clearCart}
              >
                {t("Clear shopping Cart")}
              </button>
            </div>
            <div
              className="order__remarks pt-4"
              onClick={() => closeCalendar()}
            >
              <div className="addremark fs__14 ">
                <span>
                  <img src={remarks} alt="" />
                  &nbsp; {t("Add")}{" "}
                  <span style={{ color: "#37bfa7" }}> {t("Remark")}</span>
                </span>
                <div className="mb-3 mt-3">
                  <textarea
                    className="form-control text__area"
                    id="exampleFormControlTextarea1"
                    rows={3}
                    value={customerremarks}
                    onChange={(e) => setcustomerremarks(e.target.value)}
                  />
                </div>
              </div>
              <div className="addcustomerpo fs__14">
                <span>
                  <img src={remarks} /> &nbsp; {t("Add")}{" "}
                  <span style={{ color: "#37bfa7" }}> {t("Customer PO")}</span>
                </span>
                <div className="mb-3 mt-3 input-group">
                  <textarea
                    className="form-control text__area_two"
                    id="exampleFormControlTextarea1"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    rows={3}
                    value={customerpo}
                    maxlength="27"
                    onChange={(e) => setcustomerpo(e.target.value)}
                  />
                  <span
                    className="input-group-text add__image__text__area"
                    id="basic-addon2"
                  >
                    <label>
                      <input
                        type="file"
                        size="60"
                        onChange={fileuploaded}
                        multiple
                        className="fileuploader"
                        accept="image/png, application/pdf"
                      />
                      {orderimage?.length
                        ? `${orderimage.length} files added`
                        : t("Add Images")}
                    </label>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="orderDelivery__summary"
            onClick={() => closeCalendar()}
          >
            <SummaryTable link={"./payment"} addressdata={addressdata} />
          </div>
        </div>
      </div>
      <div className="pb-3">
        <AlsoLike />
      </div>
    </div>
  );
}

export default OrdertoDelivery;
