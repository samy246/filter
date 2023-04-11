import React, { useEffect, useState } from "react";
import "./Remaining.scss";
import colorTruck from "../../../assets/images/MyOrder/truck.svg";
import grayTruck from "../../../assets/images/MyOrder/grayTruck.svg";
import orangetruck from "../../../assets/images/MyOrder/Delivery - out for delivery.png";

function Remaining({
  ponumber,
  orderno,
  total,
  selectorder,
  oid,
  setorderselected,
  status,
  orderselected,
  erp,
  delivery_status_erp,
}) {
  const selectorderdata = () => {
    if (orderno === undefined || oid === undefined) return;
    selectorder(orderno);
    setorderselected(oid);
  };

  const [erpstatus, seterpstatus] = useState();

  useEffect(() => {
    statuscheck();
  }, []);

  const statuscheck = () => {
    if (parseInt(erp) === 0) {
      seterpstatus("Waiting for Confirmation");
    }
    if (parseInt(erp) === 1) {
      seterpstatus("Checking the Order");
    }
    if (parseInt(erp) === 2 && delivery_status_erp === "Y") {
      seterpstatus("New");
    }
    if (parseInt(erp) === 2 && delivery_status_erp === "Z") {
      seterpstatus("Cancelled");
    }
    if (parseInt(erp) === 3) {
      seterpstatus("Invoice Generated");
    }
    if (parseInt(erp) === undefined) {
      seterpstatus(ponumber);
    }
  };

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="remaining" onClick={selectorderdata}>
      <div
        className={`${
          orderselected === orderno
            ? "remaining__flex__selected"
            : "remaining__flex"
        }`}
      >
        <hr />

        <div className="remaining__truckLogo">
          {status === "delivered" && <img alt="" src={colorTruck} />}
          {status === "pending" ||
            (status === "canceled" && <img alt="" src={grayTruck} />)}
          {status === "outfordelivery" && <img alt="" src={orangetruck} />}
          {/* <img alt="" src={status === "pending" && grayTruck} />
          <img alt="" src={status === "canceled" && orangetruck} /> */}
        </div>
        <div className="remaining__text">
          <div className="remaining__content">
            <h4 className="remaining__pending">
              {status === "pending" && "Pending Delivery"}
            </h4>
            <h4 className="remaining__delivered">
              {status === "delivered" && "Delivered"}
            </h4>
            <h4 className="remaining__picked">
              {status === "picked" && "Picked up from WH"}
            </h4>
            <h4 className="remaining__out">
              {status === "out" && "Our for Delivery"}
            </h4>
            <p>
              <span
                className={`${oid !== orderno && "remaining__orderlabel"} ${
                  oid === orderno && "selected__orderlabel"
                }`}
              >
                Order No:{" "}
              </span>
              <span
                className={`${oid !== orderno && "remaining__ordervalue"} ${
                  oid === orderno && "selected__ordervalue"
                }`}
              >
                {orderno}
              </span>
            </p>
            <p>
              <span
                className={`${oid !== orderno && "remaining__polabel"} ${
                  oid === orderno && "selected__polabel"
                }`}
              >
                {erp === "undefined" ? "PO No:" : "Status:"}
              </span>
              <span
                className={`${oid !== orderno && "remaining__povalue"} ${
                  oid === orderno && "selected__povalue"
                }`}
              >
                {erpstatus}
              </span>
            </p>
          </div>
          <div className="remaining__price">
            {status === "pending" && (
              <p className="remaining__pending">
                ฿{" "}
                {total % 1 === 0
                  ? `${formatToCurrency(parseInt(total))}.00`
                  : formatToCurrency(parseFloat(total))}
              </p>
            )}
            {status === "delivered" && (
              <p className="remaining__delivered">
                ฿{" "}
                {total % 1 === 0
                  ? `${parseInt(total)}.00`
                  : parseFloat(total).toFixed(2)}
              </p>
            )}
            {status === "picked" && (
              <p className="remaining__picked">
                ฿{" "}
                {total % 1 === 0
                  ? `${parseInt(total)}.00`
                  : parseFloat(total).toFixed(2)}
              </p>
            )}
            {status === "out" && (
              <p className="remaining__out">฿ {parseInt(total).toFixed(2)}</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-right-short"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Remaining;
