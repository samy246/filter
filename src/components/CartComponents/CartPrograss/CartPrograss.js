import React from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../../../store/state";
import back from "../../../assets/images/catalog/back.png";
import { useTranslation } from "react-i18next";

import "./CartPrograss.scss";

function CartPrograss({ Delivery, Payment, selected }) {
  const { t } = useTranslation();
  const history = useHistory();
  const [{ review }] = useStateValue();

  const PrograssLine = () => (
    <div
      className={`cartprograss__line  d-flex ${
        Payment ? "cartprograss__line__selected" : ""
      }`}
    >
      <p className={`cartprograss__step m-0 bg-white `}></p>
      <p className="cartprograss__step_2 m-0 bg-white"></p>
    </div>
  );
  const PrograssLineSelected = () => (
    <div className="cartprograss__line cartprograss__line__selected d-flex">
      <p className={`cartprograss__step m-0 bg-white `}></p>
      <p className="cartprograss__step_2 m-0 bg-white"></p>
    </div>
  );

  return (
    <div className="cartpage__prograss">
      <div className="prograss__header">
        {window.location.pathname === "/cartPage/payment" ? (
          <a
            className="cartpage__backprev__text"
            href="/cartPage/OrdertoDelivery"
          >
            <img src={back} alt="" />
          </a>
        ) : (
          <span
            className="cartpage__backprev__text"
            onClick={() => history.goBack()}
          >
            <img src={back} alt="" />
          </span>
        )}

        <h1 className="pt-1 pb-2 text-center">{t("Cart")}</h1>
      </div>
      <div
        className={`cartPrograss ${Delivery && "delivery__seleted"} && ${
          Payment && "payment__seleted"
        } ${review && "review__seleted"}`}
      >
        <div className="cartPrograss__first__step d-flex ">
          <div className="text-center">
            <i className="fas fa-check-circle  fa-lg" />
            <p className="m-0  shopping">{t("Shopping Cart")}</p>
          </div>
          <PrograssLineSelected />
        </div>
        <div className="cartPrograss__second__step d-flex">
          <div className={`text-center  && `}>
            <i className="fas fa-check-circle  fa-lg" />
            <p className="m-0  payment">{t("Payment")} </p>
          </div>
          <div className={`cartprograss__line  d-flex `}>
            <p className={`cartprograss__step m-0 bg-white `}></p>
            <p className="cartprograss__step_2 m-0 bg-white"></p>
          </div>
        </div>
        <div className="cartPrograss__third__step d-flex">
          <div className={`text-center  && `}>
            <i className={`fas fa-check-circle  fa-lg d-none`} />
            <p className="m-0  sendorder">{t("Send Order")} </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPrograss;
