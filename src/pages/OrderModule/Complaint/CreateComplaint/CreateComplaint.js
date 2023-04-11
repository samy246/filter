import React, { useState, useEffect } from "react";
import "./CreateComplaint.scss";
import Add from "../../../../assets/images/MyOrder/Add.svg";
import { Dropdown } from "react-bootstrap";
import upload from "../../../../assets/images/MyOrder/upload.svg";
import axios from "axios";
import request from "../../../../request";
import { Modal } from "react-responsive-modal";
import complaintdone from "../../../../assets/images/MyOrder/complaint_done.png";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function CreateComplaint({
  complaintid,
  invoiceid,
  pid,
  unit,
  qty,
  complaint,
  setcreated,
  created,
  ordered_qty,
  child_orderId
}) {
  const [open, setOpen] = useState(false);
  const onCloseModal = () => setOpen(false);
  const { t } = useTranslation();
  
  const productissues = [
    {
      label: "Bad Texture",
      value: "Bad Texture",
    },
    {
      label: "Late Delivery",
      value: "Late Delivery",
    },
  ];

  const [count, setCount] = useState([
    {
      id: 1,
      issue: {
        label: "Select",
        value: "Select",
      },
      qty: "",
      description: "",
      img: [],
    },
  ]);

  const updateDescription = (value, data) => {
    const newCount = count?.map((c) => {
      if (c?.id === data?.id) {
        return { ...c, description: value };
      }
      return c;
    });

    setCount(newCount);
  };

  const updateQty = (value, data) => {
    if (value.length > 3) return;
    const newCount = count?.map((c) => {
      if (c?.id === data?.id) {
        return { ...c, qty: Math.round(value) };
      }
      return c;
    });

    setCount(newCount);
  };

  const updateIssue = (value, data) => {
    const newCount = count?.map((c) => {
      if (c?.id === data?.id) {
        return { ...c, issue: value };
      }
      return c;
    });

    setCount(newCount);
  };

  const [b64png, setb64png] = useState([]);
  const [orderimage, setorderimage] = useState([]);
  const [imageid, setimageid] = useState();

  const fileuploaded = (e, value) => {
    setorderimage([]);
    setimageid(value);
    var file = e.target.files;
    setorderimage(file);
  };

  useEffect(() => {
    setb64png([]);
    for (let i in orderimage) {
      if (
        orderimage[i].type === "image/png" ||
        orderimage[i].type === "image/jpeg" ||
        orderimage[i].type === "image/jpg"
      ) {
        const data = new Promise((resolve) => {
          var file = new File([orderimage[i]], orderimage[i]);
          var reader = new FileReader();
          // Read file content on file loaded event
          reader.onload = function (event) {
            resolve(event.target.result);
          };

          // Convert data to base64
          reader.readAsDataURL(file);
        }).then((result) => {
          let png = result?.replace(
            "data:application/octet-stream",
            `data:image/${orderimage[i].type === "image/png" ? "png" : ""}${
              orderimage[i].type === "image/jpeg" ? "jpeg" : ""
            }${orderimage[i].type === "image/jpg" ? "jpg" : ""}`
          );

          setb64png((b64png) => [...b64png, png]);
        });
      }
    }
  }, [orderimage]);

  useEffect(() => {
    const newCount = count?.map((c) => {
      if (c?.id === imageid?.id) {
        return { ...c, img: b64png };
      }
      return c;
    });
    setCount(newCount);
  }, [b64png]);

  const createcomplaintz = async () => {
    // return setOpen(true);
    let check = false
    let temp = [];
    count.filter((c) => {
      temp.push({
        order_id: child_orderId,
        invoice_id: invoiceid?.invoice_no,
        product_id: pid,
        purchase_unit: unit,
        purchase_qty: qty,
        complaint_qty: c?.qty,
        customer_id: localStorage.getItem("userid"),
        complaint_type: c?.issue?.value,
        complaint: c?.description,
        status: "0",
        attachments: c?.img,
      });
    });

    let qtycheck = false
    let imgcheck = false
    let zerocheck = false

    temp?.filter(tmp => {
      if(tmp?.complaint == "" || tmp?.complaint_qty == "" || tmp?.complaint_type == "Select") {
        check = true;
      }
      if(parseInt(tmp?.complaint_qty) == 0) {
        zerocheck = true
      }
      if(parseInt(tmp?.complaint_qty) > parseInt(ordered_qty)) {
        qtycheck = true
      }
      if(tmp?.attachments?.length == 0) {
        imgcheck = true
      }
    })

    if(qtycheck) {
      return toast.error("Reporting Quantity must not exceed Ordered Quantity")
    }

    if(zerocheck) {
      return toast.error("Quantity should be more than Zero")
    }

    if(imgcheck) {
      return toast.error("Please attach atleast one image")
    }

    if(check) {
      return toast.error("Please fill all the fields")
    } else {
      try {
        await axios({
          method: "post",
          url: request.savecomplaint,
          data: {
            complaints: temp,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOpen(true);
        setcreated(!created);
        setCount([{
          id: 1,
          issue: {
            label: "Select",
            value: "Select",
          },
          qty: "",
          description: "",
          img: [],
        }])
      } catch (e) {
        console.log(e)
        // toast.error(e);
      }
    }
    
  };

  return (
    <div className="createcomplaint">
      <Modal open={open} onClose={onCloseModal}>
        <div className="complaint__done">
          <img src={complaintdone} alt="" />
          <h3>
          {t("We’re sorry for your experience. Our team will review this issue and get back to you as soon as possible.")}
          </h3>
          <p onClick={onCloseModal}>Done</p>
        </div>
      </Modal>
      {count?.map((c, i) => (
        <div className="createcomplaint__content" key={i}>
          <div className="createcomplaint__type">
            <p>{t("I want to report this issue")}</p>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                {c?.issue?.label}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {productissues?.map((pi, i) => (
                  <Dropdown.Item key={i} onClick={() => updateIssue(pi, c)}>
                    {pi?.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <p>{t("for")}</p>
            <input
              type="number"
              onChange={(e) => updateQty(e.target.value, c)}
              className="type__qty"
              value={c?.qty}
            />
            <p>{t("QTY(Boxes) for this product")}</p>
          </div>
          <div className="createcomplaint__description">
            <h5>{t("Tell us more about your issue.")} </h5>
            <textarea
              rows="5"
              value={c?.description}
              onChange={(e) => updateDescription(e.target.value, c)}
            />
          </div>
          <div className="createcomplaint__images">
            <h4>{t("Attach Images")}: </h4>
            <div className="createcomplaint__allimages">
              <div className="createcomplaint__imgdata">
                <label>
                  <img src={upload} alt="" />
                  <input
                    type="file"
                    onChange={(e) => fileuploaded(e, c)}
                    className="fileuploader"
                    accept="image/jpeg, image/png, image/jpg"
                    data-max="2"
                  />
                  {t("Upload Images")}
                </label>
              </div>
              {c?.img?.length > 0 ? (
                <div className="createcomplaint__uploaded">
                  {c?.img?.map((ip, i) => (
                    <img key={i} src={ip} alt="" />
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="createcomplaint__buttons">
        <p
          className="buttons__addnew"
          onClick={() =>
            setCount((prevState) => [
              ...prevState,
              {
                id: count[count.length - 1].id + 1,
                issue: {
                  label: "Select",
                  value: "Select",
                },
                qty: "",
                description: "",
                img: [],
              },
            ])
          }
        >
          <img src={Add} alt="" />
          {t("Report another issue")}
        </p>
        <p className="buttons__send" onClick={createcomplaintz}>
        {t("Send")}
        </p>
      </div>

      {complaint.length > 0 &&
        complaint?.map((c, i) => (
          <div className="createcomplaint__content" key={i}>
            <div className="createcomplaint__type">
              <p>{t("I want to report this issue")}</p>

              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic" disabled>
                  {c?.complaint_type}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {productissues?.map((pi, i) => (
                    <Dropdown.Item
                      key={i}
                      onClick={() => updateIssue(pi, c)}
                      disabled
                    >
                      {pi?.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <p>{t("for")}</p>
              <input
                type="number"
                className="type__qty"
                value={c?.complaint_qty}
                disabled
              />
              <p>{t("QTY(Boxes) for this product")}</p>
            </div>
            <div className="createcomplaint__description">
              <h5>{t("Tell us more about your issue.")} </h5>
              <textarea rows="5" value={c?.complaint} disabled />
            </div>
            <div className="createcomplaint__images">
              <h4>{t("Attach Images")}: </h4>
              <div className="createcomplaint__allimages">
                {c?.attachments?.length > 0 ? (
                  <div className="createcomplaint__uploaded">
                    {c?.attachments?.map((ip, i) => (
                      <img
                        key={i}
                        src={`${request.image}/media/${ip}`}
                        alt=""
                        disabled
                      />
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="createcomplaint__buttons__sent">
              <p className="buttons__sent" onClick={createcomplaintz}>
              {t("Sent")}
              </p>
            </div>
          </div>
        ))}
       
    </div>
  );
}

export default CreateComplaint;
