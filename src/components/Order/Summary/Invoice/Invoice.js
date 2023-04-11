import React, { useState, useEffect } from "react";
import "./invoice.scss";
import pdfimage from "../../../../assets/images/pdf_File.jpg";
import moment from "moment";
const Invoice = ({ detailitems, invoiceitem }) => {

  const [currentinvoice, setcurrentinvoice] = useState(JSON.parse(localStorage.getItem("invoicedetails")));
  const [invoicecommon, setinvoicecommon] = useState(JSON.parse(localStorage.getItem("invoice")));
  const currentinvoice1 = JSON.parse(localStorage.getItem("invoicedetails"));
  const invoicecommon1 = JSON.parse(localStorage.getItem("invoice"));

  const onPrint = () => {
    window.onbeforeprint = function (event) {
      document.getElementById("btn_invoice").classList.remove("btn_invoice");
      document
        .getElementById("btn_invoice")
        .classList.add("btn_invoice_no_display");
    };
    window.onafterprint = function (event) {
      document
        .getElementById("btn_invoice")
        .classList.remove("btn_invoice_no_display");
      document.getElementById("btn_invoice").classList.add("btn_invoice");
    };
    window.print();
  };

  useEffect(() => {
    if(invoiceitem == undefined || detailitems == undefined) return
    if(window.location.pathname == "/myfinance/mobileinvoice" || window.location.pathname == "/myfinance/invoicelist") {
      setinvoicecommon(invoiceitem);
      setcurrentinvoice(detailitems)
    } else {
      setcurrentinvoice(JSON.parse(localStorage.getItem("invoicedetails")));
      setinvoicecommon(JSON.parse(localStorage.getItem("invoice")));
    }
  }, [invoiceitem, detailitems])

  console.log(invoicecommon)

  return (
    <div className="invoice_main_container">
      <img src={pdfimage} alt="" />

      <div className="invoice_first_div_content">
        <div className="customer_code"> {invoicecommon[0]?.CUST_CODE}</div>
        <div className="customer_name">{invoicecommon[0]?.CUST_NAME} </div>
        <div className="invoice_date">
          {" "}
          {moment(invoicecommon[0]?.INV_DATE).format("YYYY-MM-DD")}
        </div>
        <div className="invoice_no">{invoicecommon[0]?.INV_NO}</div>
        <div className="invoice_time">
          {moment(invoicecommon[0]?.INV_DATE).format("h:mm:ss")}
        </div>
        <div className="invoice_delivery"> {invoicecommon[0]?.DELIVERY_TO}</div>
        <div className="invoice_department">{invoicecommon[0]?.DEPARTMENT}</div>
        <div className="customer_po_no">{invoicecommon[0]?.CUST_PO}</div>
        <div className="buyer">buyer</div>
        <div className="invoice_term"> {currentinvoice?.TERM}</div>
        <div className="invoice_due_date">
          {" "}
          {moment(invoicecommon[0]?.DUE_DATE).format("YYYY-MM-DD")}
        </div>
        <div className="invoice_staff_code">{invoicecommon[0]?.STAFF_CODE}</div>
        <div className="invoice_staff_name">
          {" - "}
          {invoicecommon[0]?.STAFF_NAME}
        </div>
        <div className="accountant">Accountant</div>
        <div className="route">Route</div>
      </div>

      <div className="invoice_table_container">
        {currentinvoice?.map((detail, i) => (
          <table class="table">
            <tr className="table_tr">
              <td class="table_sub_1"> {i + 1})</td>
              <td class="table_sub_2">
                {detail?.PRODUCT_SHORT_CODE}
                {" - "}
                {detail?.PRODUCT_NAME}
              </td>

              <td class="table_sub_3">Vat</td>
              <td class="table_sub_4">{detail.WARE_CODE}</td>

              <td class="table_sub_5">{detail.QTY}</td>
              <td class="table_sub_6">
                {detail.RATE % 1 === 0
                  ? `${parseInt(detail.RATE)}.00`
                  : parseFloat(detail.RATE).toFixed(2)}
              </td>
              <td class="table_sub_7">Nml</td>
              <td class="table_sub_8">Extra</td>
              <td class="table_sub_9">
                {detail.SUB_TOTAL % 1 === 0
                  ? `${parseInt(detail.SUB_TOTAL)}.00`
                  : parseFloat(detail.SUB_TOTAL).toFixed(2)}
              </td>
            </tr>
          </table>
        ))}
      </div>
      <div className="total">{currentinvoice?.G_TOTAL}</div>
      <div className="btn_invoice_container">
        <button
          onClick={() => onPrint()}
          className="btn btn_invoice"
          id="btn_invoice"
        >
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="30.000000pt"
            height="30.000000pt"
            viewBox="0 0 30.000000 30.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,30.000000) scale(0.100000,-0.100000)"
              fill="#ffffff"
              stroke="none"
            >
              <path
                d="M60 245 c0 -12 17 -15 90 -15 73 0 90 3 90 15 0 12 -17 15 -90 15
-73 0 -90 -3 -90 -15z"
              />
              <path
                d="M27 204 c-4 -4 -7 -32 -7 -62 0 -45 3 -55 20 -59 13 -3 20 -14 20
-29 0 -24 2 -24 90 -24 88 0 90 0 90 24 0 15 7 26 21 29 18 5 20 12 17 64 l-3
58 -121 3 c-66 1 -123 -1 -127 -4z m193 -104 l0 -50 -70 0 -70 0 0 50 0 50 70
0 70 0 0 -50z"
              />
            </g>
          </svg>
          Print
        </button>
      </div>
    </div>
  );
};

export default Invoice;
