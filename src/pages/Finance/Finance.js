import React, { useEffect } from "react";
import "./Finance.scss";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../../store/state";
import InputMask from "react-input-mask";
import back from "../../assets/images/catalog/back.png";
import { useTranslation } from "react-i18next";
import Dashboard from "./Dashboard/Dashboard";

function Finance({ token }) {
  const history = useHistory();
  const { t } = useTranslation();
  const [{}, dispatch] = useStateValue();
  useEffect(() => {
    closeSide();
  }, []);

  const closeSide = () => {
    dispatch({
      type: "SET_MINICART",
      value: false,
    });
    dispatch({
      type: "SET_MINIMENU",
      value: false,
    });
    dispatch({
      type: "SET_NOTIFICATION",
      value: false,
    });
    dispatch({
      type: "SET_LANGUAGE",
    });
    dispatch({
      type: "SEARCHBAR__CLOSEOPEN",
    });
  };

  useEffect(() => {
    if (token === null || "" || undefined) {
      history.push("/login");
    }
  }, [token]);

  return (
    <div className="finance" onClick={closeSide}>
      <div className="finance__back" onClick={() => history.goBack()}>
        <span>
          <img src={back} alt="" />
        </span>
        {/* <h4>{t("My Finance")}</h4> */}
      </div>
      <Dashboard />
    </div>
  );
}

export default Finance;
