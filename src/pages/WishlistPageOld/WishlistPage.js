import React, { useState, useEffect, useCallback, Suspense } from "react";
import "./WishlistPage.scss";
import { useHistory } from "react-router-dom";
import AlsoLike from "../../components/Home/AlsoLike/AlsoLike";
import { useStateValue } from "../../store/state";
import request from "../../request";
import axios from "axios";
import Spinner from "../../components/Spinner";
import back from '../../assets/images/catalog/back.png'
import { useTranslation } from "react-i18next";
import Pagination from "./Pagination";
import WishlistPagination from "./WishlistPagination";
import WishlistSmallBlock from "./WishlisSmallBlock";

function WishlistPage() {
  const { t } = useTranslation();
  const history = useHistory();
  const [alladd, setalladd] = useState(false);
  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const [trending, settrending] = useState([]);
  const [{ wishlistData, gt }, dispatch] = useStateValue();
  const [like, setLike] = useState([]);
  const [arrival, setarrival] = useState([]);

  const [posts, setPosts] = useState([]);
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setpostPerPage] = useState(18);

  const [currentPagewi, setCurrentPagewi] = useState(1);
  const [postsPerPagewi, setpostPerPagewi] = useState(18);
  const [totalPosts, setTotalPosts] = useState(0)
  const [wishlistCount, setwishlistCount] = useState()
  const [favouriteCount, setfavouriteCount] = useState()


  // API Call for Recommended For Yuu Section
  useEffect(() => {
    async function fetchData() {
      try {
        const prodslidData = await axios({
          method: "get",
          url: `${request.productslider}/15/${localStorage.getItem("storeid") != "undefined"
            ? localStorage.getItem("storeid")
            : 1
            }/${localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
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


  // API call for trending products section
  useEffect(() => {
    productslider();
  }, [currentPagewi])

  useEffect(() => {
    arrivalslider();
  }, [currentPage])

  ///********************************************************************wishlist*********************************************************** */

  /***Receive page number for Wishlist* */

  const Paginate = (pageNumber) => {
    setCurrentPagewi(pageNumber);
  };

  /***Receive page number for Favpourite* */
  const Favpaginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const productslider = (async () => {
    try {
      const temp = currentPagewi
      const prodslidData = await axios({
        method: "get",
        url: `${request.getwishlist}${localStorage.getItem("userid")}&page_no=${temp}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setwishlistCount(prodslidData.data[0].count)
      settrending(prodslidData.data[1]);
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

  /******************************************Favourites***********************************************8 */
  // API call for new arrivals section
  const arrivalslider = (async () => {
    const favtemp = currentPage
    try {
      const prodslidData = await axios({
        method: "get",
        url: `${request.fetchfav}/${localStorage.getItem("userid")}/2/${favtemp}`,

        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("wishlist fav pagination", prodslidData);
      setfavouriteCount(prodslidData.data[0].count)
      setarrival(prodslidData.data[1]);
      setloading(false)
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

  // Spilliting the api response of trending products for the pagination.
  useEffect(() => {
    let temp1 = [];
    let temp2 = [];
    let temptenwi = []

    trending?.map((tr, i) => {

      if (temp1.length > 5) {
        temptenwi.push(tr.product)
        temp2.push(tr.product);

      } else {

        temptenwi.push(tr.product)
        temp1.push(tr.product);
      }
    });
    setallpagewi(temptenwi)
  }, [trending]);


  const [allpage, setallpage] = useState([]);
  const [allpagewi, setallpagewi] = useState([]);

  // Spilliting the api response of new arrival products for the pagination.
  useEffect(() => {
    let temp1 = [];
    let temp2 = [];
    let tempten = []
    //setPosts(arrival[0].products);
    arrival.map((tr) => {
      if (temp1.length > 5) {
        tempten.push(tr)
        temp2.push(tr);
      } else {
        tempten.push(tr)
        temp1.push(tr);
      }
    });
    setallpage(tempten)
  }, [arrival]);

  //Favourite paginarion
  const lastPostIndex = currentPage * postsPerPage;
  const currentPost = allpage

  //wishlist page
  const lastPostIndexwi = currentPagewi * postsPerPagewi;
  const firstPostIndexwi = lastPostIndexwi - postsPerPagewi;
  const currentPostwi = allpagewi

  useEffect(() => {
    closeSide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const addallwishtocart = async () => {
    for (let i in wishlistData) {
      try {
        await axios({
          method: "post",
          url: request.cartadd,
          data: {
            cartItem: {
              sku: wishlistData[i].product.sku,
              quote_id: localStorage.getItem("cartid"),
              qty: wishlistData[i].qty,
              price: wishlistData[i]?.specialprice
                ? wishlistData[i].specialprice
                : wishlistData[i].price,
              extension_attributes: {
                unit: wishlistData[i].product.unit,
              },
            },
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setalladd(!alladd);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    dispatch({
      type: "CART_STATUS",
      data: alladd,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alladd]);

  return (
    <>
      <div className="wishlistpage">
        <div className="finance__back">
          <p style={{ display: "flex", padding: "30px 17px" }}>
            <img src={back} alt="" onClick={() => history.goBack()} style={{ padding: "5px", cursor: "pointer" }} />

          </p>
        </div>
        <div className="wishlistpage__table">
          <div className="wishlist__twobblocks">
            <div className="wishlist__trending__products">
              {currentPostwi?.length > 0 && <h5 style={{ margin: "0px 7%" }}>Wishlists</h5>}
              <Suspense fallback={<Spinner />}>
                {
                  currentPostwi.length > 0 ?
                    <>
                      <WishlistSmallBlock
                        data={currentPostwi}
                      />
                      <WishlistPagination
                        totalPostswi={wishlistCount > 18 ? wishlistCount : ""}
                        postsPerPagewi={postsPerPagewi}
                        Paginate={Paginate}
                        currentPagewi={currentPagewi}
                      />
                    </>
                    :
                    ""
                }
              </Suspense>
            </div>
            {/* **********************************************Favourites ************************************************8*/}
            <div className="wishlisthome__new__products">
              {currentPost?.length > 0 && <h5 style={{ margin: "0px 7%" }}>Favourites</h5>}
              <Suspense fallback={<Spinner />}>
                {
                  currentPost.length > 0 ?
                  <>
                    <WishlistSmallBlock
                      data={currentPost}
                    />
                    <Pagination
                      totalPosts={favouriteCount > 18 ? favouriteCount : ''}
                      postsPerPage={postsPerPage}
                      Favpaginate={Favpaginate}
                      currentPage={currentPage}
                    />

                  </>
                  :
                  ""
                }
              </Suspense>
            </div>
          </div>
        </div>
        {/* wishlistpage__table */}
        <div className="wishlistpage__buttons__div">

        </div>
        <div className="wishlistpage__aliso__youmaylike">
          {like?.length > 0 ? <h4>{t("Recommended For You")}</h4> : ""}
          <AlsoLike like={like} />
        </div>
      </div>

    </>
  );
}

export default WishlistPage;
