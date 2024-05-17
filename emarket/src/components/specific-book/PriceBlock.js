import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './priceBlock.css';
import { BooksContext } from '../../BooksContext';
import cartIcon from '../cart/img/carticon.png';
import cartadd from '../cart/img/cartaddicon.png';
import cartupl from '../cart/img/uploadcarticon.png';
import buynow from '../cart/img/buynow.png';

export default function PriceBlock({
  id,
  showPrice
}) {
  const { setCartItems, books, cartItems, theme,  fieldState } = useContext(BooksContext);
 
  const [count, setCount] = useState(1);

const booksInCart = useMemo(() => cartItems || [], [cartItems]);
const specificBookIndex = useMemo(() => booksInCart.findIndex((el) => el.id === id), [booksInCart, id]);
const specificCount = useMemo(() => (specificBookIndex !== -1 ? booksInCart[specificBookIndex].count : 0), [specificBookIndex, booksInCart]);

useEffect(() => {
  setCount(specificCount || 1);
}, [specificCount]);

const selectedBook = useMemo(() => {
  const foundBook = books.find((book) => book.id === id);
  return foundBook || (specificBookIndex !== -1 ? booksInCart[specificBookIndex] : {});
}, [books, id, specificBookIndex, booksInCart]);

  function updateBookInCart(updatedBook, specificBookIndex, booksInCart) {
    const updatedBooksInCart = [...booksInCart];
    if (specificBookIndex !== -1) {
      updatedBooksInCart[specificBookIndex] = updatedBook;
    } else {
      updatedBooksInCart.push(updatedBook);
    }
    return updatedBooksInCart;
  }

  
  function addedBooks(newCount) {
    const calculatedPrice = parseFloat(selectedBook.price || 0) * newCount;
    const totalBookPrice = calculatedPrice >= 0 ? calculatedPrice.toFixed(2) : '0.00';

    const updatedBook = { ...selectedBook, count: newCount, totalBookPrice };
    const updatedBooksInCart = updateBookInCart(updatedBook, specificBookIndex, booksInCart);

    setCartItems(updatedBooksInCart);
  
  }

//! ----The initial version 
  // useEffect(() => {
  //   if (specificCount > 0 || specificBookIndex !== -1) {
  //     addedBooks(count);
  //   }
  // }, [specificCount, specificBookIndex, count]);

  
  // const incrementCount = () => {
  //   setCount((prevCount) => {
  //     const newCount = Math.min(42, prevCount + 1);
  //     return newCount;
  //   });
  // };

  // const decrementCount = () => {
  //   setCount((prevCount) => {
  //     const newCount = Math.max(1, prevCount - 1);
  //     return newCount;
  //   });
  // };
//!----


  const incrementCount = () => {
    setCount((prevCount) => {
      const newCount = Math.min(42, prevCount + 1);
      if (specificCount > 0) {
        addedBooks(newCount)
      }
      return newCount;
    });
  };

  const decrementCount = () => {
    setCount((prevCount) => {
      const newCount = Math.max(1, prevCount - 1);
      if (specificBookIndex !== -1) {
        addedBooks(newCount)
      }
      return newCount;
    });
  };

  const addtoCart = () => {
    addedBooks(count)
  }

  function removeBookFromCart(bookId) {
    const updatedCartItems = booksInCart.filter((item) => item.id !== bookId);
    setCartItems(updatedCartItems);
    setCount(1);
  }
  

  return (
    <section className={theme}>
      <section className="contener">
        <section className="price-block Price">
          {specificCount > 0 && (
            <img src={cartupl} alt='remove from Cart' className="ccart-icon" onClick={() => removeBookFromCart(id)} tabIndex="-1"/>
          )}

          <section className="price-block Price">
            {showPrice && (
              <div className="price-block-row">
                <span>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price,$"}  </span>
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
                    onClick={() => decrementCount()}
                  >
                    ➖
                  </button>
                  <output  id="count">{count}</output>
                  <button
                    className="increment"
                    type="button"
                    disabled={count === selectedBook.maxcount}
                    onClick={() => incrementCount()}
                  >
                    ➕
                  </button>
                </div>
              </div>
            )}

            { count >= 1 && (
              <div className="price-block-row totalPrice">
                <span>{fieldState.totalPrice && fieldState.totalPrice !== "" ? fieldState.totalPrice : "Total,$"} </span>
                <span id="totalPrice" data-testid="totalPrice">
                  {(count * (selectedBook.price || 0)).toFixed(2)}
                </span>
              </div>
            )}

            {!specificCount > 0 && (
              <Link to={`/Form?id=${id}&title=${selectedBook.title}&count=${count}&price=${selectedBook.price}`}>
                <img
                  className="ccart-icon"
                  src={buynow}
                  alt="Buy Now"
                />
              </Link>
            )}

            {!specificCount > 0 && (
              <img
                className="ccart-icon rotate"
                src={cartadd}
                alt='addtocart'
                onClick={() => addtoCart()}
              />
            )}

            <Link to="/cart">
              {specificCount > 0 && (
                <img src={cartIcon} alt="Cart" className="ccart-icon Linkcart rotate" />
              )}
            </Link>
          </section>
        </section>
      </section>
    </section>
  );
}


// import React, { useContext, useState, useMemo, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './priceBlock.css';
// import { BooksContext } from '../../BooksContext';
// import cartIcon from '../cart/img/carticon.png';
// import cartadd from '../cart/img/cartaddicon.png';
// import cartupl from '../cart/img/uploadcarticon.png';
// import buynow from '../cart/img/buynow.png';


// export default function PriceBlock({
//   id,
//   showPrice
  
// }) {
//   const { setCartItems, setTotalPrice, setTotalCount, books, cartItems, theme, loggedIn, fieldState } = useContext(BooksContext);
 
//   const booksInCart = useMemo(() => cartItems || [], [cartItems]);
  
//   const specificBookIndex = useMemo(() => booksInCart.findIndex((el) => el.id === id), [booksInCart, id]);
//   const specificCount = useMemo(() => (specificBookIndex !== -1 ? booksInCart[specificBookIndex].count : 0), [specificBookIndex, booksInCart]);
//   const [count, setCount] = useState(specificCount ||1);

//   let selectedBook = books.find((book) => book.id === id);
//   if (!selectedBook && specificBookIndex !== -1) {
//     selectedBook = booksInCart[specificBookIndex];
//   } else if (!selectedBook && specificBookIndex === -1) {
//     selectedBook = {};
//   }

//   function calculateTotalCount(cartItems) {
//     return cartItems.reduce((totalCount, book) => totalCount + book.count, 0);
//   }

//   function calculateTotalPrice(booksInCart) {
//     let totalBookPrice = 0;
//     for (const book of booksInCart) {
//       totalBookPrice += Number(book.totalBookPrice);
//     }
//     return totalBookPrice.toFixed(2);
//   }

//   function updateBookInCart(updatedBook, specificBookIndex, booksInCart) {
//     const updatedBooksInCart = [...booksInCart];
//     if (specificBookIndex !== -1) {
//       updatedBooksInCart[specificBookIndex] = updatedBook;
//     } else {
//       updatedBooksInCart.push(updatedBook);
//     }
//     return updatedBooksInCart;
//   }


//   function addedBooks(newCount) {
//     const calculatedPrice = parseFloat(selectedBook.price || 0) * newCount;
//     const totalBookPrice = calculatedPrice >= 0 ? calculatedPrice.toFixed(2) : '0.00';
  
//     const updatedBook = { ...selectedBook, count: newCount, totalBookPrice };
//     const updatedBooksInCart = updateBookInCart(updatedBook, specificBookIndex, booksInCart);
  
//     //localStorage.bookToCart = JSON.stringify(updatedBooksInCart);
//     setCartItems(updatedBooksInCart);
  
//     const totalPrice = calculateTotalPrice(updatedBooksInCart);
//     setTotalPrice(totalPrice);
//   //localStorage.totalPrice=totalPrice
//     const totalCount = calculateTotalCount(updatedBooksInCart);
//     setTotalCount(totalCount);
//     //localStorage.totalCount=totalCount
//   }
 
//   const incrementCount = () => {
    
   
//     setCount((prevCount) => {
//       const newCount = Math.min(42, prevCount + 1);
//       if ( specificCount>0 ) {
     
//       addedBooks(newCount)
//     }
//       return newCount;
//     });
  
//   };

//   const decrementCount = () => {
   
//       setCount((prevCount) => {
//       const newCount = Math.max(1, prevCount - 1);
//       if ( specificBookIndex !== -1) {
//       addedBooks(newCount)
//     }
//       return newCount;
//     });
  
//   };

//   const addtoCart=()=>{
//     addedBooks(count)
//   }


// // function buynow(){

// // }

//   function removeBookFromCart(bookId) {
//     const updatedCartItems = booksInCart.filter((item) => item.id !== bookId);
//     setCartItems(updatedCartItems);
//     //localStorage.bookToCart = JSON.stringify(updatedCartItems);

//     const totalPrice = calculateTotalPrice(updatedCartItems);
//     setTotalPrice(totalPrice);

//     const totalCount = calculateTotalCount(updatedCartItems);
//     setTotalCount(totalCount);
//     setCount(1)
//     //localStorage.totalCount=totalCount
//     //localStorage.totalPrice=totalPrice
//   }

// useEffect(() => {
// setCount(specificCount>0 ? specificCount:1)
// }, [specificCount]);

// console.log(count)
// console.log(specificCount)
//   return (
//     <section className={theme}>
//       <section className="contener">
//         <section className="price-block Price">
         
// {specificCount > 0 && (
//             <img src={cartupl} alt='remove from Cart' className="ccart-icon" onClick={() => removeBookFromCart(id)} tabIndex="-1"/>
              
//           )}
         
//           <section className="price-block Price">
//             {showPrice && (
//               <div className="price-block-row">
//                 <span>{fieldState.price && fieldState.price!=="" ? fieldState.price :  "Price,$"}  </span>
//                 <span id="price">{selectedBook.price || 0}</span>
//               </div>
//             )}
// {selectedBook.maxcount&&selectedBook.maxcount>1&&(
//             <div className="price-block-row">
//               <div className="price-block-row-input">
//                 <button
//                   className="decrement"
//                   type="button"
//                   disabled={count<2}
//                   onClick={() => decrementCount()}
//                 >
//                 ➖
//                 </button>
//               <output  id="count">{count}</output>
              
//                 <button
//                   className="increment"
//                   type="button"
//                   disabled={count === selectedBook.maxcount}
//                   onClick={() => incrementCount()}
//                 >
//                ➕
//                 </button>
//               </div>
//             </div>
// )}
//             { count>=1 &&(
//               <div className="price-block-row totalPrice">
//                 <span>{fieldState.totalPrice && fieldState.totalPrice!=="" ? fieldState.totalPrice :  "Total,$"} </span>
//                 <span id="totalPrice" data-testid="totalPrice">
//                   {(count * (selectedBook.price || 0)).toFixed(2)}
//                 </span>
//               </div>
//             )}
            
 
//  {/* {loggedIn  && specificBookIndex &&(
//                 <Link to="/Form">
//                 <img
//                   className="ccart-icon "
//                   src={buynow} alt='buynow'
                  
//                   //onClick={() => buynow()}
//                 />
//                 </Link>              
//               )} */}
// {/* {loggedIn && !specificCount>0 && ( */}
// {!specificCount>0 && (
//   <Link to={`/Form?id=${id}&title=${selectedBook.title}&count=${count}&price=${selectedBook.price}`}>
//     <img
//       className="ccart-icon"
//       src={buynow}
//       alt="Buy Now"
//     />
//   </Link>
// )}


// {!specificCount>0  && (
//                 <img
//                   className="ccart-icon  rotate"
//                   src={cartadd} alt='addtocart'
//                   // disabled={count >1}
//                   onClick={() => addtoCart()}
//                 />
                              
//               )}
// <Link to="/cart">
//             {specificCount > 0 && (
//               <img src={cartIcon} alt="Cart" className="ccart-icon Linkcart  rotate" />
//             )}
//           </Link>
                       
//           </section>
//         </section>
//       </section>
//     </section>
//   );
// }
