import React,{useState} from "react";
import "./SmallBlock.scss";
import request from "../../request";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LazyLoad from 'react-lazyload';

function SmallBlock({ banner, title, data, catid,arrivalsplit2,arrshow,setarrshow}) {
 // console.log("arrivalsplit2",arrivalsplit2);
 // console.log("trendshow",trendshow);
  //console.log("data",data);

  const [trendsplit1, settrendsplit1] = useState([]);
  const [trendsplit2, settrendsplit2] = useState([]);
  const { t } = useTranslation();
  
  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <>
    <div className="catalogblockmini">
      <h4 className="catalogblockmini__title">{title ? t(title) : ""}</h4>
      <div
        className={`catalogblockmini__container ${
          title === "Meat" && "catalogblockmini__reversecontainer"
        }`} 
      >
        <LazyLoad height={500}>
          <img
            src={`${request.image}/media/${banner}`}
            alt=""
          />
        </LazyLoad>
        <div className="container__card">
          {data?.map((d) => (
            <LazyLoad height={240} key={d?.entity_id} offset={100}>
              <Link
                to={`/catalogdetails/cdetails/${d.category_id}/${d.entity_id}/${d.url_key}`}>
                <div>
                  <img
                    src={`${request.image}/media/catalog/product${d.thumbnail}`}
                    alt=""
                    width="100%"
                    height="100%"
                  />
                  <h4 className="cbm__name">
                    {d?.name}
                    {/* {truncate(d.name, 25)} */}
                  </h4>
                  <h5>
                    ฿{" "}
                    {d.price % 1 === 0
                      ? `${formatToCurrency(parseInt(d.price))}.00`
                      : formatToCurrency(parseFloat(d.price).toFixed(2))
                    }
                    <span>/ {d?.selling_unit}</span>
                  </h5>
                </div>
              </Link>
            </LazyLoad>
          ))}
        </div>
      </div>
      <Link to={`/catalog/${catid}`}>
        <p className="PMini__seemore">
          <span className="Mini__seemore">{t("See More")}</span>
        </p>
      </Link>
    </div>




{/* <div className="dots">
{


arrivalsplit2.length > 1 && (
  <>
    <p
      className={`${!arrshow && "dots__selected"}`}
      onClick={() => setarrshow(false)}
    ></p>
    <p
      className={`${arrshow && "dots__selected"}`}
      onClick={() => setarrshow(true)}
    ></p>
  </>
)


}



</div> */}

          
     </>
  );
}

export default SmallBlock;
