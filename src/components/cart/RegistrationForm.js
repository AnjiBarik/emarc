import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import './form.css';
import { hashPasswordAndUsername } from '../rsacomponent/HashUtils';
import LoadingAnimation from '../utils/LoadingAnimation';
import { useAlertModal } from '../hooks/useAlertModal';
import AuthButtons from './AuthButtons'; 

export default function RegistrationForm() {
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
    savedPassword,
    setVerificationCode,
    uiMain 
  } = useContext(BooksContext);

  const {
    cancel,
    enter,
    useradd,
    logout,
    userok,
    nickname,
    password,
    email,
    chat
  } = useIcons();

  const { showAlert, AlertModalComponent } = useAlertModal();  

  const [formData, setFormData] = useState({
    Name: '',
    Password1: '',
    Email: '',
    VerificationCode: ''
  });
 
  const [isVerification, setIsVerification] = useState(1);
  const [showEmail, setShowEmail] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegistrationFormLokal, setShowRegistrationFormLokal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false); 

  const [googleClientId, setGoogleClientId] = useState('');
  const [facebookAppId, setFacebookAppId] = useState('');
  const [emailFromAuth, setEmailFromAuth] = useState('');  
  const [nameFromAuth, setNameFromAuth] = useState('');

  useEffect(() => {
    if (uiMain.regformGoogleClientID) {
      setGoogleClientId(uiMain.regformGoogleClientID);
    }
    if (uiMain.regformFacebookAppID) {
      setFacebookAppId(uiMain.regformFacebookAppID);
    }
  }, [uiMain.regformGoogleClientID, uiMain.regformFacebookAppID]);  

  // Calling AuthButtons and processing the authorization result
  const handleAuthSuccess = ({ email, name }) => {
  //console.log('Logged in as:', name, email);
   setEmailFromAuth(email);
   setNameFromAuth(name);
   setFormData(prevData => ({ ...prevData, Email: email, Name: name }));
  };
 

  useEffect(() => {
    let newIsVerification;
    let newShowEmail = showRegistrationFormLokal;
  
    if (uiMain.regform === "test") {
      // This is typically used for testing purposes without two-factor authentication
      newIsVerification = showRegistrationFormLokal ? 1 : 2;
    } else if (uiMain.regform === "twofactor") {
      // This is used for both registration and login with two-factor authentication
      newIsVerification = showRegistrationFormLokal ? 11 : 12;
      newShowEmail = showRegistrationFormLokal;
    } else {
      // This is typically used for registration with two-factor authentication and login without it      
      newIsVerification = showRegistrationFormLokal ? 11 : 2;
      newShowEmail = showRegistrationFormLokal;
    }
  
    setIsVerification(newIsVerification);
    setShowEmail(newShowEmail);
  }, [showRegistrationFormLokal, uiMain.regform]);  

  let logoutTimerRef = useRef(null); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLoading(true);

    if (showRegistrationFormLokal && formData.Password1 !== confirmPassword) {
      showAlert('⚠️ Passwords do not match.');
      setSubmitting(false);
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("isVerification", isVerification);
    formDataToSend.append('Name', formData.Name);    
    formDataToSend.append("Password", await hashPasswordAndUsername(formData.Name, formData.Password1));

    showEmail && formDataToSend.append('Email', formData.Email);
    showVerificationCode && formDataToSend.append('VerificationCode', formData.VerificationCode);

    let Urreg = uiMain.Urregform;
    try {
      const response = await fetch(Urreg, { method: "POST", body: formDataToSend });
      const data = await response.text();

      if (data.includes('Verification code sent to your email.')) {
        showAlert('Verification code sent to your email.');
        setShowVerificationCode(true);
        setIsVerification(4);
      }  else if (data.includes('Verification code is incorrect.')) {
        showAlert('Verification code is incorrect.');
        resetForm();
      }
      else if (data.includes('Account is locked due to too many failed attempts.')) {
        showAlert('Account is locked due to too many failed attempts.');
        resetForm();
      } else if (data.includes('Invalid isVerification value.')) {
        showAlert('Something went wrong');
        resetForm();
      } else if (data.includes('Failed to send verification code. Please try again.')) {
        showAlert('Failed to send verification code. Please try again.');
      } else if (data.includes('Email sending quota is near its limit. Please try again later.')) {
        showAlert('Something went wrong. Please try again later.');
      } else if (data.includes('Invalid email address.')) {
        showAlert('Invalid email address.');
      } 
      
      else {
        if (showRegistrationFormLokal) {
          handleRegistrationResponse(data);
        } else {
          handleLoginResponse(data);
        }
      }
      
    } catch (error) {
      showAlert('⚠️Error: ' + error.message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleRegistrationResponse = (data) => {
    if (data.includes('This username already exists. Please choose another one.')) {
      showAlert('This username already exists. Please choose another one');
      resetForm();
    } else if (data.includes('Verification code is incorrect.')) {
      showAlert('Verification code is incorrect.');
      resetForm();
    }
    else if (data.includes('Successful login!')) {
      handleLoginSuccess(data);
    }
    else {
      showAlert("⚠️Registration failed. Please try again.");
    }
  };

  const handleLoginResponse = (data) => {
    if (data === 'Incorrect username or password.') {
      showAlert('⚠️ Incorrect username or password.');
    } else if (data.includes('Verification code is incorrect.')) {
      showAlert('Verification code is incorrect.');
      resetForm();
    } else if (data.includes('User already logged.')) {
      showAlert('User already logged.');
      resetForm();
    }
    else if (data.includes('Successful login!')) {
      handleLoginSuccess(data);
    }
  };

  
  const handleLoginSuccess = (data) => {
    const datamessage = data.replace("Successful login!", "").trim();
    const [receivedMessage, receivedPromo, receivedOrder, verificationCode] = datamessage.split(', ').map(item => item.split(': ')[1]);
    setMessage(receivedMessage || "");
    setPromo(receivedPromo || "");
    setOrder(receivedOrder || "");
    setVerificationCode (verificationCode || "" );
    resetForm();//!
    setLoggedIn(true);
    saveLoginData();
  };

  const resetForm = () => {
    setFormData({ Name: '', Password1: '', Email: '', VerificationCode: '' });
    setConfirmPassword('');
    setSubmitting(false);
  };

  const saveLoginData = () => {
    setSavedLogin(formData.Name);
    setSavedPassword(formData.Password1);
  };

  const handleToggleForm = () => {
    setShowRegistrationFormLokal(!showRegistrationFormLokal);
    setLoggedIn(false);    
  };

  const handleLogout = useCallback(async () => {
    const formDataToLogout = new FormData();
    formDataToLogout.append("isVerification", 5);
    formDataToLogout.append('Name', savedLogin);    
    formDataToLogout.append("Password", await hashPasswordAndUsername(savedLogin, savedPassword)); // Await here as well
    let Urreg = uiMain.Urregform;
    
    try {
      const response = await fetch(Urreg, { method: "POST", body: formDataToLogout });
      const data = await response.text(); // Await here to get the response text properly
      
      if (data === 'Incorrect username or password.') {
        showAlert('⚠️ Incorrect username or password.');
      } else if (data.includes('Logout successful.')) {
        setLoggedIn(false);
        setSavedLogin('');
        setSavedPassword('');
        setPromo('');
        setOrder('');
        setMessage('');
        setShowRegistrationForm(true);
      }
    } catch (error) {
      showAlert('⚠️Error: ' + error.message);
    }
  }, [setLoggedIn, setMessage, setOrder, setPromo, setSavedLogin, setSavedPassword, setShowRegistrationForm, showAlert, savedLogin, savedPassword, uiMain.Urregform]);

  useEffect(() => {
    if (loggedIn) {
      logoutTimerRef.current = setTimeout(() => {
        handleLogout(); //Auto-logout after 20 minutes
      }, 1200000); // 20 * 60 * 1000 20 minutes in milliseconds 1200000
  
      return () => clearTimeout(logoutTimerRef.current); // Clean up the timer when logged out or component unmounts
    }
  }, [loggedIn, handleLogout]);

  const toggleSections = () => setShowRegistrationForm(false);

  return (
    <>
      {AlertModalComponent()}
      {showRegistrationForm && (
        <section className='section-form'>
          {loading && <LoadingAnimation />}
          <div className="registration-form">
          
            {loggedIn ? (
              <div>
                <p><img className="back-button select" src={userok} alt="userok" /> Nickname: {savedLogin}</p>
                <p>{promo !== '#' && promo !== '' && `Your promo code: ${promo}`}</p>
                <p>{message !== '#' && message !== '' && `Your message: ${message}`}</p>
                <hr />
                <div className='filter'>
                  <button onClick={handleLogout} className='sort-button' tabIndex={-1}>
                    <img className="back-button select" src={logout} alt="logout" />
                  </button>
                  <button onClick={toggleSections} className='sort-button' tabIndex={0}>
                    <img src={cancel} alt='cancel' className="back-button select" />
                  </button>
                </div>
              </div>
            ) : (
              <>               
                <div className="tab-container">
    <div
        className={`tab-item ${showRegistrationFormLokal ? 'active-tab' : ''}`}
        onClick={handleToggleForm}
    >
        Log In
    </div>
    <div
        className={`tab-item ${!showRegistrationFormLokal ? 'active-tab' : ''}`}
        onClick={handleToggleForm}
    >
        Create Account
    </div>
</div>    

                <form onSubmit={handleSubmit}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <img className="form-icon select" src={nickname} alt="nickname" />
                        </td>
                        <td>
                          <input
                            className='form-input' autoFocus
                            type="text"
                            name="Name"
                            minLength={4}
                            maxLength={42}
                            placeholder='Nickname'
                            value={formData.Name || nameFromAuth} 
                            onChange={handleInputChange}
                            autoComplete="username"
                            required
                          />
                        </td>
                      </tr>
                      {showEmail && (
                        <>
                        <tr>
                          <td>
                            <img className="form-icon select" src={email} alt="email" />
                          </td>
                          <td>
                            <input
                              className='form-input'
                              type="email"
                              name="Email"
                              maxLength={42}
                              placeholder='Email'                              
                              value={ formData.Email || emailFromAuth } 
                              onChange={handleInputChange}
                              required
                            />
                          </td>
                        </tr> 
                        <tr>                      
                          <td colSpan="2">
                      {/* Inserting AuthButtons */}
            {(googleClientId || facebookAppId) && (
              <AuthButtons
                googleClientId={googleClientId}
                facebookAppId={facebookAppId}
                onSuccess={handleAuthSuccess}
                onError={(error) => showAlert('Error: ' + error.message)}
              />
            )}
                          </td>                       
                        </tr>
                       </>
                      )}
                      <tr>
                        <td>
                          <img className="form-icon select" src={password} alt="password" />
                        </td>
                        <td>
                          <input
                            className='form-input'
                            type="password"
                            minLength={3}
                            maxLength={42}
                            name="Password1"
                            placeholder='Password'
                            value={formData.Password1}
                            onChange={handleInputChange}
                            autoComplete="current-password"
                            required
                          />
                        </td>
                      </tr>
                      {showRegistrationFormLokal && (
                        <tr>
                          <td>
                            <img className="form-icon select" src={password} alt="confirm password" />
                          </td>
                          <td>
                            <input
                              className='form-input'
                              type="password"
                              minLength={3}
                              maxLength={42}
                              placeholder='Confirm Password'
                              value={confirmPassword}
                              onChange={handlePasswordChange}
                              autoComplete="new-password"
                              required
                            />
                          </td>
                        </tr>
                      )}
                      {showVerificationCode && (
                        <tr>                         
                          <td>                            
                            <img className="form-icon select" src={chat} alt="verification code" />
                          </td>
                          <td>
                            <input
                              className='form-input'
                              type="text"
                              maxLength={6}
                              name="VerificationCode"
                              placeholder='Confirm Verification Code'
                              value={formData.VerificationCode}
                              onChange={handleInputChange}
                              required
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>                
                  <div className='filter'>
                    <button type='submit' className='sort-button' disabled={submitting} tabIndex={-1}>                     
                      <img className="back-button select" src={showRegistrationFormLokal ? useradd : enter} alt={showRegistrationFormLokal ? "useradd" : "enter"} />
                    </button>                   
                    <button onClick={toggleSections} className='sort-button' disabled={submitting} tabIndex={0}>
                      <img src={cancel} alt='cancel' className="back-button select" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
          <hr />
        </section>
      )}
    </>
  );
}