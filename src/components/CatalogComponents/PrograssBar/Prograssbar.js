import React, { useEffect } from "react";
import "./prograssbar.scss";

function Prograssbar({ done, green, yellow, red, total }) {
  const [style, setStyle] = React.useState({});

  useEffect(() => {
    const newStyle = {
      opacity: 1,
      width: `${done / total * 100}%`,
    };
    setStyle(newStyle);
  }, [done]);

  return (
    <div style={{ flex: "1" }}>
      <div className="progress">
        <div
          className={`progress-done && ${green ? "green_bg" : ""} && ${
            yellow ? "yellow" : ""
          } && ${red ? "red" : ""}`}
          style={style}
        >
          <span className="d-none"> {total / done * 10}%</span>
        </div>
      </div>
    </div>
  );
}

export default Prograssbar;
