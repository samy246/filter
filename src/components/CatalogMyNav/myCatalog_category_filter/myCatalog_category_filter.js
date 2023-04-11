import React, { useEffect, useState, useMemo } from "react";
import "react-input-range/lib/css/index.css";
import axios from "axios";
import request from "../../../request";
import "./myCatalog_category_filter.scss";
import { useTranslation } from "react-i18next";
import AccordionCom from "./AccordionCom";
import Spinner from "../../Spinner";

function MyCatalog_category_filter({
  country_of_origin,
  setcountry,
  // country,
  id,
  allFilter,
  selectedCategory,
  setselectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedVariety,
  setSelectedVariety,
  selectedAssortOne, setSelectedAssortOne,
  selectedAssortTwo, setSelectedAssortTwo,
  selectedAssortThree, setSelectedAssortThree,
  brandFilter,
  setSelectedBrand,
  productType,
  setSelectedProductType
}) {
 
  const { t } = useTranslation();
  const [allCategory, setAllCategory] = useState([]);
  const [allSubCategory, setAllSubCategory] = useState([]);
  const [allVariety, setAllVariety] = useState([]);
  const [allAssortOne, setAllAssortOne] = useState([]);
  const [allAssortTwo, setAllAssortTwo] = useState([]);
  const [allAssortThree, setAllAssortThree] = useState([]);



  const [parentheader, setparentheader] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const parent = await axios({
          method: "get",
          url: `${request.parentcategory}/2/${
            localStorage.getItem("companyid")
              ? localStorage.getItem("companyid")
              : 0
          }/${
            localStorage.getItem("storeid") != "undefined"
              ? localStorage.getItem("storeid")
              : 1
          }/${
            localStorage.getItem("userid") ? localStorage.getItem("userid") : 0
          }`,
        });
        setparentheader(parent.data);
        console.log("parent.data",parent.data
        );
      } catch (e) {
        console.log(e)
        // toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("storeid")]);














  // -------------------------------------------------------------------------------------------------------------------------

  // When Switched to Different Category from the Carouse, Updating data to display in the Category Filter
  useEffect(() => {
    setAllCategory(allFilter)
  }, [allFilter])

  useEffect(() => {
    setselectedCategory("")
    setSelectedSubCategory("");
    setSelectedVariety("");
    setSelectedAssortOne("");
    setSelectedAssortTwo("");
    setSelectedAssortThree("");
    setAllCategory([])
  }, [id])

  // When Selecting from the Category Checkbox, updating it in the local SubCategory State
  const catHandler = (value) => {
    console.log("value",value);
    setselectedCategory(value)
    setSelectedSubCategory("");
    setSelectedVariety("");
    setSelectedAssortOne("");
    setSelectedAssortTwo("");
    setSelectedAssortThree("");
  }

  // -------------------------------------------------------------------------------------------------------------------------

  // When local State Category gets updated, compare it with the selectedCategory(Props) to get the SubCategory
  useEffect(() => {
    setAllSubCategory([]);
    setAllVariety([]);
    setAllAssortOne([]);
    setAllAssortTwo([]);
    setAllAssortThree([]);
      allCategory?.filter(dt => {
        if(selectedCategory === dt?.id) {
          setAllSubCategory(prevState => [
            ...prevState, ...dt?.children_data
          ]);
        }})
    }, [selectedCategory])

    // When Selecting from the Category Checkbox, updating it in the local SubCategory State
    const subCatHandler = (value) => {
      console.log("value set select sub",value);
      setSelectedSubCategory(value)
      setSelectedVariety("");
      setSelectedAssortOne("");
      setSelectedAssortTwo("");
      setSelectedAssortThree("");
      setSelectedBrand("")
    }

    // -------------------------------------------------------------------------------------------------------------------------

    // When local State SubCategory gets updated, compare it with the selectedSubCategory(Props) to get the Variety
    useEffect(() => {
    setAllVariety([]);
    setAllAssortOne([]);
    setAllAssortTwo([]);
    setAllAssortThree([]);
      allSubCategory?.filter(dt => {
        if(selectedSubCategory === dt?.id) {
          setAllVariety(prevState => [
            ...prevState, ...dt?.children_data
          ])
        }})
    }, [selectedSubCategory])

    const varietyHandler = (value) => {
      setSelectedVariety(value)
      setSelectedAssortOne("");
      setSelectedAssortTwo("");
      setSelectedAssortThree("");
    }

    // -------------------------------------------------------------------------------------------------------------------------

    // When local State Variety gets updated, compare it with the selectedVariety(Props) to get the AssortOne
    useEffect(() => {
    setAllAssortOne([]);
    setAllAssortTwo([]);
    setAllAssortThree([]);
      allVariety?.filter(dt => {
        if(selectedVariety === dt?.id) {
          setAllAssortOne(prevState => [
            ...prevState, ...dt?.children_data
          ])
        }})
    }, [selectedVariety])

      // When Selecting from the Variety Checkbox, updating it in the local AssortOne State
    const assortOneHandler = (value) => {
      setSelectedAssortOne(value)
      setSelectedAssortTwo("");
      setSelectedAssortThree("");
    }
    // -------------------------------------------------------------------------------------------------------------------------

    // When local State AssortOne gets updated, compare it with the selectedVariety(Props) to get the AssortTwo
    useEffect(() => {
    setAllAssortTwo([]);
    setAllAssortThree([]);
      allAssortOne?.filter(dt => {
        if(selectedAssortOne === dt?.id) {
          setAllAssortTwo(prevState => [
            ...prevState, ...dt?.children_data
          ])
        }})
    }, [selectedAssortOne])

      // When Selecting from the AssortOne Checkbox, updating it in the local AssortTwo State
    const assortTwoHandler = (value) => {
      setSelectedAssortTwo(value)
      setSelectedAssortThree("");
    }

    // -------------------------------------------------------------------------------------------------------------------------

    // When local State AssortThree gets updated, compare it with the selectedVariety(Props) to get the AssortTwo
    useEffect(() => {
    setAllAssortThree([]);
      allAssortTwo?.filter(dt => {
        if(selectedAssortTwo === dt?.id) {
          setAllAssortThree(prevState => [
            ...prevState, ...dt?.children_data
          ])
        }})
    }, [selectedAssortTwo])

      // When Selecting from the AssortThree Checkbox, updating it in the local AssortTwo State
    const assortThreeHandler = (value) => {
      selectedAssortThree(value)
    }

    // -------------------------------------------------------------------------------------------------------------------------

  const countryHandler = (value) => {
    setcountry(value)
  };

  const brandHandler = (value) => {
    if(value == undefined) return
    setSelectedBrand(value)
    console.log("call unchecked/**********************************/");
    // var a = document.getElementById(value).parentNode;
    // console.log(a.id);

var a=document.getElementById(value);

a.style.backgroundColor="#F0FAF8"
a.style.borderLeft="5px solid #37BFA7"
//console.log("div ====>",a.style.backgroundColor="red");

  }

  const productTypeHandler = (value) => {
    if(value == undefined) return
    setSelectedProductType(value)
  }

  const clear = (value) => {
    if(value == 'SubCategory') {
      setSelectedSubCategory("");
      setSelectedVariety("");
      setSelectedAssortOne("");
      setSelectedAssortTwo("");
      setSelectedAssortThree("");
    }

    if(value == 'Variety') {
      setSelectedVariety("");
      setSelectedAssortOne("");
      setSelectedAssortTwo("");
      setSelectedAssortThree("");
    }

    if(value == 'AssortOne') {
      setSelectedAssortOne("");
      setSelectedAssortTwo("");
      setSelectedAssortThree("");
    }

    if(value == 'AssortTwo') {
      setSelectedAssortTwo("");
      setSelectedAssortThree("");
    }

    if(value == 'AssortThree') {
      setSelectedAssortThree("");
    }
  }


  return (
    <div className="myCatalog_category_filter_container">
      <div
        className="accordion accordion-flush filter_main_container__accordian__desktop"
        id="accordionFlushExample"
      >
          {parentheader?.length > 0 ? <AccordionCom data={parentheader} handler={catHandler}  type="Filter By" clear={clear} /> : id != 0 ? <Spinner /> : ""}
       {/* {allCategory?.length > 0 ? <AccordionCom data={allCategory} handler={catHandler} type="SubCategory" clear={clear} /> : id != 0 ? <Spinner /> : ""} */}
        {/* {allSubCategory?.length > 0 && <AccordionCom data={allSubCategory} handler={subCatHandler} type="Variety" clear={clear} />} */}
        {/* {allVariety?.length > 0 && <AccordionCom data={allVariety} handler={varietyHandler} type="AssortOne" clear={clear} />}
        {allAssortOne?.length > 0 && <AccordionCom data={allAssortOne} handler={assortOneHandler} type="AssortTwo" clear={clear} />}
        {allAssortTwo?.length > 0 && <AccordionCom data={allAssortTwo} handler={assortTwoHandler} type="AssortThree" clear={clear} />}
        {country_of_origin?.length > 0 && <AccordionCom data={country_of_origin} handler={countryHandler} type="Country" clear={clear} />}
        {brandFilter?.length > 0 && <AccordionCom data={brandFilter} handler={brandHandler} type="Brand" clear={clear} />}
        {productType?.length > 0 && <AccordionCom data={productType} handler={productTypeHandler} type="Product Type" clear={clear} />} */}
      </div>
    </div>
  );
}

export default MyCatalog_category_filter;
