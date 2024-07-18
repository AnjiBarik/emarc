import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import './form.css';
import InfoModal from '../specific-book/InfoModal';
import RSAEncryption from '../rsacomponent/RSAEncryption';
import LoadingAnimation from '../utils/LoadingAnimation'; 

export default function OrderForm() {
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

  const {
    back,
    call,
    email,
    user,
    chat,
    addressIcon, } = useIcons();
  
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
  const [protect, setProtected] = useState(false);
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
   // console.log(value)
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

//message Data is protected by encryption
  useEffect(() => {
    if (uiMain.order === 'rsa' && fieldState.publicKey1 && fieldState.publicKey1 !== "" &&
        fieldState.publicKey2 && fieldState.publicKey2 !== "") {
      setProtected(true);
    }
  }, [uiMain.order, fieldState.publicKey1, fieldState.publicKey2]);

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
        {protect && (<b>😎Data is protected by encryption</b>)}
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
