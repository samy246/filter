import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./myCatalogs.styles.scss";
import { useParams } from "react-router-dom";

function MyCatalogs({ data, heading, all }) {
  const { categoryType } = useParams();
  const [activeIndex, setActiveIndex] = useState(null);
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };
  return (
    <div className="mycatalogs">
      {heading ? (
        <h4 className="mycatalogs_heading fw-bold">{heading}</h4>
      ) : null}
      <div className="mycatalogs__menu">
        <ul className="mycatalogs__menu__list list-unstyled m-0">
          <li
            className={`mycatalogs__plpheader ${
              !categoryType && "mycatalogs__plpheader__open"
            } ${all ? "d-none" : ""}`}
          >
            <Link to="./">
              <i className="fas fa-shopping-basket" />
              <span>All Category</span>
            </Link>
          </li>
          {data?.map((d, index) => (
            <li
              className={`mycatalogs__categoryList && ${
                activeIndex === index ? "active" : "unactive"
              }`}
              onClick={() => handleOnClick(index)}
              key={index}
            >
              <div className="mycatalogs__categoryList__div">
                <Link className="d-flex" to={d.link ? d.link : "/catalog"}>
                  {d.icon ? (
                    <i className={d.icon}></i>
                  ) : (
                    <i className="fas fa-bacon"></i>
                  )}
                  <span>{d.label}</span>
                </Link>
              </div>
            </li>
          ))}
          <li>
            <Link className="p-0" to="./">
              <i className="fas fa-chevron-circle-right fa-lg" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MyCatalogs;
