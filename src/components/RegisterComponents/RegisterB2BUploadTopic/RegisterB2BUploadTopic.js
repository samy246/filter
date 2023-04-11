import React, { useState, useEffect } from "react";
import Navbar from "../../JagotaNavBar/Navbar";
import { Link } from "react-router-dom";
import Items from "./Categories";
import "./RegisterB2BUploadTopic.scss";

function RegisterB2BUploadTopic({ setTab, previous }) {
  const [Categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(Items);
  }, [Items]);

  return (
    <div className="registerB2BUploadTopic">
      <Navbar />
      <div className="container">
        <div className="pt-4 registerB2BUploadTopic_top_section">
          <span className="registerB2BUploadTopic_top_section_span_1">
            <i className="fas fa-chevron-left" />
            <span
              className="registerB2BUploadTopic_top_section_span_1"
              onClick={previous}
            >
              Back to previous page
            </span>
          </span>
          <span className="registerB2BUploadTopic_top_section_span_2 float-end ">
            Complete progress 2 of 3
          </span>
        </div>
        <div className="registerB2BUploadTopic_topic">
          <div className="registerB2BUploadTopic_topic_steps d-flex justify-content-center text-center ">
            <div className="registerB2BUploadTopic_topic__business d-flex">
              <div className="registerB2BUploadTopic_topic__business_data">
                <span className="registerB2BUploadTopic_topic__business_circle">
                  1
                </span>
                <p className="m-0 pt-2 registerB2BUploadTopic_topic__business_para green">
                  Basic Information
                </p>
              </div>
            </div>

            <div className="registerB2BUploadTopic_topic_categery d-flex">
              <div className="registerB2BUploadTopic_topic_categery_data">
                <span className="registerB2BUploadTopic_topic_categery_circle">
                  2
                </span>
                <p className="m-0  pt-2 registerB2BUploadTopic_topic__category_para green">
                  Choose category
                </p>
              </div>
            </div>

            <div className="registerB2BUploadTopic_topic_adddocument">
              <span className="registerB2BUploadTopic_topic_addbocument_circle gray">
                3
              </span>
              <p className="m-0  gray pt-2 registerB2BUploadTopic_topic__adddocument_para">
                Add documents
              </p>
            </div>
          </div>
        </div>
        <div className="top_favorite_categories">
          <h5 className="text-center head">My top 5 favorite categories are</h5>
          <div className="top_categories_container m-auto">
            <div className="top_categories_items">
              {Categories.map((item) => (
                <div key={item.id} className="categories__item__check">
                  <input
                    className="form-check-input m-0 categories__item__check__box"
                    type="checkbox"
                    defaultValue
                    id={item.name}
                  />
                  <label htmlFor={item.name}>
                    <img
                      className="top_categories_item_img"
                      src={item.img}
                      alt=""
                    />
                    <div className="top_categories_name ">
                      <p className=" m-0">{item.name}</p>
                    </div>
                  </label>
                </div>
              ))}{" "}
            </div>
            <div>
              <p className="text-center shoping__list">
                I have my shopping list ..
              </p>
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
          onClick={setTab}
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

export default RegisterB2BUploadTopic;
