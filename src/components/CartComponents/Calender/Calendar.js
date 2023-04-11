import React, { useState } from "react";
import "./Calendar.scss";
import Calendar from "react-calendar";
import moment from "moment";
function CalendarComponent({ setSelectedDay, selectedDay }) {
  const [colored, setColored] = useState(false);
  const todaydate = () => {
    setSelectedDay(new Date());
    TodayDateSet(new Date());
  };
  const TodayDateSet = (event) => {
    let date = moment(new Date()).format("YYYY-MM-DD");
    let eventDate = moment(event).format("YYYY-MM-DD");
    date === eventDate ? setColored(true) : setColored(false);
  };
  const handleChange = (event) => {
    setSelectedDay(event);
    TodayDateSet(event);
  };

  return (
    <div className="calendar_cart_page">
      <Calendar
        className="calendar_custom_work"
        onChange={handleChange}
        value={selectedDay}
        minDate={new Date()}
      />
      <div className="calender__footer">
        <div className="delivery_options">
          <span onClick={() => todaydate()} className="main_span_calendar">
            <span class={`dot ${colored && "dot_colored"}`}></span>
            <span className="calendar__btntext">Today</span>
          </span>
          <span className="delivery_date_span">
            <span className="dot"></span>
            <span className="calendar__btntext">Your Delivery Date</span>
          </span>
        </div>
      </div>
    </div>
  );
}
export default CalendarComponent;
