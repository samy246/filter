import React, { useState, useEffect } from "react";
import "./productDetails.scss";
import { useStateValue } from "../../../store/state";
import PrograssBars from "../PrograssBars/PrograssBars";
import axios from "axios";
import request from "../../../request";
import moment from "moment";
import { Modal } from "react-responsive-modal";
import ManuModal from "../../PDP/ManuModal/ManuModal";
import { toast } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import { RequestQatation } from "../CatalogPopOver/RequestQatation";
import { useParams } from "react-router";
import Slider from "react-slick";
import favoriteactive from "../../../assets/images/card/favoriteactive.png";
import favoriteinactive from "../../../assets/images/card/favoriteinactive.png";
import wishlistactive from "../../../assets/images/card/wishlistactive.png";
import wishlistinactive from "../../../assets/images/card/wishlistinactive.png";
import carticon from "../../../assets/images/card/carticon.png";
import { useTranslation } from "react-i18next";
import LazyLoad from "react-lazyload";
import Spinner from "../../Spinner";

if (typeof window !== "undefined") {
  injectStyle();
}

function ProductDetails({
  currentpdpdata,
  pid,
  setcurrentunit,
  currentunit,
  show_price,
  units,
  status,
  setrefreshpdp,
}) {
  console.log("current pdpd data",currentpdpdata);
  const { t } = useTranslation();
  const [ratingmodal, setratingmodal] = useState(false);
  const [manumodal, setmanumodal] = useState(false);
  const [currentunits, setcurrentunits] = useState([]);
  const [cimage, setcimage] = useState([]);
  const [spinner, setspinner] = useState(false);
  const [buttonstatus, setbuttonstatus] = useState(false);

  const { page } = useParams();
  const NextArrow = ({ onClick }) => {
    return (
      <div className="nextArrow" style={{ right: "-16px" }} onClick={onClick}>
        <i className="fa fa-angle-right"></i>
      </div>
    );
  };
  const PrevArrow = ({ onClick }) => {
    return (
      <div className="prevArrow" style={{ left: "-16px" }} onClick={onClick}>
        <i className="fa fa-angle-left"></i>
      </div>
    );
  };
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    autoplay: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow onClick />,
    prevArrow: <PrevArrow onClick />,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    closeSide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentpdpdata?.options === undefined) {
      return;
    } else {
      setcurrentunits(currentpdpdata?.options);
      setcurrentunit(currentpdpdata?.options[0]);
      setUnit(currentpdpdata?.options[0]?.title);
    }
  }, [currentpdpdata]);

  const checkdate = async () => {
    let erp;
    try {
      const erptoken = await axios({
        method: "post",
        url: request.erplogin,
        data: {
          username: "jagota-iskula-b2b-team",
          password: "JIBT1234!@#$",
        },
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      });
      erp = erptoken.data.data.token;
    } catch (e) {
      console.log(e);
    }

    try {
      const datechk = await axios({
        method: "get",
        // url: `${request.erprequest}/products/order-period?PRODUCT_CODE=${sku}`,
        url: `${request.erprequest}/products/${currentpdpdata?.sku}/delivery-date`,
        headers: {
          token: `Bearer ${erp}`,
        },
      });
      addToCart(datechk.data.data[0].DELIVER_DATE[0].DD);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(async () => {
    try {
      const erptoken = await axios({
        method: "post",
        url: request.erplogin,
        data: {
          username: "jagota-iskula-b2b-team",
          password: "JIBT1234!@#$",
        },
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      });
      const imgdata = await axios({
        method: "get",
        url: `${request.erprequest}/products/product-marketing-data?PRODUCT_CODE=${currentpdpdata?.sku}`,
        headers: {
          token: `Bearer ${erptoken.data.data.token}`,
        },
      });
      setcimage(imgdata.data.data[0]?.attachments?.images);
      setImage(imgdata.data.data[0]?.attachments?.images[0]);
      setspinner(false);
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentpdpdata]);

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

  const [unit, setUnit] = useState();
  const [qty, setQty] = useState(1);

  const subtractQuantity = () => {
    if (qty === 1) {
      return;
    } else {
      setQty(qty - 1);
    }
  };
  const addQuantity = () => {
    setQty(qty + 1);
  };
  const updateqty = (value) => {
    if (value.toString()?.length > 4) return;
    setQty(value);
  };
  const addToCart = async (date) => {
    let addressdata = [];
    try {
      const address = await axios({
        method: "get",
        url: `${request.getbranch}/${localStorage.getItem("userid")}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // addlist.current = address.data;
      addressdata.push(address.data);
    } catch (e) {
      // toast.error(e.response?.data?.message);
    }
    let defaultaddress;
    addressdata[0]?.find((data) => {
      if (data?.chk_default == "Y") {
        defaultaddress = data;
      }
    });
    const findsku = cart.find((c) => c.sku === currentpdpdata?.sku);
    if (cunit?.price === undefined)
      return toast.info(`${t("Unit / Price not available")}`);
    if (localStorage.getItem("token") === null)
      return toast.error(
        `${t("Please Login to Add the products to the Cart")}`
      );

    if (
      // order_taking
      currentpdpdata?.product_status
      === "2" &&
      currentpdpdata?.is_in_stock == 0
    )
      return toast.info(`${currentpdpdata?.name} is Out of Stock`);
    if (
      (currentpdpdata?.product_status === "2" &&
        currentpdpdata?.is_in_stock === "1" &&
        parseInt(currentpdpdata?.qty).toFixed(0) >= 1) ||
      currentpdpdata?.product_status === "3"
    ) {
      try {
        setbuttonstatus(true);
        const cartdata = await axios({
          method: "post",
          url: request.cartadd,
          data: {
            cartItem: {
              sku: currentpdpdata?.sku,
              quote_id: localStorage.getItem("cartid"),
              qty: qty,
              price: cunit.price,
              extension_attributes: {
                unit: cunit?.title,
              },
            },
            splitorder: {
              company_id: localStorage.getItem("companyid"),
              customer_id: localStorage.getItem("userid"),
              branch_id: defaultaddress?.address_id,
              product_id: pid,
              item_id: findsku?.item_id ? findsku?.item_id : 0,
              name: currentpdpdata?.name,
              sku: currentpdpdata?.sku,
              delivery_date: moment(date).format("YYYY-MM-DD"),
            },
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setbuttonstatus(false);
        dispatch({
          type: "CART_STATUS",
          status: cartdata.status,
        });
        if (cartdata?.data[0]?.success) {
          toast.success(
            `${currentpdpdata?.name} ${t("added to the cart Successfully")}`
          );
        } else {
          toast.info(cartdata?.data[0]?.message);
          // toast.info(``)
        }
      } catch (e) {
        // toast.error(e.response?.data?.message);
        setbuttonstatus(false);
      }
    } else {
      setbuttonstatus(false);
      return toast.info(`${currentpdpdata?.name} ${t("is Out of Stock")}`);
    }
  };

  const selectUnit = (value) => {
    setUnit(value.title);
    setcurrentunit(value);
  };

  const [{ thumbs, gt, cart }, dispatch] = useStateValue();
  const OpenManu = () => {
    setmanumodal(true);
  };

  const OpenRating = () => {
    setratingmodal(true);
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
        console.log(e);
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbs, pid]);

  const [thumgimg, setthumbimg] = useState();
  const setImage = (value) => {
    setthumbimg(value);
  };

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const [view, setView] = useState(false);
  const [fav, setFav] = useState(false);
  const [cunit, setcunit] = useState({});

  useEffect(() => {
    setcunit({ title: currentunits[0]?.title, price: currentunit?.price });
  }, [currentunits]);

  useEffect(() => {
    setFav(currentpdpdata?.wish);
  }, [currentpdpdata?.wish]);

  useEffect(() => {
    setView(currentpdpdata?.favourite);
  }, [currentpdpdata?.favourite]);

  const addToView = () => {
    if (view === true) {
      deletefromFav();
    } else {
      addToFavHandler();
    }
  };

  const Fav = () => {
    if (fav === true) {
      delFromWish();
    } else {
      addToWishHandler();
    }
  };

  const addToFavHandler = () => {
    const ctoken = localStorage.getItem("token");
    if (ctoken === null || ctoken === "" || ctoken === undefined) {
      setView(false);
      toast.warning(
        `${t("Please Login to add/Remove the product to Favourites.")}`
      );
    } else {
      addToFav();
    }
  };

  // Add to Favourite
  const addToFav = async () => {
    try {
      const viewPost = await axios({
        method: "post",
        url: request.addFav,
        data: {
          data: {
            customer_id: localStorage.getItem("userid"),
            product_id: pid,
            company_id: localStorage.getItem("companyid"),
          },
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setView(true);
      dispatch({
        type: "GENERAL__TRIGGER",
      });
      toast.success(
        `${currentpdpdata?.name} ${t("Added to the Favourite Successfully")}`
      );
    } catch (e) {
      console.log(e);
      // toast.error(e.response?.data?.message);
    }
  };

  // Delete from Fav
  const deletefromFav = async () => {
    try {
      const viewPost = await axios({
        method: "delete",
        url: `${request.deletefav}/${pid}/${localStorage.getItem("userid")}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setView(!view);
      dispatch({
        type: "GENERAL__TRIGGER",
      });
      toast.success(
        `${currentpdpdata?.name} ${t(
          "Removed from the Favourite Successfully"
        )}`
      );
    } catch (e) {
      console.log(e);
      // toast.error(e.response?.data?.message);
    }
  };

  // Delete from wishlist
  const delFromWish = async () => {
    const userid = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    try {
      const favPost = await axios({
        method: "post",
        url: request.deletewishlist,
        data: {
          customerId: userid,
          productId: pid,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFav(!fav);
      dispatch({
        type: "GENERAL__TRIGGER",
      });
      toast.success(
        `${currentpdpdata.name} ${t("Removed from the Wishlist Successfully")}`
      );
    } catch (e) {
      console.log(e);
      // toast.error(e.response?.data?.message);
    }
  };

  const addToWishHandler = () => {
    const ctoken = localStorage.getItem("token");
    if (ctoken === null || ctoken === "" || ctoken === undefined) {
      toast.warning(
        `${t("Please Login to add/Remove the product to Wishlists.")}`
      );
    } else {
      addToWish();
    }
  };

  const addToWish = async () => {
    const userid = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    try {
      const favPost = await axios({
        method: "post",
        url: request.addWishlist,
        data: {
          customerId: parseInt(userid),
          productId: parseInt(pid),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFav(true);

      dispatch({
        type: "GENERAL__TRIGGER",
      });
      toast.success(
        `${currentpdpdata.name} ${t("Added to the Wishlist Successfully")}`
      );
    } catch (e) {
      console.log(e);
      // toast.error(e.response?.data?.message);
    }
  };

  return (
    <section
      className="product__details__section bg-white position-relative"
      onClick={closeSide}
    >
      {currentpdpdata ? (
        <div className="row m-0 pt-4">
          <div className="CatalogCardDetails__image  col-lg-4 col-sm-12">
            {!spinner ? (
              <LazyLoad height={350}>
                <img className="w-100" src={thumgimg?.URL} alt="" />
              </LazyLoad>
            ) : (
              <div className="finance__spinner">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            <Slider {...settings}>
              {cimage.map((data, i) => (
                <LazyLoad height={150}>
                  <img
                    src={data?.URL}
                    key={i}
                    alt="img"
                    className="sliderimage"
                    onMouseEnter={() => setImage(data)}
                  />
                </LazyLoad>
              ))}
            </Slider>
            {/* Rating */}
            {/* <div className="review__desktop">
            <div className="CatalogCardDetails__prograss_section p-3 ">
              <div className="text-center review__star">
                <span className="d-flex review__star__span">
                  <p className="review__start__num">
                    {ratingdata[1]?.rating?.average}{" "}
                  </p>
                  <i className="fas fa-star fa-3x" />
                </span>
                <p className="rating__modal__text">
                  {ratingdata[1]?.rating?.total} {t("Ratings and")} <br />{" "}
                  {ratingdata[1]?.rating?.reviewsCount} {t("reviews")}
                </p>
              </div>
              <PrograssBars bar={ratingdata[1]?.rating} />
            </div>
          </div> */}
          </div>
          <div className="CatalogCardDetaisl__content">
            <div className="CatalogCardDetails__bank__offers pl-4">
              <span
                className={`${currentpdpdata?.name?.length > 30 && "wrapper"}`}
              >
                <p className="details__name">
                  <p className="name__fav" style={{ margin: "0" }}>
                    <span className="heading h2">{currentpdpdata?.name}</span>
                    {/* new added */}
                    <div className="pdp__faviconrequest">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {page !== "productdetails" && (
                          <RequestQatation
                            show_price={show_price}
                            units={units}
                            pid={pid}
                            status={status}
                            setrefreshpdp={setrefreshpdp}
                          />
                        )}
                      </div>
                      <span className="name__icons">
                        <p
                          onClick={Fav}
                          className={`favorite ${fav && "favSelected"}`}
                        >
                          {fav ? (
                            <img src={wishlistactive} alt="" />
                          ) : (
                            <img src={wishlistinactive} alt="" />
                          )}
                        </p>
                        <p
                          onClick={addToView}
                          className={`view ${view && "viewSelected"}`}
                        >
                          {view ? (
                            <img src={favoriteactive} alt="" />
                          ) : (
                            <img src={favoriteinactive} alt="" />
                          )}
                        </p>
                      </span>
                    </div>
                  </p>
                  <p className="avail__date">
                    {currentpdpdata?.product_status === "2" &&
                      currentpdpdata?.order_taking_end_date === "" && (
                        <>
                          {currentpdpdata?.ordertaking_upcoming_startdate ==
                          null ? (
                            <span>Not Available</span>
                          ) : (
                            <>
                              <span>
                                {t("Next Available Date")}: {""}
                              </span>
                              <span>
                                {moment(
                                  currentpdpdata?.ordertaking_upcoming_startdate
                                ).format("DD-MM-YYYY")}
                              </span>
                            </>
                          )}
                        </>
                      )}
                  </p>

                  <p className="quote__flex">
                    <span>SKU: {currentpdpdata?.sku}</span>
                  </p>

                  {/* new design */}
                  <div className="branch__size__unit">
                    <div className="pdp__line"></div>
                    <p className="pdetails__branchID">
                      <p className="pdp__brand">Brand</p>
                      <p className="pdp__brand__value">{currentpdpdata?.brand_name}</p>
                    </p>
                    <div className="pdp__line"></div>
                    <p className="pdetails__UnitSize">
                      {/* {currentpdpdata?.pack_size
                    ? `Size ${currentpdpdata?.pack_size} X ${currentpdpdata?.unit_box} ${currentpdpdata?.unit_box_unit}`
                    : "No Size data"} */}
                      {currentpdpdata?.pack_size ? (
                        <>
                          <p className="pdp__size">Size</p>
                          <p className="pdp__size__value">Size {currentpdpdata?.pack_size}</p>
                        </>
                      ) : (
                        <p className="pdp__size__value">No Size data</p>
                      )}
                    </p>
                    <div className="pdp__line"></div>

                    <p className="pdetails__sellingunit">
                      <p className="pdetails__sellingunit__unit">Unit Price</p>
                      <p className="pdp__unitsize">
                        {`฿  ${formatToCurrency(
                          parseInt(currentpdpdata?.price)
                        )}.00`}{" "}
                        / {`${currentpdpdata?.selling_unit}`}
                      </p>
                    </p>
                    <div className="pdp__line"></div>
                  </div>
                </p>

                <span className="h1 ProductCardDetails__price">
                  {cunit && cunit?.price % 1 == 0
                    ? `฿ ${formatToCurrency(parseInt(cunit?.price))}.00 `
                    : `฿ ${formatToCurrency(parseFloat(cunit?.price))}`}{" "} <span className="pdp__sellingunitcolor">/ {`${currentpdpdata?.selling_unit}`}</span>
                  <span className="approx__text">
                    <i class="fa fa-exclamation-circle" aria-hidden="true"></i>{" "}
                    Approximate Price{" "}
                  </span>
                  {/* <span className="price__unit"> {currentpdpdata?.selling_unit}</span> */}
                </span>
              </span>
              {page == "productdetails" ? (
                <div className="CatalogCardDetails__product__date pt-1 pb-1">
                  <div>
                    <p className="pdp__priceexpiry">
                      {t("Price Valid till")}:{" "}
                      {moment(currentpdpdata?.expired_at).format("YYYY-MM-DD")}
                    </p>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="quantity">
                <div className="quantity__box">
                  <div className="box__unit">
                    <div className="d-flex CardDetails__product__add_options">
                      <div className="cart__quantity">
                        <button
                          onClick={subtractQuantity}
                          className="Cart__subtract btn rounded-pill"
                        >
                          <i className="fas fa-minus" />
                        </button>
                        <input
                          className="input__qty"
                          type="number"
                          value={qty}
                          onChange={(e) =>
                            updateqty(Math.trunc(e.target.value))
                          }
                          // disabled
                        />
                        <button
                          onClick={addQuantity}
                          className="Cart__add btn rounded-pill"
                        >
                          <i className="fas fa-plus" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* <div className="pieces">
                  <div className="minicard__units">
                    {currentunits?.map((cu) => (
                      <p
                        onClick={() =>
                          setcunit({ title: cu?.title, price: cu?.price })
                        }
                        className={`${
                          cunit?.title === cu?.title && "minicard__unitSelected"
                        } unit__kg`}
                      >
                        {cu?.title}
                      </p>
                    ))}
                  </div>
                </div> */}
                  {currentpdpdata?.is_in_stock == 0 &&
                  currentpdpdata?.product_status === "1" ? (
                    <button
                      type="button"
                      className="btn add_tocart pdp__cart__disabled"
                      disabled
                    >
                      {t("Out of Stock")}
                    </button>
                  ) : (
                    <>
                      {currentpdpdata?.order_taking === "N" && (
                        <button
                          type="button"
                          className="btn add_tocart"
                          onClick={checkdate}
                        >
                          <img src={carticon} alt="" />
                          &nbsp;{t("Add")}
                        </button>
                      )}
                      {currentpdpdata?.product_status === "3" &&
                        currentpdpdata?.order_taking_end_date !== "" && (
                          <button
                            type="button"
                            className="btn add_tocart"
                            onClick={checkdate}
                          >
                            <img src={carticon} alt="" />
                            &nbsp;{t("Add")}
                          </button>
                        )}
                      {currentpdpdata?.product_status
 === "2" &&
                        currentpdpdata?.order_taking_end_date === "" && (
                          <button
                            type="button"
                            className="btn add_tocart pdp__cart__disabled"
                            disabled
                          >
                            <img src={carticon} alt="" />
                            &nbsp;{t("Not Available")}
                          </button>
                        )}
                    </>
                  )}
                </div>
              </div>
              {/* Available Offers */}
              {/* <div className="offers">
              <p className="fw-bold title">{t("Available Offers")}</p>
              <p className="content">
                <span className="label">Bank Offer 10% off</span>{" "}
                <span className="value">
                  on SCB Bank Credit Cards, up to 3,000฿. On orders of 5,000฿
                  and above
                </span>
              </p>
              <p className="content">
                <span className="label">Bank offer 12% off</span>
                <span className="value">
                  on BKK Bank Credit Cards, up to 4,000฿. On orders of 7,000฿
                  and above
                </span>
              </p>
              <p className="content">
                <span className="label">Bank offer 5% off</span>
                <span className="value">
                  {" "}
                  Unlimited Cashback on TMB Bank Credit Card
                </span>
              </p>
            </div> */}
            </div>

            {currentpdpdata?.description && (
              <div className="product__info">
                <h5>Description</h5>
                <p style={{ whiteSpace: "pre-line" }}>
                  {currentpdpdata?.description}
                </p>
              </div>
            )}

            {/* Specification */}
            {/* <div>
            <h5>{t("Specification")}</h5>
            <div className="pdp__specification">
              <ul>
                <li>
                  <span className="label">{t("Code")} :</span>
                  <span className="value">{currentpdpdata?.sku}</span>
                </li>
                <li>
                  <span className="label">{t("Brand")} :</span>
                  <span className="value">{currentpdpdata?.brand}</span>
                </li>
                <li>
                  <span className="label">{t("Weight")} :</span>
                  <span className="value">Code</span>
                </li>
                <li>
                  <span className="label">{t("Type")} :</span>
                  <span className="value">Code</span>
                </li>
                <li>
                  <span className="label">{t("Country")} :</span>
                  <span className="value">
                    {currentpdpdata?.country_of_manufacture}
                  </span>
                </li>
              </ul>
              <ul>
                <li>
                  <span className="label">{t("Organic")} :</span>
                  <span className="value">
                    {currentpdpdata?.organic ? "Yes" : "No"}
                  </span>
                </li>
                <li>
                  <span className="label">{t("Packaging")} :</span>
                  <span className="value">
                    {currentpdpdata?.options_container}
                  </span>
                </li>
                <li>
                  <span className="label">{t("Unit / Box")} :</span>
                  <span className="value">Code</span>
                </li>
                <li>
                  <span className="label">{t("Pack Size")} :</span>
                  <span className="value">Code</span>
                </li>
                <li>
                  <span className="label">{t("Max Shelf Life")} :</span>
                  <span className="value">
                    {currentpdpdata?.maximum_shelf_life}
                  </span>
                </li>
              </ul>
            </div>
            <h5>{t("Additional Info")}</h5>
            <div className="additional__info">
              <ul>
                <li>
                  <span className="label">{t("Best Suited for")} :</span>
                  <span className="value">Medium Rare Steak, Grill</span>
                </li>
                <li>
                  <span className="label">{t("Nutrition Content")} :</span>
                  <span className="value">
                    <ul>
                      <li className="lsit">
                        <span>Protein 35 gram./100gram.</span>
                        <span>Crabohydrate 72 gram./100gram.</span>
                        <span>Fat 25 gram./100gram.</span>
                      </li>
                    </ul>
                  </span>
                </li>
                <li>
                  <span className="label">{t("Blog links")} :</span>
                  <span className="value link">
                    http://www.jagota.com/wagyubeef/th
                  </span>
                </li>
                <li>
                  <span className="label">{t("Check out the recipies")} :</span>
                  <span className="value"></span>
                </li>
              </ul>
            </div>
            <div className="review__mobile">
              <div className="CatalogCardDetails__prograss_section p-3 ">
                <div className="text-center review__star">
                  <span className="d-flex review__star__span">
                    <p className="review__start__num">
                      {ratingdata[1]?.rating?.average}{" "}
                    </p>
                    <i className="fas fa-star fa-3x" />
                  </span>
                  <p className="rating__modal__text">
                    {ratingdata[1]?.rating?.total} {t("Ratings and")} <br />{" "}
                    {ratingdata[1]?.rating?.reviewsCount} {t("reviews")}
                  </p>
                </div>
                <PrograssBars bar={ratingdata[1]?.rating} />
              </div>
            </div>
          </div> */}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
      <Modal
        open={manumodal}
        onClose={() => setmanumodal(false)}
        classNames={{
          overlay: "customOverlay",
          modal: "pdp_manumodal__class",
        }}
      >
        <div className="pdp_manumodal">
          <ManuModal />
        </div>
      </Modal>
    </section>
  );
}

export default ProductDetails;
