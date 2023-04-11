import React, { useEffect } from "react";

export default function Spinner({ height }) {
  // useEffect(() => {
  //   document.getElementById("incrementoptions__spinner").style.width = height;
  // }, []);

  return (
    <div
      className="incrementoptions__spinner"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "1em 0",
      }}
    >
      <div
        className="spinner-border"
        style={{
          color: "#37bfa7",
        }}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
