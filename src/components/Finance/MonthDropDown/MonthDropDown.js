import React from "react";
import "./MonthDropDown.scss";
import Months from "../../../assets/Json/Months/Months.json";
import { useStateValue } from "../../../store/state";

function MonthDropDown() {
  const [{}, dispatch] = useStateValue();

  const selectedMonths = (month) => {
    dispatch({
      type: "HISTORY_MONTHS",
      item: month,
    });
  };
  return (
    <div className="monthdropdown">
      <ul>
        <p>select month</p>
        {Months.Months.map((month, i) => (
          <li key={i} onClick={() => selectedMonths(month)}>
            <input
              type="checkbox"
              className="form-check-input"
              id={month.label}
              name={month.label}
              value={month.value}
            />
            <label>{month.label}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MonthDropDown;
