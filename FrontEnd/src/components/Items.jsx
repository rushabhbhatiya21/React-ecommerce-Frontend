import React, { useEffect, useState } from 'react';
import api, { getItems } from '../utils/UserApi'; // Import the API functions
import toast, { Toaster } from 'react-hot-toast'; // Import toast notifications
import './Items.css'; // Import the CSS file for styling
import { useSelector, useDispatch } from 'react-redux'; // Import Redux hooks
import { setCartItems, getCartTotal, addToCart } from '../redux/feature/cartSlice'; // Import Redux actions

const Items = () => {
  const [items, setItems] = useState([]); // State for storing items from API
  const [selectedItem, setSelectedItem] = useState(null); // State for selected item in detail view
  const [quantity, setQuantity] = useState(1); // State for selected quantity of items
  const { items: cartItems } = useSelector((state) => state.cart); // Select cart items from Redux store
  const dispatch = useDispatch(); // Redux dispatch function

  // Effect to fetch cart items and total on component mount or when cartItems changes
  useEffect(() => {
    if (cartItems.length <= 0) {
      try {
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
    dispatch(getCartTotal());
  }, [cartItems, dispatch]);

  // Function to render star ratings based on item rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star">&#9733;</span>);
      } else {
        stars.push(<span key={i} className="star">&#9734;</span>);
      }
    }
    return stars;
  };

  // Function to handle click on an item card
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  // Function to close item detail view
  const handleClose = () => {
    setSelectedItem(null);
    setQuantity(1);
  };

  // Function to handle adding an item to the cart
  const handleAddToCart = async (item, quantity = 1) => {
    if (quantity > 0 && quantity < 11) {
      try {
        let payload = { id: item.id, title: item.title, username: localStorage.getItem('username'), quantity: quantity, price: item.price, thumbnail: item.thumbnail };
        const response = await api.post('items/cart', payload);
        if (response) {
          toast.success("Item added successfully!");
          dispatch(addToCart(payload));
          if (item === selectedItem) handleClose();
        } else {
          toast.error("Item not added successfully");
        }
      } catch (error) {
        console.log("Failed to add item", error);
        toast.error("Something went wrong.");
      }
    }
  };

  // Effect to fetch items from API on component mount
  useEffect(() => {
    getItems().then((res) => {
      setItems(res.data['items']); // Assuming res.data contains the list of items
    });
  }, []);

  // Function to get maximum quantity that can be added to cart for a selected item
  const getMaxQuantity = (selectedItem) => {
    const cartItem = cartItems.find(item => item.id === selectedItem.id);
    if (cartItem) {
      const remainingQuantity = 10 - cartItem.quantity;
      return remainingQuantity > 0 ? remainingQuantity : 0;
    }
    return 10;
  };

  // Function to handle adding selected item to cart from detail view
  const handleSelectAddToCart = async () => {
    if (quantity > 0 && quantity < 11) {
      try {
        let payload = { id: selectedItem.id, title: selectedItem.title, username: localStorage.getItem('username'), quantity: quantity, price: selectedItem.price, thumbnail: selectedItem.thumbnail };
        const response = await api.post('items/cart', payload);
        if (response) {
          toast.success("Item added successfully!");
          dispatch(addToCart(payload));
          handleClose();
        } else {
          toast.error("Item not added successfully");
        }
      } catch (error) {
        console.log("Failed to add item", error);
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <>
      <Toaster /> {/* Toast notifications container */}
      <div className={`card-container`}>
        {/* Render each item card */}
        {items.map(item => (
          <div key={item._id} className='item-card' onClick={() => { handleItemClick(item) }}>
            <div className="item-pic" >
              <img src={item.thumbnail} alt={item.title} />
            </div>
            <div className="item-details">
              <h2 className="item-title">{item.title}</h2>
              <br />
              <h2 className="price">${item.price}</h2>
              <div className="order_d">{renderStars(item.rating)}{" "}{item.rating}</div>
              <button className="add-to-cart-button" onClick={(e) => {
                e.stopPropagation();
                if (getMaxQuantity(item) === 0) {
                  toast.error("Can't add more than 10 items");
                  return;
                }
                handleAddToCart(item);
              }}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Render selected item detail view */}
      {selectedItem && (
        <div className='one-item'>
          <div className="item-detail">
            <div className="product-image">
              <img src={selectedItem.thumbnail} alt={selectedItem.title} />
            </div>
            <div className="product-info">
              <h1>{selectedItem.title}</h1>
              <p>{selectedItem.description}</p>
              <p><strong>Price: </strong>${selectedItem.price}</p>
              <p><strong>Brand: </strong>{selectedItem.brand}</p>
              <p><strong>Category: </strong>{selectedItem.category}</p>
              <p><strong>Rating: </strong>{selectedItem.rating} ★</p>
            </div>
            <div className="product-actions">
              <button onClick={handleClose} className="close-button">X</button>
              <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ marginBottom: "10px" }}>
                  <label htmlFor="quantity" className="quantity-label">Quantity: {"  "}</label>
                  {/* Dropdown to select quantity */}
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="quantity-dropdown"
                  >
                    {[...Array(getMaxQuantity(selectedItem))].map((_, index) => (
                      <option key={index + 1} value={index + 1}>{index + 1}</option>
                    ))}
                  </select>
                </div>
                {/* Button to add selected quantity of item to cart */}
                <button className="add-to-cart-button-2" onClick={handleSelectAddToCart} disabled={getMaxQuantity(selectedItem) === 0}>
                  Add to Cart
                </button>
                {/* Display message if maximum quantity in cart is reached */}
                {getMaxQuantity(selectedItem) === 0 ? "Already have 10 in cart" : ""}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Items;
