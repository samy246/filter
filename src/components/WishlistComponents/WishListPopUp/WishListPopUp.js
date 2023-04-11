import React from "react";
import "./WishListPopUp.scss";
import { Modal } from "react-bootstrap";

function WishListPopUp({ show, close, closepopup }) {
  return (
    <div className="wishlistpopup">
      <Modal
        className="text-center p-4"
        dialogClassName="modal-90w"
        aria-labelledby="contained-modal-title-vcenter"
        show={show}
      >
        <div className="wishlistpopup__body">
          <div className=" pb-2">
            <i className="far fa-trash-alt fa-3x wishlistpopup__body__icon " />
          </div>
          <h6 className="pb-2">Remove this item from Wishlist?</h6>
          <div className="wishlistpopup__button d-grid gap-4 col-9 mx-auto">
            <button
              type="button"
              className="btn btn-danger remove__button"
              onClick={close}
            >
              Remove
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary Cancle_button"
              onClick={closepopup}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default WishListPopUp;
