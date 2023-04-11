import React from "react";
import Slider from "react-slick";
import "./carousel.scss";
import CarouselCard from "../CarouselCard/CarouselCard";
import request from "../../../request";
import NewCard from "../../NewCard/NewCard";

export default function CatalogCarousel({ carouselData }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    lazyLoad: true,
    slidesToScroll: 2,
    slidesToShow: 8,
    initialSlide: 8,
    nextArrow: <Arrow type="next" />,
    prevArrow: <Arrow type="prev" />,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 2,
          initialSlide: 8,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 2,
          initialSlide: 7,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 2,
          initialSlide: 6,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 4,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
    ],
  };

  function Arrow(props) {
    let className =
      props.type === "next" ? "Carosal_nextArrow" : "Carosal_prevArrow";
    className += " arrow";
    const char =
      props.type === "next"
        ? "fas fa-chevron-circle-right text-success fa-xs"
        : "fas fa-chevron-circle-left text-success fa-xs";
    return (
      <span className={className} onClick={props.onClick}>
        <i className={char} />
      </span>
    );
  }

  return (
    <div className="carousel catalog_carousel">
      <Slider {...settings}>
        {carouselData?.map((data, i) => (
          <NewCard
            key={i}
            pid={data.entity_id}
            sku={data.sku}
            delvieryColor="green"
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
            quote={data?.quote}
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
