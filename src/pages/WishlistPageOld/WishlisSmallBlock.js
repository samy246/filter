import React, { useState, useMemo } from "react";
//import "../../pages/Home/Home.scss";
// import "./SmallBlock.scss"
// import "../../components/CatalogBlockMini/CatalogBlockMini.scss"
import request from "../../request";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LazyLoad from 'react-lazyload';

function WishlistSmallBlock({ banner, title, data, catid, arrivalsplit2, arrshow, setarrshow }) {

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToScroll: window.innerWidth > 1300 ? 5 : window.innerWidth > 1024 ? 4 : window.innerWidth > 768 ? 3 : window.innerWidth > 300 && 2,
    slidesToShow: window.innerWidth > 1300 ? 5 : window.innerWidth > 1024 ? 4 : window.innerWidth > 768 ? 3 : window.innerWidth > 300 && 2,
    initialSlide: 0,
    speed: 400,
  };

  const { t } = useTranslation();
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  const recommendedCarouselMobile = useMemo(() => {
    {
      return data?.map((d, i) => (
        <LazyLoad height={240} key={d?.entity_id}>
          <div className="container__card">
            <Link
              to={`/catalogdetails/cdetails/${d.category_id}/${d.entity_id}/${d.url_key}`}
            >
              <div style={{ position: "relative", overflow: "hidden" }}>

                <img
                  src={`${request.image}/media/catalog/product${d.thumbnail}`}
                  width="100%"
                  height="100%"
                  alt=""
                />
                <h4>{truncate(d.name, 25)}</h4>
                <h4>
                  Size {d?.pack_size}
                </h4>
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
  }, [data, window.innerWidth]);

  return (
    <>
      <div className="wishlistcatalogblockmini">
        <h4 className="wishlistcatalogblockmini__title">{title ? t(title) : ""}</h4>
        <div
          className={`wishlistcatalogblockmini__container ${title === "Meat" && "wishlistcatalogblockmini__reversecontainer"
            }`}
        >
          <LazyLoad height={500} >
            <img
              src={`${request.image}/media/${banner}`}
              alt=""
            />
          </LazyLoad>
          {
            window.innerWidth > 480 && (
              <div className="container__card">
                {data?.map((d) => (
                  <LazyLoad height={240} key={d?.entity_id} offset={100}>
                    <Link
                      to={`/catalogdetails/cdetails/${d.category_id}/${d.entity_id}/${d.url_key}`}>
                      <div>
                        <img
                          src={`${request.image}/media/catalog/product${d.thumbnail}`}
                          alt=""
                          width="100%"
                          height="100%"
                        />
                        <h4 className="cbm__name">
                          {truncate(d.name, 40)}
                        </h4>
                        <h4 className="cbm__size">
                          Size {d?.pack_size}
                        </h4>
                        <h5>
                          ฿{" "}
                          {d.price % 1 === 0
                            ? `${formatToCurrency(parseInt(d.price))}.00`
                            : formatToCurrency(parseFloat(d.price).toFixed(2))
                          }
                          <span>/ {d?.selling_unit}</span>
                        </h5>
                      </div>
                    </Link>
                  </LazyLoad>
                ))}

              </div>
            )
          }


          <div className="carousel product_card_carousel">
            {

              window.innerWidth <= 480 && (
                <Slider {...settings}>{recommendedCarouselMobile}</Slider>
              )


            }

          </div>






        </div>




        {/* <Link to={`/catalog/${catid}`}>
          <p className="PMini__seemore">
            <span className="Mini__seemore">{t("See More")}</span>
          </p>
        </Link> */}
      </div>

    </>
  );
}

export default WishlistSmallBlock;
