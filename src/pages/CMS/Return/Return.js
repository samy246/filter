import React from 'react'
import "./Return.scss"
import { useHistory } from 'react-router-dom';

function Return() {
    const history = useHistory()
  return (
    <div className='return'>
        <span className='return__goback' onClick={() => history.goBack()}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-x"
                viewBox="0 0 16 16"
                >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
        </span>
        <h3 className='return__title'>Return & Refund Policy</h3>
        <ul>
            <li>Order Cancellation Policy</li>
            <p>
                Stock items: 
                <span>
                    -  Monday to Friday (excluding Holidays)
                    Orders made before 6:00 PM can be requested to cancel within 6:15 PM on the same day.
                    Orders made after 6:00 PM can be requested to cancel within 6:15 PM on the next day. 
                </span>
                <span>
                    -  Saturday
                    Orders made before 12:00 PM can be requested to cancel within 12:15 PM on the same day.
                    Orders made after 12:00 PM can be requested to cancel within 6:15 PM on the next Monday.
                </span>
                <span>
                    -  Sunday
                    Orders made during Sunday can be requested to cancel within 6:15 PM on the next Monday.
                </span>
                <span>
                    Please note that change or cancellation of the Customer’s order may not be accepted in certain cases.
                </span>
            </p>
            <p>
                Pre-order items: 
                <span>
                    The order cannot be canceled after the order has been processed and invoice has been generated.
                </span>
            </p>

            <li>Return Policy</li>
            <p>
                <span>
                    -       Live product
                    Please inspect the product upon delivery by our drivers and customers can refuse the defective products immediately. The company won't accept any returns after the delivery is completed.
                </span>
                <span>
                    -       Fresh (Chilled) product
                    In case of any product quality issue, customers can request to return goods within 12 hours after delivery is completed. Such cases will be investigated within 1-2 working days after the company receives the product successfully.
                </span>
                <span>
                    -       Frozen and other product
                    In case of any product quality issue, customers can request to return goods within 48 hours after delivery is completed. Such cases will be investigated within 3-5 working days after the company receives the product successfully.
                </span>
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Product Type</th>
                        <th>Eligible Period for return</th>
                        <th>Logistic Pickup Period for returned products</th>
                        <th>Investigation Period after receiving the returned product</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Live Product</td>
                        <td>Instantly when the delivery occurs</td>
                        <td>Upon Delivery</td>
                        <td>Upon Delivery</td>
                    </tr>
                    <tr>
                        <td>Fresh (Chilled) Product</td>
                        <td>12 hours after delivered</td>
                        <td>1-3 working days</td>
                        <td>1-2 working days</td>
                    </tr>
                    <tr>
                        <td>Frozen and others</td>
                        <td>48 hours after delivered</td>
                        <td>1-3 working days</td>
                        <td>3-5 working days</td>
                    </tr>
                </tbody>
            </table>

            <p>
                Important: Returned products must be stored and kept under the proper condition (eg. suitable temperature, compatible environment) at all times including the original packaging. All tags should be intact. Otherwise, our logistics could refuse to take the products back and the refund process could be affected.
            </p>

            <li>
                Refund Policy
            </li>
            <p>
                <span>
                    Please note: full payment is required for the order with partial return, the company will refund accordingly for returned product.
                </span>
                <span>
                    -       For order under credit terms
                    The company will refund by issuing a credit note which can be used as payment deduction for next billing, processing time will be aligned with the agreed billing cycle of each customer.
                </span>
                <span>
                    -       For order paid with cash/QR payment ( via QR code)
                    The company will refund by issuing a cash check,  processing time will take about 7-15 working days.
                </span>
                <span>
                    -       For order with credit card payment
                    Details will be updated soon
                </span>
            </p>

            <table>
                <thead>
                    <tr>
                        <th>Payment Type</th>
                        <th>How to refund</th>
                        <th>Period</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Customer with credit terms</td>
                        <td>Credit note</td>
                        <td>Align with billing cycle</td>
                    </tr>
                    <tr>
                        <td>Paid by cash/QR payment</td>
                        <td>Cash check</td>
                        <td>7-15 working days</td>
                    </tr>
                    <tr>
                        <td>Credit Card</td>
                        <td>will soon be updated</td>
                    </tr>
                </tbody>
            </table>
        </ul>
    </div>
  )
}

export default Return