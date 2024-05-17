import React, { useState, useEffect } from "react";
import "./cart.css";
import cart from './img/cart.svg';
import { BooksContext } from '../../BooksContext';
import ScrollToTopButton from '../book-list/ScrollToTopButton';
import Shelf from '../book-list/Shelf';
import { Link } from 'react-router-dom';
import back from '../cart/img/back.png';
import upload from '../cart/img/orderfailure.png';
import enter from '../cart/img/enter.png';
import check from '../cart/img/check.png';
import RegistrationForm from '../cart/RegistrationForm';
import CartMemo from "./CartMemo";
import MyForm from "./MyForm";

export default function Cart() {
  const { setCartItems, cartItems, theme, setTotalPrice, totalPrice, setTotalCount, loggedIn, promo, books, fieldState } = React.useContext(BooksContext);
  const [cartContent, setCartContent] = useState(null);

  const clearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    setTotalCount(0);   
  };

  if (books.length === 0) {
    window.location.href = '/';
  }

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setCartContent(
        <div className="main">
          <img src={cart} alt="cart empty" />
          <span>Cart empty..</span>
          {promo === fieldState.idprice && <MyForm />}
        </div>
      );
    } else {
      setCartContent(<Shelf book={cartItems} widhtblock={1} />);
    }
  }, [cartItems, promo, fieldState.idprice]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const newTotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.count), 0);
      setTotalPrice(newTotal.toFixed(2));
    } 
  }, [cartItems, setTotalPrice]);

  return (
    <section className={theme}>
      <section className="filters">
        <Link to="/BookList">
          <img src={back} className="back-button selected" alt="Back to main page" />
        </Link>
        {cartItems.length !== 0 && (
          <Link to="/Form" >
            <img src={check} className="back-button selected rotate" alt="Proceed to checkout" />
          </Link>
        )}
         {loggedIn&&(<CartMemo/>)}
        {cartItems.length !== 0 && totalPrice !== 0 && (
          <p id="total" autoFocus><b className="back-button selected">Total Price: ${totalPrice}</b></p>
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



// import React, { useState, useEffect } from "react";
// import "./cart.css";
// import cart from './img/cart.svg';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from '../book-list/ScrollToTopButton';
// import Shelf from '../book-list/Shelf';
// import { Link } from 'react-router-dom';
// import back from '../cart/img/back.png';
// import upload from '../cart/img/orderfailure.png';
// import enter from '../cart/img/enter.png';
// import check from '../cart/img/check.png';
// import RegistrationForm from '../cart/RegistrationForm';
// import CartMemo from "./CartMemo";
// import MyForm from "./MyForm";

// export default function Cart() {
//   const { setCartItems, cartItems, theme, setTotalPrice, totalPrice, setTotalCount, loggedIn, promo, books, fieldState } = React.useContext(BooksContext);
//   console.log(loggedIn)
//   const clearCart = () => {
//     setCartItems([]);
//     setTotalPrice(0);
//     setTotalCount(0);   
//   };

//   if ( books.length === 0 ) {
   
//     window.location.href = '/';
//   }



//   const [showRegistrationForm, setShowRegistrationForm] = useState(false);

//   let cartContent;

//   if (!cartItems || cartItems.length === 0) {
//     cartContent = (
//       <div className="main">
//         <img src={cart} alt="cart empty" />
//         <span>Cart empty..</span>
//        {promo === fieldState.idprice&&(
//         <MyForm/>
//       )} 
//       </div>
//     );
//   } else {
//     cartContent = (
//       <>
//         <Shelf book={cartItems} widhtblock={1} />
//       </>
//     );
//   }

//  // const handleImageClick = () => { setShowRegistrationForm(prevState => !prevState); };

//   // const navigate = useNavigate();
// console.log(cartItems)




//   useEffect(() => {
//     if (cartItems && cartItems.length > 0) {
//       const newTotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.count), 0);
//       console.log(newTotal.toFixed(2))
//       setTotalPrice(newTotal.toFixed(2));
//     } 
//   }, [cartItems, setTotalPrice]);

//   return (

//     <section className={theme}>
//        <section className="filters">
            
//       <Link to="/BookList">
//         <img src={back} className="back-button selected" alt="Back to main page" />
//       </Link>

//       {/* {!loggedIn && (
//         <>
//           <img src={enter} className="back-button selected rotate" onClick={() => handleImageClick()} alt="Enter registration form" />
//         </>
//       )} */}

     
// {cartItems.length !== 0 && (
//         <Link to="/Form" >
//           <img src={check} className="back-button selected rotate" alt="Proceed to checkout" />
//         </Link>
//       )}
//       {/* {cartItems.length !== 0 && loggedIn && (
//         <Link to="/Form" >
//           <img src={check} className="back-button selected rotate" alt="Proceed to checkout" />
//         </Link>
//       )} */}


// <CartMemo/>

//       {cartItems.length !== 0 && totalPrice !== 0 && (<p id="total"  autoFocus><b className="back-button selected">Total Price: ${totalPrice}</b></p>)}
//       </section>
      
//       {cartItems.length !== 0 && (
//         <img src={upload} className="back-button selected" onClick={clearCart} alt="Clear cart" />
//       )}

//       {cartContent}
//       {showRegistrationForm && <RegistrationForm />}
      
      

//       <ScrollToTopButton />
//     </section>

//   );
// }



// import React, { useState} from "react";
// import "./cart.css";
// import cart from './img/cart.svg';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from '../book-list/ScrollToTopButton';
// import Shelf from '../book-list/Shelf';
// import { Link } from 'react-router-dom';
// import back from '../cart/img/back.png';
// import upload from '../cart/img/orderfailure.png';
// import enter from '../cart/img/enter.png';
// import check from '../cart/img/check.png';
// import RegistrationForm from '../cart/RegistrationForm';

// export default function Cart() {
//   const { setCartItems, cartItems, theme,  setTotalPrice, totalPrice, setTotalCount, loggedIn } = React.useContext(BooksContext);
// console.log(loggedIn)
//   const clearCart = () => {
//     setCartItems([]);
//     setTotalPrice(0);
//     setTotalCount(0);
//     localStorage.bookToCart = [];
//     localStorage.totalCount=0
//     localStorage.totalPrice=0
//   };
  
//   const [showRegistrationForm, setShowRegistrationForm] = useState(false);

//   let cartContent;

//   if (!cartItems || cartItems.length === 0) {
//     cartContent = (
//       <div className="main">
//         <img src={cart} alt="cart empty" />
//         <span>Cart empty..</span>
//       </div>
//     );
//   } else {
//     cartContent = (
//       <>
//         <Shelf book={cartItems} widhtblock={1} />
//         {/* <p id="total">Total Price: ${localStorage.totalPrice}</p> */}
//       </>
//     );
//   }

//   const handleImageClick = () => {setShowRegistrationForm(prevState => !prevState);};
    
  

//   return (
  
       
      
      
//       <section className={theme}>
//         <Link to="/" >
//         <img src={back} className="back-button selected"/>
         
//         </Link>

// {!loggedIn &&(
     
//        <>
//         <img src={enter} className="back-button selected rotate" onClick={() => handleImageClick()}/>
        
//      </>
// )}

//  {showRegistrationForm && <RegistrationForm />}
 
// {cartItems.length !==0 && loggedIn && (
//         <Link to="/Form" >
          
//           <img src={check} className="back-button selected rotate"/>
         
//         </Link>
// )}
       
//       {cartItems.length !==0 &&totalPrice !==0 && (  <p id="total">Total Price: ${totalPrice}</p>)}
//         {cartItems.length !==0 && (
//         <img src={upload} className="back-button selected" onClick={clearCart}/>
       
// )}

//         {cartContent}
//         <ScrollToTopButton />
//       </section>
  
//   );
// }

