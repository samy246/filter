import React, { useEffect, useRef, useState } from "react";
import "./InvoiceList.scss";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import back from "../../../assets/images/catalog/back.png";
import sort from "../../../assets/images/Finance/sort.png";
import picture from "../../../assets/images/Finance/picture.png";
import { Dropdown, Overlay, Tooltip } from "react-bootstrap";
import { Calendar } from "react-calendar";
import moment from "moment";
import invoice from "./invlist.json";
import { Modal } from "react-responsive-modal";
import { useStateValue } from "../../../store/state";
import { toast } from "react-toastify";
import Invoice from "../../../components/Order/Summary/Invoice/Invoice";
import request from "../../../request";
import axios from "axios";

function InvoiceList({ token, width, invtab, data }) {
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (token === null || "" || undefined) {
      history.push("/login");
    }
  }, [token]);
  const [{}, dispatch] = useStateValue();

  const [open, setOpen] = useState(false);
  const [openInv, setOpenInv] = useState(false);

  const onOpenInvModal = () => setOpenInv(true);
  const onCloseInvModal = () => setOpenInv(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [invData, setInvData] = useState([]);

  const target = useRef(null);
  const target1 = useRef(null);

  const [todate, settodate] = useState(new Date());
  const [todateshow, settodateshow] = useState(false);

  const [fromdate, setfromdate] = useState(new Date());
  const [fromdateshow, setfromdateshow] = useState(false);

  const selectToDate = (event) => {
    if (fromdate < event) {
      settodate(event);
    } else {
      toast.info("To Date should not be Previous date then From date");
    }
    settodateshow(false);
  };

  const selectFromDate = (event) => {
    if (event < todate) {
      setfromdate(event);
    } else {
      toast.info("From Date should not be later date then To date");
    }
    setfromdateshow(false);
  };

  const Months = [
    { label: "Newest to Oldest", value: "Newest to Oldest" },
    { label: "Oldest to Newest", value: "Oldest to Newest" },
  ];

  const [sortData, setSortData] = useState({
    label: "Newest to Oldest",
    value: "Newest to Oldest",
  });

  const [currentInv, setCurrentInv] = useState();

  const selectedInvoice = (value) => {
    setCurrentInv(value);
  };

  const [modalData, setModalData] = useState([]);
  const [modalHeader, setmodalHeader] = useState()
  const showpaybill = async(id) => {
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
      onOpenModal();
      setModalData(invdetails.data.data);
    } catch(e) {
      console.log(e)
    }
    invData?.find((inv) => {
      if (inv?.INV_NO === id) {
        setmodalHeader(inv);
      }
    });
  };


  const [invoicecredit,setinvoicecredit] = useState([])
  useEffect(async() => {
    var d = new Date();
    var pastYear = d.getFullYear() - 1;
    d.setFullYear(pastYear);
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    let ccode;
    userdata?.custom_attributes.find((ca) => {
      if (ca?.attribute_code == "customer_code") {
        ccode = ca?.value;
      }
    });
    try {
      const invoicelist = await axios({
        method: 'get',
        url: `${request.erpcustomerinvoice}customerCode=${ccode}&fromDate=${moment(d).format("YYYYMMDD")}&toDate=${moment(new Date()).format("YYYYMMDD")}`
      })
      setinvoicecredit(invoicelist.data.data)
    } catch(e) {
      console.log(e)
    }
  }, [])

  useEffect(() => {
    setInvData(invoicecredit)
  }, [invoicecredit])

  const [currentsort, setcurrentsort] = useState(false)

  useEffect(() => {
    if(currentsort.label == sortData.label) return;
    setcurrentsort(sortData);
    invData?.reverse();
  }, [sortData])

  const [datevalue, setdatevalue]= useState([]);

  useEffect(() => {
    let max = Math.max(...datevalue);
    let min = Math.min(...datevalue);
    settodate(new Date(max));
    setfromdate(new Date(min));
  }, [datevalue])

  useEffect(() => {
    invoicecredit.filter(d => {
      setdatevalue(prevState => [
        ...prevState, new Date(d?.INV_DATE).getTime()
      ])
    })
  }, [invoicecredit])

  useEffect(() => {
    var from = new Date(fromdate).getTime();
    var to = new Date(todate).getTime();
    setInvData([]);
    invoicecredit?.filter((d) => {
      if (
        new Date(d?.INV_DATE).getTime() >= from &&
        new Date(d?.INV_DATE).getTime() <= to
      ) {
        setInvData((prevState) => [...prevState, d]);
      }
    });
  }, [fromdate, todate]);

  const [showmobinvoice, setShowMobInvoice] = useState();
  const showPayBill = (invdata) => {
    dispatch({
      type: "INV__BILL",
      data: invdata,
    });
    history.push("/myfinance/mobileinvoice");
  };

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
      const invoicedata = await axios({
        method: "get",
        url: `${
          request.erprequest
        }/invoice/get-invoice?TRANSACTION_TYPE=IN&INV_BOOK=${
          book
        }&INV_NO=${id}`,
        headers: {
          token: `Bearer ${erptoken.data.data.token}`,
        },
      });
      setinvoiceitem((data) => [...data, invoicedata.data[0]]);
      setdetailitems(invoicedata.data[0]?.details);
      onOpenInvModal();
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  return (
    <div className={`invoicelists ${width === "mobile" && "formobile"}`}>
      {width !== "mobile" && (
        <>
          <div className="invoicelists__back" onClick={() => history.goBack()}>
            <span>
              <img src={back} alt="" />
            </span>
            <h4>{t("My Finance")}</h4>
          </div>

          <h3 className="il__title">Invoices</h3>
        </>
      )}

      <div className="il__head">
        <div className="il__head__left">
          <p>Invoices ({invoicecredit?.length})</p>
          <input type="search" />
        </div>
        <div className="il__head__right">
          <img src={sort} alt="" />
          <div className="dateselect">
            <span>Date</span>
            <input
              placeholder="From"
              value={moment(fromdate).format("YYYY-MM-DD")}
              onClick={() => setfromdateshow(!fromdateshow)}
              ref={target1}
            />
            <Overlay
              target={target1.current}
              show={fromdateshow}
              animation={true}
              placement="auto"
              flip={false}
            >
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  <Calendar
                    className="calendar_custom_work"
                    onChange={selectFromDate}
                    value={fromdate}
                  />
                </Tooltip>
              )}
            </Overlay>
            <input
              placeholder="To"
              value={moment(todate).format("YYYY-MM-DD")}
              onClick={() => settodateshow(!todateshow)}
              ref={target}
            />
            <Overlay
              target={target.current}
              show={todateshow}
              animation={true}
              placement="auto"
              flip={false}
            >
              {(props) => (
                <Tooltip id="overlay-example1" {...props}>
                  <Calendar
                    className="calendar_custom_work"
                    onChange={selectToDate}
                    value={todate}
                  />
                </Tooltip>
              )}
            </Overlay>
          </div>
          <div className="sortselect">
            <span>Sort Date</span>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                {sortData?.label}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {Months?.map((mon) => (
                  <Dropdown.Item onClick={() => setSortData(mon)}>
                    {mon?.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      {invData?.slice(0, 100)?.map((inv, i) => (
        <div className="il__content__desktop" key={i}>
          <div className="desktop__left">
            <p>{inv?.INV_BOOK}{inv?.INV_NO}</p>
            <p>
              <span className="label">Amount: </span>
              <span className="value">฿ {inv?.TOTAL}</span>
            </p>
            <p>
              <img
                src={picture}
                alt=""
                style={{ width: "16px", objectFit: "contain" }}
                onClick={() =>
                  showpdf("IN", inv?.INV_BOOK, inv?.INV_NO)
                }
              />
            </p>
            <Modal open={openInv} onClose={onCloseInvModal} center>
              <Invoice invoiceitem={invoiceitem} detailitems={detailitems}/>
            </Modal>
            <p>
              <span className="label">Bill to: </span>
              <span className="value">{inv?.BILL_TO}</span>
            </p>
          </div>
          <div className="desktop__middle">
            <p>
              <span className={`label ${inv?.overdue === "true" && "overdue"}`}>
                Due Date:{" "}
              </span>
              <span className={`value ${inv?.overdue === "true" && "overdue"}`}>
                {moment(inv?.INV_DATE).format("DD/MMM/YYYY")}
              </span>
            </p>
            {inv?.overdue === "true" && (
              <p className="overdue__button">Overdue</p>
            )}
          </div>
          <div className="desktop__right">
            {/* <p className="paybill__button">Pay Bill</p> */}
            {inv?.STATUS === "Paid" && <p className="paid__button">Paid</p>}
            {inv?.STATUS === "Cancelled" && (
              <p className="cancelled__button">Cancelled</p>
            )}
            {inv?.STATUS !== "Paid" && inv?.STATUS !== "Cancelled" && (
              <p
                className="paybill__button"
                onClick={() => showpaybill(inv?.INV_NO)}
              >
                Pay Bill
              </p>
            )}
          </div>
        </div>
      ))}

      <Modal open={open} onClose={onCloseModal} center>
        <div className="modal__paybill">
          <div className="paybill__modalheader">
            <div className="paymodal__top">
              <div>
                <p className="invoiceid">{modalHeader?.INV_BOOK}{modalHeader?.INV_NO}</p>
                <p className="ponumber">
                  <span className="label">PO Number : {modalHeader?.PO_NUMBER}</span>
                  <span className="value">{modalHeader?.ponumber}</span>
                </p>
              </div>
              <p className="duedate">
                <span className="label">Due : </span>
                <span className="value">{moment(modalHeader?.DUE_DATE).format("YYYY-MM-DD")}</span>
              </p>
            </div>
            <div className="paymodal__bottom">
              <div className="bottom__left">
                <p>
                  <span className="label">Bill to : </span>
                  <span className="label">{modalHeader?.BILL_TO}</span>
                </p>
                <p>
                  <span className="label">Delivery Date : </span>
                  <span className="label">{moment(modalHeader?.DELIVERY_DATE).format("YYYY-MM-DD")}</span>
                </p>
                <p>
                  <span className="label">Total Amount : </span>
                  <span className="label">฿ {modalHeader?.TOTAL}</span>
                </p>
              </div>
              <div className="bottom__right">
                <p>Pay Bill</p>
              </div>
            </div>
          </div>
          <div className="paybill__modalcontent">
            <h5>
              Total Products <span>{modalData?.length}</span>
            </h5>
            <div className="modal__list">
              {modalData?.map((prd) => (
                <div className="modal__productlist">
                  <p className="list__img">
                    <img src={prd?.PRODUCT_IMAGE} alt="" />
                  </p>
                  <p className="list__name">{prd?.PRODUCT_NAME}</p>
                  <p className="list__qty">X{prd?.QTY}</p>
                  <p className="list__amount">฿ {prd?.TOTAL}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {invData?.slice(0, 100)?.map((inv, i) => (
        <div
          className={`inv__body__mobile ${
            currentInv === inv?.INV_NO && "selectedInv"
          }`}
          key={i}
          onClick={() => selectedInvoice(inv?.INV_NO)}
        >
          <div className="mobile__left">
            <p>{inv?.INV_NO}{inv?.INV_NO}</p>
            <p>
              <span className="label">Bill to:</span>
              <span className="value">{inv?.BILL_TO}</span>
            </p>
            <p>{moment(inv?.INV_DATE).format("DD/MMM/YYYY")}</p>
          </div>
          <div className="mobile__right">
            {inv?.STATUS === "Paid" && <p className="paid__button">Paid</p>}
            {inv?.STATUS === "Cancelled" && (
              <p className="cancelled__button">Cancelled</p>
            )}
            {inv?.STATUS !== "Paid" && inv?.STATUS !== "Cancelled" && (
              <p className="paybill__button" onClick={() => showPayBill(inv)}>
                Pay Bill
              </p>
            )}
            <p className="amount">
              <span className="label">Amount: </span>
              <span className="value">฿ {inv?.TOTAL}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default InvoiceList;
