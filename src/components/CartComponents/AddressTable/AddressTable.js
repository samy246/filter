import React, { useState, useEffect } from "react";
import "./AddressTable.scss";
import { useTranslation } from "react-i18next";

function AddressTable({
  handleSelectaddress,
  name,
  contact,
  telephone,
  branch,
  id,
  removeaddressHandler,
  defaultaddress,
  post_code,
  amphur,
  moo_name,
  sol,
  tumbol,
  currentid,
}) {
  const [checkedaddress, setcheckedaddress] = useState(false);
  const { t } = useTranslation();
  const branchselect = (e, id) => {
    // debugger;
    setopenaddress(!openaddress);
    e.target.checked ? handleSelectaddress(id) : removeaddressHandler(id);
    setcheckedaddress(!checkedaddress);
  };
  useEffect(() => {
    let check = currentid.find((cid) => cid === id);
    let removecheck = currentid.find((cid) => cid !== id);
    if (removecheck) {
      setcheckedaddress(false);
    }
    if (check) {
      setcheckedaddress(true);
      handleSelectaddress(id);
    }
  }, [currentid]);

  const [openaddress, setopenaddress] = useState(false);

  return (
    <div
      // className="addresstable d-flex"
      className={`${
        openaddress ? "addresstable d-flex" : "addresstablenotopen d-flex"
      }`}
      // onClick={() => setopenaddress(!openaddress)}
      onMouseEnter={() => setopenaddress(true)}
      onMouseLeave={() => setopenaddress(false)}
    >
      <input
        className="form-check-input addresstable__checkbox__width"
        type="checkbox"
        onClick={(e) => branchselect(e, id)}
        id={id}
        disabled={currentid?.length === 1 && currentid[0] === id ? true : false}
        checked={checkedaddress}
      />
      <label
        className="testin_table"
        htmlFor={id}
        onClick={() => setopenaddress(!openaddress)}
      >
        <p className="label">{t("Branch")}</p>
        <strong className="value">{name}</strong>
        <div>
          <hr />

          <p className="label">
            <span>{t("Name")}</span>
            <span>{t("Phone")}</span>
          </p>
          <p className="value">
            <span>{contact}</span>
            <span>{telephone}</span>
          </p>
          <hr />

          <p className="label">{t("Shipping address")}</p>
          <p className="value fw-bold">{branch}</p>
          <p className="value lastvalue">
            {amphur}, {moo_name}, {sol},{tumbol} - {post_code}
          </p>
        </div>
      </label>
    </div>
  );
}

export default AddressTable;
