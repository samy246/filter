import React, { useEffect, useState } from "react";
import "./CatalogCarousel.scss";

const MyCatalogCarousel = (props) => {
  const { children, show, small } = props;

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [length, setLength] = useState(children.length);

  const [touchPosition, setTouchPosition] = useState(0);

  // Set the length to match current children from props
  useEffect(() => {
    setLength(children.length);
  }, [children]);

  const next = () => {
    if (currentIndex < length - show) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e) => {
    const touchDown = touchPosition;

    if (touchDown === null) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      next();
    }

    if (diff < -5) {
      prev();
    }

    setTouchPosition(null);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {currentIndex > 0 && (
          <button onClick={prev} className="left-arrow">
            &lt;
          </button>
        )}
        <div
          className="carousel-content-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div
            className={`carousel-content show-${show}`}
            style={{
              transform: `translateX(-${currentIndex * (100 / show)}%)`,
            }}
          >
            {children}
          </div>
        </div>
        {small ? (
          <div>
            {currentIndex < length - 3 && (
              <button onClick={next} className="right-arrow">
                &gt;
              </button>
            )}
          </div>
        ) : (
          <div>
            {currentIndex < length - show && (
              <button onClick={next} className="right-arrow">
                &gt;
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCatalogCarousel;
