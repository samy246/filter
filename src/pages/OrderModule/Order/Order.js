import React, { useState, useEffect, useRef } from "react";
import "./Order.scss";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../../../store/state";
import axios from "axios";
import request from "../../../request";
import back from "../../../assets/images/catalog/back.png";
import calendar from "../../../assets/images/orderpage/calendar.svg";
import search from "../../../assets/images/orderpage/search.svg";
import Calendar from "react-calendar";
import moment from "moment";
import { Overlay, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/Spinner";

function Order({ token }) {
  const { t } = useTranslation();
  const [orderlist, setorderlist] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (token === null || "" || undefined) {
      history.push("/login");
    }
  }, [token]);
  useEffect(async () => {
    try {
      const orderslist = await axios({
        method: "post",
        url: request.orderslist,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          company_id: localStorage.getItem("companyid"),
        },
      });
      setorderlist(orderslist.data);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const [pendinglist, setpendinglist] = useState([]);
  const [completedlist, setcompletedlist] = useState([]);
  const [datevalue, setdatevalue]= useState([]);

  useEffect(() => {
    orderfilter();
  }, [orderlist]);

  useEffect(() => {
    let max = Math.max(...datevalue);
    let min = Math.min(...datevalue);
    settodate(new Date(max));
    setfromdate(new Date(min));
  }, [datevalue])

  useEffect(() => {
    orderlist.filter(d => {
      setdatevalue(prevState => [
        ...prevState, new Date(d?.order_date).getTime()
      ])
    })
  }, [orderlist])

  const orderfilter = () => {
    orderlist.filter((ol) => {
      if (
        ol.status === "Delivered" &&
        moment(ol?.order_date).format("YYYY-MM-DD") ===
          moment(new Date()).format("YYYY-MM-DD")
      ) {
        setcompletedlist((prevState) => [...prevState, ol]);
      } else if (
        moment(ol?.order_date).format("YYYY-MM-DD") ===
        moment(new Date()).format("YYYY-MM-DD")
      ) {
        setpendinglist((prevState) => [...prevState, ol]);
      }
    });
  };
  const [{}, dispatch] = useStateValue();
  const [tab, settab] = useState("pending");

  useEffect(() => {
    setshowbranches([]);
  }, [tab]);

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
  const [showbranches, setshowbranches] = useState([]);
  const [coid, setcoid] = useState();

  const openbranches = (order_id) => {
    let rowdata;
    if (coid === order_id) {
      setcoid();
      return setshowbranches([]);
    }
    setcoid(order_id);
    if (tab === "pending") {
      rowdata = pendinglist?.find((pl) => pl.order_id === order_id);
    } else {
      rowdata = completedlist?.find((pl) => pl.order_id === order_id);
    }

    if (rowdata?.ship_to?.length > 1) {
      setshowbranches(rowdata);
    } else {
      setshowbranches([]);
    }
  };
  const [currentorder, setcurrentorder] = useState();
  const selectorder = (value) => {
    setcurrentorder(value);
    setshowbranches([]);
    history.push(`/myorder/${value}`);
  };

  const [todate, settodate] = useState();
  const [todateshow, settodateshow] = useState(false);

  const [fromdate, setfromdate] = useState();
  const [fromdateshow, setfromdateshow] = useState(false);

  const target = useRef(null);
  const target1 = useRef(null);

  const [searchoid, setsearchoid] = useState();

  useEffect(() => {
    setsearchoid("");
    setcompletedlist([]);
    setpendinglist([]);
    let to = todate
      ? moment(todate).format("YYYY-MM-DD")
      : moment(new Date()).format("YYYY-MM-DD");
    let from = fromdate
      ? moment(fromdate).format("YYYY-MM-DD")
      : moment(new Date()).format("YYYY-MM-DD");
    if (from != undefined && to != undefined && tab === "pending") {
      orderlist.filter((ol) => {
        if (
          moment(ol?.order_date).format("YYYY-MM-DD") >= from &&
          moment(ol?.order_date).format("YYYY-MM-DD") <= to &&
          ol?.status !== "Delivered"
        ) {
          setpendinglist((prevState) => [...prevState, ol]);
        }
      });
    }

    if (from != undefined && to != undefined && tab === "completed") {
      orderlist.filter((ol) => {
        if (
          moment(ol?.order_date).format("YYYY-MM-DD") >= from &&
          moment(ol?.order_date).format("YYYY-MM-DD") <= to &&
          ol?.status === "Delivered"
        ) {
          setcompletedlist((prevState) => [...prevState, ol]);
        }
      });
    }
  }, [todate, fromdate, tab]);

  const searchOrder = (value) => {
    let oddata = [];
    let opdata = [];
    let to = moment(todate).format("YYYY-MM-DD");
    let from = moment(fromdate).format("YYYY-MM-DD");
    orderlist.filter((ol) => {
      if (
        ol.status === "Delivered" &&
        moment(ol?.order_date).format("YYYY-MM-DD") >= from &&
        moment(ol?.order_date).format("YYYY-MM-DD") <= to
      ) {
        oddata.push(ol);
      } else if (
        moment(ol?.order_date).format("YYYY-MM-DD") >= from &&
        moment(ol?.order_date).format("YYYY-MM-DD") <= to
      ) {
        opdata.push(ol);
      }
    });
    setsearchoid(value);

    if (tab === "pending") {
      setpendinglist([]);
      let findresult = opdata?.find((opd) => opd?.order_id === value);
      let temp = [];
      if (findresult == undefined) {
        opdata?.filter((opd) => {
          if (
            moment(opd?.order_date).format("YYYY-MM-DD") >= from &&
            moment(opd?.order_date).format("YYYY-MM-DD") <= to
          ) {
            setpendinglist((prevState) => [...prevState, opd]);
          }
        });
      } else {
        temp.push(findresult);
        setpendinglist(temp);
      }
    }

    if (tab === "completed") {
      setcompletedlist([]);
      let findresult = oddata?.find((opd) => opd?.order_id === value);
      let temp = [];
      if (findresult == undefined) {
        oddata?.filter((opd) => {
          if (
            moment(opd?.order_date).format("YYYY-MM-DD") >= from &&
            moment(opd?.order_date).format("YYYY-MM-DD") <= to
          ) {
            setcompletedlist((prevState) => [...prevState, opd]);
          }
        });
      } else {
        temp.push(findresult);
        setcompletedlist(temp);
      }
    }
  };

  const selectToDate = (event) => {
    settodate(event);
    settodateshow(false);
  };

  const selectFromDate = (event) => {
    setfromdate(event);
    setfromdateshow(false);
  };

  const closeCalendar = () => {
    settodateshow(false);
    setfromdateshow(false);
  };

  function formatToCurrency(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const [showlist, setshowlist] = useState(false);

  return (
    <div className="order" onClick={closeSide}>
      <div className="order__back">
        <span onClick={() => history.goBack()}>
          <img src={back} alt="" />
        </span>
        <h4>{t("My Order")}</h4>
      </div>

      <div className="order__mobiletopsection mobileonly">
        <p onClick={() => setshowlist(!showlist)}>
          {tab === "pending"
            ? `All Orders (${pendinglist?.length})`
            : `Completed (${completedlist?.length})`}
          {showlist && (
            <ul className="mobile__showlist">
              <li onClick={() => settab("pending")}>All Orders</li>
              <li onClick={() => settab("completed")}>Completed</li>
            </ul>
          )}
        </p>

        <div className="right__orderinput">
          <img src={search} alt="" />
          <input
            placeholder={`${t("Order")}#`}
            onChange={(e) => searchOrder(e.target.value.replace(/[^0-9]/g, ""))}
            value={searchoid}
            type="number"
          />
        </div>
        <div className="right__orderfrom">
          <img src={calendar} alt="" />
          <input
            placeholder="From"
            value={moment(fromdate).format("YYYY-MM-DD")}
            onClick={() => setfromdateshow(!fromdateshow)}
            ref={target1}
          />
          <Overlay
            target={target1.current}
            show={fromdateshow}
            animation={true}
            placement="auto"
            flip={false}
          >
            {(props) => (
              <Tooltip
                id="overlay-example"
                className="order_page_calendar"
                {...props}
              >
                <Calendar
                  className="calendar_custom_work"
                  onChange={selectFromDate}
                  value={fromdate}
                />
              </Tooltip>
            )}
          </Overlay>
        </div>

        <div className="right__orderfrom">
          <img src={calendar} alt="" />
          <input
            placeholder="To"
            value={moment(todate).format("YYYY-MM-DD")}
            onClick={() => settodateshow(!todateshow)}
            ref={target}
          />
          <Overlay
            target={target.current}
            show={todateshow}
            animation={true}
            placement="auto"
            flip={false}
          >
            {(props) => (
              <Tooltip
                id="overlay-example1"
                className="order_page_calendar"
                {...props}
              >
                <Calendar
                  className="calendar_custom_work"
                  onChange={selectToDate}
                  value={todate}
                />
              </Tooltip>
            )}
          </Overlay>
        </div>
      </div>

      <div className="order__topsection" onClick={() => setshowbranches([])}>
        <div className="order__topsection__left">
          <h4>{t("My Orders")}</h4>
        </div>
        <div className="order__topsection__right">
          <div className="right__orderinput">
            <img src={search} alt="" />
            <input
              placeholder={`${t("Order")}#`}
              onChange={(e) =>
                searchOrder(e.target.value.replace(/[^0-9]/g, ""))
              }
              value={searchoid}
              type="number"
            />
          </div>
          {fromdate != "Invalid Date" 
            ? 
            <div className="right__orderfrom">
            <img src={calendar} alt="" />
            <input
              placeholder="From"
              value={moment(fromdate).format("YYYY-MM-DD")}
              onClick={() => setfromdateshow(!fromdateshow)}
              ref={target1}
            />
            <Overlay
              target={target1.current}
              show={fromdateshow}
              animation={true}
              placement="auto"
              flip={false}
            >
              {(props) => (
                <Tooltip
                  id="overlay-example"
                  className="order_page_calendar"
                  {...props}
                >
                  <Calendar
                    className="calendar_custom_work"
                    onChange={selectFromDate}
                    value={fromdate}
                  />
                </Tooltip>
              )}
            </Overlay>
          </div>
          : <Spinner />
          }
          
          {todate != "Invalid Date" ? 
            <div className="right__orderfrom">
              <img src={calendar} alt="" />
              <input
                placeholder="To"
                value={moment(todate).format("YYYY-MM-DD")}
                onClick={() => settodateshow(!todateshow)}
                ref={target}
              />
              <Overlay
                target={target.current}
                show={todateshow}
                animation={true}
                placement="auto"
                flip={false}
              >
                {(props) => (
                  <Tooltip
                    id="overlay-example1"
                    className="order_page_calendar"
                    {...props}
                  >
                    <Calendar
                      className="calendar_custom_work"
                      onChange={selectToDate}
                      value={todate}
                    />
                  </Tooltip>
                )}
              </Overlay>
            </div>
          : <Spinner />
          }
          
        </div>
      </div>

      <div className="order__tab" onClick={() => setshowbranches([])}>
        <p
          onClick={() => settab("pending")}
          className={tab === "pending" && "selected"}
        >
          {t("All Orders")} {tab === "pending" && <>({pendinglist?.length})</>}
        </p>
        <p
          onClick={() => settab("completed")}
          className={tab === "completed" && "selected"}
        >
          {t("Completed")}{" "}
          {tab === "completed" && <>({completedlist?.length})</>}
        </p>
      </div>

      <div className="order__tabledata">
        <div
          className={`order__header ${
            tab === "pending" ? "order__table1" : "order__table2"
          } `}
        >
          <h5>{t("Order ID")}</h5>
          <h5>{t("Order date")}</h5>
          {tab === "completed" && <h5>{t("Delivery Date")}</h5>}
          <h5>{t("Ship To")}</h5>
          <h5>{t("Status")}</h5>
          <h5>{t("Order Total")}</h5>
        </div>
        {tab === "pending"
          ? pendinglist?.map((pl, i) => (
              // <Link to={`/myorder/${pl?.order_id}`}>
              <div
                className={`${
                  tab === "pending" ? "order__table1" : "order__table2"
                } ${currentorder === pl?.order_id && "selectedorder"}`}
              >
                <h5 className="o1" onClick={() => selectorder(pl?.order_id)}>
                  <span className="mobileonly">{t("Order")} #:</span>{" "}
                  {pl?.order_id}
                </h5>
                <h5 className="o2" onClick={() => selectorder(pl?.order_id)}>
                  {moment(pl?.order_date).format("DD/MM/YYYY")}
                </h5>
                <h5 className="o3" onClick={() => openbranches(pl?.order_id)}>
                  <div
                    className={`${pl?.ship_to.length > 1 && "order__branches"}`}
                  >
                    <strong
                      className={`${
                        showbranches?.order_id === pl.order_id &&
                        "order__selectedlist"
                      }`}
                    >
                      {pl?.ship_to.length === 1
                        ? pl?.ship_to[0]
                        : `(${pl?.ship_to.length} Branches)`}
                    </strong>
                    <span
                      className={`${
                        showbranches?.order_id === pl.order_id &&
                        "order__selectedlistarrow"
                      }`}
                    />
                    {showbranches?.order_id === pl.order_id && (
                      <ol>
                        {showbranches.ship_to.map((ship, i) => (
                          <li>
                            {i + 1}. {ship}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </h5>
                <h5
                  className={`o4 ${
                    pl?.status === "Order Confirm" && "confirm"
                  } ${pl?.status === "Pending Delivery" && "pending"}`}
                  onClick={() => selectorder(pl?.order_id)}
                >
                  {pl?.status}
                </h5>
                <h5 className="o5" onClick={() => selectorder(pl?.order_id)}>
                  THB {formatToCurrency(pl?.order_total)}
                </h5>
              </div>
              // </Link>
            ))
          : completedlist?.map((pl) => (
              // <Link to={`/myorder/${pl?.order_id}`}>
              <div
                className={`order__table2 ${
                  currentorder === pl?.order_id && "selectedorder"
                }`}
              >
                <h5 className="o1" onClick={() => selectorder(pl?.order_id)}>
                  <span className="mobileonly">{t("Order")} #:</span>{" "}
                  {pl?.order_id}
                </h5>
                <h5 className="o2" onClick={() => selectorder(pl?.order_id)}>
                  {moment(pl?.order_date).format("DD/MM/YYYY")}
                </h5>
                {tab === "completed" && (
                  <h5 className="o3" onClick={() => selectorder(pl?.order_id)}>
                    {moment(pl?.delivery_date).format("DD/MM/YYYY")}
                  </h5>
                )}
                <h5 className="o4" onClick={() => openbranches(pl?.order_id)}>
                  <div
                    className={`${pl?.ship_to.length > 1 && "order__branches"}`}
                  >
                    <strong
                      className={`${
                        showbranches?.order_id === pl.order_id &&
                        "order__selectedlist"
                      }`}
                    >
                      {pl?.ship_to.length === 1
                        ? pl?.ship_to[0]
                        : `(${pl?.ship_to.length} Branches)`}
                    </strong>
                    <span
                      className={`${
                        showbranches?.order_id === pl.order_id &&
                        "order__selectedlistarrow"
                      }`}
                    />
                    {showbranches?.order_id === pl.order_id && (
                      <ol>
                        {showbranches.ship_to.map((ship, i) => (
                          <li>
                            {i + 1}. {ship}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </h5>
                <h5
                  className="o5"
                  style={{ color: "#37BFA7" }}
                  onClick={() => selectorder(pl?.order_id)}
                >
                  {pl?.status}
                </h5>
                <h5 className="o6" onClick={() => selectorder(pl?.order_id)}>
                  THB {formatToCurrency(pl?.order_total)}
                </h5>
              </div>
              // </Link>
            ))}
      </div>
    </div>
  );
}

export default Order;
