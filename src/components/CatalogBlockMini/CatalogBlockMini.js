import React, { Suspense, useState } from "react";
import "./CatalogBlockMini.scss";
import request from "../../request";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LazyLoad from 'react-lazyload';
import Spinner from "../Spinner";

function CatalogBlockMini({ banner, title, data, catid }) {
  const { t } = useTranslation();
  const [showToolTip, setShowToolTip] = useState(false)
  
  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <div className="catalogblockmini">
      <h4 className="catalogblockmini__title">{title ? t(title) : ""}</h4>
      <div
        className={`catalogblockmini__container ${
          title === "Meat" && "catalogblockmini__reversecontainer"
        }`}
      >
        <Suspense fallback={<Spinner/>}>
          <LazyLoad height={500}>
            <img
              src={`${request.image}/media/${banner}`}
              alt=""
            />
          </LazyLoad>
        </Suspense>
        <div className="container__card">
          {data?.map((d) => (
            <Suspense fallback={<Spinner/>} key={d.entity_id}>
              <LazyLoad height={240} key={d?.entity_id} offset={100}>
                <Link
                  to={`/catalogdetails/cdetails/${d.category_id}/${d.entity_id}/${d.url_key}`}
                >
                  <div>
                    <img
                      src={`${request.image}/media/catalog/product${d.thumbnail}`}
                      alt=""
                      width="100%"
                      height="100%"
                    />
                    {showToolTip == d?.entity_id && <span className="cbm__tooltip">{d?.name}</span>}
                    <h4 className="cbm__name"
                      onMouseEnter={() => setShowToolTip(d.entity_id)}
                      onMouseLeave={() => setShowToolTip("")}
                    >
                      {truncate(d?.name, 40)}
                    </h4>
                    <span className="cbm__size">Size {d?.pack_size}</span>
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
            </Suspense>
          ))}
        </div>
      </div>
      <Link to={`/catalog/${catid}`}>
        <p className="PMini__seemore">
          <span className="Mini__seemore">{t("See More")}</span>
        </p>
      </Link>
    </div>
  );
}

export default CatalogBlockMini;
