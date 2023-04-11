import axios from "axios";
import moment from "moment/moment";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import request from "../../../../request";
import "./Paymenthistory.scss";

function Paymenthistory({ data, month }) {
  const [currdata, setCurrData] = useState([]);
  const history = useHistory();
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

  useEffect(() => {
    if (data?.length === 0) return;
    if (month.value === "All") {
      setCurrData(data);
    } else {
      setCurrData([]);
      data?.filter((d) => {
        let selectedmonth = moment(d?.date).format("MMMM");
        if (selectedmonth === month?.value) {
          setCurrData((prevState) => [...prevState, d]);
        }
      });
    }
  }, [month, data]);

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <div className="paymenthistory">
      <table class="table table-borderless">
        <thead>
          <tr>
            <th scope="col">Payment ID</th>
            <th scope="col">Date</th>
            <th scope="col">Amount</th>
            <th scope="col">Pay Method</th>
            <th scope="col">Status</th>
            <th scope="col">Invoices No.</th>
          </tr>
        </thead>
        <tbody>
          {paydata?.slice(0, 5).map((inv) => (
            <tr>
              <th>{inv?.INVOICES[0]?.REF_BOOK}{inv?.INVOICES[0]?.REF_NO}</th>
              <th>{moment(inv?.INVOICES[0]?.DUE_DATE).format("YYYY-MM-DD")}</th>
              <th>฿ {formatToCurrency(inv?.SUM_PAYMENT_DETAILS)}</th>
              <th>{inv?.PAYTYPE_ID}</th>
              <th
                className={`${inv?.STATUS === "Paid" && "paidstatus"} ${
                  inv?.STATUS === "UnPaid" && "unpaidstatus"
                } ${inv?.STATUS === "Cancelled" && "canstatus"}`}
              >
                {inv?.STATUS}
              </th>
              <th>{inv?.INVOICES[0]?.REF_BOOK}{inv?.INVOICES[0]?.REF_NO}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Paymenthistory;
