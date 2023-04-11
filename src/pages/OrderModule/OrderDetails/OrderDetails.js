import React, { useState, useEffect } from "react";
import "./OrderDetails.scss";
import { Link, useHistory, useParams } from "react-router-dom";
import Remaining from "../../../components/Order/Remaining/Remaining";
import { useStateValue } from "../../../store/state";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import GoogleMapShow from "../GoogleMapShow/GoogleMapShow";
import delivered from "../../../assets/images/MyOrder/statusdelivered.png";
import notdelivered from "../../../assets/images/MyOrder/statusnotdelivered.png";
import out from "../../../assets/images/MyOrder/statusout.png";
import notout from "../../../assets/images/MyOrder/statusnotout.png";
import packed from "../../../assets/images/MyOrder/statuspacked.png";
import notpacked from "../../../assets/images/MyOrder/statusnotpacked.png";
import picked from "../../../assets/images/MyOrder/statuspicked.png";
import notpicked from "../../../assets/images/MyOrder/statusnotpicked.png";
import request from "../../../request";
import database from "../../../firebase";

function OrderDetails({ token }) {
  const history = useHistory();
  const { date, id } = useParams();
  const [{}, dispatch] = useStateValue();

  const [datetype, setdatetype] = useState();

  useEffect(() => {
    const checktype = () => {
      // window.location.reload();
      if (date === "last") {
        setdatetype(0);
      }
      if (date === "today") {
        setdatetype(1);
      }
      if (date === "future") {
        setdatetype(2);
      }
    };
    checktype();
  }, [date]);

  useEffect(() => {
    if (token === null || "" || undefined) {
      history.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const [futuredata, setfuturedata] = useState([]);
  const [orderselected, setorderselected] = useState();
  const [total, settotal] = useState(null);

  useEffect(() => {
    closeSide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      type: "SET_LANGUAGE",
    });
    dispatch({
      type: "SEARCHBAR__CLOSEOPEN",
    });
  };

  const [addressorders, setaddressorders] = useState([]);
  const [currentorder, setcurrentorder] = useState([]);
  const [idlist, setidlist] = useState([]);

  useEffect(() => {
    let iddata = [];
    async function fetchData() {
      if (datetype === undefined) return;
      try {
        const getorderlist = await axios({
          method: "get",
          url: `${request.addressbasedorder}/${id}/${datetype}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        getorderlist?.data?.map(
          (data) => iddata.push(data?.entity_id)
          // setidlist((idlist) => [...idlist, data.entity_id])
        );
        setidlist(iddata);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
  }, [datetype]);

  useEffect(() => {
    fetchlist();
  }, [idlist]);

  const fetchlist = async () => {
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
      {
        idlist?.map(async (id) => {
          const getorderlist = await axios({
            method: "get",
            url: `${request.erprequest}/order/get-delivery-status-with-magento-order?magentoOrderId=${id}`,
            headers: {
              token: `Bearer ${erptoken.data.data.token}`,
            },
          });
          let data1 = [];
          getorderlist.data.data.stockProductOrder?.map((data) =>
            data1.push(data)
          );
          data1?.map((d1) =>
            setcurrentorder((prevState) => [...prevState, d1])
          );
          // if (data1.length) {
          //   setcurrentorder((prevState) => [...prevState, data1[0]]);
          // }
          selectorder(data1[0]?.DOC_NO);
          setorderselected(data1[0]?.DOC_NO);
        });
      }
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const [latLonSet, setLatLonSet] = useState({
    lat: 15.431784870997344,
    lng: 100.85050886721454,
  });

  const [selection, setselection] = useState({});
  useEffect(() => {
    let data = [];
    currentorder?.find((co) => {
      if (orderselected === co?.DOC_NO) {
        setselection(co);
        co?.items?.map((c) => data.push(c));
      }
    });
    setfuturedata(data);
    localStorage.setItem("selection", JSON.stringify(futuredata));
    const subtotal = data.reduce(function (preValue, currentValue) {
      return [...preValue, currentValue.SUB_TOTAL];
    }, []);
    settotal(subtotal.reduce((item, value) => item + value, 0));
  }, [orderselected]);

  useEffect(async () => {
    if (!selection?.haveInvoice) return;
    localStorage.setItem("selection", JSON.stringify(selection));
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
      const orderselected = await axios({
        method: "get",
        url: `${request.erprequest}/order/invoice-number-for-stock-product?docNo=${selection?.DOC_NO}&docBook=${selection?.DOC_BOOK}`,
        headers: {
          token: `Bearer ${erptoken.data.data.token}`,
        },
      });
      localStorage.setItem(
        "invoiceinfo",
        JSON.stringify(orderselected.data.data)
      );
    } catch (e) {
      console.log(e);
    }
  }, [selection]);

  const [itemref, setitemref] = useState();
  const [locationcheck, setlocationcheck] = useState(false);
  useEffect(() => {
    setlocationcheck(false);
    if (selection?.haveInvoice) {
      const mobile = "0931953739";
      const routeCode = "EA31F";
      const date = "20220518";
      const itemRef = `locationTrackingInterval-` + date + mobile + routeCode;
      // console.log("react hook is called", itemRef);
      const collectionRef = database.ref(itemRef);
      collectionRef.limitToLast(1).on("child_added", (snapshot) => {
        const data = snapshot.val();
      });
      collectionRef.once("value", (snapshot) => {
        const data = snapshot.val();
        let key = Object.values(data).sort().pop();
        setLatLonSet({
          lat: key.lat,
          lng: key.long,
        });
        setlocationcheck(true);
      });
    }
  }, [selection, itemref]);

  const [currentlyseleted, setcurrentlyselected] = useState();

  const selectorder = (value) => {
    addressorders.includes((a) => {
      if (a.order_id === value) {
        setcurrentlyselected(a);
      }
    });
  };

  useEffect(() => {
    setcurrentlyselected(addressorders[0]);
  }, [addressorders?.length > 0]);

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="orderdetails" onClick={closeSide}>
      <div className="orderdetails__back">
        <p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
          <span onClick={() => history.goBack()}>Back to previous page</span>
        </p>
      </div>
      <div className="orderdetails__title">
        <h2>{date} Order</h2>
        <p>{futuredata?.street}</p>
        <hr />
      </div>
      <div className="orderdetails__content">
        <div className="orderdetails__remaining">
          {currentorder?.map((ao, i) => (
            <Remaining
              key={i}
              ponumber={ao?.DOC_NO}
              orderno={ao?.DOC_NO}
              total={ao?.ORDER_TOTAL_PRICE}
              selectorder={selectorder}
              oid={ao?.DOC_NO}
              setorderselected={setorderselected}
              status="pending"
              orderselected={orderselected}
            />
          ))}
          {date !== "future" && (
            <div className="orderdetails__future">
              <div className="future__status1">
                <h4>Delivery Status</h4>
                <ul>
                  <li
                    className={`${
                      selection?.invoice?.delivery?.Delivered == "Y" &&
                      "selected"
                    }`}
                  >
                    <img
                      src={
                        selection?.invoice?.delivery?.Delivered == "Y"
                          ? delivered
                          : notdelivered
                      }
                      alt=""
                    />
                    <span
                      className={`${
                        selection?.invoice?.delivery?.Delivered == "Y" &&
                        "selectedspan"
                      }`}
                    >
                      Delivered
                    </span>
                  </li>
                  <li
                    className={`${
                      selection?.invoice?.delivery?.["Out for Delivery"] ==
                        "Y" && "selected"
                    }`}
                  >
                    <img
                      src={
                        selection?.invoice?.delivery?.["Out for Delivery"] ==
                        "Y"
                          ? out
                          : notout
                      }
                      alt=""
                    />
                    <span
                      className={`${
                        selection?.invoice?.delivery?.["Out for Delivery"] ==
                          "Y" && "selectedspan"
                      }`}
                    >
                      Out for Delivery
                    </span>
                  </li>

                  <li
                    className={`${
                      selection?.invoice?.delivery?.["Picked from WH"] == "Y" &&
                      "selected"
                    }`}
                  >
                    <img
                      src={
                        selection?.invoice?.delivery?.["Picked from WH"] == "Y"
                          ? picked
                          : notpicked
                      }
                      alt=""
                    />
                    <span
                      className={`${
                        selection?.invoice?.delivery?.["Picked from WH"] ==
                          "Y" && "selectedspan"
                      }`}
                    >
                      Picked up from WH
                    </span>
                  </li>
                  <li
                    className={`${
                      selection?.invoice?.delivery?.Packed == "Y" && "selected"
                    }`}
                  >
                    <img
                      src={
                        selection?.invoice?.delivery?.Packed == "Y"
                          ? packed
                          : notpacked
                      }
                      alt=""
                    />
                    <span
                      className={`${
                        selection?.invoice?.delivery?.Packed == "Y" &&
                        "selectedspan"
                      }`}
                    >
                      Packed
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        {date === "future1" ? (
          <div className="orderdetails__future">
            <h4>Order Status</h4>
            <div className="future__status">
              <ul>
                <li>Order Placed</li>
                <li>Order Confirmed</li>
                <li>Packed</li>
              </ul>
            </div>
            <div className="future__order">
              <div className="future__heading">
                <h4>Order Number: {currentlyseleted?.order_id}</h4>
                <small>
                  Place on:{" "}
                  {moment(currentlyseleted?.created_at).format(
                    "d MMMM YYYY h:mm:ss"
                  )}
                </small>
                <small>
                  Paid on:{" "}
                  {moment(currentlyseleted?.created_at).format(
                    "d MMMM YYYY h:mm:ss"
                  )}
                </small>
              </div>
              <div className="future__orderStatus">
                <p>Delivered</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="orderdetails__mapData">
            {date === "future" && (
              <div className="orderdetails__future">
                <h4>Order Status</h4>
                <div className="future__status">
                  <ul>
                    <li>Order Placed</li>
                    <li>Order Confirmed</li>
                    <li>Packed</li>
                  </ul>
                </div>
                <div className="future__order">
                  <div className="future__heading">
                    <h4>Order Number: {currentlyseleted?.order_id}</h4>
                    <small>
                      Place on:{" "}
                      {moment(currentlyseleted?.created_at).format(
                        "d MMMM YYYY h:mm:ss"
                      )}
                    </small>
                    <small>
                      Paid on:{" "}
                      {moment(currentlyseleted?.created_at).format(
                        "d MMMM YYYY h:mm:ss"
                      )}
                    </small>
                  </div>
                  <div className="future__orderStatus">
                    <p>Delivered</p>
                  </div>
                </div>
              </div>
            )}
            {date !== "future" && (
              <div style={{ padding: "15px" }}>
                {locationcheck && (
                  <GoogleMapShow latLonSet={latLonSet} selection={selection} />
                )}
              </div>
            )}
            <div className="orderdetails__remainingData">
              <div className="orderdetails__productslist">
                <h6>Products:</h6>
                <ul>
                  {selection?.products?.map((data) => (
                    <li key={data?.PRODUCT_CODE}>{data?.PRODUCT_NAME}</li>
                  ))}
                </ul>
                <div className="orderdetails__orderdata">
                  <p>
                    <span className="status">
                      <strong>Paid</strong>
                    </span>
                  </p>
                </div>
              </div>

              {selection &&
                selection?.products?.map((item) => (
                  <div className="future__details">
                    <>
                      {/* <p>{item.item?.delivery_date}</p> */}
                      <img
                        alt=""
                        src={
                          item.THUMBNAIL
                            ? item.THUMBNAIL
                            : `${request.image}/media/catalog/product${item?.image}`
                        }
                        // src={`${request.image}/media/catalog/product${
                        //   item?.THUMBNAIL ? item?.THUMBNAIL : item?.image
                        // }`}
                      />
                      <div className="future__details_content">
                        <h6>
                          {item.PRODUCT_NAME}
                          {/* <img src={redDot} alt="" /> */}
                        </h6>
                        <strong>
                          {item.RATE % 1 === 0
                            ? `${formatToCurrency(parseInt(item.RATE))}.00`
                            : formatToCurrency(parseFloat(item.RATE))}
                        </strong>
                        <p>Delivery Location</p>
                        <small>{item?.street}</small>
                      </div>
                      <div className="future__details__quantity">
                        {/* {item?.wish === true ? (
                          <p>⭐</p>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-star"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                          </svg>
                        )} */}
                        <p>
                          Quantity: {parseInt(item.QTY)} {item?.UNIT}
                        </p>
                        <h5>
                          Total:{" "}
                          {item.SUB_TOTAL % 1 === 0
                            ? `${formatToCurrency(parseInt(item.SUB_TOTAL))}.00`
                            : formatToCurrency(parseFloat(item.SUB_TOTAL))}
                        </h5>
                      </div>
                    </>
                  </div>
                ))}
              <div className="orderdetails__total">
                <p>
                  <span className="total__label">Total:</span>
                  <span>
                    {selection?.ORDER_TOTAL_PRICE % 1 === 0
                      ? `${formatToCurrency(
                          parseInt(selection?.ORDER_TOTAL_PRICE)
                        )}.00`
                      : formatToCurrency(
                          parseFloat(selection?.ORDER_TOTAL_PRICE)
                        )}
                  </span>
                </p>
                <p>
                  <span className="total__label">Due Date:</span>
                  <span>
                    {moment(selection?.invoice?.DUE_DATE).format("d/MM/YYYY")}
                  </span>
                </p>
              </div>
              <div className="orderdetails__deliverydata">
                <p>
                  <span className="label">Delivered to: </span>
                  <span className="value">
                    {selection?.invoice?.DELIVERY_TO}
                  </span>
                </p>
                <p>
                  <span className="label">Shipping Address: </span>
                  <span className="value">
                    {currentlyseleted?.street} {currentlyseleted?.city}{" "}
                    {currentlyseleted?.postcode}
                  </span>
                </p>
              </div>

              {date !== "future" && (
                <div className="orderdetails__button">
                  {selection?.invoice ? (
                    <Link to={`/myorder/${selection?.DOC_NO}`}>
                      <p>
                        Total Order: {selection && selection?.products?.length}
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-arrow-right-short"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                        />
                      </svg>
                    </Link>
                  ) : (
                    <div>
                      <p>Invoice not Generated</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-arrow-right-short"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
