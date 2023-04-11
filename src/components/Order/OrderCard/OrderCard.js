import React, { useState, useEffect } from "react";
import Remaining from "../Remaining/Remaining";
import "./OrderCard.scss";
import { Link } from "react-router-dom";
import { useStateValue } from "../../../store/state";
import search from "../../../assets/images/Finance/search.svg";

function OrderCard({
  data,
  id,
  remain,
  setRemain,
  name,
  address,
  ponumber,
  orderno,
  status,
  total,
  date,
  tab,
  region,
  erp,
}) {
  const Remainstatus = (id) => {
    setRemain(id);
    window.remainid = id;
  };

  useEffect(() => {
    setRemain(null);
    window.remainid = "";
  }, [tab]);

  const [selected, setSelected] = useState([]);

  const [{}, dispatch] = useStateValue();

  const selectedRemainData = (ponumber, orderno, status, total, date) => {
    setSelected(ponumber, orderno, status, total, date);
  };

  useEffect(() => {
    dispatch({
      type: "REMAINING_ORDER",
      remain: selected,
    });
    localStorage.setItem(
      "remainorders",
      JSON.stringify({
        selected,
      })
    );
  }, [selected]);

  return (
    <div className="ordercard">
      <div>
        <Link
          to={`/myorder/${tab}/${id}`}
          onMouseEnter={() =>
            selectedRemainData(ponumber, orderno, status, total, date)
          }
        >
          <div
            className={`ordercard__allcontent ${
              remain === id && "ordercard__allcontent__added"
            }`}
          >
            <div className="ordercard__icon">
              <img src={search} alt="" />
            </div>
            <div className="ordercard__content">
              <div>
                {" "}
                <strong>Location</strong>
                <h4>{region ? region : name}</h4>
                <p className="ordercard__address">{address}</p>
              </div>

              <div className="ordercard__count"></div>
            </div>
          </div>
        </Link>
        {window.remainid === id ? (
          <div
            className={`ordercard__remaining__data ${
              window.remainid == id && "ordercard__remaining__data__open"
            }`}
          >
            {data?.items?.map((data) => (
              <Remaining
                ponumber={data.items[0].ponumber}
                erp={data.items[0].erp}
                orderno={data.items[0].ordernumber}
                total={data.items[0].price}
                delivery_status_erp={data.items[0].delivery_status_erp}
              />
            ))}

            <p
              onClick={() => (setRemain(null), (window.remainid = null))}
              className="ordercard__button"
            >
              <span>Tab to Close</span>
              <span>
                <i class="fas fa-angle-double-down text-white"></i>
              </span>
            </p>
          </div>
        ) : (
          <div className="ordercard__remaining">
            <div className="hideRemain">
              <Remaining ponumber={ponumber} orderno={orderno} total={total} />
            </div>
            <p onClick={() => Remainstatus(id)} className="ordercard__button">
              <span> Tab to Open</span>
              <span>
                <i class="fas fa-angle-double-down text-white"></i>
              </span>
            </p>{" "}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderCard;
