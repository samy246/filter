import React, { useState, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import "./cataalog_seafood.scss";
import { useParams } from "react-router-dom";
import request from "../../../request";
import axios from "axios";
import { useStateValue } from "../../../store/state";
import { toast } from "react-toastify";
import Spinner from "../../Spinner";
import { useTranslation } from "react-i18next";
import AlsoLike from "../../Home/AlsoLike/AlsoLike";
const MyCatalog_category_filter = React.lazy(() =>
  import("../myCatalog_category_filter/myCatalog_category_filter")
);
const Catalogheader = React.lazy(() =>
  import("../catalogheaderBar/catalogHeader")
);
const MyCatalogCatagorys = React.lazy(() =>
  import("../../CatalogComponents/MyCatalogCatagorys/MyCatalogCatagorys")
);

const Seafoods = () => {
  const { t } = useTranslation();
  const [spinner, setspinner] = useState(false);
  const { id } = useParams();
  const [allcatdata, setallcatdata] = useState();
  const [country_of_origin, setcountry_of_origin] = useState([]);
  const [country, setcountry] = useState([]);

  const [priceValue, setPriceValue] = useState();
  const [pricefilt, setpricefilt] = useState();
  const [{ gt }, dispatch] = useStateValue();
  const [currentpage, setCurrentPage] = useState(0);

  useEffect(() => {
    setPriceValue({
      value: {
        min: pricefilt?.minimum_price,
        max: pricefilt?.maximum_price,
      },
    });
  }, [pricefilt]);

  const [rating, setrating] = useState([]);
  const [discountdata, setdiscountdata] = useState({ from: 0, to: 0 });

  const [allFilter, setAllFilter] = useState([]);
  const [selectedCategory, setselectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("");
  const [selectedAssortOne, setSelectedAssortOne] = useState("");
  const [selectedAssortTwo, setSelectedAssortTwo] = useState("");
  const [selectedAssortThree, setSelectedAssortThree] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("")

  useEffect(() => {
    let cid = localStorage.getItem("userid");
    async function fetchData() {
      try {
        const getcountry = await axios({
          method: "post",
          url: `${request.catalogcountry}/${localStorage.getItem("companyid")}/${localStorage.getItem("storeid") != "undefined"
              ? localStorage.getItem("storeid")
              : 1
            }/${cid}?category_id=${id}&type_id=&discount_from=0&discount_to=0&rating=&current_page=0`,
        });
        setcountry_of_origin(getcountry.data);

        // const getpricerange = await axios({
        //   method: "post",
        //   url: `${request.catalogpricefilter}/${localStorage.getItem("companyid")}/${localStorage.getItem("storeid") != "undefined"
        //       ? localStorage.getItem("storeid")
        //       : 1
        //     }/${cid}?category_id=${id}&type_id=${selectedCategory}&country_id=${country}&discount_from=${discountdata?.from
        //     }&discount_to=${discountdata?.to
        //     }&rating=${rating}&current_page=${currentpage}`,
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // });

        // setpricefilt({
        //   minimum_price: getpricerange?.data[0]?.min_price,
        //   maximum_price: getpricerange?.data[0]?.max_price,
        // });
      } catch (e) {
        console.log(e)
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const typeid = await axios({
          method: "get",
          url: `${request.generalFIlter}/${id}`,
        });
        setAllFilter(typeid.data[0]);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [brandFilter, setBrandFilter] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const brandData = await axios({
          method: "post",
          url: `${request.brandFilterCategory}${localStorage.getItem('companyid')}/${localStorage.getItem("storeid") != "undefined"
          ? localStorage.getItem("storeid")
          : 1
        }/${localStorage.getItem('userid')}?category_id=${selectedCategory}&type_id=${selectedSubCategory}&variety=${selectedVariety}&assortment_1=${selectedAssortOne}&assortment_2=${
          selectedAssortTwo}&assortment_3=${selectedAssortThree}&country_id=${country}&price_from=&price_to=&discount_from=0&discount_to=0&rating=&current_page=&product_type=${selectedProductType}
          `,
        });
        setBrandFilter(brandData.data);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedSubCategory, selectedVariety, selectedAssortOne, selectedAssortTwo, selectedAssortThree, selectedProductType])

  const [productType, setProductType] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const brandData = await axios({
          method: "post",
          url: `${request.productTypeCatalog}${localStorage.getItem('companyid')}/${localStorage.getItem("storeid") != "undefined"
          ? localStorage.getItem("storeid")
          : 1
        }/${localStorage.getItem('userid')}?category_id=${selectedCategory}&type_id=${selectedSubCategory}&variety=${selectedVariety}&assortment_1=${selectedAssortOne}&assortment_2=${
          selectedAssortTwo}&assortment_3=${selectedAssortThree}&country_id=${country}&price_from=&price_to=&discount_from=0&discount_to=0&rating=&current_page=&brand_type=${selectedBrand}
          `,
        });
        setProductType(brandData.data);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedSubCategory, selectedVariety, selectedAssortOne, selectedAssortTwo, selectedAssortThree, selectedBrand])


  const currentfilterdata = async (value) => {
    let cid = localStorage.getItem("userid");
    try {
      if (!value) {
        setspinner(true);
      }
      const filtereddata = await axios({
        method: "post",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        url: `${request.catalogfilter}/${localStorage.getItem("companyid")}/${localStorage.getItem("storeid") != "undefined"
            ? localStorage.getItem("storeid")
            : 1
          }/${cid}?category_id=${id}&type_id=${selectedCategory}&country_id=${country}&price_from=&price_to=&discount_from=&discount_to=&rating=&current_page=${
            currentpage}&variety=${selectedSubCategory}&assortment_1=${selectedVariety}&assortment_2=${
              selectedAssortOne
          }&assortment_3=${selectedAssortTwo}&brand_type=${selectedBrand}&product_type=${selectedProductType}`,
      });
      dispatch({
        type: "GENERAL__TRIGGER",
      });
      setallcatdata(filtereddata?.data);
      setspinner(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    currentfilterdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    country,
    selectedCategory,
    selectedSubCategory,
    selectedVariety,
    selectedAssortOne,
    selectedAssortTwo,
    selectedAssortThree,
    selectedBrand,
    selectedProductType,
    localStorage.getItem("storeid"),
    currentpage
  ]);

  useEffect(() => {
    currentfilterdata();
    setcountry_of_origin([]);
    setcountry([]);
    setCurrentPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  const [curentcat, setcurrentcat] = useState();

  useEffect(() => {
    closeSide();
    dispatch({
      type: "SET_MEGAMENU",
      value: false,
    });
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
      type: "SEARCHBAR__CLOSEOPEN",
    });
  };

  const [like, setLike] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const prodslidData = await axios({
          method: "get",
          url: `${request.productslider}/5/${localStorage.getItem("storeid") != "undefined"
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
  }, [localStorage.getItem("storeid")]);

  return (
    <div className="Main_div_seafood" onClick={closeSide}>
      <div className="catalog_header">
        <h5>
          {t("Shop by")} <span>{t("Category")}</span>
        </h5>
        <div className="catalogpage__body ">
          <div className="catalogpage__mycatalogs">
            <div className="mycatalogs bg-white">
              <div className="mycatalogs__container">
                <Suspense fallback={<Spinner />}>
                  <MyCatalogCatagorys
                    cid={id}
                    setcurrentcat={setcurrentcat}
                    pagetype="catalog"
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="catalog__cardCount">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item arrow">
              <Link className="Main_div_seafood_home" to="./">
                {t("Home")}
              </Link>
            </li>
            <li className="breadcrumb-item arrow">
              <Link className="Main_div_seafood_mycatalog" to="/catalog">
                {t("My Catalogs")}
              </Link>
            </li>
            <li className="breadcrumb-item link_active" aria-current="page">
              {t(curentcat)}
            </li>
          </ol>
        </nav>
        <span className="catalog__cardCount__cat">
          {t(curentcat)} (
          {allcatdata && allcatdata[0]?.product_count})
        </span>

        {/* <span className="catalog__cardCount__count">
          {" "}
          ({allcatdata?.length})
        </span> */}
      </div>
      <section className="my_catalog_section">
        <div className="my_catalog_section_col_1 ">
          <Suspense fallback={<Spinner />}>
            <MyCatalog_category_filter
              country_of_origin={country_of_origin}
              setcountry={setcountry}
              country={country}
              id={id}
              allFilter={allFilter}
              selectedCategory={selectedCategory}
              setselectedCategory={setselectedCategory}
              selectedSubCategory={selectedSubCategory}
              setSelectedSubCategory={setSelectedSubCategory}
              setSelectedVariety={setSelectedVariety}
              selectedVariety={selectedVariety}
              selectedAssortOne={selectedAssortOne}
              setSelectedAssortOne={setSelectedAssortOne}
              setSelectedAssortTwo={setSelectedAssortTwo}
              selectedAssortTwo={selectedAssortTwo}
              setSelectedAssortThree={setSelectedAssortThree}
              selectedAssortThree={selectedAssortThree}
              brandFilter={brandFilter}
              setSelectedBrand={setSelectedBrand}
              productType={productType}
              setSelectedProductType={setSelectedProductType}
            />
          </Suspense>
        </div>
        <div className="my_catalog_section_col_2">
          <Suspense fallback={<Spinner />}>
            <Catalogheader
              allcatdata={allcatdata && allcatdata[0]?.products}
              setcurrentcat={setcurrentcat}
              setallcatdata={setallcatdata}
              page="catalog"
              spinner={spinner}
              count={allcatdata && allcatdata[0]?.product_count}
              setCurrentPage={setCurrentPage}
              currentpage={currentpage}
            />
          </Suspense>
        </div>
      </section>

      <AlsoLike like={like} title="You May Also like" />
    </div>
  );
};
export default Seafoods;
