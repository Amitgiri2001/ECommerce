import React,{useState} from 'react';
// for get the id of the element
import { useParams } from "react-router-dom";
import MetaData from "../../Component/layout/MetaData"
import Loader from "../../Component/layout/Loader/Loader"
// for stars
import  Rating  from 'react-rating-stars-component';
import { Fragment,useEffect } from 'react'
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";

// for get the products from the store
import {useDispatch,useSelector} from "react-redux";

import {getProductDetails} from "../../action/productAction";

// ReviewCard
import ReviewCard from "./ReviewCard.js"

// for handling error
import {useAlert} from "react-alert"
import { CLEAR_ERRORS } from '../../constants/productConstants';
import { addItemsToCart } from '../../action/cartAction';
import { history } from '../../History';



const ProductDetails = () => {

  
  const alert=useAlert();
    const dispatch=useDispatch();
    const {product,loading,error} =useSelector(state=>state.productDetails);
    
    const [quantity,setQuantity]=useState(1)

    function increaseQuantity(params) {
      // quantity must be lesser than stock
      if(product.stock<=quantity)return;
      setQuantity(quantity+1);
    }
    function decreaseQuantity(params) {
      if(quantity<=1)return;
      setQuantity(quantity-1);
    }


    const params = useParams();
    console.log("id: "+params.id);
    
    useEffect(() => {
      if(error){
        alert.error(error);
        dispatch(CLEAR_ERRORS);
      }
      dispatch(getProductDetails(params.id))
    }, [dispatch,params.id])
    

    const addToCartHandler = () => {
      dispatch(addItemsToCart(params.id, quantity));
      alert.success("Item Added To Cart");
      history.push("/cart");
      window.location.reload();
    };

    // options for stars
    const options = {
      edit: false,
      color: "rgba(20,20,20,0.1)",
      activeColor:"tomato",
      size:window.innerWidth>600 ? 25:20,
      value:product.ratings,
      isHalf:true,
    };

    


  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className="ProductDetails">
            <div className='custom-sty'>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity} >+</button>
                  </div>
                  <button
                    disabled={product.Stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button className="submitReview">
                Submit Review
              </button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          {/* <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog> */}

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

export default ProductDetails