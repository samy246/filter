import React from "react";
import "./catalogsuccesspopup.scss";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function CatalogSuccessPopUp({ close, show }) {
  const { t } = useTranslation();
  return (
    <div>
      <Modal
        dialogClassName="catalog__modal"
        className="text-center p-4"
        centered
        show={show}
      >
        <Modal.Body>
          <div className="catalog__modal__body">
            <i className="fas fa-check-circle fa-5x"></i>
            <h3 className="pt-4 pb-2">{t("Success")}!</h3>
            <p className="pt-4 pb-4">
            {t("Your Quotation has been sent successfully")}.
            </p>
            <button type="button" className="btn suceesbutton" onClick={close}>
            {t("Continue")}{" "}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CatalogSuccessPopUp;
