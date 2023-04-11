import React, { useState, useRef, useEffect } from "react";
import hexagon from "../../../assets/images/hexagon.svg";
import ContentCard from "./ContentCard/ContentCard";
import billing from "./billinginfo.json";
import "./Dashboard.scss";
import Invoicelist from "./Invoicelist/Invoicelist";
import Paymenthistory from "./Paymenthistory/Paymenthistory";
import PaymentHistory from "../PaymentHistory/PaymentHistory";
import moment from "moment";
import { Dropdown, Overlay, Tooltip } from "react-bootstrap";
import { Calendar } from "react-calendar";
import sort from "../../../assets/images/Finance/sort.png";
import Months from "../../../assets/Json//Months/Months.json";
import { Link } from "react-router-dom";
import InvoiceList from "../InvoiceList/InvoiceList";
import CRPopup from "./CRPopup/CRPopup";
import { toast } from "react-toastify";
import request from "../../../request";
import axios from "axios";
import Spinner from "../../../components/Spinner";

function Dashboard() {
  const [tab, setTab] = useState("ALL");
  const [invtab, setInvTab] = useState("ALL");
  const [month, setMonth] = useState({
    label: "All",
    value: "All",
  });

  const target = useRef(null);
  const target1 = useRef(null);

  const [todate, settodate] = useState(new Date());
  const [todateshow, settodateshow] = useState(false);

  const [fromdate, setfromdate] = useState(new Date());
  const [fromdateshow, setfromdateshow] = useState(false);

  const [dashboardData, setdashboardData] = useState([])

  useEffect(async() => {
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    let ccode;
    userdata?.custom_attributes.find((ca) => {
      if (ca?.attribute_code == "customer_code") {
        ccode = ca?.value;
      }
    });
    try {
      const dashboard = await axios({
        method: 'get',
        url: `${request.erpcustomerinfo}customerCode=${ccode}`,
      })
      setdashboardData(dashboard.data.data[0])
    } catch(e) {
      console.log(e)
    }
  }, []);


  const [invoicecredit,setinvoicecredit] = useState([])
  useEffect(async() => {
    var d = new Date();
    var pastYear = d.getFullYear() - 1;
    d.setFullYear(pastYear);
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    let ccode;
    userdata?.custom_attributes.find((ca) => {
      if (ca?.attribute_code == "customer_code") {
        ccode = ca?.value;
      }
    });
    try {
      const invoicelist = await axios({
        method: 'get',
        url: `${request.erpcustomerinvoice}customerCode=${ccode}&fromDate=${moment(d).format("YYYYMMDD")}&toDate=${moment(new Date()).format("YYYYMMDD")}`
      })
      setinvoicecredit(invoicelist.data.data)
    } catch(e) {
      console.log(e)
    }
  }, [])

  const [billinginfoData, setbillinginfoData] = useState([])

  useEffect(async() => {
    var d = new Date();
    var pastYear = d.getFullYear() - 1;
    d.setFullYear(pastYear);
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    let ccode;
    userdata?.custom_attributes.find((ca) => {
      if (ca?.attribute_code == "customer_code") {
        ccode = ca?.value;
      }
    });
    try {
      const billinginfo = await axios({
        method: 'get',
        url: `${request.erpcustomerbilling}customerCode=${ccode}&fromDate=${moment(d).format("YYYYMMDD")}&toDate=${moment(new Date()).format("YYYYMMDD")}`
      })
      setbillinginfoData(billinginfo.data.data);
    } catch(e) {
      console.log(e)
    }
  }, [])

  const selectToDate = (event) => {
    if (fromdate < event) {
      settodate(event);
    } else {
      toast.info("To Date should not be Previous date then From date");
    }
    settodateshow(false);
  };

  const selectFromDate = (event) => {
    console.log(event)
    if (event < todate) {
      
      setfromdate(event);
    } else {
      toast.info("From Date should not be later date then To date");
    }
    setfromdateshow(false);
  };

  const closeCalendar = () => {
    settodateshow(false);
    setfromdateshow(false);
  };

  const [binfo, setBInfo] = useState([]);
  useEffect(() => {
    if (tab === "ALL") {
      setBInfo(billinginfoData);
    }
    if (tab === "7Days") {
      setBInfo([]);
      billinginfoData?.filter((bi) => {
        if (moment(bi?.DUE_DATE).format("YYYY-MM-DD") > moment(new Date()).format("YYYY-MM-DD")) {
          setBInfo((prevState) => [...prevState, bi]);
        }
      });
    }
    if (tab === "Overdue") {
      setBInfo([]);
      billinginfoData?.filter((bi) => {
        if (moment(bi?.DUE_DATE).format("YYYY-MM-DD") < moment(new Date()).format("YYYY-MM-DD")) {
          setBInfo((prevState) => [...prevState, bi]);
        }
      });
    }
  }, [tab, billinginfoData]);

  const [mobtab, setMobTab] = useState("billinginfo");

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  return (
    <div className="dashboard">
      <h1 className="dashboard__heading">Finance</h1>

      {/* Tab for Desktop UI */}
      {dashboardData?.CUST_NAME ? 
        <div className="dashboard__header">
        {window.innerWidth > 580 ? (
          <>
            <div className="dashboard__top">
              <p>
                <span className="label">Customer Name: </span>
                <span className="value">{dashboardData?.CUST_NAME}</span>
              </p>
              <p>
                <span className="label">Customer ID: </span>
                <span className="value">{dashboardData?.CUST_CODE}</span>
              </p>
              <p className="heximg">
                <img src={hexagon} alt="" />
                <span>B</span>
              </p>
              <CRPopup />
            </div>
            <div className="dashboard__bottom">
              <div className="bottom__left">
                <p>
                  <span className="label">Credit Term</span>
                  <span className="value">
                    {dashboardData?.CREDIT_TERM}
                  </span>
                </p>
                <p>
                  <span className="label">Credit Limit</span>
                  <span className="value">
                    ฿ {formatToCurrency(dashboardData?.CREDIT_LIMIT)}
                  </span>
                </p>
                <div className="coloredflex">
                  <div className="coloredflex__label">
                    <p>
                      <span className="label ">Credit Used</span>
                      <span className="value used">
                        ฿ {formatToCurrency(dashboardData?.TOTAL_CREDIT_USED)}
                      </span>
                    </p>
                    <p>
                      <span className="label ">Credit Balance</span>
                      <span className="value balance">
                        ฿ {formatToCurrency(dashboardData?.CREDIT_LIMIT - dashboardData?.TOTAL_CREDIT_USED)}
                      </span>
                    </p>
                  </div>
                  <div className="coloredflex__value">
                    <div className="progress">
                      <div className="progress" style={{ height: "10px" }}>
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{ width: `${dashboardData?.CREDIT_USAGE_PERCENT}%` }}
                        ></div>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${100 - dashboardData?.CREDIT_USAGE_PERCENT}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="rightBorder"></p>
              <div className="bottom__right">
                <div className="right__oustanding">
                  <p className="label align-middle">Outstanding Balance</p>
                  <p className="value">
                    <span className="color">
                    ฿ {formatToCurrency(dashboardData?.CREDIT_LIMIT - dashboardData?.TOTAL_CREDIT_USED)}
                    </span>
                    <span className="grey">
                      {billing?.billing?.outstandinginvoice} Invoices
                    </span>
                  </p>
                </div>
                <div className="right__7days">
                  <p className="label">Due in 7 Days</p>
                  <p className="value">
                    <span className="color">฿ {dashboardData.INV_DUE_7_DAYS_AMOUNT}</span>
                    <span className="grey">
                      {dashboardData.INV_DUE_7_DAYS_COUNT} Invoices
                    </span>
                  </p>
                </div>
                <div className="right__overdue">
                  <p className="label">Overdue</p>
                  <p className="value">
                    <span className="color">
                      ฿ {formatToCurrency(dashboardData?.OVERDUE)}
                    </span>
                    <span className="grey">
                      {dashboardData?.OVERDUE_INV} Invoices
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            className="accordion accordion-flush p-2"
            id="accordionFlushExample"
          >
            <div className="accordion-item">
              <h2
                className="accordion-header dashboard__header"
                id="flush-headingOne"
              >
                <button
                  className="accordion-button collapsed finance__accordion__button"
                  type="button"
                  data-toggle="collapse"
                  data-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  <span className="label">Customer Name: </span>
                  <span className="value">
                    {dashboardData?.CUST_NAME}
                  </span>
                </button>
              </h2>
              <div
                id="flush-collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="flush-headingOne"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body dashboard__body">
                  <form className="pt-2">
                    <div className="text-center">
                      <p
                        className="discount_button"
                        // data-toggle="collapse"
                        data-target="#flush-collapseOne"
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                      >
                        <div className="top">
                          <p>
                            <span className="label">Customer ID: </span>
                            <span className="value">
                              {dashboardData?.CUST_CODE}
                            </span>
                          </p>
                          <p className="heximg">
                            <img src={hexagon} alt="" />
                            <span>B</span>
                          </p>
                          <p
                            className="CRbutton"
                            onClick={() => console.log("crb")}
                          >
                            Credit Request
                          </p>
                        </div>
                        <div className="bottom__left">
                          <p>
                            <span className="label">Credit Term</span>
                            <span className="value">
                            {dashboardData?.CREDIT_TERM} days
                            </span>
                          </p>
                          <p>
                            <span className="label">Credit Limit</span>
                            <span className="value">
                              ฿{" "}
                              {formatToCurrency(dashboardData?.CREDIT_LIMIT)}
                            </span>
                          </p>
                          <div className="coloredflex">
                            <div className="coloredflex__label">
                              <p>
                                <span className="label ">Credit Used</span>
                                <span className="value used">
                                  ฿{" "}
                                  {formatToCurrency(
                                    dashboardData?.TOTAL_CREDIT_USED
                                  )}
                                </span>
                              </p>
                              <p>
                                <span className="label ">Credit Balance</span>
                                <span className="value balance">
                                  ฿{" "}
                                  {formatToCurrency(
                                    dashboardData?.TOTAL_CREDIT_USED
                                  )}
                                </span>
                              </p>
                            </div>
                            <div className="coloredflex__value">
                              <div className="progress">
                                <div
                                  className="progress"
                                  style={{ height: "10px" }}
                                >
                                  <div
                                    className="progress-bar bg-warning"
                                    role="progressbar"
                                    style={{ width: `${dashboardData?.CREDIT_USAGE_PERCENT}%` }}
                                  ></div>
                                  <div
                                    className="progress-bar bg-success"
                                    role="progressbar"
                                    style={{ width: `${100 - dashboardData?.CREDIT_USAGE_PERCENT}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bottom__right">
                          <div className="right__oustanding">
                            <p className="label align-middle">
                              Outstanding Balance
                            </p>
                            <p className="value">
                              <span className="color">
                                ฿{" "}
                                {formatToCurrency(
                                  billing?.billing?.outstanding
                                )}
                              </span>
                              <span className="grey">
                                {billing?.billing?.outstandinginvoice} Invoices
                              </span>
                            </p>
                          </div>
                          <div className="right__7days">
                            <p className="label">Due in 7 Days</p>
                            <p className="value">
                              <span className="color">
                                ฿ {billing?.billing?.due}
                              </span>
                              <span className="grey">
                                {billing?.billing?.dueinvoice} Invoices
                              </span>
                            </p>
                          </div>
                          <div className="right__overdue">
                            <p className="label">Overdue</p>
                            <p className="value">
                              <span className="color">
                                ฿ {formatToCurrency(dashboardData?.OVERDUE)}
                              </span>
                              <span className="grey">
                                {dashboardData?.OVERDUE_INV} Invoices
                              </span>
                            </p>
                          </div>
                        </div>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      : <Spinner />
      }
      

      {/* Tab for Mobile UI */}
      <div className="mobtab">
        <p
          onClick={() => setMobTab("billinginfo")}
          className={`${mobtab === "billinginfo" && "tabselect"}`}
        >
          Billing Info
        </p>
        <p
          onClick={() => setMobTab("invoices")}
          className={`${mobtab === "invoices" && "tabselect"}`}
        >
          Invoices
        </p>
        <p
          onClick={() => setMobTab("paymenthistory")}
          className={`${mobtab === "paymenthistory" && "tabselect"}`}
        >
          Payment History
        </p>
      </div>

      <div className="dashboard__main">
        {/* Desktop Designs, except Billinginfo Tab, which is both Desktop and Mobile UI */}
        {mobtab === "billinginfo" && (
          <div className={`${window.innerWidth > 580 && "main__left"}`}>
            <div className="main__billinginfo">
              {window.innerWidth > 580 && (
                <div className="billinginfo__header">
                  <h4>Billing Info (7)</h4>
                  <Link to="/myfinance/billinginfo">
                    <p>View all</p>
                  </Link>
                </div>
              )}
              {/* {window.innerWidth <= 580 && ( */}
              <div className="billinginfo__tabs">
                <p
                  className={`${tab === "ALL" && "Selectedtab"}`}
                  onClick={() => setTab("ALL")}
                >
                  All
                </p>
                <p
                  className={`${tab === "7Days" && "Selectedtab"}`}
                  onClick={() => setTab("7Days")}
                >
                  Due in 7 days
                </p>
                <p
                  className={`${tab === "Overdue" && "Selectedtab"}`}
                  onClick={() => setTab("Overdue")}
                >
                  Overdue
                </p>
              </div>
              {/* )} */}

              <div className="billinginfo__content">
                {binfo ? binfo?.map((bi) => (
                  <ContentCard data={bi} />
                )) : <Spinner />}
              </div>
            </div>
          </div>
        )}

        {window.innerWidth > 580 && (
          <div className={`${window.innerWidth > 580 && "main__right"}`}>
            <div className="invoice">
              <div className="invoice__top">
                <h4>Invoices</h4>

                <div className="dateselect">
                  <span>Date</span>
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
                      <Tooltip id="overlay-example" {...props}>
                        <Calendar
                          className="calendar_custom_work"
                          onChange={selectFromDate}
                          value={fromdate}
                        />
                      </Tooltip>
                    )}
                  </Overlay>
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
                      <Tooltip id="overlay-example1" {...props}>
                        <Calendar
                          className="calendar_custom_work"
                          onChange={selectToDate}
                          value={todate}
                        />
                      </Tooltip>
                    )}
                  </Overlay>
                </div>
                <Link to="/myfinance/invoicelist">
                  <p>View all</p>
                </Link>
              </div>
              <div className="invoice__tabs">
                <div className="invoice__header">
                  <p
                    className={`${invtab === "ALL" && "Selectedtab"}`}
                    onClick={() => setInvTab("ALL")}
                  >
                    All
                  </p>
                  <p
                    className={`${invtab === "Invoices" && "Selectedtab"}`}
                    onClick={() => setInvTab("Invoices")}
                  >
                    Invoices
                  </p>
                  <p
                    className={`${invtab === "Credit Note" && "Selectedtab"}`}
                    onClick={() => setInvTab("Credit Note")}
                  >
                    Credit Note
                  </p>
                </div>
                {invoicecredit ? <Invoicelist
                  data={invoicecredit}
                  invtab={invtab}
                  fromdate={fromdate}
                  todate={todate}
                  setfromdate={setfromdate}
                  settodate={settodate}
                /> : <Spinner />}
                
              </div>
            </div>
            <div className="payment">
              <div className="payment__top">
                <h4>Payment History</h4>
                <div className="filter">
                  <img src={sort} alt="" />
                  <span>Filter Month</span>
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                      {month?.label}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          setMonth({
                            label: "All",
                            value: "All",
                          })
                        }
                      >
                        All
                      </Dropdown.Item>
                      {Months?.Months?.map((mon) => (
                        <Dropdown.Item onClick={() => setMonth(mon)}>
                          {mon?.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Link to="/myfinance/paymenthistory">
                  <p>View all</p>
                </Link>
              </div>
              <div className="billinginfo__header">
                <Paymenthistory
                  data={billing?.billing?.paymentinfo}
                  month={month}
                />
              </div>
            </div>
          </div>
        )}
        {/* Desktop Designs */}

        {/* Mobile Designs */}
        {window.innerWidth <= 580 && mobtab === "billinginfo"}
        {window.innerWidth <= 580 && mobtab === "invoices" && (
          <div className="invoice__mobile">
            <div className="invoice__header">
              <p
                className={`${invtab === "ALL" && "Selectedtab"}`}
                onClick={() => setInvTab("ALL")}
              >
                All
              </p>
              <p
                className={`${invtab === "Invoices" && "Selectedtab"}`}
                onClick={() => setInvTab("Invoices")}
              >
                Invoices
              </p>
              <p
                className={`${invtab === "Credit Note" && "Selectedtab"}`}
                onClick={() => setInvTab("Credit Note")}
              >
                Credit Note
              </p>
            </div>
            <InvoiceList
              width="mobile"
              invtab={invtab}
              data={invoicecredit}
            />
          </div>
        )}
        {window.innerWidth <= 580 && mobtab === "paymenthistory" && (
          <PaymentHistory />
        )}
        {/* Mobile Designs */}
      </div>
    </div>
  );
}

export default Dashboard;
