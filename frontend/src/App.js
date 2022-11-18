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


function App() {
  // for google fonts
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
  }, []);
  return (
    <Router history={history}>
      {/* Header Component */}
      <Header />
      <Routes >
        {/* Routing */}
        <Route  exact path="/" element={<Home />}></Route>
        <Route exact path="/product/:id" element={<ProductDetails />}></Route>
        {/* get all products */}
        <Route exact path="/products" element={<Products />}></Route>
        {/* for filters */}
        <Route exact path="/login" element={<LoginSignUp />}></Route>
        <Route exact path="/search" element={<Search />}></Route>
        <Route path="/products/:keyword" element={<Products />}></Route>
        {/* <Route exact path="/load" element={<Loader />}></Route> */}
        
      </Routes>
      {/* Footer component */}
      <Footer />
    </Router>
  );
}

export default App;
