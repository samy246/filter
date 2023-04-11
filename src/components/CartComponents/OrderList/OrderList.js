import axios from "axios";
import React, { useState, useEffect } from "react";
import "./OrderList.scss";
import OrderTable from "./OrderTable/OrderTable";
import request from "../../../request";
import { useStateValue } from "../../../store/state";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function OrderList({ deliveryTable, cartdata }) {
  const [cartitems, setCartitems] = useState([]);
  const { t } = useTranslation();
  const [{ cstatus, cart }, dispatch] = useStateValue();

  const clearCart = async () => {
    try {
      const cartclear = await axios({
        method: "delete",
        url: `${request.clearcart}/${localStorage.getItem("cartid")}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch({
        type: "CART_STATUS",
      });
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };
  // useEffect(() => {
  //   async function fetchData() {
  //     if (localStorage.getItem("token") === null) return;
  //     try {
  //       const products = await axios({
  //         method: "get",
  //         url: request.carttotal,
  //         data: {
  //           cartId: localStorage.getItem("cartid"),
  //         },
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });

  //       setCartitems(products.data.items);
  //     } catch (e) {
  //       if (
  //         e.response?.data?.message ===
  //         "The consumer isn't authorized to access %resources."
  //       ) {
  //         localStorage.removeItem("token");
  //         localStorage.removeItem("userid");
  //         localStorage.removeItem("userdata");
  //         localStorage.removeItem("address");
  //         localStorage.removeItem("cartid");
  //         localStorage.removeItem("user");
  //         localStorage.removeItem("companyid");
  //         localStorage.removeItem("companyrolesdata");
  //         localStorage.removeItem("company_role_id");
  //         localStorage.removeItem("company_group_id");
  //         localStorage.removeItem("timer");
  //         window.location.reload();
  //       }
  //     }
  //   }
  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cstatus]);

  const LengthHandler = () => {
    return cartitems.length > 0;
  };
  const isEnable = LengthHandler();

  return (
    <div className="orderlist">
      <div className="orderlist__row">
        <div className="orderlist__col_one bg-white">
          <OrderTable
            deliveryTable={deliveryTable}
            cartdata={cart}
            page="cartpage"
          />
          <div className="order_table_buttons">
            <button
              className="clear_shopping_cart_button"
              type="button"
              // disabled={!isEnable}
              onClick={clearCart}
              aria-label="cartclear"
            >
              {t("Clear shopping Cart")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderList;
