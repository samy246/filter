import React, { useState, useEffect, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import "./App.scss";
import { useStateValue } from "./store/state";
import { ToastContainer } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import request from "./request";
import ChangePassword from "./pages/changePassword/ChangePassword";
const Header = lazy(() => import("./pages/Header/Header"));
const Footer = lazy(() => import("./pages/Footer/Footer"));
const Home = lazy(() => import("./pages/Home/Home"));
const CatalogPage = lazy(() => import("./pages/CatalogPage/CatalogPage"));
const RegisterSltB2B = lazy(() => import("./components/RegisterComponents/RegisterSltB2B/RegisterSltB2B"));
const CatalogCardDetails = lazy(() => import("./components/CatalogComponents/CatalogCardDetails/CatalogCardDetails"));
const Product = lazy(() => import("./pages/Product/Product"));
const PDP = lazy(() => import("./pages/PDP/PDP"));
const CartPage = lazy(() => import("./pages/CartPage/CartPage"));
const Seafoods = lazy(() => import("./components/CatalogMyNav/caatlog_seaFood/Cataalog_SeaFood"));
const Order = lazy(() => import("./pages/OrderModule/Order/Order"));
const OrderStatus = lazy(() => import("./pages/OrderModule/OrderStatus/OrderStatus"));
const OrdertoDelivery = lazy(() => import("./components/CartComponents/OrdertoDelivery/OrdertoDelivery"));
const CartPayment = lazy(() => import("./components/CartComponents/CartPayment/CartPayment"));
const OrderSuccess = lazy(() => import("./components/CartComponents/OrderSuccess/OrderSuccess"));
const Finance = lazy(() => import("./pages/Finance/Finance"));
const WishlistPage = lazy(() => import("./pages/WishlistPage/WishlistPage"));
const Account = lazy(() => import("./pages/AccountModule/Account/Account"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Blogs = lazy(() => import("./pages/Blogs/Blogs"));
const RegisterPage = lazy(() => import("./pages/RegisterPage/RegisterPage"));
const ScrollToButton = lazy(() => import("./components/ScrollButton/ScrollButton"));
const ScrolltoTop = lazy(() => import("./components/ScrollButton/ScrollToTop"));
const Invoice = lazy(() => import("./components/Order/Summary/Invoice/Invoice"));
const MobileReview = lazy(() => import("./pages/OrderModule/MobileReview/MobileReview"));
const PaymentCollection = lazy(() => import("./pages/Finance/PaymentCollection/PaymentCollection"));
const Billinginfo = lazy(() => import("./pages/Finance/InvoiceList/InvoiceList"));
const InvoiceList = lazy(() => import("./pages/Finance/InvoiceList/InvoiceList"));
const MobInvoice = lazy(() => import("./pages/Finance/InvoiceList/MobInvoice/MobInvoice"));
const PaymentHistory = lazy(() => import("./pages/Finance/PaymentHistory/PaymentHistory"));
const Maintenance = lazy(() => import("./pages/Maintenance/Maintenance"));
const Complaint = lazy(() => import("./pages/OrderModule/Complaint/Complaint"));
const SearchPage = lazy(() => import("./pages/SearchPage/SearchPage"));
const Cookie = lazy(() => import("./pages/CMS/Cookie/Cookie"));
const About = lazy(() => import("./pages/CMS/AboutUS/About"));
const Return = lazy(() => import("./pages/CMS/Return/Return"));


function App() {
  const [token, setToken] = useState();
  const [currentuser, setCurrentUser] = useState();
  const [maintenance, setMaintenance] = useState(false);
  const [{}, dispatch] = useStateValue();

  useEffect(async () => {
    try {
      const maintresult = await axios({
        method: "get",
        url: request.maintenance,
      });
      if (maintresult.data[0].success) {
        setMaintenance(false);
      }
    } catch (e) {
      setMaintenance(true);
    }
  }, [window.location.href]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    dispatch({
      type: "SET_USER",
      user: localStorage.getItem("user"),
    });
    setCurrentUser(localStorage.getItem("username"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("token")]);

  return (
    <div className="app">
      {maintenance ? (
        <Router>
          <Switch>
            <Route path="/">
              <Header homepage={"homepage"} token={token} user={currentuser} />
              <Maintenance />
              <Footer />
            </Route>
          </Switch>
        </Router>
      ) : (
        <Router>
          <ScrolltoTop />
          <Switch>
            <Route path="/login" component={LoginPage} exact />
            <Route path="/register" component={RegisterPage} exact />

            {/* HomePage */}
            <Route path="/" exact>
              <Header homepage={"homepage"} token={token} user={currentuser} />
              <Home token={token} />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* ChangePassword */}
            <Route path="/changepassword" exact>
              <Header token={token} user={currentuser} />
              <ChangePassword token={token} />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* Blogs */}
            <Route path="/blogs" exact>
              <Header token={token} user={currentuser} />
              <Blogs />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* catalog Home*/}
            <Route path="/catalog" exact>
              <Header catalog={"catalog"} token={token} user={currentuser} />
              <CatalogPage />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* catalog plp */}
            <Route path="/catalog/:subCat?/:id" exact>
              <Header catalog={"catalog"} token={token} user={currentuser} />
              <Seafoods />
              <ScrollToButton />
              <Footer />
            </Route>

            {/* catalog pdp page */}
            <Route path="/:page/cdetails/:cid?/:pid/:sku" exact>
              <Header catalog={"catalog"} token={token} user={currentuser} />
              <CatalogCardDetails />
              <ScrollToButton />
              <Footer />
            </Route>

            {/* product-plp lvl1*/}
            <Route path="/product/:id" exact>
              <Header product={"product"} token={token} user={currentuser} />
              <Product token={token} />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* searchpage */}
            <Route path="/searchpage/:searchstring/:id" exact>
              <Header token={token} user={currentuser} />
              <SearchPage />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* product-plp lvl2 */}
            <Route path="/product/:categoryType/:subCategoryType" exact>
              <Header product={"product"} token={token} user={currentuser} />
              <Product token={token} />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* product-pdp page */}
            <Route path="/:page/pdetails/:cid?/:pid/:sku" exact>
              <Header product={"product"} token={token} user={currentuser} />
              <PDP />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* orderpage */}
            <Route path="/myorder" exact>
              <Header token={token} user={currentuser} />
              <Order token={token} />
              {window.innerWidth > 580 && <Footer />}
              <ScrollToButton />
            </Route>

            {/* Order - Complaint */}
            <Route path="/myorder/complaint/:complaintid" exact>
              <Header token={token} user={currentuser} />
              <Complaint token={token} />
              <ScrollToButton />
            </Route>

            {/* orderstatus */}
            <Route path="/myorder/:orderid" exact>
              <Header token={token} user={currentuser} />
              <OrderStatus token={token} />
              <ScrollToButton />
            </Route>

            {/* order mobile create review */}
            <Route path="/review/:pname/:pid" exact>
              <Header token={token} user={currentuser} />
              <MobileReview token={token} />
              <ScrollToButton />
            </Route>

            {/* Invoice */}
            <Route path="/invoice/" exact>
              <Invoice />
            </Route>

            {/* finance */}
            <Route path="/myfinance" exact>
              <Header token={token} user={currentuser} />
              <Finance token={token} />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* finance page - Mobile Invoice */}
            <Route path="/myfinance/mobileinvoice" exact>
              <Header token={token} user={currentuser} />
              <MobInvoice />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* finance page - billininfo */}
            <Route path="/myfinance/billinginfo" exact>
              <Header token={token} user={currentuser} />
              <Billinginfo token={token} />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* finance page - billininfo */}
            <Route path="/myfinance/invoicelist" exact>
              <Header token={token} user={currentuser} />
              <InvoiceList token={token} />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* finance page - payment history */}
            <Route path="/myfinance/paymenthistory" exact>
              <Header token={token} user={currentuser} />
              <PaymentHistory token={token} />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* finance page - payment collection */}
            <Route path="/myfinance/:pagetype" exact>
              <Header token={token} user={currentuser} />
              <PaymentCollection token={token} />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* Account Page */}
            <Route path="/myaccount/:type" exact>
              <Header token={token} user={currentuser} />
              <Account token={token} />
              <Footer />
              <ScrollToButton />
            </Route>

            {/* Success Page */}
            <Route path="/myaccount/:success" exact>
              <Header token={token} user={currentuser} />
              <Account token={token} />
              <Footer />
              <ScrollToButton />
            </Route>

            <Route path="/login" component={LoginPage} exact />
            {/* register */}
            <Route path="/register" component={RegisterSltB2B} exact />

            {/* Cart */}
            <Route path="/cartPage" exact>
              <Header token={token} user={currentuser} />
              <CartPage />
              <ScrollToButton />
              <Footer />
            </Route>

            <Route path="/cartPage/OrdertoDelivery">
              <Header token={token} user={currentuser} />
              <OrdertoDelivery />
              <ScrollToButton />
              <Footer />
            </Route>

            <Route path="/cartPage/payment">
              <Header token={token} user={currentuser} />
              <CartPayment />
              <ScrollToButton />
              <Footer />
            </Route>

            <Route path="/cartPage/success">
              <Header token={token} user={currentuser} />
              <OrderSuccess />
              <Footer />
            </Route>

            <Route path="/wishlistfav">
              <Header token={token} user={currentuser} />
              <WishlistPage token={token} />
              <ScrollToButton />
              <Footer />
            </Route>

            <Route path="/cookies">
              <Header token={token} user={currentuser} />
              <Cookie />
              <ScrollToButton />
              <Footer />
            </Route>

            <Route path="/about">
              <Header token={token} user={currentuser} />
              <About />
              <ScrollToButton />
              <Footer />
            </Route>

            <Route path="/return">
              <Header token={token} user={currentuser} />
              <Return />
              <ScrollToButton />
              <Footer />
            </Route>

            {/* <Route path="/sitemap" component={Sitemap} /> */}

            <Route>
              <Header token={token} user={currentuser} />
              <NotFound />
              <Footer />
            </Route>
            
          </Switch>
          <ToastContainer />
        </Router>
      )}
    </div>
  );
}

export default App;
