import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MiniCard from "../MiniCard/MiniCard";
import "./ProductCard.scss";
import axios from "axios";
import instance from "../../request";
import { useStateValue } from "../../store/state";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-responsive-modal";
import moment from "moment";
import { injectStyle } from "react-toastify/dist/inject-style";
import request from "../../request";
import { useTranslation } from "react-i18next";

if (typeof window !== "undefined") {
  injectStyle();
}

function ProductCard({
  image,
  url_key,
  width,
  name,
  price,
  pid,
  sku,
  token,
  specialpriceExpiry,
  specialprice,
  stock,
  delivery_in,
  page,
  id,
  wish,
  favourite,
  ordertaking,
  quty,
  content,
  options,
  unit,
  quote,
  dunit,
}) {
  const [open, setOpen] = useState(false);
  const [fav, setFav] = useState(false);
  const [view, setView] = useState(false);
  const [minicard, setMiniCard] = useState(false);
  const [{ gt }, dispatch] = useStateValue();
  const [unitprice, setunitprice] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    if (window.selected !== pid) {
      setMiniCard(false);
    }
  }, [window.selected]);

  useEffect(() => {
    setView(favourite);
  }, [favourite]);

  useEffect(() => {
    if (content === "favContent") setView(favourite);
  }, [gt]);

  useEffect(() => {
    setFav(wish);
  }, [wish]);

  const Fav = () => {
    if (fav === true) {
      delFromWish();
    } else {
      addToWishHandler();
    }
  };

  const addToView = () => {
    if (view === true) {
      deletefromFav();
    } else {
      addToFavHandler();
    }
  };

  const addToFavHandler = () => {
    const ctoken = localStorage.getItem("token");
    if (ctoken === null || ctoken === "" || ctoken === undefined) {
      setOpen(false);
      setView(false);
      toast.warning("Please Login to add/Remove the product to Favourites.");
    } else {
      addToFav();
    }
  };

  const openMiniCard = () => {
    window.selected = pid;
    localStorage.setItem("minicard", false);
    setMiniCard(!minicard);
  };

  const addToWishHandler = () => {
    const ctoken = localStorage.getItem("token");
    if (ctoken === null || ctoken === "" || ctoken === undefined) {
      setOpen(false);
      toast.warning("Please Login to add/Remove the product to Wishlists.");
    } else {
      addToWish();
    }
  };

  // Add to Favourite
  const addToFav = async () => {
    try {
      const viewPost = await axios({
        method: "post",
        url: instance.addFav,
        data: {
          data: {
            customer_id: localStorage.getItem("userid"),
            product_id: pid,
            company_id: localStorage.getItem("companyid"),
          },
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      dispatch({
        type: "GENERAL__TRIGGER",
      });
      toast.success(`${name} Added to the Favourite Successfully`);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  // Delete from Fav
  const deletefromFav = async () => {
    try {
      const viewPost = await axios({
        method: "delete",
        url: `${request.deletefav}/${pid}/${localStorage.getItem("userid")}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setView(!view);
      dispatch({
        type: "GENERAL__TRIGGER",
      });
      toast.success(`${name} Removed from the Favourite Successfully`);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  // Add to wishlist
  const addToWish = async () => {
    const userid = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    try {
      const favPost = await axios({
        method: "post",
        url: instance.addWishlist,
        data: {
          customerId: parseInt(userid),
          productId: parseInt(pid),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFav(true);

      dispatch({
        type: "GENERAL__TRIGGER",
      });
      toast.success(`${name} Added to the Wishlist Successfully`);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  // Delete from wishlist
  const delFromWish = async () => {
    const userid = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    try {
      const favPost = await axios({
        method: "post",
        url: instance.deletewishlist,
        data: {
          customerId: userid,
          productId: pid,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFav(!fav);
      dispatch({
        type: "GENERAL__TRIGGER",
      });
      toast.success(`${name} Removed from the Wishlist Successfully`);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  // Truncate to reduce the numbers of letters in a string
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className={`productCard ${width ? "product_card_width" : ""}`}>
      {url_key && page === "catalogdetails" ? (
        <Link
          to={`/${!quote ? "catalogdetails" : "productdetails"}/${
            !quote ? "cdetails" : "pdetails"
          }/${id}/${pid}/${url_key}`}
        >
          <div className="productCard__img">
            <img
              src={`${request.image}/media/catalog/product${image}`}
              alt=""
            />
          </div>
        </Link>
      ) : (
        <div className="productCard__img">
          <Link to={`/productdetails/pdetails/${id}/${pid}/${url_key}`}>
            <div className="productCard__img">
              <img
                src={`${request.image}/media/catalog/product${image}`}
                alt=""
              />
            </div>
          </Link>
        </div>
      )}

      <div className="top-left">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30px"
          height="30px"
          fill="currentColor"
          className="bi bi-bookmark-fill"
          viewBox="0 0 16 16"
        >
          <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
        </svg>
      </div>
      <p className="para">
        {specialprice
          ? `${parseInt(((price - specialprice) / price) * 100)}%`
          : "0%"}
      </p>
      <div className="top-right">
        {stock === "1" && parseInt(quty) >= 1 && ordertaking === "N" ? (
          <div className="stockInfo">In Stock</div>
        ) : ordertaking === "Y" ? (
          <div className="stockInfo">In Stock</div>
        ) : (
          <div className="stockInfo">{t("Out of Stock")}</div>
        )}
      </div>
      <div className="productCard__name" onClick={openMiniCard}>
        {name ? <h4>{truncate(name, 30)}</h4> : ""}{" "}
      </div>
      <div className="productCard__delivery">
        {delivery_in === "15" ? (
          <p onClick={openMiniCard} className="green">
            Delivery in 1 - 2 Days
          </p>
        ) : (
          ""
        )}
        {delivery_in === "16" ? (
          <p onClick={openMiniCard} className="blue">
            Delivery in 3 - 4 Days
          </p>
        ) : (
          ""
        )}
        {delivery_in === "17" ? (
          <p onClick={openMiniCard} className="blue">
            Delivery in 5 - 6 Days
          </p>
        ) : (
          ""
        )}
        {delivery_in === "18" ? (
          <p onClick={openMiniCard} className="yellow">
            Delivery in 7 Days
          </p>
        ) : (
          ""
        )}
        <div
          className={`productCard__miniCard ${
            minicard && "productCard__miniCard__open"
          }`}
        >
          <MiniCard
            pid={pid}
            sku={sku}
            token={token}
            setMiniCard={setMiniCard}
            name={name}
            ordertaking={ordertaking}
            stock={stock}
            quty={quty}
            price={specialprice ? specialprice : price}
            options={options}
            quoteunit={unit}
            setunitprice={setunitprice}
            unitprice={unitprice}
            specialprice={specialprice}
            dunit={dunit}
          />
        </div>
      </div>
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
            <p className="modal__icon">
              <i className="fas text-danger  fa-exclamation-triangle" />
            </p>
            <p>Please Login to add the product to Wishlist.</p>
          </div>
          <Link className="modal__login" to="./login">
            Login
          </Link>
        </div>
      </Modal>
      <div className="productCard__price">
        <div className="price" onClick={openMiniCard}>
          <span>
            Price Expires on
            {specialpriceExpiry
              ? moment(specialpriceExpiry).format("DD-MM-YY")
              : "(no date)"}
          </span>
          {specialprice ? (
            <span>
              ฿{" "}
              {unitprice
                ? unitprice % 1 === 0
                  ? `${formatToCurrency(parseInt(unitprice))}.00`
                  : formatToCurrency(parseFloat(unitprice).toFixed(2))
                : price % 1 === 0
                ? `${formatToCurrency(parseInt(specialprice))}.00`
                : formatToCurrency(parseFloat(specialprice).toFixed(2))}
            </span>
          ) : (
            <span>
              ฿{" "}
              {unitprice
                ? unitprice % 1 === 0
                  ? `${formatToCurrency(parseInt(unitprice))}.00`
                  : formatToCurrency(parseFloat(unitprice).toFixed(2))
                : price % 1 === 0
                ? `${formatToCurrency(parseInt(price))}.00`
                : formatToCurrency(parseFloat(price).toFixed(2))}
            </span>
          )}
        </div>
        <div className="icons">
          <p onClick={addToView} className={`view ${view && "viewSelected"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-file-earmark-x"
              viewBox="0 0 16 16"
            >
              <path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146z" />
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
            </svg>
          </p>
          <p onClick={Fav} className={`favorite ${fav && "favSelected"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-heart-fill"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
              />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
