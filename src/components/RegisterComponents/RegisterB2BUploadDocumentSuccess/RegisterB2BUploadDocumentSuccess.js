import React from "react";
import Navbar from "../../JagotaNavBar/Navbar";
import { Link } from "react-router-dom";
import "./RegisterB2BUploadDocumentSuccess.scss";

function RegisterB2BUploadDocumentSuccess({ setTab, previous }) {
  return (
    <div className="registerB2BUploadDocumentSuccess">
      <Navbar />
      <div className="container">
        <div className="pt-4 registerB2BUploadDocumentSuccess_top_section">
          <span
            className="registerB2BUploadDocumentSuccess_top_section_span_1"
            onClick={previous}
          >
            <i className="fas fa-chevron-left" />
            <span>Back to previous page</span>
          </span>
          <span className="registerB2BUploadDocumentSuccess_top_section_span_2 ">
            Complete progress 3 of 3
          </span>
        </div>{" "}
        <div className="Register_b2b_slt_topic">
          <div className="Register_b2b_slt_topic_steps d-flex justify-content-center text-center ">
            <div className="Register_b2b_slt_topic__business d-flex">
              <div>
                <span className="Register_b2b_slt_topic__business_circle">
                  1
                </span>
                <p className="m-0 pt-2">Basic information</p>
              </div>
            </div>
            <div className="Register_b2b_slt_topic_categery d-flex">
              <div>
                <span className="Register_b2b_slt_topic_categery_circle">
                  2
                </span>
                <p className="m-0 pt-2">Choose categary</p>
              </div>
            </div>
            <div className="Register_b2b_slt_topic_adddocument">
              <span className="Register_b2b_slt_topic_addbocument_circle">
                3
              </span>
              <p className="m-0 pt-2">Add documents</p>
            </div>
          </div>
        </div>
        <div className="registerB2BUploadDocumentSuccess_uploade_div">
          <h5 className="text-center color_g m-0 padding_top_50">
            Upload your Document (House Registration, Alcohol Registration)
          </h5>
          <div className="registerB2BUploadDocumentSuccess_uploade p-4">
            <div className="registerB2BUploadDocumentSuccess_uploade_feelds ">
              <div className="registerB2BUploadDocumentSuccess_uploade_drag">
                <div className="registerB2BUploadDocumentSuccess_uploade_drag_top">
                  <p className="m-0">PP20 Document</p>
                  <hr className="m-1" />
                  <small>1 of 1 uploaded</small>
                  <small className="float-end">
                    <Link className="text-secondary" to="./">
                      Cancel
                    </Link>
                  </small>
                </div>

                <div className=" registerB2BUploadDocumentSuccess_topic_file-drop-area d-flex ">
                  <div className="d-flex">
                    <i className="fas fa-file-upload fa-2x"></i>
                    <div className="registerB2BUploadDocumentSuccess_topic_file-drop-area_text">
                      <p className="m-0">filename.pdf</p>
                      <small>334kb</small>
                    </div>
                  </div>
                  <span>
                    <i className="far fa-check-circle text-end text-white" />
                  </span>
                </div>
              </div>
              <div className="registerB2BUploadDocumentSuccess_uploade_drag">
                <div className="registerB2BUploadDocumentSuccess_uploade_drag_top">
                  <p className="m-0">Business Registration Document</p>
                  <hr className="m-1" />
                  <small>1 of 1 uploaded</small>{" "}
                  <small className="float-end">
                    <Link className="text-secondary" to="./">
                      Cancel
                    </Link>
                  </small>
                </div>
                <div className=" registerB2BUploadDocumentSuccess_topic_file-drop-area d-flex ">
                  <div className="d-flex">
                    {" "}
                    <i className="fas fa-file-upload fa-2x"></i>
                    <div className="registerB2BUploadDocumentSuccess_topic_file-drop-area_text">
                      <p className="m-0">filename.pdf</p>
                      <small>334kb</small>
                    </div>
                  </div>{" "}
                  <span>
                    <i className="far fa-check-circle text-end text-white" />
                  </span>
                </div>
              </div>
              <div className="registerB2BUploadDocumentSuccess_uploade_drag">
                <div className="registerB2BUploadDocumentSuccess_uploade_drag_top">
                  <p className="m-0">Others</p>
                  <hr className="m-1" />
                  <small>1 of 1 uploaded</small>{" "}
                  <small className="float-end">
                    <Link className="text-secondary" to="./">
                      Cancel
                    </Link>
                  </small>
                </div>
                <div className=" registerB2BUploadDocumentSuccess_topic_file-drop-area d-flex ">
                  <div className="d-flex">
                    <i className="fas fa-file-upload fa-2x"></i>
                    <div className="registerB2BUploadDocumentSuccess_topic_file-drop-area_text">
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
          onClick={setTab}
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

export default RegisterB2BUploadDocumentSuccess;
