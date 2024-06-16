import React, { useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './priceBlock.css';
import { BooksContext } from '../../BooksContext';
import cartIcon from '../cart/img/carticon.png';
import cartadd from '../cart/img/cartaddicon.png';
import cartupl from '../cart/img/uploadcarticon.png';
import buynow from '../cart/img/buynow.png';

export default function PriceBlock({ id, showPrice }) {
  const { setCartItems, books, cartItems, theme, fieldState } = useContext(BooksContext);

  const booksInCart = useMemo(() => cartItems || [], [cartItems]);
  const specificBookIndex = useMemo(() => booksInCart.findIndex((el) => el.id === id), [booksInCart, id]);
  const specificCount = useMemo(() => (specificBookIndex !== -1 ? booksInCart[specificBookIndex].count : 0), [specificBookIndex, booksInCart]);
  const selectedBook = useMemo(() => books.find((book) => book.id === id), [books, id]);
  const [count, setCount] = useState(specificCount || 1);

  const createUpdatedBook = useCallback((newCount) => {
    const calculatedPrice = parseFloat(selectedBook.price || 0) * newCount;
    const totalBookPrice = calculatedPrice >= 0 ? calculatedPrice.toFixed(2) : '0.00';
    return { ...selectedBook, count: newCount, totalBookPrice };
  }, [selectedBook]);

  useEffect(() => {
    if (specificBookIndex !== -1 && count!==specificCount) {
      const updatedBook = createUpdatedBook(count);
      const updatedBooksInCart = [...booksInCart];
      updatedBooksInCart[specificBookIndex] = updatedBook;
      setCartItems(updatedBooksInCart);
    }
  }, [count, specificBookIndex, booksInCart, setCartItems, createUpdatedBook, specificCount]);

  const incrementCount = () => {
    setCount((prevCount) => Math.min(42, prevCount + 1));
  };

  const decrementCount = () => {
    setCount((prevCount) => Math.max(1, prevCount - 1));
  };

  const addToCart = () => {
    if (specificBookIndex === -1) {
      const updatedBook = createUpdatedBook(count);
      const updatedBooksInCart = [...booksInCart, updatedBook];
      setCartItems(updatedBooksInCart);
    }
  };

  const removeBookFromCart = (bookId) => {
    const updatedCartItems = booksInCart.filter((item) => item.id !== bookId);
    setCartItems(updatedCartItems);
    setCount(1);
  };

  return (
    <section className={theme}>
      <section className="contener">
        {/* <section key={`${count}`} className="price-block Price"> */}
        <section  className="price-block Price">
          {specificBookIndex !== -1 && (
            <img src={cartupl} alt='remove from Cart' className="ccart-icon" onClick={() => removeBookFromCart(id)} tabIndex={-1} />
          )}

          <section className="price-block Price">
            {showPrice && (
              <div className="price-block-row">
                <span>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price"}  </span>
                <span id="price">{selectedBook.price || 0}</span>
              </div>
            )}

            {selectedBook.maxcount && selectedBook.maxcount > 1 && (
              <div className="price-block-row">
                <div className="price-block-row-input">
                  <button
                    className="decrement"
                    type="button"
                    disabled={count < 2}
                    onClick={decrementCount}
                  >
                    ➖
                  </button>
                  <output>{count}</output>
                  <button
                    className="increment"
                    type="button"
                    disabled={count === selectedBook.maxcount}
                    onClick={incrementCount}
                  >
                    ➕
                  </button>
                </div>
              </div>
            )}

            <div className="price-block-row totalPrice">
              <span>{fieldState.totalPrice && fieldState.totalPrice !== "" ? fieldState.totalPrice : "Total"}</span>
              <span id="totalPrice">
                {(count * (selectedBook.price || 0)).toFixed(2)}
              </span>
            </div>

            {specificBookIndex === -1 && (
              <Link to={`/OrderForm?id=${id}&title=${selectedBook.title}&count=${count}&price=${selectedBook.price}`}>
                <img
                  className="ccart-icon"
                  src={buynow}
                  alt="Buy Now"
                />
              </Link>
            )}

            {specificBookIndex === -1 && (
              <img
                className="ccart-icon rotate"
                src={cartadd}
                alt='addToCart'
                onClick={addToCart}
              />
            )}
            {specificBookIndex !== -1 && (
              <Link to="/cart">              
                <img src={cartIcon} alt="Cart" className="ccart-icon Linkcart rotate" />             
              </Link>
            )}
          </section>
        </section>
      </section>
    </section>
  );
}
