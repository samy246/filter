import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Rating.scss";
import moment from "moment";
import { useStateValue } from "../../../store/state";
import { toast } from "react-toastify";
import request from "../../../request";

function Rating({ ratingdata, sMore }) {
  const [{}, dispatch] = useStateValue();
  const thumbshandler = async (value, review) => {
    try {
      await axios({
        method: "post",
        url: request.thumbsupdown,
        data: {
          helpfuldata: {
            choice: value,
            reviewid: review,
            customer_id: JSON.parse(localStorage.getItem("userid")),
          },
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
    dispatch({
      type: "THUMBS__TRIGGER",
    });
  };

  const [rData, setRData] = useState([]);

  useEffect(() => {
    setRData([]);
    if (sMore) {
      setRData(ratingdata);
    }
    if (!sMore) {
      ratingdata?.filter((rd, i) => {
        if (i >= 3) {
          return;
        } else {
          setRData((prevState) => [...prevState, rd]);
        }
      });
    }
  }, [ratingdata, sMore]);


  return (
    <>
      {rData?.map((r, i) => (
        <div className="pl-20">
          <div className="CatalogCardDetails__reviews ">
            <div className="d-flex align">
              <span className=" review_star h3  d-flex rounded-pill">
                <h4 className="m-0">{r.value}</h4>
                <i className="fas fa-star " />
              </span>
              <h4>{r.title}</h4>
            </div>
            <div className="float-end p-4 thumbs">
              <span
                className="thumbs-up"
                onClick={() => thumbshandler(1, parseFloat(r.review_id))}
              >
                <i className="far fa-thumbs-up fa-2x" />{" "}
                <span>{r.count_helpful}</span>
              </span>
              <span
                className="thumbs-down"
                onClick={() => thumbshandler(0, parseFloat(r.review_id))}
              >
                <i className="far fa-thumbs-down fa-2x" />{" "}
                <span>{r.count_unhelpful}</span>
              </span>
            </div>
          </div>
          <p>{r.detail}</p>
          <p>{r.nickname}</p>
          <span className="certify">
            <span className="p-4">Certificated Buyer</span>&nbsp;&nbsp;
            <span>
              {moment(
                moment(r.review_created_at).format("YYYYMMDD"),
                "YYYYMMDD"
              ).fromNow()}
            </span>
          </span>
        </div>
      ))}
    </>
  );
}

export default Rating;
