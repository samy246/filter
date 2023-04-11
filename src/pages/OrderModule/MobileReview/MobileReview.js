import React, { useState } from "react";
import "./MobileReview.scss";
import { useParams } from "react-router-dom";
import { Rating } from "react-simple-star-rating";

function MobileReview() {
  const { pname, pid } = useParams();
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
  };

  return (
    <div className="mobilereview">
      <div className="mobilereview__container">
        <div className="container__top">
          {/* <img /> */}
          <h5>{pname}</h5>
        </div>

        <div className="container__rating">
          <h5>Write your review</h5>
          <Rating onClick={handleRating} ratingValue={rating} />
        </div>

        <textarea rows="20" />

        <p className="container__submit">Done</p>
      </div>
    </div>
  );
}

export default MobileReview;
