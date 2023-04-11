import React, { useMemo } from "react";
import "./AlsoLike.scss";
import NewCard from "../../NewCard/NewCard";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import request from "../../../request";
import LazyLoad from 'react-lazyload';

function AlsoLike({ like, title }) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToScroll: window.innerWidth > 1300 ? 5 : window.innerWidth > 1024 ? 4 : window.innerWidth > 768 ? 3 : window.innerWidth > 300 && 2,
    slidesToShow: window.innerWidth > 1300 ? 5 : window.innerWidth > 1024 ? 4 : window.innerWidth > 768 ? 3 : window.innerWidth > 300 && 2,
    initialSlide: 0,
    speed: 400,
  };

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const recommendedCarousel = useMemo(() => {
    {
      return like?.map((data, i) => (
        <LazyLoad height={430} key={i}>
          <NewCard
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
        </LazyLoad>
      ));
    }
  }, [like, window.innerWidth]);

  const recommendedCarouselMobile = useMemo(() => {
    {
      return like?.map((d, i) => (
        <LazyLoad height={240} key={i}>
          <div className="container__card">
            <Link
              to={`/catalogdetails/cdetails/${d.category_id}/${d.entity_id}/${d.url_key}`}
            >
              <div style={{ position: "relative", overflow: "hidden" }}>
                {/* <div className="top-Minileft">
                  <p className="top-left-percent">34%</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="31"
                    height="51"
                    fill="currentColor"
                    class="bi bi-bookmark-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
                  </svg>
                </div>
                <div className="top-Miniright">BUY 1 GET 1 FREE</div> */}
                <img
                  src={`${request.image}/media/catalog/product${d.thumbnail}`}
                  width="100%"
                  height="100%"
                  alt=""
                />
                <h4>{truncate(d.name, 25)}</h4>
                <h5>
                  ฿{" "}
                  {d.price % 1 === 0
                    ? `${formatToCurrency(parseInt(d.price))}.00`
                    : formatToCurrency(parseFloat(d.price).toFixed(2))}
                  <span>/ {d?.unit}</span>
                </h5>
              </div>
            </Link>
          </div>
        </LazyLoad>
      ));
    }
  }, [like, window.innerWidth]);

  return (
    <div className="carousel product_card_carousel">
      <h3>{title ? title : ""}</h3>
      {window.innerWidth > 480 && (
        <Slider {...settings}>{recommendedCarousel}</Slider>
      )}

      {window.innerWidth <= 480 && (
        <Slider {...settings}>{recommendedCarouselMobile}</Slider>
      )}
    </div>
  );
}

export default AlsoLike;
