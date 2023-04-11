import React, { useState, useEffect } from "react";
import "./CartPayment.scss";
import AlsoLike from "../../Home/AlsoLike/AlsoLike";
import CartPrograss from "../CartPrograss/CartPrograss";
import { useHistory } from "react-router-dom";
import axios from "axios";
import request from "../../../request";
import { useStateValue } from "../../../store/state";
import { browserName, browserVersion } from "react-device-detect";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import Spinner from "../../Spinner";
import { useTranslation } from "react-i18next";
import Payment from "./Payment/Payment";
import back from "../../../assets/images/catalog/back.png";

function CartPayment({paycollectdata}) {
  const { t } = useTranslation();
  const { pagetype } = useParams();
  const history = useHistory();
  const [{ cart, summary }, dispatch] = useStateValue();
  const [currentorderid, setcurrentorderid] = useState();
  // const [ctype, setctype] = useState();
  const [creditamount, setcreditamount] = useState(0);
  const [creditvalidate, setcreditvalidate] = useState(true);
  const [creditchecking, setcreditchecking] = useState(false);
  const [credit, setcredit] = useState();
  const [paytype, setpaytype] = useState();
  const [showacc, setshowacc] = useState(false);

  useEffect(async () => {
    try {
      const data = await axios({
        method: "get",
        url: request.parentorderid,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setcurrentorderid(data?.data[0]?.parent_order_id);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (pagetype === "paymentcollection") return;
    let usercompany = JSON.parse(localStorage.getItem("company_role_id"));
    let companyroles = JSON.parse(localStorage.getItem("companyrolesdata"));
    const currentcompany = companyroles?.find(
      (data) => data.id === usercompany
    );
    if (currentcompany?.name === "Purchaser") {
      history.push("/cartPage/OrdertoDelivery");
    }
    if (summary.subtotal == 0 || summary.length == 0) {
      toast.info("There must be atleast one product in the Cart");
      return history.push("/cartPage/OrdertoDelivery");
    }
  }, []);

  // useEffect(async () => {
  //   try {
  //     const customertype = await axios({
  //       method: "post",
  //       url: request?.paymenttype,
  //       data: {
  //         company_id: localStorage.getItem("companyid"),
  //       },
  //     });
  //     setctype(customertype?.data[0]?.customerType);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, []);

  // useEffect(async () => {
  //   if (pagetype === "paymentcollection") return;
  //   try {
  //     const creditcheck = await axios({
  //       method: "post",
  //       url: request.creditcheck,
  //       data: {
  //         company_id: localStorage.getItem("companyid"),
  //       },
  //     });
  //     setcreditamount(
  //       parseInt(creditcheck?.data[0]?.pending_price) + parseInt(summary?.total)
  //     );
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, [summary]);

  // useEffect(async () => {
  //   if (pagetype === "paymentcollection") return;
  //   setcreditchecking(true);
  //   if (creditamount === 0 || Number.isNaN(creditamount)) return;
  //   let userdata = JSON.parse(localStorage.getItem("userdata"));
  //   let ccode;
  //   userdata?.custom_attributes.find((ca) => {
  //     if (ca?.attribute_code == "customer_code") {
  //       ccode = ca?.value;
  //     }
  //   });
  //   const erptoken = await axios({
  //     method: "post",
  //     url: request.erplogin,
  //     data: {
  //       username: "jagota-iskula-b2b-team",
  //       password: "JIBT1234!@#$",
  //     },
  //     headers: {
  //       accept: "*/*",
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   toast.info(`${t("Checking Credit")}...`);
  //   let creditbalance = await axios({
  //     method: "get",
  //     url: `${request.erprequest}/credits/validate-credit?P_CUST=${ccode}&P_CREDIT=${creditamount}`,
  //     headers: {
  //       token: `Bearer ${erptoken.data.data.token}`,
  //     },
  //   });
  //   setcreditvalidate(creditbalance?.data?.data?.creditValidated);
  //   setcreditchecking(false);
  // }, [creditamount]);

  // useEffect(() => {
  //   console.log(creditvalidate)
  //   if (!creditvalidate) {
  //     toast.warn("Credit Not Available");
  //     history.push("/cartPage/OrdertoDelivery");
  //   }
  // }, [creditvalidate]);

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    let ccode;
    userdata?.custom_attributes.find((ca) => {
      if (ca?.attribute_code == "customer_code") {
        ccode = ca?.value;
      }
    });
    if (pagetype === "paymentcollection") return;
    async function fetchData() {
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
      const creditdetails = await axios({
        method: "get",
        // url: `${request.erprequest}/customers/credit-info?CUST_CODE=${userdata?.extension_attributes?.customer_code}`,
        url: `${request.erprequest}/credits/get-credit-info?P_CUST=${ccode}`,
        headers: {
          token: `Bearer ${erptoken.data.data.token}`,
        },
      });
      setcredit(creditdetails?.data?.data);
    }
    fetchData();
  }, []);

  const sendorderHandler = () => {
    if (createorder()) {
      // routeChange();
    }
  };
  
  const routeChange = () => {
    history.push("/cartPage/success");
  };


  const createorder = async () => {
    if(paytype == undefined) {
      return toast.info('Please select a Payment Method to place an Order')
    };
    let splitdata = [];
    cart.filter((c) =>
      c.splitorder.filter((spl, i) => {
        if (splitdata.length === 0) {
          splitdata.push({
            branch_id: spl.branch_id,
            company_id: spl?.company_id,
            created_by: spl?.created_by,
            customer_id: spl?.customer_id,
            unit: spl?.unit,
            base_price_incl_tax: c?.base_price_incl_tax,
            base_tax_amount: c?.base_tax_amount,
            items: [
              {
                delivery_date: spl?.delivery_date,
                price: spl?.price,
                name: spl?.name,
                quantity: spl?.quantity,
                sku: spl?.sku,
                created_at: spl?.created_at,
                item_id: spl?.item_id,
                product_id: spl?.product_id,
                unit: spl?.unit,
                rowtotal: c?.base_price_incl_tax * spl?.quantity
              },
            ],
          });
        } else {
          // debugger;
          let item = splitdata.find(
            (spdata) => spdata?.branch_id === spl?.branch_id
          );
          // let temp;
          if (item !== undefined) {
            splitdata.filter((spdata) => {
              if (spdata?.branch_id === spl?.branch_id) {
                spdata.items.push({
                  delivery_date: spl?.delivery_date,
                  price: spl?.price,
                  name: spl?.name,
                  quantity: spl?.quantity,
                  sku: spl?.sku,
                  created_at: spl?.created_at,
                  item_id: spl?.item_id,
                  product_id: spl?.product_id,
                  unit: spl?.unit,
                  rowtotal: c?.base_price_incl_tax * spl?.quantity
                });
              }
            });
          } else {
            // debugger;
            splitdata.push({
              branch_id: spl.branch_id,
              company_id: spl?.company_id,
              created_by: spl?.created_by,
              customer_id: spl?.customer_id,
              unit: spl?.unit,
              base_price_incl_tax: c?.base_price_incl_tax,
              base_tax_amount: c?.base_tax_amount,
              items: [
                {
                  delivery_date: spl?.delivery_date,
                  price: spl?.price,
                  name: spl?.name,
                  quantity: spl?.quantity,
                  sku: spl?.sku,
                  created_at: spl?.created_at,
                  item_id: spl?.item_id,
                  product_id: spl?.product_id,
                  unit: spl?.unit,
                  rowtotal: c?.base_price_incl_tax * spl?.quantity
                },
              ],
            });
          }
        }
      })
    );
    try {
      const userdata = JSON.parse(localStorage.getItem("userdata"));
      const billingid = userdata?.default_billing;
      const addresslist = userdata.addresses;
      for (let i in splitdata) {
        let billinginfo = addresslist.find((adl) => adl.id == billingid);
        let shippinginfo = addresslist.find(
          (adl) => adl.id == splitdata[i]?.branch_id
        );
        let subtotal = [];
        let qtycount = [];
        let itemsdata = [];
        let orderdataItms = splitdata[i];
        for (let j in orderdataItms.items) {
          let rowtotal =
            parseInt(orderdataItms.base_price_incl_tax) *
            parseInt(orderdataItms.items[j].quantity);
          subtotal.push(rowtotal);
          qtycount.push(orderdataItms.items[j].quantity);
          itemsdata.push({
            base_discount_amount: orderdataItms.items[j].price,
            base_original_price: orderdataItms.items[j].price,
            base_price: orderdataItms.items[j].price,
            base_price_incl_tax: 0,
            base_row_invoiced: 0,
            base_row_total: orderdataItms.items[j].rowtotal,
            base_tax_amount: orderdataItms?.base_tax_amount,
            base_tax_invoiced: 0,
            discount_amount: 0,
            discount_percent: 0,
            free_shipping: 0,
            is_virtual: 0,
            name: orderdataItms.items[j].name,
            original_price: orderdataItms.items[j].price,
            price: orderdataItms.items[j].price,
            price_incl_tax: orderdataItms.items[j].price,
            product_id: orderdataItms.items[j].product_id,
            product_type: "simple",
            qty_ordered: orderdataItms.items[j].quantity,
            row_total: orderdataItms.items[j].rowtotal,
            row_total_incl_tax: orderdataItms.items[j].rowtotal,
            sku: orderdataItms.items[j].sku,
            store_id: 1,
            quote_item_id: orderdataItms.items[j].item_id,
            extension_attributes: {
              delivery_date: orderdataItms.items[j].delivery_date,
              unit: orderdataItms.items[j].unit,
            },
          });
        }
        const subT = subtotal.reduce((item, count) => item + count, 0);
        const qcount = qtycount.reduce((item, count) => item + count, 0);
        let pdf = localStorage
          .getItem("pdf_b64")
          .replace("data:application/octet-stream;base64,", "pdf;");
        let png = localStorage
          .getItem("png_b64")
          .replace("data:application/octet-stream;base64,", "png;");
        await axios({
          method: "post",
          url: request.createorder,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: {
            entity: {
              base_currency_code: "THB",
              base_discount_amount: 0,
              base_grand_total: subT,
              base_shipping_amount: 0,
              base_subtotal: subT,
              base_tax_amount: 0,
              customer_email: userdata.email,
              customer_firstname: userdata.firstname,
              customer_group_id:
                userdata.extension_attributes.aw_ca_company_user
                  .company_group_id,
              customer_id: userdata.id,
              customer_is_guest: 0,
              customer_lastname: userdata.lastname,
              customer_note_notify: 1,
              discount_amount: 0,
              email_sent: 1,
              coupon_code: "",
              discount_description: "",
              grand_total: subT,
              is_virtual: 0,
              order_currency_code: "THB",
              shipping_amount: 0,
              shipping_description: "Flat Rate - Fixed",
              state: "new",
              status: "pending",
              store_currency_code: "THB",
              store_id: 1,
              store_name: "Main Website\nMain Website Store\nDefault Category",
              subtotal: subT,
              subtotal_incl_tax: subT,
              tax_amount: 0,
              total_item_count: subT.length,
              total_qty_ordered: parseFloat(qcount),
              weight: 0,
              quote_id: localStorage.getItem("cartid"),
              items: itemsdata,
              billing_address: {
                address_type: "billing",
                city: billinginfo?.city,
                country_id: "IN",
                customer_address_id: billinginfo.id,
                email: localStorage.getItem("user"),
                firstname: userdata.firstname,
                lastname: userdata.lastname,
                postcode: billinginfo?.postcode,
                region: billinginfo?.region?.region,
                region_code: billinginfo?.region?.region_code,
                region_id: billinginfo?.region_id,
                street: billinginfo?.street,
                telephone: billinginfo?.telephone,
              },
              payment: {
                method: paytype,
              },
              extension_attributes: {
                po_number:
                  localStorage.getItem("po") === "undefined"
                    ? ""
                    : localStorage.getItem("po"),
                remarks:
                  localStorage.getItem("remarks") === "undefined"
                    ? ""
                    : localStorage.getItem("remarks"),
                image: pdf
                  ? pdf
                  : png
                  ? png
                  : pdf && png
                  ? `${(pdf, png)}`
                  : "",
                paymentimage: pdf,
                parent_order_id: currentorderid,
                branch_id: shippinginfo?.id,
                shipping_assignments: [
                  {
                    shipping: {
                      address: {
                        address_type: "shipping",
                        city: shippinginfo.city,
                        country_id: "IN",
                        customer_address_id: shippinginfo.id,
                        email: localStorage.getItem("user"),
                        firstname: userdata.firstname,
                        lastname: userdata.lastname,
                        postcode: shippinginfo?.postcode,
                        region: shippinginfo.region.region,
                        region_code: shippinginfo.region.region_code,
                        region_id: shippinginfo.id.region_id,
                        street: shippinginfo.street,
                        telephone: shippinginfo.telephone,
                      },
                      method: "flatrate_flatrate",
                    },
                  },
                ],
              },
            },
          },
        });
        createlog();
        routeChange();
        dispatch({
          type: "CART_STATUS",
        });
      }
    } catch (e) {
      console.log(e);
      // toast.error(e.response?.data?.message);
    }
  };

  const createlog = async () => {
    try {
      const res = await axios.get("https://geolocation-db.com/json/");
      await axios({
        method: "post",
        url: request.newlog,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          data: {
            customer_id: localStorage.getItem("userid"),
            company_id: localStorage.getItem("companyid"),
            remote_ip: res.data.IPv4,
            user_agent: `${browserName} Version:${browserVersion}`,
            action: `${
              JSON.parse(localStorage.getItem("userdata")).firstname
            } created Order`,
            action_type: "save",
            functioncall_url: "user/save/",
          },
        },
      });
      await axios({
        method: "post",
        url: request.createnotification,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          data: {
            customer_id: localStorage.getItem("userid"),
            company_id: localStorage.getItem("companyid"),
            remote_ip: res.data.IPv4,
            user_agent: `${browserName} Version:${browserVersion}`,
            action_data: `${
              JSON.parse(localStorage.getItem("userdata")).firstname
            } created Order`,
            action_type: "save",
            functioncall_url: "user/save/",
            status: 0,
          },
        },
      });
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const generateQR = () => {
    setshowacc(true);
  };

  return creditchecking ? (
    <div style={{ height: "80vh" }}>
      <Spinner />
    </div>
  ) : (
    <div className="cartpayment">
      {pagetype !== "paymentcollection" ? (
        <CartPrograss Payment={"payment"} selected={"selected"} />
      ) : (
        <>
          <div className="cartpayment__back" onClick={() => history.goBack()}>
            <span>
              <img src={back} alt="" />
            </span>
            <p className="paycollect">Payment Collection</p>
          </div>
        </>
      )}

      <Payment
        // ctype={ctype}
        credit={credit}
        summary={summary}
        showacc={showacc}
        generateQR={generateQR}
        setpaytype={setpaytype}
        setshowacc={setshowacc}
        paycollectdata={paycollectdata}
      />
      <div className="text-center submit_button">
        {pagetype !== "paymentcollection" ? (
          <button
            type="button"
            className="btn sendorder__button w-50 text-center"
            onClick={() => sendorderHandler()}
            aria-label="createorder"
          >
            Send Order
          </button>
        ) : (
          <button
            type="button"
            className="btn sendorder__button w-50 text-center"
            aria-label="paybill"
          >
            Pay Bill
          </button>
        )}
      </div>
      <div className="pb-3">
        <AlsoLike />
      </div>
    </div>
  );
}

export default CartPayment;
