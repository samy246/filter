import React, {useEffect, useState} from "react";
import Prograssbar from "../PrograssBar/Prograssbar";
import "./PrograssBars.scss";
function PrograssBars({ bar }) {
  const [bardata, setbardata] = useState([])

  useEffect(() => {
    setbardata(bar);
  }, [bar]);

  return (
    <div className="progress__bars">
      <div className="pr-20">
        <span className=" h2 d-flex align ">
          <p>5</p>
          <i className="fas fa-star" />
          <Prograssbar green={"green"} done={bardata?.five ? parseInt(bardata?.five) : 0} total={bardata?.reviewsCount} />
        </span>
        <span className=" h2 d-flex align ">
          <p>4</p>
          <i className="fas fa-star" />
          <Prograssbar green={"green"} done={bardata?.four ? parseInt(bardata?.four) : 0} total={bardata?.reviewsCount} />
        </span>
        <span className=" h2 d-flex align ">
          <p>3</p>
          <i className="fas fa-star" />
          <Prograssbar green={"green"} done={bardata?.three ? parseInt(bardata?.three) : 0}total={bardata?.reviewsCount} />
        </span>
        <span className=" h2 d-flex align ">
          <p>2</p>
          <i className="fas fa-star" />
          <Prograssbar yellow={"yellow"} done={bardata?.two ? parseInt(bardata?.two) : 0} total={bardata?.reviewsCount} />
        </span>
        <span className=" h2 d-flex align ">
          <p>1</p>
          <i className="fas fa-star" />
          <Prograssbar red={"red"} done={bardata?.one ? parseInt(bardata?.one) : 0} total={bardata?.reviewsCount} />
        </span>
      </div>
    </div>
  );
}

export default PrograssBars;
