import React from "react";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Jagota_nav_bar/Navbar";
import { Link } from "react-router-dom";
import "./register_b2b_upload_document.scss";
import Drag_and_drop from "../../../components/Drag_and_drop/Drag_and_drop";

function Register_b2b_upload_document() {
  return (
    <div className="Register_b2b_upload_document">
      <Navbar />
      <div className="Register_b2b_upload_document_main">
        <div className="container">
          <div className="pt-4 Register_b2b_upload_document_section">
            <span className="Register_b2b_upload_document_section_span_1">
              <i className="fas fa-chevron-left" />
              &nbsp;{" "}
              <Link
                className="Register_b2b_upload_document_section_span_1"
                to="/"
              >
                Back to previous page
              </Link>
            </span>
            <span className="Register_b2b_upload_document_section_span_2 float-end ">
              Compleate pages 5 of 5
            </span>
          </div>
          <div className="Register_b2b_upload_document">
            <div className="Register_b2b_upload_document_steps d-flex justify-content-center text-center ">
              <div className="Register_b2b_upload_document__business d-flex">
                <div>
                  <span className="Register_b2b_upload_document__business_circle">
                    1
                  </span>
                  <p className="m-0 pt-2">Basic Information</p>
                </div>
              </div>

              <div className="Register_b2b_upload_document_categery d-flex">
                <div>
                  <span className="Register_b2b_upload_document_categery_circle">
                    2
                  </span>
                  <p className="m-0 pt-2">Choose Categary</p>
                </div>
              </div>

              <div className="Register_b2b_upload_document_adddocument">
                <span className="Register_b2b_upload_document_addbocument_circle">
                  3
                </span>
                <p className="m-0 pt-2">Add Document</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h4 className="Register_b2b_upload_documents_heading text-center ">
        Uplode your Document (House Registation , Alcohol Registation)
      </h4>
      <div className="p-4">
        <div className="Register_b2b_upload_documents">
          <Drag_and_drop label="PP20 Document" id="pp20_document" />{" "}
          <Drag_and_drop
            label="Business Registration Document"
            id="business_registratio_document"
          />
          <Drag_and_drop label="Others" id="others" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register_b2b_upload_document;
