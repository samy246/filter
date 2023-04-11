import React, { useState, useEffect, Suspense, useMemo } from "react";
import "./catalogHeader.scss";
import { useParams } from "react-router-dom";
import NewCard from "../../NewCard/NewCard";
import CatalogBlockMini from "../../CatalogBlockMini/CatalogBlockMini";
import Spinner from "../../Spinner";
import LazyLoad from 'react-lazyload';
import { useStateValue } from "../../../store/state";
const ReactPaginate = React.lazy(() => import("react-paginate"));

const Catalogheader = ({
  allcatdata,
  setcurrentcat,
  spinner,
  count,
  setCurrentPage,
  currentpage,
}) => {
  // const { t } = useTranslation();
  const [{}, dispatch] = useStateValue();
  const { id } = useParams();
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  const [itemsPerPage] = useState(20);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(allcatdata?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(count / itemsPerPage));
  }, [itemsPerPage, itemOffset, count, allcatdata?.length, allcatdata]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
    const newOffset = (event.selected * itemsPerPage) % allcatdata?.length;
    setItemOffset(newOffset);
    dispatch({
      type: "SCROLL__TOP",
    });
  };

  useEffect(() => {
    setItemOffset(0);
    setPageCount(0);
    setCurrentItems(null);
    setCurrentItems(null);
    setCurrentPage(0);
  }, [id]);

  const paginatedata = useMemo(() => {
    return (
      <ReactPaginate
        // previousLabel={t("Previous")}
        previousLabel="<"
        nextLabel=">"
        // nextLabel={t("Next")}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        onPageChange={(e) => handlePageClick(e)}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active_page"}
        renderOnZeroPageCount={null}
      />
    );
  }, [allcatdata, itemOffset, pageCount]);

  const currentItemsMemo = useMemo(() => {
    return currentItems?.map((data, i) => (
      <LazyLoad height={430}>
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
      </LazyLoad>
    ));
  }, [currentItems]);

  const country_of_origin = [
    { country_id: 123, country_name: 'test1' },
    { country_id: 123, country_name: 'test2' },
    { country_id: 113, country_name: 'test3' },
    { country_id: 144, country_name: 'test4' },
    { country_id: 190, country_name: 'test5' },
  ]

  const contryOfOriginMemo = useMemo(() => {
    return country_of_origin?.map((itm, index) => {
      return (
        <div className="listing_type" key={index}>
          <input
            type="checkbox"
            className="form-check-input"
            id={itm.country_id}
            // onChange={(e) => countryHandler(e, itm.country_id)}
          ></input>
          <label htmlFor={itm.country_id}>{itm.country_name}</label>
        </div>
      );
    });
  }, [country_of_origin]);

  return (
    <div className="catalog_container ">
      {spinner ? (
        <div className="incrementoptions__spinner">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="catalogheader__productCard">
          {window.innerWidth > 580 && currentItemsMemo}
          {window.innerWidth <= 580 && <CatalogBlockMini data={currentItems} />}
        </div>
      )}

      {count > itemsPerPage && (
        <div className="container_pagination">
          <Suspense fallback={<Spinner />}>{paginatedata}</Suspense>
        </div>
      )}
      {allcatdata?.length === 0 && (
        <p>No Products Available in this Category</p>
      )}
    </div>
  );
};

export default Catalogheader;
