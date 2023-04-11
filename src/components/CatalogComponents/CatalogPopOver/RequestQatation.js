import axios from "axios";
import React, { useState, useEffect } from "react";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import request from "../../../request";
import CatalogSuccessPopUp from "../CatalogSuccessPopUp/CatalogSuccessPopUp";
import "./popover.scss";
import { useTranslation } from "react-i18next";

export const RequestQatation = ({
  show_price,
  pid,
  units,
  status,
  setrefreshpdp,
}) => {
  const { t } = useTranslation();
  const [requestrate, setrequestrate] = useState(0);
  const [requestqty, setrequestqty] = useState(0);
  const [requestunit, setrequestunit] = useState("");
  const [show, setShow] = useState(false);
  const [totalprice, settotalprice] = useState(0);
  const [cunit, setcunit] = useState("Unit");
  const updateqty = (value) => {
    setrequestqty(value);
  };

  useEffect(() => {
    setrequestunit(cunit?.title);
    setrequestrate(cunit?.price);
    settotalprice(parseFloat(requestqty * cunit?.price).toFixed(2));
  }, [cunit, requestqty]);

  const selectunit = (value) => {
    setcunit(value);
  };

  const updateTotal = (value) => {
    setrequestrate(value);
    settotalprice(value * requestqty);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleClose = () => {
    setShow(false);
    // setHidebutton(false);
    setrefreshpdp(true);
  };

  const handleShow = () => setShow(true);

  const newquotation = async () => {
    if (parseInt(totalprice) === 0) {
      return toast.info(
        `${t("Please input quantity and unit before raising Quotation")}`
      );
    }
    if (localStorage.getItem("userid") === null)
      return toast.warning(`${t("Please login before requesting Quotation")}`);
    let customercode = JSON.parse(localStorage.getItem("userdata"));
    await axios({
      method: "post",
      url: request.createquotation,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        data: {
          company_id: localStorage.getItem("companyid"),
          customer_id: localStorage.getItem("userid"),
          customer_code: customercode?.extension_attributes?.customer_code,
          product_id: pid,
          unit: requestunit,
          rate: requestrate,
          quantity: requestqty,
          total: totalprice,
          status: "Waiting for approval",
        },
      },
    });
    handleShow();
  };

  if (status !== "" && status !== undefined) {
    return (
      <div className="reaquest__button_div position-relative">
        <Button
          className="reaquest__button_orange"
          variant="success"
          onClick={show_price}
        >
          {t("Request Quotation")}
        </Button>
        <p className="text-end m-0">{status}</p>
      </div>
    );
  } else {
    return (
      <OverlayTrigger
        trigger="click"
        key="bottom"
        placement="bottom"
        rootClose
        overlay={
          <Popover id={`popover-positioned-bottom`}>
            <form onSubmit={handleSubmit} className="quote__form">
              <Popover.Body>
                <div className="qatation_units d-flex">
                  <label>{t("Quantity")}</label>
                  <div className="d-flex qatation_units_controls ">
                    <input
                      type="number"
                      className="form-control text-center"
                      placeholder="0"
                      min="0"
                      required
                      value={requestqty}
                      onChange={(e) => updateqty(Math.abs(e.target.value))}
                    />
                    <div class="dropdown ">
                      <button
                        class="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {requestunit ? requestunit : "Unit"}
                      </button>
                      <div
                        class="dropdown-menu dropdown-menu-right"
                        aria-labelledby="dropdownMenuButton"
                      >
                        {units?.map((u, i) => (
                          <a
                            class="dropdown-item"
                            onClick={() => selectunit(u)}
                            key={i}
                          >
                            {u?.title}
                          </a>
                        ))}

                      </div>
                    </div>
                  </div>
                </div>
                <div className="popover_price d-flex mt-2">
                  <label className="price__label">{`Price ${cunit?.title != undefined ? "/" : ""} ${
                    cunit?.title != undefined ? cunit?.title : ""
                  }`}</label>
                  <div className="d-flex popover_price ">
                    <input
                      type="number"
                      className="form-control text-end"
                      placeholder="00.00"
                      min="0"
                      value={parseFloat(requestrate)}
                      required
                      onChange={(e) => updateTotal(Math.abs(e.target.value))}
                    />
                  </div>
                </div>
                <div className="popover_price d-flex mt-2">
                  <label className="price__label">Total</label>
                  <div className="d-flex popover_price ">
                    <input
                      type="number"
                      className="form-control text-end"
                      placeholder="00.00"
                      min="0"
                      value={parseFloat(totalprice)}
                      required
                      disabled
                    />
                  </div>
                </div>
              </Popover.Body>
              <Popover.Header className="text_center quote__submit">
                <Button
                  type="submit"
                  className="reaquest__button"
                  variant="success"
                  onClick={newquotation}
                >
                  {t("Send Quotation")}
                </Button>
              </Popover.Header>
            </form>
            <CatalogSuccessPopUp show={show} close={handleClose} />
          </Popover>
        }
      >
        <div className="requestbutton__wrapper">
          <Button className="reaquest__button" variant="success">
            {t("Request Quotation")}
          </Button>
        </div>
      </OverlayTrigger>
    );
  }
};
