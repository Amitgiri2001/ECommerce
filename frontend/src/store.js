// use redux to store all the fetched data into one place
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer } from "./reducers/productReducer";
import {forgotPasswordReducer, profileReducer, userReducer} from "./reducers/userReducer"
import { cartReducer } from "./reducers/cartReducer";


const reducer=combineReducers({
    products:productReducer,
    productDetails:productDetailsReducer,
    user:userReducer,
    profile: profileReducer,
    forgotPassword:forgotPasswordReducer,
    cart:cartReducer,
    newReview:newReviewReducer,
    newProduct: newProductReducer,
    
});
let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};
const middleware=[thunk]
// create store
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );
  

export default store;
