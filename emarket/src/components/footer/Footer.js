import React, { useState, useEffect, useRef } from 'react';
import './footer.css';
import { Link, useLocation } from "react-router-dom";
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import RegistrationForm from '../cart/RegistrationForm';

// import ava from '../cart/img/user.png';
// import carticon from '../cart/img/carticon.png';
// import home from '../cart/img/home.png';
// import search from '../cart/img/search.png';
// import filter from '../cart/img/filter.png';
// import category from '../cart/img/category.png';

export default function Footer() {
  const { theme, cartItems, totalCount, setTotalCount, savedLogin, uiMain, idLoudPrice, showRegistrationForm, setShowRegistrationForm } = React.useContext(BooksContext);

  const {
    filter,
    search,    
    ava,
    carticon,
    home,
    category, } = useIcons();

  const [selectedImage, setSelectedImage] = useState(null);  

  const location = useLocation();

  const routeToIconMap = useRef({
    '/': 'home',
    '/BookList': 'category',
    '/cart': 'cart',
    '/Filter': 'filter',
    '/Search': 'search',
    '/Form' : 'lol'   
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
    //console.log('Current location:', location.pathname);
  }, [location]);

  const handleImageClick = (imageName) => {
    if (imageName === 'avatar') {
        setShowRegistrationForm(prevState => !prevState);        
    } else {
        setShowRegistrationForm(false);
        setSelectedImage(imageName);
    }
};
 
  return (
    <>
      {idLoudPrice === uiMain.id && (
        <section className={theme}>
          <section className="foot">
            <section className="footer">
              <section className="cart">
                <Link to="/">
                  <img className={`back-button ${selectedImage === 'home' ? 'sel' : ''}`} 
                  onClick={() => handleImageClick('home')} 
                  src={home} alt="home" />
                </Link>
              </section>

              <section className="cart">
                <Link to="/BookList">
                  <img className={`back-button ${selectedImage === 'category' ? 'sel' : ''}`} 
                  onClick={() => handleImageClick('category')} 
                  src={category} alt="category" />
                </Link>
              </section>

              <section className="cart">
                <Link to="/cart">
                  <img className={`back-button ${selectedImage === 'cart' ? 'sel' : ''}`} 
                  onClick={() => handleImageClick('cart')} 
                  src={carticon} alt="cart" />
                  {totalCount > 0 && (
                    <span className="cartcount rotate"><b>{totalCount}</b></span>
                  )}
                </Link>
              </section>

              <section className="cart">
                <Link to="/Filter">
                  <img className={`back-button ${selectedImage === 'filter' ? 'sel' : ''}`} 
                  onClick={() => handleImageClick('filter')} 
                  src={filter} alt="filter" />
                </Link>
              </section>

              <section className="cart">
                <Link to="/Search">
                  <img className={`back-button ${selectedImage === 'search' ? 'sel' : ''}`} 
                  onClick={() => handleImageClick('search')} 
                  src={search} alt="search" />
                </Link>
              </section>

              <section className="cart">               
                <img className={`back-button ${showRegistrationForm ? 'sel' : ''}`} 
                onClick={() => handleImageClick('avatar')} 
                src={ava} alt="avatar" style={{ cursor: 'pointer' }} />
                {savedLogin && (
                  <span className="cartcount" translate="no"><strong>{savedLogin.slice(0, 2) + '...'}</strong></span>
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
