import React, { useState } from "react";
import "./NewCardForm.scss";
import visa from "../../../assets/images/Finance/visa.png";
import { Modal } from "react-responsive-modal";
import visaa from "../../../assets/images/Finance/visaa.png";
import Aexpress from "../../../assets/images/Finance/Aexpress.png";
import jcb from "../../../assets/images/Finance/jcb.png";
import unionpay from "../../../assets/images/Finance/unionpay.png";
import mastero from "../../../assets/images/Finance/mastero.png";
import { useHistory } from "react-router-dom";
import InputMask from "react-input-mask";

function NewCardForm({ form1, data }) {
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const cardImages = [
    { img: visaa },
    { img: mastero },
    { img: Aexpress },
    { img: jcb },
    { img: unionpay },
  ];

  const [intialcardvalues, setIntialcardvalues] = useState({
    bankname: "",
    cardnumber: "",
    holdername: "",
    csv: "",
    month: "month",
    year: "year",
  });
  const inputsHandler = (e) => {
    setIntialcardvalues({
      ...intialcardvalues,
      [e.target.name]: e.target.value,
    });
  };

  const CardcanBeSaved = () => {
    const { bankname, cardnumber, holdername, csv, month, year } =
      intialcardvalues;
    return (
      csv.length > 0 &&
      bankname.length > 0 &&
      cardnumber.length > 0 &&
      holdername.length > 0 &&
      month !== "month" &&
      year !== "year"
    );
  };
  const limitCheck = (e) => {
    if (intialcardvalues.csv.length > 2) {
      e.preventDefault();
    }
  };
  const isEnabled = CardcanBeSaved();
  // ends here
  const submithandler = (e) => {
    e.preventDefault();
    history.push("/myaccount/cardadded");
  };
  return (
    <div className="newcardform">
      <div className="newcardform__creditCardDetails">
        <h6>Credit Card Details</h6>
        <form onSubmit={submithandler}>
          <div className="newcardform__creditcardInput">
            <p>
              <h6>Bank Name</h6>
              <input
                type="text"
                placeholder="Bank Name"
                value={data ? data.bankname : intialcardvalues.bankname}
                name="bankname"
                onChange={inputsHandler}
              />
            </p>
            <p>
              <h6>Credit Card Number</h6>
              <div className="newcardform__cardnumber">
                <InputMask
                  mask="9999-9999-9999"
                  maskChar={null}
                  placeholder="Credit Card Number"
                  value={data ? data.cardnumber : intialcardvalues.cardnumber}
                  name="cardnumber"
                  onChange={inputsHandler}
                />

                <img src={visa} alt="" />
              </div>
              {!form1 ? (
                <div className="newcardform__cardtypes">
                  {cardImages.map((card, i) => (
                    <img src={card.img} alt="" key={i} />
                  ))}
                </div>
              ) : (
                ""
              )}
            </p>
            <p>
              <h6>Card Holder Name</h6>
              <input
                type="text"
                placeholder="Card Holder Name"
                value={data ? data.holdername : intialcardvalues.holdername}
                name="holdername"
                onChange={inputsHandler}
              />
            </p>
            <p className="newcardform__expiry">
              <p>
                <h6>Expiry Date</h6>
                <div>
                  <select
                    className="form-select"
                    name="month"
                    value={intialcardvalues.month}
                    onChange={inputsHandler}
                  >
                    <option value="month">MM</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="1">4</option>
                    <option value="2">5</option>
                    <option value="3">6</option>
                    <option value="1">7</option>
                    <option value="2">8</option>
                    <option value="3">9</option>
                    <option value="1">10</option>
                    <option value="2">11</option>
                    <option value="3">12</option>
                  </select>
                  <select
                    className="form-select"
                    name="year"
                    value={intialcardvalues.year}
                    onChange={inputsHandler}
                  >
                    <option value="year">YY</option>
                    <option value="1">2021</option>
                    <option value="2">2022</option>
                    <option value="3">2033</option>
                  </select>
                </div>
              </p>
              <p className="newcardform__csv">
                <h6>CSV</h6>
                <div className="newcardform__csvnumber">
                  <input
                    type="number"
                    name="csv"
                    min="0"
                    onKeyPress={limitCheck}
                    value={data ? data.csv : intialcardvalues.csv}
                    onChange={inputsHandler}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-exclamation-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                  </svg>
                </div>
              </p>
            </p>
          </div>
          <label>
            <input type="checkbox" className="form-check-input" />
            Save this card for future trasactions
          </label>
          <div className="newcardform__transactionDetails">
            <h6>Transaction Details</h6>
            <p className="newcardform__description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniamLorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam
            </p>
            <strong>The Privacy policy for this app</strong>
            {form1 ? (
              <p className="newcardform__delete">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                  <path
                    fillRule="evenodd"
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                  />
                </svg>
                <span onClick={() => setOpen(true)}>Delete</span>
                <Modal
                  open={open}
                  onClose={() => setOpen(false)}
                  center
                  classNames={{
                    overlay: "customOverlay",
                    modal: "paymentModal",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="96"
                    height="96"
                    fill="currentColor"
                    className="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                    <path
                      fillRule="evenodd"
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                    />
                  </svg>
                  <h4>Remove this Card ?</h4>
                  <p className="conform__text">
                    Sure you want to remove this card.
                  </p>
                  <p
                    onClick={() => setOpen(false)}
                    className="newcardform__modalremove"
                  >
                    Remove
                  </p>
                  <p
                    onClick={() => setOpen(false)}
                    className="newcardform__modalcancel"
                  >
                    Cancel
                  </p>
                </Modal>
              </p>
            ) : (
              <div className="paymentmethod_button">
                <p className="paymentmethod_cancel">Cancel</p>
                <button
                  type="submit"
                  className="paymentmethod_save"
                  disabled={!isEnabled}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewCardForm;
