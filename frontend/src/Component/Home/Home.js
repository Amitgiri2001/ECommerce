import React, { Fragment, useEffect } from "react";
import { FaMouse } from "react-icons/fa";
import "./Home.css";
// FOR TITLE of all pages
import MetaData from "../layout/MetaData";

import { getProduct } from "../../action/productAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader"

// temp Products
import Product from "./ProductCard";
// for alert
import { useAlert } from "react-alert"
import { CLEAR_ERRORS } from "../../constants/productConstants";
import {history} from "../../History"

// for slider
import Carousel from "react-material-ui-carousel";


function allProduct(params) {
    history.push("/products");
    window.location.reload()
}

const Home = () => {

    
    const alert = useAlert();

    const dispatch = useDispatch();


    // get products from store
    // using useSelected 
    const { loading, error, products } = useSelector(state => state.products);
    // let loading=true;
    // console.log(loading)

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(CLEAR_ERRORS);
        }
        dispatch(getProduct())
    }, [dispatch, error, alert]);


    return (
        <Fragment>
            {loading ? (<Loader />) : (
                <Fragment>
                    {/* set the title */}
                    <MetaData title="ECommerce" />
                    

                    {/* slider */}
                    <Carousel className="slider" animation="slide" interval={2000} cycleNavigation={true} stopAutoPlayOnHover={false}>
                    <div className="banner">
                        <p>Welcome to ECommerce</p>
                        <h1>FIND AMAZING PRODUCTS BELOW</h1>

                        <a href="#container">
                            <button>
                                Scroll <FaMouse />
                            </button>
                        </a>
                    </div>
                        <img
                            className="bg"

                            src="https://img.freepik.com/free-vector/online-shopping-concept-web-landing-page-digital-marketing-website-mobile-application_25819-695.jpg?size=626&ext=jpg&ga=GA1.2.1816845162.1654705009"
                            alt="slide"
                        />
                        <img
                            className="bg"

                            src="https://img.freepik.com/free-vector/online-shopping-isometric-concept-illustration_88138-435.jpg?size=626&ext=jpg&ga=GA1.2.1816845162.1654705009"
                            alt="slide"
                        />

                        {/* <div class="bg"></div> */}

                    </Carousel>

                    <h2 className="homeHeading">Featured Products</h2>

                    <div className="container" id="container">
                        {/* map all the products from the state */}
                        {
                            products && products.map(p =>
                                <Product product={p} />
                            )
                        }

                        {console.log(products)}
                    </div>
                    <div className="allProduct-btn-class">
                    <button className="allProduct-btn" onClick={allProduct}>All Products</button>
                    </div>
                </Fragment>
            )};

        </Fragment>


    );
};

// "https://i.ibb.co/DRST11n/1.webp"
export default Home;