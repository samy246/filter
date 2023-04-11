import React from "react";
import { Form } from "react-bootstrap";

function FormInput({ adduser, label, ...otherProps }) {
  return (
    <div className="group">
      <Form.Group className="mb-3">
        <Form.Label className={`${adduser ? "" : "font-12"}`}>
          {label}
        </Form.Label>
        <Form.Control {...otherProps} />
      </Form.Group>
    </div>
  );
}

export default FormInput;
