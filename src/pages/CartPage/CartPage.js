import React, { useState, useEffect } from "react";
import CartPrograss from "../../components/CartComponents/CartPrograss/CartPrograss";
import OrderList from "../../components/CartComponents/OrderList/OrderList";
import SummaryTable from "../../components/CartComponents/OrderList/SummaryTable/SummaryTable";
import "./CartPage.scss";
import { useStateValue } from "../../store/state";

function CartPage() {
  const [{ cart }, dispatch] = useStateValue();
  const [update, setupdate] = useState(false);

  useEffect(() => {
    closeSide();
  }, []);

  const closeSide = () => {
    dispatch({
      type: "SET_MINICART",
      value: false,
    });
    dispatch({
      type: "SET_MINIMENU",
      value: false,
    });
    dispatch({
      type: "SET_NOTIFICATION",
      value: false,
    });
    dispatch({
      type: "SET_LANGUAGE",
    });
    dispatch({
      type: "SEARCHBAR__CLOSEOPEN",
    });
  };

  return (
    <div className="cartpage" onClick={closeSide}>
      <CartPrograss Shoping={"shoping"} />
      <p className="m-0 cartpage__order__list">
        <span className="green">
          <i className="fas fa-box-open" /> &nbsp;
          <b className="order__word">Order</b>
        </span>{" "}
        Lists ({cart ? cart.length : 0} Items)
      </p>
      <hr />
      <div className=" cartpage__div">
        <div className="column_1 ">
          <OrderList setupdate={() => setupdate(!update)} cartdata={cart} />
        </div>
        <div className="column_2">
          <SummaryTable update={update} link={"./cartPage/OrdertoDelivery"} />
        </div>
      </div>
    </div>
  );
}

export default CartPage;
