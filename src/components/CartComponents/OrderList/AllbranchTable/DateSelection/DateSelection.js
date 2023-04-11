import React, { useState, useRef, useEffect, useMemo } from "react";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import "./DateSelection.scss";
import axios from "axios";
import Calendar from "react-calendar";
import moment from "moment";
import request from "../../../../../request";
import { Modal } from "react-responsive-modal";
import { useStateValue } from "../../../../../store/state";
import DatePicker from "react-date-picker";
import { differenceInCalendarDays } from "date-fns";

function DateSelection({
  sku,
  quantity,
  item_id,
  product_id,
  branch_id,
  name,
  totalquantity,
  branchdate,
}) {
  const [selectedDate, setselectedDate] = useState();
  const [saveddate, setsaveddate] = useState();
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const [deleteitem, setdeleteitem] = useState();
  const [open, setOpen] = useState(false);
  const [checkdate, setcheckdate] = useState();
  const [checkmsg, setcheckmsg] = useState();
  const [{ cal }, dispatch] = useStateValue();
  const [dateavail, setdateavail] = useState([]);

  useEffect(async () => {
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
    const datechk = await axios({
      method: "get",
      // url: `${request.erprequest}/products/order-period?PRODUCT_CODE=${sku}`,
      url: `${request.erprequest}/products/${sku}/delivery-date`,
      headers: {
        token: `Bearer ${erptoken.data.data.token}`,
      },
    });
    setdateavail(datechk.data.data[0].DELIVER_DATE);
    let mindate = new Date(branchdate);
    let maxdate = new Date(datechk.data.data[0].DELIVER_DATE[0]?.DD);
    if (mindate < maxdate) {
      handleSavedate(maxdate);
      setselectedDate(maxdate);
      setsaveddate(moment(maxdate).format("YYYY-MM-DD"));
    }
  }, []);

  const handleSavedate = async (mindate) => {
    try {
      const cartdata = await axios({
        method: "post",
        url: request.cartupdate,
        data: {
          data: {
            sku: sku,
            qty: parseInt(totalquantity),
            quote_id: localStorage.getItem("cartid"),
            item_id: item_id,
            customer_id: localStorage.getItem("userid"),
          },
          splitorder: {
            company_id: localStorage.getItem("companyid"),
            customer_id: localStorage.getItem("userid"),
            branch_id: branch_id,
            product_id: product_id,
            qty: parseInt(quantity),
            item_id: item_id,
            name: name,
            sku: sku,
            delivery_date: moment(mindate ? mindate : saveddate).format(
              "YYYY-MM-DD"
            ),
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
      DSelect();
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event) => {
    setsaveddate(moment(event).format("YYYY-MM-DD"));
    setselectedDate(event);
  };

  const tileDisabled = ({ date, view }) => {
    const disabledDates = [];
    dateavail.filter((dv) => disabledDates.push(new Date(dv.DD)));
    return !disabledDates.find((dDate) => isSameDay(dDate, date));
  };

  function isSameDay(a, b) {
    return differenceInCalendarDays(a, b) === 0;
  }

  const [bid, setbid] = useState();

  const openCalendar = () => {
    setShow(!show);
    localStorage.setItem("cc", `${branch_id}${product_id}`);
    setbid(branch_id);
    dispatch({
      type: "CAL__CLOSE",
      cal: true,
    });
  };

  useEffect(() => {
    if (!cal) {
      DSelect();
    }
  }, [cal]);

  const DSelect = () => {
    setShow(false);
    setbid("");
  };

  return (
    <div className="dateselection">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "alertmodal",
        }}
      >
        <div className="login_alertmodal text-center">
          <div>
            <p className="modal__deleteicon">
              <i className="fas text-danger fa-exclamation-triangle" />
            </p>
            <p className="modal__alertmsg">
              This Branch dont have any quantity updated to the Company Cart
            </p>
          </div>
        </div>
      </Modal>
      <span onClick={() => setShow(!show)}>
        {checkmsg ? (
          <span style={{ color: "red" }}>{checkmsg}</span>
        ) : (
          <span>{moment(branchdate).format("YYYY-MM-DD")}</span>
        )}
      </span>

      <i
        className="far fa-calendar-alt float-end"
        ref={target}
        onClick={openCalendar}
        style={{ position: "relative" }}
      />
      {deleteitem !== undefined ? (
        <i className="far fa-trash-alt deleteID" />
      ) : (
        ""
      )}

      <Overlay
        target={target.current}
        show={
          `${bid}${product_id}` === localStorage.getItem("cc") ? true : false
        }
        animation={true}
        placement="top-end"
        // placement={window.innerWidth > 540 ? "bottom" : "auto"}
      >
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            <Calendar
              className="calendar_custom_work"
              onChange={handleChange}
              minDate={new Date(dateavail[0]?.DD)}
              maxDate={new Date(dateavail[dateavail?.length - 1]?.DD)}
              defaultActiveStartDate={new Date(dateavail[0]?.DD)}
              value={selectedDate}
              tileDisabled={tileDisabled}
            />
            <div className="calender__footer__allbranch">
              <div className="allbranch__delivery_options"></div>
              <div className="calender__footer__allbranch__buttons">
                <Link
                  className="calender__footer__allbranch__cancle"
                  to="./OrdertoDelivery"
                  onClick={DSelect}
                >
                  cancel
                </Link>
                <button
                  type="button"
                  className="calender__footer__allbranch__save"
                  onClick={() => handleSavedate()}
                  aria-label="savedate"
                >
                  save
                </button>
              </div>
            </div>
          </Tooltip>
        )}
      </Overlay>
    </div>
  );
}

export default DateSelection;
