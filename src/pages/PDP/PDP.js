import React, { useState, useEffect } from "react";
import "./PDP.scss";
import { Link, useParams } from "react-router-dom";
import AlsoLike from "../../components/Home/AlsoLike/AlsoLike";
import ProductDetails from "../../components/CatalogComponents/ProductDetails/ProductDetails";
import { useStateValue } from "../../store/state";
import axios from "axios";
import { toast } from "react-toastify";
import request from "../../request";
import Rating from "../../components/CatalogComponents/Rating/Rating";
import back from "../../assets/images/catalog/back.png";
import { useTranslation } from "react-i18next";

function PDP() {
  const [{ thumbs }, dispatch] = useStateValue();
  const { cid, pid, sku } = useParams();
  const [currentpdpdata, setcurrentpdpdata] = useState();
  const [currentunit, setcurrentunit] = useState();
  const { t } = useTranslation();
  

  useEffect(() => {
    async function fetchData() {
      try {
        const productpdpdetails = await axios({
          method: "get",
          url: `${request.getproductpdp}/${localStorage.getItem(
            "companyid"
          )}/${pid}/${localStorage.getItem("storeid") != "undefined" ? localStorage.getItem("storeid") : 1}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setcurrentpdpdata(productpdpdetails.data[0]);
        console.log("pdp productpdpdetails.data[0]",productpdpdetails.data[0]);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("storeid")]);

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

  useEffect(() => {
    closeSide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [ratingdata, setratingdata] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const getrating = await axios({
          method: "get",
          url: `${request.getratingreview}/${pid}`,
        });

        setratingdata(getrating);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, []);

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
  }, [pid]);

  const [sMore, setSMore] = useState(false);

  return (
    <div className="pdp" onClick={closeSide}>
      <div className="pdp__sticky">
        <div className="pdp__topSection">
          <Link
            className="CatalogCardDetails__Back_prev text-dark"
            to={`/product/${cid}`}
          >
            <img src={back} alt="" />
          </Link>
          <div className="product__breadcrumbs">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item arrow">
                  <Link to="/">{t("Home")}</Link>
                </li>
                <li className="breadcrumb-item arrow">
                  <Link to="/product/0">{t("Product")}</Link>
                </li>
                <li className="breadcrumb-item arrow">
                  <Link to={`/product/${cid}`}>
                    {t(currentpdpdata?.category_name)}
                  </Link>
                </li>
                <li
                  className="breadcrumb-item active"
                  aria-current="page"
                  style={{ color: "#37BFA7" }}
                >
                  {sku}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="pdp__detailedCard">
        <ProductDetails
          currentpdpdata={currentpdpdata}
          pid={pid}
          setcurrentunit={setcurrentunit}
          currentunit={currentunit}
        />
      </div>


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

      <div className="pdp__similiar">
      {bt && bt[0]?.products?.length > 0 ? <h4>{t("Similar Products")}</h4> : ""}
        <AlsoLike like={bt && bt[0]?.products} />
      </div>
      <div className="pdp__together">
      {bought && bought[0]?.products?.length > 0 ? <h4>{t("Bought Together")}</h4> : ""}
        <AlsoLike like={bought && bought[0]?.products} />
      </div>
    </div>
  );
}

export default PDP;
