import React, { useState, useEffect } from 'react';
import { BooksContext } from '../../BooksContext';
//import { Link } from 'react-router-dom';
import './form.css';
import { hashPasswordAndUsername } from './HashUtils';
import LoadingAnimation from '../utils/LoadingAnimation';  
import enter from '../cart/img/enter.png';
import useradd from '../cart/img/useradd.png';
import logout from '../cart/img/logout.png';
import cancel from '../cart/img/cancel.png';
import userok from '../cart/img/userok.png';
import nickname from '../cart/img/nickname.png';
import password from '../cart/img/password.png';


export default function RegistrationForm({ isVerification: propIsVerification }) {
  const { showRegistrationForm, setShowRegistrationForm, message, setMessage, promo, setPromo, setOrder, order, loggedIn, setLoggedIn, savedLogin, setSavedLogin, setSavedPassword, uiMain } = React.useContext(BooksContext);
  const [formData, setFormData] = useState({
    Name: '',
    Password1: '',
  });
  const [invalidInput, setInvalidInput] = useState(false);
  const [invalidChars, setInvalidChars] = useState(false);
  const [isVerification, setIsVerification] = useState(2);
  const [showRegistrationFormLokal, setShowRegistrationFormLokal] = useState(isVerification === 1);
  //const [showSections, setShowSections] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsVerification(propIsVerification || 2);
  }, [propIsVerification]);

  const toggleSections = () => setShowRegistrationForm(prevState => !prevState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (/[=+"']/.test(value) || value.length > 42 || (name === 'Password1' && /[=+"']/.test(value))) {
      setInvalidChars(true);
    } else {
      setInvalidChars(false);
      setFormData({ ...formData, [name]: value });
    }
  };

  const isSubmitDisabled = () => {
    return (
      (!isVerification && Object.values(formData).some((value) => value === '')) ||
      invalidChars
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!isVerification && isSubmitDisabled()) {
      setInvalidInput(true);
      return;
    } else {
      setInvalidInput(false);
    }

    formData.isVerification = isVerification;

    setSubmitting(true);

    const apiUrl = uiMain.Urregform;

    const formDatab = new FormData();
    // Добавление имени и хешированного пароля в объект FormData
    formDatab.append("isVerification", isVerification);
    formDatab.append('Name', formData.Name);
    formDatab.append("Password", await hashPasswordAndUsername(formData.Name, formData.Password1));

    fetch(apiUrl, {
      method: "POST",
      body: formDatab,
    })
      .then((response) => response.text())
      .then((data) => {
        // Обработка ответа
        if (isVerification === 1) {
          // Обработка ответа для регистрации
          if (data.includes('Thank you for successful registration!')) {
            alert('Thank you for successful registration!')
            setSubmitting(false);
            setFormData({
              Name: '',
              Password1: '',
            });
            setLoggedIn(true);
            setSavedLogin(formData.Name);
            setSavedPassword(formData.Password1);
          } else if (data.includes('This username already exists. Please choose another one.')) {
            alert('This username already exists. Please choose another one');
            setSubmitting(false);
            setFormData({
              ...formData,
              Name: '',
              Password1: '',
            });
          } else {
            alert("⚠️Registration failed. Please try again.");
            setSubmitting(false);
          }
        } else if (isVerification === 2) {
          // Обработка ответа для входа
          if (data === 'Incorrect username or password.') {
            alert('⚠️Incorrect username or password.');
            setSubmitting(false);
          } else {
            const dataArray = data.split(', ');
            const receivedMessage = dataArray[0].split(': ')[1];
            const receivedPromo = dataArray[1].split(': ')[1];
            const receivedOrder = dataArray[2].split(': ')[1];
            
            setMessage(receivedMessage||"");
            setPromo(receivedPromo||"");
            setOrder(receivedOrder||"");
            setSubmitting(false);
            setLoggedIn(true);
            setSavedLogin(formData.Name);
            setSavedPassword(formData.Password1);
          }
        }
      })
      .catch((error) => {
        alert('⚠️Error: ' + error.message);
        setSubmitting(false);
        setShowRegistrationForm(true)
      })
      .finally(() => {
        setLoading(false);       
      });
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
    setShowRegistrationForm(true)
  };

  return (
    <>
    
      {showRegistrationForm && (
       
        <section className='section-form'> 
         {loading && <LoadingAnimation />}
          <div className="registration-form">
            {/* <img src={cancel} alt='cancel' className="back-button selected" onClick={toggleSections}/> */}
            <hr />
            {loggedIn ? (
              <div>
                <p><img className="back-button" src={userok} alt="userok" />  {savedLogin}</p>
                <p>{promo !== '#' && promo !== '' && `Your promo code: ${promo}`}</p>
                <p>{message !== '#' && message !== '' && `Your message: ${message}`}</p>
                <hr />
                <div className='filter'>
                {/* <Link to="/" > */}
                  <button  onClick={handleLogout}> <img className="back-button selected" src={logout} alt="logout" /> </button>
                {/* </Link> */}
                <img src={cancel} alt='cancel' className="back-button selected" onClick={toggleSections}/>
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
                            placeholder='Nickname'
                            value={formData.Name}
                            onChange={handleInputChange}
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
                            name="Password1"
                            placeholder='Password'
                            defaultValue={formData.Password1}
                            onChange={handleInputChange}
                            required
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {invalidInput && <p className="error-message">Please fill out all fields and avoid using invalid characters.📝</p>}
                  {invalidChars && <p className="error-message">Invalid characters 🚫 (=, +, ", ').</p>}
                  {showRegistrationFormLokal && (!/[a-zA-Z]/.test(formData.Name) || /[=+"']/.test(formData.Name)) && <p className="filter">Name must contain at least one Latin letter</p>}
                  <button className='form-button' type="submit" disabled={isSubmitDisabled() || submitting}>
                    {showRegistrationFormLokal ?  <img className="back-button" src={useradd} alt="useradd" />  :  <img className="back-button" src={enter} alt="enter" />}
                  </button>
                </form>
                <hr />
                <div className='filter'>
                <button className='form-button' onClick={handleToggleForm}>
                  {showRegistrationFormLokal ?  (
                    <><img className="back-button" src={enter} alt="enter" /> <b> Log In </b>
                   
                    </>
                  ) : (
                    <><img className="back-button" src={useradd} alt="useradd" /> Create Account </>
                  )}
                </button>
                <img src={cancel} alt='cancel' className="back-button selected" onClick={toggleSections}/>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
};


// import React, { useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// import './form.css';
// import { hashPasswordAndUsername } from './HashUtils';
// import enter from '../cart/img/enter.png';
// import useradd from '../cart/img/useradd.png';
// import logout from '../cart/img/logout.png';
// import cancel from '../cart/img/cancel.png';
// import userok from '../cart/img/userok.png';
// import nickname from '../cart/img/nickname.png';
// import password from '../cart/img/password.png';


// export default function RegistrationForm({ isVerification: propIsVerification }) {
//   const {  message, setMessage, promo, setPromo, setOrder, order, loggedIn, setLoggedIn, savedLogin, setSavedLogin, setSavedPassword, uiMain } = React.useContext(BooksContext);
//   const [formData, setFormData] = useState({
//     Name: '',
//     Password1: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isVerification, setIsVerification] = useState(2);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(isVerification === 1);
//   const [showSections, setShowSections] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     setIsVerification(propIsVerification || 2);
//   }, [propIsVerification]);

//   const toggleSections = () => setShowSections(prevState => !prevState);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (/[=+"']/.test(value) || value.length > 42 || (name === 'Password1' && /[=+"']/.test(value))) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isVerification && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isVerification && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     formData.isVerification = isVerification;

//     setSubmitting(true);

//     const apiUrl = uiMain.Urregform;

//     const formDatab = new FormData();
//     // Добавление имени и хешированного пароля в объект FormData
//     formDatab.append("isVerification", isVerification);
//     formDatab.append('Name', formData.Name);
//     formDatab.append("Password", await hashPasswordAndUsername(formData.Name, formData.Password1));

//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab,
//     })
//       .then((response) => response.text())
//       .then((data) => {
//         // Обработка ответа
//         if (isVerification === 1) {
//           // Обработка ответа для регистрации
//           if (data.includes('Thank you for successful registration!')) {
//             alert('Thank you for successful registration!')
//             setSubmitting(false);
//             setFormData({
//               Name: '',
//               Password1: '',
//             });
//             setLoggedIn(true);
//             setSavedLogin(formData.Name);
//             setSavedPassword(formData.Password1);
//           } else if (data.includes('This username already exists. Please choose another one.')) {
//             alert('This username already exists. Please choose another one');
//             setSubmitting(false);
//             setFormData({
//               ...formData,
//               Name: '',
//               Password1: '',
//             });
//           } else {
//             alert("⚠️Registration failed. Please try again.");
//             setSubmitting(false);
//           }
//         } else if (isVerification === 2) {
//           // Обработка ответа для входа
//           if (data === 'Incorrect username or password.') {
//             alert('⚠️Incorrect username or password.');
//             setSubmitting(false);
//           } else {
//             const dataArray = data.split(', ');
//             const receivedMessage = dataArray[0].split(': ')[1];
//             const receivedPromo = dataArray[1].split(': ')[1];
//             const receivedOrder = dataArray[2].split(': ')[1];
            
//             setMessage(receivedMessage||"");
//             setPromo(receivedPromo||"");
//             setOrder(receivedOrder||"");
//             setSubmitting(false);
//             setLoggedIn(true);
//             setSavedLogin(formData.Name);
//             setSavedPassword(formData.Password1);
//           }
//         }
//       })
//       .catch((error) => {
//         alert('⚠️Error: ' + error.message);
//         setSubmitting(false);
//         setShowSections(true)
//       });
//   };

//   const handleToggleForm = () => {
//     setIsVerification(isVerification === 1 ? 2 : 1);
//     setShowRegistrationForm(!showRegistrationForm);
//     setLoggedIn(false);
//   };

//   const handleLogout = () => {
//     setLoggedIn(false);
//     setSavedLogin('');
//     setSavedPassword('');
//     setPromo('');
//     setOrder('');
//     setMessage('');
//     setShowSections(true)
//   };

//   return (
//     <>
//       {!showSections && (
//         <section className='section-form'> 
//           <div className="registration-form">
//             {/* <img src={cancel} alt='cancel' className="back-button selected" onClick={toggleSections}/> */}
//             <hr />
//             {loggedIn ? (
//               <div>
//                 <p><img className="back-button" src={userok} alt="userok" />  {savedLogin}</p>
//                 <p>{promo !== '#' && promo !== '' && `Your promo code: ${promo}`}</p>
//                 <p>{message !== '#' && message !== '' && `Your message: ${message}`}</p>
//                 <hr />
//                 <div className='filter'>
//                 <Link to="/" >
//                   <button  onClick={handleLogout}> <img className="back-button selected" src={logout} alt="logout" /> </button>
//                 </Link>
//                 <img src={cancel} alt='cancel' className="back-button selected" onClick={toggleSections}/>
//                 </div>
//               </div>
//             ) : (
//               <>
                
//                 <h2>{showRegistrationForm ? 'Create Account' : 'Log In'}</h2>
               
//                 <form onSubmit={handleSubmit}>
//                   <table>
//                     <tbody>
//                       <tr>
//                         <td>
//                           <img className="back-button" src={nickname} alt="nickname" />
//                         </td>
//                         <td>
//                           <input
//                             className='form-input' autoFocus
//                             type="text"
//                             name="Name"
//                             placeholder='Nickname'
//                             value={formData.Name}
//                             onChange={handleInputChange}
//                             required
//                           />
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <img className="back-button" src={password} alt="password" />
//                         </td>
//                         <td>
//                           <input
//                             className='form-input'
//                             type="password"
//                             name="Password1"
//                             placeholder='Password'
//                             defaultValue={formData.Password1}
//                             onChange={handleInputChange}
//                             required
//                           />
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                   {invalidInput && <p className="error-message">Please fill out all fields and avoid using invalid characters.📝</p>}
//                   {invalidChars && <p className="error-message">Invalid characters 🚫 (=, +, ", ').</p>}
//                   {(!/[a-zA-Z]/.test(formData.Name) || /[=+"']/.test(formData.Name)) && <p className="filter">Name must contain at least one Latin letter</p>}
//                   <button className='form-button' type="submit" disabled={isSubmitDisabled() || submitting}>
//                     {showRegistrationForm ?  <img className="back-button" src={useradd} alt="useradd" />  :  <img className="back-button" src={enter} alt="enter" />}
//                   </button>
//                 </form>
//                 <hr />
//                 <div className='filter'>
//                 <button className='form-button' onClick={handleToggleForm}>
//                   {showRegistrationForm ?  (
//                     <><img className="back-button" src={enter} alt="enter" /> <b> Log In </b>
                   
//                     </>
//                   ) : (
//                     <><img className="back-button" src={useradd} alt="useradd" /> Create Account </>
//                   )}
//                 </button>
//                 <img src={cancel} alt='cancel' className="back-button selected" onClick={toggleSections}/>
//                 </div>
//               </>
//             )}
//           </div>
//         </section>
//       )}
//     </>
//   );
// };

// import React, { useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// import { SHA256 } from 'crypto-js';
// import './form.css';
// import enter from '../cart/img/enter.png';
// import useradd from '../cart/img/useradd.png';
// import logout from '../cart/img/logout.png';
// import cancel from '../cart/img/cancel.png';
// import userok from '../cart/img/userok.png';
// import nickname from '../cart/img/nickname.gif';
// import password from '../cart/img/password.gif';

// export default function RegistrationForm({ isVerification: propIsVerification }) {
//   const { message, setMessage, promo, setPromo, setOrder, order, loggedIn, setLoggedIn, savedLogin, setSavedLogin, setSavedPassword, uiMain } = React.useContext(BooksContext);
//   const [formData, setFormData] = useState({
//     Name: '',
//     Password1: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isVerification, setIsVerification] = useState(2);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(isVerification === 1);
//   const [showSections, setShowSections] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     setIsVerification(propIsVerification || 2);
//   }, [propIsVerification]);

//   const toggleSections = () => setShowSections(prevState => !prevState);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (/[=+"']/.test(value) || value.length > 42 || (name === 'Password1' && /[=+"']/.test(value))) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isVerification && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!isVerification && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     formData.isVerification = isVerification;

//     setSubmitting(true);

//     const apiUrl = uiMain.Urregform;

//     const formDatab = new FormData();
//     // Добавление имени и хешированного пароля в объект FormData
//     formDatab.append("isVerification", isVerification);
//     formDatab.append('Name', formData.Name);
//     formDatab.append("Password", SHA256(formData.Password1).toString());

//     // Добавление дополнительных данных, если нужно
//     // formDatab.append("Phone", "#");
//     // formDatab.append("Email", "#");
//     // formDatab.append("Message", "#");
//     // formDatab.append("Promo", "#");
//     // formDatab.append("Order", "#");
    

//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab,
//     })
//       .then((response) => response.text())
//       .then((data) => {
//         // Обработка ответа
//         if (isVerification === 1) {
//           // Обработка ответа для регистрации
//           if (data.includes('Thank you for successful registration!')) {
//             alert('Thank you for successful registration!')
//             setSubmitting(false);
//             setFormData({
//               Name: '',
//               Password1: '',
//             });
//             setLoggedIn(true);
//             setSavedLogin(formData.Name);
//             setSavedPassword(formData.Password1);
//           } else if (data.includes('This username already exists. Please choose another one.')) {
//             alert('This username already exists. Please choose another one');
//             setSubmitting(false);
//             setFormData({
//               ...formData,
//               Name: '',
//               Password1: '',
//             });
//           } else {
//             alert("⚠️Registration failed. Please try again.");
//             setSubmitting(false);
//           }
//         } else if (isVerification === 2) {
//           // Обработка ответа для входа
//           if (data === 'Incorrect username or password.') {
//             alert('⚠️Incorrect username or password.');
//             setSubmitting(false);
//           } else {
//             //const [, receivedMessage, receivedPromo, receivedOrder] = data.match(/Message: (.+), Promo: (.+), Order: (.+)/) || [];
//             //const [, receivedMessage = "", receivedPromo = "", receivedOrder= "" ] = data.match(/Message: (.+), Promo: (.+), Order: (.+)/) || [];
            
//             const dataArray = data.split(', ');
// const receivedMessage = dataArray[0].split(': ')[1];
// const receivedPromo = dataArray[1].split(': ')[1];
// const receivedOrder = dataArray[2].split(': ')[1];

            
//             console.log(receivedMessage)
//             console.log(receivedPromo)
//             console.log(receivedOrder)
              
//               setMessage(receivedMessage||"");
//               setPromo(receivedPromo||"");
//               setOrder(receivedOrder||"");
//               setSubmitting(false);
//               setLoggedIn(true);
//               setSavedLogin(formData.Name);
//               setSavedPassword(formData.Password1);
            
//             // if (receivedMessage !== undefined) {
//             //   setMessage(receivedMessage);
//             //   setPromo(receivedPromo);
//             //   setOrder(receivedOrder);
//             //   setLoggedIn(true);
//             //   setSavedLogin(formData.Name);
//             //   setSavedPassword(formData.Password1);
//             // } else {
//             //   alert('Welcome! (No additional information available)');
//             //   setSubmitting(false);
//             //   setLoggedIn(true);
//             //   setSavedLogin(formData.Name);
//             //   setSavedPassword(formData.Password1);
//             // }
//           }
//         }
//       })
//       .catch((error) => {
//         alert('⚠️Error: ' + error.message);
//         setSubmitting(false);
//         setShowSections(true)
//       });
//   };
// console.log(submitting)
//   const handleToggleForm = () => {
//     setIsVerification(isVerification === 1 ? 2 : 1);
//     setShowRegistrationForm(!showRegistrationForm);
//     setLoggedIn(false);
//   };

//   const handleLogout = () => {
//     setLoggedIn(false);
//     setSavedLogin('');
//     setSavedPassword('');
//     setPromo('');
//     setOrder('');
//     setMessage('');
//     setShowSections(true)
//   };

//   return (
//     <>
//       {!showSections && (
//         <section className='section-form'> 
//           <div className="registration-form">
//             <img src={cancel} alt='cancel' className="back-button selected" onClick={toggleSections}/>
//             <hr />
//             {loggedIn ? (
//               <div>
//                 <p><img className="back-button" src={userok} alt="userok" />  {savedLogin}</p>
//                 <p>{promo !== '#' && promo !== '' && `Your promo code: ${promo}`}</p>
//                 <p>{message !== '#' && message !== '' && `Your message: ${message}`}</p>
//                 <Link to="/" className="back-button">
//                   <button className="form-button" onClick={handleLogout}> <img className="back-button" src={logout} alt="logout" /> </button>
//                 </Link>
//               </div>
//             ) : (
//               <>
//                 <h2>{showRegistrationForm ? 'Create Account' : 'Log In'}</h2>
//                 <form onSubmit={handleSubmit}>
//                   <table>
//                     <tbody>
//                       <tr>
//                         <td>
//                           <img className="back-button" src={nickname} alt="nickname" />
//                         </td>
//                         <td>
//                           <input
//                             className='form-input' autoFocus
//                             type="text"
//                             name="Name"
//                             placeholder='Nickname'
//                             value={formData.Name}
//                             onChange={handleInputChange}
//                           />
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <img className="back-button" src={password} alt="password" />
//                         </td>
//                         <td>
//                           <input
//                             className='form-input'
//                             type="password"
//                             name="Password1"
//                             placeholder='Password'
//                             defaultValue={formData.Password1}
//                             onChange={handleInputChange}
//                           />
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                   {invalidInput && <p className="error-message">Please fill out all fields and avoid using invalid characters.📝</p>}
//                   {invalidChars && <p className="error-message">Invalid characters 🚫 (=, +, ", ').</p>}
//                   {(!/[a-zA-Z]/.test(formData.Name) || /[=+"']/.test(formData.Name)) && <p className="error-message">Name must contain at least one Latin letter and🚫 (= + " ')</p>}
//                   <button className='form-button' type="submit" disabled={isSubmitDisabled() || submitting}>
//                     {showRegistrationForm ?  <img className="back-button" src={useradd} alt="useradd" />  :  <img className="back-button" src={enter} alt="enter" />}
//                   </button>
//                 </form>
//                 <hr />
//                 <button className='form-button' onClick={handleToggleForm}>
//                   {showRegistrationForm ?  (
//                     <><img className="back-button" src={enter} alt="enter" /> Log In </>
//                   ) : (
//                     <><img className="back-button" src={useradd} alt="useradd" /> Create Account </>
//                   )}
//                 </button>
//               </>
//             )}
//           </div>
//         </section>
//       )}
//     </>
//   );
// };



// import React, { useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// import { SHA256 } from 'crypto-js';
// import './form.css';
// import enter from '../cart/img/enter.png';
// import useradd from '../cart/img/useradd.png';
// import logout from '../cart/img/logout.png';
// import cancel from '../cart/img/cancel.png';
// import userok from '../cart/img/userok.png';
// import nickname from '../cart/img/nickname.gif';
// import password from '../cart/img/password.gif';

// export default function RegistrationForm({ isVerification: propIsVerification }) {
//   const { message, setMessage, promo, setPromo, setOrder, order, loggedIn, setLoggedIn, savedLogin, setSavedLogin, setSavedPassword, uiMain } = React.useContext(BooksContext);
//   const [formData, setFormData] = useState({
//     Name: '',
//     Password1: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isVerification, setIsVerification] = useState(2);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(isVerification === 1);
//   const [showSections, setShowSections] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     setIsVerification(propIsVerification || 2);
//   }, [propIsVerification]);

//   const toggleSections = () => setShowSections(prevState => !prevState);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (/[=+"']/.test(value) || value.length > 42 || (name === 'Password1' && /[=+"']/.test(value))) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isVerification && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!isVerification && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     formData.isVerification = isVerification;

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);
//     setSubmitting(true); 

//     const apiUrl = uiMain.Urregform;

//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         if (isVerification === 1) {
//           if (data.includes('Thank you for successful registration!')) {
//             alert('Thank you for successful registration!')
//             setFormData({
//               Name: '',
//               Password1: '',
//             });

//             setLoggedIn(true);
//             setSavedLogin(formData.Name);
//             setSavedPassword(formData.Password1);

//           } else if (data.includes('This username already exists. Please choose another one.')) {
//             alert('This username already exists. Please choose another one');
//             setSubmitting(false);
//             setFormData({
//               ...formData,
//               Name: '',
//               Password1: '',
//             });
//           } else {
//             alert("⚠️Registration failed. Please try again.");
//           }
//         } else if (isVerification === 2) {
//           if (data === 'Incorrect username or password.') {
//             alert('⚠️Incorrect username or password.');
//             setSubmitting(false);
//           } else {
//             const [, receivedMessage, receivedPromo, receivedOrder] = data.match(/Message: (.+), Promo: (.+), Order: (.+)/) || [];

//             if (receivedMessage !== undefined) {
//               setMessage(receivedMessage);
//               setPromo(receivedPromo);
//               setOrder(receivedOrder);
//               setLoggedIn(true);
//               setSavedLogin(formData.Name);
//               setSavedPassword(formData.Password1);
//             } else {
//               alert('Welcome! (No additional information available)');
//             }
//           }
//         }
//       })
//       .catch(error => {
//         alert('⚠️Error: ' + error.message);
//         setSubmitting(false);
//       });
//   };

//   const handleToggleForm = () => {
//     setIsVerification(isVerification === 1 ? 2 : 1);
//     setShowRegistrationForm(!showRegistrationForm);
//     setLoggedIn(false);
//   };

//   const handleLogout = () => {
//     setLoggedIn(false);
//     setSavedLogin('');
//     setSavedPassword('');
//     setPromo('');
//     setOrder('');
//     setMessage('');
//   };
//   console.log(order)
//   console.log(isVerification)
//   return (
//     <>
//       {!showSections && (
//         <section className='section-form'> 
//           <div className="registration-form">
//             <img src={cancel} alt='cancel' className="back-button selected" onClick={toggleSections}/>
//             <hr />
//             {loggedIn ? (
//               <div>
//                 <p><img className="back-button" src={userok} alt="userok" />  {savedLogin}</p>
//                 <p>{promo !== '#' && promo !== '' && `Ваш промокод: ${promo}`}</p>
//                 <p>{message !== '#' && message !== '' && `Your message: ${message}`}</p>
//                 <Link to="/" className="back-button">
//                   <button className="form-button" onClick={handleLogout}> <img className="back-button" src={logout} alt="logout" /> </button>
//                 </Link>
//               </div>
//             ) : (
//               <>
//                 <h2>{showRegistrationForm ? 'Create Account' : 'Log In'}</h2>
//                 <form onSubmit={handleSubmit}>
//                   <table>
//                     <tbody>
//                       <tr>
//                         <td>
//                           <img className="back-button" src={nickname} alt="nickname" />
//                         </td>
//                         <td>
//                           <input
//                             className='form-input' autoFocus
//                             type="text"
//                             name="Name"
//                             placeholder='Nickname'
//                             value={formData.Name}
//                             onChange={handleInputChange}
//                           />
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <img className="back-button" src={password} alt="password" />
//                         </td>
//                         <td>
//                           <input
//                             className='form-input'
//                             type="password"
//                             name="Password1"
//                             placeholder='Password'
//                             defaultValue={formData.Password1}
//                             onChange={handleInputChange}
//                           />
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                   <input
//                     type="hidden"
//                     name="Password"
//                     value={SHA256(formData.Password1).toString()}
//                   />
//                   <input type="hidden" name="Phone" value={"#"} />
//                   <input type="hidden" name="Email" value={"#"} />                  
//                   <input type="hidden" name="Message" value={"#"} />
//                   <input type="hidden" name="Promo" value={"#"} />
//                   <input type="hidden" name="Order" value={"#"} />
//                   <input type="hidden" name="isVerification" value={isVerification} />
//                   {invalidInput && <p className="error-message">Please fill out all fields and avoid using invalid characters.📝</p>}
//                   {invalidChars && <p className="error-message">Invalid characters 🚫 (=, +, ", ').</p>}
//                   {(!/[a-zA-Z]/.test(formData.Name) || /[=+"']/.test(formData.Name)) && <p className="error-message">Name must contain at least one Latin letter and🚫 (= + " ')</p>}
//                   <button className='form-button' type="submit" disabled={isSubmitDisabled()|| submitting}>
//                     {showRegistrationForm ?  <img className="back-button" src={useradd} alt="useradd" />  :  <img className="back-button" src={enter} alt="enter" />}
//                   </button>
//                 </form>
//                 <hr />
//                 <button className='form-button' onClick={handleToggleForm}>
//                   {showRegistrationForm ?  (
//                     <><img className="back-button" src={enter} alt="enter" /> Log In </>
//                   ) : (
//                     <><img className="back-button" src={useradd} alt="useradd" /> Create Account </>
//                   )}
//                 </button>
//               </>
//             )}
//           </div>
//         </section>
//       )}
//     </>
//   );
// };



// import React, { useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// import { SHA256 } from 'crypto-js';
// import './form.css';
// import enter from '../cart/img/enter.png';
// import useradd from '../cart/img/useradd.png';
// import logout from '../cart/img/logout.png';
// import cancel from '../cart/img/cancel.png';
// import userok from '../cart/img/userok.png';
// import nickname from '../cart/img/nickname.gif';
// import password from '../cart/img/password.gif';

// export default function RegistrationForm ({ isVerification: propIsVerification })  {
//   const { message, setMessage, promo, setPromo, setOrder, loggedIn, setLoggedIn, savedLogin, setSavedLogin, setSavedPassword, uiMain } = React.useContext(BooksContext);
//   const [formData, setFormData] = useState({
//     Name: '',
//     Password1: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isVerification, setIsVerification] = useState(2);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(isVerification === 1);
//   const [showSections, setShowSections] = useState(false);

//   useEffect(() => {
//     setIsVerification(propIsVerification || 2);
//   }, [propIsVerification]);

//   const toggleSections = () => setShowSections(prevState => !prevState);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (/[=+"']/.test(value) || value.length > 42 || (name === 'Name' && !/[a-zA-Z]/.test(value)) || (name === 'Password1' && !/[a-zA-Z]/.test(value))) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isVerification && Object.values(formData).some((value) => value === '')) ||
//       invalidChars ||
//       !/[a-zA-Z]/.test(formData.Name) || // Проверка на наличие хотя бы одной латинской буквы в имени
//       !/[a-zA-Z]/.test(formData.Password1) // Проверка на наличие хотя бы одной латинской буквы в пароле
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!isVerification && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     formData.isVerification = isVerification;

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     const apiUrl = uiMain.Urregform;

//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         if (isVerification === 1) {
//           if (data.includes('Thank you for successful registration!')) {
//             setFormData({
//               Name: '',
//               Password1: '',
//             });

//             setLoggedIn(true);
//             setSavedLogin(formData.Name);
//             setSavedPassword(formData.Password1);

//           } else if (data.includes('This username already exists. Please choose another one.')) {
//             alert('This username already exists. Please choose another one');
//             setFormData({
//               ...formData,
//               Name: '',
//               Password1: '',
//             });
//           } else {
//             alert("⚠️Registration failed. Please try again.");
//           }
//         } else if (isVerification === 2) {
//           if (data === 'Incorrect username or password.') {
//             alert('⚠️Incorrect username or password.');
//           } else {
//             const [, receivedMessage, receivedPromo, receivedOrder] = data.match(/Message: (.+), Promo: (.+), Order: (.+)/) || [];

//             if (receivedMessage !== undefined) {
//               setMessage(receivedMessage);
//               setPromo(receivedPromo);
//               setOrder(receivedOrder);
//               setLoggedIn(true);
//               setSavedLogin(formData.Name);
//               setSavedPassword(formData.Password1);
//             } else {
//               alert('Welcome! (No additional information available)');
//             }
//           }
//         }
//       })
//       .catch(error => {
//         alert('⚠️Error: ' + error.message);
//       });
//   };

//   const handleToggleForm = () => {
//     setIsVerification(isVerification === 1 ? 2 : 1);
//     setShowRegistrationForm(!showRegistrationForm);
//     setLoggedIn(false);
//   };

//   const handleLogout = () => {
//     setLoggedIn(false);
//     setSavedLogin('');
//     setSavedPassword('');
//     setPromo('');
//     setOrder('');
//     setMessage('');
//   };
  
//   return (
//     <>
//       {!showSections && (
//         <section className='section-form'> 
//           <div className="registration-form">
//             <img src={cancel} alt='cancel' className="back-button selected" onClick={toggleSections}/>
//             <hr />
//             {loggedIn ? (
//               <div>
//                 <p><img className="back-button" src={userok} alt="userok" />  {savedLogin}</p>
//                 <p>{promo !== '#' && promo !== '' && `Ваш промокод: ${promo}`}</p>
//                 <p>{message !== '#' && message !== '' && `Your message: ${message}`}</p>
//                 <Link to="/" className="back-button">
//                   <button className="form-button" onClick={handleLogout}> <img className="back-button" src={logout} alt="logout" /> </button>
//                 </Link>
//               </div>
//             ) : (
//               <>
//                 <h2>{showRegistrationForm ? 'Create Account' : 'Log In'}</h2>
//                 <form onSubmit={handleSubmit}>
//                   <table>
//                     <tbody>
//                       <tr>
//                         <td>
//                           <img className="back-button" src={nickname} alt="nickname" />
//                         </td>
//                         <td>
//                           <input
//                             className='form-input' autoFocus
//                             type="text"
//                             name="Name"
//                             placeholder='Nickname'
//                             value={formData.Name}
//                             onChange={handleInputChange}
//                           />
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <img className="back-button" src={password} alt="password" />
//                         </td>
//                         <td>
//                           <input
//                             className='form-input'
//                             type="password"
//                             name="Password1"
//                             placeholder='Password'
//                             defaultValue={formData.Password1}
//                             onChange={handleInputChange}
//                           />
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                   <input
//                     type="hidden"
//                     name="Password"
//                     value={SHA256(formData.Password1).toString()}
//                   />
//                   <input type="hidden" name="Message" value={"#"} />
//                   <input type="hidden" name="Promo" value={"#"} />
//                   <input type="hidden" name="Order" value={"#"} />
//                   <input type="hidden" name="isVerification" value={isVerification} />
//                   {invalidInput && <p className="error-message">Please fill out all fields and avoid using invalid characters.📝</p>}
//                   {invalidChars && <p className="error-message">Invalid characters 🚫 (=, +, ", ').</p>}
//                   {!/[a-zA-Z]/.test(formData.Name) && <p className="error-message">Name must contain at least one letter.</p>}
//                   {!/[a-zA-Z]/.test(formData.Password1) && <p className="error-message">Password must contain at least one letter.</p>}
//                   <button className='form-button' type="submit" disabled={isSubmitDisabled()}>
//                     {showRegistrationForm ?  <img className="back-button" src={useradd} alt="useradd" />  :  <img className="back-button" src={enter} alt="enter" />}
//                   </button>
//                 </form>
//                 <hr />
//                 <button className='form-button' onClick={handleToggleForm}>
//                   {showRegistrationForm ?  (
//                     <><img className="back-button" src={enter} alt="enter" /> Log In </>
//                   ) : (
//                     <><img className="back-button" src={useradd} alt="useradd" /> Create Account </>
//                   )}
//                 </button>
//               </>
//             )}
//           </div>
//         </section>
//       )}
//     </>
//   );
// };






// import React, { useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// import { SHA256 } from 'crypto-js';
// import './form.css';
// //import back from '../cart/img/back.png';
// import enter from '../cart/img/enter.png';
// import useradd from '../cart/img/useradd.png';
// import logout from '../cart/img/logout.png';
// import cancel from '../cart/img/cancel.png';
// import userok from '../cart/img/userok.png';
// import nickname from '../cart/img/nickname.gif';
// import password from '../cart/img/password.gif';

// const RegistrationForm = ({ isVerification: propIsVerification }) => {
//   const { theme, message, setMessage, promo, setPromo, setOrder, loggedIn, setLoggedIn, savedLogin, setSavedLogin, setSavedPassword, uiMain } = React.useContext(BooksContext);
//   const [formData, setFormData] = useState({
//     Name: '',
//     Password: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isVerification, setIsVerification] = useState(2);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(isVerification === 1);
//   const [showSections, setShowSections] = useState(false);

//   useEffect(() => {
//     setIsVerification(propIsVerification || 2);
//   }, [propIsVerification]);

//   const toggleSections = () => setShowSections(prevState => !prevState);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
  
   
//     if (/[=+"']/.test(value)  || value.length > 42 || (name === 'Name' && !/[a-zA-Z]/.test(value))||(name === 'Password' && !/[a-zA-Z]/.test(value))){
//    setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isVerification && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!isVerification && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     //handleSubmitPass();
//     formData.isVerification = isVerification;

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     // Replace the URL below with your actual endpoint
//    // const apiUrl = "https://script.google.com/macros/s/AKfycbxuzLhkvc8cFJNZPpO4tQ8YmFjKwLyNMAsmVx0TyAWfiICWCzksf8qnr-ukrUncSK8y/exec";
//    const apiUrl = uiMain.Urregform


//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         if (isVerification === 1) {
//           // Registration response handling
//           if (data.includes('Thank you for successful registration!')) {
//             setFormData({
//               Name: '',
//               Password: '',
//             });

//             setLoggedIn(true);

//             // Save login and password
//             setSavedLogin(formData.Name);
//             setSavedPassword(formData.Password);

//           } else if (data.includes('This username already exists. Please choose another one.')) {
//             alert('This username already exists. Please choose another one');
//             setFormData({
//               ...formData,
//               Name: '',
//               Password: '',
//             });
//           } else {
//             alert("⚠️Registration failed. Please try again.");
//           }
//         } else if (isVerification === 2) {
//           // Login response handling
//           if (data === 'Incorrect username or password.') {
//             alert('⚠️Incorrect username or password.');
//           } else {
//             // Extracting additional information for successful login
//             const [, receivedMessage, receivedPromo, receivedOrder] = data.match(/Message: (.+), Promo: (.+), Order: (.+)/) || [];

//             // Displaying the additional information in alerts
//             if (receivedMessage !== undefined) {
            
//               // Saving the additional information to state
//               setMessage(receivedMessage);
//               setPromo(receivedPromo);
//               setOrder(receivedOrder);
//               setLoggedIn(true);

//               // Save login and password
//               setSavedLogin(formData.Name);
//               setSavedPassword(formData.Password);
//             } else {
//               alert('Welcome! (No additional information available)');
//             }

//             // Handle successful login actions if needed
//           }
//         }
//       })
//       .catch(error => {
//         alert('⚠️Error: ' + error.message);
//       });
//   };

//   const handleToggleForm = () => {
//     setIsVerification(isVerification === 1 ? 2 : 1);
//     setShowRegistrationForm(!showRegistrationForm);
//     setLoggedIn(false);
//   };

//   const handleLogout = () => {
//     setLoggedIn(false);
//     setSavedLogin('');
//     setSavedPassword('');
//     setPromo('');
//     setOrder('');
//     setMessage('');
//   };
  
//   return (
//     <>
//     {!showSections && (
//     <section className='section-form'> 
    
//     <div className="registration-form">
      
//         <img src={cancel} alt='cancel' className="back-button selected" onClick={toggleSections}/>
//         {/* {uiMain.Urregform}  */}
// <hr></hr>
//       {loggedIn ? (
//         <div>
//           <p><img className="back-button" src={userok} alt="userok" />  {savedLogin}</p>
//           <p>{promo !== '#'&&promo !== ''&& `Ваш промокод: ${promo}`}</p>
//           <p>{message !== '#' && message !== '' &&`Your message: ${message}`}</p>
//           <Link to="/" className="back-button">
//           <button className="form-button" onClick={handleLogout}> <img className="back-button" src={logout} alt="logout" /> </button>
//           </Link>
        
//         </div>
//       ) : (
//         <>
//           <h2>{showRegistrationForm ? 'Greate Account' : 'Log In'}</h2>
//           <form onSubmit={handleSubmit}>
//            <table>
//             <tbody>
//             <tr>
//             <td>
//             <img className="back-button" src={nickname} alt="nickname" />
//               </td>
//               <td>
//               <input className='form-input' autoFocus
//                 type="text"
//                 name="Name"
//                 placeholder='Nickname'
//                 value={formData.Name}
//                 onChange={handleInputChange}
//               />
//              </td>
//              </tr>
//              <tr>
//              <td>
//              <img className="back-button" src={password} alt="password" />
//               </td>
//               <td>
//               <input className='form-input'
//                 type="password"
//                 name="Password1"
//                 placeholder='Password'
//                 defaultValue={formData.Password1}
//                 // value={formData.Password1}
//                 onChange={handleInputChange}
//               />
//               </td>
//               </tr>
//               </tbody>
//             </table>
//             <input
//                 type="hidden"
//                 name="Password"
//                 value={ SHA256(formData.Password1).toString()}
//             />

//             <input type="hidden" name="Message" value={"#"} />
//             <input type="hidden" name="Promo" value={"#"} />
//             <input type="hidden" name="Order" value={"#"} />
                        
//             <input type="hidden" name="isVerification" value={isVerification} />
//             {invalidInput && <p className="error-message">Please fill out all fields and avoid using invalid characters.📝</p>}
//             {invalidChars && <p className="error-message">Invalid characters 🚫 (=, +, ", ').</p>}
//             <button className='form-button' type="submit" disabled={isSubmitDisabled() }>
//               {showRegistrationForm ?  <img className="back-button" src={useradd} alt="useradd" />  :  <img className="back-button" src={enter} alt="enter" />}
//             </button>
//           </form>
// <hr></hr>
// <button className='form-button' onClick={handleToggleForm}>
//   {showRegistrationForm ?  (
//     <><img className="back-button" src={enter} alt="enter" />
//     Log In </>
//   ) : (
//     <><img className="back-button" src={useradd} alt="useradd" />
//     Create Account </>
//   )}
// </button>
//         </>
//       )}
      
//     </div>
//     </section>
//    )}
//   </>
//   );
// };

// export default RegistrationForm;


// import React, { useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// //import { SHA256 } from 'crypto-js';

// const RegistrationForm = ({ isVerification: propIsVerification }) => {
//   const { message, setMessage, promo, setPromo, setOrder, loggedIn, setLoggedIn, savedLogin, setSavedLogin, setSavedPassword } = React.useContext(BooksContext);
//   const [formData, setFormData] = useState({
//     Name: '',
//     Password: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isVerification, setIsVerification] = useState(2);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(isVerification === 1);

//   useEffect(() => {
//     setIsVerification(propIsVerification || 2);
//   }, [propIsVerification]);

 

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
  
   
//     if (/[=+"']/.test(value)  || value.length > 42 || (name === 'Name' && !/[a-zA-Z]/.test(value))||(name === 'Password' && !/[a-zA-Z]/.test(value))){
//    setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isVerification && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!isVerification && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     //handleSubmitPass();
//     formData.isVerification = isVerification;

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     // Replace the URL below with your actual endpoint
//     const apiUrl = "https://script.google.com/macros/s/AKfycbxuzLhkvc8cFJNZPpO4tQ8YmFjKwLyNMAsmVx0TyAWfiICWCzksf8qnr-ukrUncSK8y/exec";

//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         if (isVerification === 1) {
//           // Registration response handling
//           if (data.includes('Thank you for successful registration!')) {
//             setFormData({
//               Name: '',
//               Password: '',
//             });

//             setLoggedIn(true);

//             // Save login and password
//             setSavedLogin(formData.Name);
//             setSavedPassword(formData.Password);

//           } else if (data.includes('This username already exists. Please choose another one.')) {
//             alert('Такое имя пользователя уже существует. Выберите другое.');
//             setFormData({
//               ...formData,
//               Name: '',
//               Password: '',
//             });
//           } else {
//             alert("Регистрация не удалась. Пожалуйста, попробуйте снова.");
//           }
//         } else if (isVerification === 2) {
//           // Login response handling
//           if (data === 'Incorrect username or password.') {
//             alert('Неверный логин или пароль.');
//           } else {
//             // Extracting additional information for successful login
//             const [, receivedMessage, receivedPromo, receivedOrder] = data.match(/Message: (.+), Promo: (.+), Order: (.+)/) || [];

//             // Displaying the additional information in alerts
//             if (receivedMessage !== undefined) {
            
//               // Saving the additional information to state
//               setMessage(receivedMessage);
//               setPromo(receivedPromo);
//               setOrder(receivedOrder);
//               setLoggedIn(true);

//               // Save login and password
//               setSavedLogin(formData.Name);
//               setSavedPassword(formData.Password);
//             } else {
//               alert('Добро пожаловать! (Дополнительная информация отсутствует)');
//             }

//             // Handle successful login actions if needed
//           }
//         }
//       })
//       .catch(error => {
//         alert('Ошибка: ' + error.message);
//       });
//   };

//   const handleToggleForm = () => {
//     setIsVerification(isVerification === 1 ? 2 : 1);
//     setShowRegistrationForm(!showRegistrationForm);
//     setLoggedIn(false);
//   };

//   const handleLogout = () => {
//     setLoggedIn(false);
//     setSavedLogin('');
//     setSavedPassword('');
//     setPromo('');
//     setOrder('');
//     setMessage('');
//   };
//   // const handleSubmitPass = () => {
//   //   const hashPassword = (password) => SHA256(password).toString();
//   //   formData.Password = hashPassword(formData.Password);
//   // }


//   return (
//     <div className="registration-form">
//       <Link to="/" className="back-button">
//         <button className="purchase button custom-element">Закрыть</button>
//       </Link>

//       {loggedIn ? (
//         <div>
//           <p>Рады снова приветствовать {savedLogin}</p>
//           <p>{promo !== '#'&&promo !== ''&& `Ваш промокод: ${promo}`}</p>
//           <p>{message !== '#' && message !== '' &&`Ваше сообщение: ${message}`}</p>
//           <Link to="/" className="back-button">
//           <button className="logout-button" onClick={handleLogout}>Выйти из аккаунта</button>
//           </Link>
//           <Link to="/" className="back-button">
//             <button className="purchase button custom-element">Back</button>
//           </Link>
//         </div>
//       ) : (
//         <>
//           <h2>{showRegistrationForm ? 'Регистрация пользователя' : 'Вход'}</h2>
//           <form onSubmit={handleSubmit}>
//             <label>
//               Имя пользователя:
//               <input
//                 type="text"
//                 name="Name"
//                 value={formData.Name}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Пароль:
//               <input
//                 type="password"
//                 name="Password"
//                 value={formData.Password}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <input type="hidden" name="Message" value={"#"} />
//             <input type="hidden" name="Promo" value={"#"} />
//             <input type="hidden" name="Order" value={"#"} />

//             {/* Add a hidden field for isVerification */}
//             <input type="hidden" name="isVerification" value={isVerification} />
//             {invalidInput && <p className="error-message">Пожалуйста, заполните все поля и избегайте использования недопустимых символов.</p>}
//             {invalidChars && <p className="error-message">Недопустимы символы (=, +, ", ').</p>}
//             <button type="submit" disabled={isSubmitDisabled() }>
//               {showRegistrationForm ? 'Зарегистрироваться' : 'Войти'}
//             </button>
//           </form>

//           <button onClick={handleToggleForm}>
//             {showRegistrationForm ? 'Перейти ко входу' : 'Зарегистрироваться'}
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default RegistrationForm;





// import React, { useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';

// const RegistrationForm = ({ isVerification: propIsVerification }) => {
//   const { message, setMessage, promo, setPromo, order, setOrder, loggedIn, setLoggedIn, savedLogin, setSavedLogin, savedPassword, setSavedPassword } = React.useContext(BooksContext);
//   const [formData, setFormData] = useState({
//     Name: '',
//     Password: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isVerification, setIsVerification] = useState(2);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(isVerification === 1);

//   useEffect(() => {
//     setIsVerification(propIsVerification || 2);
//   }, [propIsVerification]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (/[=+"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isVerification && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

  

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!isVerification && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     formData.isVerification = isVerification;

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     // Replace the URL below with your actual endpoint
//     const apiUrl = "https://script.google.com/macros/s/AKfycbxuzLhkvc8cFJNZPpO4tQ8YmFjKwLyNMAsmVx0TyAWfiICWCzksf8qnr-ukrUncSK8y/exec";

//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         if (isVerification === 1) {
//           // Registration response handling
//           if (data.includes('Thank you for successful registration!')) {
//             alert('Спасибо за успешную регистрацию!');
//             setFormData({
//               Name: '',
//               Password: '',
//             });
           
//             setLoggedIn(true);

//             // Save login and password
//             setSavedLogin(formData.Name);
//             setSavedPassword(formData.Password);

//           } else if (data.includes('This username already exists. Please choose another one.')) {
//             alert('Такое имя пользователя уже существует. Выберите другое.');
//             setFormData({
//               ...formData,
//               Name: '',
//               Password: '',
//             });
//           } else {
//             alert("Регистрация не удалась. Пожалуйста, попробуйте снова.");
//           }
//         } else if (isVerification === 2) {
//           // Login response handling
//           if (data === 'Incorrect username or password.') {
//             alert('Неверный логин или пароль.');
//           } else {
//             // Extracting additional information for successful login
//             const [, receivedMessage, receivedPromo, receivedOrder] = data.match(/Message: (.+), Promo: (.+), Order: (.+)/) || [];

//             // Displaying the additional information in alerts
//             if (receivedMessage !== undefined) {
//               alert(`Добро пожаловать! Сообщение: ${receivedMessage}, Промокод: ${receivedPromo}, Заказ: ${receivedOrder}`);

//               // Saving the additional information to state
//               setMessage(receivedMessage);
//               setPromo(receivedPromo);
//               setOrder(receivedOrder);
//               setLoggedIn(true);

//               // Save login and password
//               setSavedLogin(formData.Name);
//               setSavedPassword(formData.Password);
//             } else {
//               alert('Добро пожаловать! (Дополнительная информация отсутствует)');
//             }

//             // Handle successful login actions if needed
//           }
//         }
//       })
//       .catch(error => {
//         alert('Ошибка: ' + error.message);
//       });
//   };

//   const handleToggleForm = () => {
//     setIsVerification(isVerification === 1 ? 2 : 1);
//     setShowRegistrationForm(!showRegistrationForm);
//     setLoggedIn(false);
//   };
  

//   const handleLogout = () => {
//     setLoggedIn(false);
//     setSavedLogin('');
//     setSavedPassword('');
//     setPromo('');
//     setOrder('');
//     setMessage('');
//   };

//   return (
//     <div className="registration-form">
//       <Link to="/" className="back-button">
//             <button className="purchase button custom-element">Закрыть</button>
//           </Link>
     
//       {loggedIn ? (
//         <div>
//           <p>Рады снова приветствовать Вас!</p>
//           <p>{promo !== '#' && `Ваш промокод: ${promo}`}</p>
//           <p>{message !== '#' && `Ваше сообщение: ${message}`}</p>
//           <p>{`Ваши сохраненные данные: Логин - ${savedLogin}, Пароль - ${savedPassword}`}</p>
//           <button className="logout-button" onClick={handleLogout}>Выйти из аккаунта</button>
//           <Link to="/" className="back-button">
//             <button className="purchase button custom-element">Back</button>
//           </Link>
//         </div>
//       ) : (
//         <>
//           <h2>{showRegistrationForm ? 'Регистрация пользователя' : 'Вход'}</h2>
//           <form onSubmit={handleSubmit}>
//             <label>
//               Имя пользователя:
//               <input
//                 type="text"
//                 name="Name"
//                 value={formData.Name}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Пароль:
//               <input
//                 type="password"
//                 name="Password"
//                 value={formData.Password}
//                 onChange={handleInputChange}
//               />
//             </label>
// {/* <input type="hidden" name="Message" value={"#"} />
//             <input type="hidden" name="Promo" value={"#"} />
//             <input type="hidden" name="Order" value={"#"} /> */}
//             {/* Add a hidden field for isVerification */}
//             <input type="hidden" name="isVerification" value={isVerification} />
//             {invalidInput && <p className="error-message">Пожалуйста, заполните все поля и избегайте использования недопустимых символов.</p>}
//             {invalidChars && <p className="error-message">Недопустимы символы (=, +, ", ').</p>}
//             <button type="submit" disabled={isSubmitDisabled()}>
//               {showRegistrationForm ? 'Зарегистрироваться' : 'Войти'}
//             </button>
//           </form>
         
//             <button onClick={handleToggleForm}>
//               {showRegistrationForm ? 'Перейти ко входу' : 'Зарегистрироваться'}
//             </button>
         
//         </>
//       )}
//     </div>
//   );
// };

// export default RegistrationForm;





// import React, { useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';

// const RegistrationForm = ({ isVerification: propIsVerification }) => {
//   const { message, setMessage, promo, setPromo, order, setOrder,  loggedIn, setLoggedIn, savedLogin, setSavedLogin, savedPassword, setSavedPassword } = React.useContext(BooksContext);
 
//   const [formData, setFormData] = useState({
//     Name: '',
//     Password: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isVerification, setIsVerification] = useState(2);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(isVerification === 1);
//   // const [message, setMessage] = useState('');
//   // const [promo, setPromo] = useState('');
//   // const [order, setOrder] = useState('');
//   // const [loggedIn, setLoggedIn] = useState(false);
//   // const [savedLogin, setSavedLogin] = useState('');
//   // const [savedPassword, setSavedPassword] = useState('');

//   useEffect(() => {
//     setIsVerification(propIsVerification || 2);
//   }, [propIsVerification]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (/[=+"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isVerification && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!isVerification && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     formData.isVerification = isVerification;

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     // Replace the URL below with your actual endpoint
//     const apiUrl = "https://script.google.com/macros/s/AKfycbxuzLhkvc8cFJNZPpO4tQ8YmFjKwLyNMAsmVx0TyAWfiICWCzksf8qnr-ukrUncSK8y/exec";

//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         if (isVerification === 1) {
//           // Registration response handling
//           if (data.includes('Thank you for successful registration!')) {
//             alert('Спасибо за успешную регистрацию!');
//             setFormData({
//               Name: '',
//               Password: '',
//             });
//           } else if (data.includes('This username already exists. Please choose another one.')) {
//             alert('Такое имя пользователя уже существует. Выберите другое.');
//             setFormData({
//               ...formData,
//               Name: '',
//               Password: '',
//             });
//           } else {
//             alert("Регистрация не удалась. Пожалуйста, попробуйте снова.");
//           }
//         } else if (isVerification === 2) {
//           // Login response handling
//           if (data === 'Incorrect username or password.') {
//             alert('Неверный логин или пароль.');
//           } else {
//             // Extracting additional information for successful login
//             const [, receivedMessage, receivedPromo, receivedOrder] = data.match(/Message: (.+), Promo: (.+), Order: (.+)/) || [];
            
//             // Displaying the additional information in alerts
//             if (receivedMessage !== undefined) {
//               alert(`Successful login! Message: ${receivedMessage}, Promo: ${receivedPromo}, Order: ${receivedOrder}`);
              
//               // Saving the additional information to state
//               setMessage(receivedMessage);
//               setPromo(receivedPromo);
//               setOrder(receivedOrder);
//               setLoggedIn(true);
              
//               // Save login and password
//               setSavedLogin(formData.Name);
//               setSavedPassword(formData.Password);
//             } else {
//               alert('Successful login! (No additional information available)');
//             }

//             // Handle successful login actions if needed
//           }
//         }
//       })
//       .catch(error => {
//         alert('Ошибка: ' + error.message);
//       });
//   };

//   const handleToggleForm = () => {
//     setIsVerification(isVerification === 1 ? 2 : 1);
//     setShowRegistrationForm(!showRegistrationForm);
//     setLoggedIn(false);
//   };

//   return (
//     <div className="registration-form">
//       <h2>{showRegistrationForm ? 'Регистрация пользователя' : 'Вход'}</h2>

//       {loggedIn ? (
//         <div>
//           <p>Рады снова приветствовать Вас!</p>
//           <p>{promo !== '#' && `Ваш промокод: ${promo}`}</p>
//           <p>{message !== '#' && `Ваше сообщение: ${message}`}</p>
//           <p>{`Ваши сохраненные данные: Логин - ${savedLogin}, Пароль - ${savedPassword}`}</p>
//           <Link to="/" className="back-button">
//           <button className="purchase button custom-element">Back</button>
//         </Link>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <label>
//             Имя пользователя:
//             <input
//               type="text"
//               name="Name"
//               value={formData.Name}
//               onChange={handleInputChange}
//             />
//           </label>
//           <label>
//             Пароль:
//             <input
//               type="password"
//               name="Password"
//               value={formData.Password}
//               onChange={handleInputChange}
//             />
//           </label>
          
//           {/* Add a hidden field for isVerification */}
//           <input type="hidden" name="isVerification" value={isVerification} />
//           {invalidInput && <p className="error-message">Пожалуйста, заполните все поля и избегайте использования недопустимых символов.</p>}
//           {invalidChars && <p className="error-message">Недопустимы символы (=, +, ", ').</p>}
//           <button type="submit" disabled={isSubmitDisabled()}>
//             { showRegistrationForm ?   'Зарегистрироваться' : 'Войти'}
//           </button>
//         </form>
//       )}

//       <button onClick={handleToggleForm}>
//         {showRegistrationForm ?   'Перейти ко входу' : 'Зарегистрироваться'}
//       </button>
//     </div>
//   );
// };

// export default RegistrationForm;






// import React, { useState, useEffect } from 'react';

// const RegistrationForm = ({ isVerification: propIsVerification }) => {
//   const [formData, setFormData] = useState({
//     Name: '',
//     Password: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isVerification, setIsVerification] = useState(2);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(isVerification === 1);
//   const [message, setMessage] = useState('');
//   const [promo, setPromo] = useState('');
//   const [order, setOrder] = useState('');

//   useEffect(() => {
//     setIsVerification(propIsVerification || 2);
//   }, [propIsVerification]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (/[=+"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isVerification && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!isVerification && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     formData.isVerification = isVerification;

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycbxuzLhkvc8cFJNZPpO4tQ8YmFjKwLyNMAsmVx0TyAWfiICWCzksf8qnr-ukrUncSK8y/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         if (isVerification === 1) {
//           // Registration response handling
//           if (data.includes('Thank you for successful registration!')) {
//             alert('Спасибо за успешную регистрацию!');
//             setFormData({
//               Name: '',
//               Password: '',
//             });
//           } else if (data.includes('This username already exists. Please choose another one.')) {
//             alert('Такое имя пользователя уже существует. Выберите другое.');
//             setFormData({
//               ...formData,
//               Name: '',
//               Password: '',
//             });
//           } else {
//             alert("Регистрация не удалась. Пожалуйста, попробуйте снова.");
//           }
//         } else if (isVerification === 2) {
//           // Login response handling
//           if (data === 'Incorrect username or password.') {
//             alert('Неверный логин или пароль.');
//           } else {
//             // Extracting additional information for successful login
//             const [, receivedMessage, receivedPromo, receivedOrder] = data.match(/Message: (.+), Promo: (.+), Order: (.+)/) || [];
            
//             // Displaying the additional information in alerts
//             if (receivedMessage !== undefined) {
//               alert(`Successful login! Message: ${receivedMessage}, Promo: ${receivedPromo}, Order: ${receivedOrder}`);
              
//               // Saving the additional information to state
//               setMessage(receivedMessage);
//               setPromo(receivedPromo);
//               setOrder(receivedOrder);
//             } else {
//               alert('Successful login! (No additional information available)');
//             }

//             // Handle successful login actions if needed
//           }
//         }
//       })
//       .catch(error => {
//         alert('Ошибка: ' + error.message);
//       });
//   };

//   const handleToggleForm = () => {
//     setIsVerification(isVerification === 1 ? 2 : 1);
//     setShowRegistrationForm(!showRegistrationForm);
//   };

//   return (
//     <div className="registration-form">
//       <h2>{showRegistrationForm ? 'Регистрация пользователя' : 'Вход'}</h2>
//       <form onSubmit={handleSubmit}>
       
//         <label>
//           Имя пользователя:
//           <input
//             type="text"
//             name="Name"
//             value={formData.Name}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Пароль:
//           <input
//             type="password"
//             name="Password"
//             value={formData.Password}
//             onChange={handleInputChange}
//           />
//         </label>
        
//         {/* Add a hidden field for isVerification */}
//         <input type="hidden" name="isVerification" value={isVerification} />
//         {invalidInput && <p className="error-message">Пожалуйста, заполните все поля и избегайте использования недопустимых символов.</p>}
//         {invalidChars && <p className="error-message">Недопустимы символы (=, +, ", ').</p>}
//         <button type="submit" disabled={isSubmitDisabled()}>
//           {showRegistrationForm ? 'Зарегистрироваться' : 'Войти'}
//         </button>
//       </form>
//       <button onClick={handleToggleForm}>
//         {showRegistrationForm ? 'Перейти ко входу' : 'Зарегистрироваться'}
//       </button>

//       {/* Displaying additional information for successful login */}
//       {isVerification === 2 && (
//         <div>
//           <p>Message: {message}</p>
//           <p>Promo: {promo}</p>
//           <p>Order: {order}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RegistrationForm;







// import React, { useState, useEffect } from 'react';

// const RegistrationForm = ({ isVerification: propIsVerification }) => {
//   const [formData, setFormData] = useState({
//     Name: '',
//     Phone: '',
//     Email: '',
//     Password: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isVerification, setIsVerification] = useState(2);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(isVerification === 1);
//   const [message, setMessage] = useState('');
//   const [promo, setPromo] = useState('');
//   const [order, setOrder] = useState('');
  
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');

//   useEffect(() => {
//     setIsVerification(propIsVerification || 2);
//   }, [propIsVerification]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (/[=+"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isVerification && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!isVerification && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     formData.isVerification = isVerification;

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycbxuzLhkvc8cFJNZPpO4tQ8YmFjKwLyNMAsmVx0TyAWfiICWCzksf8qnr-ukrUncSK8y/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         if (isVerification === 1) {
//           // Registration response handling
//           if (data.includes('Thank you for successful registration!')) {
//             alert('Спасибо за успешную регистрацию!');
//             setFormData({
//               Name: '',
//               Phone: '',
//               Email: '',
//               Password: '',
//             });
//           } else if (data.includes('This username already exists. Please choose another one.')) {
//             alert('Такое имя пользователя уже существует. Выберите другое.');
//             setFormData({
//               ...formData,
//               Name: '',
//               Password: '',
//             });
//           } else {
//             alert("Регистрация не удалась. Пожалуйста, попробуйте снова.");
//           }
//         } else if (isVerification === 2) {
//           // Login response handling
//           if (data === 'Incorrect username or password.') {
//             alert('Неверный логин или пароль.');
//           } else {
//             // Extracting additional information for successful login
//             const [, receivedPhone, receivedEmail, receivedMessage, receivedPromo, receivedOrder] = data.match(/Phone: (.+), Email: (.+), Message: (.+), Promo: (.+), Order: (.+)/) || [];
            
//             // Displaying the additional information in alerts
//             if (receivedMessage !== undefined) {
//              // if (receivedMessage === undefined) {
//               alert(`Successful login! ${receivedPhone} ${receivedEmail} Message: ${receivedMessage}, Promo: ${receivedPromo}, Order: ${receivedOrder}`);
//               console.log(data)
//               console.log(typeof(data))
//               // Saving the additional information to state
//               setMessage(receivedMessage);
//               setPromo(receivedPromo);
//               setOrder(receivedOrder);
//               setEmail(receivedEmail);
//               setPhone(receivedPhone);
//             } else {
//               alert('Successful login! (No additional information available)');
//             }

//             // Handle successful login actions if needed
//           }
//         }
//       })
//       .catch(error => {
//         alert('Ошибка: ' + error.message);
//       });
//   };

//   const handleToggleForm = () => {
//     setIsVerification(isVerification === 1 ? 2 : 1);
//     setShowRegistrationForm(!showRegistrationForm);
//   };

//   return (
//     <div className="registration-form">
//       <h2>{showRegistrationForm ? 'Регистрация пользователя' : 'Вход'}</h2>
//       <form onSubmit={handleSubmit}>
       
//         <label>
//           Имя пользователя:
//           <input
//             type="text"
//             name="Name"
//             value={formData.Name}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Пароль:
//           <input
//             type="password"
//             name="Password"
//             value={formData.Password}
//             onChange={handleInputChange}
//           />
//         </label>
        
//         {showRegistrationForm && (
//           <>
//             <label>
//               Телефон:+
//               <input
//                 type="text"
//                 name="Phone"
//                 value={formData.Phone}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Email:
//               <input
//                 type="text"
//                 name="Email"
//                 value={formData.Email}
//                 onChange={handleInputChange}
//               />
//             </label>
//           </>
//         )}


//         <input type="hidden" name="Message" value={"#"} />
//         <input type="hidden" name="Promo" value={"#"} />
//         <input type="hidden" name="Order" value={"#"} />
        
        
        
//         {/* Add a hidden field for isVerification */}
//         <input type="hidden" name="isVerification" value={isVerification} />
//         {invalidInput && <p className="error-message">Пожалуйста, заполните все поля и избегайте использования недопустимых символов.</p>}
//         {invalidChars && <p className="error-message">Недопустимы символы (=, +, ", ').</p>}
//         <button type="submit" disabled={isSubmitDisabled()}>
//           {showRegistrationForm ? 'Зарегистрироваться' : 'Войти'}
//         </button>
//       </form>
//       <button onClick={handleToggleForm}>
//         {showRegistrationForm ? 'Перейти ко входу' : 'Зарегистрироваться'}
//       </button>

//       {/* Displaying additional information for successful login */}
//       {isVerification === 2 && (
//         <div>
//           <p>Message: {message}</p>
//           <p>Promo: {promo}</p>
//           <p>Order: {order}</p>
//           <p>Phone: {phone}</p>
//           <p>Email: {email}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RegistrationForm;



// import React, { useState, useEffect } from 'react';

// const RegistrationForm = ({ isVerification: propIsVerification }) => {
//   const [formData, setFormData] = useState({
//     Name: '',
//     Phone: '',
//     Email: '',
//     Password: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isVerification, setIsVerification] = useState(2);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(isVerification === 1);

//   useEffect(() => {
//     setIsVerification(propIsVerification || 2);
//   }, [propIsVerification]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (/[.=+_"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isVerification && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!isVerification && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     formData.isVerification = isVerification;

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycbxoB_u_uA1anFqdYn_p2LWeLIIJun0pkSM7cuG9o6eo9uTvpWIuyJZRnwdGBMuR4jFZ/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         if (isVerification === 1) {
//           // Registration response handling
//           if (data.includes('Thank you for successful registration!')) {
//             alert('Спасибо за успешную регистрацию!');
//             setFormData({
//               Name: '',
//               Phone: '',
//               Email: '',
//               Password: '',
//             });
//           } else if (data.includes('This username already exists. Please choose another one.')) {
//             alert('Такое имя пользователя уже существует. Выберите другое.');
//             setFormData({
//               ...formData,
//               Name: '',
//               Password: '',
//             });
//           } else {
//             alert("Регистрация не удалась. Пожалуйста, попробуйте снова.");
//           }
//         } else if (isVerification === 2) {
//           // Login response handling
//           if (data === 'Successful login!') {
//             alert('Успешный вход!');
//             // Handle successful login actions if needed
//           } else if (data === 'Incorrect username or password.') {
//             alert('Неверный логин или пароль.');
//             // Handle incorrect login actions if needed
//           } else {
//             alert('Ошибка при входе. Пожалуйста, попробуйте снова.');
//           }
//         }
//       })
//       .catch(error => {
//         alert('Ошибка: ' + error.message);
//       });
//   };

//   const handleToggleForm = () => {
//     setIsVerification(isVerification === 1 ? 2 : 1);
//     setShowRegistrationForm(!showRegistrationForm);
//   };

//   return (
//     <div className="registration-form">
//       <h2>{showRegistrationForm ? 'Регистрация пользователя' : 'Вход'}</h2>
//       <form onSubmit={handleSubmit}>
//         {showRegistrationForm && (
//           <>
//             <label>
//               Телефон:
//               <input
//                 type="text"
//                 name="Phone"
//                 value={formData.Phone}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Email:
//               <input
//                 type="text"
//                 name="Email"
//                 value={formData.Email}
//                 onChange={handleInputChange}
//               />
//             </label>
//           </>
//         )}
//         <label>
//           Имя пользователя:
//           <input
//             type="text"
//             name="Name"
//             value={formData.Name}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Пароль:
//           <input
//             type="password"
//             name="Password"
//             value={formData.Password}
//             onChange={handleInputChange}
//           />
//         </label>
//         {/* Add a hidden field for isVerification */}
//         <input type="hidden" name="isVerification" value={isVerification} />
//         {invalidInput && <p className="error-message">Пожалуйста, заполните все поля и избегайте использования недопустимых символов.</p>}
//         {invalidChars && <p className="error-message">Недопустимы символы (=, ., +, ", _, ').</p>}
//         <button type="submit" disabled={isSubmitDisabled()}>
//           {showRegistrationForm ? 'Зарегистрироваться' : 'Войти'}
//         </button>
//       </form>
//       <button onClick={handleToggleForm}>
//         {showRegistrationForm ? 'Перейти ко входу' : 'Зарегистрироваться'}
//       </button>
//     </div>
//   );
// };

// export default RegistrationForm;


// import React, { useState, useEffect } from 'react';

// const RegistrationForm = ({ isVerification: propIsVerification }) => {
//   const [formData, setFormData] = useState({
//     Name: '',
//     Phone: '',
//     Email: '',
//     Password: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isVerification, setIsVerification] = useState(2);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(false);
// console.log(isVerification)
//   useEffect(() => {
//     setIsVerification(propIsVerification || 2);
//   }, [propIsVerification]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (/[.=+_"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isVerification && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!isVerification && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     // Add the isVerification value to the form data
//     formData.isVerification = isVerification;

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycby6V5fa98Nzb9UWmK9j-eMHY1gwB0wBsQ_C3Y2K6d0phCHc8wIPuWMfYBpfDe_R2Flo/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         // Handle response messages
//         if (data.includes('Thank you for successful registration!')) {
//           alert('Спасибо за успешную регистрацию!');
//           setFormData({
//             Name: '',
//             Phone: '',
//             Email: '',
//             Password: '',
//           });
//         } else if (data.includes('This username already exists. Please choose another one.')) {
//           alert('Такое имя пользователя уже существует. Выберите другое.');
//           setFormData({
//             ...formData,
//             Name: '',
//             Password: '',
//           });
//         } else {
//           alert("Регистрация не удалась. Пожалуйста, попробуйте снова.");
//         }
//       })
//       .catch(error => {
//         alert('Ошибка: ' + error.message);
//       });
//   };

//   const handleToggleForm = () => {
//     setIsVerification(isVerification === 1 ? 2 : 1);
//     setShowRegistrationForm(!showRegistrationForm);
//   };

//   return (
//     <div className="registration-form">
//       <h2>{showRegistrationForm ? 'Регистрация пользователя' : 'Вход'}</h2>
//       <form onSubmit={handleSubmit}>
//         {showRegistrationForm && (
//           <>
//             <label>
//               Телефон:
//               <input
//                 type="text"
//                 name="Phone"
//                 value={formData.Phone}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Email:
//               <input
//                 type="text"
//                 name="Email"
//                 value={formData.Email}
//                 onChange={handleInputChange}
//               />
//             </label>
//           </>
//         )}
//         <label>
//           Имя пользователя:
//           <input
//             type="text"
//             name="Name"
//             value={formData.Name}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Пароль:
//           <input
//             type="password"
//             name="Password"
//             value={formData.Password}
//             onChange={handleInputChange}
//           />
//         </label>
//         {/* Add a hidden field for isVerification */}
//         <input type="hidden" name="isVerification" value={isVerification} />
//         {invalidInput && <p className="error-message">Пожалуйста, заполните все поля и избегайте использования недопустимых символов.</p>}
//         {invalidChars && <p className="error-message">Недопустимы символы (=, ., +, ", _, ').</p>}
//         <button type="submit" disabled={isSubmitDisabled()}>
//           {showRegistrationForm ? 'Зарегистрироваться' : 'Войти'}
//         </button>
//       </form>
//       <button onClick={handleToggleForm}>
//         {showRegistrationForm ? 'Перейти ко входу' : 'Зарегистрироваться'}
//       </button>
//     </div>
//   );
// };

// export default RegistrationForm;



// import React, { useState } from 'react';

// const RegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     Name: '',
//     Phone: '',
//     Email: '',
//     Password: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [isLogin, setIsLogin] = useState(false); // Добавляем состояние для отображения формы входа или регистрации

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Проверяем, что введенные данные не содержат недопустимых символов
//     if (/[.=+_"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       (!isLogin && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!isLogin && isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycby6V5fa98Nzb9UWmK9j-eMHY1gwB0wBsQ_C3Y2K6d0phCHc8wIPuWMfYBpfDe_R2Flo/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         // Сообщения об успешной регистрации или о существующем имени пользователя
//         if (data.includes('Thank you for successful registration!')) {
//           alert('Спасибо за успешную регистрацию!');
//           // Очищаем форму
//           setFormData({
//             Name: '',
//             Phone: '',
//             Email: '',
//             Password: '',
//           });
//         } else if (data.includes('This username already exists. Please choose another one.')) {
//           alert('Такое имя пользователя уже существует. Выберите другое.');
//           // Очищаем только имя пользователя и пароль
//           setFormData({
//             ...formData,
//             Name: '',
//             Password: '',
//           });
//         } else {
//           alert("Регистрация не удалась. Пожалуйста, попробуйте снова.");
//         }
//       })
//       .catch(error => {
//         alert('Ошибка: ' + error.message);
//       });
//   };

//   return (
//     <div className="registration-form">
//       <h2>{isLogin ? 'Вход' : 'Регистрация пользователя'}</h2>
//       <form onSubmit={handleSubmit}>
//         {!isLogin && (
//           <>
//             <label>
//               Телефон:
//               <input
//                 type="text"
//                 name="Phone"
//                 value={formData.Phone}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Email:
//               <input
//                 type="text"
//                 name="Email"
//                 value={formData.Email}
//                 onChange={handleInputChange}
//               />
//             </label>
//           </>
//         )}
//         <label>
//           Имя пользователя:
//           <input
//             type="text"
//             name="Name"
//             value={formData.Name}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Пароль:
//           <input
//             type="password"
//             name="Password"
//             value={formData.Password}
//             onChange={handleInputChange}
//           />
//         </label>
//         {invalidInput && <p className="error-message">Пожалуйста, заполните все поля и избегайте использования недопустимых символов.</p>}
//         {invalidChars && <p className="error-message">Недопустимы символы (=, ., +, ", _, ').</p>}
//         <button type="submit" disabled={isSubmitDisabled()}>{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
//       </form>
//       <button onClick={() => setIsLogin(!isLogin)}>
//         {isLogin ? 'Перейти к регистрации' : 'Перейти ко входу'}
//       </button>
//     </div>
//   );
// };

// export default RegistrationForm;


// import React, { useState } from 'react';

// const RegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     Name: '',
//     Phone: '',
//     Email: '',
//     Password: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Проверяем, что введенные данные не содержат недопустимых символов
//     if (/[.=+_"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       Object.values(formData).some((value) => value === '') ||
//       invalidChars
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycby6V5fa98Nzb9UWmK9j-eMHY1gwB0wBsQ_C3Y2K6d0phCHc8wIPuWMfYBpfDe_R2Flo/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         // Сообщения об успешной регистрации или о существующем имени пользователя
//         if (data.includes('Thank you for successful registration!')) {
//           alert('Спасибо за успешную регистрацию!');
         
//           // Очищаем форму
//           setFormData({
//             Name: '',
//             Phone: '',
//             Email: '',
//             Password: '',
//           });
//         } else if (data.includes('This username already exists. Please choose another one.')) {
//           alert('Такое имя пользователя уже существует. Выберите другое.');
//           // Очищаем только имя пользователя и пароль
//           setFormData({
//             ...formData,
//             Name: '',
//             Password: '',
//           });
//         } else {
//           alert("Регистрация не удалась. Пожалуйста, попробуйте снова.");
//         }
//       })
//       .catch(error => {
//         alert('Ошибка: ' + error.message);
//       });
//   };

//   return (
//     <div className="registration-form">
//       <h2>Регистрация пользователя</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Имя пользователя:
//           <input
//             type="text"
//             name="Name"
//             value={formData.Name}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Телефон:
//           <input
//             type="text"
//             name="Phone"
//             value={formData.Phone}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Email:
//           <input
//             type="text"
//             name="Email"
//             value={formData.Email}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Пароль:
//           <input
//             type="password"
//             name="Password"
//             value={formData.Password}
//             onChange={handleInputChange}
//           />
//         </label>
//         {invalidInput && <p className="error-message">Пожалуйста, заполните все поля и избегайте использования недопустимых символов.</p>}
//         {invalidChars && <p className="error-message">Недопустимы символы (=, ., +, ", _, ').</p>}
//         <button type="submit" disabled={isSubmitDisabled()}>Зарегистрироваться</button>
//       </form>
//     </div>
//   );
// };

// export default RegistrationForm;




// import React, { useState } from 'react';

// const RegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     password: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Проверяем, что введенные данные не содержат недопустимых символов
//     if (/[.=+_"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     return (
//       Object.values(formData).some((value) => value === '') ||
//       invalidChars
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     try {
//       const response = await fetch("https://script.google.com/macros/s/AKfycbxWRVc-vkj6iFYY9Rx9ImtR6EOK-ietCJ66YZu12ruiG2_rOeETHGpY8VXJzA-OIhqT/exec", {
//         method: "POST",
//         body: formDatab
//       });

//       if (response.ok) {
//         const data = await response.text();
//         //const orderNumber = parseInt(data.split(":")[1]); // Извлекаем номер заказа из ответа

//        // if (!isNaN(orderNumber)) {
//           // Сохраняем номер заказа в локальное хранилище
//          // localStorage.setItem('orderNumber', orderNumber);
//           alert('Спасибо за успешную регистрацию! / ' );

//           // Очищаем форму
//           setFormData({
//             name: '',
//             phone: '',
//             email: '',
//             password: '',
//           });
//          if (data.includes('Username already exists')) {
//           // Очищаем только имя пользователя и пароль
//           setFormData({
//             ...formData,
//             name: '',
//             password: '',
//           });
//           alert('Такое имя пользователя уже существует. Выберите другое.');
//         } else {
//           alert("Регистрация не удалась. Пожалуйста, попробуйте снова.");
//         }
//       } else {
//         throw new Error('Network response was not ok');
//       }
//     } catch (error) {
//       alert('Ошибка: ' + error.message);
//     }
//   };

//   return (
//     <div className="registration-form">
//       <h2>Регистрация пользователя</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Имя пользователя:
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Телефон:
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Email:
//           <input
//             type="text"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Пароль:
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//           />
//         </label>
//         {invalidInput && <p className="error-message">Пожалуйста, заполните все поля и избегайте использования недопустимых символов.</p>}
//         {invalidChars && <p className="error-message">Недопустимы символы (=, ., +, ", _, ').</p>}
//         <button type="submit" disabled={isSubmitDisabled()}>Зарегистрироваться</button>
//       </form>
//     </div>
//   );
// };

// export default RegistrationForm;
