import React from 'react'
import {ReactNavbar} from "overlay-navbar";
import logo from "../../../images/logo.png";
import SearchIconElement from '@mui/icons-material/SearchOutlined';
import cartIconElement from "../../../images/search.png"

const options = {
 
  
  burgerColorHover: "#eb4034",
  logo,
  logoWidth: "20vmax",
  navColor1: "white",
  logoHoverSize: "10px",
  logoHoverColor: "#eb4034",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: <SearchIconElement />,
  link4Text: "Login/SignUp",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/search",
  link4Url: "/login",
  link1Size: "1.3vmax",
  link1Color: "rgba(35, 35, 35,0.8)",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "#eb4034",
  link1Margin: "1vmax",
  
};

const Header = () => {
  return <ReactNavbar  cartIconElement={<SearchIconElement />} {...options} />;
};

export default Header