import React, { useState, useEffect, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
// import Carousel from "react-multi-carousel";
import "./MyCatalogCatagorys.scss";
import axios from "axios";
import request from "../../../request";
import Spinner from "../../Spinner";
import { useTranslation } from "react-i18next";
import LazyLoad from 'react-lazyload';

const Carousel = React.lazy(() => import("react-multi-carousel"));

function MyCatalogCatagorys({
  pagetype,
  cid,
  setcurrentcat,
  searchstring,
  country,
  selecttype,
  discountdata,
}) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    if (window.location.pathname === "/") return;
    setActiveIndex((activeIndex) => (activeIndex = cid));
  }, [cid]);

  const [cathigh, setcathigh] = useState([]);

  useEffect(async () => {
    if (pagetype == "searchpage") {
      try {
        const searchcat = await axios({
          method: "post",
          url: `${request.searchpagecategory}/${searchstring}/${
            localStorage.getItem("companyid")
              ? localStorage.getItem("companyid")
              : 0
          }/${
            localStorage.getItem("storeid") != "undefined"
              ? localStorage.getItem("storeid")
              : 1
          }/${
            localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
          }?category_id=0&type_id=${selecttype}&country_id=${country}&discount_from=${parseInt(
            discountdata?.from
          )}&discount_to=${discountdata?.to}`,
        });
        setcathigh(searchcat.data);
      } catch (e) {
        console.log(e);
      }
    }
    if (pagetype == "product") {
      try {
        const searchcat = await axios({
          method: "post",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          url: `${request.productcathighlight}/${
            localStorage.getItem("companyid")
              ? localStorage.getItem("companyid")
              : 0
          }/${
            localStorage.getItem("storeid") != "undefined"
              ? localStorage.getItem("storeid")
              : 1
          }/${
            localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
          }?&type_id=0&country_id=0&discount_from=0&discount_to=0&current_page=0`,
        });
        setcathigh(searchcat.data);
      } catch (e) {
        console.log(e);
      }
    }
  }, [pagetype, localStorage.getItem("storeid")]);

  const [parentheader, setparentheader] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const parent = await axios({
          method: "get",
          url: `${request.parentcategory}/2/${
            localStorage.getItem("companyid")
              ? localStorage.getItem("companyid")
              : 0
          }/${
            localStorage.getItem("storeid") != "undefined"
              ? localStorage.getItem("storeid")
              : 1
          }/${
            localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
          }`,
        });
        setparentheader(parent.data);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("storeid")]);

  useEffect(() => {
    if (window.location.pathname === "/") return;
    parentheader?.filter((p) => {
      if (p.id === cid) {
        setcurrentcat(p.name);
      }
    });
  }, [id, parentheader]);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1441 },
      items: 10,
      slidesToSlide: 3,
    },
    // },
    largedesktop: {
      breakpoint: { max: 1440, min: 1281 },
      items: 10,
      slidesToSlide: 3,
    },
    smalldesktop: {
      breakpoint: { max: 1280, min: 913 },
      items: 8,
      slidesToSlide: 2,
    },
    bigtab: {
      breakpoint: { max: 912, min: 769 },
      items: 6,
      slidesToSlide: 2,
    },
    tablet: {
      breakpoint: { max: 768, min: 581 },
      items: 4,
      slidesToSlide: 3,
    },
    mobile: {
      breakpoint: { max: 580, min: 0 },
      items: 3,
      slidesToSlide: 2,
    },
  };
  let data;
  useEffect(() => {
    let tempid;
    if (parentheader.length > 0) {
      parentheader?.map((itm, index) => {
        if (itm.id === cid) {
          tempid = index;
          // data?.goToSlide(cid);
        }
      });
      data?.goToSlide(tempid);
    }
  }, [cid]);

  const [prcount, setprcount] = useState();
  useEffect(() => {
    let temp = [];
    parentheader?.map((ph) => {
      if (ph?.myproduct_count > 0) {
        temp.push(ph?.myproduct_count);
      }
    });
    const sum = temp.reduce((a, b) => a + b, 0);
    setprcount(sum);
  }, [parentheader]);

  const [hoverid, sethoverid] = useState();
  const hoverimage = (id) => {
    sethoverid(id);
  };

  return (
    <div className="carousel__menu">
      <div style={{ position: "relative" }}>
        <Suspense fallback={<Spinner />}>
          {pagetype === "catalog" ? (
            <Carousel responsive={responsive} className="home__overflow">
              {parentheader?.map((d) => (
                <LazyLoad height={124} key={d.id}>
                  <div
                    className={`catalogs__categoryList ${
                      activeIndex === d.id ? "active" : "unactive"
                    }`}
                  >
                    <div
                      className={`catalogs__categoryList__div ${
                        cid === d?.id && "img__selected"
                      }`}
                    >
                      <Link
                        className={`d-flex ${hoverid === d?.id && "hovercat"}`}
                        to={`/${pagetype}/${d.id ? d.id : 0}`}
                        onMouseEnter={() => hoverimage(d?.id)}
                        onMouseLeave={() => hoverimage(0)}
                      >
                        {hoverid === d?.id && "hovercat" ? (
                          <>
                            <img src={`${request.image}/${d.image}`} alt="" />
                          </>
                        ) : (
                          <>
                          {
                          d?.id === id ?
                          <>
                            <img src={`${request.image}/${d.image}`} alt="" />
                          </>
                          :
                          <>
                            <img src={`${request.image}/${d.colour_image}`} alt="" />
                          </>
                          }
                          </>
                        )}
                        <span
                          className={`${cid === d?.id && "text__selected"} ${
                            hoverid === d?.id && "hovercat"
                          }`}
                        >
                          <p className={`${hoverid === d?.id && "hovercat" && "imgbg"}`}>
                            {t(d?.name)}
                            {d?.subcategories?.length > 1 ? (
                              <ul className={`${hoverid === d?.id ? "home__subcat" : "hideul"}`}>
                                {d?.subcategories?.map((phs, i) => (
                                  <Link to={`/catalog/${phs?.id}`} key={i}>
                                    <li>{t(phs?.name)}</li>
                                  </Link>
                                ))}
                              </ul>
                            ) : (
                              ""
                            )}
                          </p>
                        </span>
                      </Link>
                    </div>
                  </div>
                </LazyLoad>
              ))}
            </Carousel>
          ) : (
            <Carousel responsive={responsive} keyBoardControl={true}>
              {cathigh?.length
                ? cathigh?.map((d, index) => (
                    <div
                      className={`catalogs__categoryList ${
                        activeIndex === d.id ? "active" : "unactive"
                      }`}
                      key={index}
                    >
                      <div
                        className={`catalogs__categoryList__div ${
                          cid === d?.id && "img__selected"
                        }`}
                      >
                        <Link
                          className="d-flex"
                          to={
                            pagetype == "searchpage"
                              ? `/${pagetype}/${searchstring}/${
                                  d.id ? d.id : 0
                                }`
                              : `/${pagetype}/${d.id ? d.id : 0}`
                          }
                        >
                          <>
                              {cid === d.id ? (
                                <img
                                  src={`${request.image}/${d.image}`}
                                  alt=""
                                />
                              ) : d?.product_count > 0 ||
                                d?.id === "0" &&
                                  prcount > 0 ? (
                                <img
                                  src={`${request.image}/${d.colour_image}`}
                                  alt=""
                                />
                              ) : (
                                <img
                                  src={`${request.image}/${d.grey_image}`}
                                  alt=""
                                />
                              )}

                              <span
                                className={`${
                                  cid === d?.id && "text__selected"
                                }`}
                              >
                                {t(d?.name)}
                              </span>
                            </>
                        </Link>
                      </div>
                    </div>
                  ))
                : parentheader?.map((d, index) => (
                    <div
                      className={`catalogs__categoryList ${
                        activeIndex === d.id ? "active" : "unactive"
                      }`}
                      key={index}
                    >
                      <div
                        className={`catalogs__categoryList__div ${
                          cid === d?.id && "img__selected"
                        }`}
                      >
                        <Link
                          className="d-flex"
                          to={`/${pagetype}/${searchstring}/${d.id ? d.id : 0}`}
                        >
                          {cid === d.id ? (
                            <img src={`${request.image}/${d.image}`} alt="" />
                          ) : (d?.myproduct_count > 0 &&
                              pagetype === "product") ||
                            (d?.id === "0" &&
                              prcount > 0 &&
                              pagetype === "product") ? (
                            <img
                              src={`${request.image}/${d.colour_image}`}
                              alt=""
                            />
                          ) : (
                            <img
                              src={`${request.image}/${d.grey_image}`}
                              alt=""
                            />
                          )}

                          <span
                            className={`${cid === d?.id && "text__selected"}`}
                          >
                            {t(d?.name)}
                          </span>
                        </Link>
                      </div>
                    </div>
                  ))}
            </Carousel>
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default MyCatalogCatagorys;
