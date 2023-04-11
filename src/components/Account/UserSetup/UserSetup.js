import React, { useState, useEffect } from "react";
import AddnewUser from "./AddnewUser/AddnewUser";
import UserInformationCard from "./UserInformationCard/UserInformationCard";
import UserLogsCard from "./UserLogsCard/UserLogsCard";
import "./UserSetup.scss";
import { toast } from "react-toastify";
import axios from "axios";
import request from "../../../request";
import { t } from "i18next";
import { useHistory } from "react-router-dom";

import imge from "../../../assets/images/about.png"


function UserSetup({ action, setFormaction }) {
  const [userData, setUserData] = useState([]);
  const [admin, setadmin] = useState([]);
  const [purchaser, setpurchaser] = useState([]);
  const [supervisor, setsupervisor] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndex_2, setActiveIndex_2] = useState(null);
  const [activeIndex_3, setActiveIndex_3] = useState(null);
  const [companygrp, setcompanygrp] = useState([]);
  const [updateuser, setupdateuser] = useState(null);
  const [roles, setroles] = useState(null);
  const [isroot, setisroot] = useState(false);
  const [size, setSize] = useState();
  const [afterdelete, setafterdelete] = useState();
  const history = useHistory();

  useEffect(() => {
    if(localStorage.getItem("currentrole") == "Purchaser") {
      history.push("/myaccount/myprofile")
    }
  }, [localStorage.getItem("currentrole")])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [action]);

  useEffect(() => {
    getroles();
    alluserdata();
    setisroot(localStorage.getItem("userdata"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    alluserdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterdelete]);

  const [root, setroot] = useState(false);
  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("userdata"));
    if (userdata?.extension_attributes?.aw_ca_company_user?.is_root === true) {
      setroot(true);
    }
  }, []);

  useEffect(() => {
    databasedonrole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, companygrp]);

  useEffect(() => {
    if (localStorage.getItem("companyid") === null) return;
    async function fetchData() {
      try {
        const logs = await axios({
          method: "get",
          url: `${request.getactivitylogs}/${localStorage.getItem(
            "companyid"
          )}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        let meetings = logs.data;
        var sortedData = meetings
          .sort((a, b) => {
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          })
          .reverse();
        setSize(10);
        setUserData(sortedData);
      } catch (e) {
        toast.error(e.response?.data?.message);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    userData.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.date) - new Date(b.date);
    });
  }, [userData]);

  const alluserdata = async () => {
    if (localStorage.getItem("companyid") === null) return;
    try {
      const companydata = await axios({
        method: "get",
        url: `${request.getcompanyusers}/${localStorage.getItem("companyid")}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setcompanygrp(companydata.data);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const getroles = async () => {
    if (localStorage.getItem("companyid") === null) return;
    try {
      const rolesdata = await axios({
        method: "get",
        url: `${request.getcompanyroles}/${localStorage.getItem("companyid")}/${localStorage.getItem('currentrole')}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setroles(rolesdata?.data);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const databasedonrole = () => {
    const rolesdata = JSON.parse(localStorage.getItem("companyrolesdata"));
    let admindata = [];
    let superdata = [];
    let purdata = [];
    companygrp.filter((cg) =>
      rolesdata.filter((rd) => {
        if (
          rd.name === "Administrator" &&
          cg.extension_attributes.aw_ca_company_user.company_role_id === rd.id
        ) {
          admindata?.push(cg);
        }
        if (
          rd.name === "Supervisor" &&
          cg.extension_attributes.aw_ca_company_user.company_role_id === rd.id
        ) {
          superdata?.push(cg);
        }
        if (
          rd.name === "Purchaser" &&
          cg.extension_attributes.aw_ca_company_user.company_role_id === rd.id
        ) {
          purdata?.push(cg);
        }
      })
    );
    setadmin(admindata);
    setsupervisor(superdata);
    setpurchaser(purdata);
  };

  useEffect(() => {
    setsupervisor(supervisor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supervisor]);

  const handleSelect = (id) => {
    setActiveIndex(id);
    setActiveIndex_2("010101");
    setActiveIndex_3("010101");
  };
  const handleSelect_2 = (id) => {
    setActiveIndex_2(id);
    setActiveIndex("010101");
    setActiveIndex_3("010101");
  };
  const handleSelect_3 = (id) => {
    setActiveIndex_3(id);
    setActiveIndex_2("010101");
    setActiveIndex("010101");
  };
  const handleActionClick = (action, id) => {
    setFormaction(action);
    if (action === "update") {
      handleUpdateClick(id);
    } else {
      setFormaction("empty");
    }
  };

  const handleUpdateClick = (id) => {
    const user = companygrp.find((user) => user.id === id);
    setupdateuser(user);
  };
  if (action === "empty") {
    return <AddnewUser roles={roles} />;
  } else if (action === "update") {
    return <AddnewUser updateuser={updateuser} action={action} roles={roles} />;
  } else {
    return (
      <div className="usersetup">
        <div className="usersetup__topdiv">
          <span className="h3">{t("User Setup")}</span>
          {root || localStorage.getItem("currentrole") == "Supervisor" && (
            <span
              className="usersetup__newuser__button"
              onClick={() => handleActionClick()}
            >
              <i className="fas fa-plus" />
              &nbsp; {t("New User")}
            </span>
          )}
        </div>
        <div className="usersetup__activitylogs pb-4">
          <h5>{t("Activity Logs")}</h5>
          <hr className="m-0" />
          {userData?.slice(0, size).map(({ index, ...otherprops }) => (
            <UserLogsCard key={index} {...otherprops} size />
          ))}
          {userData.length > size && size === 10 ? (
            <span className="usersetup__readmore" onClick={() => setSize(-1)}>
              {t("Read More")}
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="usersetup__adminlevel pb-4">
          <h5>{t("Admin Level")}</h5>
          <hr />
          <div className="adminlevel__cards">
            {admin?.map((data, i) => (
              <UserInformationCard
                activeclassName={activeIndex === i ? "active" : "unactive"}
                Clickfunction={() => handleSelect(i)}
                key={i}
                name={data.firstname}
                username={data.lastname}
                email={data.email}
                id={data.id}
                phone={data.extension_attributes.aw_ca_company_user.telephone}
                roles={
                  data.extension_attributes.aw_ca_company_user.company_role_id
                }
                status={data.extension_attributes.aw_ca_company_user.status}
                handleNewPage={() => handleActionClick("update", data.id)}
                rolesdata={JSON.parse(localStorage.getItem("companyrolesdata"))}
                rootuser={data.extension_attributes.aw_ca_company_user.is_root}
              />
            ))}
          </div>
        </div>
        <div className="usersetup__supervisorlevel pb-4">
          <div className="level__div">
            <h5>{t("Supervisor Level")}</h5>
            <div class="imageSvg"><img src={imge} alt='' style={{width:"70%"}}/>
              <span class="ttooltiptext">{t("Supervisor Description")}</span>
            </div>
            {root && (
              <span
                className="usersetup__newuser__button"
                onClick={() => handleActionClick("empty")}
              >
                <i className="fas fa-plus" />
                &nbsp; {t("New User")}
              </span>
            )}
          </div>

          <hr />
          <div className="usersetup__supervisorlevel__cards">
            {supervisor?.map((data, i) => (
              <UserInformationCard
                activeclassName={activeIndex_3 === i ? "active" : "unactive"}
                Clickfunction={() => handleSelect_3(i)}
                key={i}
                id={data.id}
                name={data.firstname}
                username={data.lastname}
                email={data.email}
                phone={data.extension_attributes.aw_ca_company_user.telephone}
                roles={
                  data.extension_attributes.aw_ca_company_user.company_role_id
                }
                status={data.extension_attributes.aw_ca_company_user.status}
                handleNewPage={() => handleActionClick("update", data.id)}
                rolesdata={JSON.parse(localStorage.getItem("companyrolesdata"))}
                currentuserid={data.id}
                setafterdelete={setafterdelete}
                afterdelete={afterdelete}
              />
            ))}
          </div>
        </div>
        <div className="usersetup__purchaselevel pb-4">
          <div className="level__div">
            <h5>{t("Purchase Level")}</h5>{" "}
            <div class="imageSvg"><img src={imge} alt='' style={{width:"70%"}}/>
  <span class="ttooltiptext">{t("Purchase Description")}</span>
</div>
            {root && (
              <span
                className="usersetup__newuser__button"
                onClick={handleActionClick}
              >
                <i className="fas fa-plus" />
                &nbsp; {t("New User")}
              </span>
            )}
          </div>
          <hr />
          <div className="usersetup__purchaselevel__cards">
            {purchaser?.map((data, i) => (
              <UserInformationCard
                activeclassName={activeIndex_2 === i ? "active" : "unactive"}
                Clickfunction={() => handleSelect_2(i)}
                key={i}
                id={data.id}
                name={data.firstname}
                username={data.lastname}
                email={data.email}
                phone={data.extension_attributes.aw_ca_company_user.telephone}
                roles={
                  data.extension_attributes.aw_ca_company_user.company_role_id
                }
                status={data.extension_attributes.aw_ca_company_user.status}
                handleNewPage={() => handleActionClick("update", data.id)}
                rolesdata={JSON.parse(localStorage.getItem("companyrolesdata"))}
                currentuserid={data.id}
                setafterdelete={setafterdelete}
                afterdelete={afterdelete}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default UserSetup;
