import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Jagota_nav_bar/Navbar";
import { Link } from "react-router-dom";
import Items from "./Categories";
import "./register_b2b_slt_topic.scss";

function Register_b2b_slt_topic() {
  const [Categories, setCategories] = useState([]);
  useEffect(() => {
    setCategories(Items);
  }, [Items]);

  return (
    <div className="Register_b2b_slt">
      <Navbar />
      <div className="container">
        <div className="pt-4 Register_b2b_slt_top_section">
          <span className="Register_b2b_slt_top_section_span_1">
            <i className="fas fa-chevron-left" />
            &nbsp;{" "}
            <Link className="Register_b2b_slt_top_section_span_1">
              Back to previous page
            </Link>
          </span>
          <span className="Register_b2b_slt_top_section_span_2 float-end ">
            Complete pages 2 of 5
          </span>
        </div>
        <div className="Register_b2b_slt_topic">
          <div className="Register_b2b_slt_topic_steps d-flex justify-content-center text-center ">
            <div className="Register_b2b_slt_topic__business d-flex">
              <div>
                <span className="Register_b2b_slt_topic__business_circle">
                  1
                </span>
                <p className="m-0 pt-2">Basic Information</p>
              </div>
            </div>
            <div className="Register_b2b_slt_topic_categery d-flex">
              <div>
                <span className="Register_b2b_slt_topic_categery_circle">
                  2
                </span>
                <p className="m-0 pt-2">Choose Categary</p>
              </div>
            </div>
            <div className="Register_b2b_slt_topic_adddocument">
              <span className="Register_b2b_slt_topic_addbocument_circle">
                3
              </span>
              <p className="m-0 pt-2">Add Document</p>
            </div>
          </div>
        </div>
        <div className="top_favorite_categories">
          <h5 className="text-center head">My top 5 favorite categories are</h5>
          <div className="top_categories_container m-auto">
            <div className=" col-md-12 ">
              <div className="row m-0">
                {Categories.map((item) => (
                  <div className="col-md-2 col-sm-3 col-3 m-2 p-0">
                    <div className="top_categories_item position-relative">
                      <img
                        className="top_categories_item_img"
                        src={item.img}
                        alt="top_categorie_img"
                      />
                      <p className="top_categories_name m-0">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-center">i have my shoping list</p>
              <div className="container d-flex justify-content-center mt-100 drag-and-drop">
                <div className="row">
                  <div className="col-md-12">
                    <div className="file-drop-area">
                      <i className="fas fa-file-upload fa-3x"></i>
                      <p className="file-message">drag and drop files here</p>
                      <input
                        className="file-input"
                        type="file"
                        multiple
                        hidden
                      />
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
        <Link
          to="./success"
          type="button"
          className="footer_button btn btn-secondary btn-lg"
        >
          Next &nbsp;
          <i
            className="fas fa-chevron-right footer_button_icon"
            aria-hidden="true"
          />
        </Link>{" "}
      </footer>
    </div>
  );
}

export default Register_b2b_slt_topic;
