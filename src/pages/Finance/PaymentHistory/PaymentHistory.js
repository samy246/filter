import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./PaymentHistory.scss";
import back from "../../../assets/images/catalog/back.png";
import sort from "../../../assets/images/Finance/sort.png";
import Months from "../../../assets/Json//Months/Months.json";
import { Dropdown } from "react-bootstrap";
import payhistory from "./payhistory.json";
import moment from "moment";
import axios from "axios";
import request from "../../../request";

function PaymentHistory() {
  const [currdata, setCurrData] = useState([]);
  const { t } = useTranslation();
  const history = useHistory();

  const [month, setMonth] = useState({
    label: "All",
    value: "All",
  });

  const  [paydata, setpaydata] = useState([])

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
      const historydata = await axios({
        method: 'get',
        url: `${request?.erppaymenthistory}customerCode=${ccode}&fromDate=${moment(d).format("YYYYMMDD")}&toDate=${moment(new Date()).format("YYYYMMDD")}`
      })
      setpaydata(historydata?.data?.data)
    }
    catch (e) {
      console.log(e)
    }
  }, [])

  const [inputData, setInputData] = useState(false);

  const [payhis, setPayHis] = useState();

  useEffect(() => {
    setPayHis(payhistory?.payhistory);
  }, []);

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    if (payhis?.length === 0) return;
    if (month.value === "All") {
      setCurrData(payhis);
    } else {
      setCurrData([]);
      payhis?.filter((d) => {
        let selectedmonth = moment(d?.duedate).format("MMMM");
        if (selectedmonth === month?.value) {
          setCurrData((prevState) => [...prevState, d]);
        }
      });
    }
  }, [month, payhis]);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <div className="paymenthistory">
      <div className="paymenthistory__back" onClick={() => history.goBack()}>
        <span>
          <img src={back} alt="" />
        </span>
        <h4>{t("My Finance")}</h4>
      </div>

      <h4 className="ph__title">Payment History</h4>

      <div className="ph__header">
        <div className="ph__header__left">
          <h5>Payment History ({paydata?.length})</h5>
          <input />
        </div>
        <div className="ph__header__right">
          <img src={sort} alt="" />
          {window.innerWidth <= 580 && (
            <input
              className={`${inputData && "inputSelected"}`}
              onClick={() => setInputData(!inputData)}
            />
          )}
          <span className={`${inputData && "hideSort"}`}>Filter Month</span>
          <Dropdown className={`${inputData && "hideSort"}`}>
            <Dropdown.Toggle id="dropdown-basic" className="ph__dd">
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
      </div>

      {paydata?.map((ph) => (
        <div className="ph__body">
          <div className="ph__left">
            <p className="payid">
                  <span className="label">Payment ID : </span>
                  <span className="value">{ph?.INVOICES[0]?.REF_BOOK}{ph?.INVOICES[0]?.REF_NO}</span>
            </p>
            <p className="amount__bill">
              <span className="label">
                Amount : ฿ {truncate(formatToCurrency(ph?.SUM_PAYMENT_DETAILS), window.innerWidth > 580 ? 30 : 10)}
              </span>
              <span className="value">
                <strong>Bill to :</strong> {truncate(ph?.INVOICES[0]?.BILL_TO, window.innerWidth > 580 ? 30 : 18)}
              </span>
            </p>
          </div>
          <div className="ph__right">
            <p className="due__pay">
              <span className="label">
                Due Date : <strong>{moment(ph?.INVOICES[0]?.DUE_DATE).format("YYYY-MM-DD")}</strong>
              </span>
              {ph?.overdue == "true" ? (
                <span className="overdue__true">Overdue</span>
              ) : (
                <span className="value">Pay Method : {ph?.PAYTYPE_ID}</span>
              )}
            </p>
            {ph?.STATUS === "Paid" && (
              <p className="paid__button">{ph?.STATUS}</p>
            )}
            {ph?.STATUS === "UnPaid" && (
              <p className="unpaid__button">Pay Bill</p>
            )}
            {ph?.STATUS === "Cancelled" && (
              <p className="cancel__button">{ph?.STATUS}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PaymentHistory;
