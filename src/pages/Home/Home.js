import React, { useState, useEffect, Suspense, useCallback, lazy, useMemo } from "react";
// import MainBanner from "../../components/Home/MainBanner/MainBanner";
import "./Home.scss";
import { useStateValue } from "../../store/state";
import free from "../../assets/images/catalog/free.png";
import freshness from "../../assets/images/catalog/freshness.png";
import premium from "../../assets/images/catalog/premium.png";
import Carousel from "react-multi-carousel";
import { Link, useHistory } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { useTranslation } from "react-i18next";
import { Modal } from 'react-responsive-modal';
import axios from "axios";
import request from "../../request";
import LazyLoad from 'react-lazyload';
const Brands = lazy(() => import("../../components/Home/Brands/Brands"));
const AlsoLike = lazy(() =>
  import("../../components/Home/AlsoLike/AlsoLike")
);

const Dot = lazy(() =>
import ("../../components/CatalogBlockMini/Dot")
);

const MainBanner = lazy(() =>
  import("../../components/Home/MainBanner/MainBanner")
);
const CatalogBlockMini = lazy(() =>
  import("../../components/CatalogBlockMini/CatalogBlockMini")
);
const CatalogBlock = lazy(() =>
  import("../../components/CatalogBlock/CatalogBlock")
);

function Home() {
  const { t } = useTranslation();
  const [sliderimage, setsliderimage] = useState([]);
  const [{ gt }, dispatch] = useStateValue();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const onOpenModal = () => setOpen(true);
  const onCloseModal = async(value) => {
    try {
      await axios({
        method: 'post',
        url: `${request?.promoclose}${localStorage.getItem('userid')}`
      })
      setOpen(false);
    } catch(e) {
      setOpen(false);
    }
  }

  const [promolist, setpromolist] = useState([])
  useEffect(async() => {
    try {
      const promoid = await axios({
        method: 'get',
        url: `${request?.promolist}${localStorage.getItem('userid')}`
      })
      setpromolist(promoid.data)
    } catch(e) {
      return
    }
  }, [])

  const openPromo = async(value) => {
    try {
      const promodetails = await axios({
        method: 'get',
        url: `${request?.promodetails}${value}/${
          localStorage.getItem("storeid") != "undefined"
            ? localStorage.getItem("storeid")
            : 1
        }/${localStorage.getItem('userid')}`
      })
      if(promodetails?.data[0]?.details?.category_id) {
        history.push(`/catalog/${promodetails?.data[0]?.details?.category_id}`)
      }
    } catch(e) {
      console.log(e)
    }
  }

  // Slider Settings
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1440 },
      items: 14,
      slidesToSlide: 3,
    },
    // },
    largedesktop: {
      breakpoint: { max: 1440, min: 1280 },
      items: 14,
      slidesToSlide: 3,
    },
    smalldesktop: {
      breakpoint: { max: 1280, min: 1024 },
      items: 12,
      slidesToSlide: 2,
    },
    bigtab: {
      breakpoint: { max: 1024, min: 769 },
      items: 9,
      slidesToSlide: 2,
    },
    tablet: {
      breakpoint: { max: 768, min: 581 },
      items: 3,
      slidesToSlide: 3,
    },
    mobile: {
      breakpoint: { max: 580, min: 0 },
      items: 3,
      slidesToSlide: 2,
    },
  };

  useEffect(() => {
    sliderdata();
    productslider();
    onOpenModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // API call for slider in the Home Page.
  const sliderdata = async () => {
    try {
      const data = await axios({
        method: "get",
        url: request?.recommendedslider,
      });
      setsliderimage(data.data);
    } catch (e) {
      console.log(e)
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
      type: "SEARCHBAR__CLOSEOPEN",
    });
  };

  const [promotion, setpromotion] = useState([]);

  // API call for Promotion block
  const promotionslider = useCallback(async () => {
    try {
      const prodslidData = await axios({
        method: "get",
        url: `${request.productslider}/14/${
          localStorage.getItem("storeid") != "undefined"
            ? localStorage.getItem("storeid")
            : 1
        }/${
          localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
        }`,
      });
      setpromotion(prodslidData.data);
      dispatch({
        type: "GENERAL__TRIGGER",
      });
    } catch (e) {
      dispatch({
        type: "GENERAL__TRIGGER",
      });
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  });

  const [trending, settrending] = useState([]);
  // API call for trending products section
  const productslider = useCallback(async () => {
    try {
      const prodslidData = await axios({
        method: "get",
        url: `${request.productslider}/12/${
          localStorage.getItem("storeid") != "undefined"
            ? localStorage.getItem("storeid")
            : 1
        }/${
          localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
        }`,
      });
      settrending(prodslidData.data);
      dispatch({
        type: "GENERAL__TRIGGER",
      });
    } catch (e) {
      dispatch({
        type: "GENERAL__TRIGGER",
      });
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  });

  const [arrival, setarrival] = useState([]);
  // API call for new arrivals section
  const arrivalslider = useCallback(async () => {
    try {
      const prodslidData = await axios({
        method: "get",
        url: `${request.productslider}/13/${
          localStorage.getItem("storeid") != "undefined"
            ? localStorage.getItem("storeid")
            : 1
        }/${
          localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
        }`,
      });
      setarrival(prodslidData.data);
      dispatch({
        type: "GENERAL__TRIGGER",
      });
    } catch (e) {
      dispatch({
        type: "GENERAL__TRIGGER",
      });
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  });
  useEffect(() => {
    productslider();
    arrivalslider();
    promotionslider();
  }, [localStorage.getItem("storeid")]);

  const [trendsplit1, settrendsplit1] = useState([]);
  const [trendsplit2, settrendsplit2] = useState([]);
  // Spilliting the api response of trending products for the pagination.
  useEffect(() => {
    let temp1 = [];
    let temp2 = [];
    trending[0]?.products?.filter((tr, i) => {
      if (temp1.length > 5) {
        temp2.push(tr);
      } else {
        temp1.push(tr);
      }
    });

    settrendsplit1(temp1);
    settrendsplit2(temp2);
  }, [trending]);

  const [arrivalsplit1, setarrivalsplit1] = useState([]);
  const [arrivalsplit2, setarrivalsplit2] = useState([]);
  // Spilliting the api response of new arrival products for the pagination.
  useEffect(() => {
    let temp1 = [];
    let temp2 = [];
    arrival[0]?.products?.filter((tr) => {
      if (temp1.length > 5) {
        temp2.push(tr);
      } else {
        temp1.push(tr);
      }
    });

    setarrivalsplit1(temp1);
    setarrivalsplit2(temp2);
  }, [arrival]);

  const [trendshow, settrendshow] = useState(false);
  const [arrshow, setarrshow] = useState(false);

  const [parentheader, setparentheader] = useState([]);
  // API call for Category Section
  useEffect(async () => {
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
  }, [localStorage.getItem("storeid")]);

  const [hoverid, sethoverid] = useState();
  const hoverimage = (id) => {
    sethoverid(id);
  };

  const [like, setLike] = useState([]);
  // API Call for Recommended For Yuu Section
  useEffect(() => {
    async function fetchData() {
      try {
        const prodslidData = await axios({
          method: "get",
          url: `${request.productslider}/15/${
            localStorage.getItem("storeid") != "undefined"
              ? localStorage.getItem("storeid")
              : 1
          }/${
            localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
          }`,
        });
        setLike(prodslidData.data[0].products);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
  }, [localStorage.getItem("storeid"), gt]);

  const parentheaderMemo = useMemo(() =>  {
    return parentheader?.map((ph) => (
      <Link
        key={ph?.id}
        to={`/catalog/${ph?.id}`}
        className={`catlist__li ${
          hoverid === ph?.id && "hovercat" && "imgbg"
        }`}
        onMouseEnter={() => hoverimage(ph?.id)}
        onMouseLeave={() => hoverimage(0)}
      >
        
          <Suspense fallback={<Spinner/>}>
            <LazyLoad width={50} once>
            {"test" && hoverid == parseInt(ph?.id) && "hovercat" ? 
              <img
                src={`${request?.image}/${ph?.image}`}
                alt=""
                width="100%"
                height="100%"
              />
              :
              <img
                src={`${request?.image}/${ph?.colour_image}`}
                alt=""
                width="100%"
                height="100%"
              />
            }
            </LazyLoad>
          </Suspense>

        <div className={`${hoverid == parseInt(ph?.id) && "hovercat" && "imgbg"}`}>
          {t(ph?.name)}
          {ph?.subcategories?.length > 1 ? (
            <ul className={`${hoverid == parseInt(ph?.id) && "home__subcat"}`}>
              {ph?.subcategories?.map((phs, i) => (
                <li key={phs?.id}>
                  <Link to={`/catalog/${phs?.id}/${ph?.id}`} key={i}>
                    {t(phs?.name)}
                </Link>
                </li>
              ))}
            </ul>
          ) : (
            ""
          )}
        </div>
      </Link>
    ))
  }, [parentheader, hoverid])

  return (
    <div className="home" onClick={closeSide}>
      {promolist?.length ?
        <Modal open={open} 
          classNames={{
            overlay: 'customOverlay',
            modal: 'customModal__promo',
          }}
          center>
          <div className="promo__banner">
            <LazyLoad>
              {promolist?.map(pl => 
                <img src={`${request.image}media/${pl?.mainImage}`} alt="" onClick={() => openPromo(pl?.slider_id)} key={pl?.slider_id}/>
              )}
              </LazyLoad>
            <svg
              onClick={() => onCloseModal('callAPI')}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
        </Modal>
        : ""
      }

      {/* Main Banner */}
      <Suspense fallback={<Spinner />}>
        {sliderimage?.length === undefined ? (
          <Spinner />
        ) : (
          <MainBanner sliderimage={sliderimage} page="home" />
        )}
      </Suspense>

      {/* Category List */}
      <div className="home__catlist">
        <h5>
          {t("Shop by")} <span>{t("Category")}</span>
        </h5>
        <Carousel responsive={responsive} className="home__overflow"
          activeItemClass="test"
          >
          {parentheaderMemo}
        </Carousel>
      </div>

      {/* Top Two Blocks */}
      <div className="home__twobblocks">
        <div className="home__trending__products">
          <h5>{t("Trending Products")}</h5>
          <Suspense fallback={<Spinner />}>
            <CatalogBlockMini
              data={
                trendshow ? trendsplit2?.slice(0, 6) : trendsplit1?.slice(0, 6)
              }
            />
          </Suspense>
          <Dot 
            arrivalsplit2={trendsplit2.length}
            arrshow={trendshow}
            setarrshow={settrendshow}
            />
        </div>
        <div className="home__new__products">
          <h5>{t("New Arrival")}</h5>
          <Suspense fallback={<Spinner />}>
          <CatalogBlockMini
              data={
                arrshow
                  ? arrivalsplit2?.slice(0, 6)
                  : arrivalsplit1?.slice(0, 6)
                  
              }
    
            />
          </Suspense>
          <Dot 
            arrivalsplit2={arrivalsplit2.length}
            arrshow={arrshow}
            setarrshow={setarrshow}
          />
        </div>
      </div>

      {/* Promotion Block */}
      <div className="home__promotion">
        {window.innerWidth > 580 && (
          <Suspense fallback={<Spinner />}>
            <CatalogBlock
              title={t("Promotion")}
              banner={promotion[0]?.details?.mainImage}
              carouselData={promotion}
            />
          </Suspense>
        )}
        {window.innerWidth <= 580 && (
          <Suspense fallback={<Spinner />}>
            <CatalogBlockMini
              title={t("Promotion")}
              banner={promotion[0]?.details?.responsiveImage}
              data={promotion[0]?.products}
            />
          </Suspense>
        )}
      </div>

      {/* Recommended Block */}
      {like?.length > 0 ? 
        <div className="home__alsolike">
          <h4>{t("Recommended For You")}</h4> 
          <Suspense fallback={<Spinner />}>
            <AlsoLike like={like} />
          </Suspense>
        </div>
      : ""}

      {/* Static Block */}
      <div className="catalog__staticblock">
        <div className="catalog__sb">
          <img src={free} alt="" />
          <div>
            <h3>{t("Free Delivery")}</h3>
            <h5>{t("For 10 KM radius")}</h5>
          </div>
        </div>
        <div className="catalog__sb">
          <img src={freshness} alt="" />
          <div>
            <h3>{t("Premium Selections")}</h3>
            <h5>{t("From all over the globe")}</h5>
          </div>
        </div>
        <div className="catalog__sb">
          <img src={premium} alt="" />
          <div>
            <h3>{t("Freshness Guaranteed")}</h3>
            <h5>{t("Or your money back")}</h5>
          </div>
        </div>
      </div>

      {/* Blogs */}
      <div className="blog">
        <Brands />
      </div>
    </div>
  );
}

export default Home;
