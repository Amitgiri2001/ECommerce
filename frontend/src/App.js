import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Component/layout/Header/Header.js";
// import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useRouteMatch,
  Redirect
} from "react-router-dom";
import WebFont from "webfontloader";
import Footer from "./Component/layout/Footer/Footer";
import Home from "./Component/Home/Home.js";
import Loader from "./Component/layout/Loader/Loader";
import ProductDetails from "./Component/Product/ProductDetails.js";
import Products from "./Component/Product/Products.js";
import Search from "./Component/Product/Search";
import {history} from "./History"
import LoginSignUp from "./Component/User/LoginSingnUp";
import store from "./store"
import { loadUser } from "./action/userAction";
import { useSelector } from "react-redux";
import UserOptions from "./Component/layout/Header/UserOptions.js"
import Profile from "./Component/User/Profile";
import UpdateProfile from "./Component/User/UpdateProfile.js"
import UpdatePassword from "./Component/User/UpdatePassword.js"
import ForgotPassword from "./Component/User/ForgotPassword.js"
import Cart from "./Component/Cart/Cart.js";
import Shipping from "./Component/Cart/Shipping.js";
import ConfirmOrder from "./Component/Cart/ConfirmOrder.js";
import Payment from "./Component/Cart/Payment";

import NewProduct from "./Component/Admin/NewProduct";
import Success from "./Component/Cart/Success";
function App() {
  // for google fonts

  const {isAuthenticated,user,loading}=useSelector(state=>state.user)
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());
  }, []);
  return (
    <Router history={history}>
      {/* Header Component */}
      <Header />
      {isAuthenticated && <UserOptions user={user}/>}
      <Routes >
        {/* Routing */}
        <Route  exact path="/" element={<Home />}></Route>
        <Route exact path="/product/:id" element={<ProductDetails />}></Route>
        {/* get all products */}
        <Route exact path="/products" element={<Products />}></Route>
        {/* for filters */}
        <Route exact path="/login" element={<LoginSignUp />}></Route>
        <Route exact path="/search" element={<Search />}></Route>
        {/* user profile */}
        {/* first check if loading or not -> then check if user is authenticated or not */}
        
        <Route exact path="/account" element={isAuthenticated ? <Profile /> : <LoginSignUp /> }></Route>

        <Route exact path="/password/update" element={isAuthenticated ? <UpdatePassword /> : <LoginSignUp /> }></Route>

        <Route exact path="/password/forgot" element={ <ForgotPassword /> }></Route>

        {/* update profile */}
        <Route exact path="/me/update" element={isAuthenticated ? <UpdateProfile /> : <LoginSignUp /> }></Route>


        <Route path="/products/:keyword" element={<Products />}></Route>

        <Route path="/cart" element={<Cart />}></Route>

        {/* shipping */}
        <Route exact path="/shipping" element={isAuthenticated ? <Shipping /> : <LoginSignUp /> }></Route>

        <Route exact path="/order/confirm" element={isAuthenticated ? <ConfirmOrder /> : <LoginSignUp /> }></Route>
        
        <Route exact path="/process/payment" element={isAuthenticated ? <Payment /> : <LoginSignUp /> }></Route>
        {/* success page */}
        <Route exact path="/process/payment/success" element={isAuthenticated ? <Success /> : <LoginSignUp /> }></Route>
        
        <Route exact path="/admin/dashboard" element={isAuthenticated ? <NewProduct /> : <LoginSignUp /> }></Route>
        {/* <Route exact path="/load" element={<Loader />}></Route> */}
        
      </Routes>
      {/* Footer component */}
      <Footer />
    </Router>
  );
}

export default App;
