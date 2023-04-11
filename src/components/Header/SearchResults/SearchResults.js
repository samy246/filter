import React from "react";
import "./SearchResults.scss";
import { Link } from "react-router-dom";
import request from "../../../request";

function SearchResults({ searchresultsdata, searchproduct }) {

  return (
    <div className="searchResults">
      {!searchresultsdata[0]?.products[0]?.html && (
        <>
          <ul>
            {searchresultsdata[0]?.products?.map((s, i) => {
              return (
                <Link
                  to={`/${s?.new_price ? "productdetails" : "catalogdetails"}/${
                    s?.new_price ? "pdetails" : "cdetails"
                  }/${s.category_id}/${s.product_id}/${s.url_key}`}
                >
                  <li key={i}>
                    <img
                      alt=""
                      src={
                        s?.image
                          ? `${request.image}/media/catalog/product${s.image}`
                          : ""
                      }
                    />
                    <p>{s.name}</p>
                  </li>
                </Link>
              );
            })}
          </ul>
          <Link to={`/searchpage/${searchproduct}/0`} className="sr__viewall">
            View all ({searchresultsdata[0]?.total})
          </Link>
        </>
      )}
    </div>
  );
}

export default SearchResults;
