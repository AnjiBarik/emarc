import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import cart from './img/cart.svg';
import { BooksContext } from '../../BooksContext';
import PriceBlock from '../specific-book/PriceBlock';

import Shelf from '../book-list/Shelf';

import Form from './Rform'

export default function CartBook(props) {
  // Змінна для збереження загальної вартості книжок у кошику
  let totalPrice = 0;

  // Отримуємо дані про книжки з контексту
  const { cartItems, setCartItems, theme } = useContext(BooksContext);

  const [showPriceBlock, setShowPriceBlock] = useState({});

 

  // Перевіряємо, чи є книжки у кошику. Якщо кошик порожній, виводимо повідомлення
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="main">
        <img src={cart} alt="cart" />
        <span>Cart empty..</span>
      </div>
    );
  }

  // Використовуємо метод `map` для створення масиву компонентів `<div>` зі списком книжок
 const singleBook =      

      <Shelf book={cartItems} />

   
   
     

 

  // Використовуємо метод `reduce` для обчислення загальної вартості книжок
  if (cartItems) {
    totalPrice = cartItems.reduce((accumulator, el) => accumulator + Number(el.totalBooklPrice), 0);
  }

  // Функція для очищення кошика та localStorage
  function cleanStorage() {
   // setCartItems([]);
    //localStorage.bookToCart = JSON.stringify([]);
   


  };


  
  // Перевіряємо, чи є ім'я користувача у localStorage. Якщо його немає, перенаправляємо на головну сторінку
  // if (!localStorage.username) {
  //   return <Navigate to="/" redirect={true} />;
  // }

  return (
    <div className="main-cart-book main">
      {/* Кнопка для очищення кошика */}
      <Link to="/Form">
      
      <button onClick={cleanStorage} className="purchase button custom-element">
        Purchase
      </button>
      
      </Link>

      {singleBook}
      <p id="total">{'Total price, $ '} {totalPrice.toFixed(2)}</p>
    </div>
  );
}