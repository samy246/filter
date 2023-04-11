import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Jagota_nav_bar/Navbar";
import { Link } from "react-router-dom";
import Items from "../Register_b2b_slt_topic/Categories";
import "./register_b2b_upload_topic.scss";
import Register_b2b_upload_document_success from "../Register_b2b_upload_document_success/Register_b2b_upload_document_success";

function Register_b2b_upload_topic() {
  const [Categories, setCategories] = useState([]);
  const [upload_document, setUpload_document] = useState(false);

  useEffect(() => {
    setCategories(Items);
  }, [Items]);
  const Upload_document_handler = () => {
    setUpload_document(true);
  };

  if (upload_document) {
    return <Register_b2b_upload_document_success />;
  } else {
    return (
      <div className="Register_b2b_upload_topic">
        <Navbar />
        <div className="container">
          <div className="pt-4 Register_b2b_upload_topic_top_section">
            <span className="Register_b2b_upload_topic_top_section_span_1">
              <i className="fas fa-chevron-left" />
              &nbsp;{" "}
              <Link
                className="Register_b2b_upload_topic_top_section_span_1"
                to="./register"
              >
                Back to previous page
              </Link>
            </span>
            <span className="Register_b2b_upload_topic_top_section_span_2 float-end ">
              Compleate pages 2 of 5
            </span>
          </div>
          <div className="Register_b2b_upload_topic_topic">
            <div className="Register_b2b_upload_topic_topic_steps d-flex justify-content-center text-center ">
              <div className="Register_b2b_upload_topic_topic__business d-flex">
                <div className="Register_b2b_upload_topic_topic__business_data">
                  <span className="Register_b2b_upload_topic_topic__business_circle">
                    1
                  </span>
                  <p className="m-0 fw-bold pt-2 Register_b2b_upload_topic_topic__business_para green">
                    Basic Information
                  </p>
                </div>
              </div>

              <div className="Register_b2b_upload_topic_topic_categery d-flex">
                <div className="Register_b2b_upload_topic_topic_categery_data">
                  <span className="Register_b2b_upload_topic_topic_categery_circle">
                    2
                  </span>
                  <p className="m-0 fw-bold pt-2 Register_b2b_upload_topic_topic__category_para green">
                    Choose category
                  </p>
                </div>
              </div>

              <div className="Register_b2b_upload_topic_topic_adddocument">
                <span className="Register_b2b_upload_topic_topic_addbocument_circle gray">
                  3
                </span>
                <p className="m-0 fw-bold gray pt-2 Register_b2b_upload_topic_topic__adddocument_para">
                  Add documents
                </p>
              </div>
            </div>
          </div>
          <div className="top_favorite_categories">
            <h5 className="text-center head">
              My top 5 favorite categories are
            </h5>
            <div className="top_categories_container m-auto">
              <div className=" col-md-12 justify-content-center">
                <div className="row m-0">
                  {Categories.map((item) => (
                    <div
                      key={item.id}
                      className="col-md-2 col-sm-3 col-3 m p-0"
                    >
                      <div className="top_categories_item m-2 position-relative">
                        <div className="categories__item__check">
                          <input
                            className="form-check-input m-0 categories__item__check__box"
                            type="checkbox"
                            defaultValue
                            id={item.name}
                          />{" "}
                          <label htmlFor={item.name}>
                            <img
                              className="top_categories_item_img"
                              src={item.img}
                              alt="top_categorie_img"
                            />
                            <p className="top_categories_name m-0">
                              {item.name}
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}{" "}
                </div>
              </div>
              <div>
                <p className="text-center">I have my shopping list ..</p>
                <div className=" d-flex pb-3">
                  <div className="uploade_drag">
                    <div>
                      <small>1 of file uploaded</small>{" "}
                      <small className="float-end">
                        <Link className=" text-secondary" to="./">
                          Cancel
                        </Link>
                      </small>
                    </div>
                    <div className=" topic_file-drop-area d-flex ">
                      <i className="fas fa-file-upload fa-2x"></i>
                      <div className="text">
                        <p className="m-0">filename.pdf</p>
                        <small>334kb</small>
                      </div>
                    </div>
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
            to="./upload/success"
            type="button"
            className="footer_button btn  btn-lg"
            onClick={() => Upload_document_handler()}
          >
            Next &nbsp;
            <i
              className="fas fa-chevron-right footer_button_icon"
              aria-hidden="true"
            />
          </button>
        </footer>
      </div>
    );
  }
}

export default Register_b2b_upload_topic;
