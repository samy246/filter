import React from "react";
import "./MainBanner.scss";
import Slider from "react-slick";
import request from "../../../request";
import LazyLoad from 'react-lazyload';

function MainBanner({ sliderimage, page }) {
  var settings = {
    dots: page === "home" ? false : true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrow: true,
    autoplay: true,
  };

  return (
    <div className="mainBanner">
      <Slider {...settings}>
        {sliderimage?.map((data, i) => (
          <div key={i}>
            <LazyLoad height={365}>
              <img src={`${request.image}/${data.image}`} alt="" />
            </LazyLoad>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default MainBanner;
