import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import CartPayment from "../../../components/CartComponents/CartPayment/CartPayment";
import "./PaymentCollection.scss";

function PaymentCollection({ token }) {
  const history = useHistory();
  useEffect(() => {
    if (token === null || "" || undefined) {
      history.push("/login");
    }
  }, [token]);
  return (
    <div>
      <CartPayment paycollectdata={JSON.parse(localStorage.getItem('billinfo'))} />
    </div>
  );
}

export default PaymentCollection;
