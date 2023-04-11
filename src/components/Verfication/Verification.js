import React, { useState } from "react";
import "./Verification.scss";
import { Link } from "react-router-dom";

const Verification = (data) => {
  const [setv1] = useState({});
  const VerificationValue = (event, last) => {
    setv1(event.target.value);
    if (event.target.value?.length) {
      document.getElementById(last)?.focus();
    }
  };
  const clearText = () => {
    setv1();
  };

  return (
    <div className="verification">
      <div className="verfication__image">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw0JTEa_qq6ucEjVLyUbCuM7KH6SG_PgK5FQ&usqp=CAU"
          alt=""
        />
      </div>
      <h4>Enter Verification Code</h4>
      <p>We have sent the code verification to your Email / Telephone Number</p>
      <small>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          className="bi bi-envelope"
          viewBox="0 0 16 16"
        >
          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z" />
        </svg>
        Thomas.j@gmail.com
      </small>
      <div className="verification__code">
        <input
          type="text"
          maxLength="1"
          id="1"
          onKeyUp={(e) => VerificationValue(e, "2")}
          onClick={clearText}
        />
        <input
          type="text"
          maxLength="1"
          id="2"
          onKeyUp={(e) => VerificationValue(e, "3")}
          onClick={clearText}
        />
        <input
          type="text"
          maxLength="1"
          id="3"
          onKeyUp={(e) => VerificationValue(e, "4")}
          onClick={clearText}
        />
        <input
          type="text"
          maxLength="1"
          id="4"
          onKeyUp={(e) => VerificationValue(e, "5")}
          onClick={clearText}
        />
        <input
          type="text"
          maxLength="1"
          id="5"
          onKeyUp={(e) => VerificationValue(e, "6")}
          onClick={clearText}
        />
        <input
          type="text"
          maxLength="1"
          id="6"
          onKeyUp={(e) => VerificationValue(e)}
          onClick={clearText}
        />
      </div>
      <small>
        <Link to="/changepassword">Resend Code</Link>
      </small>
      <p className="verification__submit" onClick={data?.data}>
        Submit
      </p>
    </div>
  );
};

export default Verification;
