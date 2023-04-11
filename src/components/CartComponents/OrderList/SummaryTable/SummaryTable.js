import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import "./SummaryTable.scss";
import { useStateValue } from "../../../../store/state";
import axios from "axios";
import request from "../../../../request";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Modal } from "react-responsive-modal";
import { browserName, browserVersion } from "react-device-detect";
import cancelcart from '../../../../assets/images/cart/cancelcart.svg'
import progresscart from '../../../../assets/images/cart/progresscart.svg'
import successcart from '../../../../assets/images/cart/successcart.svg'

function SummaryTable({ update, link, page, addressdata }) {
  const { orderid } = useParams();
  const { t } = useTranslation();
  const [{ summary, selected, vat, productcount, cart }, dispatch] = useStateValue();
  const [spinner, setspinner] = useState(false);
  const [ctype, setctype] = useState();

  // POP UP - Place Order Prompt
  const [placeOrder, setplaceOrder] = useState(false);
  const onOrderCloseModal = () => setplaceOrder(false);
  const onOrderOpenModal = () => setplaceOrder(true);

  // POP UP - Wating msg
  const [waitOrder, setwaitOrder] = useState(false);
  const onWaitCloseModal = () => setwaitOrder(false);
  const onWaitOpenModal = () => setwaitOrder(true);

  // POPup - Success or Failure
  const [orderApiStatus, setOrderApiStatus] = useState()
  const [statusOrder, setstatusOrder] = useState(false);
  const onStatusCloseModal = () => setstatusOrder(false);
  const onStatusOpenModal = () => setstatusOrder(true);

  const [complaintcheck, setcomplaintcheck] = useState()
  useEffect(async() => {
    try {
      const check = await axios({
        method: 'get',
        url: `${request?.complaintcheck}${orderid}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setcomplaintcheck(check?.data[0]?.status)
    } catch(e) {
      console.log(e)
    }
  }, [orderid])

  const [currentuser, setcurrentuser] = useState();
  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  useEffect(() => {
    let usercompany = JSON.parse(localStorage.getItem("company_role_id"));
    let companyroles = JSON.parse(localStorage.getItem("companyrolesdata"));
    const currentcompany = companyroles?.find(
      (data) => data.id === usercompany
    );
    setcurrentuser(currentcompany?.name);
  }, []);

  const history = useHistory();

  const Nexthandler = (value) => {
    if (summary.subtotal == 0 || summary == []) {
      return toast.info("There must be atleast one product in the Cart");
    } else {
      onOrderOpenModal()
      // history.push(value);
    }
  };

  const confirmOrder = () => {
    onOrderCloseModal();
    onWaitOpenModal();
  }

  const [creditamount, setcreditamount] = useState(0);
  const [placedorderid, setplacedorderid] = useState()

  useEffect(async () => {
    try {
      const creditcheck = await axios({
        method: "post",
        url: request.creditcheck,
        data: {
          company_id: localStorage.getItem("companyid"),
        },
      });
      setcreditamount(
        parseFloat(creditcheck?.data[0]?.pending_price) +
          parseFloat(summary?.total)
      );
    } catch (e) {
      console.log(e);
    }
  }, [summary]);

  const [creditvalidate, setcreditvalidate] = useState(true);

  const [pendingstatus, setpendingstatus] = useState(false);

  useEffect(async () => {
    try {
      const customertype = await axios({
        method: "post",
        url: request?.paymenttype,
        data: {
          company_id: localStorage.getItem("companyid"),
        },
      });
      setctype(customertype?.data[0]?.customerType);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(async () => {
    if(!waitOrder) return
    if (creditamount === 0 || Number.isNaN(creditamount)) return;
    setpendingstatus(true);
    let userdata = JSON.parse(localStorage.getItem("userdata"));
    let ccode;
    userdata?.custom_attributes.find((ca) => {
      if (ca?.attribute_code == "customer_code") {
        ccode = ca?.value;
      }
    });
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
    let creditbalance = await axios({
      method: "get",
      url: `${request.erprequest}/credits/validate-credit?P_CUST=${ccode}&P_CREDIT=${creditamount}`,
      headers: {
        token: `Bearer ${erptoken.data.data.token}`,
      },
    });
    setcreditvalidate(creditbalance?.data?.data?.creditValidated);
    if (creditbalance?.data?.data?.creditValidated) {
      setcreditvalidate(true);
      createorder();
    } else {
      setcreditvalidate(false);
      onWaitCloseModal();
      onStatusOpenModal();
      setOrderApiStatus('failure')
      // toast.info("Credit is not enough to place the order")
    }
    setpendingstatus(false);
  }, [waitOrder]);

  const reorder = async () => {
    try {
      const result = await axios({
        method: "post",
        url: request.reorder,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          order_id: orderid,
          quote_id: localStorage.getItem("cartid"),
        },
      });
      toast.info(result?.data[0]?.message);
      dispatch({
        type: "CART_STATUS",
      });
      history.push("/cartPage/OrdertoDelivery");
    } catch (e) {
      console.log(e);
    }
  };

  const [currentorderid, setcurrentorderid] = useState();
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

  const createorder = async () => {
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
        const cartresponse = await axios({
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
                method: ctype == 1 ? "cashondelivery" : "credit",
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
        setplacedorderid(cartresponse?.data?.extension_attributes?.parent_order_id)
        createlog();
        onWaitCloseModal();
        setOrderApiStatus('success')
        onStatusOpenModal()
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

  return (
    <div>
      {/* onStatusCloseModal */}
      <Modal open={statusOrder} classNames={{
          overlay: 'customOverlay',
          modal: 'customModal__statusorder',
        }}>
          <div className="summary__statusorder">
            {orderApiStatus == "success" &&
              <img src={successcart} alt="" />
            }
            {orderApiStatus == "success" && 
              <p className="statusorder__success">
                <span>
                  You Order is Successfully Placed.
                </span>
                <span>To View your Orders, Please <Link to={`/myorder/${placedorderid}`}>Click here</Link> ...</span>
              </p>
            }
            {orderApiStatus == "failure" &&
              <img src={cancelcart} alt="" />
            }
            {orderApiStatus == "failure" && 
              <p className="statusorder__failure">
                You do not have enough credit to Place this Order.
              </p>
            }
            <svg
              onClick={() => `${orderApiStatus == "success" ? history.push('/') : onStatusCloseModal}`}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
        </Modal>
      <Modal open={waitOrder} classNames={{
          overlay: 'customOverlay',
          modal: 'customModal__waitorder',
        }}>
          <div className="summary__waitorder">
            <img src={progresscart} alt="" />
            <p>Your Order is being Placed, Kindly wait...</p>
            <p>(Please do not refresh the page)</p>
          </div>
        </Modal>
      <Modal open={placeOrder} classNames={{
          overlay: 'customOverlay',
          modal: 'customModal__placeorder',
        }}>
        <div className="summary__placeorder">
          <img src={progresscart} alt="" />
          <p className="placeorder__content">{`You are about to place the order for the total price:  ฿ ${summary?.subtotal_with_incl_tax &&
                  summary?.subtotal_with_incl_tax % 1 === 0
                    ? `${formatToCurrency(
                        parseInt(summary?.subtotal_with_incl_tax)
                      )}.00`
                    : formatToCurrency(
                        parseFloat(summary?.subtotal_with_incl_tax).toFixed(2)
                      )}.` }
          </p>
          <p className="placeorder__content">Do you want to place this Order?</p>
          {ctype == 1 ? 
            <p>Note: As a Cash Customer, You are required to pay on product Delivery Date.</p>
            :
            <p>Note: As you are the Credit Customer, You will require to pay as per the credit terms.</p>
          }
          <p className="placeorder__button">
            <span className="placeorder__accept" onClick={() => confirmOrder()}>
              Place Order
            </span>
            <span className="placeorder__cancel" onClick={() => onOrderCloseModal()}>Cancel</span>
          </p>
        </div>
      </Modal>
      <div className="summarytable__ToastContainer"></div>
      <div
        className={`orderlist__col_two bg-white ${
          page === "myorder" && "flexbox"
        }`}
      >
        <div className="orderlist__summary__table">
          <table className="table m-0 ">
            <thead>
              <tr>
                <th colSpan="4">
                  <p className="m-0 summary__text">{t("Cart Summary")}</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="table__row1" colSpan="4">
                <td>
                  <span>{t("Total Price")}</span>
                </td>
                {!spinner ? (
                  <td className="text-end">
                    ฿{" "}
                    {summary?.subtotal && summary?.total % 1 === 0
                      ? `${formatToCurrency(parseInt(summary?.total))}.00`
                      : formatToCurrency(parseFloat(summary?.total).toFixed(2))}
                  </td>
                ) : (
                  <td>
                    <div className="summary__spinner">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </td>
                )}
              </tr>
              <tr className="table__row1" colSpan="4">
                <td>
                  <span>{t("Total Products")}</span>
                </td>
                <td className="text-end">{productcount}</td>
              </tr>
              <tr>
                <th colSpan="4">
                  <p className="m-0 summary__text">{t("Check out Summary")}</p>
                </th>
              </tr>
              <tr className="accordion accordion-item accordian_fw">
                <th colSpan="4" style={{ borderBottom: "0" }}>
                  <h2 className="accordion-header" id="headingProduct">
                    <button
                      className="accordion-button collapsed "
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseProduct"
                      aria-expanded="true"
                      aria-controls="collapseProduct"
                    >
                      {t("Products Selected")}
                    </button>
                    <span className="productlength">{selected?.length}</span>
                  </h2>
                  <div
                    id="collapseProduct"
                    className="accordion-collapse collapse "
                    aria-labelledby="headingProduct"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {selected.map((l, i) => (
                        <p className="list__li" key={i}>
                          <span className="productindex">{i + 1}</span>
                          <span className="productname">{l.product_name}</span>
                          <span className="productvat">
                            {t("VAT")}({parseInt(l.vat)}%)
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                </th>
              </tr>
              <tr className="table__row1" co lSpan="4">
                <td>{t("Sub Total")}</td>
                <td className="text-end">
                  ฿{" "}
                  {summary?.subtotal && summary?.subtotal % 1 === 0
                    ? `${formatToCurrency(parseInt(summary?.subtotal))}.00`
                    : formatToCurrency(
                        parseFloat(summary?.subtotal).toFixed(2)
                      )}
                </td>
              </tr>
              <tr className="accordion accordion-item accordian_fw">
                <th colSpan="4" style={{ borderBottom: "0" }}>
                  <h2 className="accordion-header" id="headingVAT">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseVAT"
                      aria-expanded="true"
                      aria-controls="collapseVAT"
                    >
                      {t("VAT")} (7%)
                    </button>
                    <span className="vatlength">{vat?.length}</span>
                  </h2>
                  <div
                    id="collapseVAT"
                    className="accordion-collapse collapse "
                    aria-labelledby="headingVAT"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {vat.map((l, i) => (
                        <p className="list__li" key={i}>
                          {/* <span className="productindex">{i + 1}</span> */}
                          <span className="productname">{l?.product_name}</span>
                          <span className="productvat">
                            {l?.vat_price % 1 === 0
                              ? `฿ ${formatToCurrency(
                                  parseInt(l?.vat_price)
                                )}.00`
                              : `฿ ${formatToCurrency(
                                  parseFloat(l?.vat_price).toFixed(2)
                                )}`}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                </th>
              </tr>
              <tr className="table__row1" colSpan="4">
                <td>{t("Total")}</td>
                <td className="text-end">
                  ฿{" "}
                  {summary?.subtotal_with_incl_tax &&
                  summary?.subtotal_with_incl_tax % 1 === 0
                    ? `${formatToCurrency(
                        parseInt(summary?.subtotal_with_incl_tax)
                      )}.00`
                    : formatToCurrency(
                        parseFloat(summary?.subtotal_with_incl_tax).toFixed(2)
                      )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className="accordion accordion-flush p-2"
          id="accordionFlushExample"
        >
          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingOne">
              <button
                className="accordion-button collapsed summary__accordion__button"
                type="button"
                data-toggle="collapse"
                data-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                {t("Apply Discount Code")}{" "}
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body ">
                <form className="pt-2">
                  <input
                    className="form-control code__input border-0"
                    type="text"
                    placeholder="Enter Discount Code"
                  />
                  <div className="text-center">
                    <p
                      className="discount_button"
                      data-toggle="collapse"
                      data-target="#flush-collapseOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseOne"
                    >
                      {t("Apply Discount")}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {
          currentuser !== "Purchaser" &&
            <button
              className="text-white table_next_button btn"
              onClick={() => Nexthandler(link)}
              disabled={addressdata?.length === 0 ? true : false}
            >
              {t("Place Order")} <i className="fas fa-chevron-right" />
            </button>
        }
        {/* {page !== "myorder" && pendingstatus ? (
          <button
            className="text-white table_next_button btn"
            disabled={addressdata?.length === 0 ? true : false}
          >
            {t("Checking Credit")}...
          </button>
        ) : page === "myorder" ? (
          ""
        ) : currentuser !== "Purchaser" && creditvalidate ? (
          <button
            className="text-white table_next_button btn"
            onClick={() => Nexthandler(link)}
            disabled={addressdata?.length === 0 ? true : false}
          >
            {t("Place Order")} <i className="fas fa-chevron-right" />
          </button>
        ) : (
          <button
            className="text-white table_next_button btn"
            onClick={() => toast.warn("Credit Not Available")}
            disabled={addressdata?.length === 0 ? true : false}
          >
            {t("Next")} <i className="fas fa-chevron-right" />
          </button>
        )} */}
      </div>
      {page === "myorder" && (
        <>
          {window.innerWidth < 580 && (
            <>
              <span className="total">{t("Total")}: THB 10,000,000</span>
              <button className="makepay">{t("Make Payment")}</button>
              <button onClick={reorder} className="reorder">
                {t("Reorder")}
              </button>
              {
                complaintcheck != "false" && 
                <Link to={`/myorder/complaint/${orderid}`}>
                  <button className="report">Report Issue</button>
                </Link>
              }
            </>
          )}

          {window.innerWidth > 580 && (
            <>
              <button className="makepay">{t("Make Payment")}</button>
              <button onClick={reorder} className="reorder">
                {t("Reorder")}
              </button>
              {
                complaintcheck != "false" && 
                <Link to={`/myorder/complaint/${orderid}`}>
                  <button className="report">Report Issue</button>
                </Link>
              }
            </>
          )}
        </>
      )}
    </div>
  );
}

export default SummaryTable;
