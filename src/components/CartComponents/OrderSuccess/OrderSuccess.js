import axios from "axios";
import React from "react";
import request from "../../../request";
import "./OrderSuccess.scss";

function OrderSuccess() {
  return (
    <div className="ordersuccess">
      <div className="text-center">
        <i className="fas fa-check-circle fa-5x" />
        <h1 className="ordersuccess__heading">Order Sent Successfully.</h1>
        <p>Your order has been Sent Successfully.</p>
      </div>
    </div>
  );
}

export default OrderSuccess;
