import React, { useState, useEffect, Suspense, useMemo } from "react";
import "./SearchPage.scss";
import { useStateValue } from "../../store/state";
import { Link, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import axios from "axios";
import request from "../../request";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const ReactPaginate = React.lazy(() => import("react-paginate"));
const MyCatalogCatagorys = React.lazy(() =>
  import(
    "../../components/CatalogComponents/MyCatalogCatagorys/MyCatalogCatagorys"
  )
);
const MyCatalog_category_filter = React.lazy(() =>
  import(
    "../../components/CatalogMyNav/myCatalog_category_filter/myCatalog_category_filter"
  )
);
const CatalogBlockMini = React.lazy(() =>
  import("../../components/CatalogBlockMini/CatalogBlockMini")
);

const NewCard = React.lazy(() => import("../../components/NewCard/NewCard"));

function SearchPage() {
  const { t } = useTranslation();
  const [{ gt }, dispatch] = useStateValue();
  const { id, searchstring } = useParams();

  const [curentcat, setcurrentcat] = useState();
  const [AllCategory, setAllCategory] = useState([]);
  const [country_of_origin, setcountry_of_origin] = useState([]);
  const [country, setcountry] = useState([]);

  const [priceValue, setPriceValue] = useState();
  const [pricefilt, setpricefilt] = useState();
  const [cccount, setcccount] = useState(0);

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

  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentpage, setCurrentPage] = useState(0);

  const [itemsPerPage] = useState(20);

  const [brandFilter, setBrandFilter] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const brandData = await axios({
          method: "post",
          url: `${request.brandFilterSearch}${searchstring}/${localStorage.getItem('companyid')}/${localStorage.getItem("storeid") != "undefined"
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
  }, [id, selectedSubCategory, selectedVariety, selectedAssortOne, selectedAssortTwo, selectedAssortThree])

  const [productType, setProductType] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const brandData = await axios({
          method: "post",
          url: `${request.productTypeSearch}${searchstring}/${localStorage.getItem('companyid')}/${localStorage.getItem("storeid") != "undefined"
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

  useEffect(() => {
    setPriceValue({
      value: {
        min: parseInt(pricefilt?.minimum_price),
        max: parseInt(pricefilt?.maximum_price),
      },
    });
  }, [pricefilt]);

  // Functionality for Pagination
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(AllCategory[0]?.products?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(cccount?.product_count / 20));
  }, [
    itemsPerPage,
    itemOffset,
    AllCategory[0]?.products,
    AllCategory[0]?.products?.length,
  ]);

  // Scroll to top when moving to different page
  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
    const newOffset = (event.selected * itemsPerPage) % cccount?.product_count;
    setItemOffset(newOffset);
    dispatch({
      type: "SCROLL__TOP",
    });
  };

  useEffect(() => {
    setItemOffset(0);
    setPageCount(0);
    setCurrentItems(null);
    setCurrentPage(0);
  }, [id]);

  // UseMemo - Pagination
  const paginatedata = useMemo(() => {
    return (
      <ReactPaginate
        previousLabel="<"
        nextLabel=">"
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        onPageChange={(e) => handlePageClick(e)}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active_page"}
      />
    );
  }, [AllCategory[0]?.products, itemOffset, pageCount]);

  // API call - when selecting filter
  const filteredproductdata = async () => {
    try {
      const filteredproduct = await axios({
        method: "post",
        url: `${request.searchpageapi}/${searchstring}/${
          localStorage.getItem("companyid")
            ? localStorage.getItem("companyid")
            : 0
        }/${
          localStorage.getItem("storeid") != "undefined"
            ? localStorage.getItem("storeid")
            : 1
        }/${
          localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
        }?category_id=${id}&type_id=${selectedCategory}&country_id=${country}&price_from=&price_to=&discount_from=&discount_to=&rating=&current_page=${
          currentpage}&variety=${selectedSubCategory}&assortment_1=${selectedVariety}&assortment_2=${
            selectedAssortOne
        }&assortment_3=${selectedAssortTwo}&brand_type=${selectedBrand}&product_type=${selectedProductType}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch({
        type: "GENERAL__TRIGGER",
      });
      setAllCategory(filteredproduct.data);

      // setspinner(false);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  // Price Range API
  useEffect(async () => {
    try {
      const pricerange = await axios({
        method: "post",
        url: `${request.catpricefilter}/${searchstring}/${
          localStorage.getItem("companyid")
            ? localStorage.getItem("companyid")
            : 0
        }/${
          localStorage.getItem("storeid") != "undefined"
            ? localStorage.getItem("storeid")
            : 1
        }/${
          localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
        }?category_id=${id}`,
      });
      setpricefilt({
        minimum_price: pricerange?.data[0]?.min_price,
        maximum_price: pricerange?.data[0]?.max_price,
      });
    } catch (e) {
      console.log(e);
    }
  }, [searchstring, id]);

  useEffect(() => {
    filteredproductdata();
  }, [
    country,
    selectedCategory,
    searchstring,
    currentpage,
    country,
    selectedCategory,
    selectedCategory,
    selectedSubCategory,
    selectedAssortOne,
    selectedAssortTwo,
    selectedAssortThree,
    selectedBrand,
    selectedProductType,
    localStorage.getItem("storeid"),
  ]);

  useEffect(() => {
    filteredproductdata();
    setcountry_of_origin([]);
    setcountry([]);
    setCurrentPage(0);
    setrating([])
    setdiscountdata({ from: 0, to: 0 })
  }, [id])

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
      type: "SEARCHBAR__CLOSEOPEN",
    });
  };

  // API for country list
  useEffect(() => {
    async function fetchData() {
      try {
        const getcountry = await axios({
          method: "post",
          url: `${request.searchcountry}/${searchstring}/${localStorage.getItem('companyid')}/${
            localStorage.getItem("storeid") != "undefined"
              ? localStorage.getItem("storeid")
              : 1
          }/${localStorage.getItem('userid')}?category_id=${id}&type_id=&discount_from=0&discount_to=0&rating=&current_page=0`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setcountry_of_origin(getcountry.data);

      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
  }, [id]);

  // API for Sub-Category
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
  }, [id]);

  // UseMemo - Item list
  const currentItemsMemo = useMemo(() => {
    return currentItems?.map((data, i) => (
      <NewCard
        key={i}
        pid={data.entity_id}
        sku={data.sku}
        delvieryColor="green"
        name={data.name}
        price={data.price}
        specialpriceExpiry={data.special_to_date}
        specialprice={data.special_price}
        url_key={data.url_key}
        alldata={data}
        stock={data.is_in_stock}
        image={data.thumbnail}
        delivery_in={data.delivery_in}
        page="catalogdetails"
        id={id}
        favourite={data.favourite}
        wish={data.wish}
        ordertaking={data.order_taking}
        order_taking_end_date={data?.order_taking_end_date}
        quty={data.qty}
        options={data.options}
        quote={data?.quote}
        dunit={data?.selling_unit}
        brand_name={data?.brand_name}
        pack_size={data?.pack_size}
        unit_per_box={data?.unit_per_box}
        unit_box={data?.unit_box}
        unit_box_unit={data?.unit_box_unit}
        opentype="new"
        product_status={data?.product_status}
      />
    ));
  }, [currentItems]);

  // Functionality to get current category name
  useEffect(() => {
    if (curentcat == undefined) return;
    let temp = AllCategory[0]?.cat_count?.find((cc) => {
      if (cc?.name == curentcat) {
        return cc;
      }
    });
    
    if (temp == undefined) {
      setcccount(0);
    } else {
      setcccount(temp);
    }

  }, [curentcat, AllCategory]);

  return (
    <div className="searchpage">
      <div className="searchpage__header">
        <div className="searchpage__data">
          <h5>
            {t("Shop by")} Keyword: <span>{searchstring}</span>
          </h5>
          <div className="catalog_header__menu">
            <div className="catalog_header__menu__conatiner">
              <Suspense fallback={<Spinner />}>
                <MyCatalogCatagorys
                  pagetype="searchpage"
                  searchstring={searchstring}
                  cid={id}
                  setcurrentcat={setcurrentcat}
                  // cathighlight={cathighlight}
                  country={country}
                  selecttype={selectedCategory}
                  discountdata={discountdata}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <div className="searchpage__cardCount">
        <div className="searchpage__breadcrumbs">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              {id ? (
                <li className="breadcrumb-item" aria-current="page">
                  Search
                </li>
              ) : (
                <li className="breadcrumb-item " aria-current="page">
                  Search
                </li>
              )}
              {id ? (
                <li className="breadcrumb-item active" aria-current="page">
                  {curentcat}
                </li>
              ) : (
                ""
              )}
            </ol>
          </nav>
        </div>
        <span className="searchpage__cardCount__cat">
          {curentcat ? `${curentcat}` : "SearchPage"} (
          {cccount?.product_count ? cccount?.product_count : 0})
        </span>
      </div>

      <div className="searchpage__content">
        <div className="searchpage__filter">
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
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              productType={productType}
              setSelectedProductType={setSelectedProductType}
            />
          </Suspense>
        </div>

        <div className="searchpage__data">
          {parseInt(cccount?.product_count) === 0 ? (
            <div className="searchpage__card">
              <p>No Product matching the Search Keyword</p>
            </div>
          ) : (
            <div className="searchpage__card">
              <>
                {window.innerWidth > 580 && currentItemsMemo}
                {window.innerWidth <= 580 && (
                  <CatalogBlockMini data={AllCategory} />
                )}
              </>
            </div>
          )}
          {parseInt(cccount?.product_count) > 20 && (
            <div className="container_pagination">
              <Suspense fallback={<Spinner />}>{paginatedata}</Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
