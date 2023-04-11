import React, { useEffect,useState } from "react";
import './AccordionCom.scss'
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

function AccordionCom ({ data, handler, type, clear }) {


  const [isRadiocat, setIsRadiocat] = useState("");
  const [isRadiosubcat, setIsRadiosubcat] = useState([]);
//console.log("7all subcategory",allSubCategory);
  const { t } = useTranslation();
  var { subCat } = useParams();
  console.log("datasubcat",subCat);
  var idparams=useParams();
  console.log("idparams",idparams);
  // var a=useParams();
  // console.log("a params",a.id);
console.log("subcat12=====================>",subCat);
console.log("Accord data",data);











  useEffect(() => {
    if(subCat === undefined) {
      return
    } else {
      if(type === "SubCategory") {
        let sub = data?.find(d => d?.id == subCat)
        console.log("subidd==>",sub);
        handler(sub?.id)
        console.log(sub)
      }
      if(type === "Filter By") {
        let sub = data?.find(d => d?.id == idparams.id)
        console.log("subidd==>",sub);
        handler(sub?.id)
        console.log(sub)
     
      }
    }
  }, [subCat])

 var subtrue=[];

  return (


    
    <div className="accordion-item">
      
      <h6
        className="accordion-header accordion-button "
        id={`flush-heading${type}`}
        type="button"
        data-toggle="collapse"
        data-target={`#flush-collapse${type}`}
        aria-expanded="false"
        // aria-controls={`flush-collapse${type}`}
      >
        <div className="accordion__heaidingborder"></div>
        <span id="arrow__chk">{`${t(type)}`}</span>
        {/* <span className="AC__Clear" onClick={() => clear(type)}>Clear</span> */}
      </h6>
      
      <div
        id={`flush-collapse${type}`}
        className="accordion-collapse "
        aria-labelledby={`flush-heading${type}`}
        data-bs-parent="#accordionFlushExample"
      >
        <div className="accordion-body">
          <div className="discount_tab">
            {data?.map((itm) => {
              //console.log("item",itm.id);
              console.log("data first item subcat",data);
          
              // if(itm.id == a.id){
              //   subtrue.push(itm.subcategories);
              //   console.log("subtrue",subtrue);
              // }
            
              return (
         <div>
                <div className="listing_type accordion-header accordion-button collapsed"  data-toggle="collapse" aria-expanded="false" type="button"   data-target={`#flush-collapse${itm?.id}`} key={itm?.short_code ? itm?.short_code : itm?.country_id ? itm?.country_id : itm?.id} 
                //id={itm?.product_type_code ? itm?.product_type_code : itm?.short_code ? itm?.short_code : itm?.country_id ? itm?.country_id : itm?.id} 
                id={`flush-heading${itm?.id}`}
                >
                  <input
                    type="radio"
                    className="form-check-input"
                    name={type}
                    // {type === "SubCategory"}
                    //checked={ idparams.id ==itm?.id }
                    //checked={itm?.id === "1064"}
                    //checked={itm?.id == idparams.id}
                   // checked={itm?.id == idparams.id}
                    value={itm?.product_type_code ? itm?.product_type_code : itm?.short_code ? itm?.short_code : itm?.country_id ? itm?.country_id : itm?.id}
                    id={itm?.product_type_code ? itm?.product_type_code : itm?.short_code ? itm?.short_code : itm?.country_id ? itm?.country_id : itm?.id}
                    onClick={() => handler(itm?.product_type_code ? itm?.product_type_code : itm?.short_code ? itm?.short_code : itm?.country_id ? itm?.country_id : itm?.id)}
                  disabled={itm?.id != idparams.id}
                  ></input>

                  <label htmlFor={itm?.product_type_code ? itm?.product_type_code : itm?.short_code ? itm?.short_code : itm?.country_id ? itm?.country_id : itm?.id}
                  //  className="accordion-header accordion-button"
                  //  id={`flush-heading${type}`}
                  //  type="button"
                  //  data-toggle="collapse"
                  //  data-target={`#flush-collapse${type}`}
                  //  aria-expanded="false"
                  //  aria-controls={`flush-collapse${type}`}
                  
                  >
                    {itm?.label ? itm?.label : itm?.brand_name ? itm?.brand_name : itm.country_name ? itm?.country_name : itm.name}
                  </label>
                  </div>
                  {/* {itm.subcategories?.map((item)=>item.name)} */}

{/* another data sub category*/}

<div className="accordion-item">

      <div
        id={`flush-collapse${itm?.id}`}
        className="accordion-collapse collapse"
        aria-labelledby={`flush-heading${itm?.id}`}
        data-bs-parent="#accordionFlushExample"
        
      >
        <div className="accordion-body">
          <div className="discount_tab" style={{width:"210px"}}>
            {itm.subcategories?.map((item) => {
              //console.log("all subcategory",itm.id);
              //console.log("itemall subcategory",itm);
             console.log("submenuitm.id",item.id==idparams.subCat);
             console.log("submenuidparams.id",itm.subcategories);
              return (
              
                //item.id == idparams.subCat &&
                <>
                <div className="listing_type " key={item?.short_code ? item?.short_code : item?.country_id ? item?.country_id : item?.id} id={item?.product_type_code ? item?.product_type_code : item?.short_code ? item?.short_code : item?.country_id ? item?.country_id : item?.id} 
                
                
                >
                  <input
                    type="radio"
                    className="form-check-input"
                    name={type}
                    // {type === "SubCategory"}
                    //checked={itm?.id === a.id}
                    //checked={ idparams.subCat === item.id  }
                   // checked={ item?.id == idparams.subCat}
                    value={item?.product_type_code ? item?.product_type_code : item?.short_code ? item?.short_code : item?.country_id ? item?.country_id : item?.id}
                    id={item?.product_type_code ? item?.product_type_code : item?.short_code ? item?.short_code : item?.country_id ? item?.country_id : item?.id}
                    onClick={() => handler(item?.product_type_code ? item?.product_type_code : item?.short_code ? item?.short_code : item?.country_id ? item?.country_id : item?.id)}
                    disabled={idparams.subCat ?item.id != idparams.subCat:"" }
                  ></input>

                  <label htmlFor={item?.product_type_code ? item?.product_type_code : item?.short_code ? item?.short_code : item?.country_id ? item?.country_id : item?.id}>
                    {item?.label ? item?.label : item?.brand_name ? item?.brand_name : item.country_name ? item?.country_name : item.name}
                  </label>


                </div>
          
                </>
             );
         
            //data
            })}


          
          </div>
        </div>
      </div>
    </div>
            


{/* all data */}



</div>

                // </div>
            
              );
         
            //data
            })}


          
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccordionCom;