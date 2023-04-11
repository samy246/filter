import React, { useState } from "react";
import "./Verificationsuccess.scss";
import { Link } from "react-router-dom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
function VerificationSuccess() {
  const [open, setOpen] = useState(false);
  const onCloseModal = () => {
    setOpen(false);
  };
  return (
    <div className="verification_1">
      <div className="verfication__image_1">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFmSohe4n2pow6LpJd8OOyypl-FFmVNdlllA&usqp=CAU"
          alt=""
        />
      </div>
      <h4>Password Reset!!</h4>
      <small>Your Password has been reset succesfully</small>
      <p className="verification__submit_1">
        <Link to="/">Continue To Shopping</Link>
      </p>
      <Modal
        classNames={{
          overlay: "customOverlay",
          modal: "verification_success_modal",
        }}
        open={open}
        onClose={() => onCloseModal()}
      >
        <div className="changepassword__verification">
          <VerificationSuccess />
        </div>
      </Modal>
    </div>
  );
}

export default VerificationSuccess;
