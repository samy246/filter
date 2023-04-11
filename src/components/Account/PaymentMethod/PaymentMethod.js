import React, { useState, useEffect } from "react";
import "./PaymentMethod.scss";
import creditCard from "../../../assets/images/Finance/credit-card.png";
import NewCardForm from "../../Finance/NewCardForm/NewCardForm";

function PaymentMethod({ currentpage, handleNewPage }) {
  const cardCount = [
    {
      label: "Card1",
      value: "Card1",
      bankname: "test1",
      cardnumber: 139752317896,
      holdername: "test1",
      month: 5,
      year: 2022,
      csv: 520,
    },
    {
      label: "Card2",
      value: "Card2",
      bankname: "test2",
      cardnumber: 864432869944,
      holdername: "test2",
      month: 8,
      year: 2021,
      csv: 913,
    },
    {
      label: "Card3",
      value: "Card3",
      bankname: "test3",
      cardnumber: 993344521698,
      holdername: "test3",
      month: 8,
      year: 2021,
      csv: 913,
    },
    {
      label: "Card4",
      value: "Card4",
      bankname: "test4",
      cardnumber: 125698763419,
      holdername: "test4",
      month: 8,
      year: 2021,
      csv: 913,
    },
  ];

  const [currentcard, setcurrentcard] = useState();
  const [activeindex, setActiveIndex] = useState(null);
  const [enable, setenable] = useState(false);

  const enableStatus = () => {
    setenable(!enable);
  };

  useEffect(() => {
    cardselect(0, cardCount[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardselect = (i, card) => {
    setActiveIndex(i);
    setcurrentcard(card);
  };


  const underconst = false;

  return (
    <div className="paymentmethod">
      {underconst ? !currentpage ? (
        <>
          <div className="paymentmethod__title">
            <h4>Bank Account/Card</h4>
            <p onClick={handleNewPage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus-lg"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
              </svg>
              <span className="paymentmethod__addbutton">Card</span>
            </p>
          </div>
          <div className="paymentmethod__tab">
            {cardCount?.map((card, i) => (
              <p
                key={i}
                className={`paymentmethod__cards ${
                  activeindex === i && "cardSelected"
                }`}
                onClick={() => cardselect(i, card)}
              >
                {card.label}
              </p>
            ))}
          </div>
          <div className="paymentmethod__cardInfo">
            <img src={creditCard} alt="" />
            <div className="form-check form-switch">
              <label className="form-check-label" for="flexSwitchCheckChecked">
                {enable ? "Enable" : "Disable"}
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckChecked"
                checked={enable}
                onChange={enableStatus}
              />
            </div>
          </div>
          <div className="paymentmethod__cardform">
            <NewCardForm form1={!currentpage} data={currentcard} />
          </div>
        </>
      ) : (
        <>
          <div className="paymentmethod_newcard">
            <NewCardForm form1={!currentpage} />
          </div>
        </>
      )
      : 
        <h3 style={{
          color: "#37bfa7", textAlign: "center", border: "none"
        }}>Under Construction</h3>
      }
      
    </div>
  );
}

export default PaymentMethod;
