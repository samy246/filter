import React, { useState, useEffect } from "react";
import "./Incrementoptions.scss";
import { useStateValue } from "../../../../store/state";
import axios from "axios";
import { toast } from "react-toastify";
import request from "../../../../request";

function Incrementoptions({
  quantity,
  sku,
  itemid,
  index,
  enableOptions,
  quoteid,
}) {
  const [qty, setQty] = useState(0);
  const [{}, dispatch] = useStateValue();
  const [cartstatus, setcartstatus] = useState(null);
  const [spinner, setspinner] = useState(false);
  useEffect(() => {
    setQty(quantity);
  }, [quantity]);

  // Trigger to call the cart list api
  useEffect(() => {
    dispatch({
      type: "CART_STATUS",
      status: cartstatus,
    });
  }, [cartstatus]);

  return (
    <div className="incrementoptions orderlist__add__option ">
      {!spinner ? (
        <div className="order__quantity">
          <input
            className="text-center border-0"
            type="text"
            value={Math.round(qty)}
          />
        </div>
      ) : (
        <div className="incrementoptions__spinner">
          <div className="spinner-grow" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Incrementoptions;
