import React, { useState, useEffect } from "react";
import "./Complaint.scss";
import back from "../../../assets/images/catalog/back.png";
import astrik from "../../../assets/images/MyOrder/astrik.svg";
import { useHistory, useParams } from "react-router-dom";
import CreateComplaint from "./CreateComplaint/CreateComplaint";
import axios from "axios";
import request from "../../../request";
import { useTranslation } from "react-i18next";

function Complaint() {
  const history = useHistory();
  const [il, setil] = useState([]);
  const { complaintid } = useParams();
  const [productlist, setproductlist] = useState([]);
  const [selected, setSelected] = useState();
  const [CC, setCC] = useState();
  const { t } = useTranslation();

  const selectInvoice = (invoice) => {
    setSelected(invoice);
  };


  useEffect(async() => {
    try {
      const check = await axios({
        method: 'get',
        url: `${request?.complaintcheck}${complaintid}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if(check?.data[0]?.status ==  "false") {
        history.push(`/myorder/${complaintid}`);
      }
    } catch(e) {
      console.log(e)
    }
  }, [complaintid])

  useEffect(async () => {
    try {
      const ilist = await axios({
        method: "get",
        url: `${request.invoicelist}?order_id=${complaintid}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setil(ilist.data);
    } catch (e) {
      console.log(e);
    }
  }, [complaintid]);
  const [created, setcreated] = useState(false);

  useEffect(async () => {
    try {
      const plist = await axios({
        method: "post",
        url: request.complaintproducts,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          invoice_ids: [selected?.invoice_no],
          order_id: selected?.child_orderId,
          customer_id: localStorage.getItem("userid"),
        },
      });
      setproductlist(plist?.data[0]);
    } catch (e) {
      console.log(e);
    }
  }, [selected, created]);

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="complaint">
      <div className="complaint__back">
        <span onClick={() => history.goBack()}>
          <img src={back} alt="" />
        </span>
      </div>
      <h4 className="complaint__title">{t("Report Issue")}</h4>
      <div className="complaint__invoicelist">
        <ul>
          <li className="label">
            <img src={astrik} alt="" />
            {t("Select Invoice")} :{" "}
          </li>
          {il?.map((data) => (
            <li
              onClick={() => selectInvoice(data)}
              className={`value ${selected === data && "selectedInvoice"}`}
            >
              {data?.invoice_book}{data?.invoice_no}
            </li>
          ))}
        </ul>
      </div>

      <div className="complaint__productInfo">
        <p className="pi__header">
          <h5>
            {/* Product Details: <span>{productlist?.product.length} Products</span> */}
          </h5>
          {productlist?.product && (
            <span>{t("Deliver on")} {productlist?.product[0]?.delivery_date}</span>
          )}
        </p>
        <div className="complaint__productlist">
          {productlist?.product?.map((pl, i) => (
            <div>
              <div
                key={i}
                onClick={() =>
                  setCC((prevState) =>
                    prevState?.item_id === pl?.item_id ? "" : pl
                  )
                }
                className={`list ${
                  CC?.item_id === pl?.item_id && "openComplaint" || pl?.complaint?.length > 0 && "openComplaint1" 
                }`}
              >
                <span className="list__qty">{parseInt(pl?.qty_ordered)}X</span>
                <span>{pl?.unit}</span>
                <img
                  src={`${request.image}/media/catalog/product${pl?.imageUrl}`}
                  alt=""
                  className="list__img"
                />
                <span className="list__name">{pl?.name}</span>
                <span>฿ {formatToCurrency(parseInt(pl?.price))}.00</span>
              </div>
              {CC?.item_id == pl?.item_id && (
                <CreateComplaint
                  complaintid={complaintid}
                  invoiceid={selected}
                  pid={pl?.product_id}
                  unit={pl?.unit}
                  qty={pl?.qty_ordered}
                  complaint={pl?.complaint?.length > 0 && pl?.complaint}
                  setcreated={setcreated}
                  created={created}
                  ordered_qty={pl?.qty_ordered}
                  child_orderId={selected?.child_orderId}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Complaint;
