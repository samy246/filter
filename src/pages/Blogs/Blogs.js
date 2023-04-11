import React, { useEffect, useState } from "react";
import "./Blogs.scss";
import { useStateValue } from "../../store/state";
import axios from "axios";
import request from "../../request";
import { toast } from "react-toastify";

function Blogs() {
  const [{}, dispatch] = useStateValue();
  const [size, setSize] = useState(75);
  useEffect(() => {
    closeSide();
  }, []);

  const closeSide = () => {
    dispatch({
      type: "SET_MINICART",
      value: false,
    });
    dispatch({
      type: "SET_MINIMENU",
      value: false,
    });
    dispatch({
      type: "SET_NOTIFICATION",
      value: false,
    });
    dispatch({
      type: "SET_LANGUAGE",
    });
    dispatch({
      type: "SEARCHBAR__CLOSEOPEN",
    });
  };

  const [blogdata, setblogdata] = useState();
  useEffect(() => {
    async function fetchData() {
      try {
        const allblogdata = await axios({
          method: "get",
          url: request.bloglist,
        });
        setblogdata(allblogdata.data[1]);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
  }, []);

  const changesize = (value, size) => {};

  return (
    <div className="allblogs" onClick={closeSide}>
      {blogdata?.map((blog, i) => (
        <div className="allblogs__content" key={i}>
          <img src={`${request.image}/media/${blog.featured_img}`} alt="" />
          <p>
            {blog.meta_description.slice(0, size)}
            <> </>
            {blog.meta_description.length > size && (
              <span
                // onClick={() => setSize(blog.meta_description.length)}
                onClick={() => changesize(i, "more")}
              >
                Read More
              </span>
            )}
            {blog.meta_description.length === size && (
              <span
                // onClick={() => setSize(75)}
                onClick={() => changesize(i, "less")}
              >
                {" "}
                Read Less
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Blogs;
