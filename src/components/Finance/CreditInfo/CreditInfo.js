import axios from "axios";
import React, { useState, useEffect } from "react";
import request from "../../../request";
import "./CreditInfo.scss";

function CreditInfo({ title }) {
  const [creditinfo, setcreditinfo] = useState();
  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userdata"));
    async function fetchData() {
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
      const creditdetails = await axios({
        method: "get",
        url: `${request.erprequest}/customers/credit-info?CUST_CODE=${userdata?.extension_attributes?.customer_code}`,
        headers: {
          token: `Bearer ${erptoken.data.data.token}`,
        },
      });
      setcreditinfo(creditdetails.data[0]?.CREDIT_INFO[0]);
    }
    fetchData();
  }, []);

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="creditinfo">
      <div className="creditinfo__accInfo">
        {title ? <h4>{title}</h4> : ""}
        <p className="creditinfo__accInfoText">
          <span>Account Info:</span>
        </p>
        <p className="creditinfo__nextPayment">
          <span className="creditinfo__nxtpay">Next Payment:</span>
          <span className="creditinfo__payAmount">
            {/* {creditinfo?.NEXT_PAYMENT} */}
            {creditinfo?.NEXT_PAYMENT % 1 === 0
              ? `${formatToCurrency(parseInt(creditinfo?.NEXT_PAYMENT))}`
              : formatToCurrency(
                  parseFloat(creditinfo?.NEXT_PAYMENT).toFixed(2)
                )}
          </span>
        </p>
      </div>
      <div className="creditinfo__credit">
        <p>
          <span className="creditinfo__creditlabel">Credit used:</span>
          <span className="creditinfo__creditvalue">
            {creditinfo?.TOTAL_CREDIT_USED % 1 === 0
              ? `${formatToCurrency(parseInt(creditinfo?.TOTAL_CREDIT_USED))}`
              : formatToCurrency(
                  parseFloat(creditinfo?.TOTAL_CREDIT_USED).toFixed(2)
                )}
          </span>
        </p>
        <p>
          <span className="creditinfo__creditlabel">Credit Balance:</span>
          <span className="creditinfo__creditvalue">
            {creditinfo?.CREDIT_LIMIT - (creditinfo?.TOTAL_CREDIT_USED % 1) ===
            0
              ? `${formatToCurrency(
                  parseInt(
                    creditinfo?.CREDIT_LIMIT - creditinfo?.TOTAL_CREDIT_USED
                  )
                )}`
              : `${formatToCurrency(
                  parseFloat(
                    creditinfo?.CREDIT_LIMIT - creditinfo?.TOTAL_CREDIT_USED
                  ).toFixed(2)
                )}`}
          </span>
        </p>
        <p>
          <span className="creditinfo__creditlabel">Credit Limit:</span>
          <span className="creditinfo__creditvalue">
            {/* {creditinfo?.CREDIT_LIMIT} */}
            {creditinfo?.TOTAL_CREDIT_USED % 1 === 0
              ? `${formatToCurrency(parseInt(creditinfo?.TOTAL_CREDIT_USED))}`
              : formatToCurrency(
                  parseFloat(creditinfo?.TOTAL_CREDIT_USED).toFixed(2)
                )}
          </span>
        </p>
        <p>
          <span className="creditinfo__creditlabel">Credit used:</span>
          <span className="creditinfo__creditvalue">
            {creditinfo?.CREDIT_USAGE_PERCENT}%
          </span>
        </p>
        <p>
          <span className="creditinfo__creditlabel">Due Date:</span>
          <span className="creditinfo__creditvalue">
            {creditinfo?.NEXT_DUE_DATE
              ? creditinfo?.NEXT_DUE_DATE
              : "25 Dec 2021"}
          </span>
        </p>
        <p>
          <span className="creditinfo__creditlabel">Credit Term:</span>
          <span className="creditinfo__creditvalue">
            {creditinfo?.CREDIT_TERM}
          </span>
        </p>
      </div>
    </div>
  );
}

export default CreditInfo;
