import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./cart.css";
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import ScrollToTopButton from '../utils/ScrollToTopButton';
import Shelf from '../book-list/Shelf';
import CartMemo from "./CartMemo";

export default function Cart() {
  const { setCartItems, cartItems, theme, setTotalPrice, totalPrice, setTotalCount, loggedIn, promo, books, fieldState } = React.useContext(BooksContext);

  const {
    cart,
    back,
    upload,
    check, } = useIcons();

  const [cartContent, setCartContent] = useState(null);
  const navigate = useNavigate();

  const clearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    setTotalCount(0);   
  };  

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setCartContent(
        <div className="main">
          <img src={cart} alt="cart empty" />
          <span>Cart empty..</span>          
        </div>
      );
    } else {
      setCartContent(<Shelf book={cartItems} widhtblock={1} />);
    }
  }, [cartItems, promo, fieldState.idprice, cart]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const newTotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.count), 0);
      setTotalPrice(newTotal.toFixed(2));
    } 
  }, [cartItems, setTotalPrice]);

  useEffect(() => {
    if (books.length === 0) {
      navigate('/');
    }
  }, [books, navigate]);

  if (books.length === 0) {
    return null;
  }

  return (
    <section className={theme}>
      <section className="filters">
        <Link to="/BookList">
          <img src={back} className="back-button selected" alt="Back to main page" />
        </Link>
        {cartItems.length !== 0 && (
          <Link to="/OrderForm" >
           <button className="selected rotate">
            <img src={check} className="back-button" alt="Proceed to checkout" />
           <b>Order</b>
           </button>
          </Link>
        )}
         {loggedIn&&(
          <div className="filter">
           <CartMemo/>
           </div> 
          )}
        {cartItems.length !== 0 && totalPrice !== 0 && (
          <p id="total"><b className="back-button selected">Total Price: <strong>{totalPrice}</strong></b></p>
        )}
      </section>
      {cartItems.length !== 0 && (
        <img src={upload} className="back-button selected" onClick={clearCart} alt="Clear cart" />
      )}
     {cartContent}
      <ScrollToTopButton />
    </section>
  );
}

