import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import "./CRPopup.scss";

const popover = (
  <Popover id="popover-basic">
    {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
    <Popover.Body>
      <p className="CR__amount">
        <span className="label">Amount</span>
        <span className="value">
          <input />
        </span>
      </p>
      <p className="CR__note">
        <span className="label">Note</span>
        <span className="value">
          <textarea />
        </span>
      </p>
      <p className="CR__sendbutton">Send Request</p>
    </Popover.Body>
  </Popover>
);

const CRPopup = () => (
  <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
    <Button className="CRbutton" variant="success">
      Credit Request
    </Button>
  </OverlayTrigger>
);

// render(<CRPopup />);

export default CRPopup;
