import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NewCard.scss";
import axios from "axios";
import { useStateValue } from "../../store/state";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-responsive-modal";
import { injectStyle } from "react-toastify/dist/inject-style";
import request from "../../request";
import NewMiniCard from "../NewMiniCard/NewMiniCard";
import bookmark from "../../assets/images/catalog/bookmark.png";
import favoriteactive from "../../assets/images/card/favoriteactive.png";
import favoriteinactive from "../../assets/images/card/favoriteinactive.png";
import wishlistactive from "../../assets/images/card/wishlistactive.png";
import wishlistinactive from "../../assets/images/card/wishlistinactive.png";
import { useTranslation } from "react-i18next";

if (typeof window !== "undefined") {
  injectStyle();
}

function NewCard({
  image,
  url_key,
  name,
  price,
  pid,
  sku,
  specialprice,
  stock,
  page,
  id,
  wish,
  favourite,
  ordertaking,
  order_taking_end_date,
  content,
  options,
  unit,
  quote,
  dunit,
  topleftdesign,
  brand_name,
  pack_size,
  unit_box_unit,
  unit_box,
  unit_per_box,
  opentype,
  product_status
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [fav, setFav] = useState(false);
  const [view, setView] = useState(false);
  const [minicard, setMiniCard] = useState(false);
  const [{ gt }, dispatch] = useStateValue();
  const [unitprice, setunitprice] = useState();
  const [showToolTip, setShowToolTip] = useState(false)

  // console.log(view, gt, 'view')

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
      setFav(false)
      toast.warning("Please Login to add/Remove the product to Wishlists.");
    } else {
      addToWish();
    }
  };

  // Add to Favourite
  const addToFav = async () => {
    try {
      await axios({
        method: "post",
        url: request.addFav,
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
      setView(true);

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
      await axios({
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
      await axios({
        method: "post",
        url: request.addWishlist,
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
      await axios({
        method: "post",
        url: request.deletewishlist,
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
  // function truncate(str, n) {
  //   return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  // }

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const [orunit, setorunit] = useState(dunit);
  const [orprice, setorprice] = useState(unitprice);

  useEffect(() => {
    if(options == undefined) return
    selectUnit(options[0]?.title, options[0]?.price)
  }, [options])

  const selectUnit = (unit, price) => {
    setorunit(unit);
    setorprice(price);
  };

  return (
    <div className={`productCard ${view ? "product_card_border" : ""}`}>
      {url_key && page === "catalogdetails" ? (
        opentype === "new" ?
          <a
            href={`/${!quote ? "catalogdetails" : "productdetails"}/${
              !quote ? "cdetails" : "pdetails"
            }/${id}/${pid}/${url_key}`}
            target="_blank"
          >
            <div className="productCard__img">
              <img
                src={`${request.image}/media/catalog/product${image}`}
                alt=""
                width="100%"
                height="100%"
              />
            </div>
          </a>
        :
          <a
            href={`/${!quote ? "catalogdetails" : "productdetails"}/${
              !quote ? "cdetails" : "pdetails"
            }/${id}/${pid}/${url_key}`}
            target="_blank"
          >
            <div className="productCard__img">
              <img
                src={`${request.image}/media/catalog/product${image}`}
                alt=""
                width="100%"
                height="100%"
              />
            </div>
          </a>
      ) : (
        <div className="productCard__img">
          <a href={`/productdetails/pdetails/${id}/${pid}/${url_key}`} target="_blank">
            <div className="productCard__img">
              <img
                src={`${request.image}/media/catalog/product${image}`}
                alt=""
                width="100%"
                height="100%"
              />
            </div>
          </a>
        </div>
      )}
      {/* {topleftdesign !== "oval" ? (
        <div className="top-left">
          <p className="top-left-percent">34% Off</p>
          <img src={bookmark} alt="" />
        </div>
      ) : (
        <p className="para">
          {specialprice
            ? `${parseInt(((price - specialprice) / price) * 100)}%`
            : "0%"}
        </p>
      )}
      <div className="top-right">BUY 1 GET 1 FREE</div> */}
      <div className="productCard__name" onClick={openMiniCard} 
        onMouseEnter={() => setShowToolTip(url_key)}
        onMouseLeave={() => setShowToolTip("")}
      >
        <h4>{name}</h4>
        {showToolTip === url_key && <span className="productCard__tooltip">{name}</span>}
      </div>
      <div className="productCard__delivery">
        <div>
          {/* <p className="delivery__sku">{sku}</p> */}
          <p>{brand_name}</p>
          {/* <p>{`${t("Size")} ${pack_size} X ${unit_box} ${unit_box_unit}`}</p> */}
          <p>{`${t("Size")} ${pack_size}`}</p>
        </div>
        <div className="icons">
          <p onClick={Fav} className={`favorite ${fav && "favSelected"}`}>
            {fav ? (
              <img src={wishlistactive} alt="" />
            ) : (
              <img src={wishlistinactive} alt="" />
            )}
          </p>
          <p onClick={addToView} className={`view ${view && "viewSelected"}`}>
            {view ? (
              <img src={favoriteactive} alt="" />
            ) : (
              <img src={favoriteinactive} alt="" />
            )}
          </p>
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
      {/* {options?.length > 1 &&
      <div className="productCard__orderingunits">        
          {options?.map((op) => (
            <p
              className={`${orunit === op?.title && "selectedUnit"}`}
              onClick={() => selectUnit(op?.title, op?.price)}
              key={op?.title}
            >
              {op?.title}
            </p>
          ))}
      </div>
      } */}
      <div className="productCard__price">
        <div className="price" onClick={openMiniCard}>
          <span style={{ color: "#2B2B2B", fontSize: "22px" }}>
            ฿{" "}
            {orprice
              ? orprice % 1 === 0
                ? `${formatToCurrency(parseInt(orprice))}.00`
                : formatToCurrency(parseFloat(orprice).toFixed(2))
              : price % 1 === 0
              ? `${formatToCurrency(parseInt(price))}.00`
              : formatToCurrency(parseFloat(price).toFixed(2))}{" "}
            <span style={{ color: "#858585" }}>/{dunit}</span>
          </span>
        </div>
        {/* <div className="unitdata">
          <p>{unit_per_box}/{orunit}</p>
        </div> */}
      </div>
      <div className="card__quantity">
        <NewMiniCard
          sku={sku}
          price={orprice}
          pid={pid}
          specialprice={specialprice}
          name={name}
          dunit={orunit}
          order_taking_end_date={order_taking_end_date}
          ordertaking={ordertaking}
          stock={stock}
          product_status={product_status}
        />
      </div>
    </div>
  );
}

export default NewCard;
