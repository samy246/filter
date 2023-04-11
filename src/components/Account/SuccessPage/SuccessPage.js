import React from "react";
import { useParams } from "react-router";
import "./SuccessPage.scss";
import { useTranslation } from "react-i18next";

function SuccessPage() {
  const { t } = useTranslation();
  const { type } = useParams();
  return (
    <div className="successpage">
      <i className="far fa-check-circle green" />
      {type === "deliveryadded" ? <h2>{t("Address Saved Successfully")}.</h2> : ""}
      {type === "useradded" ? <h2>{t("User Saved Successfully")}.</h2> : ""}
      {type === "cardadded" ? <h2>{t("Card Saved Successfully")}.</h2> : ""}

      {type === "deliveryadded" ? (
        <p>{t("Please wait 2-3 days for Jagota team to review this address")}.</p>
      ) : (
        ""
      )}
      {type === "deliveryadded" ? (
        <a href="/myaccount/deliveryaddress">
          <button
            className="btn btn-primary continue__btn w-50"
            aria-label="deliveryadded"
          >
            {t("Continue")}
          </button>
        </a>
      ) : (
        ""
      )}
      {type === "useradded" ? (
        <a href="/myaccount/usersetup">
          <button
            className="btn btn-primary continue__btn w-50"
            href="/myaccount/usersetup"
            aria-label="useradded"
          >
            {t("Continue")}
          </button>
        </a>
      ) : (
        ""
      )}
      {type === "cardadded" ? (
        <a href="/myaccount/paymentmethod">
          <button
            className="btn btn-primary continue__btn w-50"
            href="/myaccount/paymentmethod"
            aria-label="paymenthod"
          >
            {t("Continue")}
          </button>
        </a>
      ) : (
        ""
      )}
    </div>
  );
}

export default SuccessPage;
