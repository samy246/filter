import axios from "axios";
import React, { useState, useEffect } from "react";
import "./UserInformationCard.scss";
import request from "../../../../request";
import { toast } from "react-toastify";

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
  rootuser,
  handleNewPage,
  rolesdata,
  id,
}) {
  const [groupid, setgroupid] = useState(null);
  const [userrole, setuserrole] = useState();
  const [root, setroot] = useState(false);

  useEffect(() => {
    setgroupid(localStorage.getItem("company_role_id"));
    for (let i in rolesdata) {
      if (roles === rolesdata[i].id) {
        setuserrole(rolesdata[i].name);
      }
    }
  }, []);

  const deleteUser = async (e) => {
    try {
      const disableUser = await axios({
        method: "post",
        url: request.customerstatus,
        data: {
          customer_id: currentuserid,
          customer_status: 2,
        },
      });
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
              <img
                src="https://source.unsplash.com/random/75x75"
                alt="profile__pic"
                width="50"
              />
            </div>
            <div className="admin__details">
              <p className="text-dark">
                <span>
                  <b>Info</b>
                </span>
              </p>
              <p>
                <span>Name:</span> <span>{name ? name : "Aiony Hurst"}</span>
              </p>
              <p>
                <span>Phone:</span>{" "}
                <span>{phone ? phone : "+66 3 987 9343"}</span>
              </p>
              <p>
                <span>Email:</span>{" "}
                <span>{email ? email : "Aiony_H@gmail.com"}</span>
              </p>
            </div>
            <div className="admin__status">
              {status ? (
                <p className="staus__btn">Active</p>
              ) : (
                <p className="staus__btn">InActive</p>
              )}
            </div>
          </div>
          <div className="hr">
            <hr className="m-0" />
          </div>
          <div className="usersetup__admin__card__body">
            <p className="text-dark">
              <span>
                <b>Account</b>
              </span>
            </p>
            <p>
              <span>UserName:</span>{" "}
              <span>{username ? username : "Aiony_H@gmail.com"}</span>
            </p>
            <p>
              <span>Password:</span> <span>*********</span>
            </p>
          </div>
          <div className="usersetup__admin__card__footer">
            <div className="footer__card">
              <p className="m-0">
                <span>Role: {userrole}</span>
                <span className="icon">
                  <i
                    className={`far fa-check-circle ${selected ? "green" : ""}`}
                  />
                </span>
              </p>
              {root ? (
                <p className="pencilicon m-0">
                  <span onClick={handleNewPage}>
                    <i className="fas fa-pencil-alt" />
                  </span>
                  <span
                    className={`${admin ? "d-none" : "d-block"}`}
                    onClick={(e) => deleteUser(e)}
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
