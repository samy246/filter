import React, { useState } from "react";
import Navbar from "../../../components/Jagota_nav_bar/Navbar";
import { Link } from "react-router-dom";
import "./register_b2b_upload_document_success.scss";
import Register_b2b_success_screen from "../Register_b2b_success_screen/Register_b2b_success_screen";

function Register_b2b_upload_document_success() {
  const [Success_scree, setSuccess_scree] = useState(false);

  const Success_scree_handler = () => {
    setSuccess_scree(true);
  };

  if (Success_scree) {
    return <Register_b2b_success_screen />;
  } else {
    return (
      <div className="Register_b2b_upload_document_success">
        <Navbar />
        <div className="container">
          <div className="pt-4 Register_b2b_upload_document_success_top_section">
            <small className="Register_b2b_upload_document_success_top_section_span_1">
              <i className="fas fa-chevron-left" />
              &nbsp;
              <Link
                className="Register_b2b_upload_document_success_top_section_span_1"
                to="./"
              >
                Back to previous page
              </Link>
            </small>
            <small className="Register_b2b_upload_document_success_top_section_span_2 float-end ">
              Complete pages 5 of 5
            </small>
          </div>
          <div className="Register_b2b_upload_document_success_uploade_div">
            <h5 className="text-center color_g m-0 padding_top_50">
              Upload your Document (House Registration, Alcohol Registration)
            </h5>
            <div className="Register_b2b_upload_document_success_uploade p-4">
              <div className="Register_b2b_upload_document_success_uploade_feelds ">
                <div className="Register_b2b_upload_document_success_uploade_drag">
                  <div className="Register_b2b_upload_document_success_uploade_drag_top">
                    <p className="m-0">PP20 Document</p>
                    <hr className="m-1" />
                    <small>1 of 1 uploaded</small>
                    <small className="float-end">
                      <Link className="text-secondary" to="./">
                        Cancel
                      </Link>
                    </small>
                  </div>
                  <div className=" Register_b2b_upload_document_success_topic_file-drop-area d-flex ">
                    <div className="d-flex">
                      <i className="fas fa-file-upload fa-2x"></i>
                      <div className="Register_b2b_upload_document_success_topic_file-drop-area_text">
                        <p className="m-0">filename.pdf</p>
                        <small>334kb</small>
                      </div>
                    </div>
                    <span>
                      <i className="far fa-check-circle text-end text-white" />
                    </span>
                  </div>
                </div>
                <div className="Register_b2b_upload_document_success_uploade_drag">
                  <div className="Register_b2b_upload_document_success_uploade_drag_top">
                    <p className="m-0">Business Registration Document</p>
                    <hr className="m-1" />
                    <small>1 of 1 uploaded</small>{" "}
                    <small className="float-end">
                      <Link className="text-secondary" to="./">
                        Cancel
                      </Link>
                    </small>
                  </div>
                  <div className=" Register_b2b_upload_document_success_topic_file-drop-area d-flex ">
                    <div className="d-flex">
                      {" "}
                      <i className="fas fa-file-upload fa-2x"></i>
                      <div className="Register_b2b_upload_document_success_topic_file-drop-area_text">
                        <p className="m-0">filename.pdf</p>
                        <small>334kb</small>
                      </div>
                    </div>{" "}
                    <span>
                      <i className="far fa-check-circle text-end text-white" />
                    </span>
                  </div>
                </div>
                <div className="Register_b2b_upload_document_success_uploade_drag">
                  <div className="Register_b2b_upload_document_success_uploade_drag_top">
                    <p className="m-0">Others</p>
                    <hr className="m-1" />
                    <small>1 of 1 uploaded</small>{" "}
                    <small className="float-end">
                      <Link className="text-secondary" to="./">
                        Cancel
                      </Link>
                    </small>
                  </div>
                  <div className=" Register_b2b_upload_document_success_topic_file-drop-area d-flex ">
                    <div className="d-flex">
                      <i className="fas fa-file-upload fa-2x"></i>
                      <div className="Register_b2b_upload_document_success_topic_file-drop-area_text">
                        <p className="m-0">filename.pdf</p>
                        <small>334kb</small>
                      </div>
                    </div>{" "}
                    <span>
                      <i className="far fa-check-circle text-end text-white" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="jagota_footer bg-light text-end">
          <Link className="jagota_footer-link" to="./">
            Cancel
          </Link>
          <button
            type="button"
            className="footer_button btn  btn-lg"
            onClick={() => Success_scree_handler()}
          >
            Next &nbsp;
            <i
              className="fas fa-chevron-right footer_button_icon"
              aria-hidden="true"
            />
          </button>{" "}
        </footer>
      </div>
    );
  }
}

export default Register_b2b_upload_document_success;
