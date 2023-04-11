import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./ContentCard.scss";

function ContentCard({ data }) {
  const history = useHistory()
  const [showinvoice, setShowInvoice] = useState(false);
  const openInvoice = () => {
    setShowInvoice(!showinvoice);
  };

  // Currency Format
  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Route to Payment collection page
  const currentBillingInfo = (data) => {
    history.push("/myfinance/paymentcollection");
    localStorage.setItem('billinfo', JSON.stringify(data))
  }

  return (
    <div className="contentcard">
      <div className="card__left">
        <p>
          <span className="label">Billing ID : </span>
          <span
            className={`value ${data?.Overdue === "true" && "overduecolor"}`}
          >
            {data?.BILL_BOOK}{data?.BILL_NO}
          </span>
        </p>
        <p className="contentcard__mob__date">
          <span className="label">Due Date : </span>
          <span className="value date">{data?.DUE_DATE}</span>
        </p>
        <p className="invoicelist">
          <span
            className={`label ${showinvoice && "openlist"}`}
            onClick={openInvoice}
          >
            Invoices ({data?.INVOICES?.length})
          </span>
          <ul className={`hidelist ${showinvoice && "showlist"}`}>
            {data?.INVOICES?.map((inv) => (
              <li>{inv?.INV_BOOK}{inv?.INV_NO}</li>
            ))}
          </ul>
        </p>
      </div>

      <div className="card__right">
        <p>
          <span className="label">Amount :</span>
          <span className="value amount">
            ฿ {formatToCurrency(parseFloat(data?.TOTAL).toFixed(2))}
          </span>
        </p>
        {data?.Overdue === "true" ? (
          <p className="moboverdue">
            {data?.Overdue === "true" && (
              <span className="overdue">Overdue</span>
            )}
            {/* <Link to="/myfinance/paymentcollection"> */}
              <span onClick={() => currentBillingInfo(data)} className="paybill">Pay Bill</span>
            {/* </Link> */}
          </p>
        ) : (
          // <Link to="/myfinance/paymentcollection">
            <p onClick={() => currentBillingInfo(data)} className="paybill">Pay Bill</p>
          // </Link>
        )}
      </div>
    </div>
  );
}

export default ContentCard;
