import React, { useState } from "react";
import "./RegisterPage.scss";
import RegisterSltB2B from "../../components/RegisterComponents/RegisterSltB2B/RegisterSltB2B";
import RegisterInformSuccess from "../../components/RegisterComponents/RegisterInformSuccess/RegisterInformSuccess";
import RegisterB2BUploadTopic_top_section from "../../components/RegisterComponents/RegisterB2BUploadTopic/RegisterB2BUploadTopic";
import RegisterB2BUploadDocumentSuccess_uploade_feelds from "../../components/RegisterComponents/RegisterB2BUploadDocumentSuccess/RegisterB2BUploadDocumentSuccess";
import RegisterB2BSuccessScreen from "../../components/RegisterComponents/RegisterB2BSuccessScreen/RegisterB2BSuccessScreen";
import RegisterHomeCookingInform from "../../components/RegisterComponents/RegisterHomeCookingInform/RegisterHomeCookingInform";

function RegisterPage() {
  const [tab, setTab] = useState("");
  const changeTab = (value) => {
    setTab(value);
  };
  return (
    <div className="registerpage">
      {tab ? (
        <div className="tabs">
          <div
            className={`registerpage__register ${
              tab === "RegisterInformSuccess" && "register__show"
            }`}
          >
            <RegisterInformSuccess setTab={setTab} />
          </div>
          <div
            className={`registerpage__register ${
              tab === "Register_b2b_upload_topic_top_section" &&
              "register__show"
            }`}
          >
            <RegisterB2BUploadTopic_top_section
              previous={() => changeTab("RegisterInformSuccess")}
              setTab={() =>
                changeTab("RegisterB2BUploadDocumentSuccess_uploade_feelds")
              }
            />
          </div>
          <div
            className={`registerpage__register ${
              tab === "RegisterB2BUploadDocumentSuccess_uploade_feelds" &&
              "register__show"
            }`}
          >
            <RegisterB2BUploadDocumentSuccess_uploade_feelds
              previous={() =>
                changeTab("Register_b2b_upload_topic_top_section")
              }
              setTab={() => changeTab("RegisterB2BSuccessScreen")}
            />
          </div>{" "}
          <div
            className={`registerpage__register ${
              tab === "RegisterB2BSuccessScreen" && "register__show"
            }`}
          >
            <RegisterB2BSuccessScreen setTab={() => changeTab("")} />
          </div>
          <div
            className={`registerpage__register ${
              tab === "RegisterHomeCookingInform" && "register__show"
            }`}
          >
            <RegisterHomeCookingInform setTab={() => changeTab("")} />
          </div>
        </div>
      ) : (
        <RegisterSltB2B
          RedirectToInform__success={() => changeTab("RegisterInformSuccess")}
          Redirect__B2C__ToInform__success={() =>
            changeTab("RegisterHomeCookingInform")
          }
        />
      )}
    </div>
  );
}

export default RegisterPage;
