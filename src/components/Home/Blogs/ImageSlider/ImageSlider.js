import React, { useState } from "react";
import Slider from "react-slick";
import request from "../../../../request";
import "./ImageSlider.css";
const ImageSlider = ({ blogdata, slidesToShow = 3 }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const NextArrow = ({ onClick }) => {
    return (
      <div className="nextArrow" onClick={onClick}>
        <i className="fa fa-angle-right"></i>
      </div>
    );
  };
  const PrevArrow = ({ onClick }) => {
    return (
      <div className="prevArrow" onClick={onClick}>
        <i className="fa fa-angle-left"></i>
      </div>
    );
  };
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    dots: false,
    speed: 300,
    slidesToShow: slidesToShow,
    centerPadding: "0",
    swipeToSlide: true,
    focusOnSelect: true,
    nextArrow: <NextArrow onClick />,
    prevArrow: <PrevArrow onClick />,
    beforeChange: (current, next) => setImageIndex(next),
    responsive: [
      {
        breakpoint: 1490,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 820,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Slider {...settings}>
      {blogdata?.map((data, i) => (
        <div
          className={i === imageIndex ? "activeSlide" : "slide"}
          key={data?.id}
        >
          <div className="slideWrapper">
            <img
              src={`${request.image}/media/${data.featured_img}`}
              // alt={data?.alt}
              alt=""
            ></img>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
