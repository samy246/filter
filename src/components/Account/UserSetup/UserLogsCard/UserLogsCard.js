import React from "react";
import "./UserLogsCard.scss";
import moment from "moment";
import request from "../../../../request";

function UserLogsCard({ created_at, action, value }) {
  return (
    <div className={`usersetup__activitylogs__div`}>
      <img src={`${request.image}/media/customers${value}`} alt="" width="50" />
      <div className="activitylogs__userdata">
        <div className="logs__userdata">
          <small>
            <span>{action}</span>{" "}
          </small>
        </div>
        <div className="activitylogs__time">
          <span>
            <small className="m-0">
              {moment(created_at).format("YYYY-MM-DD, h:mm:ss")}
            </small>
          </span>
          <span className="text-end">
            <small className="activitylogs__time__clock  m-0">
              <span>
                <i className="far fa-clock" />
              </span>
              <span> {moment(created_at).startOf("day").fromNow()}</span>
            </small>
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserLogsCard;
