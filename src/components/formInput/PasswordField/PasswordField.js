import React, { useState } from "react";
import showPwdImg from "../../../assets/images/eye-solid.svg";
import hidePwdImg from "../../../assets/images/eye-slash-solid.svg";
import "./PasswordField.scss";

function PasswordField({ label, ...otherprops }) {
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  return (
    <div className="passwordfield">
      <div className="mb-3">
        <label htmlFor="exampleInputPassword1" className="form-label">
          {label}
        </label>
        <input
          className="form-control passwordfield_input"
          type={isRevealPwd ? "text" : "password"}
          autoComplete="new-password"
          {...otherprops}
        />
        <img
          title={isRevealPwd ? "Hide password" : "Show password"}
          src={isRevealPwd ? showPwdImg : hidePwdImg}
          onClick={() => setIsRevealPwd((prevState) => !prevState)}
          alt=""
        />
      </div>
    </div>
  );
}

export default PasswordField;
