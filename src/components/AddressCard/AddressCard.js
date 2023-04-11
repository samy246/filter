import React, { useState, useEffect } from "react";
import "./AddressCard.scss";
import Pencil from "../../assets/images/Account/pencil.svg";
import { Modal } from "react-responsive-modal";
import Delete from "../../assets/images/Account/delete.svg";
import axios from "axios";
import request from "../../request";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function AddressCard({
  status,
  addresslist,
  handleNewPage,
  seteditaddress,
  setEnterDelivery,
  setNewUser,
  setDeliveryAddressBack,
}) {
  const [open, setOpen] = useState(false);
  const [currentid, setcurrentid] = useState(null);
  const { t } = useTranslation();
  const [currentuser, setcurrentuser] = useState();
  useEffect(() => {
    let usercompany = JSON.parse(localStorage.getItem("company_role_id"));
    let companyroles = JSON.parse(localStorage.getItem("companyrolesdata"));
    const currentcompany = companyroles?.find(
      (data) => data.id === usercompany
    );
    setcurrentuser(currentcompany?.name);
  }, []);

  const removeAddress = async () => {
    try {
      await axios({
        method: "post",
        url: request.deletebranch,
        data: {
          data: {
            id: currentid,
            customer_id: localStorage.getItem("userid"),
          },
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOpen(false);
      setDeliveryAddressBack(true);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const editCurrentaddress = (value) => {
    seteditaddress(value);
    handleNewPage();
    setEnterDelivery(true);
    setNewUser(true);
  };

  const onopenmodal = (value) => {
    setOpen(true);
    setcurrentid(value);
  };

  return (
    <>
      {addresslist?.map((b, i) => (
        <div className="addresscard" key={i}>
          <div className="addresscard__header" onClick={() => editCurrentaddress(b.id)}>
            <div className="addresscard__location">
              <h4>{b.branch_name ? b.branch_name : ""}</h4>
              <p>{b.street ? b.street : ""}</p>
            </div>
            <div className="addresscard__status">
              {b.status === "0" ? (
                <p className="addresscard__pending">{t("Pending App")}</p>
              ) : (
                <p className="addresscard__active">{t("Active")}</p>
              )}
            </div>
          </div>
          <div className="addresscard__options">
            <div className="addresscard__text">
              <i className="far fa-check-circle " id={b.chk_default == "Y" ? "chkdefault":""}/>
              <span>{t("Default Billing Address")}</span>
            </div>
            {currentuser !== "Purchaser" && (
              <div className="addresscard__icons">
                {/* <img
                  src={Pencil}
                  alt=""
                  onClick={() => editCurrentaddress(b.id)}
                /> */}
              </div>
            )}

            <Modal
              open={open}
              onClose={() => setOpen(false)}
              className="text-center p-4"
              dialogClassName="modal-90w"
              aria-labelledby="contained-modal-title-vcenter"
            >
              <div className="wishlistpopup__body">
                <div className=" pb-2">
                  <i className="far fa-trash-alt fa-3x wishlistpopup__body__icon " />
                </div>
                <h6 className="pb-2">{t("Remove this Address")}?</h6>
                <div className="wishlistpopup__button d-grid gap-4 mx-auto">
                  <button
                    type="button"
                    className="btn btn-danger remove__button"
                    onClick={() => removeAddress()}
                    aria-label="removebutton"
                  >
                    {t("Remove")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary Cancle_button"
                    onClick={() => setOpen(false)}
                    aria-label="cancelbutton"
                  >
                    {t("Cancel")}
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      ))}
    </>
  );
}

export default AddressCard;
