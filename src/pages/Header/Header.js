import React, { useState, useEffect, Suspense, useMemo, lazy } from "react";
import "./Header.scss";
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "../../store/state";
import jagotalogo from "../../assets/images/jagota_logo.png";
import request from "../../request";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import carticon from "../../assets/images/header/cart.png";
import englang from "../../assets/images/header/english.png";
import noticon from "../../assets/images/header/notification.png";
import jagotawhite from "../../assets/images/header/jagotawhite.png";
import newsearch from "../../assets/images/header/newsearch.png";
import Spinner from "../../components/Spinner";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
const MiniCart = lazy(() =>
  import("../../components/Header/MiniCart/MiniCart")
);
const MiniMenu = lazy(() =>
  import("../../components/Header/MiniMenu/MiniMenu")
);
const SearchResults = lazy(() =>
  import("../../components/Header/SearchResults/SearchResults")
);

function Header({ homepage, catalog, product, wishlist, token, user }) {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const [menu, setMenu] = useState();
  const [login, setLogin] = useState(true);
  const [msearch, setMSearch] = useState(false);
  const [langdropdown, setlangdropdown] = useState(false);
  const [chooselang, setchooselang] = useState();
  const [noti, setnoti] = useState(false);
  const history = useHistory();
  const [
    {
      minimenu,
      miniCart,
      cart,
      language,
      megamenu,
      megamenu_hide,
      notification,
      searchbar,
    },
    dispatch,
  ] = useStateValue();
  const [searchproduct, setsearchproduct] = useState("");

  useEffect(() => {
    // Route the user to login page, if not loggedin
    if (token === null || "" || undefined) {
      history.push("/login");
    }

    // Check whether the user is logging in for the first time
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    if(userdata?.confirmation == "1") {
      history.push("/changepassword")
    }
  }, [token, localStorage.getItem('userdata'), window.location.pathname]);

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem('userdata'));

    if(userdata?.confirmation == "1" && window.location.pathname == "/changepassword") {
      toast.info('User must change the password before accessing other pages')
    }

    if(userdata?.confirmation == "1") {
      history.push("/changepassword")
    }
  }, [window.location.pathname])

  const searchpage = (e) => {
    if (e.key == "Enter") {
      history.push(`/searchpage/${e.target.value}/0`);
    }
  };

  const [parentid, setparentid] = useState("all");

  // Finding the role of the currently loggedin user
  useEffect(() => {
    const companyrolesdata = JSON.parse(
      localStorage.getItem("companyrolesdata")
    );
    const userrole = JSON.parse(localStorage.getItem("company_role_id"));

    const rolename = companyrolesdata?.find((data) => data?.id === userrole);
    localStorage.setItem("currentrole", rolename?.name);
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await axios({
          method: "get",
          url: request.brands,
        });
        dispatch({
          type: "BRANDS_DATA",
          brands: data.data,
        });
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
  }, []);

  const [searchresultsdata, setsearchresultsdata] = useState([]);

  // Trigger to clear the search results when routed to different url
  useEffect(() => {
    setsearchresultsdata([]);
  }, [pathname, searchbar]);

  // API call to fetch response for the search keyword
  useEffect(async () => {
    if (searchproduct === "") {
      return setsearchresultsdata([]);
    }
    try {
      const getsearchresults = await axios({
        method: "get",
        // url: `${request.search}?category_id=${parentid}&name=${searchproduct}`,
        url: `${request.search}/${searchproduct}/0/${
          localStorage.getItem("storeid") ? localStorage.getItem("storeid") : 1
        }/${
          localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
        }`,
      });
      setsearchresultsdata(getsearchresults.data);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  }, [searchproduct]);

  // Cart data fetch on page reload
  useEffect(async () => {
    if (localStorage.getItem("token") === null) return;
    const token = localStorage.getItem("token");
    try {
      const cart_id = await axios({
        method: "post",
        url: request.cardid,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          customerId: localStorage.getItem("userid"),
        },
      });
      localStorage.setItem("cartid", cart_id.data);
    } catch (e) {
      if (
        e.response?.data?.message ===
        "The consumer isn't authorized to access %resources."
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("userid");
        localStorage.removeItem("userdata");
        localStorage.removeItem("address");
        localStorage.removeItem("cartid");
        localStorage.removeItem("user");
        localStorage.removeItem("companyid");
        localStorage.removeItem("companyrolesdata");
        localStorage.removeItem("company_role_id");
        localStorage.removeItem("company_group_id");
        localStorage.removeItem("timer");
        // window.location.reload();
      }
    }
  }, []);

  // hide megamenu
  useEffect(() => {
    setlangdropdown(false);
    dispatch({
      type: "SET_MEGAMENU_HIDE",
      value: false,
    });
    setsearchresultsdata([]);
  }, [language, megamenu]);

  // After login, set the default language from the userdata
  useEffect(async () => {
    let storeid = JSON.parse(localStorage.getItem("userdata"));
    if(storeid?.store_id == undefined) return
    setchooselang(storeid.store_id)
  }, [localStorage.getItem("userdata")]);

  // API call to change language based in user's selection
  useEffect(async () => {
    if(chooselang == undefined) return
    localStorage.setItem("storeid", chooselang);
    if (
      localStorage.getItem("token") == null ||
      localStorage.getItem("userid") == null
    )
      return;
    try {
      await axios({
        method: "post",
        url: request.changelang,
        data: {
          customerId: localStorage.getItem("userid"),
          storeId: chooselang,
        },
      });
      try {
        const userData = await axios({
          method: "get",
          url: request.userData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        localStorage.setItem("userdata", JSON.stringify(userData.data));
        
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  }, [chooselang]);
  
  // Localization when selecting language.
  useEffect(() => {
    if (chooselang == 1) {
      i18n.changeLanguage("en");
    }
    if (chooselang == 2) {
      i18n.changeLanguage("th");
    }
    localStorage.setItem("storeid", chooselang);
  }, [chooselang]);

  // Open Minicart
  const openCart = () => {
    dispatch({
      type: "SET_MEGAMENU_HIDE",
      value: false,
    });
    dispatch({
      type: "SET_MINICART",
      value: true,
    });
    dispatch({
      type: "SET_NOTIFICATION",
      value: false,
    });
    dispatch({
      type: "SET_MINIMENU",
      value: false,
    });
    setsearchresultsdata([]);
    setnoti(false);
  };

  // Close Minicart
  const closeCart = () => {
    dispatch({
      type: "SET_MINICART",
      value: false,
    });
  };

  // Open Hamburger Menu
  const openMenu = () => {
    dispatch({
      type: "SET_MEGAMENU_HIDE",
      value: false,
    });
    dispatch({
      type: "SET_MINIMENU",
      value: true,
    });
    dispatch({
      type: "SET_NOTIFICATION",
      value: false,
    });
    dispatch({
      type: "SET_MINICART",
      value: false,
    });
    setsearchresultsdata([]);
  };

  // Close Hamburger Menu
  const closeMenu = () => {
    dispatch({
      type: "SET_MINIMENU",
      value: false,
    });
  };

  const openCatalog = () => {
    dispatch({
      type: "SET_MEGAMENU_HIDE",
      value: true,
    });
    dispatch({
      type: "SET_NOTIFICATION",
      value: false,
    });
    setMenu("catalog");
    setnoti(false);
    setsearchresultsdata([]);
  };

  const closeCatalog = () => {
    dispatch({
      type: "SET_MEGAMENU_HIDE",
      value: false,
    });
    dispatch({
      type: "SET_NOTIFICATION",
      value: false,
    });
    setnoti(false);
  };

  const openProduct = () => {
    dispatch({
      type: "SET_MEGAMENU_HIDE",
      value: true,
    });
    dispatch({
      type: "SET_NOTIFICATION",
      value: false,
    });
    setMenu("product");
    setnoti(false);
    setsearchresultsdata([]);
  };

  const closeProduct = () => {
    dispatch({
      type: "SET_MEGAMENU_HIDE",
      value: false,
    });
  };

  // Open search bar for mobile view
  const openSearch = () => {
    if (window.innerWidth >= 540) return;
    setMSearch(!msearch);
    setnoti(false);
    dispatch({
      type: "SET_NOTIFICATION",
      value: false,
    });
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
    setsearchresultsdata([]);
    setnoti(false);
  };

  // set notification response to the local state
  useEffect(() => {
    setnoti(notification);
  }, [notification]);

  const notify = () => {
    closeSide();
    setnoti(!noti);
    dispatch({
      type: "SET_NOTIFICATION",
      value: !noti,
    });
  };

  // Notification API to call in the interval of 30 seconds
  const [notificationdata, setnotificationdata] = useState([]);
  useEffect(() => {
    const interval = setInterval(async () => {
      if (
        localStorage.getItem("userid") === null ||
        localStorage.getItem("token") === null
      )
        return;
      try {
        const notificationdata = await axios({
          method: "get",
          url: `${request.getnotification}/${localStorage.getItem("userid")}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        var sortedData = notificationdata.data
          .sort((a, b) => {
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          })
          .reverse();
        setnotificationdata(sortedData);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }, 30000);
    return () => clearInterval(interval);
  });

  // Notification api call, after calling readnotification api
  const intervaltrigger = async () => {
    if (
      localStorage.getItem("userid") === null ||
      localStorage.getItem("token") === null
    )
      return;
    try {
      const notificationdata = await axios({
        method: "get",
        url: `${request.getnotification}/${localStorage.getItem("userid")}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      var sortedData = notificationdata.data
        .sort((a, b) => {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        })
        .reverse();
      setnotificationdata(sortedData);
      // setnoti(false);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  // Read Notification API Call
  const readnoti = async (value) => {
    try {
      await axios({
        method: "post",
        url: `${request.readnotification}/${value.id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      intervaltrigger();
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const langdropdownhandler = () => {
    return;
  };

  const [productsCatalaogData, setProductsCatalaogData] = useState([]);
  const getMenu = async () => {
    try {
      const categoryies = await axios({
        method: "get",
        url: request.categorylist,
      });
      setProductsCatalaogData(categoryies.data.children_data);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };
  useEffect(() => {
    getMenu();
  }, []);

  var firstname = JSON.parse(localStorage.getItem("userdata"))?.firstname;
  var lastname = JSON.parse(localStorage.getItem("userdata"))?.lastname;

  // UseMemo - Notification
  const notificationDataMemo = useMemo(() => {
    return notificationdata?.map((data, i) => (
      <p key={i} onClick={() => readnoti(data)}>
        <span>{data.action_data}</span>
        <span className="time">
          {moment(data?.created_at).startOf("day").fromNow()}
        </span>
      </p>
    ));
  }, [notificationdata]);

  // UseMemo - SearchResults
  const searchResultsDataMemo = useMemo(() => {
    return searchresultsdata;
  }, [searchresultsdata]);


const getStyle={
  Active: {
    backgroundColor: 'orange'
},
Inactive: {
    color: 'grey'
},
}

  return (
    <div
      className="header"
      onClick={
        langdropdown === true
          ? () => setlangdropdown(false)
          : langdropdownhandler
      }
    >
      <div className="header__bg">
        <div className={`header__cart ${miniCart && "header__cart__open"}`}>
          <svg
            onClick={closeCart}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
          <Suspense fallback={<Spinner />}>
            <MiniCart />
          </Suspense>
        </div>

        <div
          className={`header__minimenu ${minimenu && "header__minimenu_open"}`}
        >
          <svg
            onClick={closeMenu}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
          <Suspense fallback={<Spinner />}>
            <MiniMenu close={closeMenu} />
          </Suspense>
        </div>

        <div
          className="header__top"
          onMouseEnter={(closeCatalog, closeProduct)}
          // onMouseEnter={closeProduct}
        >
          <div className="header__top__left">
            {/* burgermenu */}
            <div className="header__menu">
              <svg
                onClick={openMenu}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-list"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                />
              </svg>
            </div>
            <Link to="/">
              <img
                className="header__jagotalogo"
                // src={jagotalogo}
                src={jagotawhite}
                alt=""
                onMouseLeave={(closeCatalog, closeProduct)}
              />
            </Link>
          </div>
          <div className="header__top__middle" onClick={closeSide}>
            <div
              className="header__middle__search"
              onMouseEnter={(closeCatalog, closeProduct)}
            >
              <input
                type="text"
                placeholder={`${t("Find your Favourite Products")}...`}
                value={searchproduct}
                onChange={(e) => setsearchproduct(e.target.value)}
                onKeyDown={(e) => searchpage(e)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#37bfa7"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>

              {/* <p className="search__button">Search</p> */}
              {searchresultsdata?.length !== 0 ? (
                <Suspense fallback={<Spinner />}>
                  <SearchResults
                    searchproduct={searchproduct}
                    searchresultsdata={searchResultsDataMemo}
                  />
                </Suspense>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="header__top__right">
            <div
              className={`${!notification && "notifyhide"} ${
                notificationdata?.length !== 0 && "notificationList"
              }`}
            >
              {notificationdata?.length !== 0 && notificationDataMemo}
            </div>
            <div
              className="header__top__right__language"
              onClick={closeSide}
            ></div>
            <div className="header__top__right__profileImg" onClick={closeSide}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-people"
                viewBox="0 0 16 16"
              >
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
              </svg>
              {token ? (
                <h5 className="header__top__right__username">
                  {firstname} {lastname}
                </h5>
              ) : (
                // <h5>Guest?</h5>
                ""
              )}
            </div>
            {!token ? (
              <div
                className="header__top__right__authButton"
                onClick={closeSide}
              >
                <Link to="/login">
                  <button
                    id="login"
                    className={`${
                      login && "header__top__right__authButton_login"
                    }`}
                  >
                    {t("Login")}
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    onMouseOver={() => setLogin(false)}
                    onMouseLeave={() => setLogin(true)}
                    id="register"
                  >
                    {t("Register")}
                  </button>
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div
          className={`header__bottom ${wishlist ? "wishlist__header" : ""}`}
          // onClick={closeSide}
        >
          <div
            className={`header__megaMenu ${
              megamenu_hide && "header__megaMenu__open"
            }`}
            onMouseLeave={(closeCatalog, closeProduct)}
            // onMouseLeave={closeProduct}
          >
            <Suspense fallback={<Spinner />}>
              {/* <MegaMenu menu={menu} /> */}
            </Suspense>
          </div>
          <div className="header__bottom__left" onClick={closeSide}>
            <ul>
              <Link to="/">
                <li
                  onMouseEnter={(closeCatalog, closeProduct)}
                  // onMouseEnter={closeProduct}
                  className={`
                  ${
                    homepage
                      ? "header__bottom__left__homeButton"
                      : "header__bottom__left__homeButtonLeave"
                  }
                  ${
                    catalog
                      ? "header__bottom__left__homeButtonLeave"
                      : "header__bottom__left__homeButton"
                  } 
                  ${
                    product
                      ? "header__bottom__left__homeButtonLeave"
                      : "header__bottom__left__homeButton"
                  }
                `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-house-door"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
                  </svg>
                  <h5>{t("Home")}</h5>
                </li>
              </Link>
              {localStorage.getItem("companyid") && (
                <Link to={`/product/0`}>
                  <li
                    // onMouseOver={openProduct}
                    className={`${product ? "product__active" : ""}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-handbag"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2zm3 4V3a3 3 0 1 0-6 0v2H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11zm-1 1v1.5a.5.5 0 0 0 1 0V6h1.639a.5.5 0 0 1 .494.426l1.028 6.851A1.5 1.5 0 0 1 12.678 15H3.322a1.5 1.5 0 0 1-1.483-1.723l1.028-6.851A.5.5 0 0 1 3.36 6H5v1.5a.5.5 0 1 0 1 0V6h4z" />
                    </svg>
                    <h5>{t("My Product")}</h5>
                  </li>
                </Link>
              )}
              <Link to="/catalog">
                <li
                  className={`${catalog ? "catalog" : ""}`}
                  // onMouseOver={openCatalog}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-calendar2-minus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 10.5A.5.5 0 0 1 6 10h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z" />
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z" />
                  </svg>
                  <h5>{t("Catalogs")}</h5>
                </li>
              </Link>
            </ul>
          </div>
          <div className="header__bottom__right">
            <div className="bottomRight__lang" onClick={closeSide}>
              <img src={englang} alt="" />
              <span
                className={`lang__eng ${chooselang == 1 && "color"}`}
                onClick={() =>{ setchooselang(1)
                  localStorage.setItem("cookiestranslate",6)
                }}
              >
                Eng
              </span>
              <span>{" | "}</span>
              <span
                className={`lang__thai ${chooselang == 2 && "color"}`}
                onClick={() => {setchooselang(2)
                  localStorage.setItem("cookiestranslate",7)
                }}
              >
                ไทย
              </span>
            </div>
            <div style={{display:"flex",gap:"2em"}}>
            <div className="header__top__right__cart" onClick={openCart}>
              <img src={carticon} className="carticon" alt="" />
              <span className="header__top__right__count">
                {cart.length >0  ? cart.length  : false}
              </span>
            </div>
            <div className="header__top__right__notification" onClick={notify}>
              <img className="noticon" src={noticon} alt="" onClick={notify} />
              <span className="header__top__right__count">
                {notificationdata?.length >0 ? notificationdata?.length : false }
              </span>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="header__mobile">
        {searchresultsdata?.length != 0 && msearch ? (
          <Suspense fallback={<Spinner />}>
            <SearchResults searchresultsdata={searchresultsdata} />
          </Suspense>
        ) : (
          ""
        )}
        
        <div className="header__top__left">
          <div className="header__menu">
            <svg
              onClick={openMenu}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </div>
          {/* logo */}

          <Link to="/" style={{ maxWidth: "8em" }}>
            <img
              className="header__jagotalogo"
              src={jagotalogo}
              alt=""
              onMouseLeave={(closeCatalog, closeProduct)}
            />
          </Link>
        </div>

        <div
          className="header__bottom__right"
          onMouseEnter={(closeCatalog, closeProduct)}
          // onMouseEnter={closeProduct}
        >
          <div
            className={`header__mobile__search ${
              msearch && "header__mobile__search__open"
            }`}
          >
            <input
              type="text"
              placeholder="Find a Products"
              value={searchproduct}
              onChange={(e) => setsearchproduct(e.target.value)}
            />

            <div className="header__bottom__right__search" onClick={openSearch}>
              <img className="mobnewsearch" src={newsearch} alt="" />
            </div>
            {searchresultsdata?.length !== 0 ? (
              <Suspense fallback={<Spinner />}>
                <SearchResults searchresultsdata={searchresultsdata} />
              </Suspense>
            ) : (
              ""
            )}
          </div>

          <div className="header__top__right__cartDetails" onClick={openCart}>
            <img className="mobcarticon" src={carticon} alt="" />
            <span className="header__top__right__count__mobile">
            {cart.length >0  ? cart.length  : false}
            </span>
          </div>

          <div className="header__top__right__notifications" onClick={notify}>
            <img
              className="noticon mobcarticon"
              src={noticon}
              alt=""
              onClick={notify}
            />
            <span className="header__top__right__count__mobile">
            {notificationdata?.length >0 ? notificationdata?.length : false }
            </span>
          </div>

          <div
            className={`${!notification && "notifyhide"} ${
              notificationdata?.length !== 0 && "notificationList"
            }`}
          >
            {notificationdata?.length !== 0 && notificationDataMemo}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Header;
