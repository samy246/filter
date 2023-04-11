import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export default (
  <Route>
    <Route path="/login" />
    <Route path="/register" />
    <Route path="/changepassword" />
    <Route path="/blogs" />
    <Route path="/catalog" />
    <Route path="/catalog/:type?/:id" />
    <Route path="/:page/cdetails/:cid?/:pid/:sku" />
    <Route path="/product/:id" />
    <Route path="/searchpage/:searchstring/:id" />
    <Route path="/product/:categoryType/:subCategoryType" />
    <Route path="/:page/pdetails/:cid?/:pid/:sku" />
    <Route path="/myorder" />
    <Route path="/myorder/complaint/:complaintid" />
    <Route path="/myorder/:orderid" />
    <Route path="/review/:pname/:pid" />
    <Route path="/invoice/" />
    <Route path="/myfinance" />
    <Route path="/myfinance/mobileinvoice" />
    <Route path="/myfinance/billinginfo" />
    <Route path="/myfinance/invoicelist" />
    <Route path="/myfinance/paymenthistory" />
    <Route path="/myfinance/:pagetype" />
    <Route path="/historybill" />
    <Route path="/myaccount/:type" />
    <Route path="/myaccount/:success" />
    <Route path="/login" />
    <Route path="/register" />
    <Route path="/cartPage" />
    <Route path="/cartPage/OrdertoDelivery" />
    <Route path="/cartPage/payment" />
    <Route path="/cartPage/success" />
    <Route path="/wishlist" />
    <Route path="/" />
  </Route>
)
