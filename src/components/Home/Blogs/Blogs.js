import React, { useState, useEffect } from "react";
import "./Blogs.scss";
import ImageSlider from "./ImageSlider/ImageSlider";
import IMAGES from "./data/data";
import { Link } from "react-router-dom";
import axios from "axios";
import request from "../../../request";
import { toast } from "react-toastify";

const Blogs = () => {
  const [blogdata, setblogdata] = useState();
  useEffect(() => {
    async function fetchData() {
      try {
        const allblogdata = await axios({
          method: "get",
          url: request.bloglist,
        });
        setblogdata(allblogdata?.data[1]);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="blogs">
      <h3>Blogs</h3>
      <hr />
      <div className="blogs__slider">
        <div className="blogs_images">
          <ImageSlider blogdata={blogdata} images={IMAGES} slidesToShow={3} />
        </div>
      </div>
      <Link to="/blogs">
        <p>See all Blog</p>
      </Link>
    </div>
  );
};

export default Blogs;
