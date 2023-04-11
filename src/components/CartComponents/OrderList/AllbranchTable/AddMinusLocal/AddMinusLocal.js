import axios from "axios";
import React, { useState, useEffect } from "react";
import "./AddMinusLocal.scss";
import { toast } from "react-toastify";
import request from "../../../../../request";
import moment from "moment";
import { useStateValue } from "../../../../../store/state";

function AddMinusLocal({
  sku,
  quantity,
  item_id,
  date,
  product_id,
  branch_id,
  name,
  totalquantity,
  setqtyspinner,
  qtyspinner
}) {
  const [{}, dispatch] = useStateValue();

  const cartUpdate = async (value) => {
    if (value !== "add" && parseInt(totalquantity) - 1 === 0) {
      return toast.error(
        "Cannot remove the branch, atleast 1 branch must be selected"
      );
    }
    try {
      setqtyspinner(true);
      const cartdata = await axios({
        method: "post",
        url: request.cartupdate,
        data: {
          data: {
            sku: sku,
            qty:
              value === "add"
                ? parseInt(totalquantity) + 1
                : parseInt(totalquantity) - 1,
            quote_id: localStorage.getItem("cartid"),
            item_id: item_id,
            customer_id: localStorage.getItem("userid"),
          },
          splitorder: {
            company_id: localStorage.getItem("companyid"),
            customer_id: localStorage.getItem("userid"),
            branch_id: branch_id,
            product_id: product_id,
            qty:
              value === "add" ? parseInt(quantity) + 1 : parseInt(quantity) - 1,
            item_id: item_id,
            name: name,
            sku: sku,
            delivery_date: date,
          },
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch({
        type: "CART_STATUS",
        status: cartdata,
      });
      setqtyspinner(false);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
      setqtyspinner(false);
    }
  };

  const inputChange = async (event) => {
    if (
      event.target.value === 0 ||
      event.target.value === "0" ||
      event.target.value === NaN ||
      event.target.value === "" ||
      event.target.value === undefined
    )
      return;
    try {
      setqtyspinner(true);
      const cartdata = await axios({
        method: "post",
        url: request.cartupdate,
        data: {
          data: {
            sku: sku,
            qty:
              parseInt(event.target.value) +
              parseInt(totalquantity) -
              parseInt(quantity),
            quote_id: localStorage.getItem("cartid"),
            item_id: item_id,
            customer_id: localStorage.getItem("userid"),
          },
          splitorder: {
            company_id: localStorage.getItem("companyid"),
            customer_id: localStorage.getItem("userid"),
            branch_id: branch_id,
            product_id: product_id,
            qty: event.target.value,
            item_id: item_id,
            name: name,
            sku: sku,
            delivery_date: date,
          },
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch({
        type: "CART_STATUS",
        status: cartdata,
      });
      setqtyspinner(false);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
      setqtyspinner(false);
    }
    // cartUpdate()
  };
  return (
    <div className="addminuslocal">
      <div className="addminuslocal__quantity">
        {!qtyspinner ? (
          <button
            className="addminuslocal__subtract btn"
            onClick={() => cartUpdate("minus")}
            aria-label="minus"
          >
            <i className="fas fa-minus" />
          </button>
        ) : (
          <button
            className="addminuslocal__subtract btn"
            aria-label="minus"
            disabled
          >
            <i className="fas fa-minus" />
          </button>
        )}
        <input
          name="quantity_increase"
          onChange={(e) => inputChange(e)}
          type="text"
          value={parseInt(quantity)}
        />
        {!qtyspinner ? (
          <button
            className="addminuslocal__add btn"
            onClick={() => cartUpdate("add")}
            aria-label="add"
          >
            <i className="fas fa-plus" />
          </button>
        ) : (
          <button
            className="addminuslocal__add btn"
            aria-label="add"
            disabled
          >
            <i className="fas fa-plus" />
          </button>
        )}
      </div>
    </div>
  );
}

export default AddMinusLocal;
