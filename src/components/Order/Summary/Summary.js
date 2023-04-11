import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Summary.scss";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import request from "../../../request";

function Summary({ summarydata }) {
  const history = useHistory();
  const [invoiceitem, setinvoiceitem] = useState([]);
  const [detailitems, setdetailitems] = useState([]);

  let invoiceselection = JSON.parse(localStorage.getItem("selection"));

  const invoice = async () => {
    const invoiceinfo = JSON.parse(localStorage.getItem("invoiceinfo"));
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
      let item = [];
      const invoicedata = await axios({
        method: "get",
        url: `${request.erprequest}/invoice/get-invoice?TRANSACTION_TYPE=${invoiceinfo?.TRANSACTION_TYPE}&INV_BOOK=${invoiceinfo?.INV_BOOK}&INV_NO=${invoiceinfo?.INV_NO}`,
        headers: {
          token: `Bearer ${erptoken.data.data.token}`,
        },
      });
      setinvoiceitem((data) => [...data, invoicedata.data[0]]);
      setdetailitems(invoicedata.data[0]?.details);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };
  useEffect(() => {
    localStorage.setItem("invoice", JSON.stringify(invoiceitem));
    localStorage.setItem("invoicedetails", JSON.stringify(detailitems));
    // history.push("/invoice");
  }, [invoiceitem, detailitems]);

  return (
    <div className="summary">
      <h6>Summary</h6>
      <p className="summary__subtotal">
        <span className="summary__label">Subtotal</span>
        <span className="summary__value">
          {summarydata !== undefined
            ? `฿ ${summarydata?.reduce((item, count) => item + count, 0)}.00`
            : `฿ ${invoiceselection?.ORDER_TOTAL_PRICE}`}
        </span>
      </p>
      <p className="summary__shipping">
        <span className="summary__label">Shipping fee</span>
        <span className="summary__value">฿ 0</span>
      </p>
      <p className="summary__total">
        <span className="summary__label">Total</span>
        <span className="summary__value">
          {summarydata !== undefined
            ? `฿ ${summarydata?.reduce((item, count) => item + count, 0)}.00`
            : `฿ ${invoiceselection?.ORDER_TOTAL_PRICE}`}
        </span>
      </p>
      <p className="summary__buy">Buy Again</p>
      <p className="summary__review">
        <a
          href="/invoice"
          target="_blank"
          rel="noopener noreferrer"
          onClick={invoice}
        >
          Get Invoice
        </a>
      </p>
    </div>
  );
}

export default Summary;
