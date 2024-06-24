import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./CartItem";
import api from "../utils/UserApi";
import { setCartItems, getCartTotal, clearCart } from "../redux/feature/cartSlice";
import './CartContainer.css'; // Import the CSS file

const CartContainer = () => {
  const { totalAmount, items } = useSelector((state) => state.cart); // Select cart state from Redux store
  const dispatch = useDispatch(); // Redux dispatcher
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal open/close for checkout form
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false); // State to control order summary modal
  const [address, setAddress] = useState(''); // State for address input field
  const [email, setEmail] = useState(''); // State for email input field
  const [phone, setPhone] = useState(''); // State for phone number input field
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery'); // State for payment method selection
  const [checkNumber, setCheckNumber] = useState(''); // State for check number input field
  const [errors, setErrors] = useState({}); // State to store validation errors
  const [orderSummary, setOrderSummary] = useState(null); // State to store order summary details
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to disable the confirm order button after click

  // useEffect to fetch cart items from API when component mounts or items state changes
  useEffect(() => {
    if (localStorage.getItem('isFetched')==null || localStorage.getItem('isFetched')=="false") {
      try {
        // Fetch cart items from API if not already loaded
        api.get('items/cart').then((response) => {
          if (response) {
            dispatch(setCartItems({
              data: response.data["cart"]
            }));
          }
        });
      } catch (err) {
        console.log('Failed to get cart', err);
      }
    }
    // Update total cart amount in Redux store
    dispatch(getCartTotal());
  }, [items, dispatch]);

  // Function to validate form inputs
  const validate = () => {
    const errors = {};
    if (!address.trim()) {
      errors.address = "Address is required";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }
    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = "Phone number is invalid";
    }
    if (paymentMethod === 'Check' && !checkNumber.trim()) {
      errors.checkNumber = "Check number is required";
    }
    return errors;
  };

  // Function to handle checkout process
  const handleCheckout = async () => {
    const errors = validate(); // Validate form inputs
    if (Object.keys(errors).length === 0) { // If no validation errors
      setIsButtonDisabled(true); // Disable the button after click
      try {
        // Prepare payload for API request
        const payload = { 
          address, 
          email, 
          phone, 
          items, 
          paymentMethod: paymentMethod === 'Check' ? `Check: ${checkNumber}` : paymentMethod, 
          username: localStorage.getItem('username') 
        };
        // Post cart details to API for saving
        await api.post('items/cart/details', payload);
        // Post order details to API for placing order
        const response = await api.post('items/cart/order', payload);
        if (response.data.message === 'ok') {
          // Update order summary details if order placed successfully
          setOrderSummary({
            username: response.data.username,
            orderlist: response.data.orderlist,
            date: response.data.date,
            cartvalue: response.data.cartvalue,
            email: response.data.email,
            _id: response.data._id,
            paymentMethod: response.data.paymentMethod
          });
          setIsOrderSummaryOpen(true); // Open order summary modal
          setIsModalOpen(false); // Close checkout modal
        }
      } catch (error) {
        console.log('Checkout failed', error);
        setIsButtonDisabled(false); // Re-enable the button if checkout fails
      }
    } else {
      setErrors(errors); // Set validation errors
    }
  };

  // Function to close checkout modal and reset form fields
  const handleModalClose = () => {
    setIsModalOpen(false);
    setAddress('');
    setEmail('');
    setPhone('');
    setPaymentMethod('Cash on Delivery');
    setCheckNumber('');
    setErrors({});
  };

  // Function to close order summary modal and clear cart in Redux store
  const handleOrderSummaryClose = () => {
    setIsOrderSummaryOpen(false);
    setOrderSummary(null);
    dispatch(clearCart());
  };

  // Render empty cart message if no items in cart
  if (items.length === 0) {
    return (
      <>
        <h3 className="fs-bold" style={{ marginTop: "20px", textAlign: 'center' }}>
          Your Shopping <span className="shopping-icon"></span> is Empty
        </h3>
      </>
    );
  }

  // Render cart items and checkout button
  return (
    <div style={{ marginTop: '25px' }}>
      {items.map((item) => {
        return <CartItem key={item.id} {...item} dispatch={dispatch} />;
      })}
      <footer>
        <hr style={{ width: "70vw" }} />
        <div style={{ display: 'flex', width: "98vw", justifyContent: 'center' }}>
          <h4
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginLeft: "25px",
              width: "68vw"
            }}
          >
            Total <span>${totalAmount}.00</span>
          </h4>
        </div>
        <div className="checkout-container">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            Checkout
          </button>
        </div>
      </footer>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Checkout</h2>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <p className="error">{errors.address}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>
            {paymentMethod === 'Check' && (
              <div className="form-group">
                <label htmlFor="checkNumber">Check Number</label>
                <input
                  type="text"
                  id="checkNumber"
                  value={checkNumber}
                  onChange={(e) => setCheckNumber(e.target.value)}
                />
                {errors.checkNumber && <p className="error">{errors.checkNumber}</p>}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Check">Check</option>
              </select>
              <button className="btn btn-primary abs-btn" onClick={handleCheckout} disabled={isButtonDisabled}>
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {isOrderSummaryOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleOrderSummaryClose}>&times;</span>
            <h2>Order Summary</h2>
            <p>Order placed successfully!</p>
            <p><strong>Order ID: </strong>{orderSummary._id}</p>
            <p><strong>Username: </strong>{orderSummary.username}</p>
            <p><strong>Email: </strong>{orderSummary.email}</p>
            <p><strong>Date: </strong>{orderSummary.date}</p>
            <p><strong>Total Value: </strong>${orderSummary.cartvalue}.00</p>
            <p><strong>Payment Method: </strong>{orderSummary.paymentMethod}</p>
            <h3>Order List:</h3>
            <ul>
              {orderSummary.orderlist.map((item) => (
                <li key={item.id}>
                  {item.title} - ${item.price} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartContainer;
