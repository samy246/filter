import React from "react";
import { Form } from "react-bootstrap";

function Mandatery_Input_feeld({ label, ...otherProps }) {
  return (
    <div className="group">
      <Form.Group className="mb-3">
        <Form.Label className="font-10">
          {label}
          <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control {...otherProps} />
      </Form.Group>
    </div>
  );
}

export default Mandatery_Input_feeld;
