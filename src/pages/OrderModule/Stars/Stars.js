import { Rating } from "react-simple-star-rating";

const Stars = ({ rating, setRating, rid }) => {
  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
    if (rate == 1 || rate == 2 || rate == 3 || rate == 4 || rate == 5) {
      setRating(parseInt(rate) * 20);
    } else {
      setRating(parseInt(rate));
    }

    // other logic
  };

  return (
    <Rating
      //   allowHalfIcon
      transition
      showTooltip
      onClick={handleRating}
      ratingValue={parseInt(rating)} /* Available Props */
    />
  );
};

export default Stars;
