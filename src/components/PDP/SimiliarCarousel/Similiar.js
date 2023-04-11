import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card_img1 from "../../../assets/images/home/ProductCard/productcard1.jpg";
import Card_img2 from "../../../assets/images/home/ProductCard/productcard2.jpg";
import Card_img3 from "../../../assets/images/home/ProductCard/productcard3.jpg";
import Card_img4 from "../../../assets/images/home/ProductCard/productcard4.jpg";
import Card_img5 from "../../../assets/images/home/ProductCard/productcard5.jpg";
import Card_img6 from "../../../assets/images/home/ProductCard/productcard6.jpg";
import ProductCard from "../../Card/ProductCard";

function Similiar() {
  const responsive = {
    largedesktop: {
      breakpoint: { max: 3000, min: 1600 },
      items: 8,
      slidesToSlide: 4, // optional, default to 1.
    },
    desktop: {
      breakpoint: { max: 1600, min: 1440 },
      items: 7,
      slidesToSlide: 3, // optional, default to 1.
    },
    desktopMedium: {
      breakpoint: { max: 1440, min: 1024 },
      items: 6,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
  };
  return (
    <div className="similiar">
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={false}
        responsive={responsive}
        infinite={true}
        // autoPlay={this.props.deviceType !== "mobile" ? true : false}
        autoPlaySpeed={1000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerclassName="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        // deviceType={this.props.deviceType}
        dotListclassName="custom-dot-list-style"
        itemclassName="carousel-item-padding-40-px"
      >
        <ProductCard image={Card_img1} delvieryColor="blue" />
        <ProductCard image={Card_img6} delvieryColor="green" />
        <ProductCard image={Card_img3} delvieryColor="blue" />
        <ProductCard image={Card_img4} delvieryColor="green" />
        <ProductCard image={Card_img2} delvieryColor="green" />
        <ProductCard image={Card_img5} delvieryColor="yellow" />
        <ProductCard image={Card_img6} delvieryColor="green" />
        <ProductCard image={Card_img4} delvieryColor="green" />
        <ProductCard image={Card_img3} delvieryColor="green" />
        <ProductCard image={Card_img1} delvieryColor="yellow" />
        <ProductCard image={Card_img3} delvieryColor="green" />
        <ProductCard image={Card_img5} delvieryColor="green" />
        <ProductCard image={Card_img1} delvieryColor="green" />
        <ProductCard image={Card_img2} delvieryColor="green" />
        <ProductCard image={Card_img6} delvieryColor="green" />
      </Carousel>
      ;
    </div>
  );
}

export default Similiar;
