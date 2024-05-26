import React, { useState, useEffect, useRef } from 'react';
import './footer.css';
import ava from '../cart/img/user.png';
import cart from '../cart/img/carticon.png';
import home from '../cart/img/home.png';
import search from '../cart/img/search.png';
import filter from '../cart/img/filter.png';
import category from '../cart/img/category.png';
import { Link, useLocation } from "react-router-dom";
import { BooksContext } from '../../BooksContext';
import RegistrationForm from '../cart/RegistrationForm';

export default function Footer() {
  const { theme, cartItems, totalCount, setTotalCount, savedLogin, uiMain, idLoudPrice } = React.useContext(BooksContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const location = useLocation();

  const routeToIconMap = useRef({
    '/': 'home',
    '/BookList': 'category',
    '/cart': 'cart',
    '/Filter': 'filter',
    '/Search': 'search'
  });

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setTotalCount(cartItems.reduce((acc, item) => acc + item.count, 0));
    } else {
      setTotalCount(0);
    }
  }, [cartItems, setTotalCount]);

  useEffect(() => {
    const iconName = routeToIconMap.current[location.pathname];
    if (iconName) {
      setSelectedImage(iconName);
    }
    console.log('Current location:', location.pathname);
  }, [location]);

  const handleImageClick = (imageName) => {
    if (imageName === 'avatar') {
      setShowRegistrationForm(prevState => !prevState);
    } else {
      setShowRegistrationForm(false);
    }
    setSelectedImage(imageName);
  };

  return (
    <>
      {idLoudPrice === uiMain.id && (
        <section className={theme}>
          <section className="foot">
            <section className="footer">
              <section className="cart">
                <Link to="/">
                  <img className={`back-button ${selectedImage === 'home' ? 'sel' : ''}`} onClick={() => handleImageClick('home')} src={home} alt="home" />
                </Link>
              </section>

              <section className="cart">
                <Link to="/BookList">
                  <img className={`back-button ${selectedImage === 'category' ? 'sel' : ''}`} onClick={() => handleImageClick('category')} src={category} alt="category" />
                </Link>
              </section>

              <section className="cart">
                <Link to="/cart">
                  <img className={`back-button ${selectedImage === 'cart' ? 'sel' : ''}`} onClick={() => handleImageClick('cart')} src={cart} alt="cart" />
                  {totalCount > 0 && (
                    <span className="cartcount"><b>{totalCount}</b></span>
                  )}
                </Link>
              </section>

              <section className="cart">
                <Link to="/Filter">
                  <img className={`back-button ${selectedImage === 'filter' ? 'sel' : ''}`} onClick={() => handleImageClick('filter')} src={filter} alt="filter" />
                </Link>
              </section>

              <section className="cart">
                <Link to="/Search">
                  <img className={`back-button ${selectedImage === 'search' ? 'sel' : ''}`} onClick={() => handleImageClick('search')} src={search} alt="search" />
                </Link>
              </section>

              <section className="cart">
                <img className={`back-button ${selectedImage === 'avatar' ? 'sel' : ''}`} onClick={() => handleImageClick('avatar')} src={ava} alt="avatar" style={{ cursor: 'pointer' }} />
                {savedLogin && (
                  <span className="cartcount">{savedLogin.slice(0, 2) + '...'}</span>
                )}
              </section>
            </section>
            {showRegistrationForm && <RegistrationForm />}
          </section>
        </section>
      )}
    </>
  );
}


// import React, { useState, useEffect } from 'react';
// import './footer.css';
// import ava from '../cart/img/user.png';
// import cart from '../cart/img/carticon.png';
// import home from '../cart/img/home.png';
// import search from '../cart/img/search.png';
// import filter from '../cart/img/filter.png';
// import category from '../cart/img/category.png';
// import { Link, useLocation } from "react-router-dom";
// import { BooksContext } from '../../BooksContext';
// import RegistrationForm from '../cart/RegistrationForm';

// export default function Footer() {
//   const { theme, cartItems, totalPrice, totalCount, setTotalCount, savedLogin, loggedIn, uiMain, idLoudPrice } = React.useContext(BooksContext);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
// //!!!!!!!!!!!!!!!!!!!1
//   useEffect(() => {
//     if (cartItems && cartItems.length > 0) {
//       setTotalCount( cartItems.reduce((acc, item) => acc + item.count, 0));
//     } else {
//       setTotalCount(0)
//     }
//   }, [cartItems,  setTotalCount]);

//   console.log(totalCount)
//   // useEffect(() => {
//   //   // Reset selected image when component mounts
//   //   setSelectedImage(null);
//   // }, []);

//   const handleImageClick = (imageName) => {
    
//     if (imageName === 'avatar') {
//       setShowRegistrationForm(prevState => !prevState);
//     } else {
//       setShowRegistrationForm(false);
//     }
//     setSelectedImage(imageName);
//   };

//   //!
//   const location = useLocation();

//     useEffect(() => {
//         console.log('Current location:', location.pathname);
//         // Здесь можно добавить логику для определения активного компонента
//     }, [location]);



//   return (
//     <>
//     {idLoudPrice === uiMain.id &&(
//     <section className={theme}>
//       <section className="foot">
//         <section className="footer">
//           <section className="cart">
//             <Link to="/" >
//               <img className={`back-button ${selectedImage === 'home' ? 'sel' : ''}`} onClick={() => handleImageClick('home')} src={home} alt="home" />
//             </Link>
//           </section>

//           <section className="cart">
//             <Link to="/BookList" >
//               <img className={`back-button ${selectedImage === 'category' ? 'sel' : ''}`} onClick={() => handleImageClick('category')} src={category} alt="category" />
//             </Link>
//           </section>

//           <section className="cart">
//             <Link to="/cart" >
//               <img className={`back-button ${selectedImage === 'cart' ? 'sel' : ''}`} onClick={() => handleImageClick('cart')} src={cart} alt="cart" />
//               {totalCount > 0 && (
//                 <span className="cartcount"><b>{totalCount}</b></span>
//               )}
//             </Link>
//           </section>

//           <section className="cart">
//             <Link to="/Filter" >
//               <img className={`back-button ${selectedImage === 'filter' ? 'sel' : ''}`} onClick={() => handleImageClick('filter')} src={filter} alt="filter" />
//             </Link>
//           </section>

//           <section className="cart">
//             <Link to="/Search" >
//               <img className={`back-button ${selectedImage === 'search' ? 'sel' : ''}`} onClick={() => handleImageClick('search')} src={search} alt="search" />
//             </Link>
//           </section>

//           <section className="cart">
//             {/* <Link to="/RegistrationForm" > */}
//               <img className={`back-button ${selectedImage === 'avatar' ? 'sel' : ''}`} onClick={() => handleImageClick('avatar')} src={ava} alt="avatar" style={{ cursor: 'pointer' }} />
//               {savedLogin && (
//                 <span className="cartcount">{ savedLogin.slice(0, 2) + '...' }</span>
//               )}
//             {/* </Link> */}
//           </section>
//         </section>
//         {showRegistrationForm && <RegistrationForm />}
//       </section>
     
//     </section>
//    )}
//    </>
//   );
// }



// import React, { useState, useEffect } from 'react';
// import './footer.css';
// import ava from '../cart/img/user.png';
// import cart from '../cart/img/carticon.png';
// import home from '../cart/img/home.png';
// import search from '../cart/img/search.png';
// import filter from '../cart/img/filter.png';
// import category from '../cart/img/category.png';
// import { Link } from "react-router-dom";
// import { BooksContext } from '../../BooksContext';


// export default function Footer() {
 
//   const username = localStorage.getItem('username');
//   // Отримання даних про книжки з контексту BooksContext
//   const { theme, cartItems, totalPrice, totalCount, savedLogin, loggedIn } = React.useContext(BooksContext);
//   // Кількість заказів у кошику 
//  // const cartItemsCount = cartItems.length;
//   const [cartItemsCount, setCartItemsCount] = useState(0); 

//   useEffect(() => {
//     setCartItemsCount(cartItems.length);
//   }, [cartItems]);


//   // function clearUser() {
  
//   //   const username = localStorage.getItem('username');
//   //   const hashedUsername = SHA256(username).toString();
//   //   const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || {};
//   //   // Зберігаємо список покупок для даного хешу імені користувача
//   //   storedPurchases[hashedUsername] = cartItems;
//   //   localStorage.setItem('purchases', JSON.stringify(storedPurchases));
//   //   // Очищаємо різні дані користувача
//   //   localStorage.removeItem('bookListInput');
//   //   localStorage.removeItem('bookListSelect');
//   //   localStorage.removeItem('username');
//   //   localStorage.removeItem('bookToCart');
//   // }

//   return (
//     <section className={theme}>
//     <section className=" foot">
//       <section className="footer">
//       <section className="cart">
//       <Link to="/LandingPage" className="back-button">
//       <img className="back-button" src={home} alt="home" />
//        </Link>
//        </section>
//        <section className="cart">
//         <Link to="/" className="back-button">
//         <img className="back-button" src={category} alt="category" />
//          </Link>
//          </section>
       
       
    

     
//       <section className="cart">
//         {/* Посилання на сторінку з корзиною */}
//         <Link to="/cart" className="back-button">
//           <img className="back-button " src={cart} alt="cart" />
//         </Link>

     
// {/* {totalPrice > 0 && (
//           <span className="cartcount">{totalCount}📦${(totalPrice)}</span>
//         )} */}
//       {totalPrice > 0 && (
//           <span className="cartcount">{totalCount}</span>
//         )}
      
      
      
//       </section>
       
//       <section className="cart">
//         <Link to="/Search" className="back-button"> 
//        <img className="back-button" src={filter} alt="filter" />
//        </Link>
//        </section>
       

//        <section className="cart">
//         <Link to="/GlSearch" className="back-button"> 
//        <img className="back-button" src={search} alt="search" />
//        </Link>
//        </section>

//         {/* Секція із зображенням користувача та його іменем */}
//         <section className="cart">
//         <Link to="/RegistrationForm" className="back-button">
//           <img className="back-button" src={ava} alt="avatar" />
//         </Link>
//           {/* Виведення імені користувача, яке було отримане з localStorage */}
//           {savedLogin&&(
//           <span className="cartcount">{savedLogin.length >= 5 ? savedLogin.slice(0, 4) + '...' : savedLogin}</span>
//           )};
//         </section>
//       </section>
//     </section>
//     </section>
//   );
// }