import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./boughtTogether.scss";
import axios from "axios";
import { useStateValue } from "../../../store/state";
import request from "../../../request";
import NewCard from "../../NewCard/NewCard";
import Slider from "react-slick";

function BoughtTogether({ title }) {
  const [bought, setbought] = useState([]);
  const [{ gt }, dispatch] = useStateValue();

  const settings = {
    dots: false,
    infinite: false,
    // rtl: true,
    speed: 500,
    slidesToScroll: 5,
    slidesToShow: 5,
    initialSlide: 0,
    focusOnSelect: false,
    speed: 400,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          initialSlide: 5,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      // {
      //   breakpoint: 480,
      //   settings: {
      //     slidesToShow: 1,
      //     slidesToScroll: 1,
      //     initialSlide: 0,
      //   },
      // },
    ],
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const boughttogther = await axios({
          method: "get",
          url: `${request.productslider}/6/${
            localStorage.getItem("storeid") != "undefined"
              ? localStorage.getItem("storeid")
              : 1
          }/${
            localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
          }`,
        });
        setbought(boughttogther.data);
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gt]);
  return (
    <div className="boughtTogether">
      <h3 className="fw-bold">{title}</h3>
      <hr />
      <div className="boughtTogether__productCard ">
        <Slider {...settings}>
          {bought.map((data, i) => (
            <NewCard
              key={i}
              pid={data.entity_id}
              sku={data.sku}
              delvieryColor="green"
              name={data.name}
              price={data.price}
              specialpriceExpiry={data.special_to_date}
              specialprice={data.special_price}
              url_key={data.url_key}
              alldata={data}
              stock={data.is_in_stock}
              image={data.thumbnail}
              delivery_in={data.delivery_in}
              page="catalogdetails"
              id={data.category_id}
              favourite={data.favourite}
              wish={data.wish}
              ordertaking={data.order_taking}
              order_taking_end_date={data?.order_taking_end_date}
              quty={data.qty}
              options={data.options}
              quote={data?.quote}
              dunit={data?.selling_unit}
              brand_name={data?.brand_name}
              pack_size={data?.pack_size}
              unit_per_box={data?.unit_per_box}
              unit_box={data?.unit_box}
              unit_box_unit={data?.unit_box_unit}
              product_status={data?.product_status}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default BoughtTogether;
