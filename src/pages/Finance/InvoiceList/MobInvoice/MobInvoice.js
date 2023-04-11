import React, { useState, useEffect } from "react";
import "./MobInvoice.scss";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import back from "../../../../assets/images/catalog/back.png";
import { useStateValue } from "../../../../store/state";
import Invoice from "../../../../components/Order/Summary/Invoice/Invoice";
import request from "../../../../request";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

function MobInvoice() {
  const [{ invdata }, dispatch] = useStateValue();
  useEffect(() => {
    if (invdata === "") {
      history.push("/myfinance");
    }
  }, [invdata]);

  const { t } = useTranslation();
  const history = useHistory();

  const [currentTab, setCurrentTab] = useState("Invoice Detail");

  const headings = ["Invoice Detail", "Invoice Image"];

  useEffect(() => {
    if(currentTab == "Invoice Image") {
      showpdf("IN", invdata?.INV_BOOK, invdata?.INV_NO)
    }
  }, [currentTab])

  const [invoiceitem, setinvoiceitem] = useState([]);
  const [detailitems, setdetailitems] = useState([]);
  const showpdf = async (type, book, id) => {
    try {
      const erptoken = await axios({
        method: "post",
        url: request.erplogin,
        data: {
          username: "jagota-iskula-b2b-team",
          password: "JIBT1234!@#$",
        },
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      });
      let item = [];
      const invoicedata = await axios({
        method: "get",
        url: `${
          request.erprequest
        }/invoice/get-invoice?TRANSACTION_TYPE=IN&INV_BOOK=${
          book ? book : "IN65"
        }&INV_NO=${id ? id : "10000003"}`,
        headers: {
          token: `Bearer ${erptoken.data.data.token}`,
        },
      });
      setinvoiceitem((data) => [...data, invoicedata.data[0]]);
      setdetailitems(invoicedata.data[0]?.details);
    } catch (e) {
    console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const [modalData, setModalData] = useState([]);
  const [modalHeader, setmodalHeader] = useState()
  useEffect(async() => {
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    let ccode;
    userdata?.custom_attributes.find((ca) => {
      if (ca?.attribute_code == "customer_code") {
        ccode = ca?.value;
      }
    });
    try {
      const invdetails = await axios({
        method: 'get',
        url: `${request.erpcustomerinvoicedetail}customerCode=${ccode}&transType=IN&transBook=IN65&transNo=6013278`
      })
      setModalData(invdetails.data.data);
    } catch(e) {
      console.log(e)
    }
    // invdata?.find((inv) => {
    //   if (inv?.INV_NO === id) {
    //     setmodalHeader(inv);
    //   }
    // }); 
  } , []);

  return (
    <div className="mobileinvoice">
      <div className="mobileinvoice__back" onClick={() => history.goBack()}>
        <span>
          <img src={back} alt="" />
        </span>
        <h4>{t("Invoice Detail")}</h4>
      </div>

      <div className="mobileinvoice__tabs">
        {headings?.map((h) => (
          <p
            className={`${currentTab === h && "selectedtab"}`}
            key={h}
            onClick={() => setCurrentTab(h)}
          >
            {h}
          </p>
        ))}
      </div>

      {currentTab === "Invoice Detail" && (
        <>
          <div className="mobileinvoice__header">
            <p className="invoiceid">
              <span className="label">{invdata?.INV_BOOK}{invdata?.INV_NO}</span>
              <span className="value">{invdata?.STATUS}</span>
            </p>
            <p className="duedate">
              <span className="label">
                <strong>PO Number : </strong> {invdata?.PO_NUMBER}
              </span>
              <span className="value">
                Due Date : <strong>{moment(invdata?.DUE_DATE).format("YYYY-MM-DD")}</strong>
              </span>
            </p>
            <p className="billto">
              <span className="label">Bill to :</span>
              <span className="value">{invdata?.BILL_TO}</span>
            </p>

            <p className="deliverydate">
              <span className="label">Delivery Date :</span>
              <span className="value">{moment(invdata?.DELIVERY_DATE).format("YYYY-MM-DD")}</span>
            </p>

            <p className="amount">
              <span className="label">Total Amount :</span>
              <span className="value">฿ {invdata?.TOTAL}</span>
            </p>
          </div>
          <div className="mobileinvoice__content">
            <div className="content__border">
              <p>
                Total Products <strong>{modalData?.length}</strong>
              </p>
              <ul>
                {modalData?.map((prd) => (
                  <li>
                    <img src={prd?.PRODUCT_IMAGE} alt="" />
                    <span>X {prd?.QTY}</span>
                    <span className="pname">{prd?.PRODUCT_NAME}</span>
                    <span className="ptotal">฿ {prd?.TOTAL}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mobileinvoice__paybill">
            <p>Pay Bill</p>
          </div>
        </>
      )}

      {currentTab === "Invoice Image" && (
        <div className="mobileinvoice__pdf">
          <Invoice invoiceitem={invoiceitem} detailitems={detailitems}/>
        </div>
      )}
    </div>
  );
}

export default MobInvoice;
