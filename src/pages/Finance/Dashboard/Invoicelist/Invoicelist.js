import moment from "moment";
import React, { useState, useEffect } from "react";
import "./Invoicelist.scss";

function Invoicelist({ data, invtab, fromdate, todate, settodate, setfromdate }) {
  const [invdata, setInvData] = useState([]);
  const [datevalue, setdatevalue]= useState([]);

  useEffect(() => {
    let max = Math.max(...datevalue);
    let min = Math.min(...datevalue);
    settodate(new Date(max));
    setfromdate(new Date(min));
  }, [datevalue])

  useEffect(() => {
    data.filter(d => {
      setdatevalue(prevState => [
        ...prevState, new Date(d?.INV_DATE).getTime()
      ])
    })
  }, [data])

  useEffect(() => {
    var from = new Date(fromdate).getTime();
    var to = new Date(todate).getTime();
    setInvData([]);
    
    if (invtab === "ALL") {
      data?.filter((d) => {
        if (
          new Date(d?.INV_DATE).getTime() >= from &&
          new Date(d?.INV_DATE).getTime() <= to
        ) {
          setInvData((prevState) => [...prevState, d]);
        }
      });
    }
    if (invtab === "Invoices") {
      data?.filter((d) => {
        if (
          new Date(d?.INV_DATE).getTime() >= from &&
          new Date(d?.INV_DATE).getTime() <= to &&
          d?.INV_BOOK.charAt(0) == "I"
        ) {
          setInvData((prevState) => [...prevState, d]);
        }
      });
    }
    if (invtab === "Credit Note") {
      data?.filter((d) => {
        if (
          new Date(d?.INV_DATE).getTime() >= from &&
          new Date(d?.INV_DATE).getTime() <= to &&
          d?.INV_BOOK.charAt(0) == "C"
        ) {
          setInvData((prevState) => [...prevState, d]);
        }
      });
    }
  }, [invtab, fromdate, todate, data]);

  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="invoicelist table-responsive">
      <table class="table table-borderless">
        <thead>
          <tr>
            <th scope="col">Invoices No. / CN</th>
            <th scope="col">Bill to</th>
            <th scope="col">Date</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {invdata?.slice(0, 5)?.map((inv) => (
            <tr>
              <th>{inv?.INV_BOOK}{inv?.INV_NO}</th>
              <th>{inv?.BILL_TO}</th>
              <th>{moment(inv?.INV_DATE).format("YYYY-MM-DD")}</th>
              <th>฿ {formatToCurrency(inv?.TOTAL)}</th>
              <th
                className={`${inv?.STATUS === "Paid" && "paidstatus"} ${
                  inv?.STATUS === "Unpaid" && "unpaidstatus"
                } ${inv?.STATUS === "Cancelled" && "canstatus"}`}
              >
                {inv?.STATUS}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Invoicelist;
