import React, { useState, useEffect } from "react";
import AlsoLike from "../../Home/AlsoLike/AlsoLike";
import "./catalogCardDetails.scss";
import ProductDetails from "../ProductDetails/ProductDetails";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import request from "../../../request";
import Rating from "../Rating/Rating";
import { useStateValue } from "../../../store/state";
import back from "../../../assets/images/catalog/back.png";
import { useTranslation } from "react-i18next";

const CatalogCardDetails = () => {
  const [{ thumbs, gt }, dispatch] = useStateValue();
  const [display, setDisplay] = useState(false);
  const { t } = useTranslation();
  const [notaccepted, staNotaccepted] = useState(false);
  const { cid, pid, sku } = useParams();
  const [currentpdpdata, setcurrentpdpdata] = useState();
  const [currentunit, setcurrentunit] = useState();
  const [refreshpdp, setrefreshpdp] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let cid = localStorage.getItem("companyid");
      try {
        const catalogpdpdetails = await axios({
          method: "get",
          url: `${request.getcatalogpdp}/${pid}/${localStorage.getItem(
            "storeid"
          ) != "undefined" ? localStorage.getItem(
            "storeid"
          ): 1 }/${cid ? cid : 0}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setcurrentpdpdata(catalogpdpdetails.data[0]);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sku, refreshpdp, localStorage.getItem(
    "storeid"
  )]);

  const showhandler = () => {
    setTimeout(() => {
      setDisplay(true);
    }, 2000);
    setTimeout(() => {
      setDisplay(false);
      staNotaccepted(true);
    }, 3000);
    setTimeout(() => {
      staNotaccepted(false);
      setDisplay(false);
    }, 4000);
  };

  const [ratingdata, setratingdata] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const getrating = await axios({
          method: "get",
          url: `${request.getratingreview}/${pid}`,
        });

        setratingdata(getrating.data);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbs, pid]);

  const [bought, setbought] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const boughttogther = await axios({
          method: "get",
          url: `${request.productslider}/6/${
            localStorage.getItem("storeid") != "undefined"
              ? localStorage.getItem("storeid")
              : 1
          }/${
            localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
          }`,
        });
        setbought(boughttogther?.data);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gt,localStorage.getItem("storeid")]);

  const [bt, setBT] = useState();
  useEffect(() => {
    if (pid === undefined) return;
    async function fetchData() {
      try {
        const boughtTog = await axios({
          method: "get",
          url: `${request.productslider}/11/${
            localStorage.getItem("storeid") != "undefined"
              ? localStorage.getItem("storeid")
              : 1
          }/${
            localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
          }`,
        });
        setBT(boughtTog?.data);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid, gt, localStorage.getItem("storeid")]);

  const [sMore, setSMore] = useState(false);

  return (
    <div className="CatalogCardDetails ">
      <div className="CatalogCardDetails__main ">
        <section className="CatalogCardDetails__top__section">
          <nav
            className="CatalogCardDetails__breadcrum"
            aria-label=" breadcrumb"
          >
            <Link
              className="CatalogCardDetails__Back_prev text-dark"
              to={`/catalog/${cid}`}
            >
              <img src={back} alt="" />
            </Link>
            <ol className="breadcrumb">
              <li className="breadcrumb-item arrow">
                <Link className="home" to="/">
                {t("Home")}
                </Link>
              </li>
              <li className="breadcrumb-item arrow">
                <Link className="mycatalog" to="/catalog">
                {t("My Catalogs")}
                  
                </Link>
              </li>
              <li className="breadcrumb-item arrow">
                <Link className="Seafood" to={`/catalog/${cid}`}>
                  {t(currentpdpdata?.category_name)}
                </Link>
              </li>{" "}
              <li className="breadcrumb-item active" aria-current="page">
                <p className="Frozen">{sku}</p>
              </li>
            </ol>
          </nav>
          <div className="CatalogCardDetails_stock pb-2"></div>

          <div
            className={`position-relative ${display ? "d-none" : "d-block"}`}
          >
            <p
              className={`position-absolute price__not_accepted ${
                notaccepted ? "d-block" : "d-none"
              }`}
            >
              Sorry!! The quoted price was not accepted{" "}
            </p>
          </div>
          {/* <div
            className={`position-relative ${display ? "d-block" : "d-none"}`}
          >
            <span className="h1 CatalogCardDetails__price ">฿760.00</span>
            <p className="position-absolute  hiden-date">
              Price Expires on: 1/10/2020{" "}
            </p>
            <span className="off_badge position-absolute">45% off</span>
            <p className="CatalogCardDetails__price__exp">
              Price Expires on 1/10/2022
            </p>
          </div> */}
        </section>
        <section className="CatalogCardDetail_product">
          <ProductDetails
            currentpdpdata={currentpdpdata}
            pid={pid}
            setcurrentunit={setcurrentunit}
            currentunit={currentunit}
            units={currentpdpdata?.options}
            status={currentpdpdata?.quote_status}
            setrefreshpdp={setrefreshpdp}
          />
        </section>
        {/* Review */}
        {/* {ratingdata[0]?.review?.length > 0 && (
          <div className="pdp__rating">
            <div className="rating__container">
              <div className="rating__header">
                {ratingdata[0]?.review?.length > 0 && <h3>Review</h3>}

                {ratingdata[0]?.review?.length > 0 && (
                  <div className="d-flex most_useful">
                    <h4>Most Helpfull </h4>
                    <i className="fas fa-chevron-down" />
                  </div>
                )}
              </div>

              <div className="rating__content">
                {ratingdata[0]?.review?.length > 0 && (
                  <>
                    <Rating ratingdata={ratingdata[0]?.review} sMore={sMore} />
                    <div className="text-center pb-4 mt-4">
                      {!sMore ? (
                        ratingdata[0]?.review?.length > 3 && (
                          <button
                            className="btn  CatalogCardDetails__show__more btn-lg"
                            onClick={() => setSMore(true)}
                          >
                            Show More
                          </button>
                        )
                      ) : (
                        <button
                          className="btn  CatalogCardDetails__show__more btn-lg"
                          onClick={() => setSMore(false)}
                        >
                          Show Less
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )} */}

        <div className="CatalogCardDetail__carosal">
          <div className="CatalogCardDetail_carosal_div">
            {bt && bt[0]?.products?.length > 0 ? <h4>{t("Similar Products")}</h4> : ""}
            <AlsoLike like={bt && bt[0]?.products} />
          </div>
        </div>

        <div className="CatalogCardDetails_boughtTogether ">
          {bought && bought[0]?.products?.length > 0 ? <h4>{t("Bought Together")}</h4> : ""}
          <AlsoLike like={bought && bought[0]?.products} />
        </div>
      </div>
    </div>
  );
};

export default CatalogCardDetails;
