import React from "react";
import "./Brands.scss";
import request from "../../../request";
import Slider from "react-slick";
import { useStateValue } from "../../../store/state";
import { useTranslation } from "react-i18next";
import LazyLoad from 'react-lazyload';

export default function Brands() {
  const { t } = useTranslation();
  const [{ brands }, dispatch] = useStateValue();

  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    speed: 500,
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <Arrow type="next" />,
    prevArrow: <Arrow type="prev" />,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  function Arrow(props) {
    let className =
      props.type === "next"
        ? "Carosal_nextArrow_brands"
        : "Carosal_prevArrow_brands";
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
    <div className="brands">
      <h3>{t("Online marketplace with variety of brands")}</h3>
      <div className="brands__logo">
        {brands?.map((data, i) => (
          <div className="brands__img" key={i}>
            <LazyLoad height={100}>
              <img src={`${request.image}/${data.image}`} alt="" />
            </LazyLoad>
          </div>
        ))}
      </div>
      <div className="brands__logo__mobile">
        <div className="brands_carousel">
          <Slider {...settings}>
            {brands?.map((carousel, i) => (
              <div className="brands__img" key={i}>
                <LazyLoad height={100}>
                  <img src={`${request.image}/${carousel.image}`} alt="" />
                </LazyLoad>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
