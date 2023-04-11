import React, { useState, useRef, useEffect } from "react";
import "./Billinginfo.scss";
import back from "../../../assets/images/catalog/back.png";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import sort from "../../../assets/images/Finance/sort.png";
import { Dropdown, Overlay, Tooltip } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import request from "../../../request";
import ContentCard from "../Dashboard/ContentCard/ContentCard";

function Billinginfo() {
  const { t } = useTranslation();
  const history = useHistory();

  const target = useRef(null);
  const target1 = useRef(null);

  const [todate, settodate] = useState();
  const [todateshow, settodateshow] = useState(false);

  const [fromdate, setfromdate] = useState();
  const [fromdateshow, setfromdateshow] = useState(false);
  
  const [binfodata,setbinfodata] = useState([])
  // API for Customer INFO
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
        url: `${request.erpcustomerbilling}customerCode=${ccode}&fromDate=${moment(d).format("YYYYMMDD")}&toDate=${moment(new Date()).format("YYYYMMDD")}`
      })
      setbinfodata(invoicelist.data.data)
    } catch(e) {
      console.log(e)
    }
  }, [])

  const tab = ["ALL", "Due in 7 days", "Overdue"];
  const Months = [
    { label: "Newest to Oldest", value: "Newest to Oldest" },
    { label: "Oldest to Newest", value: "Oldest to Newest" },
  ];

  const [sortData, setSortData] = useState({
    label: "Newest to Oldest",
    value: "Newest to Oldest",
  });

  const selectFromDate = (event) => {
    setfromdate(event);
    setfromdateshow(false);
  };

  const selectToDate = (event) => {
    settodate(event);
    settodateshow(false);
  };

  const [tabData, setTabData] = useState();
  const [currentTab, setCurrentTab] = useState("ALL");

  const selecttab = (value) => {
    setCurrentTab(value);
  };

  // Switch Tab on Billing Info Section
  useEffect(() => {
    if (currentTab === "ALL") {
      setTabData(binfodata);
    }
    if (currentTab === "Due in 7 days") {
      setTabData([]);
      binfodata?.filter((bi) => {
        if (moment(bi?.DUE_DATE).format("YYYY-MM-DD") > moment(new Date()).format("YYYY-MM-DD")) {
          setTabData((prevState) => [...prevState, bi]);
        }
      });
    }
    if (currentTab === "Overdue") {
      setTabData([]);
      binfodata?.filter((bi) => {
        if (moment(bi?.DUE_DATE).format("YYYY-MM-DD") < moment(new Date()).format("YYYY-MM-DD")) {
          setTabData((prevState) => [...prevState, bi]);
        }
      });
    }
  }, [currentTab]);

  useEffect(() => {
    if (currentTab === "ALL") {
      setTabData(binfodata);
    }
  }, [binfodata])


  useEffect(() => {
    if (tabData == undefined) return;
    tabData.reverse();
  }, [sortData]);

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="billinginfo">
      <div className="billinginfo__back" onClick={() => history.goBack()}>
        <span>
          <img src={back} alt="" />
        </span>
        <h4>{t("My Finance")}</h4>
      </div>

      <div className="billinginfo__header">
        <h4>Billing Info - ALL</h4>
      </div>

      <div className="billinginfo__tablehead">
        <div className="tablehead__left">
          <h4>Billing Info (7)</h4>
          <ul>
            {tab?.map((t) => (
              <li
                onClick={() => selecttab(t)}
                className={`tabshead ${currentTab === t && "selectedTab"}`}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="tablehead__right">
          <img src={sort} alt="" />
          {/* <div className="dateselect">
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
          </div> */}

          <div className="sortselect">
            <span>Sort Date</span>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                {sortData?.label}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {Months?.map((mon) => (
                  <Dropdown.Item onClick={() => setSortData(mon)}>
                    {mon?.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      {
        window.innerWidth <= 580 && tabData?.map((tD, i) => <ContentCard data={tD} key={i} />) 
      }
      

      {window.innerWidth > 580 && tabData?.map((b,i) => (
        <div className="billinginfo__tablebody" key={i}>
          <div className="tablebody__left">
            <div className="lefttop">
              <p>
                <span className="label">Billing ID: </span>
                <span className="value ">{b?.INV_BOOK}{b?.INV_NO}</span>
              </p>
              <p>
                <span className="label">Amount: </span>
                <span className="value regular">
                  ฿ {formatToCurrency(b.TOTAL)}
                </span>
              </p>
            </div>
            <div className="leftbottom">
              <p>
                <span className="label">Invoices({b?.INVOICES.length}) </span>
                <span className="value regular">
                  <ul>
                    {b?.INVOICES?.map((inv) => (
                      <li>{inv?.INV_BOOK}{inv?.INV_NO}</li>
                    ))}
                  </ul>
                </span>
              </p>
            </div>
          </div>

          <div className="tablebody__middle">
            <p>
              <span className={`label ${currentTab === "Overdue" && "overdue"}`}>
                Due Date:{" "}
              </span>
              <span className={`value ${currentTab === "Overdue" && "overdue"}`}>
                {b?.DUE_DATE}
              </span>
            </p>
            {currentTab === "Overdue" && (
              <p className="overdue__button">Overdue</p>
            )}
          </div>

          <div className="tablebody__right">
            {b?.status === "Paid" && <p className="paid__button">Paid</p>}
            {b?.status === "Cancelled" && (
              <p className="cancelled__button">Cancelled</p>
            )}
            {b?.status !== "Paid" && b?.status !== "Cancelled" && (
              <p className="paybill__button">Pay Bill</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Billinginfo;
