import React, { useEffect, useState, Suspense } from "react";
import "./OrderStatus.scss";
import { useHistory, useParams } from "react-router-dom";
import { useStateValue } from "../../../store/state";
import axios from "axios";
import { toast } from "react-toastify";
import request from "../../../request";
import back from "../../../assets/images/catalog/back.png";
import SummaryTable from "../../../components/CartComponents/OrderList/SummaryTable/SummaryTable";
import { Modal } from "react-responsive-modal";
import database from "../../../firebase";
import MapComponent from "../GoogleMapShow/MapComponent";
import { useLoadScript } from "@react-google-maps/api";
import Spinner from "../../../components/Spinner";
import StatusTable from "./StatusTable";
import { useTranslation } from "react-i18next";
const Stars = React.lazy(() => import("../Stars/Stars"));

function OrderStatus({ token }) {
  const { t } = useTranslation();
  const [libraries] = useState(["places"]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAjkVMT-HUgoGIx1XKJezRfNgfIL0vKmpA",
    libraries: libraries,
  });
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [description, setdescription] = useState("");
  const [title, settitle] = useState("");
  const [pid, setpid] = useState();
  const [cname, setcname] = useState();
  const [orderinfo, setorderinfo] = useState([]);
  const [cgt, setcgt] = useState(false);

  const { orderid } = useParams();


  useEffect(async () => {
    try {
      const orderdetailsdata = await axios({
        method: "post",
        url: request.orderdetails,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          order_id: orderid,
          customer_id: localStorage.getItem("userid"),
        },
      });
      setorderinfo(orderdetailsdata.data);
    } catch (e) {
      console.log(e);
    }
  }, [orderid, cgt]);

  const onCloseModal = () => setOpen(false);
  const [rid, setrid] = useState("");

  useEffect(() => {
    if (token === null || "" || undefined) {
      history.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const [{}, dispatch] = useStateValue();
  useEffect(() => {
    closeSide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeSide = () => {
    dispatch({
      type: "SET_MINICART",
      value: false,
    });
    dispatch({
      type: "SET_MINIMENU",
      value: false,
    });
    dispatch({
      type: "SET_NOTIFICATION",
      value: false,
    });
    dispatch({
      type: "SET_LANGUAGE",
    });
    dispatch({
      type: "SEARCHBAR__CLOSEOPEN",
    });
  };

  const [rating, setRating] = useState(0);

  const submitreview = async () => {
    let currentrating;
    if(title == "") {
      return toast.info("Please add the title")
    }
    if(description == "") {
      return toast.info("Please add the description")
    }
    if (
      rating == 20 ||
      rating == 40 ||
      rating == 60 ||
      rating == 80 ||
      rating == 100
    ) {
      currentrating = rating / 20;
    } else {
      currentrating = rating;
    }
    if(currentrating == 0) {
      return toast.info("Please choose your rating")
    }
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
            nickname: cname,
            email: JSON.parse(localStorage.getItem("userdata")).email,
            productid: pid,
            customerid: localStorage.getItem("userid"),
            id: rid,
          },
          ratings: {
            1: currentrating,
          },
        },
      });
      onCloseModal();
      setcgt(!cgt);
    } catch (e) {
      onCloseModal();
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const [latLonSet, setLatLonSet] = useState({});

  function formatToCurrency(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const [mapOpen, setMapOpen] = useState(false);
  const onCloseMapModal = () => setMapOpen(false);
  const onOpenMapModal = () => setMapOpen(true);

  const [destination, setdestination] = useState({
    lat: 13.716126168149346,
    lng: 100.58480081600467,
  });

  const [truckloc, settruckloc] = useState({
    drivermobile: "",
    routecode: "",
  });

  return (
    <div className="orderstatus" onClick={closeSide}>
      <Modal open={mapOpen} onClose={onCloseMapModal} center>
        {isLoaded ? (
          <MapComponent
            delat={destination?.lat}
            delng={destination?.lng}
            truckloc={truckloc}
          />
        ) : (
          <div>Loading...</div>
        )}
      </Modal>
      {/* <p onClick={() => onOpenMapModal()}>click for map</p> */}

      <div className="order__back">
        <span onClick={() => history.goBack()}>
          <img src={back} alt="" />
        </span>
        <h4></h4>
      </div>

      <div className="order__header">
        <h3>{t("Order Details")}</h3>
        <h3 className="header__status">{orderinfo[0]?.order_status}</h3>
      </div>

      <div className="order__content">
        <div className="order__main">
          <div className="order__maintop">
            <div className="order__maintopdata">
              <p className="order__ordernumber">
                <strong>{t("Order Number")}: </strong>
                <span>{orderinfo[0]?.order_number}</span>
              </p>
              <p>
                <strong>{t("PO Number")}: </strong>
                <span>{orderinfo[0]?.po_number}</span>
              </p>
              <p className="nomobile">
                <strong id="cname">{t("Customer Name")}: </strong>
                <span id="pnumber">{orderinfo[0]?.customer_name}</span>
              </p>
              <p className="nomobile">
                <strong id="cname">{t("Phone Number")}: </strong>
                <span id="pnumber">{orderinfo[0]?.phone_number}</span>
              </p>
            </div>
            <h3 className="header__status">{orderinfo[0]?.order_status}</h3>
          </div>
          <div className="order__ordercontent">
            <h3>
              {t("Order Status by Branch")}{" "}
              <span>({orderinfo[0]?.branch_count})</span>
            </h3>
            <StatusTable
              orderinfo={orderinfo[0]}
              setpid={setpid}
              setcname={setcname}
              settitle={settitle}
              setdescription={setdescription}
              setRating={setRating}
              setrid={setrid}
              setOpen={setOpen}
              setdestination={setdestination}
              onOpenMapModal={onOpenMapModal}
              settruckloc={settruckloc}
            />
          </div>
        </div>
        <div className="order__side">
          <SummaryTable page="myorder" />
          <Modal open={open} onClose={onCloseModal} center>
            <div className="order__side__header">
              <h2>{t("Write your Review")}</h2>
              <Suspense fallback={<Spinner />}>
                <Stars rating={rating} setRating={setRating} rid={rid} />
              </Suspense>
              <p className="order__side__submit" onClick={submitreview}>
                {t("Done")}
              </p>
            </div>
            <div className="order__side__body">
              <input
                type="text"
                placeholder={t("Title")}
                value={title}
                onChange={(e) => settitle(e.target.value)}
              />
              <textarea
                rows="15"
                cols="100%"
                value={description}
                placeholder={`${t("Description here")}...`}
                onChange={(e) => setdescription(e.target.value)}
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default OrderStatus;
