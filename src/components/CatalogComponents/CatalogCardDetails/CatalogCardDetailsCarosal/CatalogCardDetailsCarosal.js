import React, { useState, useEffect } from "react";
import "./catalogCardDetailsCarosal.scss";
import NewCard from "../../../NewCard/NewCard";
import axios from "axios";
import Slider from "react-slick";
import { toast } from "react-toastify";
import { useStateValue } from "../../../../store/state";
import request from "../../../../request";
import { useParams } from "react-router-dom";

function CatalogCardDetailsCarosal() {
  const [{ gt }, dispatch] = useStateValue();
  const { pid } = useParams();
  const [bt, setBT] = useState();
  const settings = {
    dots: false,
    infinite: false,
    // rtl: true,
    speed: 500,
    slidesToScroll: 5,
    slidesToShow: 5,
    initialSlide: 0,
    focusOnSelect: false,
    speed: 400,
    cssEase: "linear",
    lazyLoad: true,
    // nextArrow: <Arrow type="next" />,
    // prevArrow: <Arrow type="prev" />,
    responsive: [
      // {
      //   breakpoint: 1660,
      //   settings: {
      //     slidesToShow: 6,
      //     slidesToScroll: 2,
      //     initialSlide: 6,
      //   },
      // },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          initialSlide: 5,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      // {
      //   breakpoint: 480,
      //   settings: {
      //     slidesToShow: 1,
      //     slidesToScroll: 1,
      //     initialSlide: 1,
      //   },
      // },
    ],
  };

  useEffect(() => {
    if (pid === undefined) return;
    async function fetchData() {
      try {
        const boughtTog = await axios({
          method: "get",
          url: `${request.getrelatedproducts}/${pid}/${localStorage.getItem(
            "storeid"
          )}/${
            localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
          }`,
        });
        setBT(boughtTog.data);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid, gt]);

  // function Arrow(props) {
  //   let className =
  //     props.type === "next" ? "Carosal_nextArrow" : "Carosal_prevArrow";
  //   className += " arrow";
  //   const char =
  //     props.type === "next"
  //       ? "fas fa-chevron-circle-right text-success fa-xs"
  //       : "fas fa-chevron-circle-left text-success fa-xs";
  //   return (
  //     <span className={className} onClick={props.onClick}>
  //       <i className={char} />
  //     </span>
  //   );
  // }

  return (
    <div className="carousel product_card_carousel">
      <Slider {...settings}>
        {bt?.map((data, i) => (
          <NewCard
            key={i}
            pid={data.entity_id}
            sku={data.sku}
            name={data.name}
            price={data.price}
            specialpriceExpiry={data.special_to_date}
            specialprice={data.special_price}
            url_key={data.url_key}
            alldata={data}
            stock={data.is_in_stock}
            image={data.thumbnail}
            delivery_in={data.delivery_in}
            page="catalogdetails"
            id={data.category_id}
            favourite={data.favourite}
            wish={data.wish}
            ordertaking={data.order_taking}
            order_taking_end_date={data?.order_taking_end_date}
            quty={data.qty}
            options={data.options}
            dunit={data?.selling_unit}
            brand_name={data?.brand_name}
            pack_size={data?.pack_size}
            unit_per_box={data?.unit_per_box}
            unit_box={data?.unit_box}
            unit_box_unit={data?.unit_box_unit}
            product_status={data?.product_status}
          />
        ))}
      </Slider>
    </div>
  );
}

export default CatalogCardDetailsCarosal;
