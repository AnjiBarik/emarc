import React, { useState, useEffect, useRef } from 'react';
import './footer.css';
import { Link, useLocation } from "react-router-dom";
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import RegistrationForm from '../cart/RegistrationForm';

export default function Footer() {
  const { theme, cartItems, totalCount, setTotalCount, savedLogin, uiMain, idLoudPrice, showRegistrationForm, setShowRegistrationForm, fieldState,  message, promo } = React.useContext(BooksContext);

  const {
    filter,
    search,    
    ava,
    carticon,
    home,
    category,
  } = useIcons();

  const [selectedImage, setSelectedImage] = useState(null);

  const location = useLocation();

  const routeToIconMap = useRef({
    '/': 'home',
    '/BookList': 'category',
    '/cart': 'cart',
    '/Filter': 'filter',
    '/Search': 'search',
    '/Form': 'lol',
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
  }, [location]);

  const handleImageClick = (imageName) => {
    if (imageName === 'avatar') {
      setShowRegistrationForm((prevState) => !prevState);
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
              <section className={`cart ${selectedImage === 'home' ? 'sel' : ''}`}>
                <Link className="cart" to="/">                
                  <img
                    className="back-button"
                    onClick={() => handleImageClick('home')}
                    src={home}
                    alt="home"
                  />
                  {fieldState.home && <span className="button-label">{fieldState.home}</span>}
               
                </Link>
              </section>

              <section className={`cart ${selectedImage === 'category' ? 'sel' : ''}`}>
                <Link className="cart" to="/BookList">
                  <img
                    className="back-button"
                    onClick={() => handleImageClick('category')}
                    src={category}
                    alt="category"
                  />
                  {fieldState.category && <span className="button-label">{fieldState.category}</span>}
                </Link>
              </section>

              <section className={`cart ${selectedImage === 'cart' ? 'sel' : ''}`}>
                <Link className="cart" to="/cart">
                  <img
                    className="back-button"
                    onClick={() => handleImageClick('cart')}
                    src={carticon}
                    alt="cart"
                  />
                  {totalCount > 0 && (
                    <span className="cartcount rotate"><b>{totalCount}</b></span>
                  )}
                  {fieldState.carticon && <span className="button-label">{fieldState.carticon}</span>}
                </Link>
              </section>

              <section className={`cart ${selectedImage === 'filter' ? 'sel' : ''}`}>
                <Link className="cart" to="/Filter">
                  <img
                    className="back-button"
                    onClick={() => handleImageClick('filter')}
                    src={filter}
                    alt="filter"
                  />
                  {fieldState.filter && <span className="button-label">{fieldState.filter}</span>}
                </Link>
              </section>

              <section className={`cart ${selectedImage === 'search' ? 'sel' : ''}`}>
                <Link className="cart" to="/Search">
                  <img
                    className="back-button"
                    onClick={() => handleImageClick('search')}
                    src={search}
                    alt="search"
                  />
                  {fieldState.search && <span className="button-label">{fieldState.search}</span>}
                </Link>
              </section>

              <section onClick={() => handleImageClick('avatar')} 
                className={`cart ${showRegistrationForm ? 'sel' : ''}`}>
                <img
                  className="back-button"                  
                  src={ava}
                  alt="avatar"
                  style={{ cursor: 'pointer' }}
                />
                {savedLogin && (
                  <span className="cartcount" translate="no">
                    <strong>{savedLogin.slice(0, 2) + '...'}</strong>
                  </span>
                )}
                {((message && message !=="") || (promo && promo !=="")) && (
                    <span className="back-button button-label rotate"><b>'💬'</b></span>
                  )}
                {fieldState.ava && <span className="button-label">{fieldState.ava}</span>}
              </section>
            </section>
            {showRegistrationForm && <RegistrationForm />}
          </section>
        </section>
      )}
    </>
  );
}