import React from "react";
import { NavLink } from "react-router-dom";
import "./SideMenuBar.scss";
import { useTranslation } from "react-i18next";

function SideMenuBar() {
  const { t } = useTranslation();
  const menu = [
    { label: `${t("My Profile")}`, link: "/myaccount/myprofile" },
    { label: `${t("My Finance")}`, link: "/myfinance" },
    {
      label: `${t("Delivery Address")}`,
      link: "/myaccount/deliveryaddress",
    },
    { label: `${t("User Setup")}`, link: "/myaccount/usersetup" },
    {
      label: `${t("Payment Method")}`,
      link: "/myaccount/paymentmethod",
    },
  ];
  return (
    <div className="sidemenubar">
      <ul>
        <p className="sidemenubar__heading">{t("My Account")}</p>
        {menu.map((m, index) => (
          <>
            {
              localStorage.getItem("currentrole") == "Purchaser" && index == 3
              ? "" :
              <NavLink key={index} exact activeClassName="active" to={m.link}>
                <div className="active__div">
                  <li className="sidemenubar__notSelected" key={index}>
                    {m.label}
                  </li>
                </div>
              </NavLink>
            }
          </>
          
        ))}
      </ul>
      <div
        className="sidemenubar__accordian accordion accordion-flush"
        id="accordionFlushExample"
      >
        <div className="accordion-item ">
          <p
            className="accordion-header accordion-button collapsed"
            id="flush-headingOne"
            type="button"
            data-toggle="collapse"
            data-target="#flush-collapseOne"
            aria-expanded="false"
            aria-controls="flush-collapseOne"
          >
            My Account
          </p>
          <div
            id="flush-collapseOne"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingOne"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <ol>
                {menu.map((m, index) => (
                  <>
                    {
                      localStorage.getItem("currentrole") == "Purchaser" && index == 3
                      ? "" :
                      <NavLink
                        key={index}
                        exact
                        activeClassName="active "
                        to={m.link}
                      >
                        <div
                          className="active__div accordion-header collapsed"
                          id="flush-headingOne"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseOne"
                          aria-expanded="false"
                          aria-controls="flush-collapseOne"
                        >
                          <li className="sidemenubar__notSelected" key={index}>
                            {m.label}
                          </li>
                        </div>
                      </NavLink>
                    }
                  </>
                  
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideMenuBar;
