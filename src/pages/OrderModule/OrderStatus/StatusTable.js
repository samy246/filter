import React, { useState, useEffect } from "react";
import check from "../../../assets/images/orderpage/check-solid.svg";
import truck from "../../../assets/images/orderpage/truck.svg";
import packed from "../../../assets/images/orderpage/packed.svg";
import confirmed from "../../../assets/images/orderpage/confirmed.svg";
import placed from "../../../assets/images/orderpage/placed.svg";
import location from "../../../assets/images/orderpage/location.svg";
import ratingnostar from "../../../assets/images/orderpage/ratingnostar.svg";
import ratingfullstar from "../../../assets/images/orderpage/ratingfullstar.svg";
import request from "../../../request";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Invoice from "../../../components/Order/Summary/Invoice/Invoice";
import axios from "axios";
import download from "../../../assets/images/MyOrder/download.svg";
import { toast } from "react-toastify";

function StatusTable({
  orderinfo,
  setpid,
  setcname,
  settitle,
  setdescription,
  setRating,
  setrid,
  setOpen,
  onOpenMapModal,
  setdestination,
  settruckloc,
}) {
  const { t } = useTranslation();
  const history = useHistory();
  function formatToCurrency(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const currentdata = (id, name) => {
    setpid(id);
    setcname(name);
  };

  const selectedRating = (item) => {
    onOpenModal();
    if (item?.review_id !== "") {
      settitle(item?.title);
      setdescription(item?.detail);
      setRating(parseInt(item?.rating) * 20);
      setrid(item?.review_id);
    } else {
      setrid("");
    }
  };
  const onOpenModal = () => {
    setOpen(true);
  };

  const openMap = (mobile, routecode, lat, lng) => {
    console.log(mobile, routecode, lat, lng)
    settruckloc({
      drivermobile: mobile,
      routecode: routecode,
    });
    setdestination({
      lat: lat,
      lng: lng,
    });
    onOpenMapModal();
  };
  const [pdf, setpdf] = useState(false);

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
        url: `${request.erprequest}/invoice/get-invoice?TRANSACTION_TYPE=IN&INV_BOOK=${book}&INV_NO=${id}`,
        headers: {
          token: `Bearer ${erptoken.data.data.token}`,
        },
      });
      setinvoiceitem((data) => [...data, invoicedata.data[0]]);
      setdetailitems(invoicedata.data[0]?.details);
      setpdf(true);
      history.push("/invoice/");
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  useEffect(() => {
    localStorage.setItem("invoice", JSON.stringify(invoiceitem));
    localStorage.setItem("invoicedetails", JSON.stringify(detailitems));
    // history.push("/invoice");
  }, [invoiceitem, detailitems]);

  return (
    <div className="order__productlist accordion-item accordian_fw">
      {orderinfo?.branch_list?.map((od, i) => (
        <div className="accordion-header" id={`heading${i}`}>
          <h4
            className={`accordion-button ${i === 0 ? "" : "collapsed"}`}
            data-toggle="collapse"
            data-target={`#collapse${i}`}
            aria-expanded="false"
            aria-controls={`collapse${i}`}
          >
            <span>{i + 1}</span>
            {od?.branch_name}
          </h4>
          <div
            aria-labelledby={`heading${i}`}
            className={`order__info accordion-collapse collapse ${
              i === 0 && "show"
            }`}
            id={`collapse${i}`}
            data-bs-parent="#accordionExample"
          >
            <h5>
              {t("Order Summary")}{" "}
              <span>({od?.invoice_list[0]?.total_products})</span>
            </h5>
            <div className="info__headcontent">
              {od?.invoice_list?.map((data) => (
                <>
                  <div className="list" key={data?.invoice_id}>
                    {data?.invoice_id ? (
                      <strong>
                        {data?.invoice_book}
                        {data?.invoice_id}
                      </strong>
                    ) : (
                      <strong
                        style={{
                          color: "#B72413",
                          position: "relative",
                        }}
                      >
                        {"___ "}
                        <span
                          style={{
                            position: "absolute",
                            top: "6px",
                            left: "37px",
                          }}
                        >
                          /
                        </span>
                        {" ___"}
                      </strong>
                    )}
                    {data?.invoice_id && (
                      <p
                        className="orderstatus__download"
                        onClick={() =>
                          showpdf("IN", data?.invoice_book, data?.invoice_id)
                        }
                      >
                        <img src={download} className="downloadimg" alt="" />
                      </p>
                    )}
                    {pdf && <Invoice />}
                    <p
                      className={`desktoponly paystatus ${
                        data?.payment_status !== "Paid" && "notpaystatus"
                      }`}
                    >
                      {data?.payment_status}
                    </p>
                    <p className="count">
                      {t("Total")}: {data?.product_list?.length}
                    </p>
                    <p>THB {formatToCurrency(data?.total_price)}</p>
                    <p
                      className={`list__deliverystatus ${
                        data?.delivery_status == "Out for Delivery" &&
                        "list__outfordelivery"
                      } ${
                        data?.delivery_status == "Packed" && "list__packed"
                      } ${
                        data?.delivery_status == "Order Confirmed" &&
                        "list__grey"
                      } ${
                        data?.delivery_status == "Order Placed" &&
                        "list__grey"
                      }
                        ${
                          data?.delivery_status == "Waiting For Confirmation" &&
                        "list__yellow"
                        }
                      `}
                    >
                      {data?.delivery_status == "Out for Delivery" && (
                        <>
                          <img src={truck} alt="" />
                        </>
                      )}
                      {data?.delivery_status == "Packed" && (
                        <img src={packed} alt="" />
                      )}
                      {data?.delivery_status == "Order Confirmed" && (
                        <img src={confirmed} alt="" />
                      )}
                      {data?.delivery_status == "Order Placed" && (
                        <img src={placed} alt="" />
                      )}
                      {data?.delivery_status == "Out for Delivery" ||
                        data?.delivery_status == "Packed" ||
                        data?.delivery_status == "Order Confirmed" ||
                        (data?.delivery_status != "Order Placed" && (
                          <img src={check} alt="" />
                        ))}
                      {data?.delivery_status}
                    </p>
                    <p
                      className={`mobileonly paystatus ${
                        data?.payment_status != "Paid" && "notpaystatus"
                      }`}
                    >
                      {data?.payment_status}
                    </p>
                    {data?.delivery_status == "Out for Delivery" && (
                      <img
                        src={location}
                        alt=""
                        className="list__location"
                        onClick={() =>
                          openMap(
                            od?.invoice_list[0]?.driver_mobile,
                            od?.invoice_list[0]?.route_code,
                            od?.invoice_list[0]?.latitude,
                            od?.invoice_list[0]?.longitude
                          )
                        }
                      />
                    )}
                  </div>
                  <ul>
                    {data?.product_list?.map((item, i) => (
                      <li
                        key={i}
                        onMouseEnter={() =>
                          currentdata(item?.product_id, item?.product_name)
                        }
                      >
                        <span className="item__qty">
                          {parseInt(item?.product_qty)}X
                        </span>
                        <img
                          src={`${request.image}/media/catalog/product/${item?.product_image}`}
                          alt=""
                        />
                        <span className="item__pname">
                          {item?.product_name}
                        </span>
                        <span className="order__rating">
                          <img
                            src={
                              item?.rating === "0"
                                ? ratingnostar
                                : ratingfullstar
                            }
                            onClick={() =>
                              useHistory.push(
                                `/review/${item?.product_name}/${item?.product_id}`
                              )
                            }
                            className="mobileonly"
                            alt=""
                          />
                          <img
                            src={
                              item?.rating === "0"
                                ? ratingnostar
                                : ratingfullstar
                            }
                            onClick={() => selectedRating(item)}
                            // onClick={onOpenModal}
                            className="desktoponly"
                            alt=""
                          />
                          <div className="mobileonly mobileonly__price">
                            ฿ {formatToCurrency(parseInt(item?.product_price))}
                          </div>
                        </span>
                        <span className="order__total desktoponly">
                          ฿ {formatToCurrency(parseInt(item?.product_price))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatusTable;
