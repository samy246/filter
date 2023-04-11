import React from "react";
import "./MyFinance.scss";
import CreditInfo from "../../Finance/CreditInfo/CreditInfo";

function MyFinance({ title }) {
  return (
    <div className="myfinance">
      <CreditInfo title={title} />
    </div>
  );
}

export default MyFinance;
