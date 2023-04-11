import React, { useState, useEffect } from "react";
import "./RoleDropdown.scss";
import { useTranslation } from "react-i18next";

function RoleDropdown({
  roles,
  setcomid,
  roleid,
  setselectedcompany,
  comid,
  setbranch,
  type,
  setselectedstate,
  setselecteddistrict,
  setselectedsubdistrict,
  setDefaultaddData
}) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const toggleDropdown = () => setOpen(!isOpen);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if(type === "defaultaddress") {
      if(comid == undefined) return
      handleItemClick(comid)
    } else {
      // debugger;
      handleItemClick(roleid);
    }
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleid, comid]);

  const handleItemSelect = (index, id) => {
      setActiveIndex(index);
      handleItemClick(id);
  };

  const handleItemClick = (id) => {
    if(id == undefined) return
    if (type === "roles") {
      setcomid(id);
    }
    if (type === "company") {
      setselectedcompany(id);
    }
    if (type === "branch") {
      setbranch(id);
    }
    if (type === "state") {
      const data = roles.filter((r) => {
        if (r.id === id) {
          return r;
        }
      });
      setselectedstate(data[0]?.name);
    }
    if (type === "district") {
      const data = roles.filter((r) => {
        if (r.id === id) {
          return r;
        }
      });
      setselecteddistrict(data[0]?.name);
    }
    if (type === "subdistrict") {
      const data = roles.filter((r) => {
        if (r.id === id) {
          return r;
        }
      });
      setselectedsubdistrict(data[0]?.name);
    }

    if (type === "defaultaddress") {
      const data = roles.filter((r) => {
        if (r.value === id) {
          return r;
        }
      });
      setDefaultaddData(data[0]?.value);
    }

    setSelectedItem(id);
    toggleDropdown();
  };
  return (
    <div className="RoleDropdown ">
      <div className="RoleDropdown_header" onClick={toggleDropdown}>
        {type == "defaultaddress" ? selectedItem ? roles.find((item) => item.value == selectedItem)?.label : `${t("Select default address for this user")}`
        :
        <>
          {selectedItem ? (
            roles.find((item) => item.id == selectedItem)?.name
          ) : (
            <>
              {type === "company" && "Select Company"}
              {type === "roles" && "Select Roles"}
              {type === "branch" && "Select Branch"}
              {type === "state" && "Select State"}
              {type === "district" && "Select District"}
              {type === "subdistrict" && "Select SubDistrict"}
            </>
          )}
        </>  
        }
        <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
      </div>
      <div className={`dropdown-body ${isOpen && "open"}`}>
        {roles?.map((item, index) => (
          <div
            key={index}
            className={`dropdown-item && ${
              activeIndex === index ? "active" : "unactive"
            }`}
            id={item.id}
            onClick={(e) => handleItemSelect(index, e.target.id)}
          >
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              checked={activeIndex === index}
              id={item.id ? item?.id : item?.value}
              onClick={(e) => handleItemClick(e.target.id)}
            />
            <label className="form-check-label w-100" id={item.id ? item?.id : item?.value}>
              {item.name ? item?.name: item?.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoleDropdown;
