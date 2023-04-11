import React from "react";
import ProductCard from "../../Card/ProductCard";
import "./NewlyAdded.scss";
import logo from "../../../assets/images/konig/logo.png";

function NewlyAdded({ image1, image2 }) {
  return (
    <div className="newlyadded">
      <h3 className="fw-bold">Newly added Cookware (by König)</h3>
      <hr />
      <div className="newlyadded__productCard">
        <div className="newlyadded__image">
          <img src={logo} alt="" />
        </div>
        <ProductCard image={image1} />
        <ProductCard image={image2} />
        <ProductCard image={image1} />
        <ProductCard image={image2} />
        <ProductCard image={image1} />
        <ProductCard image={image2} />
        <p className="newlyAdded__seemore">
          <span className="newlyadded__text">See More</span>
          <span> {" >"} </span>
        </p>
      </div>
    </div>
  );
}

export default NewlyAdded;
