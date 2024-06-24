import React from "react";
import { useDispatch } from "react-redux"; // Importing useDispatch hook from react-redux
import api from "../utils/UserApi"; // Importing API utility functions
import toast, { Toaster } from 'react-hot-toast'; // Importing toast notifications
import { decrease, increase, remove } from "../redux/feature/cartSlice"; // Importing Redux actions
import './CartItem.css'; // Import the CSS file for styling

const CartItem = ({ id, thumbnail, title, price, quantity, dispatch }) => {
  // const dispatch = useDispatch(); // Redux dispatcher

  // Function to handle decrementing quantity
  const handleDecrement = () => {
    console.log("handling dec")
    if (quantity > 0 && quantity <= 10) {
      // Update quantity in backend via API call
      api.put('items/cart', { id, username: localStorage.getItem('username'), quantity: quantity - 1 });
    }
    dispatch(decrease(id)); // Dispatch Redux action to decrease quantity
  };

  // Function to handle incrementing quantity
  const handleIncrement = () => {
    if (quantity > 0 && quantity < 10) {
      // Update quantity in backend via API call
      api.put('items/cart', { id, username: localStorage.getItem('username'), quantity: quantity + 1 });
    }
    dispatch(increase(id)); // Dispatch Redux action to increase quantity
  };

  // Function to handle deleting item from cart
  const handleDelete = () => {
    // Remove item from backend via API call
    api.put('items/cart', { id, username: localStorage.getItem('username'), quantity: 0 });
    dispatch(remove(id)); // Dispatch Redux action to remove item from cart
  };

  return (
    <>
      <Toaster /> {/* Toast notifications container */}
      <div className="cart-item-container">
        <div className="row cart-item-row">
          <div className="left-item-cont">
            <div className="col-sm-2 cart-item-thumbnail">
              <img
                src={thumbnail}
                className="img-fluid cart-item-image"
                alt=""
              />
            </div>
            <div className="col-sm-2 cart-item-details">
              <h5>{title}</h5>
              <div className="col-sm-8 cart-item-quantity">
                <h5 className="cart-item-price">${price}</h5>
                <div
                  className="fas fa-minus cart-item-chevron"
                  onClick={handleDecrement}
                ></div>
                <div className="cart-item-quantity-text">{quantity}</div>
                <div
                  className="fas fa-plus cart-item-chevron"
                  onClick={handleIncrement}
                ></div>
              </div>
            </div>
          </div>
          <div className="right-item-cont">
            <div className="total-price">${price * quantity}.00</div>
            <button className="deleteItem" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
