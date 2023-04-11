import React, { useState, useEffect, lazy } from "react";
import "./Account.scss";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import back from "../../../assets/images/catalog/back.png";
import { useStateValue } from "../../../store/state";
import { useHistory, useParams } from "react-router-dom";
const MyProfile = lazy(() => import("../../../components/Account/MyProfile/MyProfile"));
const SideMenuBar = lazy(() => import("../../../components/Account/SideMenuBar/SideMenuBar"));
const MyFinance = lazy(() => import("../../../components/Account/MyFinance/MyFinance"));
const DeliveryAddress = lazy(() => import("../../../components/Account/DeliveryAddress/DeliveryAddress"));
const UserSetup = lazy(() => import("../../../components/Account/UserSetup/UserSetup"));
const PaymentMethod = lazy(() => import("../../../components/Account/PaymentMethod/PaymentMethod"));
const SuccessPage =  lazy(() => import("../../../components/Account/SuccessPage/SuccessPage"));

function Account({ token }) {
  const { t } = useTranslation();
  const history = useHistory();
  const { type } = useParams();
  const [title, setTitle] = useState();
  const [newuser, setNewUser] = useState(false);
  const [action, setFormaction] = useState("");
  const [currentpage, setcurrentpage] = useState(false);
  const [root, setroot] = useState(
    JSON.parse(localStorage.getItem("userdata"))
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [newuser]);

  useEffect(() => {
    setroot(root?.extension_attributes?.aw_ca_company_user.is_root);
  }, []);

  const [{}, dispatch] = useStateValue();
  useEffect(() => {
    if (type) {
      setNewUser(false);
    }
  }, [type]);

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

  // useEffect(() => {
  //   if (token === null || "" || undefined) {
  //     toast.warning(`Please login before accessing ${type}`);
  //     history.push("/");
  //   }
  // });

  useEffect(() => {
    dispatch({
      type: "SET_MINIMENU",
      value: false,
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "SET_MINICART",
      value: false,
    });
  }, []);

  // Changeing title based on the pagetype passed in the url.
  useEffect(() => {
    if (type === "myprofile") {
      setTitle("My Profile");
    }
    if (type === "myfinance") {
      setTitle("Finance");
    }
    if (type === "deliveryaddress") {
      setTitle("Delivery Address");
    }
    if (type === "usersetup") {
      setTitle("User Setup");
    }
    if (type === "paymentmethod") {
      setTitle("Payment Method");
    }
    if (type === "success") {
      setTitle("success");
    }
  }, [type]);

  return (
    <div className="account" onClick={closeSide}>
      <div className="account__back">
        <p>
          {!currentpage ? (
            <span>
              {!newuser ? (
                <span>
                  {action === "" && (
                    <div className="account__back">
                      <span onClick={() => history.goBack()}>
                        <img src={back} alt="" />
                      </span>
                    </div>
                  )}
                  {action === "empty" && (
                    <div className="account__back">
                      <span onClick={() => setFormaction("")}>
                        <img src={back} alt="" />
                      </span>
                    </div>
                  )}
                  {action === "update" && (
                    <div className="account__back">
                      <span onClick={() => setFormaction("")}>
                        <img src={back} alt="" />
                      </span>
                    </div>
                  )}
                </span>
              ) : (
                <div className="account__back">
                  <span onClick={() => setNewUser(false)}>
                    <img src={back} alt="" />
                  </span>
                </div>
              )}
            </span>
          ) : (
            <div className="account__back">
              <span onClick={() => setcurrentpage(false)}>
                <img src={back} alt="" />
              </span>
            </div>
          )}
        </p>
      </div>
      <h3>{t("Setting Menu")}</h3>
      <div className="account__main">
        <div className="account__sidebar">
          <SideMenuBar />
        </div>
        <div className="account__content">
          {type === "myprofile" ? <MyProfile title={title} /> : ""}
          {type === "myfinance" ? <MyFinance title={title} /> : ""}
          {type === "deliveryaddress" ? (
            <DeliveryAddress
              title={title}
              newadd={newuser}
              setNewUser={setNewUser}
              handleNewPage={() => setNewUser(true)}
            />
          ) : (
            ""
          )}
          {type === "usersetup" ? (
            <UserSetup
              action={action}
              title={title}
              setFormaction={setFormaction}
            />
          ) : (
            ""
          )}
          {type === "paymentmethod" ? (
            <PaymentMethod
              handleNewPage={() => setcurrentpage(true)}
              currentpage={currentpage}
            />
          ) : (
            ""
          )}
          {type === "deliveryadded" ? <SuccessPage /> : ""}
          {type === "useradded" ? <SuccessPage /> : ""}
          {type === "cardadded" ? <SuccessPage /> : ""}
        </div>
      </div>
    </div>
  );
}

export default Account;
