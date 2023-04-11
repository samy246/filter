import React, { useState, useEffect, useMemo } from "react";
import "./AllbranchTable.scss";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { useStateValue } from "../../../../store/state";
import AddMinusLocal from "./AddMinusLocal/AddMinusLocal";
import DateSelection from "./DateSelection/DateSelection";
import moment from "moment";
import axios from "axios";
import request from "../../../../request";
import { useTranslation } from "react-i18next";

function AllbranchTable({
  addresslist,
  quantity,
  sku,
  product_id,
  price,
  item_id,
  name,
  selectedItem,
  unit,
  splitorder,
  addlist,
}) {
  const { t } = useTranslation();
  const [onedate, setonedate] = useState();
  const [{}, dispatch] = useStateValue();
  const branchname = (id) => {
    const bn = addlist?.find((adl) => adl.address_id === id);
    return bn?.branch_name;
  };

  const [currentsplit, setcurrentsplit] = useState([]);
  useEffect(() => {
    setcurrentsplit(splitorder);
  }, [splitorder]);

  const deleteBranch = async (id, qty) => {
    try {
      await axios({
        method: "post",
        url: request.cartupdate,
        data: {
          data: {
            sku: sku,
            quote_id: localStorage.getItem("cartid"),
            qty: parseInt(quantity) - qty,
            customer_id: localStorage.getItem("userid"),
            item_id: item_id,
          },
          splitorder: {
            company_id: localStorage.getItem("companyid"),
            customer_id: localStorage.getItem("userid"),
            branch_id: id,
            qty: 0,
            product_id: product_id,
            item_id: item_id,
            name: name,
            sku: sku,
            delivery_date: new Date(),
          },
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const closeCalendar = () => {
    dispatch({
      type: "CAL__CLOSE",
      cal: false,
    });
  };
  const [qtyspinner, setqtyspinner] = useState(false)

  const currentSplitMemo = useMemo(() => {
    return currentsplit?.map((data, i) => (
      <>
        <tr key={i} style={{ position: "relative" }}>
          <td onClick={() => closeCalendar()}>
            <div>
              <p className="m-0">{branchname(data?.branch_id)}</p>
            </div>
          </td>
          <td className="text-center" onClick={() => closeCalendar()}>
            <AddMinusLocal
              sku={sku}
              unit={unit}
              date={data.delivery_date}
              price={price}
              quantity={data.quantity}
              item_id={data.item_id}
              product_id={data.product_id}
              branch_id={data.branch_id}
              name={data.name}
              totalquantity={quantity}
              qtyspinner={qtyspinner}
              setqtyspinner={setqtyspinner}
            />
          </td>
          <td style={{ textAlign: "right" }}>
            <div className="date__div">
              <p className="m-0 deliver__date">
                <DateSelection
                  sku={sku}
                  unit={unit}
                  branchdate={data.delivery_date}
                  price={price}
                  quantity={data.quantity}
                  item_id={data.item_id}
                  product_id={data.product_id}
                  branch_id={data.branch_id}
                  name={data.name}
                  totalquantity={quantity}
                />
                <span></span>
              </p>
            </div>
          </td>
          {currentsplit?.length > 1 && (
            <i
              onClick={() => deleteBranch(data.branch_id, data.quantity)}
              className="far fa-trash-alt deleterow"
              style={{
                color: "red",
                position: "absolute",
                cursor: "pointer",
              }}
            />
          )}
        </tr>
      </>
    ));
  }, [currentsplit, qtyspinner]);

  return (
    <table className="table table-borderless caption-top allbranch__table m-0 table-striped">
      <thead>
        <tr>
          <th style={{ width: "30%" }} scope="col">
            {t("Branch_name")}
          </th>
          <th
            className="text-center"
            scope="col"
            style={{ textDecoration: "underline" }}
          >
            {t("QTY")}
          </th>
          <th
            scope="col"
            style={{ textDecoration: "underline", textAlign: "right" }}
          >
            {t("Delivery_Date")}
          </th>
        </tr>
      </thead>
      <tbody>{currentSplitMemo}</tbody>
    </table>
  );
}

export default AllbranchTable;
