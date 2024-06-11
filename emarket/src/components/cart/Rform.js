import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BooksContext } from '../../BooksContext';
import './form.css';
import InfoModal from '../specific-book/InfoModal';
import RSAEncryption from '../rsacomponent/RSAEncryption';
import LoadingAnimation from '../utils/LoadingAnimation'; 
import call from '../cart/img/call.png';
import email from '../cart/img/email.png';
import user from '../cart/img/user.png';
import chat from '../cart/img/chat.png';
import back from '../cart/img/back.png';
import addressIcon from '../cart/img/location.png';

export default function Form() {
  const { 
    showRegistrationForm, 
    setShowRegistrationForm, 
    theme, 
    loggedIn, 
    savedLogin, 
    setCartItems, 
    setTotalPrice, 
    totalPrice, 
    setTotalCount, 
    cartItems, 
    uiMain, 
    fieldState 
  } = useContext(BooksContext);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { encryptRSA } = RSAEncryption();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    FirstName: '', MiddleName: '', LastName: '', Email: '', Phone: '', Address: '', Message: ''
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [encrypting, setEncrypting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationPatterns = useMemo(() => ({
    invalidChars: {
      pattern: /[=+"']/,
      message: 'Invalid characters 🚫 [=+"\''
    }
  }), []);

  const [formErrors, setFormErrors] = useState({});

  const isSubmitDisabled = useCallback(() => {
    const excludedFields = [''];
    return Object.keys(formData).some(field =>
      !excludedFields.includes(field) && formData[field] === undefined
    );
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log(value)
    let errorMessage = '';
    if (validationPatterns.invalidChars.pattern.test(value)) {
      errorMessage = validationPatterns.invalidChars.message;
    }
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    setFormData((prevData) => ({ ...prevData, [name]: errorMessage ? undefined : value  }));
    isSubmitDisabled();
  }, [validationPatterns, isSubmitDisabled]);

  useEffect(() => {
    if (loggedIn) {
      const inputs = document.querySelectorAll('.form input, .form textarea');
      inputs.forEach(input => input.addEventListener('change', handleInputChange));

      return () => {
        inputs.forEach(input => input.removeEventListener('change', handleInputChange));
      };
    }
  }, [loggedIn, handleInputChange]);

  const handleEncrypt = async (publicKey1, publicKey2, plaintext) => {
    try {
      const encryptedMessage = await encryptRSA(publicKey1 + publicKey2, plaintext);
      const chunkSize = 256;
      const encryptedChunks = [];
      for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
        encryptedChunks.push(encryptedMessage.substring(i, i + chunkSize));
      }
      return encryptedChunks;
    } catch (error) {
      console.error('Encryption error:', error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setSubmitting(true); 

    const formDatab = new FormData();
    formDatab.append("Name", savedLogin);
    formDatab.append("Zakaz", orderData);     
    formDatab.append("Idprice", fieldState.idprice);

    const apiUrl = uiMain.Urorder;

    if (!isSubmitDisabled() && uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && !encrypting) {
      setEncrypting(true);

      try {
        const encryptedFieldNames = ["FirstName", "MiddleName", "LastName", "Email", "Phone", "Message", "Address"];
        const encryptedFormData = {};

        for (const fieldName of encryptedFieldNames) {
          const fieldValue = formData[fieldName];
          let encryptedChunk1, encryptedChunk2;
          if (fieldValue !== "" && fieldValue !== undefined) {
            [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
          } else {
            encryptedChunk1 = "";
            encryptedChunk2 = "";
          }
          encryptedFormData[fieldName + "1"] = encryptedChunk1;
          encryptedFormData[fieldName + "2"] = encryptedChunk2;
        }

        for (const [key, value] of Object.entries(encryptedFormData)) {
          formDatab.append(key, value);
        }

      } catch (error) {
        console.error('Encryption error:', error);
      } finally {
        setEncrypting(false);
      }
    } else {
      for (const [key, value] of Object.entries(formData)) {
        formDatab.append(key, value);
      }
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formDatab
      });
      const data = await response.text();
      const orderNumber = parseInt(data.split(":")[1]);

      if (!isNaN(orderNumber)) {
        setOrderNumber(orderNumber);
        setOrderSubmitted(true);
        clearCart();
      } else {
        alert("⚠️Order submission failed. Please try again.");        
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false); 
      setSubmitting(false); 
    }
  };

  const errorMessages = [...new Set(Object.values(formErrors))].map((errorMessage, index) => {
    return errorMessage && <p key={index} className="error-message">{errorMessage}</p>;
  });

  const renderErrorMessages = (name) => {
    const errorMessage = formErrors[name];
    return errorMessage && <p key={name} className="error-message">{errorMessage}</p>;    
  };

  let id, title, count, price;
  if (queryParams.has('id')) {
    id = queryParams.get('id');
    title = queryParams.get('title');
    count = queryParams.get('count');
    price = queryParams.get('price');
  }

  const clearCart = () => {
    if (!id && !title && !count && !price) {
      setCartItems([]);
      setTotalPrice(0);
      setTotalCount(0);
    }
  }

  let orderData = '';
  if (id && title && count && price) {   
    orderData = `${id} - ${title} - ${count} each at ${price}`;
  } else {    
    orderData = cartItems.map((item) => {
      return `${item.id} - ${item.title} - ${item.count} each at ${item.price}`;
    }).join('; ');
  }

  useEffect(() => {
    if (uiMain.length === 0) {
      setShowRegistrationForm(false);
      navigate('/');
    }
  }, [uiMain, navigate, setShowRegistrationForm]);

  useEffect(() => {
    if (!loggedIn) {
      setShowRegistrationForm(true);
    }
  }, [loggedIn, setShowRegistrationForm]);

  if (uiMain.length === 0) {
    return null;
  }

  if (!loggedIn) {
    if (showRegistrationForm) {      
      return (
        <div className={`main-form ${theme}`}>
        </div>
      );  
    }
    return (
      <div className={`main-form ${theme}`}>
        <Link to="/cart" className="back-button">
          <img src={back} className="back-button selected" alt='back' />
        </Link>    
        <button className="filters selected" onClick={() => setShowRegistrationForm(true)}>
          <img src={user} className="back-button selected" alt='Registration' />
          Please Log In  
        </button>
      </div>
    );
  }

  return (
    <div className={`main-form ${theme}`}>
      <Link to="/cart" className="back-button">
        <img src={back} className="back-button selected" alt='back' />
      </Link>
      <h1 className="filters">ORDER FORM</h1>
     
      <div>        
        {loggedIn && !orderSubmitted && (
          <>
            {loading && <LoadingAnimation />}
            {fieldState.orderinfo && fieldState.orderinfo !== "" && (<div className='filters'><InfoModal text={fieldState.orderinfo} /></div>)}
            <form className="form" onSubmit={handleSubmit}>
              <table>
                <tbody>
                  <tr>
                    <td><img src={user} className="form-icon selected" alt='NickName' /></td>
                    <td>
                      <label className='form-input'>Nickname:<strong>{savedLogin}</strong></label>
                    </td>
                  </tr>
                  {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('FirstName'))) && (
                    <tr>
                      <td><img src={user} className="form-icon selected" alt='FirstName' /></td>
                      <td>
                        <input className='form-input' autoFocus
                          placeholder="First Name"
                          name="FirstName"
                          type="text"
                          maxLength={50}
                          defaultValue={formData.FirstName}
                          required
                        />{renderErrorMessages("FirstName")}
                      </td>
                    </tr>
                  )}
                  {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('MiddleName'))) && (
                    <tr>
                      <td><img src={user} className="form-icon selected" alt='MiddleName' /></td>
                      <td>
                        <input className='form-input'
                          placeholder="Middle Name"
                          name="MiddleName"
                          type="text"
                          maxLength={50}
                          defaultValue={formData.MiddleName}
                          required                          
                        />{renderErrorMessages("MiddleName")}
                      </td>
                    </tr>
                  )}
                  {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('LastName'))) && (
                    <tr>
                      <td><img src={user} className="form-icon selected" alt='LastName' /></td>
                      <td>
                        <input className='form-input'
                          placeholder="Last Name"
                          name="LastName"
                          type="text"
                          maxLength={50}
                          defaultValue={formData.LastName}
                          required
                        />{renderErrorMessages("LastName")}
                      </td>
                    </tr>
                  )}
                  {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Email'))) && (
                    <tr>
                      <td><img src={email} className="form-icon selected" alt='Email' /></td>
                      <td>
                        <input className='form-input'
                          placeholder="Email"
                          name="Email"
                          type="email"
                          maxLength={50}
                          defaultValue={formData.Email}
                          required
                          //pattern='[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}'                     
                         //title="Please enter a valid email address"
                        />{renderErrorMessages("Email")}
                      </td>
                    </tr>
                  )}
                  {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Phone'))) && (
                    <tr>
                      <td><img src={call} className="form-icon selected" alt='Phone' /></td>
                      <td>
                        <input className='form-input'
                          placeholder="Phone"
                          name="Phone"
                          type="text"
                          maxLength={15}
                          defaultValue={formData.Phone}
                          pattern="[0-9]{6,15}" 
                          title="Please enter a valid phone number (6 to 15 digits)"
                          required
                        />{renderErrorMessages("Phone")}
                      </td>
                    </tr>
                  )}
                  {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Address'))) && (
                    <tr>
                      <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
                      <td>
                        <input className='form-input'
                          placeholder="Address"
                          name="Address"
                          type="text"
                          maxLength={50}
                          defaultValue={formData.Address}
                          required
                        />{renderErrorMessages("Address")}
                      </td>
                    </tr>
                  )}
                  {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Message'))) && (
                    <tr>
                      <td><img src={chat} className="form-icon selected" alt='Message' /></td>
                      <td>
                        <textarea className='form-input'
                          placeholder="Additional message"
                          name="Message"
                          maxLength={100}
                          defaultValue={formData.Message}
                          rows={3}
                        />{renderErrorMessages("Message")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {errorMessages}             
              <table className='order-tab'>
                <thead>
                  <tr>
                    <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
                    <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
                    <th>Quantity</th>
                    <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
                  </tr>
                </thead>
                <tbody className='order-body'>
                  {id && title && count && price && (
                    <tr>
                      <td>{id}</td>
                      <td>{title}</td>
                      <td>{count}</td>
                      <td>{price}</td>
                    </tr>
                  )}
                  {!id && !title && !count && !price && (
                    cartItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.count}</td>
                        <td>{item.price}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2"></td>
                    <td>Total:</td>
                    <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
                  </tr>
                </tfoot>
              </table>
              <button type="submit" className="back-button selected"  disabled={isSubmitDisabled()||submitting} style={{ cursor: isSubmitDisabled()||submitting ? 'not-allowed' : 'pointer' }}>
                Submit Order
              </button>
            </form>
          </>
        )}
        {orderSubmitted && orderNumber !== null && (
          <div className="filters">
            <h2>Thank you for your order!</h2>
            <p>Your order number is:<b> {orderNumber}</b></p>
          </div>
        )}
      </div>
    </div>
  );
}




// import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import './form.css';
// //import RegistrationForm from './RegistrationForm';
// import InfoModal from '../specific-book/InfoModal';
// import RSAEncryption from '../rsacomponent/RSAEncryption';
// import LoadingAnimation from '../utils/LoadingAnimation'; 
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png';

// export default function Form() {
//   const { 
//     showRegistrationForm, 
//     setShowRegistrationForm, 
//     theme, 
//     loggedIn, 
//     savedLogin, 
//     setCartItems, 
//     setTotalPrice, 
//     totalPrice, 
//     setTotalCount, 
//     cartItems, 
//     uiMain, 
//     fieldState 
//   } = useContext(BooksContext);
  
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const { encryptRSA } = RSAEncryption();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     FirstName: '', MiddleName: '', LastName: '', Email: '', Phone: '', Address: '', Message: ''
//   });

//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);
//   const [encrypting, setEncrypting] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formErrors, setFormErrors] = useState({});

//   //const invalidCharsPattern = useMemo(() => /[=+"']/, []); // Define the invalid characters pattern
//   const validationPatterns = useMemo(() => ({
//     invalidChars: {
//       pattern: /[=+"']/,
//       message: 'Invalid characters 🚫 [=+"\''
//     }
//   }), []);
 
//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }

//   const clearCart = () => {
//     if (!id && !title && !count && !price) {
//       setCartItems([]);
//       setTotalPrice(0);
//       setTotalCount(0);
//     }
//   }

//   const isSubmitDisabled = useCallback(() => {
//     const excludedFields = [''];
//     return Object.keys(formData).some(field =>
//       (!excludedFields.includes(field) && formData[field] === undefined) || Object.values(formErrors).some((error) => error)
//     );
//   }, [formData, formErrors]);

//   useEffect(() => {
//     const handleInputChange = (e) => {
//       const { name, value } = e.target;
//       console.log(value)
//       let errorMessage = '';
//       if (validationPatterns.invalidChars.pattern.test(value)) {
//         errorMessage = validationPatterns.invalidChars.message;
//       }
//       setFormData({ ...formData, [name]: errorMessage ? undefined : value });
//       setFormErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
      
//       //setFormErrors({ ...formErrors, [name]: errorMessage });

//       // if (invalidCharsPattern && invalidCharsPattern.test(value)) {
//       //   setFormData({ ...formData, [name]: undefined });
//       // } else {
//       //   setFormData({ ...formData, [name]: value });
//       // }
//       isSubmitDisabled();
//     };
  
//     const inputs = document.querySelectorAll('.form input, .form textarea');
//     //inputs.forEach(input => input.addEventListener('change', console.log("9")));
//     inputs.forEach(input => input.addEventListener('change', handleInputChange));
  
//     return () => {
//       inputs.forEach(input => input.removeEventListener('change', handleInputChange));
//     };
//   }, [formData, validationPatterns, isSubmitDisabled]); 

//   const errorMessages = Object.keys(formErrors).map((fieldName) => {
//     return formErrors[fieldName] && <p key={fieldName} className="error-message">{formErrors[fieldName]}</p>;
//   });

//   const handleEncrypt = async (publicKey1, publicKey2, plaintext) => {
//     try {
//       const encryptedMessage = await encryptRSA(publicKey1 + publicKey2, plaintext);
//       const chunkSize = 256;
//       const encryptedChunks = [];
//       for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
//         encryptedChunks.push(encryptedMessage.substring(i, i + chunkSize));
//       }
//       return encryptedChunks;
//     } catch (error) {
//       console.error('Encryption error:', error);
//       return [];
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); 
//     setLoading(true);
//     setSubmitting(true); 

//     const formDatab = new FormData();

//     formDatab.append("Name", savedLogin);
//     formDatab.append("Zakaz", orderData);     
//     formDatab.append("Idprice", fieldState.idprice);

//     const apiUrl = uiMain.Urorder;

//     if (!isSubmitDisabled() && uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && !encrypting) {
//       setEncrypting(true);

//       try {
//         const encryptedFieldNames = ["FirstName", "MiddleName", "LastName", "Email", "Phone", "Message", "Address"];
//         const encryptedFormData = {};

//         for (const fieldName of encryptedFieldNames) {
//           const fieldValue = formData[fieldName];
//           let encryptedChunk1, encryptedChunk2;
//           if (fieldValue !== "" && fieldValue !== undefined) {
//             [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
//           } else {
//             encryptedChunk1 = "";
//             encryptedChunk2 = "";
//           }
//           encryptedFormData[fieldName + "1"] = encryptedChunk1;
//           encryptedFormData[fieldName + "2"] = encryptedChunk2;
//         }

//         for (const [key, value] of Object.entries(encryptedFormData)) {
//           formDatab.append(key, value);
//         }

//       } catch (error) {
//         console.error('Encryption error:', error);
//       } finally {
//         setEncrypting(false);
//       }
//     } else {
//       for (const [key, value] of Object.entries(formData)) {
//         formDatab.append(key, value);
//       }
//     }

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         body: formDatab
//       });
//       const data = await response.text();
//       const orderNumber = parseInt(data.split(":")[1]);

//       if (!isNaN(orderNumber)) {
//         setOrderNumber(orderNumber);
//         setOrderSubmitted(true);
//         clearCart();
//       } else {
//         alert("⚠️Order submission failed. Please try again.");
//         console.log(data);
//       }
//     } catch (error) {
//       alert(error);
//     } finally {
//       setLoading(false); 
//       setSubmitting(false); 
//     }
//   };

//   let orderData = '';
//   if (id && title && count && price) {   
//     orderData = `${id} - ${title} - ${count} each at ${price}`;
//   } else {    
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} each at ${item.price}`;
//     }).join('; ');
//   }

//   useEffect(() => {
//     if (uiMain.length === 0) {
//       setShowRegistrationForm(false);
//       navigate('/');
//     }
//   }, [uiMain, navigate, setShowRegistrationForm]);

//   useEffect(() => {
//     if (!loggedIn) {
//       setShowRegistrationForm(true);
//     }
//   }, [loggedIn, setShowRegistrationForm]);

//   if (uiMain.length === 0) {
//     return null;
//   }

//   if (!loggedIn) {
//     if (showRegistrationForm) {
//       return (
//         <div className={`main-form ${theme}`}>
//           {/* <Link to="/cart" className="back-button">
//             <img src={back} className="back-button selected" alt='back' />
//           </Link>
//           <RegistrationForm />
//           <button className="filters selected" onClick={() => setShowRegistrationForm(false)}>
//             <img src={user} className="back-button selected" alt='back' />
//             Back  
//           </button> */}
//         </div>
//       );
//     } else {
//       return (
//         <div className={`main-form ${theme}`}>
//           <Link to="/cart" className="back-button">
//             <img src={back} className="back-button selected" alt='back' />
//           </Link>    
//           <button className="filters selected" onClick={() => setShowRegistrationForm(true)}>
//             <img src={user} className="back-button selected" alt='Registration' />
//             Please Log In  
//           </button>
//         </div>
//       );
//     }
//   }

//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back' />
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
     
//       <div>        
//         {loggedIn && !orderSubmitted && (
//           <>
//             {loading && <LoadingAnimation />}
//             {fieldState.orderinfo && fieldState.orderinfo !== "" && (<div className='filters'><InfoModal text={fieldState.orderinfo} /></div>)}
//             <form className="form" onSubmit={handleSubmit}>
//               <table>
//                 <tbody>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='NickName' /></td>
//                     <td>
//                       <label className='form-input'>Nickname:<strong>{savedLogin}</strong></label>
//                     </td>
//                   </tr>
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('FirstName'))) && (
//                     <tr>
//                       <td><img src={user} className="form-icon selected" alt='FirstName' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="First Name"
//                           name="FirstName"
//                           type="text"
//                           maxLength={50}
//                           defaultValue={formData.FirstName}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('MiddleName'))) && (
//                     <tr>
//                       <td><img src={user} className="form-icon selected" alt='MiddleName' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Middle Name"
//                           name="MiddleName"
//                           type="text"
//                           maxLength={50}
//                           defaultValue={formData.MiddleName}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('LastName'))) && (
//                     <tr>
//                       <td><img src={user} className="form-icon selected" alt='LastName' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Last Name"
//                           name="LastName"
//                           type="text"
//                           maxLength={50}
//                           defaultValue={formData.LastName}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Email'))) && (
//                     <tr>
//                       <td><img src={email} className="form-icon selected" alt='Email' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Email"
//                           name="Email"
//                           type="email"
//                           maxLength={50}
//                           defaultValue={formData.Email}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Phone'))) && (
//                     <tr>
//                       <td><img src={call} className="form-icon selected" alt='Phone' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Phone"
//                           name="Phone"
//                           type="text"
//                           maxLength={15}
//                           defaultValue={formData.Phone}
//                           pattern="[0-9]{6,15}" 
//                           title="Please enter a valid phone number (6 to 15 digits)"
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Address'))) && (
//                     <tr>
//                       <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Address"
//                           name="Address"
//                           type="text"
//                           maxLength={50}
//                           defaultValue={formData.Address}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Message'))) && (
//                     <tr>
//                       <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                       <td>
//                         <textarea className='form-input'
//                           placeholder="Additional message"
//                           name="Message"
//                           maxLength={100}
//                           defaultValue={formData.Message}
//                           rows={3}
//                         />
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//               {errorMessages}
//               {/* {isSubmitDisabled() && invalidCharsPattern && <p className="error-message">🚫Invalid characters {invalidCharsPattern.toString().slice(2, -2)} are not allowed.</p>} */}
//               <table className='order-tab'>
//                 <thead>
//                   <tr>
//                     <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
//                     <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
//                     <th>Quantity</th>
//                     <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
//                   </tr>
//                 </thead>
//                 <tbody className='order-body'>
//                   {id && title && count && price && (
//                     <tr>
//                       <td>{id}</td>
//                       <td>{title}</td>
//                       <td>{count}</td>
//                       <td>{price}</td>
//                     </tr>
//                   )}
//                   {!id && !title && !count && !price && (
//                     cartItems.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.id}</td>
//                         <td>{item.title}</td>
//                         <td>{item.count}</td>
//                         <td>{item.price}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="2"></td>
//                     <td>Total:</td>
//                     <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//               <button type="submit" className="back-button selected"  disabled={isSubmitDisabled()||submitting} style={{ cursor: isSubmitDisabled()||submitting ? 'not-allowed' : 'pointer' }}>
//                 Submit Order
//               </button>
//             </form>
//           </>
//         )}
//         {orderSubmitted && orderNumber !== null && (
//           <div className="filters">
//             <h2>Thank you for your order!</h2>
//             <p>Your order number is:<b> {orderNumber}</b></p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import './form.css';
// import RegistrationForm from './RegistrationForm';
// import InfoModal from '../specific-book/InfoModal';
// import RSAEncryption from '../rsacomponent/RSAEncryption';
// import LoadingAnimation from '../utils/LoadingAnimation'; 
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png';

// export default function Form() {
//   const { 
//     showRegistrationForm, 
//     setShowRegistrationForm, 
//     theme, 
//     loggedIn, 
//     savedLogin, 
//     setCartItems, 
//     setTotalPrice, 
//     totalPrice, 
//     setTotalCount, 
//     cartItems, 
//     uiMain, 
//     fieldState 
//   } = useContext(BooksContext);
  
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const { encryptRSA } = RSAEncryption();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     FirstName: '', MiddleName: '', LastName: '', Email: '', Phone: '', Address: '', Message: ''
//   });

//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);
//   const [encrypting, setEncrypting] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const invalidCharsPattern = useMemo(() => /[=+"']/, []); // Define the invalid characters pattern
 
//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }

//   const clearCart = () => {
//     if (!id && !title && !count && !price) {
//       setCartItems([]);
//       setTotalPrice(0);
//       setTotalCount(0);
//     }
//   }

//   const isSubmitDisabled = useCallback(() => {
//     const excludedFields = [''];
//     return Object.keys(formData).some(field =>
//       !excludedFields.includes(field) && formData[field] === undefined
//     );
//   }, [formData]);

//   useEffect(() => {
//     const handleInputChange = (e) => {
//       const { name, value } = e.target;
//       if (invalidCharsPattern && invalidCharsPattern.test(value)) {
//         setFormData({ ...formData, [name]: undefined });
//       } else {
//         setFormData({ ...formData, [name]: value });
//       }
//       isSubmitDisabled();
//     };
  
//     const inputs = document.querySelectorAll('.form input, .form textarea');
//     inputs.forEach(input => input.addEventListener('change', handleInputChange));
  
//     return () => {
//       inputs.forEach(input => input.removeEventListener('change', handleInputChange));
//     };
//   }, [formData, invalidCharsPattern, isSubmitDisabled, loggedIn]); 

//   const handleEncrypt = async (publicKey1, publicKey2, plaintext) => {
//     try {
//       const encryptedMessage = await encryptRSA(publicKey1 + publicKey2, plaintext);
//       const chunkSize = 256;
//       const encryptedChunks = [];
//       for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
//         encryptedChunks.push(encryptedMessage.substring(i, i + chunkSize));
//       }
//       return encryptedChunks;
//     } catch (error) {
//       console.error('Encryption error:', error);
//       return [];
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); 
//     setLoading(true);
//     setSubmitting(true); 

//     const formDatab = new FormData();

//     formDatab.append("Name", savedLogin);
//     formDatab.append("Zakaz", orderData);     
//     formDatab.append("Idprice", fieldState.idprice);

//     const apiUrl = uiMain.Urorder;

//     if (!isSubmitDisabled() && uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && !encrypting) {
//       setEncrypting(true);

//       try {
//         const encryptedFieldNames = ["FirstName", "MiddleName", "LastName", "Email", "Phone", "Message", "Address"];
//         const encryptedFormData = {};

//         for (const fieldName of encryptedFieldNames) {
//           const fieldValue = formData[fieldName];
//           let encryptedChunk1, encryptedChunk2;
//           if (fieldValue !== "" && fieldValue !== undefined) {
//             [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
//           } else {
//             encryptedChunk1 = "";
//             encryptedChunk2 = "";
//           }
//           encryptedFormData[fieldName + "1"] = encryptedChunk1;
//           encryptedFormData[fieldName + "2"] = encryptedChunk2;
//         }

//         for (const [key, value] of Object.entries(encryptedFormData)) {
//           formDatab.append(key, value);
//         }

//       } catch (error) {
//         console.error('Encryption error:', error);
//       } finally {
//         setEncrypting(false);
//       }
//     } else {
//       for (const [key, value] of Object.entries(formData)) {
//         formDatab.append(key, value);
//       }
//     }

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         body: formDatab
//       });
//       const data = await response.text();
//       const orderNumber = parseInt(data.split(":")[1]);

//       if (!isNaN(orderNumber)) {
//         setOrderNumber(orderNumber);
//         setOrderSubmitted(true);
//         clearCart();
//       } else {
//         alert("⚠️Order submission failed. Please try again.");
//         console.log(data);
//       }
//     } catch (error) {
//       alert(error);
//     } finally {
//       setLoading(false); 
//       setSubmitting(false); 
//     }
//   };

//   let orderData = '';
//   if (id && title && count && price) {   
//     orderData = `${id} - ${title} - ${count} each at ${price}`;
//   } else {    
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} each at ${item.price}`;
//     }).join('; ');
//   }

//   useEffect(() => {
//     if (uiMain.length === 0) {
//       setShowRegistrationForm(false);
//       navigate('/');
//     }
//   }, [uiMain, navigate, setShowRegistrationForm]);

//   useEffect(() => {
//     if (!loggedIn) {
//       setShowRegistrationForm(true);
//     }
//   }, [loggedIn, setShowRegistrationForm]);

//   if (uiMain.length === 0) {
//     return null;
//   }

//   if (!loggedIn) {
//     if (showRegistrationForm) {
//       return (
//         <div className={`main-form ${theme}`}>
//           {/* <Link to="/cart" className="back-button">
//             <img src={back} className="back-button selected" alt='back' />
//           </Link>
//           <RegistrationForm />
//           <button className="filters selected" onClick={() => setShowRegistrationForm(false)}>
//             <img src={user} className="back-button selected" alt='back' />
//             Back  
//           </button> */}
//         </div>
//       );
//     } else {
//       return (
//         <div className={`main-form ${theme}`}>
//           <Link to="/cart" className="back-button">
//             <img src={back} className="back-button selected" alt='back' />
//           </Link>    
//           <button className="filters selected" onClick={() => setShowRegistrationForm(true)}>
//             <img src={user} className="back-button selected" alt='Registration' />
//             Please Log In  
//           </button>
//         </div>
//       );
//     }
//   }

//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back' />
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
     
//       <div>        
//         {loggedIn && !orderSubmitted && (
//           <>
//             {loading && <LoadingAnimation />}
//             {fieldState.orderinfo && fieldState.orderinfo !== "" && (<div className='filters'><InfoModal text={fieldState.orderinfo} /></div>)}
//             <form className="form" onSubmit={handleSubmit}>
//               <table>
//                 <tbody>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='NickName' /></td>
//                     <td>
//                       <label className='form-input'>Nickname:<strong>{savedLogin}</strong></label>
//                     </td>
//                   </tr>
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('FirstName'))) && (
//                     <tr>
//                       <td><img src={user} className="form-icon selected" alt='FirstName' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="First Name"
//                           name="FirstName"
//                           type="text"
//                           maxLength={50}
//                           defaultValue={formData.FirstName}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('MiddleName'))) && (
//                     <tr>
//                       <td><img src={user} className="form-icon selected" alt='MiddleName' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Middle Name"
//                           name="MiddleName"
//                           type="text"
//                           maxLength={50}
//                           defaultValue={formData.MiddleName}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('LastName'))) && (
//                     <tr>
//                       <td><img src={user} className="form-icon selected" alt='LastName' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Last Name"
//                           name="LastName"
//                           type="text"
//                           maxLength={50}
//                           defaultValue={formData.LastName}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Email'))) && (
//                     <tr>
//                       <td><img src={email} className="form-icon selected" alt='Email' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Email"
//                           name="Email"
//                           type="email"
//                           maxLength={50}
//                           defaultValue={formData.Email}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Phone'))) && (
//                     <tr>
//                       <td><img src={call} className="form-icon selected" alt='Phone' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Phone"
//                           name="Phone"
//                           type="text"
//                           maxLength={15}
//                           defaultValue={formData.Phone}
//                           pattern="[0-9]{6,15}" 
//                           title="Please enter a valid phone number (6 to 15 digits)"
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Address'))) && (
//                     <tr>
//                       <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Address"
//                           name="Address"
//                           type="text"
//                           maxLength={50}
//                           defaultValue={formData.Address}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Message'))) && (
//                     <tr>
//                       <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                       <td>
//                         <textarea className='form-input'
//                           placeholder="Additional message"
//                           name="Message"
//                           maxLength={100}
//                           defaultValue={formData.Message}
//                           rows={3}
//                         />
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//               {isSubmitDisabled() && invalidCharsPattern && <p className="error-message">🚫Invalid characters {invalidCharsPattern.toString().slice(2, -2)} are not allowed.</p>}
//               <table className='order-tab'>
//                 <thead>
//                   <tr>
//                     <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
//                     <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
//                     <th>Quantity</th>
//                     <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
//                   </tr>
//                 </thead>
//                 <tbody className='order-body'>
//                   {id && title && count && price && (
//                     <tr>
//                       <td>{id}</td>
//                       <td>{title}</td>
//                       <td>{count}</td>
//                       <td>{price}</td>
//                     </tr>
//                   )}
//                   {!id && !title && !count && !price && (
//                     cartItems.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.id}</td>
//                         <td>{item.title}</td>
//                         <td>{item.count}</td>
//                         <td>{item.price}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="2"></td>
//                     <td>Total:</td>
//                     <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//               <button type="submit" className="back-button selected"  disabled={isSubmitDisabled()||submitting} style={{ cursor: isSubmitDisabled()||submitting ? 'not-allowed' : 'pointer' }}>
//                 Submit Order
//               </button>
//             </form>
//           </>
//         )}
//         {orderSubmitted && orderNumber !== null && (
//           <div className="filters">
//             <h2>Thank you for your order!</h2>
//             <p>Your order number is:<b> {orderNumber}</b></p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import './form.css';
// import RegistrationForm from './RegistrationForm';
// import InfoModal from '../specific-book/InfoModal';
// import RSAEncryption from '../rsacomponent/RSAEncryption';
// import LoadingAnimation from '../utils/LoadingAnimation'; 
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png';

// export default function Form() {
//   const { 
//     showRegistrationForm, 
//     setShowRegistrationForm, 
//     theme, 
//     loggedIn, 
//     savedLogin, 
//     setCartItems, 
//     setTotalPrice, 
//     totalPrice, 
//     setTotalCount, 
//     cartItems, 
//     uiMain, 
//     fieldState 
//   } = useContext(BooksContext);
  
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const { encryptRSA } = RSAEncryption();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     FirstName: '', MiddleName: '', LastName: '', Email: '', Phone: '', Address: '', Message: ''
//   });

//   //const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);
//   const [encrypting, setEncrypting] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const invalidCharsPattern = useMemo(() => /[=+"']/, []); // Define the invalid characters pattern
 
//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }

//   const clearCart = () => {
//     if (!id && !title && !count && !price) {
//       setCartItems([]);
//       setTotalPrice(0);
//       setTotalCount(0);
//     }
//   }

// const isSubmitDisabled  = useCallback(()  => {
//   //const excludedFields = ['Message'];
//   const excludedFields = [''];
//   // Iterate over formData's keys and check for empty values in non-excluded fields
  
//   return Object.keys(formData).some(field =>
//     !excludedFields.includes(field) && formData[field] === undefined
//   ) ;
// }, [formData]);

//   useEffect(() => {
//     const handleInputChange = (e) => {
//       const { name, value } = e.target;
//       console.log(value)
//       if (invalidCharsPattern && invalidCharsPattern.test(value)) { // Use the pattern for validation        
//         setFormData({ ...formData, [name]: undefined });
//       } else {        
//         setFormData({ ...formData, [name]: value });       
//       }
//       isSubmitDisabled()
//     };
  
//     const inputs = document.querySelectorAll('.form input, .form textarea');
//     inputs.forEach(input => input.addEventListener('change', handleInputChange));
  
//     return () => {
//       inputs.forEach(input => input.removeEventListener('change', handleInputChange));
//     };
//   }, [formData, invalidCharsPattern, isSubmitDisabled, loggedIn]); 

//   const handleEncrypt = async (publicKey1, publicKey2, plaintext) => {
//     try {
//       const encryptedMessage = await encryptRSA(publicKey1 + publicKey2, plaintext);
//       const chunkSize = 256;
//       const encryptedChunks = [];
//       for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
//         encryptedChunks.push(encryptedMessage.substring(i, i + chunkSize));
//       }
//       return encryptedChunks;
//     } catch (error) {
//       console.error('Encryption error:', error);
//       return [];
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); 
//     setLoading(true);
//     setSubmitting(true); 

//     const formDatab = new FormData();

//     formDatab.append("Name", savedLogin);
//     formDatab.append("Zakaz", orderData);     
//     formDatab.append("Idprice", fieldState.idprice);

//     const apiUrl = uiMain.Urorder;

//     if (!isSubmitDisabled() && uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && !encrypting) {
//       setEncrypting(true);

//       try {
//         const encryptedFieldNames = ["FirstName", "MiddleName", "LastName", "Email", "Phone", "Message", "Address"];
//         const encryptedFormData = {};

//         for (const fieldName of encryptedFieldNames) {
//           const fieldValue = formData[fieldName];
//           let encryptedChunk1, encryptedChunk2;
//           if (fieldValue !== "" && fieldValue !== undefined) {
//             [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
//           } else {
//             encryptedChunk1 = "";
//             encryptedChunk2 = "";
//           }
//           encryptedFormData[fieldName + "1"] = encryptedChunk1;
//           encryptedFormData[fieldName + "2"] = encryptedChunk2;
//         }

//         for (const [key, value] of Object.entries(encryptedFormData)) {
//           formDatab.append(key, value);
//         }

//       } catch (error) {
//         console.error('Encryption error:', error);
//       } finally {
//         setEncrypting(false);
//       }
//     } else {
//       for (const [key, value] of Object.entries(formData)) {
//         formDatab.append(key, value);
//       }
//     }

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         body: formDatab
//       });
//       const data = await response.text();
//       const orderNumber = parseInt(data.split(":")[1]);

//       if (!isNaN(orderNumber)) {
//         setOrderNumber(orderNumber);
//         setOrderSubmitted(true);
//         clearCart();
//       } else {
//         alert("⚠️Order submission failed. Please try again.");
//         console.log(data)
//       }
//     } catch (error) {
//       alert(error);
//     } finally {
//       setLoading(false); 
//       setSubmitting(false); 
//     }
//   };

//   let orderData = '';
//   if (id && title && count && price) {   
//     orderData = `${id} - ${title} - ${count} each at ${price}`;
//   } else {    
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} each at ${item.price}`;
//     }).join('; ');
//   }

//   useEffect(() => {
//     if (!loggedIn) {
//       setShowRegistrationForm(true)    
//     }
//   }, [loggedIn, setShowRegistrationForm]);  



//   // useEffect(() => {
//   //   // if (!loggedIn) {
//   //   //   setShowRegistrationForm(true)
     
//   //   // }
//   //   if (!loggedIn&& showRegistrationForm===false){    
//   //    console.log("jjj")
//   //     return() => {<img src={user} className="back-button selected" alt='Registration' />}
//   //  }

//   //   if (!loggedIn && showRegistrationForm) {    
//   //     return() => {<RegistrationForm />}    
//   //   }
//   //   if (!loggedIn&& !showRegistrationForm){    
     
//   //     return() => {
//   //      <button className="filters selected" onClick={setShowRegistrationForm(true)}>
//   //      <img src={user} className="back-button selected" alt='Registration' />
//   //      Please Log In  
//   //    </button>
//   //     }
//   //  }

   
//   // }, [loggedIn, setShowRegistrationForm,showRegistrationForm]);  

  


//   useEffect(() => {
//     if (uiMain.length === 0) {
//       setShowRegistrationForm(false);
//       navigate('/');
//     }
//   }, [uiMain, navigate, setShowRegistrationForm]);


//   if (uiMain.length === 0) {
//     return null;
//   }

//   const handleRegistrationButtonClick = () => {
//     setShowRegistrationForm(true);
//   };



// //   if (!loggedIn && showRegistrationForm) {    
// //     <RegistrationForm />    
// //   }
// //   if (!loggedIn){
// //   return(
// //     <button className="filters selected" onClick={handleRegistrationButtonClick}>
// //     <img src={user} className="back-button selected" alt='Registration' />
// //     Please Log In  
// //   </button>
// //   )
// // };



//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back' />
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       {!loggedIn && (
//         <button className="filters selected" onClick={handleRegistrationButtonClick}>
//           <img src={user} className="back-button selected" alt='Registration' />
//           Please Log In  
//         </button>
//       )}
//       {!loggedIn && showRegistrationForm && <RegistrationForm />}
//       <div>        
//         {loggedIn && !orderSubmitted && (
//           <>
//             {loading && <LoadingAnimation />}
//             {fieldState.orderinfo && fieldState.orderinfo !== "" && (<div className='filters'><InfoModal text={fieldState.orderinfo} /></div>)}
//             <form className="form" onSubmit={handleSubmit}>
//               <table>
//                 <tbody>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='NickName' /></td>
//                     <td>
//                       <label className='form-input'>Nickname:<strong>{savedLogin}</strong></label>
//                     </td>
//                   </tr>
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('FirstName'))) && (
//                     <tr>
//                       <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="First Name"
//                           name="FirstName"
//                           type="text"
//                           maxLength={50}
//                           defaultValue={formData.FirstName}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('MiddleName'))) && (
//                     <tr>
//                       <td><img src={user} className="form-icon selected" alt='MiddleName' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Middle Name"
//                           name="MiddleName"
//                           type="text"
//                           maxLength={50}
//                           defaultValue={formData.MiddleName}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('LastName'))) && (
//                     <tr>
//                       <td><img src={user} className="form-icon selected" alt='LastName' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Last Name"
//                           name="LastName"
//                           type="text"
//                           maxLength={50}
//                           defaultValue={formData.LastName}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Email'))) && (
//                     <tr>
//                       <td><img src={email} className="form-icon selected" alt='Email' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Email"
//                           name="Email"
//                           type="email"
//                           maxLength={50}
//                           defaultValue={formData.Email}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Phone'))) && (
//                     <tr>
//                       <td><img src={call} className="form-icon selected" alt='Phone' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Phone"
//                           name="Phone"
//                           type="text"
//                           maxLength={15}
//                           defaultValue={formData.Phone}
//                           pattern="[0-9]{6,15}" 
//                           title="Please enter a valid phone number (6 to 15 digits)"
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Address'))) && (
//                     <tr>
//                       <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Address"
//                           name="Address"
//                           type="text"
//                           maxLength={50}
//                           defaultValue={formData.Address}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Message'))) && (
//                     <tr>
//                       <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                       <td>
//                         <textarea className='form-input'
//                           placeholder="Additional message"
//                           name="Message"
//                           maxLength={100}
//                           defaultValue={formData.Message}
//                           rows={3}
//                         />
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//               {isSubmitDisabled() && invalidCharsPattern && <p className="error-message">🚫Invalid characters {invalidCharsPattern.toString().slice(2, -2)} are not allowed.</p>}
//               <table className='order-tab'>
//                  <thead>
//                    <tr>
//                      <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
//                      <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
//                      <th>Quantity</th>
//                      <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
//                    </tr>
//                  </thead>
//                  <tbody className='order-body'>
//                    {id && title && count && price && (
//                      <tr>
//                        <td>{id}</td>
//                        <td>{title}</td>
//                        <td>{count}</td>
//                        <td>{price}</td>
//                      </tr>
//                    )}
//                    {!id && !title && !count && !price && (
//                      cartItems.map((item, index) => (
//                        <tr key={index}>
//                          <td>{item.id}</td>
//                          <td>{item.title}</td>
//                          <td>{item.count}</td>
//                          <td>{item.price}</td>
//                        </tr>
//                      ))
//                    )}
//                  </tbody>
//                  <tfoot>
//                    <tr>
//                      <td colSpan="2"></td>
//                      <td>Total:</td>
//                      <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
//                    </tr>
//                  </tfoot>
//                </table>
//               <button type="submit" className="back-button selected"  disabled={isSubmitDisabled()||submitting} style={{ cursor: isSubmitDisabled()||submitting ? 'not-allowed' : 'pointer' }}>
//                 Submit Order
//               </button>
//             </form>
//           </>
//         )}
//         {orderSubmitted && orderNumber !== null && (
//           <div className="filters">
//             <h2>Thank you for your order!</h2>
//             <p>Your order number is:<b> {orderNumber}</b></p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import './form.css';
// import RegistrationForm from './RegistrationForm';
// import InfoModal from '../specific-book/InfoModal';
// import RSAEncryption from '../rsacomponent/RSAEncryption';
// import LoadingAnimation from '../utils/LoadingAnimation'; 
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png';

// export default function Form() {
//   const { 
//     showRegistrationForm, 
//     setShowRegistrationForm, 
//     theme, 
//     loggedIn, 
//     savedLogin, 
//     setCartItems, 
//     setTotalPrice, 
//     totalPrice, 
//     setTotalCount, 
//     cartItems, 
//     uiMain, 
//     fieldState 
//   } = useContext(BooksContext);
  
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const { encryptRSA } = RSAEncryption();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     FirstName: '', MiddleName: '', LastName: '', Email: '', Phone: '', Address: '', Message: '',
//     // FirstName: '', MiddleName: '', LastName: '', Email: '', Phone: '', Address: '', Message: '',
//     // FirstName1: '', MiddleName1: '', LastName1: '', Email1: '', Phone1: '', Address1: '', Message1: '',
//     // FirstName2: '', MiddleName2: '', LastName2: '', Email2: '', Phone2: '', Address2: '', Message2: '',   
//   });

//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);
//   const [encrypting, setEncrypting] = useState(false);
//   //const [encryptionCompleted, setEncryptionCompleted] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }

//   const clearCart = () => {
//     if (!id && !title && !count && !price) {
//       setCartItems([]);
//       setTotalPrice(0);
//       setTotalCount(0);
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (/[=+"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => invalidChars;

//   const handleEncrypt = async (publicKey1, publicKey2, plaintext) => {
//     try {
//       const encryptedMessage = await encryptRSA(publicKey1 + publicKey2, plaintext);
//       const chunkSize = 256;
//       const encryptedChunks = [];
//       for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
//         encryptedChunks.push(encryptedMessage.substring(i, i + chunkSize));
//       }
//       return encryptedChunks;
//     } catch (error) {
//       console.error('Encryption error:', error);
//       return [];
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); 
//     setLoading(true);
//     setSubmitting(true); 

//     const formDatab = new FormData();
//     // for (const [key, value] of Object.entries(formData)) {
//     //   formDatab.append(key, value);
//     // }

//     formDatab.append("Name", savedLogin);
//     formDatab.append("Zakaz", orderData);     
//     formDatab.append("Idprice", fieldState.idprice);

//     const apiUrl = uiMain.Urorder;

//     if (!isSubmitDisabled() && uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && !encrypting) {
//       setEncrypting(true);

//       try {
//         const encryptedFieldNames = ["FirstName", "MiddleName", "LastName", "Email", "Phone", "Message", "Address"];
//         const encryptedFormData = {};

//         for (const fieldName of encryptedFieldNames) {
//           const fieldValue = formData[fieldName];
//           let encryptedChunk1, encryptedChunk2;
//           if (fieldValue !== "") {
//             [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
//           } else {
//             encryptedChunk1 = "";
//             encryptedChunk2 = "";
//           }
//           encryptedFormData[fieldName + "1"] = encryptedChunk1;
//           encryptedFormData[fieldName + "2"] = encryptedChunk2;
//         }

//         for (const [key, value] of Object.entries(encryptedFormData)) {
//           formDatab.append(key, value);
//         }

//       } catch (error) {
//         console.error('Encryption error:', error);
//       } finally {
//         setEncrypting(false);
//       }
//     } else {
//       for (const [key, value] of Object.entries(formData)) {
//         formDatab.append(key, value);
//       }
//     }

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         body: formDatab
//       });
//       const data = await response.text();
//       const orderNumber = parseInt(data.split(":")[1]);

//       if (!isNaN(orderNumber)) {
//         setOrderNumber(orderNumber);
//         setOrderSubmitted(true);
//         clearCart();
//       } else {
//         alert("⚠️Order submission failed. Please try again.");
//         console.log(data)
//       }
//     } catch (error) {
//       alert(error);
//     } finally {
//       setLoading(false); 
//       setSubmitting(false); 
//     }
//   };

//   // useEffect(() => {
//   //   if (encrypting) {
//   //     setEncryptionCompleted(false);
//   //   }
//   // }, [encrypting]);

//   // useEffect(() => {
//   //   if (!encrypting && Object.keys(formData).length > 0) {
//   //     setEncryptionCompleted(true);
//   //   }
//   // }, [encrypting, formData]);

//   let orderData = '';
//   if (id && title && count && price) {
//     orderData = `${id} - ${title} - ${count} шт. по ${price} $ каждая`;
//   } else {
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//     }).join('; ');
//   }

//   useEffect(() => {
//     if (!loggedIn) {
//       setShowRegistrationForm(true)
//     }
//   }, [loggedIn, setShowRegistrationForm]);  

//   useEffect(() => {
//     if (uiMain.length === 0) {
//       setShowRegistrationForm(false);
//       navigate('/');
//     }
//   }, [uiMain, navigate, setShowRegistrationForm]);

//   if (uiMain.length === 0) {
//     return null;
//   }

//   const handleRegistrationButtonClick = () => {
//     setShowRegistrationForm(true);
//   };

//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back' />
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       {!loggedIn && (
//         <button className="filters selected" onClick={handleRegistrationButtonClick}>
//           <img src={user} className="back-button selected" alt='Registration' />
//           Please Log In  
//         </button>
//       )}
//       <div>
//         {!loggedIn && showRegistrationForm && <RegistrationForm />}
//         {loggedIn && !orderSubmitted && (
//           <>
//             {loading && <LoadingAnimation />}
//             {fieldState.orderinfo && fieldState.orderinfo !== "" && (<InfoModal text={fieldState.orderinfo} />)}
//             <form className="form" onSubmit={handleSubmit}>
//               <table>
//                 <tbody>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='NickName' /></td>
//                     <td>
//                       <label className='form-input'>Nickname:<strong>{savedLogin}</strong></label>
//                     </td>
//                   </tr>
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('FirstName'))) && (
//                     <tr>
//                       <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="First Name"
//                           name="FirstName"
//                           type="text"
//                           maxLength={50}
//                           value={formData.FirstName}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('MiddleName'))) && (
//                     <tr>
//                       <td><img src={user} className="form-icon selected" alt='MiddleName' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Middle Name"
//                           name="MiddleName"
//                           type="text"
//                           maxLength={50}
//                           value={formData.MiddleName}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('LastName'))) && (
//                     <tr>
//                       <td><img src={user} className="form-icon selected" alt='LastName' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Last Name"
//                           name="LastName"
//                           type="text"
//                           maxLength={50}
//                           value={formData.LastName}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Email'))) && (
//                     <tr>
//                       <td><img src={email} className="form-icon selected" alt='Email' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Email"
//                           name="Email"
//                           type="email"
//                           maxLength={50}
//                           value={formData.Email}
//                           onChange={handleInputChange}
//                           //pattern='[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}'                     
//                           //title="Please enter a valid email address"
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Phone'))) && (
//                     <tr>
//                       <td><img src={call} className="form-icon selected" alt='Phone' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Phone"
//                           name="Phone"
//                           type="text"
//                           maxLength={15}
//                           value={formData.Phone}
//                           onChange={handleInputChange}
//                           pattern="[0-9]{6,15}" 
//                           title="Please enter a valid phone number (6 to 15 digits)"
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Address'))) && (
//                     <tr>
//                       <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
//                       <td>
//                         <input className='form-input'
//                           placeholder="Address"
//                           name="Address"
//                           type="text"
//                           maxLength={50}
//                           value={formData.Address}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </td>
//                     </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Message'))) && (
//                     <tr>
//                       <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                       <td>
//                         <textarea className='form-input'
//                           placeholder="Additional message"
//                           name="Message"
//                           maxLength={100}
//                           value={formData.Message}
//                           onChange={handleInputChange}
//                           rows={3}
//                         />
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//               {invalidChars && <p className="error-message">🚫Invalid characters (=,  +, ", ') are not allowed.</p>}
//               <table className='order-tab'>
//                  <thead>
//                    <tr>
//                      <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
//                      <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
//                      <th>Quantity</th>
//                      <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
//                    </tr>
//                  </thead>
//                  <tbody className='order-body'>
//                    {id && title && count && price && (
//                      <tr>
//                        <td>{id}</td>
//                        <td>{title}</td>
//                        <td>{count}</td>
//                        <td>{price}</td>
//                      </tr>
//                    )}
//                    {!id && !title && !count && !price && (
//                      cartItems.map((item, index) => (
//                        <tr key={index}>
//                          <td>{item.id}</td>
//                          <td>{item.title}</td>
//                          <td>{item.count}</td>
//                          <td>{item.price}</td>
//                        </tr>
//                      ))
//                    )}
//                  </tbody>
//                  <tfoot>
//                    <tr>
//                      <td colSpan="2"></td>
//                      <td>Total:</td>
//                      <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
//                    </tr>
//                  </tfoot>
//                </table>
//               <button type="submit" className="form-button selected"  disabled={isSubmitDisabled()||submitting} style={{ cursor: isSubmitDisabled()||submitting ? 'not-allowed' : 'pointer' }}>
//                 Submit Order
//               </button>
//             </form>
//           </>
//         )}
//         {orderSubmitted && orderNumber !== null && (
//           <div>
//             <h2>Thank you for your order!</h2>
//             <p>Your order number is: {orderNumber}</p>
           
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import './form.css';
// import RegistrationForm from './RegistrationForm';
// import InfoModal from '../specific-book/InfoModal';
// import RSAEncryption from '../rsacomponent/RSAEncryption';
// import LoadingAnimation from '../utils/LoadingAnimation'; 
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png';


// export default function Form() {
//   const { showRegistrationForm, setShowRegistrationForm, theme, loggedIn, savedLogin, setCartItems, setTotalPrice, totalPrice, setTotalCount, cartItems, uiMain, fieldState } = useContext(BooksContext);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const { encryptRSA } = RSAEncryption();
//   const navigate = useNavigate();
//   console.log(uiMain.Urorder)
 
// console.log(showRegistrationForm)
//   const [formData, setFormData] = useState({
//     FirstName: '',
//     MiddleName: '',
//     LastName: '',
//     Email: '',
//     Phone: '',
//     Address: '',
//     Message: '',
//     FirstName1: '',
//     MiddleName1: '',
//     LastName1: '',
//     Email1: '',
//     Phone1: '',
//     Address1: '',
//     Message1: '',
//     FirstName2: '',
//     MiddleName2: '',
//     LastName2: '',
//     Email2: '',
//     Phone2: '',
//     Address2: '',
//     Message2: '',   
//   });

//   //const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);
//   const [encrypting, setEncrypting] = useState(false);
//   const [encryptionCompleted, setEncryptionCompleted] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [loading, setLoading] = useState(false);
//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }


//   function clearCart() {
//     if (!id && !title && !count && !price) {
//       setCartItems([]);
//       setTotalPrice(0);
//       setTotalCount(0);
//     }
//   }

//   const handleInputChange = async (e) => {
//     const { name, value } = e.target;
//     if (/[=+"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//  //   const excludedFields = ['Message']; // Массив исключений
// //console.log((uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !excludedFields.includes(field.trim()) && !formData[field.trim()])))
//     return (
//       invalidChars
//       // invalidChars ||
//       // (uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()])) //!
      
// //(uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !excludedFields.includes(field.trim()) && !formData[field.trim()]))

//     );
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault(); 
//     setLoading(true);
//     if (!isSubmitDisabled() && encryptionCompleted && uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && fieldState.publicKey1 !== "" && fieldState.publicKey2 !== "" && !encrypting) {
//       setEncrypting(true);
//       setSubmitting(true); // Блокируем кнопку сабмита

//       try {
//         const encryptedFieldNames = ["FirstName", "MiddleName", "LastName", "Email", "Phone", "Message", "Address"];
//         const encryptedFormData = {};

//         for (const fieldName of encryptedFieldNames) {
//           const fieldValue = formData[fieldName];
//           let encryptedChunk1, encryptedChunk2;
//           if (fieldValue !== "") {
//             [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
//           } else {
//             encryptedChunk1 = "";
//             encryptedChunk2 = "";
//           }
//           encryptedFormData[fieldName + "1"] = encryptedChunk1;
//           encryptedFormData[fieldName + "2"] = encryptedChunk2;
//         }

//         const formDatab = new FormData();
//         for (const [key, value] of Object.entries(encryptedFormData)) {
//           formDatab.append(key, value);
//         }

//         // Добавляем дополнительные скрытые поля
//       formDatab.append("Name", savedLogin);
//       formDatab.append("Zakaz", orderData);     
//       formDatab.append("Idprice", fieldState.idprice);

//         const apiUrl = uiMain.Urorder;
//         fetch(apiUrl, {
//           method: "POST",
//           body: formDatab
//         })
//           .then(response => response.text())
//           .then(data => {
//             const orderNumber = parseInt(data.split(":")[1]);

//             if (!isNaN(orderNumber)) {
//               setOrderNumber(orderNumber);
//               setOrderSubmitted(true);
//               clearCart();
//             } else {
//               alert("⚠️Order submission failed. Please try again.");
//               console.log(data)
//             }
//           })
//           .catch(error => {
//             alert(error);
//           });
//       } catch (error) {
//         console.error('Ошибка при шифровании:', error);
//       } finally {
//         setEncrypting(false);
//         setLoading(false); 
//       //  setSubmitting(false); // Разблокируем кнопку сабмита
//       }

//     } else {
//       const formDatab = new FormData();
//       for (const [key, value] of Object.entries(formData)) {
//         formDatab.append(key, value);
//       }

//       // Adding additional hidden fields
//       formDatab.append("Name", savedLogin);
//       formDatab.append("Zakaz", orderData);     
//       formDatab.append("Idprice", fieldState.idprice);

//       setSubmitting(true); // Block submit button before sending without encryption

//       const apiUrl = uiMain.Urorder;
//       fetch(apiUrl, {
//         method: "POST",
//         body: formDatab
//       })
//         .then(response => response.text())
//         .then(data => {
//           const orderNumber = parseInt(data.split(":")[1]);

//           if (!isNaN(orderNumber)) {
//             setOrderNumber(orderNumber);
//             setOrderSubmitted(true);
//             clearCart();
//           } else {
//             alert("⚠️Order submission failed. Please try again.");
//             console.log(data)
//           }
//         })
//         .catch(error => {
//           alert(error);
//         })
//         .finally(() => {
//           setEncrypting(false);
//           setEncryptionCompleted(true);
//           setLoading(false);
//           // setSubmitting(false); // Unblock submit button after sending without encryption
//         });
//     }

//   };

  
//   const handleEncrypt = async (publicKey1, publicKey2, plaintext) => {
//     try {
//       const encryptedMessage = await encryptRSA(publicKey1 + publicKey2, plaintext);
//       const chunkSize = 256;
//       const encryptedChunks = [];
//       for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
//         const chunk = encryptedMessage.substring(i, i + chunkSize);
//         encryptedChunks.push(chunk);
//       }
//       setEncryptionCompleted(true); // Устанавливаем состояние encryptionCompleted в true после успешного шифрования
//       return encryptedChunks;
//     } catch (error) {
//       console.error('Ошибка при шифровании:', error);
//       setEncryptionCompleted(false); // Устанавливаем состояние encryptionCompleted в false в случае ошибки
//       return [];
//     }
//   };
  

//   useEffect(() => {
//     if (encrypting) {
//       setEncryptionCompleted(false);
//     }
//   }, [encrypting]);

//   useEffect(() => {
//     if (!encrypting && Object.keys(formData).length > 0) {
//       setEncryptionCompleted(true);
//     }
//   }, [encrypting, formData]);

//   let orderData = '';
//   if (id && title && count && price) {
//     orderData = `${id} - ${title} - ${count} шт. по ${price} $ каждая`;
//   } else {
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//     }).join('; ');
//   }

//   useEffect(() => {
//     if (!loggedIn) {
//       setShowRegistrationForm(true)
//     }
//   }, [loggedIn, setShowRegistrationForm]);  

//   useEffect(() => {
//     if (uiMain.length === 0) {
//       setShowRegistrationForm(false);
//       navigate('/');
//     }
//   }, [uiMain, navigate, setShowRegistrationForm]);

//   if (uiMain.length === 0) {
//     return null;
//   }

//   const handleRegistrationButtonClick = () => {
//     setShowRegistrationForm(true);
//   };
// console.log(submitting)
// console.log(uiMain.orderform)
//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back' />
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       {!loggedIn && (
//         <button className="filters selected" onClick={handleRegistrationButtonClick}>
//           <img src={user} className="back-button selected" alt='Registration' />
//           Please Log In  
//         </button>
//       )}
//       <div>
//         {!loggedIn && showRegistrationForm && <RegistrationForm />}
//         {loggedIn && !orderSubmitted && (
//           <>
//            {loading && <LoadingAnimation />}
//             {fieldState.orderinfo && fieldState.orderinfo !== "" && (<InfoModal text={fieldState.orderinfo} />)}
//             <form className="form" onSubmit={handleSubmit}>
//               <table>
//                 <tbody>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='NickName' /></td>
//                     <td>
//                     <label className='form-input'>Nickname:<strong>{formData.Name}</strong></label>
//                     </td>
//                   </tr>
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('FirstName'))) && (
//                   <tr>
//                   <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="First Name"
//                         name="FirstName"
//                         type="text"
//                         maxLength={50}
//                         value={formData.FirstName}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </td>
//                   </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('MiddleName'))) && (
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Middle Name"
//                         name="MiddleName"
//                         type="text"
//                         maxLength={50}
//                         value={formData.MiddleName}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </td>
//                   </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('LastName'))) && (
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Last Name"
//                         name="LastName"
//                         type="text"
//                         maxLength={50}
//                         value={formData.LastName}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </td>
//                   </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Email'))) && (
//                   <tr>
//                     <td><img src={email} className="form-icon selected" alt='Email' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Email"
//                         name="Email"
//                         type="text"
//                         maxLength={100}
//                         value={formData.Email}
//                         onChange={handleInputChange}
//                         // pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
//                         // pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
//                         pattern='[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}'                     
//                         title="Please enter a valid email address"
//                         required
//                       />
//                     </td>
//                   </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Phone'))) && (
//                   <tr>
//                     <td><img src={call} className="form-icon selected" alt='Phone' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Phone"
//                         name="Phone"
//                         type="text"
//                         maxLength={15}
//                         value={formData.Phone}
//                         onChange={handleInputChange}
//                         pattern="[0-9]{6,15}" 
//                         title="Please enter a valid phone number (6 to 15 digits)"
//                         required
//                       />
//                     </td>
//                   </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Address'))) && (
//                   <tr>
//                     <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Address"
//                         name="Address"
//                         type="text"
//                         maxLength={100}
//                         value={formData.Address}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </td>
//                   </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Message'))) && (
//                   <tr>
//                     <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Additional message"
//                         name="Message"
//                         type="text"
//                         maxLength={100}
//                         value={formData.Message}
//                         onChange={handleInputChange}
//                       />
//                     </td>
//                   </tr>
//                   )}
//                 </tbody>
//               </table>
//               {invalidChars && <p className="error-message">🚫Invalid characters (=,  +, ", ') are not allowed.</p>}
//               {/* {(uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()])) && <p className="error-message">⚠️Please fill in all required fields✳️ and avoid invalid characters.</p>} */}
//               {/* {isSubmitDisabled && <p className="error-message">⚠️Please fill in all required fields✳️ and avoid invalid characters.</p>} */}
//               <input type="hidden" name="Zakaz" value={orderData} />             
//               <input type="hidden" name="Idprice" value={fieldState.idprice} />
//               <table className='order-tab'>
//                 <thead>
//                   <tr>
//                     <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
//                     <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
//                     <th>Quantity</th>
//                     <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
//                   </tr>
//                 </thead>
//                 <tbody className='order-body'>
//                   {id && title && count && price && (
//                     <tr>
//                       <td>{id}</td>
//                       <td>{title}</td>
//                       <td>{count}</td>
//                       <td>{price}</td>
//                     </tr>
//                   )}
//                   {!id && !title && !count && !price && (
//                     cartItems.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.id}</td>
//                         <td>{item.title}</td>
//                         <td>{item.count}</td>
//                         <td>{item.price}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="2"></td>
//                     <td>Total:</td>
//                     <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//               <button className="back-button selected" type="submit" disabled={isSubmitDisabled()|| submitting}>✔️Submit Order</button>
//             </form>
//           </>
//         )}
//         {orderSubmitted && (
//           <div className="filters">
//             <p>🗳Order submitted successfully!</p>
//             <p>Your order number is:<b> {orderNumber}</b></p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import './form.css';
// import RegistrationForm from './RegistrationForm';
// import InfoModal from '../specific-book/InfoModal';
// import RSAEncryption from '../rsacomponent/RSAEncryption';
// import LoadingAnimation from '../utils/LoadingAnimation'; 
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png';


// export default function Form() {
//   const { showRegistrationForm, setShowRegistrationForm, theme, loggedIn, savedLogin, setCartItems, setTotalPrice, totalPrice, setTotalCount, cartItems, uiMain, fieldState } = useContext(BooksContext);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const { encryptRSA } = RSAEncryption();
//   const navigate = useNavigate();
//   console.log(uiMain.Urorder)
//  // const hashedPassword = SHA256(savedLogin + savedPassword).toString();
// console.log(showRegistrationForm)
//   const [formData, setFormData] = useState({
//     Name: savedLogin,
//     FirstName: '',
//     MiddleName: '',
//     LastName: '',
//     Email: '',
//     Phone: '',
//     Address: '',
//     Message: '',
//     FirstName1: '',
//     MiddleName1: '',
//     LastName1: '',
//     Email1: '',
//     Phone1: '',
//     Address1: '',
//     Message1: '',
//     FirstName2: '',
//     MiddleName2: '',
//     LastName2: '',
//     Email2: '',
//     Phone2: '',
//     Address2: '',
//     Message2: '',
//     Idprice: fieldState.idprice,
//   });

//   //const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);
//   const [encrypting, setEncrypting] = useState(false);
//   const [encryptionCompleted, setEncryptionCompleted] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [loading, setLoading] = useState(false);
//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }


//   function clearCart() {
//     if (!id && !title && !count && !price) {
//       setCartItems([]);
//       setTotalPrice(0);
//       setTotalCount(0);
//     }
//   }

//   const handleInputChange = async (e) => {
//     const { name, value } = e.target;
//     if (/[=+"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const isSubmitDisabled = () => {
//     const excludedFields = ['Message']; // Массив исключений
// console.log((uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !excludedFields.includes(field.trim()) && !formData[field.trim()])))
//     return (
      
//       invalidChars ||
//       // (uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()])) //!
      
// (uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !excludedFields.includes(field.trim()) && !formData[field.trim()]))

//     );
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault(); 
//     setLoading(true);
//     if (!isSubmitDisabled() && encryptionCompleted && uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && fieldState.publicKey1 !== "" && fieldState.publicKey2 !== "" && !encrypting) {
//       setEncrypting(true);
//       setSubmitting(true); // Блокируем кнопку сабмита

//       try {
//         const encryptedFieldNames = ["FirstName", "MiddleName", "LastName", "Email", "Phone", "Message", "Address"];
//         const encryptedFormData = {};

//         for (const fieldName of encryptedFieldNames) {
//           const fieldValue = formData[fieldName];
//           let encryptedChunk1, encryptedChunk2;
//           if (fieldValue !== "") {
//             [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
//           } else {
//             encryptedChunk1 = "";
//             encryptedChunk2 = "";
//           }
//           encryptedFormData[fieldName + "1"] = encryptedChunk1;
//           encryptedFormData[fieldName + "2"] = encryptedChunk2;
//         }

//         const formDatab = new FormData();
//         for (const [key, value] of Object.entries(encryptedFormData)) {
//           formDatab.append(key, value);
//         }

//         // Добавляем дополнительные скрытые поля
//       formDatab.append("Name", savedLogin);
//       formDatab.append("Zakaz", orderData);     
//       formDatab.append("Idprice", fieldState.idprice);

//         const apiUrl = uiMain.Urorder;
//         fetch(apiUrl, {
//           method: "POST",
//           body: formDatab
//         })
//           .then(response => response.text())
//           .then(data => {
//             const orderNumber = parseInt(data.split(":")[1]);

//             if (!isNaN(orderNumber)) {
//               setOrderNumber(orderNumber);
//               setOrderSubmitted(true);
//               clearCart();
//             } else {
//               alert("⚠️Order submission failed. Please try again.");
//               console.log(data)
//             }
//           })
//           .catch(error => {
//             alert(error);
//           });
//       } catch (error) {
//         console.error('Ошибка при шифровании:', error);
//       } finally {
//         setEncrypting(false);
//         setLoading(false); 
//       //  setSubmitting(false); // Разблокируем кнопку сабмита
//       }
//     } else {
//       const formEle = document.querySelector("form");
//       const formDatab = new FormData(formEle);
//       setSubmitting(true); // Блокируем кнопку сабмита перед отправкой без шифрования

//       const apiUrl = uiMain.Urorder;
//       fetch(apiUrl, {
//         method: "POST",
//         body: formDatab
//       })
//         .then(response => response.text())
//         .then(data => {
//           const orderNumber = parseInt(data.split(":")[1]);

//           if (!isNaN(orderNumber)) {
//             setOrderNumber(orderNumber);
//             setOrderSubmitted(true);
//             clearCart();
//           } else {
//             alert("⚠️Order submission failed. Please try again.");
//             console.log(data)
//           }
//         })
//         .catch(error => {
//           alert(error);
//         })
//         .finally(() => {
//           setEncrypting(false);
//           setEncryptionCompleted(true);
//           setLoading(false); 
//          // setSubmitting(false); // Разблокируем кнопку сабмита после отправки без шифрования
//         });
//     }
//   };

  
//   const handleEncrypt = async (publicKey1, publicKey2, plaintext) => {
//     try {
//       const encryptedMessage = await encryptRSA(publicKey1 + publicKey2, plaintext);
//       const chunkSize = 256;
//       const encryptedChunks = [];
//       for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
//         const chunk = encryptedMessage.substring(i, i + chunkSize);
//         encryptedChunks.push(chunk);
//       }
//       setEncryptionCompleted(true); // Устанавливаем состояние encryptionCompleted в true после успешного шифрования
//       return encryptedChunks;
//     } catch (error) {
//       console.error('Ошибка при шифровании:', error);
//       setEncryptionCompleted(false); // Устанавливаем состояние encryptionCompleted в false в случае ошибки
//       return [];
//     }
//   };
  

//   useEffect(() => {
//     if (encrypting) {
//       setEncryptionCompleted(false);
//     }
//   }, [encrypting]);

//   useEffect(() => {
//     if (!encrypting && Object.keys(formData).length > 0) {
//       setEncryptionCompleted(true);
//     }
//   }, [encrypting, formData]);

//   let orderData = '';
//   if (id && title && count && price) {
//     orderData = `${id} - ${title} - ${count} шт. по ${price} $ каждая`;
//   } else {
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//     }).join('; ');
//   }

//   useEffect(() => {
//     if (!loggedIn) {
//       setShowRegistrationForm(true)
//     }
//   }, [loggedIn, setShowRegistrationForm]);  

//   useEffect(() => {
//     if (uiMain.length === 0) {
//       setShowRegistrationForm(false);
//       navigate('/');
//     }
//   }, [uiMain, navigate, setShowRegistrationForm]);

//   if (uiMain.length === 0) {
//     return null;
//   }

//   const handleRegistrationButtonClick = () => {
//     setShowRegistrationForm(true);
//   };
// console.log(submitting)
// console.log(uiMain.orderform)
//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back' />
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       {!loggedIn && (
//         <button className="filters selected" onClick={handleRegistrationButtonClick}>
//           <img src={user} className="back-button selected" alt='Registration' />
//           Please Log In  
//         </button>
//       )}
//       <div>
//         {!loggedIn && showRegistrationForm && <RegistrationForm />}
//         {loggedIn && !orderSubmitted && (
//           <>
//            {loading && <LoadingAnimation />}
//             {fieldState.orderinfo && fieldState.orderinfo !== "" && (<InfoModal text={fieldState.orderinfo} />)}
//             <form className="form" onSubmit={handleSubmit}>
//               <table>
//                 <tbody>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder={savedLogin}
//                         name="Name"
//                         type="text"
//                         value={formData.Name}
//                         readOnly
//                       />
//                     </td>
//                   </tr>
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('FirstName'))) && (
//                   <tr>
//                   <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="First Name"
//                         name="FirstName"
//                         type="text"
//                         maxLength={50}
//                         value={formData.FirstName}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </td>
//                   </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('MiddleName'))) && (
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Middle Name"
//                         name="MiddleName"
//                         type="text"
//                         maxLength={50}
//                         value={formData.MiddleName}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </td>
//                   </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('LastName'))) && (
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Last Name"
//                         name="LastName"
//                         type="text"
//                         maxLength={50}
//                         value={formData.LastName}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </td>
//                   </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Email'))) && (
//                   <tr>
//                     <td><img src={email} className="form-icon selected" alt='Email' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Email"
//                         name="Email"
//                         type="text"
//                         maxLength={100}
//                         value={formData.Email}
//                         onChange={handleInputChange}
//                         // pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
//                         // pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
//                         pattern='[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}'                     
//                         title="Please enter a valid email address"
//                         required
//                       />
//                     </td>
//                   </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Phone'))) && (
//                   <tr>
//                     <td><img src={call} className="form-icon selected" alt='Phone' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Phone"
//                         name="Phone"
//                         type="text"
//                         maxLength={15}
//                         value={formData.Phone}
//                         onChange={handleInputChange}
//                         pattern="[0-9]{6,15}" 
//                         title="Please enter a valid phone number (6 to 15 digits)"
//                         required
//                       />
//                     </td>
//                   </tr>
//                   )}
//                   {/* {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Message'))) && (
//                   <tr>
//                     <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Message"
//                         name="Message"
//                         type="text"
//                         maxLength={100}
//                         value={formData.Message}
//                         onChange={handleInputChange}
//                         // required
//                       />
//                     </td>
//                   </tr>
//                   )} */}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Address'))) && (
//                   <tr>
//                     <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Address"
//                         name="Address"
//                         type="text"
//                         maxLength={100}
//                         value={formData.Address}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </td>
//                   </tr>
//                   )}
//                   {(!uiMain.orderform || (uiMain.orderform && uiMain.orderform.split(',').includes('Message'))) && (
//                   <tr>
//                     <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Message"
//                         name="Message"
//                         type="text"
//                         maxLength={100}
//                         value={formData.Message}
//                         onChange={handleInputChange}
//                       />
//                     </td>
//                   </tr>
//                   )}
//                 </tbody>
//               </table>
//               {invalidChars && <p className="error-message">🚫Invalid characters (=,  +, ", ') are not allowed.</p>}
//               {/* {(uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()])) && <p className="error-message">⚠️Please fill in all required fields✳️ and avoid invalid characters.</p>} */}
//               {isSubmitDisabled && <p className="error-message">⚠️Please fill in all required fields✳️ and avoid invalid characters.</p>}
//               <input type="hidden" name="Zakaz" value={orderData} />             
//               <input type="hidden" name="Idprice" value={fieldState.idprice} />
//               <table className='order-tab'>
//                 <thead>
//                   <tr>
//                     <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
//                     <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
//                     <th>Quantity</th>
//                     <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
//                   </tr>
//                 </thead>
//                 <tbody className='order-body'>
//                   {id && title && count && price && (
//                     <tr>
//                       <td>{id}</td>
//                       <td>{title}</td>
//                       <td>{count}</td>
//                       <td>{price}</td>
//                     </tr>
//                   )}
//                   {!id && !title && !count && !price && (
//                     cartItems.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.id}</td>
//                         <td>{item.title}</td>
//                         <td>{item.count}</td>
//                         <td>{item.price}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="2"></td>
//                     <td>Total:</td>
//                     <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//               <button className="back-button selected" type="submit" disabled={isSubmitDisabled()|| submitting}>✔️Submit Order</button>
//             </form>
//           </>
//         )}
//         {orderSubmitted && (
//           <div className="filters">
//             <p>🗳Order submitted successfully!</p>
//             <p>Your order number is:<b> {orderNumber}</b></p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import './form.css';
// import RegistrationForm from './RegistrationForm';
// import InfoModal from '../specific-book/InfoModal';
// import RSAEncryption from '../rsacomponent/RSAEncryption';
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png';
// //import { SHA256 } from 'crypto-js';


// export default function Form() {
//   const { showRegistrationForm, setShowRegistrationForm, theme, loggedIn, savedLogin, setCartItems, setTotalPrice, totalPrice, setTotalCount, cartItems, uiMain, fieldState } = useContext(BooksContext);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const { encryptRSA } = RSAEncryption();
//   const navigate = useNavigate();
//   console.log(uiMain.Urorder)
//  // const hashedPassword = SHA256(savedLogin + savedPassword).toString();
// console.log(showRegistrationForm)
//   const [formData, setFormData] = useState({
//     Name: savedLogin,
//     FirstName: '',
//     MiddleName: '',
//     LastName: '',
//     Email: '',
//     Phone: '',
//     Address: '',
//     Message: '',
//     FirstName1: '',
//     MiddleName1: '',
//     LastName1: '',
//     Email1: '',
//     Phone1: '',
//     Address1: '',
//     Message1: '',
//     FirstName2: '',
//     MiddleName2: '',
//     LastName2: '',
//     Email2: '',
//     Phone2: '',
//     Address2: '',
//     Message2: '',
//     Idprice: fieldState.idprice,
//   });

//   //const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);
//   const [encrypting, setEncrypting] = useState(false);
//   const [encryptionCompleted, setEncryptionCompleted] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }

//   // useEffect(() => {
//   //   setFormData({
//   //     ...formData,
//   //     Name: savedLogin,
//   //     Password1: savedPassword,
//   //   });
//   // }, [savedLogin, savedPassword]);

//   function clearCart() {
//     if (!id && !title && !count && !price) {
//       setCartItems([]);
//       setTotalPrice(0);
//       setTotalCount(0);
//     }
//   }

//   const handleInputChange = async (e) => {
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
//       invalidChars ||
//       (uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()])) //!
//     );
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault(); 

//     if (!isSubmitDisabled() && encryptionCompleted && uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && fieldState.publicKey1 !== "" && fieldState.publicKey2 !== "" && !encrypting) {
//       setEncrypting(true);
//       setSubmitting(true); // Блокируем кнопку сабмита

//       try {
//         const encryptedFieldNames = ["FirstName", "MiddleName", "LastName", "Email", "Phone", "Message", "Address"];
//         const encryptedFormData = {};

//         for (const fieldName of encryptedFieldNames) {
//           const fieldValue = formData[fieldName];
//           let encryptedChunk1, encryptedChunk2;
//           if (fieldValue !== "") {
//             [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
//           } else {
//             encryptedChunk1 = "";
//             encryptedChunk2 = "";
//           }
//           encryptedFormData[fieldName + "1"] = encryptedChunk1;
//           encryptedFormData[fieldName + "2"] = encryptedChunk2;
//         }

//         const formDatab = new FormData();
//         for (const [key, value] of Object.entries(encryptedFormData)) {
//           formDatab.append(key, value);
//         }

//         // Добавляем дополнительные скрытые поля
//       formDatab.append("Name", savedLogin);
//       formDatab.append("Zakaz", orderData);     
//       formDatab.append("Idprice", fieldState.idprice);

//         const apiUrl = uiMain.Urorder;
//         fetch(apiUrl, {
//           method: "POST",
//           body: formDatab
//         })
//           .then(response => response.text())
//           .then(data => {
//             const orderNumber = parseInt(data.split(":")[1]);

//             if (!isNaN(orderNumber)) {
//               setOrderNumber(orderNumber);
//               setOrderSubmitted(true);
//               clearCart();
//             } else {
//               alert("⚠️Order submission failed. Please try again.");
//               console.log(data)
//             }
//           })
//           .catch(error => {
//             alert(error);
//           });
//       } catch (error) {
//         console.error('Ошибка при шифровании:', error);
//       } finally {
//         setEncrypting(false);
//       //  setSubmitting(false); // Разблокируем кнопку сабмита
//       }
//     } else {
//       const formEle = document.querySelector("form");
//       const formDatab = new FormData(formEle);
//       setSubmitting(true); // Блокируем кнопку сабмита перед отправкой без шифрования

//       const apiUrl = uiMain.Urorder;
//       fetch(apiUrl, {
//         method: "POST",
//         body: formDatab
//       })
//         .then(response => response.text())
//         .then(data => {
//           const orderNumber = parseInt(data.split(":")[1]);

//           if (!isNaN(orderNumber)) {
//             setOrderNumber(orderNumber);
//             setOrderSubmitted(true);
//             clearCart();
//           } else {
//             alert("⚠️Order submission failed. Please try again.");
//             console.log(data)
//           }
//         })
//         .catch(error => {
//           alert(error);
//         })
//         .finally(() => {
//           setEncrypting(false);
//           setEncryptionCompleted(true);
//          // setSubmitting(false); // Разблокируем кнопку сабмита после отправки без шифрования
//         });
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault(); // Отменяем действие по умолчанию
  
//   //   if (!isSubmitDisabled() && encryptionCompleted && uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && fieldState.publicKey1 !== "" && fieldState.publicKey2 !== "" && !encrypting) {
//   //    // setInvalidInput(false);
  
//   //     setEncrypting(true); // Устанавливаем флаг encrypting в true, чтобы заблокировать повторное шифрование
  
//   //     try {
//   //       const encryptedFieldNames = ["FirstName", "MiddleName", "LastName", "Email", "Phone", "Message", "Address"];
//   //       const encryptedFormData = {};
  
//   //       for (const fieldName of encryptedFieldNames) {
//   //         const fieldValue = formData[fieldName];
//   //         let encryptedChunk1, encryptedChunk2;
//   //         if (fieldValue !== "") {
//   //           [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
//   //         } else {
//   //           encryptedChunk1 = "";
//   //           encryptedChunk2 = "";
//   //         }
//   //         encryptedFormData[fieldName + "1"] = encryptedChunk1;
//   //         encryptedFormData[fieldName + "2"] = encryptedChunk2;
//   //       }
  
//   //         // Создаем новый объект FormData и добавляем только зашифрованные поля
//   //     const formDatab = new FormData();
//   //     for (const [key, value] of Object.entries(encryptedFormData)) {
//   //       formDatab.append(key, value);
//   //     }

//   //     // Добавляем дополнительные скрытые поля
//   //     formDatab.append("Name", savedLogin);
//   //     formDatab.append("Zakaz", orderData);
//   //     //formDatab.append("Password1", hashedPassword);
//   //     formDatab.append("Idprice", fieldState.idprice);
//   //       // const formEle = document.querySelector("form");
//   //       // const formDatab = new FormData(formEle);
  
//   //       // for (const [key, value] of Object.entries(encryptedFormData)) {
//   //       //   formDatab.append(key, value);
//   //       // }
 
//   //       const apiUrl = uiMain.Urorder;
//   //       fetch(apiUrl, {
//   //         method: "POST",
//   //         body: formDatab
//   //       })
//   //         .then(response => response.text())
//   //         .then(data => {
//   //           const orderNumber = parseInt(data.split(":")[1]);
  
//   //           if (!isNaN(orderNumber)) {
//   //             setOrderNumber(orderNumber);
//   //             setOrderSubmitted(true);
//   //             clearCart();
//   //           } else {
//   //             alert("⚠️Order submission failed. Please try again.");
//   //             console.log(data)
//   //           }
//   //         })
//   //         .catch(error => {
//   //           alert(error);
//   //         });
//   //     } catch (error) {
//   //       console.error('Ошибка при шифровании:', error);
//   //     } finally {
//   //       setEncrypting(false); // Устанавливаем флаг encrypting в false после завершения операции шифрования
//   //     }
//   //   } else {
//   //     //setInvalidInput(true);
      
//   //     // Если условие не выполнено, отправляем форму без шифрования
//   //     const formEle = document.querySelector("form");
//   //     const formDatab = new FormData(formEle);
      
//   //     const apiUrl = uiMain.Urorder;
//   //     fetch(apiUrl, {
//   //       method: "POST",
//   //       body: formDatab
//   //     })
//   //       .then(response => response.text())
//   //       .then(data => {
//   //         const orderNumber = parseInt(data.split(":")[1]);
  
//   //         if (!isNaN(orderNumber)) {
//   //           setOrderNumber(orderNumber);
//   //           setOrderSubmitted(true);
//   //           clearCart();
//   //         } else {
//   //           alert("⚠️Order submission failed. Please try again.");
//   //           console.log(data)
//   //         }
//   //       })
//   //       .catch(error => {
//   //         alert(error);
//   //       });
//   //   }
//   // };
  
  
//   const handleEncrypt = async (publicKey1, publicKey2, plaintext) => {
//     try {
//       const encryptedMessage = await encryptRSA(publicKey1 + publicKey2, plaintext);
//       const chunkSize = 256;
//       const encryptedChunks = [];
//       for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
//         const chunk = encryptedMessage.substring(i, i + chunkSize);
//         encryptedChunks.push(chunk);
//       }
//       setEncryptionCompleted(true); // Устанавливаем состояние encryptionCompleted в true после успешного шифрования
//       return encryptedChunks;
//     } catch (error) {
//       console.error('Ошибка при шифровании:', error);
//       setEncryptionCompleted(false); // Устанавливаем состояние encryptionCompleted в false в случае ошибки
//       return [];
//     }
//   };
  

//   useEffect(() => {
//     if (encrypting) {
//       setEncryptionCompleted(false);
//     }
//   }, [encrypting]);

//   useEffect(() => {
//     if (!encrypting && Object.keys(formData).length > 0) {
//       setEncryptionCompleted(true);
//     }
//   }, [encrypting, formData]);

//   let orderData = '';
//   if (id && title && count && price) {
//     orderData = `${id} - ${title} - ${count} шт. по ${price} $ каждая`;
//   } else {
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//     }).join('; ');
//   }

//   useEffect(() => {
//     if (!loggedIn) {
//       setShowRegistrationForm(true)
//     }
//   }, [loggedIn, setShowRegistrationForm]);  

//   useEffect(() => {
//     if (uiMain.length === 0) {
//       setShowRegistrationForm(false);
//       navigate('/');
//     }
//   }, [uiMain, navigate, setShowRegistrationForm]);

//   if (uiMain.length === 0) {
//     return null;
//   }

//   const handleRegistrationButtonClick = () => {
//     setShowRegistrationForm(true);
//   };

//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back' />
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       {!loggedIn && (
//         <button className="filters selected" onClick={handleRegistrationButtonClick}>
//           <img src={user} className="back-button selected" alt='Registration' />
//           Please Log In  
//         </button>
//       )}
//       <div>
//         {!loggedIn && showRegistrationForm && <RegistrationForm />}
//         {loggedIn && !orderSubmitted && (
//           <>
//             {fieldState.orderinfo && fieldState.orderinfo !== "" && (<InfoModal text={fieldState.orderinfo} />)}
//             <form className="form" onSubmit={handleSubmit}>
//               <table>
//                 <tbody>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder={savedLogin}
//                         name="Name"
//                         type="text"
//                         value={formData.Name}
//                         readOnly
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Name' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                   <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="First Name"
//                         name="FirstName"
//                         type="text"
//                         maxLength={50}
//                         value={formData.FirstName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'FirstName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Middle Name"
//                         name="MiddleName"
//                         type="text"
//                         maxLength={50}
//                         value={formData.MiddleName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'MiddleName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Last Name"
//                         name="LastName"
//                         type="text"
//                         maxLength={50}
//                         value={formData.LastName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'LastName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={email} className="form-icon selected" alt='Email' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Email"
//                         name="Email"
//                         type="text"
//                         maxLength={100}
//                         value={formData.Email}
//                         onChange={handleInputChange}
//                         pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"                     
//                         title="Please enter a valid email address"
//                         required
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Email' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={call} className="form-icon selected" alt='Phone' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Phone"
//                         name="Phone"
//                         type="text"
//                         maxLength={15}
//                         value={formData.Phone}
//                         onChange={handleInputChange}
//                         pattern="[0-9]{6,15}" 
//                         title="Please enter a valid phone number (6 to 15 digits)"
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Phone' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Message"
//                         name="Message"
//                         type="text"
//                         maxLength={100}
//                         value={formData.Message}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Message' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Address"
//                         name="Address"
//                         type="text"
//                         maxLength={100}
//                         value={formData.Address}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Address' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//               {invalidChars && <p className="error-message">🚫Invalid characters (=,  +, ", ') are not allowed.</p>}
//               {(uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()])) && <p className="error-message">⚠️Please fill in all required fields✳️ and avoid invalid characters.</p>}
//               <input type="hidden" name="Zakaz" value={orderData} />             
//               <input type="hidden" name="Idprice" value={fieldState.idprice} />
//               <table className='order-tab'>
//                 <thead>
//                   <tr>
//                     <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
//                     <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
//                     <th>Quantity</th>
//                     <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
//                   </tr>
//                 </thead>
//                 <tbody className='order-body'>
//                   {id && title && count && price && (
//                     <tr>
//                       <td>{id}</td>
//                       <td>{title}</td>
//                       <td>{count}</td>
//                       <td>{price}</td>
//                     </tr>
//                   )}
//                   {!id && !title && !count && !price && (
//                     cartItems.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.id}</td>
//                         <td>{item.title}</td>
//                         <td>{item.count}</td>
//                         <td>{item.price}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="2"></td>
//                     <td>Total:</td>
//                     <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//               <button className="back-button selected" type="submit" disabled={isSubmitDisabled()|| submitting}>✔️Submit Order</button>
//             </form>
//           </>
//         )}
//         {orderSubmitted && (
//           <div className="filters">
//             <p>🗳Order submitted successfully!</p>
//             <p>Your order number is:<b> {orderNumber}</b></p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png';
// import { SHA256 } from 'crypto-js';
// import './form.css';
// import RegistrationForm from './RegistrationForm';
// import InfoModal from '../specific-book/InfoModal';
// import RSAEncryption from '../rsacomponent/RSAEncryption';

// export default function Form() {
//   const { theme, loggedIn, savedLogin, savedPassword, setCartItems, setTotalPrice, totalPrice, setTotalCount, totalCount, cartItems, uiMain, fieldState } = useContext(BooksContext);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const { encryptRSA } = RSAEncryption();

//   const hashedPassword = SHA256(savedLogin + savedPassword).toString();

//   const [formData, setFormData] = useState({
//     Name: savedLogin,
//     FirstName: '',
//     MiddleName: '',
//     LastName: '',
//     Email: '',
//     Phone: '',
//     Address: '',
//     Message: '',
//     FirstName1: '',
//     MiddleName1: '',
//     LastName1: '',
//     Email1: '',
//     Phone1: '',
//     Address1: '',
//     Message1: '',
//     FirstName2: '',
//     MiddleName2: '',
//     LastName2: '',
//     Email2: '',
//     Phone2: '',
//     Address2: '',
//     Message2: '',
//     Password1: hashedPassword,
//     Idprice: fieldState.idprice,
//   });

//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);
//   const [encrypting, setEncrypting] = useState(false);
//   const [encryptionCompleted, setEncryptionCompleted] = useState(false);

//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }

//   useEffect(() => {
//     setFormData({
//       ...formData,
//       Name: savedLogin,
//       Password1: savedPassword,
//     });
//   }, [savedLogin, savedPassword]);

//   function clearCart() {
//     if (!id && !title && !count && !price) {
//       setCartItems([]);
//       setTotalPrice(0);
//       setTotalCount(0);
//     }
//   }

//   const handleInputChange = async (e) => {
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
//       invalidChars ||
//       (uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()]))
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Отменяем действие по умолчанию
  
//     if (!isSubmitDisabled() && encryptionCompleted)
//        {
//       setInvalidInput(false);
   
//       //if (uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && fieldState.publicKey1 !== "" && fieldState.publicKey2 !== "" && !encrypting)

//       setEncrypting(true); // Устанавливаем флаг encrypting в true, чтобы заблокировать повторное шифрование
  
//       try {
//         const encryptedFieldNames = ["FirstName", "MiddleName", "LastName", "Email", "Phone", "Message", "Address"];
//         const encryptedFormData = {};
  
//         for (const fieldName of encryptedFieldNames) {
//           const fieldValue = formData[fieldName];
//          let encryptedChunk1;let encryptedChunk2
//           if (fieldValue!==""){
//            [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
//           }else{encryptedChunk1=""; encryptedChunk2=""}
//           encryptedFormData[fieldName + "1"] = encryptedChunk1;
//           encryptedFormData[fieldName + "2"] = encryptedChunk2;          
//         }
  
//         const formEle = document.querySelector("form");
//         const formDatab = new FormData(formEle);
  
//         for (const [key, value] of Object.entries(encryptedFormData)) {
//           formDatab.append(key, value);          
//         }
  
//         const apiUrl = uiMain.Urorder;
//         fetch(apiUrl, {
//           method: "POST",
//           body: formDatab
//         })
//           .then(response => response.text())
//           .then(data => {
//             const orderNumber = parseInt(data.split(":")[1]);
  
//             if (!isNaN(orderNumber)) {
//               setOrderNumber(orderNumber);
//               setOrderSubmitted(true);
//               clearCart();
//             } else {
//               alert("⚠️Order submission failed. Please try again.");
//             }
//           })
//           .catch(error => {
//             alert(error);
//           });
//       } catch (error) {
//         console.error('Ошибка при шифровании:', error);
//       } finally {
//         setEncrypting(false); // Устанавливаем флаг encrypting в false после завершения операции шифрования
//       }
//     } else {
//       setInvalidInput(true);
//     }
//   };
  
//   const handleEncrypt = async (publicKey1, publicKey2, plaintext) => {
//     try {
//       const encryptedMessage = await encryptRSA(publicKey1 + publicKey2, plaintext);
//       const chunkSize = 256;
//       const encryptedChunks = [];
//       for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
//         const chunk = encryptedMessage.substring(i, i + chunkSize);
//         encryptedChunks.push(chunk);
//       }
//       setEncryptionCompleted(true); // Устанавливаем состояние encryptionCompleted в true после успешного шифрования
//       return encryptedChunks;
//     } catch (error) {
//       console.error('Ошибка при шифровании:', error);
//       setEncryptionCompleted(false); // Устанавливаем состояние encryptionCompleted в false в случае ошибки
//       return [];
//     }
//   };
  

//   useEffect(() => {
//     if (encrypting) {
//       setEncryptionCompleted(false);
//     }
//   }, [encrypting]);

//   useEffect(() => {
//     if (!encrypting && Object.keys(formData).length > 0) {
//       setEncryptionCompleted(true);
//     }
//   }, [encrypting, formData]);

//   let orderData = '';
//   if (id && title && count && price) {
//     orderData = `${id} - ${title} - ${count} шт. по ${price} $ каждая`;
//   } else {
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//     }).join('; ');
//   }
//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back' />
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       <div>
//         {!loggedIn && <RegistrationForm />}
//         {loggedIn && !orderSubmitted && (
//           <>
//             {fieldState.orderinfo && fieldState.orderinfo !== "" && (<InfoModal text={fieldState.orderinfo} />)}
//             <form className="form" onSubmit={handleSubmit}>
//               <table>
//                 <tbody>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder={savedLogin}
//                         name="Name"
//                         type="text"
//                         value={formData.Name}
//                         readOnly
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Name' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                   <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="First Name"
//                         name="FirstName"
//                         type="text"
//                         value={formData.FirstName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'FirstName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Middle Name"
//                         name="MiddleName"
//                         type="text"
//                         value={formData.MiddleName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'MiddleName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Last Name"
//                         name="LastName"
//                         type="text"
//                         value={formData.LastName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'LastName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={email} className="form-icon selected" alt='Email' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Email"
//                         name="Email"
//                         type="text"
//                         value={formData.Email}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Email' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={call} className="form-icon selected" alt='Phone' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Phone"
//                         name="Phone"
//                         type="text"
//                         value={formData.Phone}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Phone' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Message"
//                         name="Message"
//                         type="text"
//                         value={formData.Message}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Message' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Address"
//                         name="Address"
//                         type="text"
//                         value={formData.Address}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Address' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//               {invalidChars && <p className="error-message">🚫Invalid characters (=,  +, ", ') are not allowed.</p>}
//               {(uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()])) && <p className="error-message">⚠️Please fill in all required fields✳️ and avoid invalid characters.</p>}
//               <input type="hidden" name="Zakaz" value={orderData} />
//               <input type="hidden" name="Password1" value={hashedPassword} />
//               <input type="hidden" name="Idprice" value={fieldState.idprice} />
//               <table className='order-tab'>
//                 <thead>
//                   <tr>
//                     <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
//                     <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
//                     <th>Quantity</th>
//                     <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
//                   </tr>
//                 </thead>
//                 <tbody className='order-body'>
//                   {id && title && count && price && (
//                     <tr>
//                       <td>{id}</td>
//                       <td>{title}</td>
//                       <td>{count}</td>
//                       <td>{price}</td>
//                     </tr>
//                   )}
//                   {!id && !title && !count && !price && (
//                     cartItems.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.id}</td>
//                         <td>{item.title}</td>
//                         <td>{item.count}</td>
//                         <td>{item.price}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="2"></td>
//                     <td>Total:</td>
//                     <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//               <button className="back-button selected" type="submit" disabled={isSubmitDisabled()}>✔️Submit Order</button>
//             </form>
//           </>
//         )}
//         {orderSubmitted && (
//           <div className="order-confirmation">
//             <p>🗳Order submitted successfully!</p>
//             <p>Your order number is: {orderNumber}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png';
// import { SHA256 } from 'crypto-js';
// import './form.css';
// import RegistrationForm from './RegistrationForm';
// import InfoModal from '../specific-book/InfoModal';
// import RSAEncryption from '../rsacomponent/RSAEncryption';

// export default function Form() {
//   const { theme, loggedIn, savedLogin, savedPassword, setCartItems, setTotalPrice, totalPrice, setTotalCount, totalCount, cartItems, uiMain, fieldState } = useContext(BooksContext);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const { encryptRSA } = RSAEncryption();

//   const hashedPassword = SHA256(savedLogin + savedPassword).toString();

//   const [formData, setFormData] = useState({
//     Name: savedLogin,
//     FirstName: '',
//     MiddleName: '',
//     LastName: '',
//     Email: '',
//     Phone: '',
//     Address: '',
//     Message: '',
//     FirstName1: '',
//     MiddleName1: '',
//     LastName1: '',
//     Email1: '',
//     Phone1: '',
//     Address1: '',
//     Message1: '',
//     FirstName2: '',
//     MiddleName2: '',
//     LastName2: '',
//     Email2: '',
//     Phone2: '',
//     Address2: '',
//     Message2: '',
//     Password1: hashedPassword,
//     Idprice: fieldState.idprice,
//   });

//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);

//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }

//   useEffect(() => {
//     setFormData({
//       ...formData,
//       Name: savedLogin,
//       Password1: savedPassword,
//     });
//   }, [savedLogin, savedPassword]);

//   function clearCart() {
//           if (!id && !title && !count && !price) {
//             setCartItems([]);
//             setTotalPrice(0);
//             setTotalCount(0);
//           }
//          }




//   const handleEncrypt = async (publicKey1, publicKey2, plaintext) => {
//     const encryptedMessage = await encryptRSA(publicKey1 + publicKey2, plaintext);
//     const chunkSize = 256;
//     const encryptedChunks = [];
//     for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
//       const chunk = encryptedMessage.substring(i, i + chunkSize);
//       encryptedChunks.push(chunk);
//     }
//     return encryptedChunks;
//   };

//   const handleInputChange = async (e) => {
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
//       invalidChars ||
//       (uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()]))
//     );
//   };

//   const [encrypting, setEncrypting] = useState(false); 
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Отменяем действие по умолчанию
  
//     // Добавьте здесь любую логику перед отправкой формы
//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }
  
//     // Encrypt each form field and populate the encrypted chunks in the corresponding hidden fields
//     //const encryptedFormData = {}; // Object to store encrypted chunks for each field
//     const encryptedFieldNames = ["FirstName", "MiddleName", "LastName", "Email", "Phone", "Message","Address"];
  
//     // Например, шифрование данных и обновление состояния формы
//     if (uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && fieldState.publicKey1 !== "" && fieldState.publicKey2 !== "" && !encrypting) 
//     {
//       setEncrypting(true); // Устанавливаем флаг encrypting в true, чтобы заблокировать повторное шифрование
            
//       try {
//         for (const fieldName of encryptedFieldNames) {
//           const fieldValue = formData[fieldName]; // Get the value of the current field
//           console.log(fieldName)
//           console.log(encryptedFieldNames)
//           console.log('Current field value:', fieldValue);
//           const [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
//           console.log('Encrypted chunks:', encryptedChunk1, encryptedChunk2);
//           // Update the encrypted fields in the form data
//           setFormData(prevState => ({
//             ...prevState,
//             [fieldName + "1"]: encryptedChunk1,
//             [fieldName + "2"]: encryptedChunk2
//           }));
//         }
//       } catch (error) {
//         console.error('Ошибка при шифровании:', error);
//       } finally {
//         setEncrypting(false); // Устанавливаем флаг encrypting в false после завершения операции шифрования
//       }
//     }
//   console.log(formData)
//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);
  
//     const apiUrl = uiMain.Urorder;
  
//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]);
  
//         if (!isNaN(orderNumber)) {
//           setOrderNumber(orderNumber);
//           setOrderSubmitted(true);
//           clearCart();
//           // Clear the encrypted fields after submission
//           setFormData(prevState => ({
//             ...prevState,
//             FirstName1: '',
//             FirstName2: '',
//             MiddleName1: '',
//             MiddleName2: '',
//             LastName1: '',
//             LastName2: '',
//             Email1: '',
//             Email2: '',
//             Phone1: '',
//             Phone2: '',
//             Address1: '',
//             Address2: '',
//             Message1: '',
//             Message2: '',
//           }));         
//         } else {
//           alert("⚠️Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   };
  
// console.log(formData)
//   let orderData = '';
//   if (id && title && count && price) {
//     orderData = `${id} - ${title} - ${count} шт. по ${price} $ каждая`;
//   } else {
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//     }).join('; ');
//   }
  
//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back' />
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       <div>
//         {!loggedIn && <RegistrationForm />}
//         {loggedIn && !orderSubmitted && (
//           <>
//             {fieldState.orderinfo && fieldState.orderinfo !== "" && (<InfoModal text={fieldState.orderinfo} />)}
//             <form className="form" onSubmit={handleSubmit}>
//               <table>
//                 <tbody>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder={savedLogin}
//                         name="Name"
//                         type="text"
//                         value={formData.Name}
//                         readOnly
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Name' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="First Name"
//                         name="FirstName"
//                         type="text"
//                         value={formData.FirstName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'FirstName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Middle Name"
//                         name="MiddleName"
//                         type="text"
//                         value={formData.MiddleName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'MiddleName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Last Name"
//                         name="LastName"
//                         type="text"
//                         value={formData.LastName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'LastName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={email} className="form-icon selected" alt='Email' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Email"
//                         name="Email"
//                         type="text"
//                         value={formData.Email}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Email' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={call} className="form-icon selected" alt='Phone' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Phone"
//                         name="Phone"
//                         type="text"
//                         value={formData.Phone}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Phone' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Message"
//                         name="Message"
//                         type="text"
//                         value={formData.Message}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Message' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Address"
//                         name="Address"
//                         type="text"
//                         value={formData.Address}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Address' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//               {invalidChars && <p className="error-message">🚫Invalid characters (=,  +, ", ') are not allowed.</p>}
//               {(uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()])) && <p className="error-message">⚠️Please fill in all required fields✳️ and avoid invalid characters.</p>}
//               <input type="hidden" name="Zakaz" value={orderData} />
//               <input type="hidden" name="Password1" value={hashedPassword} />
//               <input type="hidden" name="Idprice" value={fieldState.idprice} />
//               <input type="hidden" name="FirstName1" value={formData.FirstName1 || ''} />
//               <input type="hidden" name="FirstName2" value={formData.FirstName2 || ''} />
//               <input type="hidden" name="MiddleName1" value={formData.MiddleName1 || ''} />
//               <input type="hidden" name="MiddleName2" value={formData.MiddleName2 || ''} />
//               <input type="hidden" name="LastName1" value={formData.LastName1 || ''} />
//               <input type="hidden" name="LastName2" value={formData.LastName2 || ''} />
//               <input type="hidden" name="Email1" value={formData.Email1 || ''} />
//               <input type="hidden" name="Email2" value={formData.Email2 || ''} />
//               <input type="hidden" name="Phone1" value={formData.Phone1 || ''} />
//               <input type="hidden" name="Phone2" value={formData.Phone2 || ''} />
//               <input type="hidden" name="Address1" value={formData.Address1 || ''} />
//               <input type="hidden" name="Address2" value={formData.Address2 || ''} />
//               <input type="hidden" name="Message1" value={formData.Message1 || ''} />
//               <input type="hidden" name="Message2" value={formData.Message2 || ''} />
//               <table className='order-tab'>
//                 <thead>
//                   <tr>
//                     <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
//                     <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
//                     <th>Quantity</th>
//                     <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
//                   </tr>
//                 </thead>
//                 <tbody className='order-body'>
//                   {id && title && count && price && (
//                     <tr>
//                       <td>{id}</td>
//                       <td>{title}</td>
//                       <td>{count}</td>
//                       <td>{price}</td>
//                     </tr>
//                   )}
//                   {!id && !title && !count && !price && (
//                     cartItems.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.id}</td>
//                         <td>{item.title}</td>
//                         <td>{item.count}</td>
//                         <td>{item.price}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="2"></td>
//                     <td>Total:</td>
//                     <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//               <button className="back-button selected" type="submit" disabled={isSubmitDisabled()}>✔️Submit Order</button>
//             </form>
//           </>
//         )}
//         {orderSubmitted && (
//           <div className="order-confirmation">
//             <p>🗳Order submitted successfully!</p>
//             <p>Your order number is: {orderNumber}</p>
//             {/* <Link to="/cart" className="back-to-cart">Back to cart</Link> */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png';
// import { SHA256 } from 'crypto-js';
// import './form.css';
// import RegistrationForm from './RegistrationForm';
// import InfoModal from '../specific-book/InfoModal';
// import RSAEncryption from '../rsacomponent/RSAEncryption';

// export default function Form() {
//   const { theme, loggedIn, savedLogin, savedPassword, setCartItems, setTotalPrice, totalPrice, setTotalCount, totalCount, cartItems, uiMain, fieldState } = useContext(BooksContext);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const { encryptRSA } = RSAEncryption();

//   const hashedPassword = SHA256(savedLogin + savedPassword).toString();

//   const [formData, setFormData] = useState({
//     Name: savedLogin,
//     FirstName: '',
//     MiddleName: '',
//     LastName: '',
//     Email: '',
//     Phone: '',
//     Address: '',
//     Message: '',
//     FirstName1: '',
//     MiddleName1: '',
//     LastName1: '',
//     Email1: '',
//     Phone1: '',
//     Address1: '',
//     Message1: '',
//     FirstName2: '',
//     MiddleName2: '',
//     LastName2: '',
//     Email2: '',
//     Phone2: '',
//     Address2: '',
//     Message2: '',
//     Password1: hashedPassword,
//     Idprice: fieldState.idprice,
//   });

//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);

//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }

//   useEffect(() => {
//     setFormData({
//       ...formData,
//       Name: savedLogin,
//       Password1: savedPassword,
//     });
//   }, [savedLogin, savedPassword]);

//   function clearCart() {
//           if (!id && !title && !count && !price) {
//             setCartItems([]);
//             setTotalPrice(0);
//             setTotalCount(0);
//           }
//          }




//   const handleEncrypt = async (publicKey1, publicKey2, plaintext) => {
//     const encryptedMessage = await encryptRSA(publicKey1 + publicKey2, plaintext);
//     const chunkSize = 256;
//     const encryptedChunks = [];
//     for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
//       const chunk = encryptedMessage.substring(i, i + chunkSize);
//       encryptedChunks.push(chunk);
//     }
//     return encryptedChunks;
//   };

//   const handleInputChange = async (e) => {
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
//       invalidChars ||
//       (uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()]))
//     );
//   };

//   const [encrypting, setEncrypting] = useState(false); 
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Отменяем действие по умолчанию
  
//     // Добавьте здесь любую логику перед отправкой формы
//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }
  
//     // Encrypt each form field and populate the encrypted chunks in the corresponding hidden fields
//     //const encryptedFormData = {}; // Object to store encrypted chunks for each field
//     const encryptedFieldNames = ["FirstName", "MiddleName", "LastName", "Email", "Phone", "Message","Address"];
  
//     // Например, шифрование данных и обновление состояния формы
//     if (uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && fieldState.publicKey1 !== "" && fieldState.publicKey2 !== "" && !encrypting) 
//     {
//       setEncrypting(true); // Устанавливаем флаг encrypting в true, чтобы заблокировать повторное шифрование
            
//       try {
//         for (const fieldName of encryptedFieldNames) {
//           const fieldValue = formData[fieldName]; // Get the value of the current field
//           console.log(fieldName)
//           console.log(encryptedFieldNames)
//           console.log('Current field value:', fieldValue);
//           const [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
//           console.log('Encrypted chunks:', encryptedChunk1, encryptedChunk2);
//           // Update the encrypted fields in the form data
//           setFormData(prevState => ({
//             ...prevState,
//             [fieldName + "1"]: encryptedChunk1,
//             [fieldName + "2"]: encryptedChunk2
//           }));
//         }
//       } catch (error) {
//         console.error('Ошибка при шифровании:', error);
//       } finally {
//         setEncrypting(false); // Устанавливаем флаг encrypting в false после завершения операции шифрования
//       }
//     }
//   console.log(formData)
//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);
  
//     const apiUrl = uiMain.Urorder;
  
//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]);
  
//         if (!isNaN(orderNumber)) {
//           setOrderNumber(orderNumber);
//           setOrderSubmitted(true);
//           clearCart();
//           // Clear the encrypted fields after submission
//           setFormData(prevState => ({
//             ...prevState,
//             FirstName1: '',
//             FirstName2: '',
//             MiddleName1: '',
//             MiddleName2: '',
//             LastName1: '',
//             LastName2: '',
//             Email1: '',
//             Email2: '',
//             Phone1: '',
//             Phone2: '',
//             Address1: '',
//             Address2: '',
//             Message1: '',
//             Message2: '',
//           }));         
//         } else {
//           alert("⚠️Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   };
  
// console.log(formData)
//   let orderData = '';
//   if (id && title && count && price) {
//     orderData = `${id} - ${title} - ${count} шт. по ${price} $ каждая`;
//   } else {
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//     }).join('; ');
//   }
  
//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back' />
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       <div>
//         {!loggedIn && <RegistrationForm />}
//         {loggedIn && !orderSubmitted && (
//           <>
//             {fieldState.orderinfo && fieldState.orderinfo !== "" && (<InfoModal text={fieldState.orderinfo} />)}
//             <form className="form" onSubmit={handleSubmit}>
//               <table>
//                 <tbody>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder={savedLogin}
//                         name="Name"
//                         type="text"
//                         value={formData.Name}
//                         readOnly
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Name' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="First Name"
//                         name="FirstName"
//                         type="text"
//                         value={formData.FirstName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'FirstName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Middle Name"
//                         name="MiddleName"
//                         type="text"
//                         value={formData.MiddleName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'MiddleName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Last Name"
//                         name="LastName"
//                         type="text"
//                         value={formData.LastName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'LastName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={email} className="form-icon selected" alt='Email' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Email"
//                         name="Email"
//                         type="text"
//                         value={formData.Email}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Email' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={call} className="form-icon selected" alt='Phone' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Phone"
//                         name="Phone"
//                         type="text"
//                         value={formData.Phone}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Phone' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Message"
//                         name="Message"
//                         type="text"
//                         value={formData.Message}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Message' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Address"
//                         name="Address"
//                         type="text"
//                         value={formData.Address}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Address' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//               {invalidChars && <p className="error-message">🚫Invalid characters (=,  +, ", ') are not allowed.</p>}
//               {(uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()])) && <p className="error-message">⚠️Please fill in all required fields✳️ and avoid invalid characters.</p>}
//               <input type="hidden" name="Zakaz" value={orderData} />
//               <input type="hidden" name="Password1" value={hashedPassword} />
//               <input type="hidden" name="Idprice" value={fieldState.idprice} />
//               <input type="hidden" name="FirstName1" value={formData.FirstName1 || ''} />
//               <input type="hidden" name="FirstName2" value={formData.FirstName2 || ''} />
//               <input type="hidden" name="MiddleName1" value={formData.MiddleName1 || ''} />
//               <input type="hidden" name="MiddleName2" value={formData.MiddleName2 || ''} />
//               <input type="hidden" name="LastName1" value={formData.LastName1 || ''} />
//               <input type="hidden" name="LastName2" value={formData.LastName2 || ''} />
//               <input type="hidden" name="Email1" value={formData.Email1 || ''} />
//               <input type="hidden" name="Email2" value={formData.Email2 || ''} />
//               <input type="hidden" name="Phone1" value={formData.Phone1 || ''} />
//               <input type="hidden" name="Phone2" value={formData.Phone2 || ''} />
//               <input type="hidden" name="Address1" value={formData.Address1 || ''} />
//               <input type="hidden" name="Address2" value={formData.Address2 || ''} />
//               <input type="hidden" name="Message1" value={formData.Message1 || ''} />
//               <input type="hidden" name="Message2" value={formData.Message2 || ''} />
//               <table className='order-tab'>
//                 <thead>
//                   <tr>
//                     <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
//                     <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
//                     <th>Quantity</th>
//                     <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
//                   </tr>
//                 </thead>
//                 <tbody className='order-body'>
//                   {id && title && count && price && (
//                     <tr>
//                       <td>{id}</td>
//                       <td>{title}</td>
//                       <td>{count}</td>
//                       <td>{price}</td>
//                     </tr>
//                   )}
//                   {!id && !title && !count && !price && (
//                     cartItems.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.id}</td>
//                         <td>{item.title}</td>
//                         <td>{item.count}</td>
//                         <td>{item.price}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="2"></td>
//                     <td>Total:</td>
//                     <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//               <button className="back-button selected" type="submit" disabled={isSubmitDisabled()}>✔️Submit Order</button>
//             </form>
//           </>
//         )}
//         {orderSubmitted && (
//           <div className="order-confirmation">
//             <p>🗳Order submitted successfully!</p>
//             <p>Your order number is: {orderNumber}</p>
//             {/* <Link to="/cart" className="back-to-cart">Back to cart</Link> */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png';
// import { SHA256 } from 'crypto-js'; // Импортируем функцию хеширования SHA256
// import './form.css';
// import RegistrationForm from './RegistrationForm'; // Импортируем компонент регистрации
// import InfoModal from '../specific-book/InfoModal';

// import RSAEncryption from '../rsacomponent/RSAEncryption';


// export default function Form() {
//   const { theme, loggedIn, savedLogin, savedPassword, setCartItems, setTotalPrice, totalPrice, setTotalCount, totalCount, cartItems, uiMain, fieldState } = useContext(BooksContext);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);


//   const { encryptRSA } = RSAEncryption();

//   // Хешируем сумму строк savedLogin и savedPassword с помощью SHA256
//   const hashedPassword = SHA256(savedLogin + savedPassword).toString();
// console.log(fieldState.idprice)
//   const [formData, setFormData] = useState({
//     Name: savedLogin,
//     FirstName: '',
//     MiddleName: '',
//     LastName: '',
//     Email: '',
//     Phone: '',
//     Address: '',
//     Message: '',
//     FirstName1: '',
//     MiddleName1: '',
//     LastName1: '',
//     Email1: '',
//     Phone1: '',
//     Address1: '',
//     Message1: '',
//     FirstName2: '',
//     MiddleName2: '',
//     LastName2: '',
//     Email2: '',
//     Phone2: '',
//     Address2: '',
//     Message2: '',
//     Password1: hashedPassword,
//     Idprice: fieldState.idprice,
//   });

//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);

//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }

//   useEffect(() => {
//     // Обновляем состояние formData при изменении savedLogin и savedPassword
//     setFormData({
//       ...formData,
//       Name: savedLogin,
//       Password1: savedPassword,
//     });
//   }, [savedLogin, savedPassword]);


//   //зашифрование
//   const handleEncrypt = async (publicKey1, publicKey2, plaintext) => {
    
//   //  publicKey2 = publicKey2.trim(); // Удаление пробелов в конце ключа, если они есть
// console.log(publicKey1)
// console.log(publicKey2)
// console.log(publicKey1+publicKey2)
//     const encryptedMessage = await encryptRSA(publicKey1+publicKey2, plaintext);
//     console.log('Зашифрованное сообщение:', encryptedMessage);

//     // Разделение зашифрованного текста на части по 256 символов
//     const chunkSize = 256;
//     const encryptedChunks = [];
//     for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
//       const chunk = encryptedMessage.substring(i, i + chunkSize);
//       encryptedChunks.push(chunk);
//     }

//     return encryptedChunks;
//   };



//   const handleInputChange = async (e) => {
//     const { name, value } = e.target;

//     if (/[=+"']/.test(value)) {
//       setInvalidChars(true);
//     } else {
//       setInvalidChars(false);
//       setFormData({ ...formData, [name]: value });

//       // if (uiMain.order&&uiMain.order !== 'rsa' && fieldState.publicKey1&&fieldState.publicKey2&&fieldState.publicKey1!==""&&fieldState.publicKey2!=="") {
//       //   const [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1,fieldState.publicKey2, value);
//       //   setFormData({ ...formData, [name + "1"]: encryptedChunk1, [name + "2"]: encryptedChunk2 });
//       //  // console.log( [name + "1"], {encryptedChunk1}, [name + "2"] ,{encryptedChunk2})
//       // } else {
//       //   setFormData({ ...formData, [name]: value });
//       // }

//     }
//   };


//   const isSubmitDisabled = () => {
//     return (
//       invalidChars ||
//       (uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()]))
//     );
//   };


//   const [encrypting, setEncrypting] = useState(false); // Состояние для отслеживания процесса шифрования
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Отменяем действие по умолчанию

//     // Добавьте здесь любую логику перед отправкой формы
//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }


//  // Encrypt each form field and populate the encrypted chunks in the corresponding hidden fields
//  const encryptedFormData = {}; // Object to store encrypted chunks for each field
//  const encryptedFieldNames = [
//    "FirstName", "MiddleName", "LastName", "Email", "Phone", "Address", "Message"
//  ];

//     // Например, шифрование данных и обновление состояния формы
//     if (uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey2 && fieldState.publicKey1 !== "" && fieldState.publicKey2 !== "" && !encrypting) {
//       setEncrypting(true); // Устанавливаем флаг encrypting в true, чтобы заблокировать повторное шифрование

//       try {
       
//         for (const fieldName of encryptedFieldNames) {
//           const fieldValue = formData[fieldName]; // Get the value of the current field
//           console.log(fieldValue)
// console.log(fieldName)
// console.log(encryptedFieldNames)

//           const [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, fieldValue);
//           encryptedFormData[fieldName + "1"] = encryptedChunk1;
//           encryptedFormData[fieldName + "2"] = encryptedChunk2;
// console.log(encryptedFormData[fieldName + "1"] )
// console.log(encryptedFormData[fieldName + "2"] )
// console.log(encryptedChunk1)
// console.log(encryptedChunk2)
//         }
//       //console.log(encryptedFormData)
//         // Set the encrypted chunks in the form data
//         setFormData({
//           ...formData,
//           ...encryptedFormData
//         });

//         console.log(formData)
//         console.log(encryptedFormData)
//         console.log({
//           ...formData,
//           ...encryptedFormData
//         })
//       //  const [encryptedChunk1, encryptedChunk2] = await handleEncrypt(fieldState.publicKey1, fieldState.publicKey2, formData.inputValue);
//       //  setFormData({ ...formData, input1: formData.inputValue, input11: encryptedChunk1, input12: encryptedChunk2 });
//       } catch (error) {
//         console.error('Ошибка при шифровании:', error);
//       } finally {
//         setEncrypting(false); // Устанавливаем флаг encrypting в false после завершения операции шифрования
//       }
//     }
//   //};



//   // function Submit(e) {
//   //   e.preventDefault();

//   //   if (isSubmitDisabled()) {
//   //     setInvalidInput(true);
//   //     return;
//   //   } else {
//   //     setInvalidInput(false);
//   //   }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);
    
// console.log(formEle)
// console.log(formDatab)
// console.log(typeof(formDatab))
//     function clearCart() {
//       if (!id && !title && !count && !price) {
//         setCartItems([]);
//         setTotalPrice(0);
//         setTotalCount(0);
//       }
//     }

//     const apiUrl = uiMain.Urorder;
// console.log(formDatab)
//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
    
     
     
//         })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]);

//         if (!isNaN(orderNumber)) {
//           setOrderNumber(orderNumber);
//           setOrderSubmitted(true);
//           setFormData({
//             Name: '',
//             FirstName: '',
//             MiddleName: '',
//             LastName: '',
//             Email: '',
//             Phone: '',
//             Address: '',
//             Message: '',
//             Password1: '',
//             Idprice: '',
//           });
//           clearCart();
//         } else {
//           alert("⚠️Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

//   let orderData = '';
//   if (id && title && count && price) {
//     orderData = `${id} - ${title} - ${count} шт. по ${price} $ каждая`;
//   } else {
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//     }).join('; ');
//   }

//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back' />
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       <div>
//         {!loggedIn && <RegistrationForm />}
//         {loggedIn && !orderSubmitted && (
//           <>
//             {fieldState.orderinfo && fieldState.orderinfo !== "" && (<InfoModal text={fieldState.orderinfo} />)}
//             {/* <form className="form" onSubmit={(e) => Submit(e)}> */}
//             <form className="form" >
//               <table>
//                 <tbody>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder={savedLogin}
//                         name="Name"
//                         type="text"
//                         value={formData.Name}
//                         readOnly
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Name' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="First Name"
//                         name="FirstName"
//                         type="text"
//                         value={formData.FirstName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'FirstName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Middle Name"
//                         name="MiddleName"
//                         type="text"
//                         value={formData.MiddleName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'MiddleName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Last Name"
//                         name="LastName"
//                         type="text"
//                         value={formData.LastName}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'LastName' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={email} className="form-icon selected" alt='Email' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Email"
//                         name="Email"
//                         type="text"
//                         value={formData.Email}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Email' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={call} className="form-icon selected" alt='Phone' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Phone"
//                         name="Phone"
//                         type="text"
//                         value={formData.Phone}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Phone' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Message"
//                         name="Message"
//                         type="text"
//                         value={formData.Message}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Message' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
//                     <td>
//                       <input className='form-input'
//                         placeholder="Your Address"
//                         name="Address"
//                         type="text"
//                         value={formData.Address}
//                         onChange={handleInputChange}
//                       />
//                       {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                         <span key={field.trim()}>{field.trim() === 'Address' && '✳️'}</span>
//                       ))}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//               {invalidChars && <p className="error-message">🚫Invalid characters (=,  +, ", ') are not allowed.</p>}
//               {(uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()])) && <p className="error-message">⚠️Please fill in all required fields✳️ and avoid invalid characters.</p>}
//               <input type="hidden" name="Zakaz" value={orderData} />

//               <input type="hidden" name="Password1" value={hashedPassword} />
//               <input type="hidden" name="Idprice" value={fieldState.idprice} />

//               <input type="text" name="FirstName1" value={formData.FirstName1 } readOnly/>
//               <input type="text" name="FirstName2" value={formData.FirstName2 || ''} readOnly/>
//               <input type="hidden" name="MiddleName1" value={formData.MiddleName1 || ''} />
//               <input type="hidden" name="MiddleName2" value={formData.MiddleName2 || ''} />
//               <input type="hidden" name="LastName1" value={formData.LastName1 || ''} />
//               <input type="hidden" name="LastName2" value={formData.LastName2 || ''} />
//               <input type="hidden" name="Email1" value={formData.Email1 || ''} />
//               <input type="hidden" name="Email2" value={formData.Email2 || ''} />
//               <input type="hidden" name="Phone1" value={formData.Phone1 || ''} />
//               <input type="hidden" name="Phone2" value={formData.Phone2 || ''} />
//               <input type="hidden" name="Address1" value={formData.Address1 || ''} />
//               <input type="hidden" name="Address2" value={formData.Address2 || ''} />
//               <input type="hidden" name="Message1" value={formData.Message1 || ''} />
//               <input type="hidden" name="Message2" value={formData.Message2 || ''} />


//               <table className='order-tab'>
//                 <thead>
//                   <tr>
//                     <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
//                     <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
//                     <th>Quantity</th>
//                     <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
//                   </tr>
//                 </thead>
//                 <tbody className='order-body'>
//                   {id && title && count && price && (
//                     <tr>
//                       <td>{id}</td>
//                       <td>{title}</td>
//                       <td>{count}</td>
//                       <td>{price}</td>
//                     </tr>
//                   )}
//                   {!id && !title && !count && !price && (
//                     cartItems.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.id}</td>
//                         <td>{item.title}</td>
//                         <td>{item.count}</td>
//                         <td>{item.price}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="2">Total:</td>
//                     <td>{id ? count : totalCount}</td>
//                     <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//               {!isSubmitDisabled() && (
//                 <button
//                   className='back-button selected'
//                   type="submit"
//                   onClick={handleSubmit}
//                 >
//                   ✔️SUBMIT
//                 </button>
//               )}
//             </form>
//           </>
//         )}

//         {orderSubmitted && (
//           <div>
//             <p><b>{`🗳Thank you! Your order #${orderNumber} has been successfully submitted!`}</b></p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png';
// import { SHA256 } from 'crypto-js'; // Импортируем функцию хеширования SHA256
// import './form.css';
// import RegistrationForm from './RegistrationForm'; // Импортируем компонент регистрации
// import InfoModal from '../specific-book/InfoModal';

// export default function Form() {
//   const { theme, loggedIn, savedLogin, savedPassword, setCartItems, setTotalPrice, totalPrice, setTotalCount, totalCount, cartItems, uiMain, fieldState } = useContext(BooksContext);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);

//   // Хешируем сумму строк savedLogin и savedPassword с помощью SHA256
//   const hashedPassword = SHA256(savedLogin + savedPassword).toString();
// console.log(uiMain.orderform)
// console.log(uiMain)
//   const [formData, setFormData] = useState({
//     Name: savedLogin,
//     FirstName: '',
//     MiddleName: '',
//     LastName: '',
//     Email: '',
//     Phone: '',
//     Address: '',
//     Message: '',
//     Password1: savedPassword,
//     Idprice: fieldState.idprice,
//   });

//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);

//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }

//   useEffect(() => {
//     // Обновляем состояние formData при изменении savedLogin и savedPassword
//     setFormData({
//       ...formData,
//       Name: savedLogin,
//       Password1: savedPassword,
//     });
//   }, [savedLogin, savedPassword]);

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
//       invalidChars ||
//       (uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()]))
//     );
//   };

//   function Submit(e) {
//     e.preventDefault();

//     console.log("Submit function called");

//     // Проверяем, является ли целевой элемент кнопкой отправки формы
//     if (e.target.type !== "submit") {
//       console.log("Submit prevented - not submit button");
//       console.log(e.target.type)
//       // Если клик был на другом элементе, не отправляем форму
//       return;
//     }
  
//     console.log("Submit button clicked");
  


//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     function clearCart() {
//       if (!id && !title && !count && !price) {
//         setCartItems([]);
//         setTotalPrice(0);
//         setTotalCount(0);
//       }
//     }

//     const apiUrl = uiMain.Urorder;

//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]);

//         if (!isNaN(orderNumber)) {
//           setOrderNumber(orderNumber);
//           setOrderSubmitted(true);
//           setFormData({
//             Name: '',
//             FirstName: '',
//             MiddleName: '',
//             LastName: '',
//             Email: '',
//             Phone: '',
//             Address: '',
//             Message: '',
//             Password1: '',
//             Idprice: '',
//           });
//           clearCart();
//         } else {
//           alert("⚠️Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

//   let orderData = '';
//   if (id && title && count && price) {
//     orderData = `${id} - ${title} - ${count} шт. по ${price} $ каждая`;
//   } else {
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//     }).join('; ');
//   }
// console.log(formData)
// console.log(invalidInput)
//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back' />
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       <div>
//         {!loggedIn && <RegistrationForm />}
//         {loggedIn && !orderSubmitted && (
//           <form className="form" onSubmit={(e) => Submit(e)}>
//             {fieldState.orderinfo && fieldState.orderinfo !== "" && (<InfoModal text={fieldState.orderinfo} />)}
//             <table>
//               <tbody>
//                 <tr>
//                   <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder={savedLogin}
//                       name="Name"
//                       type="text"
//                       value={formData.Name}
//                       readOnly
//                     />
//                     {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                       <span key={field.trim()}>{field.trim() === 'Name' && '✳️'}</span>
//                     ))}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="First Name"
//                       name="FirstName"
//                       type="text"
//                       value={formData.FirstName}
//                       onChange={handleInputChange}
//                     />
//                     {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                       <span key={field.trim()}>{field.trim() === 'FirstName' && '✳️'}</span>
//                     ))}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Middle Name"
//                       name="MiddleName"
//                       type="text"
//                       value={formData.MiddleName}
//                       onChange={handleInputChange}
//                     />
//                     {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                       <span key={field.trim()}>{field.trim() === 'MiddleName' && '✳️'}</span>
//                     ))}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={user} className="form-icon selected" alt='Name' /></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Last Name"
//                       name="LastName"
//                       type="text"
//                       value={formData.LastName}
//                       onChange={handleInputChange}
//                     />
//                     {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                       <span key={field.trim()}>{field.trim() === 'LastName' && '✳️'}</span>
//                     ))}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={email} className="form-icon selected" alt='Email' /></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Email"
//                       name="Email"
//                       type="text"
//                       value={formData.Email}
//                       onChange={handleInputChange}
//                     />
//                     {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                       <span key={field.trim()}>{field.trim() === 'Email' && '✳️'}</span>
//                     ))}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={call} className="form-icon selected" alt='Phone' /></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Phone"
//                       name="Phone"
//                       type="text"
//                       value={formData.Phone}
//                       onChange={handleInputChange}
//                     />
//                     {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                       <span key={field.trim()}>{field.trim() === 'Phone' && '✳️'}</span>
//                     ))}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={chat} className="form-icon selected" alt='Message' /></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Message"
//                       name="Message"
//                       type="text"
//                       value={formData.Message}
//                       onChange={handleInputChange}
//                     />
//                     {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                       <span key={field.trim()}>{field.trim() === 'Message' && '✳️'}</span>
//                     ))}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={addressIcon} className="form-icon selected" alt='Address' /></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Address"
//                       name="Address"
//                       type="text"
//                       value={formData.Address}
//                       onChange={handleInputChange}
//                     />
//                     {uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').map(field => (
//                       <span key={field.trim()}>{field.trim() === 'Address' && '✳️'}</span>
//                     ))}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//             {/* {invalidInput && <p className="error-message">⚠️Please fill in all required fields and avoid invalid characters.</p>} */}
//             {invalidChars && <p className="error-message">🚫Invalid characters (=,  +, ", ') are not allowed.</p>}
//             { (uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()]))&& <p className="error-message">⚠️Please fill in all required fields✳️ and avoid invalid characters.</p>}
//             <input type="hidden" name="Zakaz" value={orderData} />
//             <table className='order-tab'>
//               <thead>
//                 <tr>
//                   <th>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</th>
//                   <th>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Description:"}</th>
//                   <th>Quantity</th>
//                   <th>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price, $"}</th>
//                 </tr>
//               </thead>
//               <tbody className='order-body'>
//                 {id && title && count && price && (
//                   <tr>
//                     <td>{id}</td>
//                     <td>{title}</td>
//                     <td>{count}</td>
//                     <td>{price}</td>
//                   </tr>
//                 )}
//                 {!id && !title && !count && !price && (
//                   cartItems.map((item, index) => (
//                     <tr key={index}>
//                       <td>{item.id}</td>
//                       <td>{item.title}</td>
//                       <td>{item.count}</td>
//                       <td>{item.price}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//               <tfoot>
//                 <tr>
//                   <td colSpan="2">Total:</td>
//                   <td>{id ? count : totalCount}</td>
//                   <td>{id ? (count * price).toFixed(2) : totalPrice}</td>
//                 </tr>
//               </tfoot>
//             </table>           
//           </form>
           
          
//         )}


// {!isSubmitDisabled()&&(
//               <input
//                 className='back-button selected'
//                 type="submit"
//                 value="✔️SUBMIT"
//                 form="myForm"
//                 // disabled={isSubmitDisabled()}
//               />
//             )}

//         {orderSubmitted && (
//           <div>
//             <p><b>{`🗳Thank you! Your order #${orderNumber} has been successfully submitted!`}</b></p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png'; 
// import { SHA256 } from 'crypto-js'; // Импортируем функцию хеширования SHA256
// import './form.css';
// import RegistrationForm from './RegistrationForm'; // Импортируем компонент регистрации

// export default function Form() {
//   const { theme, loggedIn, savedLogin, savedPassword, setCartItems, setTotalPrice, totalPrice, setTotalCount, totalCount, cartItems, uiMain, fieldState } = useContext(BooksContext);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
 
//  console.log(savedLogin)
//  console.log(loggedIn)
//  console.log(uiMain.title)
//   // Хешируем сумму строк savedLogin и savedPassword с помощью SHA256
//  const hashedPassword = SHA256(savedLogin + savedPassword).toString();
//   const [formData, setFormData] = useState({
//     Name: savedLogin,
//     FirstName: '',
//     MiddleName: '',
//     LastName: '',
//     Email: '',
//     Phone: '',
//     Address: '',
//     Message: '',
//     Password1: savedPassword,
//     Idprice: fieldState.idprice,
//   });
//  // console.log(formData.Name)

//  useEffect(() => {
//   // Обновляем состояние formData при изменении savedLogin и savedPassword
//   setFormData({
//     ...formData,
//     Name: savedLogin,
//     Password1: savedPassword,
//   });
// }, [savedLogin, savedPassword]);

//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);

//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }
 
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
//       invalidChars ||
//       (uiMain.orderform && uiMain.orderform !== '' && uiMain.orderform.split(',').some(field => !formData[field.trim()]))
//     );
//   };
// console.log(invalidChars)
// console.log(isSubmitDisabled)
//   function Submit(e) {
//     e.preventDefault();

//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     function clearCart(){
//       if (!id && !title && !count && !price) {
//         setCartItems([]);
//         setTotalPrice(0);
//         setTotalCount(0);      
//       }
//     }

//     const apiUrl = uiMain.Urorder;

//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]);
// console.log(orderNumber)
//         if (!isNaN(orderNumber)) {
//           setOrderNumber(orderNumber);
//           setOrderSubmitted(true);
//           //console.log(formData)
//           setFormData({
//             Name: '',
//             FirstName: '',
//             MiddleName: '',
//             LastName: '',
//             Email: '',
//             Phone: '',
//             Address: '',
//             Message: '',
//             Password1: '',
//             Idprice: '',
//           });
//           clearCart();
//         } else {
//           alert("⚠️Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

//   let orderData = '';
//   if (id && title && count && price) {
//     orderData = `${id} - ${title} - ${count} шт. по ${price} $ каждая`;
//   } else {
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//     }).join('; ');
//   }

//  console.log(formData)
//  console.log(formData.Name)
//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back'/>
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       <div>
//         {!loggedIn && <RegistrationForm />} {/* Добавляем вызов регистрационной формы, если пользователь не залогинен */}
//         {loggedIn && !orderSubmitted && (
//           <form className="form" onSubmit={(e) => Submit(e)}>
//             <table>
//               <tbody>
//               <tr>
//                 <td><img src={user} className="form-icon selected" alt='Name'/></td>
//                    <td>
//                      <input className='form-input'
//                        placeholder={savedLogin}
//                        name="Name"
//                        type="text"
//                        value={formData.Name}
//                       //  onChange={handleInputChange}
//                       // readOnly={loggedIn}
//                       readOnly
//                      />
//                    </td>
//                 </tr>
                
                
//                 <tr>
//                   <td><img src={user} className="form-icon selected" alt='Name'/></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="First Name"
//                       name="FirstName"
//                       type="text"
//                       value={formData.FirstName}
//                       onChange={handleInputChange}
//                       // readOnly={loggedIn}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={user} className="form-icon selected" alt='Name'/></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Middle Name"
//                       name="MiddleName"
//                       type="text"
//                       value={formData.MiddleName}
//                       onChange={handleInputChange}
//                       // readOnly={loggedIn}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={user} className="form-icon selected" alt='Name'/></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Last Name"
//                       name="LastName"
//                       type="text"
//                       value={formData.LastName}
//                       onChange={handleInputChange}
//                       // readOnly={loggedIn}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={email} className="form-icon selected" alt='Email'/></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Email"
//                       name="Email"
//                       type="text"
//                       value={formData.Email}
//                       onChange={handleInputChange}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={call} className="form-icon selected" alt='Phone'/></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Phone"
//                       name="Phone"
//                       type="text"
//                       value={formData.Phone}
//                       onChange={handleInputChange}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={chat} className="form-icon selected" alt='Message'/></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Message"
//                       name="Message"
//                       type="text"
//                       value={formData.Message}
//                       onChange={handleInputChange}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={addressIcon} className="form-icon selected" alt='Address'/></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Address"
//                       name="Address"
//                       type="text"
//                       value={formData.Address}
//                       onChange={handleInputChange}
//                     />
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//             {invalidInput && <p className="error-message">⚠️Please fill in all required fields and avoid invalid characters.</p>}
//             {invalidChars && <p className="error-message">🚫Invalid characters (=,  +, ", ') are not allowed.</p>}
//             <input type="hidden" name="Zakaz" value={orderData} />
//             <table className='order-tab'>
//               <thead>
//                 <tr>
//                   <th>{fieldState.id && fieldState.id!=="" ? fieldState.id :  "id:"}</th>
//                   <th>{fieldState.title && fieldState.title!=="" ? fieldState.title :  "Description:"}</th>
//                   <th>Quantity</th>
//                   <th>{fieldState.price && fieldState.price!=="" ? fieldState.price :  "Price, $"}</th>
//                 </tr>
//               </thead>
//               <tbody className='order-body'>
//                 {id && title && count && price && (
//                   <tr>
//                     <td>{id}</td>
//                     <td>{title}</td>
//                     <td>{count}</td> 
//                     <td>{price}</td>
//                   </tr>
//                 )}
//                 {!id && !title && !count && !price && (
//                   cartItems.map((item, index) => (
//                     <tr key={index}>
//                       <td>{item.id}</td>
//                       <td>{item.title}</td>
//                       <td>{item.count}</td>
//                       <td>{item.price}</td>
//                     </tr>
//                   )) 
//                 )}
//               </tbody>
//               <tfoot>
//                 <tr>
//                   <td colSpan="2">Total:</td>
//                   <td>{id ? count : totalCount}</td> 
//                   <td>{id ? (count*price).toFixed(2) : totalPrice}</td>
//                 </tr>
//               </tfoot>
//             </table>
//             <input
//               className='back-button selected'
//               type="submit"
//               value="✔️SUBMIT"
//               disabled={isSubmitDisabled()}
//             />
//           </form>
//         )}

//         {orderSubmitted && (
//           <div>
//             <p><b>{`🗳Thank you! Your order #${orderNumber} has been successfully submitted!`}</b></p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// import React, { useContext, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import addressIcon from '../cart/img/location.png'; 
// import './form.css';
// import RegistrationForm from './RegistrationForm'; // Импортируем компонент регистрации

// export default function Form() {
//   const { theme, loggedIn,  savedLogin, savedPassword, setCartItems, setTotalPrice, totalPrice, setTotalCount, totalCount, cartItems, uiMain, fieldState } = useContext(BooksContext);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);

//   const [formData, setFormData] = useState({
//     Name: loggedIn ? savedLogin : '',
//     Email: '',
//     Phone: '',
//     Address: '',
//     Message: '',
//     Password1: '',
//     Idprice: fieldState.idprice,
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);

//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
//   }
 
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
//     if (!loggedIn) {
//       return (
//         Object.values(formData).some((value) => value === '') ||
//         invalidChars ||
//         formData.Password1 === ''
//       );
//     }
//     return invalidChars;
//   };



//   function Submit(e) {
//     e.preventDefault();

//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

   

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     function clearCart(){
//       if (!id && !title && !count && !price) {
//         setCartItems([]);
//         setTotalPrice(0);
//         setTotalCount(0);      
//       }
//     }

//     const apiUrl = uiMain.Urorder;

//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]);

//         if (!isNaN(orderNumber)) {
//           setOrderNumber(orderNumber);
//           setOrderSubmitted(true);
//           setFormData({
//             Name: loggedIn ? savedLogin : '',
//             Email: '',
//             Phone: '',
//             Address: '',
//             Message: '',
//             Password1: '',
//             Idprice: fieldState.idprice,
//           });
//           clearCart();
//         } else {
//           alert("⚠️Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

//   let orderData = '';
//   if (id && title && count && price) {
//     orderData = `${id} - ${title} - ${count} шт. по ${price} $ каждая`;
//   } else {
//     orderData = cartItems.map((item) => {
//       return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//     }).join('; ');
//   }
// console.log(formData)
//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back'/>
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       <div>
//         {!loggedIn && <RegistrationForm />} {/* Добавляем вызов регистрационной формы, если пользователь не залогинен */}
//         {loggedIn && !orderSubmitted && (
//           <form className="form" onSubmit={(e) => Submit(e)}>
//             <table>
//               <tbody>
//                 <tr>
//                   <td><img src={user} className="form-icon selected" alt='Name'/></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Name"
//                       name="Name"
//                       type="text"
//                       value={formData.Name}
//                       onChange={handleInputChange}
//                       readOnly={loggedIn}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={email} className="form-icon selected" alt='Email'/></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Email"
//                       name="Email"
//                       type="text"
//                       value={formData.Email}
//                       onChange={handleInputChange}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={call} className="form-icon selected" alt='Phone'/></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Phone"
//                       name="Phone"
//                       type="text"
//                       value={formData.Phone}
//                       onChange={handleInputChange}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={chat} className="form-icon selected" alt='Message'/></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Message"
//                       name="Message"
//                       type="text"
//                       value={formData.Message}
//                       onChange={handleInputChange}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><img src={addressIcon} className="form-icon selected" alt='Address'/></td>
//                   <td>
//                     <input className='form-input'
//                       placeholder="Your Address"
//                       name="Address"
//                       type="text"
//                       value={formData.Address}
//                       onChange={handleInputChange}
//                     />
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//             {invalidInput && <p className="error-message">⚠️Please fill in all required fields and avoid invalid characters.</p>}
//             {invalidChars && <p className="error-message">🚫Invalid characters (=,  +, ", ') are not allowed.</p>}
//             <input type="hidden" name="Zakaz" value={orderData} />
//             <table className='order-tab'>
//               <thead>
//                 <tr>
//                   <th>{fieldState.id && fieldState.id!=="" ? fieldState.id :  "id:"}</th>
//                   <th>{fieldState.title && fieldState.title!=="" ? fieldState.title :  "Description:"}</th>
//                   <th>Quantity</th>
//                   <th>{fieldState.price && fieldState.price!=="" ? fieldState.price :  "Price, $"}</th>
//                 </tr>
//               </thead>
//               <tbody className='order-body'>
//                 {id && title && count && price && (
//                   <tr>
//                     <td>{id}</td>
//                     <td>{title}</td>
//                     <td>{count}</td> 
//                     <td>{price}</td>
//                   </tr>
//                 )}
//                 {!id && !title && !count && !price && (
//                   cartItems.map((item, index) => (
//                     <tr key={index}>
//                       <td>{item.id}</td>
//                       <td>{item.title}</td>
//                       <td>{item.count}</td>
//                       <td>{item.price}</td>
//                     </tr>
//                   )) 
//                 )}
//               </tbody>
//               <tfoot>
//                 <tr>
//                   <td colSpan="2">Total:</td>
//                   <td>{id ? count : totalCount}</td> 
//                   <td>{id ? (count*price).toFixed(2) : totalPrice}</td>
//                 </tr>
//               </tfoot>
//             </table>
//             <input
//               className='back-button selected'
//               type="submit"
//               value="✔️SUBMIT"
//               disabled={isSubmitDisabled()}
//             />
//           </form>
//         )}

//         {orderSubmitted && (
//           <div>
//             <p><b>{`🗳Thank you! Your order #${orderNumber} has been successfully submitted!`}</b></p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// import React, { useContext, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import './form.css';

// export default function Form() {
//   const { theme, loggedIn, savedLogin, setCartItems, setTotalPrice, totalPrice, setTotalCount, totalCount, cartItems, uiMain, fieldState } = useContext(BooksContext);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);

//   const [formData, setFormData] = useState({
//     Name: loggedIn ? savedLogin : '',
//     Email: '',
//     Phone: '',
//     Message: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);

//   let id, title, count, price;

//   if (queryParams.has('id')) {
//     id = queryParams.get('id');
//     title = queryParams.get('title');
//     count = queryParams.get('count');
//     price = queryParams.get('price');
  
//   }
 
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
//       (!loggedIn && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   function Submit(e) {
//     e.preventDefault();

//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     if (!loggedIn) {
//       return <Link to="/RegistrationForm" />;
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     function clearCart(){
//       if (!id && !title && !count && !price) {
//       setCartItems([]);
//       setTotalPrice(0);
//       setTotalCount(0);
//       localStorage.bookToCart = [];
//       localStorage.totalCount=0;
//       localStorage.totalPrice=0;
//     }}

//     const apiUrl = uiMain.Urorder

//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]);

//         if (!isNaN(orderNumber)) {
//           setOrderNumber(orderNumber);
//           setOrderSubmitted(true);
//           setFormData({
//             Name: loggedIn ? savedLogin : '',
//             Email: '',
//             Phone: '',
//             Message: '',
//           });
//            clearCart();
//           } else {
//           alert("⚠️Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

// let orderData = '';
// if (id && title && count && price) {
//    orderData = `${id} - ${title} - ${count} шт. по ${price} $ каждая`;
// } else {
//   orderData = cartItems.map((item) => {
//          return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
// }).join('; ');
// }
// console.log(cartItems);
// console.log(orderData);

//   return (
//     <div className={`main-form ${theme}`}>
//       <Link to="/cart" className="back-button">
//         <img src={back} className="back-button selected" alt='back'/>
//       </Link>
//       <h1 className="filters">ORDER FORM</h1>
//       <div>
//         {!loggedIn && (
//           <>
//             <p>Please register to continue.</p>
//             <Link to="/RegistrationForm">
//               <button className='form-button' type="button">Register</button>
//             </Link>
//           </>
//         )}

//         {loggedIn && !orderSubmitted && (
//           <form className="form" onSubmit={(e) => Submit(e)}>
//             <table>
//               <tbody>
//               <tr>
//                 <td><img src={user} className="form-icon selected" alt='Name'/></td>
//                 <td>
//                   <input className='form-input'
//                     placeholder="Your Name"
//                     name="Name"
//                     type="text"
//                     value={formData.Name}
//                     onChange={handleInputChange}
//                     readOnly={loggedIn}
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td><img src={email} className="form-icon selected" alt='Email'/></td>
//                 <td>
//                   <input className='form-input'
//                     placeholder="Your Email"
//                     name="Email"
//                     type="text"
//                     value={formData.Email}
//                     onChange={handleInputChange}
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td><img src={call} className="form-icon selected" alt='Phone'/></td>
//                 <td>
//                   <input className='form-input'
//                     placeholder="Your Phone"
//                     name="Phone"
//                     type="text"
//                     value={formData.Phone}
//                     onChange={handleInputChange}
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td><img src={chat} className="form-icon selected" alt='Message'/></td>
//                 <td>
//                   <input className='form-input'
//                     placeholder="Your Message"
//                     name="Message"
//                     type="text"
//                     value={formData.Message}
//                     onChange={handleInputChange}
//                   />
//                 </td>
//               </tr>
//               </tbody>
//             </table>
//             {invalidInput && <p className="error-message">⚠️Please fill in all required fields and avoid invalid characters.</p>}
//             {invalidChars && <p className="error-message">🚫Invalid characters (=,  +, ", ') are not allowed.</p>}
//             <input type="hidden" name="Zakaz" value={orderData} />
//             <table className='order-tab'>
//               <thead>
//                 <tr>
//                   <th>{fieldState.id && fieldState.id!=="" ? fieldState.id :  "id:"}</th>
//                   <th>{fieldState.title && fieldState.title!=="" ? fieldState.title :  "Description:"}</th>
//                   <th>Quantity</th>
//                   <th>{fieldState.price && fieldState.price!=="" ? fieldState.price :  "Price, $"}</th>
//                 </tr>
//               </thead>
//               <tbody className='order-body'>
//                 {id && title && count && price&&(
//                   <tr>
//                    <td>{id}</td>
//                    <td>{title}</td>
//                    <td>{count}</td> 
//                    <td>{price}</td>
//                  </tr>
//                 )}
//                 { !id && !title && !count &&!price&&(
//                 cartItems.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.id}</td>
//                     <td>{item.title}</td>
//                     <td>{item.count}</td>
//                     <td>{item.price}</td>
//                   </tr>
//                 )) 
//                 )}
//               </tbody>
//               <tfoot>
//               <tr>
//                    <td colSpan="2">Total:</td>
//                    <td>{id  ? count : totalCount}</td> 
//                    <td>{id  ? (count*price).toFixed(2) : totalPrice}</td>
//                  </tr>
//               </tfoot>
//             </table>
//             <input
//               className='back-button selected'
//               type="submit"
//               value="✔️SUBMIT"
//               disabled={isSubmitDisabled()}
//             />
//           </form>
//         )}

// {orderSubmitted && (
//           <div>
//             <p><b>{`🗳Thank you! Your order #${orderNumber} has been successfully submitted!`}</b></p>
//           </div>
//         )}
       
//       </div>
//     </div>
//   );
// }





// import React, { useContext, useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import call from '../cart/img/call.png';
// import email from '../cart/img/email.png';
// import user from '../cart/img/user.png';
// import chat from '../cart/img/chat.png';
// import back from '../cart/img/back.png';
// import './form.css';
// import { useLocation } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';

// export default function Form() {
//   const { loggedIn, savedLogin, setCartItems, setTotalPrice, setTotalCount } = React.useContext(BooksContext);

//   const [formData, setFormData] = useState({
//     Name: loggedIn ? savedLogin : '',
//     Email: '',
//     Phone: '',
//     Message: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);
//   const [orderSubmitted, setOrderSubmitted] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);

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
//       (!loggedIn && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   function Submit(e) {
//     e.preventDefault();

//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     if (!loggedIn) {
//       // Redirect to the registration form
//       return <Link to="/RegistrationForm" />;
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     function clearCart(){
//     setCartItems([]);
//     setTotalPrice(0);
//     setTotalCount(0);
//     localStorage.bookToCart = [];
//     localStorage.totalCount=0;
//     localStorage.totalPrice=0;
//     }


//     fetch("https://script.google.com/macros/s/AKfycbz1IYtGfrQVOzFffLI8KGV-gAlzkd-YJcWBg1eKfkzedqR5uG72yVuAZ59igetjE3w/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]);

//         if (!isNaN(orderNumber)) {
//           setOrderNumber(orderNumber);
//           setOrderSubmitted(true);
//           setFormData({
//             Name: loggedIn ? savedLogin : '',
//             Email: '',
//             Phone: '',
//             Message: '',
//           });
//           // Clear the cart
//            clearCart();
//         } else {
//           alert("Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

//   const orderData = JSON.parse(localStorage.bookToCart).map(item => {
//     return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//   }).join('; ');

//   const { cartItems } = useContext(BooksContext);

//   return (
//     <div className="App">
//        <Link to="/cart" className="back-button">
        
//         <img src={back} className="back-button"/>
//           {/* <button className="purchase button custom-element">Cart</button> */}
//         </Link>
//       <h1>Order</h1>
//       <div>
//         {!loggedIn && (
//           <>
//             <p>Please register to continue.</p>
//             <Link to="/RegistrationForm">
//               <button className='form-button' type="button">Register</button>
//             </Link>
//           </>
//         )}

//         {loggedIn && !orderSubmitted && (
//           <form className="form" onSubmit={(e) => Submit(e)}>
//             <table>
//             <tr>
//               <td> <img src={user} className="form-icon"/></td>
//               <td>
//             <input
//               placeholder="Your Name"
//               name="Name"
//               type="text"
//               value={formData.Name}
//               onChange={handleInputChange}
//               readOnly={loggedIn}
//             />
//             </td>
//             </tr>
//             <tr>
//               <td> <img src={email} className="form-icon"/></td>
//               <td>
//             <input
//               placeholder="Your Email"
//               name="Email"
//               type="text"
//               value={formData.Email}
//               onChange={handleInputChange}
//             />
//             </td>
//             </tr>
//             <tr>
//               <td> <img src={call} className="form-icon"/></td>
//               <td>
//             <input
//               placeholder="Your Phone"
//               name="Phone"
//               type="text"
//               value={formData.Phone}
//               onChange={handleInputChange}
//             />
//             </td>
//             </tr>
//             <tr>
//               <td> <img src={chat} className="form-icon"/></td>
//               <td>
//             <input
//               placeholder="Your Message"
//               name="Message"
//               type="text"
//               value={formData.Message}
//               onChange={handleInputChange}
//             />
//             </td>
//             </tr>
//             </table>
//             {invalidInput && <p className="error-message">Please fill in all required fields and avoid invalid characters.</p>}
//             {invalidChars && <p className="error-message">Invalid characters (=,  +, ", ') are not allowed.</p>}
//             <input type="hidden" name="Zakaz" value={orderData} />
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Name</th>
//                   <th>count</th>
//                   <th>price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cartItems.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.id}</td>
//                     <td>{item.title} </td><td> {item.count} </td> <td> {item.price} </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <input
//               className='form-button'
//               type="submit"
//               value="Submit"
//               disabled={isSubmitDisabled()}
//             />
//           </form>
//         )}

//         {orderSubmitted && (
//           <div>
//             <p>{`Thank you! Your order #${orderNumber} has been successfully submitted.`}</p>
//           </div>
//         )}

//         {/* <Link to="/cart">
//           <button>Cart</button>
//         </Link> */}
//       </div>
//     </div>
//   );
// }



// import React, { useContext, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';

// export default function Form() {
//   const { loggedIn, savedLogin } = React.useContext(BooksContext);

//   const [formData, setFormData] = useState({
//     Name: loggedIn ? savedLogin : '',
//     Email: '',
//     Phone: '',
//     Message: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);

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
//       (!loggedIn && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   function Submit(e) {
//     e.preventDefault();

//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycbz1IYtGfrQVOzFffLI8KGV-gAlzkd-YJcWBg1eKfkzedqR5uG72yVuAZ59igetjE3w/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]);

//         if (!isNaN(orderNumber)) {
//           localStorage.setItem('orderNumber', orderNumber);
//           alert(data);
//           // Clear the cart
//           // clearCart();

//           // Use Link to navigate to the "BookList" page
//           // Only redirect if not loggedIn, assuming the user logs in after the order
//           if (!loggedIn) {
//             window.location.href = "/RegistrationForm";
//           }
//         } else {
//           alert("Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

//   const orderData = JSON.parse(localStorage.bookToCart).map(item => {
//     return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//   }).join('; ');

//   const { cartItems } = useContext(BooksContext);

//   return (
//     <div className="App">
//       <h1>Contact Me form</h1>
//       <h2>This demonstrates how to send data from a website form to Google sheet in React or Vanilla JS</h2>
//       <div>
//         {!loggedIn && (
//           <>
//             <p>Please register to continue.</p>
//             <Link to="/RegistrationForm">
//               <button type="button">Register</button>
//             </Link>
//           </>
//         )}

//         {loggedIn && (
//           <form className="form" onSubmit={(e) => Submit(e)}>
//             <input
//               placeholder="Your Name"
//               name="Name"
//               type="text"
//               value={formData.Name}
//               onChange={handleInputChange}
//               readOnly={loggedIn}
//             />
//             <input
//               placeholder="Your Email"
//               name="Email"
//               type="text"
//               value={formData.Email}
//               onChange={handleInputChange}
//             />
//             <input
//               placeholder="Your Phone"
//               name="Phone"
//               type="text"
//               value={formData.Phone}
//               onChange={handleInputChange}
//             />
//             <input
//               placeholder="Your Message"
//               name="Message"
//               type="text"
//               value={formData.Message}
//               onChange={handleInputChange}
//             />
//             {invalidInput && <p className="error-message">Please fill in all required fields and avoid invalid characters.</p>}
//             {invalidChars && <p className="error-message">Invalid characters (=, ., +, ", _, ') are not allowed.</p>}
//             <input type="hidden" name="Zakaz" value={orderData} />
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Позиция</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cartItems.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.id}</td>
//                     <td>{`${item.title} - ${item.count} count. price ${item.price} `}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <input
//               type="submit"
//               value="Submit"
//               disabled={isSubmitDisabled()}
//             />
//           </form>
//         )}

//         <Link to="/cart">
//           <button>Cart</button>
//         </Link>
//       </div>
//     </div>
//   );
// }



// import React, { useContext, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';

// export default function Form() {
//   const { loggedIn, savedLogin } = React.useContext(BooksContext);

//   const [formData, setFormData] = useState({
//     Name: loggedIn ? savedLogin : '',
//     Email: '',
//     Phone: '',
//     Message: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);

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
//       (!loggedIn && Object.values(formData).some((value) => value === '')) ||
//       invalidChars
//     );
//   };

//   function Submit(e) {
//     e.preventDefault();

//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     if (!loggedIn) {
//       // Redirect to the registration form
//       return <Link to="/RegistrationForm" />;
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycbz1IYtGfrQVOzFffLI8KGV-gAlzkd-YJcWBg1eKfkzedqR5uG72yVuAZ59igetjE3w/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]);

//         if (!isNaN(orderNumber)) {
//           localStorage.setItem('orderNumber', orderNumber);
//           alert(data);
//           // Clear the cart
//           // clearCart();

//           // Use Link to navigate to the "BookList" page
//           return <Link to="/" />;
//         } else {
//           alert("Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

//   const orderData = JSON.parse(localStorage.bookToCart).map(item => {
//     return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//   }).join('; ');

//   const { cartItems } = useContext(BooksContext);

//   return (
//     <div className="App">
//       <h1>Contact Me form</h1>
//       <h2>This demonstrates how to send data from a website form to Google sheet in React or Vanilla JS</h2>
//       <div>
//         <form className="form" onSubmit={(e) => Submit(e)}>
//           <input
//             placeholder="Your Name"
//             name="Name"
//             type="text"
//             value={formData.Name}
//             onChange={handleInputChange}
//             readOnly={loggedIn}
//           />
//           <input
//             placeholder="Your Email"
//             name="Email"
//             type="text"
//             value={formData.Email}
//             onChange={handleInputChange}
//           />
//           <input
//             placeholder="Your Phone"
//             name="Phone"
//             type="text"
//             value={formData.Phone}
//             onChange={handleInputChange}
//           />
//           <input
//             placeholder="Your Message"
//             name="Message"
//             type="text"
//             value={formData.Message}
//             onChange={handleInputChange}
//           />
//           {invalidInput && <p className="error-message">Please fill in all required fields and avoid invalid characters.</p>}
//           {invalidChars && <p className="error-message">Invalid characters (=, ., +, ", _, ') are not allowed.</p>}
//           <input type="hidden" name="Zakaz" value={orderData} />
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Позиция</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.id}</td>
//                   <td>{`${item.title} - ${item.count} count. price ${item.price} `}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {loggedIn ? (
//             <input
//               type="submit"
//               value="Submit"
//               disabled={isSubmitDisabled()}
//             />
//           ) : (
//             <>
//               <button>
//                 <Link to="/RegistrationForm">Login</Link>
//               </button>
//             </>
//           )}
//         </form>
//         <Link to="/cart">
//           <button>Cart</button>
//         </Link>
//       </div>
//     </div>
//   );
// }


// import React, { useContext, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';

// export default function Form() {
//   const { loggedIn, savedLogin } = React.useContext(BooksContext);
// console.log(loggedIn)
//   const [formData, setFormData] = useState({
//     Name: loggedIn ? savedLogin : '',
//     Email: '',
//     Phone: '',
//     Message: '',
//   });
//   const [invalidInput, setInvalidInput] = useState(false);
//   const [invalidChars, setInvalidChars] = useState(false);

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
//       Object.values(formData).some((value) => value === '') ||
//       invalidChars
//     );
//   };

//   function Submit(e) {
//     e.preventDefault();

//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     if (!loggedIn) {
//       // Redirect to the registration form
//       // Replace '/registration' with your actual route
//       return <Link to="RegistrationForm" />;
     
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycbz1IYtGfrQVOzFffLI8KGV-gAlzkd-YJcWBg1eKfkzedqR5uG72yVuAZ59igetjE3w/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]);

//         if (!isNaN(orderNumber)) {
//           localStorage.setItem('orderNumber', orderNumber);
//           alert(data);
//           // Clear the cart
//           // clearCart();

//           // Use Link to navigate to the "BookList" page
//           return <Link to="/" />;
//         } else {
//           alert("Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

//   const orderData = JSON.parse(localStorage.bookToCart).map(item => {
//     return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//   }).join('; ');

//   const { cartItems } = useContext(BooksContext);

//   return (
//     <div className="App">
//       <h1>Contact Me form</h1>
//       <h2>This demonstrates how to send data from a website form to Google sheet in React or Vanilla JS</h2>
//       <div>
//         <form className="form" onSubmit={(e) => Submit(e)}>
//           <input
//             placeholder="Your Name"
//             name="Name"
//             type="text"
//             value={formData.Name}
//             onChange={handleInputChange}
//             readOnly={loggedIn}
//           />
//           <input
//             placeholder="Your Email"
//             name="Email"
//             type="text"
//             value={formData.Email}
//             onChange={handleInputChange}
//           />
//           <input
//             placeholder="Your Phone"
//             name="Phone"
//             type="text"
//             value={formData.Phone}
//             onChange={handleInputChange}
//           />
//           <input
//             placeholder="Your Message"
//             name="Message"
//             type="text"
//             value={formData.Message}
//             onChange={handleInputChange}
//           />
//           {invalidInput && <p className="error-message">Please fill in all fields and avoid invalid characters.</p>}
//           {invalidChars && <p className="error-message">Invalid characters (=, ., +, ", _, ') are not allowed.</p>}
//           <input type="hidden" name="Zakaz" value={orderData} />
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Позиция</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.id}</td>
//                   <td>{`${item.title} - ${item.count} count. price ${item.price} `}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <input
//             type="submit"
//             value="Submit"
//             disabled={isSubmitDisabled()}
//           />
//         </form>
//         <Link to="/cart">
//           <button>Cart</button>
//         </Link>
//       </div>
//     </div>
//   );
// }


// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// import React, { useContext, useState } from 'react';

// export default function Form() {
//   const {  loggedIn, savedLogin} = React.useContext(BooksContext);
  
//   const [formData, setFormData] = useState({
//     Name: '',
//     Email: '',
//     Phone: '', // Add the new "Phone" field
//     Message: '',
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

//   function Submit(e) {
//     e.preventDefault();

//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycbz1IYtGfrQVOzFffLI8KGV-gAlzkd-YJcWBg1eKfkzedqR5uG72yVuAZ59igetjE3w/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]); // Извлекаем номер заказа из ответа

//         if (!isNaN(orderNumber)) {
//           // Сохраняем номер заказа в локальное хранилище
//           localStorage.setItem('orderNumber', orderNumber);
//           alert(data);
//           // Очищаем корзину
         
//          // clearCart();

//           // Переходим на страницу "BookList"
//         < Link to="/"/>
//         } else {
//           alert("Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

//   const orderData = JSON.parse(localStorage.bookToCart).map(item => {
//     return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//   }).join('; ');

//   const { cartItems } = useContext(BooksContext);

//   return (
//     <div className="App">
//       <h1>Contact Me form</h1>
//       <h2>This demonstrates how to send data from a website form to Google sheet in React or Vanilla JS</h2>
//       <div>
//         <form className="form" onSubmit={(e) => Submit(e)}>
//           <input
//             placeholder="Your Name"
//             name="Name"
//             type="text"
//             value={formData.Name}
//             onChange={handleInputChange}
//           />
//           <input
//             placeholder="Your Email"
//             name="Email"
//             type="text"
//             value={formData.Email}
//             onChange={handleInputChange}
//           />
//           <input
//             placeholder="Your Phone" // Add the new "Phone" field
//             name="Phone"
//             type="text"
//             value={formData.Phone} // Add the new "Phone" field
//             onChange={handleInputChange} // Add the new "Phone" field
//           />
//           <input
//             placeholder="Your Message"
//             name="Message"
//             type="text"
//             value={formData.Message}
//             onChange={handleInputChange}
//           />
//           {invalidInput && <p className="error-message">Please fill in all fields and avoid invalid characters.</p>}
//           {invalidChars && <p className="error-message">Invalid characters (=, ., +, ", _, ') are not allowed.</p>}
//           <input type="hidden" name="Zakaz" value={orderData} />
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Позиция</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.id}</td>
//                   <td>{`${item.title} - ${item.count} count. price ${item.price} `}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <input
//             type="submit"
//             value="Submit"
//             disabled={isSubmitDisabled()}
//           />
//         </form>
//         <Link to="/cart">
//           <button>Cart</button>
//         </Link>
//       </div>
//     </div>
//   );
// }


// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// import React, { useContext, useState } from 'react';

// export default function Form() {
//   const [formData, setFormData] = useState({
//     Name: '',
//     Email: '',
//     Message: '',
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

//   function Submit(e) {
//     e.preventDefault();

//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycby0gO-6l9OHiZVaFoIDge5kD1vrsusLBNE3IJV1ifjnsDZfbNWr8XlmD7M4NSk1zpol/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         const orderNumber = parseInt(data.split(":")[1]); // Извлекаем номер заказа из ответа

//         if (!isNaN(orderNumber)) {
//           // Сохраняем номер заказа в локальное хранилище
//           localStorage.setItem('orderNumber', orderNumber);
//           alert(data);
//           // Очищаем корзину
         
//          // clearCart();

//           // Переходим на страницу "BookList"
//         < Link to="/"/>
//         } else {
//           alert("Order submission failed. Please try again.");
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

//   const orderData = JSON.parse(localStorage.bookToCart).map(item => {
//     return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//   }).join('; ');

//   const { cartItems } = useContext(BooksContext);

//   return (
//     <div className="App">
//       <h1>Contact Me form</h1>
//       <h2>This demonstrates how to send data from a website form to Google sheet in React or Vanilla JS</h2>
//       <div>
//         <form className="form" onSubmit={(e) => Submit(e)}>
//           <input
//             placeholder="Your Name"
//             name="Name"
//             type="text"
//             value={formData.Name}
//             onChange={handleInputChange}
//           />
//           <input
//             placeholder="Your Email"
//             name="Email"
//             type="text"
//             value={formData.Email}
//             onChange={handleInputChange}
//           />
//           <input
//             placeholder="Your Message"
//             name="Message"
//             type="text"
//             value={formData.Message}
//             onChange={handleInputChange}
//           />
//           {invalidInput && <p className="error-message">Please fill in all fields and avoid invalid characters.</p>}
//           {invalidChars && <p className="error-message">Invalid characters (=, ., +, ", _, ') are not allowed.</p>}
//           <input type="hidden" name="Zakaz" value={orderData} />
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Позиция</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.id}</td>
//                   <td>{`${item.title} - ${item.count} count. price ${item.price} `}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <input
//             type="submit"
//             value="Submit"
//             disabled={isSubmitDisabled()}
//           />
//         </form>
//         <Link to="/cart">
//           <button>Cart</button>
//         </Link>
//       </div>
//     </div>
//   );
// }



// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// import React, { useContext, useState } from 'react';

// export default function Form() {
//   const [formData, setFormData] = useState({
//     Name: '',
//     Email: '',
//     Message: '',
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

//   function Submit(e) {
//     e.preventDefault();

//     if (isSubmitDisabled()) {
//       setInvalidInput(true);
//       return;
//     } else {
//       setInvalidInput(false);
//     }

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycby0gO-6l9OHiZVaFoIDge5kD1vrsusLBNE3IJV1ifjnsDZfbNWr8XlmD7M4NSk1zpol/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         alert(data);
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

//   const orderData = JSON.parse(localStorage.bookToCart).map(item => {
//     return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//   }).join('; ');

//   const { cartItems } = useContext(BooksContext);

//   return (
//     <div className="App">
//       <h1>Contact Me form</h1>
//       <h2>This demonstrates how to send data from a website form to Google sheet in React or Vanilla JS</h2>
//       <div>
//         <form className="form" onSubmit={(e) => Submit(e)}>
//           <input
//             placeholder="Your Name"
//             name="Name"
//             type="text"
//             value={formData.Name}
//             onChange={handleInputChange}
//           />
//           <input
//             placeholder="Your Email"
//             name="Email"
//             type="text"
//             value={formData.Email}
//             onChange={handleInputChange}
//           />
//           <input
//             placeholder="Your Message"
//             name="Message"
//             type="text"
//             value={formData.Message}
//             onChange={handleInputChange}
//           />
//           {invalidInput && <p className="error-message">Please fill in all fields and avoid invalid characters.</p>}
//           {invalidChars && <p className="error-message">Invalid characters (=, ., +, ", _, ') are not allowed.</p>}
//           <input type="hidden" name="Zakaz" value={orderData} />
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Позиция</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.id}</td>
//                   <td>{`${item.title} - ${item.count} count. price ${item.price} `}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <input
//             type="submit"
//             value="Submit"
//             disabled={isSubmitDisabled()}
//           />
//         </form>
//         <Link to="/cart">
//           <button>Cart</button>
//         </Link>
//       </div>
//     </div>
//   );
// }



// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// import React, { useContext } from 'react';

// export default function Form() {
//   function Submit(e) {
//     e.preventDefault();

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycbwFV9MC8mf1Fvpvn-SDex6k2MhadbXeAzDOwAPnrj6Z5ajK2A9Rt81AnXVxrDtGuBMe/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         alert(data);
//       })
//       .catch(error => {
//         alert(error);
//       });
//   }

//   const orderData = JSON.parse(localStorage.bookToCart).map(item => {
//     return `${item.id} - ${item.title} - ${item.count} шт. по ${item.price} $ каждая`;
//   }).join('; ');

//   const { cartItems } = useContext(BooksContext);

//   return (
//     <div className="App">
//       <h1>Contact Me form</h1>
//       <h2>This demonstrates how to send data from a website form to Google sheet in React or Vanilla JS</h2>
//       <div>
//         <form className="form" onSubmit={(e) => Submit(e)}>
//           <input placeholder="Your Name" name="Name" type="text" />
//           <input placeholder="Your Email" name="Email" type="text" />
//           <input placeholder="Your Message" name="Message" type="text" />
//           <input type="hidden" name="Zakaz" value={orderData} />
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Позиция</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.id}</td>
//                   <td>{`${item.title} - ${item.count} шт. по ${item.price} $ каждая`}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <input type="submit" value="Submit" />
//         </form>
//         <Link to="/cart">
//           <button>Cart</button>
//         </Link>
//       </div>
//     </div>
//   );
// }


// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// import React, { useContext } from 'react';

// export default function Form() {
//   function Submit(e) {
//     e.preventDefault();

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycbwFV9MC8mf1Fvpvn-SDex6k2MhadbXeAzDOwAPnrj6Z5ajK2A9Rt81AnXVxrDtGuBMe/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         alert(data); // Используем alert для вывода ответа
//       })
//       .catch(error => {
//         alert(error); // Используем alert для вывода ошибки
//       });
//   }

//   // Предполагая, что localStorage.bookToCart содержит корректный JSON-массив
//   const orderData = JSON.parse(localStorage.bookToCart).map(item => {
//     return {
//       id: item.id,
//       title: item.title,
//       count: item.count,
//       price: item.price
//     };
//   });

//   const { cartItems } = useContext(BooksContext);

//   return (
//     <div className="App">
//       <h1>Contact Me form</h1>
//       <h2>This demonstrates how to send data from a website form to Google sheet in React or Vanilla JS</h2>
//       <div>
//         <form className="form" onSubmit={(e) => Submit(e)}>
//           <input placeholder="Your Name" name="Name" type="text" />
//           <input placeholder= "Your Email" name="Email" type="text" />
//           <input placeholder="Your Message" name="Message" type="text" />
//           <input type="hidden" placeholder="Your Zakaz" name="Zakaz" value={JSON.stringify(orderData)} />
         
//           <input type="submit" value="Submit" />
//         </form>
//         <Link to="/cart">
//           <button>Cart</button>
//         </Link>
//       </div>
//     </div>
//   );
// }



// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// import React, { useContext } from 'react';

// export default function Form() {
//   function Submit(e) {
//     e.preventDefault();

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//     fetch("https://script.google.com/macros/s/AKfycbwFV9MC8mf1Fvpvn-SDex6k2MhadbXeAzDOwAPnrj6Z5ajK2A9Rt81AnXVxrDtGuBMe/exec", {
//       method: "POST",
//       body: formDatab
//     })
//       .then(response => response.text())
//       .then(data => {
//         alert(data); // Используем alert для вывода ответа
//       })
//       .catch(error => {
//         alert(error); // Используем alert для вывода ошибки
//       });
//   }

//   // Предполагая, что localStorage.bookToCart содержит корректный JSON-массив
//   const orderData = JSON.parse(localStorage.bookToCart);

//   const { cartItems } = useContext(BooksContext);

//   return (
//     <div className="App">
//       <h1>Contact Me form</h1>
//       <h2>This demonstrates how to send data from a website form to Google sheet in React or Vanilla JS</h2>
//       <div>
//         <form className="form" onSubmit={(e) => Submit(e)}>
//           <input placeholder="Your Name" name="Name" type="text" />
//           <input placeholder= "Your Email" name="Email" type="text" />
//           <input placeholder="Your Message" name="Message" type="text" />
//           <input type="hidden" placeholder="Your Zakaz" name="Zakaz" value={JSON.stringify(orderData)} />
//           <input type="submit" value="Submit" />
//         </form>
//         <Link to="/cart">
//           <button>Cart</button>
//         </Link>
//       </div>
//     </div>
//   );
// }




// import Cart from "./Cart";
// import { BooksContext } from '../../BooksContext';
// import { Link } from 'react-router-dom';
// import React, { useContext, useState } from 'react';
// export default function Form() {
//     function Submit(e) {
//       const formEle = document.querySelector("form");
//       const formDatab = new FormData(formEle);
//       fetch(
//         "https://script.google.com/macros/s/AKfycbwFV9MC8mf1Fvpvn-SDex6k2MhadbXeAzDOwAPnrj6Z5ajK2A9Rt81AnXVxrDtGuBMe/exec",
        
      
//         {
//           method: "POST",
//           body: formDatab
//         }
//       )
//       .then(response => response.text())
   
//        .then((data) => {
//          console.log((data));
//        })
//         .catch(error => {
//           console.log(error);
//         });
//     }
//     console.log(JSON.stringify(localStorage.bookToCart))
//         console.log(typeof((localStorage.bookToCart)))
//     const lr=localStorage.bookToCart
//     console.log(lr)
//     console.log(typeof(lr))
    
   
//     const { cartItems } = useContext(BooksContext);
//     console.log(cartItems[0].id)
  
    
//     return (
//       <div className="App">
//         <h1>Contact Me form</h1>
//         <h2>
//           This demonstrates how to send data from a website form to Google sheet
//           in React or Vanilla jS
//         </h2>
//         <div>
//           <form className="form" onSubmit={(e) => Submit(e)}>
//             <input placeholder="Your Name" name="Name" type="text" />
//             <input placeholder="Your Email" name="Email" type="text" />
//             <input placeholder="Your Message" name="Message" type="text" />
//             <input type="hidden" placeholder="Your Zakaz" name="Zakaz"  value={lr} />
//             <input name="Name" type="submit" />
         
//             <Link to="/cart">
// <button>Cart</button>
// </Link>
//           </form>
//         </div>
//       </div>
//     );
//   }