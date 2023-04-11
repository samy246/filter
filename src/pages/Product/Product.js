import React, { useState, useEffect, Suspense, useMemo } from "react";
import "./Product.scss";
import { Link, useParams, useHistory } from "react-router-dom";
import { useStateValue } from "../../store/state";
import axios from "axios";
import request from "../../request";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import CatalogBlockMini from "../../components/CatalogBlockMini/CatalogBlockMini";
import NewCard from "../../components/NewCard/NewCard";
import { useTranslation } from "react-i18next";
const AlsoLike = React.lazy(() =>
  import("../../components/Home/AlsoLike/AlsoLike")
);
// const NewCard = React.lazy(() => import("../../components/NewCard/NewCard"));
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
)

function Product({ token }) {
  const { t } = useTranslation();
  useEffect(() => {
    if (token === null || "" || undefined) {
      history.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });
  const [setspinner] = useState(false);
  const [AllCategory, setAllCategory] = useState([]);
  const [currentpage, setCurrentPage] = useState(0);
  const { id } = useParams();

  const history = useHistory();
  const [{ gt }, dispatch] = useStateValue();

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

  const [country_of_origin, setcountry_of_origin] = useState([]);
  const [country, setcountry] = useState([]);

  const [pricefilt] = useState();

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
  }, [id, selectedSubCategory, selectedVariety, selectedAssortOne, selectedAssortTwo, selectedAssortThree])

  const [productType, setProductType] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const brandData = await axios({
          method: "post",
          url: `${request.productTypeMyProduct}${localStorage.getItem('companyid')}/${localStorage.getItem("storeid") != "undefined"
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

  // API to get country list for the current categoryid, user id and store id
  useEffect(() => {
    async function fetchData() {
      try {
        const getcountry = await axios({
          method: "post",
          url: `${request.productcountry}/${localStorage.getItem('companyid')}/${
            localStorage.getItem("storeid") != "undefined"
              ? localStorage.getItem("storeid")
              : 1
          }/${localStorage.getItem('userid')}?category_id=${id}&type_id=&discount_from=0&discount_to=0&rating=&current_page=0`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setcountry_of_origin(getcountry.data);

        await axios({
          method: "get",
          url: request.typeid,
        });
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
  }, [id]);

  // API to get the SubCategory for the Currently selected Category ID
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

  // API to get the Item list based on the Selected Filter
  const filteredproductdata = async (value) => {
    try {
      if (!value && value !== undefined) {
        setspinner(true);
      }
      const filteredproduct = await axios({
        method: "post",
        url: `${request.productplpfilter}/${localStorage.getItem(
          "companyid"
        )}/${localStorage.getItem("storeid") != "undefined" ? localStorage.getItem("storeid") : 1}/${localStorage.getItem(
          "userid"
        )}?category_id=${id}&type_id=${selectedCategory}&country_id=${country}&price_from=&price_to=&discount_from=&discount_to=&rating=&current_page=${
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
      setspinner(false);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  useEffect(() => {
    if (gt) {
      filteredproductdata(gt);
    } else {
      filteredproductdata();
    }
  }, [
    country,
    selectedCategory,
    selectedCategory,
    selectedSubCategory,
    selectedAssortOne,
    selectedAssortTwo,
    selectedAssortThree,
    selectedBrand,
    selectedProductType
  ]);

  useEffect(() => {
    filteredproductdata();
    setcountry_of_origin([]);
    setcountry([]);
    setCurrentPage(0);
    setrating([])
    setdiscountdata({ from: 0, to: 0 })
  }, [id])

  const [curentcat, setcurrentcat] = useState();

  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  const [itemsPerPage] = useState(20);

  // Functionality for Pagination
  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(AllCategory[0]?.products?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(AllCategory[0]?.product_count / itemsPerPage));
  }, [
    id,
    itemsPerPage,
    itemOffset,
    AllCategory[0]?.products,
    AllCategory[0]?.products?.length,
  ]);

  // Functionality to Scroll to top, when different page is selected in the pagination.
  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
    const newOffset = (event.selected * itemsPerPage) % AllCategory?.length;
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

  const [like, setLike] = useState([]);
  // API for You May Also like Section
  useEffect(() => {
    async function fetchData() {
      try {
        const prodslidData = await axios({
          method: "get",
          url: `${request.productslider}/5/${
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
  }, [gt]);

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
  }, [AllCategory]);

  // UseMemo - Items List
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
        page="productdetails"
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


  return (
    <div className="product" onClick={closeSide}>
      <div className="product__content">
        <div className="product__data">
          <h5>
            {t("Shop by")} <span>{t("Category")}</span>
          </h5>
          <div className="catalog_header__menu">
            <div className="catalog_header__menu__conatiner">
              <Suspense fallback={<Spinner />}>
                <MyCatalogCatagorys
                  pagetype="product"
                  cid={id}
                  setcurrentcat={setcurrentcat}
                  // AllCategory={AllCategory}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <div className="product__cardCount">
        <div className="product__breadcrumbs">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item arrow">
                <Link to="/">{t("Home")}</Link>
              </li>
              {id ? (
                <li className="breadcrumb-item arrow" aria-current="page">
                  {t("Product")}
                </li>
              ) : (
                <li className="breadcrumb-item arrow" aria-current="page">
                  {t("Product")}
                </li>
              )}
              {id ? (
                <li className="breadcrumb-item active" aria-current="page">
                  {t(curentcat)}
                </li>
              ) : (
                ""
              )}
            </ol>
          </nav>
        </div>
        <span className="product__cardCount__cat">
          {t(curentcat)} (
          {AllCategory[0]?.product_count})
        </span>
      </div>

      <div className="product__contentdata">
        <div className="product__filter">
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

        <div className="product__data">
          {AllCategory.length === 0 ? (
            <div className="product__card">
              <p>No Quoted Price under {curentcat}</p>
            </div>
          ) : (
            <div className="product__card">
              <>
                {window.innerWidth > 580 && currentItemsMemo}
                {window.innerWidth <= 580 && (
                  <CatalogBlockMini data={currentItems} />
                )}
              </>
            </div>
          )}
          {AllCategory?.length > itemsPerPage && (
            <div className="container_pagination">
              <Suspense fallback={<Spinner />}>{paginatedata}</Suspense>
            </div>
          )}
        </div>
      </div>
      <Suspense fallback={<Spinner />}>
        <AlsoLike like={like} title="You May Also like" />
      </Suspense>
    </div>
  );
}

export default Product;
