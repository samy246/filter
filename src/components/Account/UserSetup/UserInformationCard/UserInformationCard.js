import axios from "axios";
import React, { useState, useEffect } from "react";
import "./UserInformationCard.scss";
import request from "../../../../request";
import { toast } from "react-toastify";
import { Modal } from "react-responsive-modal";
import { useTranslation } from "react-i18next";

function UserInformationCard({
  baxShadow,
  selected,
  name,
  phone,
  email,
  username,
  activeclassName,
  Clickfunction,
  currentuserid,
  admin,
  roles,
  status,
  handleNewPage,
  rolesdata,
  id,
  afterdelete,
  setafterdelete,
}) {
  const { t } = useTranslation();
  const [userrole, setuserrole] = useState();
  const [root, setroot] = useState(false);
  const [open, setOpen] = useState(false);
  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    for (let i in rolesdata) {
      if (roles === rolesdata[i].id) {
        setuserrole(rolesdata[i].name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [cardimage, setcardimage] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const getimage = await axios({
          method: "get",
          url: `${request.getimagebyid}/${id}`,
        });
        setcardimage(getimage.data);
      } catch (e) {}
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const deleteUser = async (e) => {
    onCloseModal();
    try {
      await axios({
        method: "post",
        url: request.customerstatus,
        data: {
          customer_id: currentuserid,
          customer_status: 2,
        },
      });
      toast.success("User deleted Successfully");
      setafterdelete(!afterdelete);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("userdata"));
    if (userdata.extension_attributes?.aw_ca_company_user?.is_root === true) {
      setroot(true);
    }
  }, []);

  return (
    <>
      {status !== 2 ? (
        <div
          className={`usersetup__admin__card ${
            baxShadow ? "active__shadow" : ""
          } ${activeclassName} `}
          onClick={Clickfunction}
        >
          <div className="usersetup__admin__card__head">
            <div className="admin__img">
              <img src={`${request.image}/${cardimage}`} alt="" width="50" />
            </div>
            <div className="admin__details">
              <p className="text-dark">
                <span>
                  <b>{t("Info")}</b>
                </span>
              </p>
              <p>
                <span>{t("Name")}:</span>{" "}
                <span>{name ? name : "Aiony Hurst"}</span>
              </p>
              <p>
                <span>{t("Phone")}:</span>{" "}
                <span>{phone ? phone : "+66 3 987 9343"}</span>
              </p>
              <p>
                <span>{t("Email")}:</span>{" "}
                <span>{email ? email : "Aiony_H@gmail.com"}</span>
              </p>
            </div>
            <div className="admin__status">
              {status ? (
                <p className="staus__btn">{t("Active")}</p>
              ) : (
                <p className="staus__btn">{t("In Active")}</p>
              )}
            </div>
          </div>
          <div className="hr">
            <hr className="m-0" />
          </div>
          <div className="usersetup__admin__card__body">
            <p className="text-dark">
              <span>
                <b>{t("Account")}</b>
              </span>
            </p>
            <p>
              <span>{t("UserName")}:</span>{" "}
              <span>{username ? username : "Aiony_H@gmail.com"}</span>
            </p>
            <p>
              <span>{t("Password")}:</span> <span>*********</span>
            </p>
          </div>
          <div className="usersetup__admin__card__footer">
            <div className="footer__card">
              <p className="m-0">
                <span>
                  {t("Role")}: {userrole}
                </span>
                <span className="icon">
                  <i
                    className={`far fa-check-circle ${selected ? "green" : ""}`}
                  />
                </span>
              </p>
              {root && userrole !== "Administrator" ? (
                <p className="pencilicon m-0">
                  <span onClick={handleNewPage}>
                    <i className="fas fa-pencil-alt" />
                  </span>
                  <span
                    className={`${admin ? "d-none" : "d-block"}`}
                    onClick={() => setOpen(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                      <path
                        fillRule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                      ></path>
                    </svg>
                  </span>
                  <Modal
                    className="text-center p-4"
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                    open={open}
                    onClose={onCloseModal}
                  >
                    <div className="wishlistpopup__body">
                      <div className=" pb-2 centertext">
                        <i className="far fa-trash-alt fa-3x wishlistpopup__body__icon " />
                      </div>
                      <h6 className="pb-2 centertext">{t("Remove this user")}?</h6>
                      <div className="wishlistpopup__button d-grid gap-4 col-9 mx-auto">
                        <button
                          type="button"
                          className="btn btn-danger remove__button"
                          onClick={(e) => deleteUser(e)}
                          aria-label="deleteuser"
                        >
                          {t("Remove")}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary Cancle_button"
                          onClick={onCloseModal}
                          aria-label="cancelbutt"
                        >
                          {t("Cancel")}
                        </button>
                      </div>
                    </div>
                  </Modal>
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default UserInformationCard;
