import axios from "axios";
import React, { useState, useEffect } from "react";
import "./carouselcard.scss";
import request from "../../../request";
import { useStateValue } from "../../../store/state";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function CarouselCard({
  img,
  name,
  rate,
  sku,
  id,
  pid,
  url_key,
  ordertaking,
  stock,
  qty,
  price,
  options,
}) {
  const [{}, dispatch] = useStateValue();

  const [unitprice, setunitprice] = useState();
  const [buttonstatus, setbuttonstatus] = useState(false);

  useEffect(() => {
    if (options !== undefined) {
      setunitprice(options[0]);
    }
  }, [options]);

  const addToCart = async () => {
    if (localStorage.getItem("token") === null)
      return toast.info("Please Login before adding to the cart");
    if (ordertaking === "N" && stock == 0) {
      return toast.info(`${name} is ${t("Out of Stock")}`);
    }
    if (
      (ordertaking === "N" && stock === "1" && parseInt(qty).toFixed(0) >= 1) ||
      ordertaking === "Y"
    ) {
      try {
        setbuttonstatus(true);
        const cartdata = await axios({
          method: "post",
          url: request.cartadd,
          data: {
            cartItem: {
              sku: sku,
              quote_id: localStorage.getItem("cartid"),
              qty: 1,
              price: price,
            },
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setbuttonstatus(false);
        dispatch({
          type: "CART_STATUS",
          status: cartdata.data,
        });
        toast.success(`${name} added to the cart Successfully`);
      } catch (e) {
        setbuttonstatus(false);
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    } else {
      setbuttonstatus(false);
      return toast.info(`${name} is Out of Stock`);
    }
  };

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <div className="carouselcard text-center">
      <Link to={`/catalogdetails/cdetails/${id}/${pid}/${url_key}`}>
        <img
          className="carouselcard__img rounded-0 w-100"
          src={img}
          alt={name}
        />
      </Link>
      <p className="carouselcard__name desktopOnly m-0">{truncate(name, 40)}</p>
      <p className="carouselcard__name mobileOnly m-0">{truncate(name, 30)}</p>
      {/* <p className="carouselcard__rate fw-bold ">฿ {rate}</p> */}
      <p className="carouselcard__rate fw-bold ">
        ฿ {unitprice?.price ? parseInt(unitprice?.price).toFixed(2) : rate}
      </p>
      <button
        disabled={buttonstatus}
        type="button"
        className="btn carosal__button rounded-pill"
      >
        <i className="fas fa-cart-plus" />
        <span onClick={addToCart}> Add to Cart</span>
      </button>
    </div>
  );
}

export default CarouselCard;
