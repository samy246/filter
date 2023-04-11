import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./footer.scss";

function Business_footer() {
  return (
    <footer className="jagota_footer bg-light text-end">
      <Link className="jagota_footer-link" to="./">
        Cancle
      </Link>
      <Button type="button" className="footer_button btn  btn-lg">
        Next &nbsp;
        <i
          className="fas fa-chevron-right footer_button_icon"
          aria-hidden="true"
        />
      </Button>{" "}
    </footer>
  );
}

export default Business_footer;
