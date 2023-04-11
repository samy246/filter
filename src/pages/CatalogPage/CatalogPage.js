import React, { useState, useEffect, Suspense, lazy } from "react";
import "./catalogPage.styles.scss";
import MyCatalogCatagorys from "../../components/CatalogComponents/MyCatalogCatagorys/MyCatalogCatagorys";
import { useStateValue } from "../../store/state";
import axios from "axios";
import { useTranslation } from "react-i18next";

import free from "../../assets/images/catalog/free.png";
import freshness from "../../assets/images/catalog/freshness.png";
import premium from "../../assets/images/catalog/premium.png";
import request from "../../request";

const Spinner = lazy(() => import("../../components/Spinner"));
const Brands = lazy(() => import("../../components/Home/Brands/Brands"));

const MainBanner = lazy(() =>
  import("../../components/Home/MainBanner/MainBanner")
);
const CatalogBlockMini = lazy(() =>
  import("../../components/CatalogBlockMini/CatalogBlockMini")
);
const CatalogBlock = lazy(() =>
  import("../../components/CatalogBlock/CatalogBlock")
);

function CatalogPage() {
  const { t } = useTranslation();
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    closeSide();
    productslider();
  }, []);
  

  // Call the API, when different store selected
  useEffect(() => {
    productslider();
  }, [localStorage.getItem("storeid")]);

  const [carouselData, setcarouselData] = useState([]);
  // API Call for Top Trending Section
  const productslider = async () => {
    try {
      const prodslidData = await axios({
        method: "get",
        url: `${request.productslider}/7/${
          localStorage.getItem("storeid") != "undefined"
            ? localStorage.getItem("storeid")
            : 1
        }/${
          localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
        }`,
      });
      setcarouselData(prodslidData.data);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const closeSide = () => {
    dispatch({
      type: "SET_MINICART",
      value: false,
    });
    dispatch({
      type: "SET_MINIMENU",
      value: false,
    });
    dispatch({
      type: "SET_NOTIFICATION",
      value: false,
    });
    dispatch({
      type: "SET_LANGUAGE",
    });
    dispatch({
      type: "SEARCHBAR__CLOSEOPEN",
    });
  };
  const [Categoryone, setCategoryone] = useState([]);
  const [Categorytwo, setCategorytwo] = useState([]);
  const [Categorythree, setCategorythree] = useState([]);

  useEffect(() => {
    catone();
    cattwo();
    catthree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("storeid")]);

  // Catalog Block one
  const catone = async () => {
    try {
      const reslidData = await axios({
        method: "get",
        url: `${request.productslider}/8/${
          localStorage.getItem("storeid") != "undefined"
            ? localStorage.getItem("storeid")
            : 1
        }/${
          localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
        }`,
      });
      setCategoryone(reslidData.data);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  // Catalog Block two
  const cattwo = async () => {
    try {
      const reslidData = await axios({
        method: "get",
        url: `${request.productslider}/9/${
          localStorage.getItem("storeid") != "undefined"
            ? localStorage.getItem("storeid")
            : 1
        }/${
          localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
        }`,
      });
      setCategorytwo(reslidData.data);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  // Catalog Block three
  const catthree = async () => {
    try {
      const reslidData = await axios({
        method: "get",
        url: `${request.productslider}/10/${
          localStorage.getItem("storeid") != "undefined"
            ? localStorage.getItem("storeid")
            : 1
        }/${
          localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
        }`,
      });
      setCategorythree(reslidData.data);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const [count, setcount] = useState(0);
  // Number of products to show in the 3 Blocks, based in the screen size.
  useEffect(() => {
    if (window.innerWidth >= 1280) {
      setcount(8);
    }
    if (window.innerWidth <= 1200) {
      setcount(6);
    }
    if (window.innerWidth <= 912) {
      setcount(4);
    }
    if (window.innerWidth <= 768) {
      setcount(3);
    }
    if (window.innerWidth <= 580) {
      setcount(6);
    }
  }, [window.innerWidth]);

  const [sliderdata, usesliderdata] = useState([]);

  // API for Banner Sliders
  useEffect(async () => {
    try {
      const maindata = await axios({
        method: "get",
        url: request.promoslider,
      });
      usesliderdata(maindata.data);
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <section className="catalogpage" onClick={closeSide}>

      {/* Category List */}
      <div className="catalogpage__body ">
        <div className="catalogpage__mycatalogs margin">
          <h4 className="mycatalogs_heading fw-bold mb-3">
            {t("Shop by")} <span>{t("Category")}</span>
          </h4>
          <div className="mycatalogs bg-white">
            <div className="mycatalogs__container">
              <MyCatalogCatagorys pagetype="catalog" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Trending Desktop */}
      {window.innerWidth > 580 && (
        <Suspense fallback={<Spinner height="840px" />}>
          {carouselData[0]?.products?.length === undefined ? (
            <Spinner />
          ) : (
            <CatalogBlock
              banner={carouselData[0]?.details?.mainImage}
              carouselData={carouselData}
              title={carouselData[0]?.details?.title}
            />
          )}
        </Suspense>
      )}

      {/* Top Trending Mobile */}
      <div className="catalog__trending">
        {window.innerWidth <= 580 && (
          <Suspense fallback={<Spinner />}>
            {carouselData[0]?.products?.length === undefined ? (
              <Spinner />
            ) : (
              <CatalogBlockMini
                title={t("Top Trending")}
                banner={carouselData[0]?.details?.responsiveImage}
                data={carouselData[0]?.products}
              />
            )}
          </Suspense>
        )}
      </div>

      {/* MainBanner */}
      <Suspense fallback={<Spinner />}>
        <MainBanner sliderimage={sliderdata} />
      </Suspense>

      {/* Category Block 1 */}
      <Suspense fallback={<Spinner />}>
        {Categoryone[0]?.products?.length === undefined ? (
          <Spinner />
        ) : (
          <CatalogBlockMini
            banner={
              window.innerWidth > 580
                ? Categoryone[0]?.details?.mainImage
                : Categoryone[0]?.details?.responsiveImage
            }
            title={Categoryone[0]?.details?.title}
            catid={Categoryone[0]?.details?.category}
            data={Categoryone[0]?.products?.slice(0, count)}
          />
        )}
      </Suspense>

      {/* Category Block 2 */}
      <Suspense fallback={<Spinner />}>
        {Categorytwo[0]?.products?.length === undefined ? (
          <Spinner />
        ) : (
          <CatalogBlockMini
            banner={
              window.innerWidth > 580
                ? Categorytwo[0]?.details?.mainImage
                : Categorytwo[0]?.details?.responsiveImage
            }
            title={Categorytwo[0]?.details?.title}
            catid={Categorytwo[0]?.details?.category}
            data={Categorytwo[0]?.products?.slice(0, count)}
          />
        )}
      </Suspense>

      {/* Category Block 3 */}
      <Suspense fallback={<Spinner />}>
        {Categorythree[0]?.products?.length === undefined ? (
          <Spinner />
        ) : (
          <CatalogBlockMini
            banner={
              window.innerWidth > 580
                ? Categorythree[0]?.details?.mainImage
                : Categorythree[0]?.details?.responsiveImage
            }
            title={Categorythree[0]?.details?.title}
            catid={Categorythree[0]?.details?.category}
            data={Categorythree[0]?.products?.slice(0, count)}
          />
        )}
      </Suspense>

      {/* Static Block */}
      <div className="catalog__staticblock">
        <div className="catalog__sb">
          <img src={free} alt="" />
          <p>
            <h3>{t("Free Delivery")}</h3>
            <h5>{t("For 10 KM radius")}</h5>
          </p>
        </div>
        <div className="catalog__sb">
          <img src={freshness} alt="" />
          <p>
            <h3>{t("Premium Selections")}</h3>
            <h5>{t("From all over the globe")}</h5>
          </p>
        </div>
        <div className="catalog__sb">
          <img src={premium} alt="" />
          <p>
            <h3>{t("Freshness Guaranteed")}</h3>
            <h5>{t("Or your money back")}</h5>
          </p>
        </div>
      </div>
      
      {/* Blogs */}
      <div className="blog">
        <Brands />
      </div>
    </section>
  );
}

export default CatalogPage;
