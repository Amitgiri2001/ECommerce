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

// for slider
import Carousel from "react-material-ui-carousel";


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

                            src="https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=1600"
                            alt="slide"
                        />
                        <img
                            className="bg"

                            src="https://images.pexels.com/photos/4050345/pexels-photo-4050345.jpeg?auto=compress&cs=tinysrgb&w=1600"
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
                </Fragment>
            )};

        </Fragment>


    );
};

// "https://i.ibb.co/DRST11n/1.webp"
export default Home;