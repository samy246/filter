import React, { useState, useEffect, useRef } from "react";
import AllbranchTable from "../AllbranchTable/AllbranchTable";
import { useStateValue } from "../../../../store/state";
import "./OrderListDropdown.scss";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import request from "../../../../request";
import moment from "moment";
import { useTranslation } from "react-i18next";
function OrderListDropdown({
  deliveryTable,
  addresslist,
  quantity,
  sku,
  product_id,
  price,
  name,
  item_id,
  localorder,
  setlocalorder,
  unit,
  addlist,
  splitorder,
  // currentid,
}) {
  const { t } = useTranslation();
  const [{ cstatus, cart }, dispatch] = useStateValue();
  const [selectedItem, setSelectedItem] = useState({});
  const [clist, setclist] = useState([]);
  const [options, setoptions] = useState([]);
  const [trigger, settrigger] = useState(false);
  useEffect(() => {
    // addlist - All addresslist
    // addresslist - Globally selected addresses

    setoptions([]);
    addlist?.filter((data) => {
      setoptions((option) => [
        ...option,
        {
          label: data?.branch_name,
          value: data?.address_id,
          branch_id: data?.address_id,
        },
      ]);
    });

    // Checkbox selection for each products dropdown
    let temp = [];
    splitorder?.filter((spl) => {
      addlist?.filter((adl) => {
        if (spl?.branch_id === adl?.address_id) {
          temp.push({
            label: adl?.branch_name,
            value: adl?.address_id,
            branch_id: adl?.address_id,
          });
        }
      });
    });
  }, [addlist, cstatus, trigger]);

  const [branchselected, setbranchselected] = useState([]);

  const InputSelection = async (event) => {
    let currentsplit = [];
    let itemid;
    // Finding the current item_id from the products in the cart
    itemid = cart.find((c) => c.item_id === item_id);

    // Saving the current item_id's splitorder data and saving it to the currentsplit array.
    itemid?.splitorder?.filter((split) => currentsplit.push(split.branch_id));

    // Duplicates removed from the array - currentsplit
    let uniqueChars1 = [...new Set(currentsplit)];
    if (event.length === 0 || currentsplit.length === 0) return;
    let eventid = [];

    // Collecting branch id's from the dropdownlist
    event?.filter((ev) =>
      eventid.push(ev.branch_id ? ev?.branch_id : ev?.address_id)
    );
    // Removing duplicates from the eventid
    let uniqueChars = [...new Set(eventid)];

    // To find the added branch in the product
    let difference = uniqueChars?.filter((x) => !uniqueChars1.includes(x));

    // To find the removed branch in the product
    let difference1 = uniqueChars1?.filter((x) => !uniqueChars.includes(x));

    // Calling ERP API's to get the Next available date
    if (difference.length > 0) {
      let erp;
      try {
        const erptoken = await axios({
          method: "post",
          url: request.erplogin,
          data: {
            username: "jagota-iskula-b2b-team",
            password: "JIBT1234!@#$",
          },
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        });
        erp = erptoken.data.data.token;
      } catch (e) {
        console.log(e);
      }
      let date;
      try {
        const datechk = await axios({
          method: "get",
          // url: `${request.erprequest}/products/order-period?PRODUCT_CODE=${sku}`,
          url: `${request.erprequest}/products/${sku}/delivery-date`,
          headers: {
            token: `Bearer ${erp}`,
          },
        });
        date = datechk.data.data[0].DELIVER_DATE[0].DD;
      } catch (e) {
        console.log(e);
      }
      // Adding Branch to the Product
      difference?.filter(async (d) => {
        try {
          const cartdata = await axios({
            method: "post",
            url: request.cartupdate,
            data: {
              data: {
                sku: sku,
                quote_id: localStorage.getItem("cartid"),
                qty: parseInt(quantity) + parseInt(1),
                customer_id: localStorage.getItem("userid"),
                item_id: item_id,
              },
              splitorder: {
                company_id: localStorage.getItem("companyid"),
                customer_id: localStorage.getItem("userid"),
                branch_id: d,
                qty: 1,
                product_id: product_id,
                item_id: item_id,
                name: name,
                sku: sku,
                delivery_date: moment(date).format("YYYY-MM-DD"),
                // delivery_date: "2022/08/03",
              },
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          dispatch({
            type: "CART_STATUS",
            status: cartdata.status,
          });
        } catch (e) {
          console.log(e);
        }
      });
      return;
    } else if (difference1.length === 1) {
      // Removing Branch from the Product.
      try {
        await axios({
          method: "post",
          url: request.cartupdate,
          data: {
            data: {
              sku: sku,
              quote_id: localStorage.getItem("cartid"),
              qty: parseInt(quantity) - 1,
              customer_id: localStorage.getItem("userid"),
              item_id: item_id,
            },
            splitorder: {
              company_id: localStorage.getItem("companyid"),
              customer_id: localStorage.getItem("userid"),
              branch_id: difference1[0],
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
        settrigger(!trigger);
        dispatch({
          type: "CART_STATUS",
        });
        window.location.reload();
      } catch (e) {
        console.log(e);
      }
    }

    setclist(event);
    setSelectedItem(event);

    dispatch({
      type: "REVIEW__SELECED",
      value: true,
    });
  };

  useEffect(() => {
    // debugger;
    let testid = [];
    let uid = [];

    // getting branchid from addresslist
    addresslist?.filter((ad) =>
      uid.push(ad?.branch_id ? ad?.branch_id : ad?.address_id)
    );

    // removing duplicate branch id's
    let uniqueChars = [...new Set(uid)];

    // Initial branch selections in dropdowndata for the products in cart

    let temp = [];
    cart?.filter((c) => {
      if (c.item_id === item_id) {
        c?.splitorder?.filter((cspl) => {
          addlist?.filter((adl) => {
            if (cspl.branch_id === adl?.address_id) {
              temp.push({
                label: adl?.branch_name,
                value: adl?.address_id,
                branch_id: adl?.address_id,
              });
            }
          });
        });
        let currentids = [];
        let tempid = [];
        addresslist?.filter((adl) => currentids.push(adl?.branch_id));
        temp?.filter((t) => tempid.push(t.branch_id));

        let uniqueadl = [...new Set(currentids)];
        let uniquetmp = [...new Set(tempid)];
        let different;
        different = uniqueadl?.filter((x) => !uniquetmp.includes(x));

        addlist?.filter((adl) => {
          if (
            adl?.address_id === different[0] ||
            adl?.address_id === different[1]
          ) {
            temp.push({
              label: adl?.branch_name,
              value: adl?.address_id,
              branch_id: adl?.address_id,
            });
          }
        });
      }
    });

    if (temp?.length > 0) {
      setbranchselected(temp);
      InputSelection(temp);
    }
  }, [addresslist, cart, addlist]);

  return (
    <div className="orderlistdd">
      <MultiSelect
        options={options}
        className="multiSelect_dropdown"
        hasSelectAll={false}
        disableSearch={true}
        value={branchselected}
        selectSomeItems={"Select Branch"}
        onChange={InputSelection}
        labelledBy="Select"
      />
      {splitorder?.length ? (
        <AllbranchTable
          addresslist={clist}
          openItemDetails={clist}
          quantity={quantity}
          sku={sku}
          product_id={product_id}
          price={price}
          item_id={item_id}
          name={name}
          localorder={localorder}
          setlocalorder={setlocalorder}
          selectedItem={selectedItem}
          unit={unit}
          splitorder={splitorder}
          addlist={addlist}
        />
      ) : (
        <table className="table caption-top m-0 ">
          <thead>
            <tr>
              <th scope="col">{t("Branch_Name")}</th>
              <th className="text-center" scope="col">
                {t("Quantity")}
              </th>
              <th className="text-right" scope="col">
                {t("Delivery_Date")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="table__row">
              <td colSpan="5">
                <div className={`${deliveryTable ? "b-block" : "d-none"}`}>
                  <div className="text-center p-4">
                    <i className="fas fa-store fa-3x color__gray" />
                    <p className="color__gray pt-2">
                      No branches setting for delivery
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
export default OrderListDropdown;
