import React, { useState, useEffect } from "react";
import OrderDropdown from "../../components/Order/OrderDropdown/OrderDropdown";
import { useStateValue } from "../../store/state";
import "./TableSkeleton.scss";
import { Modal } from "react-responsive-modal";
import { Rating } from "react-simple-star-rating";
import axios from "axios";
import { toast } from "react-toastify";
import request from "../../request";
import { Link, useHistory } from "react-router-dom";

function TableSkeleton({ orderTable }) {
  const history = useHistory();
  const [dropdown, setdropdown] = useState(false);
  const [{ orderDropDownList }] = useStateValue();
  const [title, settitle] = useState();
  const [name, setname] = useState();
  const [description, setdescription] = useState();
  const [rating, setRating] = useState();

  const changeDropDown = () => {
    setdropdown(!dropdown);
  };
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [invoiceitem, setinvoiceitem] = useState([]);
  const [detailitems, setdetailitems] = useState([]);

  // const showinvoice = async (value) => {
  //   let info = JSON.parse(localStorage.getItem("invoiceinfo"));
  //   let data = info[value];
  //   try {
  //     const erptoken = await axios({
  //       method: "post",
  //       url: request.erplogin,
  //       data: {
  //         username: "jagota-iskula-b2b-team",
  //         password: "JIBT1234!@#$",
  //       },
  //       headers: {
  //         accept: "*/*",
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     let item = [];
  //     const invoicedata = await axios({
  //       method: "get",
  //       url: `${request.erprequest}/invoice/get-invoice?TRANSACTION_TYPE=${data.TRANSACTION_TYPE}&INV_BOOK=${data.INV_BOOK}&INV_NO=${data.INV_NO}`,
  //       headers: {
  //         token: `Bearer ${erptoken.data.data.token}`,
  //       },
  //     });
  //     setinvoiceitem((data) => [...data, invoicedata.data[0]]);
  //     invoicedata.data.filter(
  //       (items) =>
  //         items?.details.filter((item) =>
  //           setdetailitems((data) => [...data, item])
  //         )
  //       // items.filter((item) => console.log(item.details))
  //     );
  //   } catch (e) {
  //     toast.error(e.response?.data?.message);
  //   }
  // };

  useEffect(() => {
    localStorage.setItem("invoice", JSON.stringify(invoiceitem));
    localStorage.setItem("invoicedetails", JSON.stringify(detailitems));
  }, [invoiceitem]);

  const submitreview = async (pid) => {
    try {
      await axios({
        method: "post",
        url: request.createreviewrating,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          reviewdata: {
            title: title,
            detail: description,
            nickname: name,
            email: JSON.parse(localStorage.getItem("userdata")).email,
            productid: pid,
            customerid: localStorage.getItem("userid"),
            id: "",
          },
          ratings: {
            1: rating / 20,
          },
        },
      });
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  useEffect(() => {
    if (orderDropDownList) {
      changeDropDown();
    }
  }, [orderDropDownList]);

  const handleRating = (e) => {
    setRating(e);
  };

  return (
    <div className="tableskeleton">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Price</th>
            <th scope="col">QTY</th>
            <th scope="col" style={{ textAlign: "center" }}>
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody>
          {orderTable?.products?.map((data, i) => (
            <tr>
              <td className="orderstatus__img">
                <img
                  src={
                    data?.THUMBNAIL
                      ? data?.THUMBNAIL
                      : `${request.image}/media/catalog/product${data?.image}`
                  }
                  alt=""
                />
                <div className="orderstatus__details">
                  <small>
                    {data?.DESCRIPTION ? data?.DESCRIPTION : data?.PRODUCT_NAME}
                  </small>
                  <div className="orderstatus__dropdown">
                    <small>Delivery Location</small>
                    <span>{data?.RATE}</span>
                    <div
                      className={`orderstatus__content__close ${
                        dropdown && "orderstatus__content__open"
                      }`}
                    >
                      <OrderDropdown />
                    </div>
                  </div>
                </div>
              </td>
              <td>฿ {parseInt(data?.RATE).toFixed(2)}</td>
              <td>{parseInt(data?.QTY).toFixed(0)}</td>
              <td style={{ textAlign: "center" }}>
                <div className="orderstatus__sub">
                  <p>฿ {parseFloat(data?.SUB_TOTAL).toFixed(2)}</p>

                  <div
                    className="orderstatus__icons"
                    style={{ textAlign: "right" }}
                    // onClick={() => showinvoice(i)}
                  >
                    <a
                    // href="/invoice"
                    >
                      <i
                        class="fa fa-star"
                        aria-hidden="true"
                        // onClick={onOpenModal}
                      />
                    </a>
                    {/* <Modal open={open} onClose={onCloseModal} center>
                      <h2>Write your Review</h2>
                      <div className="tableskeleton__reviewform">
                        <input
                          placeholder="Your Title"
                          type="text"
                          value={data.review[0]?.title}
                          onChange={(e) => settitle(e.target.value)}
                        />
                        <input
                          placeholder="Name"
                          type="text"
                          value={data.review[0]?.nickname}
                          onChange={(e) => setname(e.target.value)}
                        />
                        <textarea
                          placeholder="Description"
                          rows="5"
                          value={data.review[0]?.detail}
                          onChange={(e) => setdescription(e.target.value)}
                        />
                        <Rating
                          onClick={handleRating}
                          ratingValue={rating}
                          fillColor="#57c36f"
                        />
                        <p
                          className="orderstatus__submit"
                          onClick={() => submitreview(data?.product_id)}
                        >
                          Submit Review
                        </p>
                      </div>
                    </Modal> */}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableSkeleton;
