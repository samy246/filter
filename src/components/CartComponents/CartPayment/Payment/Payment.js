import React from "react";
import "./Payment.scss";
import QR from "../../../../assets/images/cart/qrcode.svg";
import { useParams } from "react-router";

function Payment({
  ctype,
  credit,
  summary,
  showacc,
  generateQR,
  setpaytype,
  setshowacc,
  paycollectdata
}) {
  const { pagetype } = useParams();
  function formatToCurrency(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div>
      <div className="invoicepayment__list">
        {pagetype === "paymentcollection" && (
          <div className="list">
            <div className="list__top">
              <p>
                <span className="label">Billing ID:</span>
                <span className="value">{paycollectdata?.BILL_NO}</span>
              </p>
              <p>
                <span className="label">PO Number :</span>
                <span className="value">726876</span>
              </p>
            </div>
            <div className="list__bottom">
              <span>Invioces ({paycollectdata?.INVOICES?.length})</span>
              <ul>
                {paycollectdata?.INVOICES?.map((inv) => (
                  <li>{inv?.INV_BOOK}{inv?.INV_NO}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="cartpayment__text text-center">
        <h3>Confirm transaction</h3>
        <p>
          Select payment method
          <span>(Fee Included)</span>
        </p>
      </div>
      <div className="cartpayment__options">
        {ctype != 1 && (
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              onClick={() => setpaytype("creditpayment")}
              onKeyDown={(event) => {
                event.preventDefault();
              }}
            />
            <label class="form-check-label" for="flexRadioDefault1">
              <div className="options__credit">
                <div className="credit__left">
                  <h4 className="options__pay">Pay by Credit</h4>
                  <h4 className="options__term">
                    Credit Term: <span>{credit?.CREDIT_TERM}</span>
                  </h4>
                </div>
                <div className="credit__right">
                  <h4 className="options__date">
                    <span style={{ width: "max-content" }}>Payment Date: </span>
                    <span>{credit?.NEXT_DUE_DATE}</span>
                  </h4>
                  <h4 className="options__amount">
                    Amount: {pagetype === "paymentcollection"
                    ? 
                      <span>฿ {formatToCurrency(paycollectdata?.TOTAL)}</span>
                    :
                      <span>฿ {formatToCurrency(summary?.total)}</span>
                    }
                  </h4>
                </div>
              </div>
            </label>
          </div>
        )}
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault2"
            onClick={() => setpaytype("cashondelivery")}
            onKeyDown={(event) => {
              event.preventDefault();
            }}
          />
          <label class="form-check-label" for="flexRadioDefault2">
            <div className="options__credit">
              <div className="credit__left">
                <h4 className="options__pay">Pay by Cash on Delivery</h4>
                <h4 className="options__term">
                  Cash will be paid on the date of delivery.
                </h4>
              </div>
              <div className="credit__right">
                <h4 className="options__date">
                  {/* <span style={{ width: "max-content" }}>Payment Date: </span>
            <span>{credit?.NEXT_DUE_DATE}</span> */}
                </h4>
                <h4 className="options__amount">
                  Amount: {pagetype === "paymentcollection"
                  ? 
                    <span>฿ {formatToCurrency(paycollectdata?.TOTAL)}</span>
                  :
                    <span>฿ {formatToCurrency(summary?.total)}</span>
                  }
                </h4>
              </div>
            </div>
          </label>
        </div>
        {ctype != 1 && (
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault3"
              onClick={() => setpaytype("QR")}
              onKeyDown={(event) => {
                event.preventDefault();
              }}
            />
            <label class="form-check-label" for="flexRadioDefault3">
              <div
                className="options__credit"
                style={{ alignItems: "flex-start" }}
              >
                <div className="credit__left">
                  <h4 className="options__pay">
                    <div class="accordion" id="accordionExample">
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                          <button
                            class={`accordion-button ${showacc || "collapsed"}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                            onClick={() => setshowacc(!showacc)}
                            aria-label="optionpay"
                          >
                            Pay by QR Code
                          </button>
                        </h2>
                        <div
                          id="collapseOne"
                          class={`accordion-collapse collapse ${
                            showacc && "show"
                          }`}
                          aria-labelledby="headingOne"
                          data-bs-parent="#accordionExample"
                        >
                          <div class="accordion-body">
                            <p>test</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </h4>
                </div>
                <div className="credit__right" style={{ paddingTop: "10px" }}>
                  <h4 className="options__date">
                    <img className="qrimage" src={QR} alt="" />{" "}
                    <p className="credit__QR" onClick={generateQR}>
                      Generate QR Code
                    </p>
                  </h4>
                </div>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
