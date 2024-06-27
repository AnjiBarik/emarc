import React, { useState, useEffect, useMemo, useContext } from 'react';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import './form.css';
import { hashPasswordAndUsername } from './HashUtils';
import LoadingAnimation from '../utils/LoadingAnimation';  

// import enter from '../cart/img/enter.png';
// import useradd from '../cart/img/useradd.png';
// import logout from '../cart/img/logout.png';
// import cancel from '../cart/img/cancel.png';
// import userok from '../cart/img/userok.png';
// import nickname from '../cart/img/nickname.png';
// import password from '../cart/img/password.png';

export default function RegistrationForm({ isVerification: propIsVerification }) {
  const { 
    showRegistrationForm, 
    setShowRegistrationForm, 
    message, 
    setMessage, 
    promo, 
    setPromo, 
    setOrder,     
    loggedIn, 
    setLoggedIn, 
    savedLogin, 
    setSavedLogin, 
    setSavedPassword, 
    uiMain 
  } = useContext(BooksContext);

  const {
    cancel,
    enter,
    useradd,
    logout,
    userok,
    nickname,
    password, } = useIcons();

  const [formData, setFormData] = useState({
    Name: '',
    Password1: '',
  }); 
  const [formErrors, setFormErrors] = useState({});
  const [isVerification, setIsVerification] = useState(2);
  const [showRegistrationFormLokal, setShowRegistrationFormLokal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsVerification(propIsVerification || 2);
  }, [propIsVerification]);

  const validationPatterns = useMemo(() => ({
    invalidChars: {
      pattern: /[=+"']/,
      message: 'Invalid characters 🚫 [=+"\']'
    },
    invalidName: {
      pattern: (value) => !/[a-zA-Z]{1,}/.test(value),
      message: 'Nickname must contain at least one Latin letter'
    }
  }), []);

  const isSubmitDisabled = () => {   
    return Object.values(formData).some((value) => value === undefined) || Object.values(formErrors).some((error) => error);
  };  
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let errorMessage = '';
    if (validationPatterns.invalidChars.pattern.test(value)) {
      errorMessage = validationPatterns.invalidChars.message;
    } else if (name === 'Name' && validationPatterns.invalidName.pattern(value)) {
      errorMessage = validationPatterns.invalidName.message;
    }

    setFormData({ ...formData, [name]: errorMessage ? undefined : value });
    setFormErrors({ ...formErrors, [name]: errorMessage });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true)
    setLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append("isVerification", isVerification);
    formDataToSend.append('Name', formData.Name);
    formDataToSend.append("Password", await hashPasswordAndUsername(formData.Name, formData.Password1));

    try {
      const response = await fetch(uiMain.Urregform, { method: "POST", body: formDataToSend });
      const data = await response.text();

      if (isVerification === 1) {
        handleRegistrationResponse(data);
      } else {
        handleLoginResponse(data);
      }
    } catch (error) {
      alert('⚠️Error: ' + error.message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleRegistrationResponse = (data) => {
    if (data.includes('Thank you for successful registration!')) {
      alert('Thank you for successful registration!');
      resetForm();
      setLoggedIn(true);
      saveLoginData();
    } else if (data.includes('This username already exists. Please choose another one.')) {
      alert('This username already exists. Please choose another one');
      resetForm();
    } else {
      alert("⚠️Registration failed. Please try again.");
    }
  };

  const handleLoginResponse = (data) => {
    if (data === 'Incorrect username or password.') {
      alert('⚠️Incorrect username or password.');
    } else {
      const [receivedMessage, receivedPromo, receivedOrder] = data.split(', ').map(item => item.split(': ')[1]);
      setMessage(receivedMessage || "");
      setPromo(receivedPromo || "");
      setOrder(receivedOrder || "");
      setLoggedIn(true);
      saveLoginData();
    }
  };

  const resetForm = () => {
    setFormData({ Name: '', Password1: '' });
    setSubmitting(false);
  };

  const saveLoginData = () => {
    setSavedLogin(formData.Name);
    setSavedPassword(formData.Password1);
  };

  const handleToggleForm = () => {
    setIsVerification(isVerification === 1 ? 2 : 1);
    setShowRegistrationFormLokal(!showRegistrationFormLokal);
    setLoggedIn(false);    
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setSavedLogin('');
    setSavedPassword('');
    setPromo('');
    setOrder('');
    setMessage('');
    setShowRegistrationForm(true);
  };

  const toggleSections = () => setShowRegistrationForm(false);
  
  const errorMessages = [...new Set(Object.values(formErrors))].map((errorMessage, index) => {
    return errorMessage && <p key={index} className="error-message">{errorMessage}</p>;
  });

  return (
    <>
      {showRegistrationForm && (
        <section className='section-form'>
          {loading && <LoadingAnimation />}
          <div className="registration-form">
            <hr />
            {loggedIn ? (
              <div>
                <p><img className="back-button" src={userok} alt="userok" /> Nickname: {savedLogin}</p>
                <p>{promo !== '#' && promo !== '' && `Your promo code: ${promo}`}</p>
                <p>{message !== '#' && message !== '' && `Your message: ${message}`}</p>
                <hr />
                <div className='filter'>
                  <button onClick={handleLogout} className='form-button' tabIndex={-1}>
                    <img className="back-button" src={logout} alt="logout" />
                  </button>
                  <button onClick={toggleSections} className='form-button' tabIndex={0}>
                    <img  src={cancel} alt='cancel' className="back-button" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2>{showRegistrationFormLokal ? 'Create Account' : 'Log In'}</h2>
                <form onSubmit={handleSubmit}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <img className="back-button" src={nickname} alt="nickname" />
                        </td>
                        <td>
                          <input
                            className='form-input' autoFocus
                            type="text"
                            name="Name"
                            minLength={4}
                            maxLength={42}
                            placeholder='Nickname'
                            defaultValue={formData.Name}
                            onChange={handleInputChange}
                            autoComplete="username"
                            required
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img className="back-button" src={password} alt="password" />
                        </td>
                        <td>
                          <input
                            className='form-input'
                            type="password"
                            minLength={3}
                            maxLength={42}
                            name="Password1"
                            placeholder='Password'
                            defaultValue={formData.Password1}
                            onChange={handleInputChange}
                            autoComplete="current-password"
                            required
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>                 
                  {errorMessages}
                  <button className='form-button' type="submit" disabled={isSubmitDisabled() || submitting} >
                    <img className="back-button" style={{ cursor: isSubmitDisabled() || submitting ? 'not-allowed' : 'pointer' }} src={showRegistrationFormLokal ? useradd : enter} alt={showRegistrationFormLokal ? "useradd" : "enter"} />
                    <b>{showRegistrationFormLokal ? "Create Account" : "Log In"}</b>
                  </button>
                </form>
                <hr />
                <div className='filter'>
                  <button className='form-button' onClick={handleToggleForm}>
                    {showRegistrationFormLokal ? (
                      <><img className="back-button" src={enter} alt="enter" /> <b> Log In </b></>
                    ) : (
                      <><img className="back-button" src={useradd} alt="useradd" /> <b>Create Account </b></>
                    )}
                  </button>
                  <button className='form-button' onClick={toggleSections}>
                    <img src={cancel} alt='cancel' className="back-button" />
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
};



