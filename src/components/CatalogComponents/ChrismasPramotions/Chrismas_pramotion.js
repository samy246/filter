import React from "react";
import { Link } from "react-router-dom";
import request from "../../../request";
import "./chrismas_pramotion.styles.scss";

function Chrismas_pramotion({ bannerimage }) {
  return (
    <div className="chrismas__pramotion">
      <div className="d-flex chrismas__pramotion__heading">
        <h4 className="m-0 fw-bold">New Promotion for Christmas</h4>
        <Link className="text-dark seemore_link" to="/catalog">
          <span>See More</span>{" "}
          <i className="fas fa-angle-right chrismas_seemore_icon" />
        </Link>
      </div>
      <hr className="mt-1 mb-3" />
      <div className="chrismas__pramotion__image_div">
        {bannerimage ? (
          <img
            className="chrismas__pramotion__image rounded-0 w-100"
            src={`${request.image}/${bannerimage[0]?.image}`}
            alt="banner"
          />
        ) : (
          <p>
            <div className="finance__spinner">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Loading...</span>
            </div>
          </p>
        )}
      </div>
    </div>
  );
}

export default Chrismas_pramotion;
