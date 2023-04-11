import React, { useState, useEffect, Suspense } from "react";
import request from "../../request";
import NewCard from "../NewCard/NewCard";
import "./CatalogBlock.scss";
import { useTranslation } from "react-i18next";
import LazyLoad from 'react-lazyload';
import Spinner from "../Spinner";

function CatalogBlock({ banner, carouselData, title }) {
  const { t } = useTranslation();
  const [count, setcount] = useState(0);

  useEffect(() => {
    if (window.innerWidth >= 1280) {
      setcount(6);
    }
    if (window.innerWidth <= 1240) {
      setcount(4);
    }
    if (window.innerWidth <= 912) {
      setcount(2);
    }
    if (window.innerWidth <= 580) {
      setcount(4);
    }
  }, [window.innerWidth]);

  return (
    <div className="catalogblock">
      <div className="catalogblock__header">
        <h4 className="catalogblock__title">
          {t(title)}
        </h4>
        {/* {title && <span className="Mini__seemore">{t("See More")}</span>} */}
      </div>
      <div className="catalogblock__container">
        <Suspense fallback={<Spinner/>}>
          <LazyLoad height={870}>
            <img alt="" src={`${request.image}media/${banner}`} />
          </LazyLoad>
        </Suspense>
        <div className="container__card">
          {carouselData[0]?.products?.slice(0, count)?.map((data, i) => (
            <LazyLoad height={430} key={i}>
              <NewCard
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
            </LazyLoad>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CatalogBlock;
