import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RSAEncryption from '../rsacomponent/RSAEncryption';  
import { BooksContext } from '../../BooksContext';
import DecryptPrivateKey from '../rsacomponent/DecryptPrivateKey'; 
import FilteredDataDisplay from './FilteredDataDisplay';
import LoadingAnimation from '../utils/LoadingAnimation';  

const OrderFormAndDecryption = () => {
  const { uiMain, fieldState } = useContext(BooksContext);
  const [userid, setUserid] = useState('');
  const [idprice, setIdprice] = useState(fieldState.idprice || "");
  const [verificationStatus, setVerificationStatus] = useState('');
  const [responseData, setResponseData] = useState([]);
  const [decryptedData, setDecryptedData] = useState([]);
  const [privateKey, setPrivateKey] = useState('');
  const [keySource, setKeySource] = useState(''); 
  const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false); 
  const [showPrivateKeyError, setShowPrivateKeyError] = useState(false); 
  const [showDecryptButton, setShowDecryptButton] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState(''); 
  const [decryptEnabled, setDecryptEnabled] = useState(false); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { decryptRSA } = RSAEncryption();
  const navigate = useNavigate();

  useEffect(() => {
    if (uiMain.length === 0) {
      navigate('/');
    }
  }, [uiMain, navigate]);

  useEffect(() => {
    setShowDecryptButton(privateKey !== '');
  }, [privateKey]);

  useEffect(() => {
    if (decryptedPrivateKey) {
      setPrivateKey(decryptedPrivateKey);
      setKeySource('decrypted'); 
    }
  }, [decryptedPrivateKey]);

  //!!! Basic logik
  // const convertToUTC = (date) => {
  //   const utcDate = new Date(date);
  //   return utcDate.toISOString();
  // };

  const convertToUTC = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);

    const formData = new FormData();
    formData.append('userid', userid);
    formData.append('idprice', idprice);
    
    if (startDate) {
      formData.append('startdate', convertToUTC(startDate));
    }
    if (endDate) {
      formData.append('enddate', convertToUTC(endDate));
    }
    
    const apiUrl = uiMain.Urorder;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        if (data !== "Incorrect username or password.") {
          setVerificationStatus('verified');
          setResponseData(data);
          setShowPrivateKeyInput(true);
        } else {
          setVerificationStatus('error');
          alert("⚠️Incorrect username or password!");
          setResponseData([]);
          setShowPrivateKeyInput(false);
        }
      } else {
        console.error('Error:', data.message);
        setVerificationStatus('error');
        setShowPrivateKeyInput(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setVerificationStatus('error');
      setShowPrivateKeyInput(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecryptField = async (fieldValue1, fieldValue2) => {
    try {
      const encryptedMessage = fieldValue1 + fieldValue2;
      const decryptedText = await decryptRSA(privateKey, encryptedMessage);
      
      if (decryptedText.includes(`Error decrypting`))  {
         setShowPrivateKeyError(true)
         return ""
      }
      setShowPrivateKeyError(false)
      return decryptedText;
    } catch (error) {      
      console.error('Error decrypting:', error);
      setShowPrivateKeyError(true)
       return ""      
    }
  };

  const handleDecryptAll = async () => {
    const decrypted = await Promise.all(responseData.map(async (item) => {
      const decryptedItem = {};
      for (const field in item) {
        if (field.endsWith('1')) {
          const counterpart = field.slice(0, -1) + '2';
          const value1 = item[field];
          const value2 = item[counterpart];
          if (value1 && value2 && value1 !== "" && value2 !== "") {
            const decryptedValue = await handleDecryptField(value1, value2);
            decryptedItem[field] = decryptedValue;
          } else {
            decryptedItem[field] = "";
          }
        }
      }
      return decryptedItem;
    }));
    setDecryptedData(decrypted);
  };

  const handleImportFromClipboard = () => {
    navigator.clipboard.readText()
      .then(text => {
        setPrivateKey(text);
        setKeySource('clipboard'); 
      })
      .catch(err => alert('⚠️Failed to read clipboard contents: ', err));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert('⚠️No file selected!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPrivateKey(event.target.result);
      setKeySource('file'); 
    };
    reader.onerror = (error) => {
      alert('⚠️Failed to read file: ', error);
    };
    reader.readAsText(file);
  };

  const handleResetPrivateKey = () => {
    setPrivateKey('');
    setDecryptedPrivateKey('');
    setDecryptEnabled(false);
    setKeySource(''); 
    setShowPrivateKeyError(false)
    setEndDate('');
    setStartDate('');
    setUserid('');
  };

  const handleOutputData = () => {
    const output = [];
    responseData.forEach((item, index) => {
      const outputItem = {};
      for (const field in item) {
        if (!field.endsWith('1') && !field.endsWith('2')) {
          if (decryptedData[index] && decryptedData[index][field + '1']) {
            outputItem[field] = decryptedData[index][field + '1'] !== "" ? decryptedData[index][field + '1'] : item[field];
          } else {
            outputItem[field] = item[field];
          }
        }
      }
      output.push(outputItem);
    });
    return output;
  };

  const outputData = handleOutputData();

  return (
    <> 
     {submitting && <LoadingAnimation />}
      {showPrivateKeyInput && (
        <div className='filters'>
          <label>
            <b>
              {privateKey ? 
                `Private Key ${keySource === 'clipboard' ? 'imported from buffer' : keySource === 'file' ? 'loaded' : keySource === 'decrypted' ? 'decrypted' : '🌀'}` 
                : 'Private Key:'}
            </b>
          </label>
          <button className='form-input' onClick={handleImportFromClipboard} disabled={privateKey !== ''}>Import from Clipboard</button>
          <input className='form-input' type="file" onChange={handleFileUpload} disabled={privateKey !== ''} />
          {privateKey && privateKey !== '' && (
            <>
              <label>
                <input
                  type="checkbox"
                  checked={decryptEnabled}              
                  onChange={(e) => setDecryptEnabled(e.target.checked)}
                />
                Decrypt Private Key
              </label>
              <button className='form-input selected' onClick={handleResetPrivateKey}>Reset Private Key</button>
            </>
          )}
          {decryptEnabled && 
            <DecryptPrivateKey             
              encryptedKey={ privateKey }
              onDecrypted={(key) => setDecryptedPrivateKey(key)}
            />
          }
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {!showPrivateKeyInput && (
          <div className='filters' style={{ "marginBottom": "70px"}}>
            <label>
              <b>User ID:</b>
              <input type="text" className='form-input' value={userid} onChange={(e) => setUserid(e.target.value)} required/>
            </label>
            <label>
              <b>Price ID:</b>
              <input type="text" className='form-input' value={idprice} onChange={(e) => setIdprice(e.target.value)} />
            </label>
            <label>
              <b>Start Date:</b>
              <input type="date" className='form-input' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label>
              <b>End Date:</b>
              <input type="date" className='form-input' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
            <button className={submitting || userid ==="" ? 'form-input' : 'back-button selected'}
             style={{ cursor: submitting || userid ==="" ? 'not-allowed' : 'pointer' }} type="submit" 
             disabled={submitting || userid ===""}>
              Loading orders
            </button>
          </div>
        )}
      </form>
      
      {verificationStatus === 'error' && <p>⚠️Incorrect username or password!</p>}
      
      {verificationStatus === 'verified' && responseData && (
        <>
         {showDecryptButton && (
            <button className='back-button selected' onClick={handleDecryptAll}>Decrypt All Fields</button>
          )}
          {showPrivateKeyError && (
            <b className="error-message">⚠️Check key decryption error</b>
          )} 
          <FilteredDataDisplay
            outputData={outputData}
          />         
        </>
      )}
    </>
  );
};

export default OrderFormAndDecryption; 



// import React, { useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  
// import { BooksContext } from '../../BooksContext';
// import DecryptPrivateKey from '../rsacomponent/DecryptPrivateKey'; 
// import FilteredDataDisplay from './FilteredDataDisplay';
// import LoadingAnimation from '../utils/LoadingAnimation';  

// const OrderFormAndDecryption = () => {
//   const { uiMain, fieldState } = useContext(BooksContext);
//   const [userid, setUserid] = useState('');
//   const [idprice, setIdprice] = useState(fieldState.idprice || "");
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedData, setDecryptedData] = useState([]);
//   const [privateKey, setPrivateKey] = useState('');
//   const [keySource, setKeySource] = useState(''); 
//   const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false); 
//   const [showPrivateKeyError, setShowPrivateKeyError] = useState(false); 
//   const [showDecryptButton, setShowDecryptButton] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [decryptedPrivateKey, setDecryptedPrivateKey] = useState(''); 
//   const [decryptEnabled, setDecryptEnabled] = useState(false); 
//   const { decryptRSA } = RSAEncryption();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (uiMain.length === 0) {
//       navigate('/');
//     }
//   }, [uiMain, navigate]);

//   useEffect(() => {
//     setShowDecryptButton(privateKey !== '');
//   }, [privateKey]);

//   useEffect(() => {
//     if (decryptedPrivateKey) {
//       setPrivateKey(decryptedPrivateKey);
//       setKeySource('decrypted'); 
//     }
//   }, [decryptedPrivateKey]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     setSubmitting(true);

//     const formData = new FormData();
//     formData.append('userid', userid);
//     formData.append('idpric', idprice);
    
//     const apiUrl = uiMain.Urorder;
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//           setShowPrivateKeyInput(true);
//         } else {
//           setVerificationStatus('error');
//           alert("⚠️Incorrect username or password!");
//           setResponseData([]);
//           setShowPrivateKeyInput(false);
//         }
//       } else {
//         console.error('Error:', data.message);
//         setVerificationStatus('error');
//         setShowPrivateKeyInput(false);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setVerificationStatus('error');
//       setShowPrivateKeyInput(false);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDecryptField = async (fieldValue1, fieldValue2) => {
//     try {
//       const encryptedMessage = fieldValue1 + fieldValue2;
//       const decryptedText = await decryptRSA(privateKey, encryptedMessage);
      
//       if (decryptedText.includes(`Error decrypting`))  {
//          //console.error('Error decrypting in decryptRSA')
//          setShowPrivateKeyError(true)
//          return ""
//       }
//       //console.log(decryptedText)
//       setShowPrivateKeyError(false)
//       return decryptedText;
//     } catch (error) {      
//       console.error('Error decrypting:', error);
//       setShowPrivateKeyError(true)
//        return ""      
//     }
//   };

//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const decryptedItem = {};
//       for (const field in item) {
//         if (field.endsWith('1')) {
//           const counterpart = field.slice(0, -1) + '2';
//           const value1 = item[field];
//           const value2 = item[counterpart];
//           if (value1 && value2 && value1 !== "" && value2 !== "") {
//             const decryptedValue = await handleDecryptField(value1, value2);
//             decryptedItem[field] = decryptedValue;
//           } else {
//             decryptedItem[field] = "";
//           }
//         }
//       }
//       return decryptedItem;
//     }));
//     setDecryptedData(decrypted);
//   };

//   const handleImportFromClipboard = () => {
//     navigator.clipboard.readText()
//       .then(text => {
//         setPrivateKey(text);
//         setKeySource('clipboard'); 
//       })
//       .catch(err => alert('⚠️Failed to read clipboard contents: ', err));
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) {
//       alert('⚠️No file selected!');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPrivateKey(event.target.result);
//       setKeySource('file'); 
//     };
//     reader.onerror = (error) => {
//       alert('⚠️Failed to read file: ', error);
//     };
//     reader.readAsText(file);
//   };

//   const handleResetPrivateKey = () => {
//     setPrivateKey('');
//     setDecryptedPrivateKey('');
//     setDecryptEnabled(false);
//     setKeySource(''); 
//     setShowPrivateKeyError(false)
//   };

//   const handleOutputData = () => {
//     const output = [];
//     responseData.forEach((item, index) => {
//       const outputItem = {};
//       for (const field in item) {
//         if (!field.endsWith('1') && !field.endsWith('2')) {
//           if (decryptedData[index] && decryptedData[index][field + '1']) {
//             outputItem[field] = decryptedData[index][field + '1'] !== "" ? decryptedData[index][field + '1'] : item[field];
//           } else {
//             outputItem[field] = item[field];
//           }
//         }
//       }
//       output.push(outputItem);
//     });
//     return output;
//   };

//   const outputData = handleOutputData();

//   return (
//     <> 
//      {submitting && <LoadingAnimation />}
//       {showPrivateKeyInput && (
//         <div className='filters'>
//           <label>
//             <b>
//               {privateKey ? 
//                 `Private Key ${keySource === 'clipboard' ? 'imported from buffer' : keySource === 'file' ? 'loaded' : keySource === 'decrypted' ? 'decrypted' : '🌀'}` 
//                 : 'Private Key:'}
//             </b>
//             {/* <input type="hidden" className='form-input' value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} /> */}
//           </label>
//           <button className='form-input' onClick={handleImportFromClipboard} disabled={privateKey !== ''}>Import from Clipboard</button>
//           <input className='form-input' type="file" onChange={handleFileUpload} disabled={privateKey !== ''} />
//           {privateKey && privateKey !== '' && (
//             <>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={decryptEnabled}              
//                   onChange={(e) => setDecryptEnabled(e.target.checked)}
//                 />
//                 Decrypt Private Key
//               </label>
//               <button className='form-input selected' onClick={handleResetPrivateKey}>Reset Private Key</button>
//             </>
//           )}
//           {decryptEnabled && 
//             <DecryptPrivateKey             
//               encryptedKey={ privateKey }
//               onDecrypted={(key) => setDecryptedPrivateKey(key)}
//             />
//           }
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit}>
//         {!showPrivateKeyInput && (
//           <div className='filters' style={{ "marginBottom": "70px"}}>
//             <label>
//               <b>User ID:</b>
//               <input type="text" className='form-input' value={userid} onChange={(e) => setUserid(e.target.value)} required/>
//             </label>
//             <label>
//               <b>Price ID:</b>
//               <input type="text" className='form-input' value={idprice} onChange={(e) => setIdprice(e.target.value)} />
//             </label>

//             <button className={submitting || userid ==="" ? 'form-input' : 'back-button selected'}
//              style={{ cursor: submitting || userid ==="" ? 'not-allowed' : 'pointer' }} type="submit" 
//              disabled={submitting || userid ===""}>
//               Loading orders
//             </button>
//           </div>
//         )}
//       </form>
      
//       {verificationStatus === 'error' && <p>⚠️Incorrect username or password!</p>}
      
//       {verificationStatus === 'verified' && responseData && (
//         <>
//          {showDecryptButton && (
//             <button className='back-button selected' onClick={handleDecryptAll}>Decrypt All Fields</button>
//           )}
//           {showPrivateKeyError && (
//             <b className="error-message">⚠️Check key decryption error</b>
//           )} 
//           <FilteredDataDisplay
//             outputData={outputData}
//           />         
//         </>
//       )}
//     </>
//   );
// };

// export default OrderFormAndDecryption;




// import React, { useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  
// import { BooksContext } from '../../BooksContext';
// import DecryptPrivateKey from '../rsacomponent/DecryptPrivateKey'; 
// import FilteredDataDisplay from './FilteredDataDisplay';

// const OrderFormAndDecryption = () => {
//   const { uiMain, fieldState } = useContext(BooksContext);
//   const [userid, setUserid] = useState('');
//   const [idprice, setIdprice] = useState(fieldState.idprice || "");
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedData, setDecryptedData] = useState([]);
//   const [privateKey, setPrivateKey] = useState('');
//   const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false); 
//   const [showPrivateKeyError, setShowPrivateKeyError] = useState(false); 
//   const [showDecryptButton, setShowDecryptButton] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [decryptedPrivateKey, setDecryptedPrivateKey] = useState(''); 
//   const [decryptEnabled, setDecryptEnabled] = useState(false); 
//   const { decryptRSA } = RSAEncryption();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (uiMain.length === 0) {
//       navigate('/');
//     }
//   }, [uiMain, navigate]);

//   useEffect(() => {
//     setShowDecryptButton(privateKey !== '');
//   }, [privateKey]);

//   useEffect(() => {
//     if (decryptedPrivateKey) {
//       setPrivateKey(decryptedPrivateKey);
//     }
//   }, [decryptedPrivateKey]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     setSubmitting(true);

//     const formData = new FormData();
//     formData.append('userid', userid);
//     formData.append('idpric', idprice);
    
//     const apiUrl = uiMain.Urorder;
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//           setShowPrivateKeyInput(true);
//         } else {
//           setVerificationStatus('error');
//           alert("⚠️Incorrect username or password!");
//           setResponseData([]);
//           setShowPrivateKeyInput(false);
//         }
//       } else {
//         console.error('Error:', data.message);
//         setVerificationStatus('error');
//         setShowPrivateKeyInput(false);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setVerificationStatus('error');
//       setShowPrivateKeyInput(false);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // const handleDecryptField = async (fieldValue1, fieldValue2) => {
//   //   const encryptedMessage = fieldValue1 + fieldValue2;
//   //   const decryptedText = await decryptRSA(privateKey, encryptedMessage);
//   //   return decryptedText;
//   // };

//   const handleDecryptField = async (fieldValue1, fieldValue2) => {
//     try {
//       const encryptedMessage = fieldValue1 + fieldValue2;
//       const decryptedText = await decryptRSA(privateKey, encryptedMessage);
      
//       if (decryptedText.includes(`Error decrypting`))  {
//          console.error('Error decrypting in decryptRSA')
//          setShowPrivateKeyError(true)
//          return ""
//       }
//       console.log(decryptedText)
//       setShowPrivateKeyError(false)
//       return decryptedText;
//     } catch (error) {      
//       console.error('Error decrypting:', error);
//       setShowPrivateKeyError(true)
//        return ""      
//     }
//   };

//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const decryptedItem = {};
//       for (const field in item) {
//         if (field.endsWith('1')) {
//           const counterpart = field.slice(0, -1) + '2';
//           const value1 = item[field];
//           const value2 = item[counterpart];
//           if (value1 && value2 && value1 !== "" && value2 !== "") {
//             const decryptedValue = await handleDecryptField(value1, value2);
//             decryptedItem[field] = decryptedValue;
//           } else {
//             decryptedItem[field] = "";
//           }
//         }
//       }
//       return decryptedItem;
//     }));
//     setDecryptedData(decrypted);
//   };

//   const handleImportFromClipboard = () => {
//     navigator.clipboard.readText()
//       .then(text => setPrivateKey(text))
//       .catch(err => alert('⚠️Failed to read clipboard contents: ', err));
//   };

//   // const handleFileUpload = (event) => {
//   //   const file = event.target.files[0];
//   //   const reader = new FileReader();
//   //   reader.onload = (event) => {
//   //     setPrivateKey(event.target.result);
//   //   };
//   //   reader.readAsText(file);
//   // };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) {
//       alert('⚠️No file selected!');
//       return;
//     }
  
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPrivateKey(event.target.result);
//     };
//     reader.onerror = (error) => {
//       alert('⚠️Failed to read file: ', error);
//     };
//     reader.readAsText(file);
//   };
  

//   const handleOutputData = () => {
//     const output = [];
//     responseData.forEach((item, index) => {
//       const outputItem = {};
//       for (const field in item) {
//         if (!field.endsWith('1') && !field.endsWith('2')) {
//           if (decryptedData[index] && decryptedData[index][field + '1']) {
//             outputItem[field] = decryptedData[index][field + '1'] !== "" ? decryptedData[index][field + '1'] : item[field];
//           } else {
//             outputItem[field] = item[field];
//           }
//         }
//       }
//       output.push(outputItem);
//     });
//     return output;
//   };

//   const outputData = handleOutputData();

//   return (
//     <> 
//       {showPrivateKeyInput && (
//         <div className='filters'>
//           <label>
//             <b>{privateKey ? 'Private Key loaded' : 'Private Key:'}</b>
//             <input type="hidden" className='form-input' value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
//           </label>
//           <button className='form-input' onClick={handleImportFromClipboard}>Import from Clipboard</button>
//           <input className='form-input' type="file" onChange={handleFileUpload} />
//           {privateKey && privateKey !== '' && (
//             <label>
//               <input
//                 type="checkbox"
//                 checked={decryptEnabled}              
//                 onChange={(e) => setDecryptEnabled(e.target.checked)}
//               />
//               Decrypt Private Key
//             </label>
//           )}  
//           {decryptEnabled && 
//             <DecryptPrivateKey             
//               encryptedKey={ privateKey }
//               onDecrypted={(key) => setDecryptedPrivateKey(key)}
//             />
//           }
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit}>
//         {!showPrivateKeyInput && (
//           <div className='filters' style={{ "marginBottom": "70px"}}>
//             <label>
//               <b>User ID:</b>
//               <input type="text" className='form-input' value={userid} onChange={(e) => setUserid(e.target.value)} required/>
//             </label>
//             <label>
//               <b>Price ID:</b>
//               <input type="text" className='form-input' value={idprice} onChange={(e) => setIdprice(e.target.value)} />
//             </label>

//             <button className='back-button selected' type="submit" disabled={submitting}>Submit</button>
//           </div>
//         )}
//       </form>
      
//       {verificationStatus === 'error' && <p>⚠️Incorrect username or password!</p>}
      
//       {verificationStatus === 'verified' && responseData && (
//         <>
//          {showDecryptButton && (
//             <button className='back-button selected' onClick={handleDecryptAll}>Decrypt All Fields</button>
//           )}
//           {showPrivateKeyError && (
//             <b className="error-message">⚠️Check key decryption error</b>
//           )}
//           <FilteredDataDisplay
//             outputData={outputData}
//           />         
//         </>
//       )}
//     </>
//   );
// };

// export default OrderFormAndDecryption;




// import React, { useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  
// import { BooksContext } from '../../BooksContext';
// import DecryptPrivateKey from '../rsacomponent/DecryptPrivateKey'; 

// const MyForm = () => {
//   const { uiMain, fieldState } = useContext(BooksContext);
//   const [userid, setUserid] = useState('');
//   const [idprice, setIdprice] = useState(fieldState.idprice || "");
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedData, setDecryptedData] = useState([]);
//   const [privateKey, setPrivateKey] = useState('');
//   const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false);
//   const [searchValue, setSearchValue] = useState('');
//   const [filterField, setFilterField] = useState('');
//   const [selectedData, setSelectedData] = useState([]);
//   const [showDecryptButton, setShowDecryptButton] = useState(false);
//   const [selectAllText, setSelectAllText] = useState('Select All');
//   const [submitting, setSubmitting] = useState(false);
//   //const [encryptedPrivateKey, setEncryptedPrivateKey] = useState(''); // Add state for encrypted private key
//   const [decryptedPrivateKey, setDecryptedPrivateKey] = useState(''); // Add state for decrypted private key
//   const [decryptEnabled, setDecryptEnabled] = useState(false); // Add state for decrypt enabled
//   const { decryptRSA } = RSAEncryption();

//   const [startDate, setStartDate] = useState(''); // Add state for start date
//   const [endDate, setEndDate] = useState(''); // Add state for end date

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (uiMain.length === 0) {
//       navigate('/');
//     }
//   }, [uiMain, navigate]);

  

//   useEffect(() => {
//     setShowDecryptButton(privateKey !== '');
//   }, [privateKey]);

//   useEffect(() => {
//     if (decryptedPrivateKey) {
//       setPrivateKey(decryptedPrivateKey);
//     }
//   }, [decryptedPrivateKey]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     setSubmitting(true);

//     const formData = new FormData();
//     formData.append('userid', userid);
//     formData.append('idpric', idprice);
//     //formData.append('startDate', startDate);
//     //formData.append('endDate', endDate);
    
//     const apiUrl = uiMain.Urorder;
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//           setShowPrivateKeyInput(true);
//         } else {
//           setVerificationStatus('error');
//           alert("⚠️Incorrect username or password!")
//           setResponseData([]);
//           setShowPrivateKeyInput(false);
//         }
       
//       } else {
//         console.error('Error:1', data.message);
//         setVerificationStatus('error');
//         setShowPrivateKeyInput(false);
//       }
//     } catch (error) {
//       console.error('Error:2', error);
//       setVerificationStatus('error');
//       setShowPrivateKeyInput(false);
//     } finally {      
//       setSubmitting(false);
//     }
//   };

//   const handleDecryptField = async (fieldValue1, fieldValue2) => {
//     const encryptedMessage = fieldValue1 + fieldValue2;
//     const decryptedText = await decryptRSA(privateKey, encryptedMessage);
//     return decryptedText;
//   };

//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const decryptedItem = {};
//       for (const field in item) {
//         if (field.endsWith('1')) {
//           const counterpart = field.slice(0, -1) + '2';
//           const value1 = item[field];
//           const value2 = item[counterpart];
//           if (value1 && value2 && value1 !== "" && value2 !== "") {
//             const decryptedValue = await handleDecryptField(value1, value2);
//             decryptedItem[field] = decryptedValue;
//           } else {
//             decryptedItem[field] = "";
//           }
//         }
//       }
//       return decryptedItem;
//     }));
//     setDecryptedData(decrypted);
//   };

//   const handleOutputData = () => {
//     const output = [];
//     responseData.forEach((item, index) => {
//       const outputItem = {};
//       for (const field in item) {
//         if (!field.endsWith('1') && !field.endsWith('2')) {
//           if (decryptedData[index] && decryptedData[index][field + '1']) {
//             outputItem[field] = decryptedData[index][field + '1'] !== "" ? decryptedData[index][field + '1'] : item[field];
//           } else {
//             outputItem[field] = item[field];
//           }
//         }
//       }
//       output.push(outputItem);
//     });
//     return output;
//   };

//   const outputData = handleOutputData();

//   const handleImportFromClipboard = () => {
//     navigator.clipboard.readText()
//       .then(text => setPrivateKey(text))
//       .catch(err => alert('⚠️Failed to read clipboard contents: ', err));
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPrivateKey(event.target.result);
//     };
//     reader.readAsText(file);
//   };

//   // !convert to UTC ISO 8601
//   const convertToUTC = (dateString) => {
//     const date = new Date(dateString);
//     return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString();
//   };

//   const filterData = (data) => {
//     if (!searchValue && !filterField && !startDate && !endDate) {
//       return data;
//     }
//     // !convert to UTC ISO 8601
//     // const convertToUTC = (dateString) => {
//     //   const date = new Date(dateString);
//     //   return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString();
//     // };

//     // return data.filter((item) => {      
//     //   const fieldValue = typeof item[filterField] === 'string' ? item[filterField] : String(item[filterField]);
//     //   return fieldValue !== "" && fieldValue.toLowerCase().includes(searchValue.toLowerCase());
//     // });
//     return data.filter((item) => {
//       let isMatch = true;
  
//       if (searchValue && filterField) {
//         const fieldValue = typeof item[filterField] === 'string' ? item[filterField] : String(item[filterField]);
//         isMatch = fieldValue !== "" && fieldValue.toLowerCase().includes(searchValue.toLowerCase());
//       }
  
//       if (isMatch && startDate && endDate) {
//         // const itemDate = new Date(item.currentDateTime);
//         // const start = new Date(startDate);
//         // const end = new Date(endDate);
//         const itemDate = convertToUTC(item.currentDateTime);
//         const start = convertToUTC(startDate);
//         const end = convertToUTC(endDate);
//         isMatch = itemDate >= start && itemDate <= end;
//         console.log( itemDate)
//         console.log(start)
//         console.log(end)
//         console.log(isMatch)
//       }
  
//       return isMatch;
//     });
//   };
  
//   const renderFilteredData = () => {
//     const filteredData = filterData(outputData);
//     return (
//       <div className='dekrypted-container'>
//         {filteredData.map((outputItem, index) => (
//           <div className='dekrypted' key={index}>
//             <div className='filters'>
//             <input
//               type="checkbox"
//               style={{ cursor: 'pointer' }}
//               className='selected'
//               checked={selectedData.includes(index)}
//               onChange={() => toggleSelect(index)}
//             />
//             <h3>Decrypted Data # {index + 1}</h3>
//             </div>
//             <ul className='no-markers'>
//               {Object.entries(outputItem).map(([field, value]) => (
//                 // <li key={field}>
//                 //   {field}: {value}
//                 // </li>
//                 <li key={field} style={getFieldStyle(field, value)}>
//                   {field}: {formatFieldValue(field, value)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const getFieldStyle = (field, value) => {
//     if (field === 'orderNumber') {
//       return { fontWeight: 'bold' };
//     }
//     if (field === 'currentDateTime') {
//       return { color: 'blue' };
//     }
//     return {};
//   };

//   const formatFieldValue = (field, value) => {
//     if (field === 'currentDateTime') {
//       // return `New (${value})`;
//       return <strong translate="no">{value} <br /> UTC ISO { convertToUTC(value)}</strong>
//     }
//     return value;
//   };

//   const toggleSelect = (index) => {
//     if (selectedData.includes(index)) {
//       setSelectedData(selectedData.filter((item) => item !== index));
//     } else {
//       setSelectedData([...selectedData, index]);
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectAllText === 'Select All') {
//       const allFilteredIndexes = filterData(outputData).map((item, index) => index);
//       setSelectedData(allFilteredIndexes);
//       setSelectAllText('Deselect All');
//     } else {
//       setSelectedData([]);
//       setSelectAllText('Select All');
//     }
//   };

//   const copySelectedDataToClipboard = () => {
//     const selectedItems = selectedData.map((index) => {
//       const item = outputData[index];
//       const filteredItem = {};
//       for (const [key, value] of Object.entries(item)) {       
//         if (value !== '') {
//           filteredItem[key] = value;
//         }
//       }
//       return filteredItem;
//     });
//     const clipboardText = selectedItems.map((item) => {     
//      return Object.entries(item).map(([key, value]) => `${key}:${value}`).join(',')
//     }).join(';\n');
//     navigator.clipboard.writeText(clipboardText)
//       .then(() => alert('Selected data copied to clipboard'))
//       .catch((error) => alert('⚠️Failed to copy selected data to clipboard: ', error));
//   };  

//   const Reset = () => {
//     setEndDate("")
//     setStartDate("")
//     setSearchValue("")
//   }
// //console.log(privateKey)
//   return (
//     <> 
//     {showPrivateKeyInput && (
//       <div className='filters'>
//           <label>
//             <b>{privateKey ? 'Private Key loaded' : 'Private Key:'}</b>
//             <input type="hidden" className='form-input' value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
//           </label>
//           <button className='form-input' onClick={handleImportFromClipboard}>Import from Clipboard</button>
//           <input className='form-input' type="file" onChange={handleFileUpload} />
//         {privateKey && privateKey !== '' && (
//           <label>
//             <input
//               type="checkbox"
//               checked={decryptEnabled}              
//               onChange={(e) => setDecryptEnabled(e.target.checked)}
//             />
//             Decrypt Private Key
//           </label>
//         )}  
//           {decryptEnabled && 
//             <DecryptPrivateKey             
//               encryptedKey={ privateKey}
//               onDecrypted={(key) => setDecryptedPrivateKey(key)}
//             />
//           }
          
//       </div>
//     )}
     
//       <form onSubmit={handleSubmit}>
//         {!showPrivateKeyInput && (
//           <div className='filters' style={{ "marginBottom": "70px"}}>
//             <label>
//               <b>User ID:</b>
//               <input type="text" className='form-input' value={userid} onChange={(e) => setUserid(e.target.value)} required/>
//             </label>
//             <label>
//               <b>Price ID:</b>
//               <input type="text" className='form-input' value={idprice} onChange={(e) => setIdprice(e.target.value)} />
//             </label>

//             {/* <label>
//             <b>Start Date:</b>
//             <input
//               type="date"
//               className='form-input'
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </label>
//           <label>
//             <b>End Date:</b>
//             <input
//               type="date"
//               className='form-input'
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </label> */}

//             <button className='back-button selected' type="submit" disabled={submitting}>Submit</button>
//           </div>
//         )}
//       </form>
//       {verificationStatus === 'error' && <p>⚠️Incorrect username or password!</p>}
      
//       {verificationStatus === 'verified' && responseData && (         
//         <div className='filters'>
//           <input
//             type="search"
//             className='form-input'
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             placeholder="Filter..."
//           />
//           <select className='form-input' value={filterField} onChange={(e) => setFilterField(e.target.value)}>
//             <option value="">Select Filter Field</option>
//             {outputData.length > 0 &&
//               Object.keys(outputData[0]).map((field) => (
//                 <option key={field} value={field}>
//                   {field}
//                 </option>
//               ))
//             }
//           </select>


//           <label>
//             <b>Start Date:</b>
//             <input
//               type="date"
//               className='form-input'
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </label>
//           <label>
//             <b>End Date:</b>
//             <input
//               type="date"
//               className='form-input'
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </label>
//          {(searchValue!==""|| startDate!==""||endDate!=="") && 
//             <button className='back-button selected' onClick={Reset}>Reset Filter</button>
//          }
//           <div className='filters'>
//             {showPrivateKeyInput && showDecryptButton && (
//               <>
//                 <button className='back-button selected' onClick={handleDecryptAll}>Decrypt All Fields</button>
                
//               </>
//             )}
//             {outputData && filterData(outputData).length>0 &&(
//             <button className='back-button selected' onClick={handleSelectAll}>{selectAllText}</button>
//             )}
//             {selectedData&&selectedData.length>0&&(
//             <button className='back-button selected' onClick={copySelectedDataToClipboard}>Copy Selected to Clipboard</button>
//              )}
//             <div className='dekrypted-container'>
//               {renderFilteredData()}            
//             </div>
//           </div>
//         </div>  
//       )}
//       {/* {verificationStatus === 'error' && <p>⚠️Incorrect username or password!</p>} */}
    
//     </>  
//   );
// };

// export default MyForm;


// import React, { useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  
// import { BooksContext } from '../../BooksContext';
// import DecryptPrivateKey from '../rsacomponent/DecryptPrivateKey'; 

// const MyForm = () => {
//   const { uiMain, fieldState } = useContext(BooksContext);
//   const [userid, setUserid] = useState('');
//   const [idprice, setIdprice] = useState(fieldState.idprice || "");
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedData, setDecryptedData] = useState([]);
//   const [privateKey, setPrivateKey] = useState('');
//   const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false);
//   const [searchValue, setSearchValue] = useState('');
//   const [filterField, setFilterField] = useState('');
//   const [selectedData, setSelectedData] = useState([]);
//   const [showDecryptButton, setShowDecryptButton] = useState(false);
//   const [selectAllText, setSelectAllText] = useState('Select All');
//   const [submitting, setSubmitting] = useState(false);
//   //const [encryptedPrivateKey, setEncryptedPrivateKey] = useState(''); // Add state for encrypted private key
//   const [decryptedPrivateKey, setDecryptedPrivateKey] = useState(''); // Add state for decrypted private key
//   const [decryptEnabled, setDecryptEnabled] = useState(false); // Add state for decrypt enabled
//   const { decryptRSA } = RSAEncryption();

//   const [startDate, setStartDate] = useState(''); // Add state for start date
//   const [endDate, setEndDate] = useState(''); // Add state for end date

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (uiMain.length === 0) {
//       navigate('/');
//     }
//   }, [uiMain, navigate]);

  

//   useEffect(() => {
//     setShowDecryptButton(privateKey !== '');
//   }, [privateKey]);

//   useEffect(() => {
//     if (decryptedPrivateKey) {
//       setPrivateKey(decryptedPrivateKey);
//     }
//   }, [decryptedPrivateKey]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     setSubmitting(true);

//     const formData = new FormData();
//     formData.append('userid', userid);
//     formData.append('idpric', idprice);
//     //formData.append('startDate', startDate);
//     //formData.append('endDate', endDate);
    
//     const apiUrl = uiMain.Urorder;
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//           setShowPrivateKeyInput(true);
//         } else {
//           setVerificationStatus('error');
//           alert("⚠️Incorrect username or password!")
//           setResponseData([]);
//           setShowPrivateKeyInput(false);
//         }
       
//       } else {
//         console.error('Error:1', data.message);
//         setVerificationStatus('error');
//         setShowPrivateKeyInput(false);
//       }
//     } catch (error) {
//       console.error('Error:2', error);
//       setVerificationStatus('error');
//       setShowPrivateKeyInput(false);
//     } finally {      
//       setSubmitting(false);
//     }
//   };

//   const handleDecryptField = async (fieldValue1, fieldValue2) => {
//     const encryptedMessage = fieldValue1 + fieldValue2;
//     const decryptedText = await decryptRSA(privateKey, encryptedMessage);
//     return decryptedText;
//   };

//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const decryptedItem = {};
//       for (const field in item) {
//         if (field.endsWith('1')) {
//           const counterpart = field.slice(0, -1) + '2';
//           const value1 = item[field];
//           const value2 = item[counterpart];
//           if (value1 && value2 && value1 !== "" && value2 !== "") {
//             const decryptedValue = await handleDecryptField(value1, value2);
//             decryptedItem[field] = decryptedValue;
//           } else {
//             decryptedItem[field] = "";
//           }
//         }
//       }
//       return decryptedItem;
//     }));
//     setDecryptedData(decrypted);
//   };

//   const handleOutputData = () => {
//     const output = [];
//     responseData.forEach((item, index) => {
//       const outputItem = {};
//       for (const field in item) {
//         if (!field.endsWith('1') && !field.endsWith('2')) {
//           if (decryptedData[index] && decryptedData[index][field + '1']) {
//             outputItem[field] = decryptedData[index][field + '1'] !== "" ? decryptedData[index][field + '1'] : item[field];
//           } else {
//             outputItem[field] = item[field];
//           }
//         }
//       }
//       output.push(outputItem);
//     });
//     return output;
//   };

//   const outputData = handleOutputData();

//   const handleImportFromClipboard = () => {
//     navigator.clipboard.readText()
//       .then(text => setPrivateKey(text))
//       .catch(err => alert('⚠️Failed to read clipboard contents: ', err));
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPrivateKey(event.target.result);
//     };
//     reader.readAsText(file);
//   };

//   const filterData = (data) => {
//     if (!searchValue && !filterField && !startDate && !endDate) {
//       return data;
//     }
  
//     // return data.filter((item) => {      
//     //   const fieldValue = typeof item[filterField] === 'string' ? item[filterField] : String(item[filterField]);
//     //   return fieldValue !== "" && fieldValue.toLowerCase().includes(searchValue.toLowerCase());
//     // });
//     return data.filter((item) => {
//       let isMatch = true;
  
//       if (searchValue && filterField) {
//         const fieldValue = typeof item[filterField] === 'string' ? item[filterField] : String(item[filterField]);
//         isMatch = fieldValue !== "" && fieldValue.toLowerCase().includes(searchValue.toLowerCase());
//       }
  
//       if (isMatch && startDate && endDate) {
//         const itemDate = new Date(item.currentDateTime);
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         isMatch = itemDate >= start && itemDate <= end;
//         console.log( itemDate)
//         console.log(start)
//         console.log(isMatch)
//       }
  
//       return isMatch;
//     });
//   };
  
//   const renderFilteredData = () => {
//     const filteredData = filterData(outputData);
//     return (
//       <div className='dekrypted-container'>
//         {filteredData.map((outputItem, index) => (
//           <div className='dekrypted' key={index}>
//             <div className='filters'>
//             <input
//               type="checkbox"
//               style={{ cursor: 'pointer' }}
//               className='selected'
//               checked={selectedData.includes(index)}
//               onChange={() => toggleSelect(index)}
//             />
//             <h3>Decrypted Data # {index + 1}</h3>
//             </div>
//             <ul className='no-markers'>
//               {Object.entries(outputItem).map(([field, value]) => (
//                 <li key={field}>
//                   {field}: {value}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const toggleSelect = (index) => {
//     if (selectedData.includes(index)) {
//       setSelectedData(selectedData.filter((item) => item !== index));
//     } else {
//       setSelectedData([...selectedData, index]);
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectAllText === 'Select All') {
//       const allFilteredIndexes = filterData(outputData).map((item, index) => index);
//       setSelectedData(allFilteredIndexes);
//       setSelectAllText('Deselect All');
//     } else {
//       setSelectedData([]);
//       setSelectAllText('Select All');
//     }
//   };

//   const copySelectedDataToClipboard = () => {
//     const selectedItems = selectedData.map((index) => {
//       const item = outputData[index];
//       const filteredItem = {};
//       for (const [key, value] of Object.entries(item)) {       
//         if (value !== '') {
//           filteredItem[key] = value;
//         }
//       }
//       return filteredItem;
//     });
//     const clipboardText = selectedItems.map((item) => {     
//      return Object.entries(item).map(([key, value]) => `${key}:${value}`).join(',')
//     }).join(';\n');
//     navigator.clipboard.writeText(clipboardText)
//       .then(() => alert('Selected data copied to clipboard'))
//       .catch((error) => alert('⚠️Failed to copy selected data to clipboard: ', error));
//   };  

//   return (
// <> 
//       {showPrivateKeyInput && (
//         <div className='filters'>
//           <label>
//             <b>{privateKey ? 'Private Key loaded' : 'Private Key:'}</b>
//             <input type="hidden" className='form-input' value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
//           </label>
//           <button className='selected' onClick={handleImportFromClipboard}>Import from Clipboard</button>
//           <input className='selected' type="file" onChange={handleFileUpload} />
//           <label>
//             <input
//               type="checkbox"
//               checked={decryptEnabled}
//               onChange={(e) => setDecryptEnabled(e.target.checked)}
//             />
//             Decrypt Private Key
//           </label>
//           {decryptEnabled && (
//             <DecryptPrivateKey             
//               encryptedKey={ privateKey}
//               onDecrypted={(key) => setDecryptedPrivateKey(key)}
//             />
//           )}
//         </div>
//       )}
   
//       <form onSubmit={handleSubmit}>
//         {!showPrivateKeyInput && (
//           <div className='filters' style={{ "marginBottom": "70px"}}>
//             <label>
//               <b>User ID:</b>
//               <input type="text" className='form-input' value={userid} onChange={(e) => setUserid(e.target.value)} required/>
//             </label>
//             <label>
//               <b>Price ID:</b>
//               <input type="text" className='form-input' value={idprice} onChange={(e) => setIdprice(e.target.value)} required/>
//             </label>

//             {/* <label>
//             <b>Start Date:</b>
//             <input
//               type="date"
//               className='form-input'
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </label>
//           <label>
//             <b>End Date:</b>
//             <input
//               type="date"
//               className='form-input'
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </label> */}

//             <button className={submitting ? 'back-button' : 'back-button selected'} type="submit" disabled={submitting}>Submit</button>
//           </div>
//         )}
//       </form>    
//        {verificationStatus === 'verified' && responseData && (       
//         <>
//          <div className='filters'>
//           <input
//             type="search"
//             className='form-input'
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             placeholder="Filter..."
//           />
//           <select className='form-input' value={filterField} onChange={(e) => setFilterField(e.target.value)}>
//             <option value="">Select Filter Field</option>
//             {outputData.length > 0 &&
//               Object.keys(outputData[0]).map((field) => (
//                 <option key={field} value={field}>
//                   {field}
//                 </option>
//               ))
//             }
//           </select>
//           </div>  
//           <div className='filters'>
//           <label>
//             <b>Start Date:</b>
//             <input
//               type="date"
//               className='form-input'
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </label>
//           <label>
//             <b>End Date:</b>
//             <input
//               type="date"
//               className='form-input'
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </label>
//           </div>
//           <div className='filters'>
//             {showPrivateKeyInput && showDecryptButton && (
//               <button className='back-button selected' onClick={handleDecryptAll}>Decrypt All Fields</button>              
//             )}
//             {outputData && filterData(outputData).length>0 &&(
//               <button className='back-button selected' onClick={handleSelectAll}>{selectAllText}</button>
//             )}
//             {selectedData&&selectedData.length>0&&(
//               <button className='back-button selected' onClick={copySelectedDataToClipboard}>Copy Selected to Clipboard</button>
//              )}
//           </div>   
//           <div className='dekrypted-container'>
//               {renderFilteredData()}
//          </div>
//         </>     
//         )}    
//       {verificationStatus === 'error' && <p>⚠️Incorrect username or password!</p>}            
// </>  
//   );
// };

// export default MyForm;



// import React, { useContext, useState, useEffect } from 'react';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  
// import { BooksContext } from '../../BooksContext';

// const MyForm = () => {
//   const { uiMain, fieldState } = useContext(BooksContext);
//   const [userid, setUserid] = useState('');
//   const [idprice, setIdprice] = useState(fieldState.idprice || "");
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedData, setDecryptedData] = useState([]);
//   const [privateKey, setPrivateKey] = useState('');
//   const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false);
//   const [searchValue, setSearchValue] = useState('');
//   const [filterField, setFilterField] = useState('');
//   const [selectedData, setSelectedData] = useState([]);
//   const [showDecryptButton, setShowDecryptButton] = useState(false);
//   const [selectAllText, setSelectAllText] = useState('Select All');
//   const [submitting, setSubmitting] = useState(false);
//   const { decryptRSA } = RSAEncryption();

//   useEffect(() => {
//     setShowDecryptButton(privateKey !== '');
//   }, [privateKey]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     setSubmitting(true);

//     const formData = new FormData();
//     formData.append('userid', userid);
//     formData.append('idpric', idprice);
    
//     const apiUrl = uiMain.Urorder;
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//           setShowPrivateKeyInput(true);
//         } else {
//           setVerificationStatus('error');
//           alert("⚠️Incorrect username or password!")
//           setResponseData([]);
//           setShowPrivateKeyInput(false);
//         }
       
//       } else {
//         console.error('Error:1', data.message);
//         setVerificationStatus('error');
//         setShowPrivateKeyInput(false);
//       }
//     } catch (error) {
//       console.error('Error:2', error);
//       setVerificationStatus('error');
//       setShowPrivateKeyInput(false);
//     } finally {
//       // В конце обработки запроса устанавливаем состояние отправки в false
//       setSubmitting(false);
//     }
//   };

//   const handleDecryptField = async (fieldValue1, fieldValue2) => {
//     const encryptedMessage = fieldValue1 + fieldValue2;
//     const decryptedText = await decryptRSA(privateKey, encryptedMessage);
//     return decryptedText;
//   };

//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const decryptedItem = {};
//       for (const field in item) {
//         if (field.endsWith('1')) {
//           const counterpart = field.slice(0, -1) + '2';
//           const value1 = item[field];
//           const value2 = item[counterpart];
//           if (value1 && value2 && value1 !== "" && value2 !== "") {
//             const decryptedValue = await handleDecryptField(value1, value2);
//             decryptedItem[field] = decryptedValue;
//           } else {
//             decryptedItem[field] = "";
//           }
//         }
//       }
//       return decryptedItem;
//     }));
//     setDecryptedData(decrypted);
//   };

//   const handleOutputData = () => {
//     const output = [];
//     responseData.forEach((item, index) => {
//       const outputItem = {};
//       for (const field in item) {
//         if (!field.endsWith('1') && !field.endsWith('2')) {
//           if (decryptedData[index] && decryptedData[index][field + '1']) {
//             outputItem[field] = decryptedData[index][field + '1'] !== "" ? decryptedData[index][field + '1'] : item[field];
//           } else {
//             outputItem[field] = item[field];
//           }
//         }
//       }
//       output.push(outputItem);
//     });
//     return output;
//   };

//   const outputData = handleOutputData();

//   const handleImportFromClipboard = () => {
//     navigator.clipboard.readText()
//       .then(text => setPrivateKey(text))
//       .catch(err => console.error('Failed to read clipboard contents: ', err));
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPrivateKey(event.target.result);
//     };
//     reader.readAsText(file);
//   };

//   const filterData = (data) => {
//     if (!searchValue || !filterField) {
//       return data;
//     }
  
//     return data.filter((item) => {
//       // Проверяем, является ли значение строкой перед вызовом toLowerCase()
//       const fieldValue = typeof item[filterField] === 'string' ? item[filterField] : String(item[filterField]);
//       return fieldValue !== "" && fieldValue.toLowerCase().includes(searchValue.toLowerCase());
//     });
//   };
  
  
//   // const filterData = (data) => {
//   //   if (!searchValue || !filterField) {
//   //     return data;
//   //   }

//   //   return data.filter((item) =>
//   //     item[filterField].toLowerCase().includes(searchValue.toLowerCase())
//   //   );
//   // };

//   const renderFilteredData = () => {
//     const filteredData = filterData(outputData);
//     return (
//       <div className='dekrypted-container'>
//         {filteredData.map((outputItem, index) => (
//           <div className='dekrypted' key={index}>
//             <div className='filters'>
//             <input
//               type="checkbox"
//               style={{ cursor: 'pointer' }}
//               className='selected'
//               checked={selectedData.includes(index)}
//               onChange={() => toggleSelect(index)}
//             />
//             <h3>Decrypted Data # {index + 1}</h3>
//             </div>
//             <ul className='no-markers'>
//               {Object.entries(outputItem).map(([field, value]) => (
//                 <li key={field}>
//                   {field}: {value}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const toggleSelect = (index) => {
//     if (selectedData.includes(index)) {
//       setSelectedData(selectedData.filter((item) => item !== index));
//     } else {
//       setSelectedData([...selectedData, index]);
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectAllText === 'Select All') {
//       const allFilteredIndexes = filterData(outputData).map((item, index) => index);
//       setSelectedData(allFilteredIndexes);
//       setSelectAllText('Deselect All');
//     } else {
//       setSelectedData([]);
//       setSelectAllText('Select All');
//     }
//   };

//   const copySelectedDataToClipboard = () => {
//     const selectedItems = selectedData.map((index) => {
//       const item = outputData[index];
//       const filteredItem = {};
//       for (const [key, value] of Object.entries(item)) {
//         // Пропускаем ключи с пустыми значениями
//         if (value !== '') {
//           filteredItem[key] = value;
//         }
//       }
//       return filteredItem;
//     });
//     const clipboardText = selectedItems.map((item) => {
//      // return Object.values(item).join(';');
//      return Object.entries(item).map(([key, value]) => `${key}:${value}`).join(',')
//     }).join(';\n');
//     navigator.clipboard.writeText(clipboardText)
//       .then(() => alert('Selected data copied to clipboard'))
//       .catch((error) => console.error('Failed to copy selected data to clipboard: ', error));
//   };
  

//   // const copySelectedDataToClipboard = () => {
//   //   const selectedItems = selectedData.map((index) => outputData[index]);
//   //   const clipboardText = JSON.stringify(selectedItems, null, 2);
//   //   navigator.clipboard.writeText(clipboardText)
//   //     .then(() => console.log('Selected data copied to clipboard'))
//   //     .catch((error) => console.error('Failed to copy selected data to clipboard: ', error));
//   // };
// console.log(selectedData)
// console.log(outputData)
// console.log(filterData(outputData).length)
//   return (
//     <> 
//     {showPrivateKeyInput && (
//         <div className='filters'>
//           <label>
//             <b>{privateKey ? 'Private Key loaded' : 'Private Key:'}</b>
//             <input type="hidden" className='form-input' value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
//           </label>
//           <button className='selected' onClick={handleImportFromClipboard}>Import from Clipboard</button>
//           <input className='selected' type="file" onChange={handleFileUpload} />
//         </div>
//       )}
     
//       <form onSubmit={handleSubmit}>
//         {!showPrivateKeyInput && (
//           <div className='filters' style={{ "marginBottom": "70px"}}>
//             <label>
//               <b>User ID:</b>
//               <input type="text" className='form-input' value={userid} onChange={(e) => setUserid(e.target.value)} required/>
//             </label>
//             <label>
//               <b>Price ID:</b>
//               <input type="text" className='form-input' value={idprice} onChange={(e) => setIdprice(e.target.value)} />
//             </label>
//             <button className='back-button selected' type="submit" disabled={submitting}>Submit</button>
//           </div>
//         )}
//       </form>
//       {verificationStatus === 'verified' && responseData && (
//         <div className='filters'>
//           <input
//             type="search"
//             className='form-input'
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             placeholder="Filter..."
//           />
//           <select className='form-input' value={filterField} onChange={(e) => setFilterField(e.target.value)}>
//             <option value="">Select Filter Field</option>
//             {outputData.length > 0 &&
//               Object.keys(outputData[0]).map((field) => (
//                 <option key={field} value={field}>
//                   {field}
//                 </option>
//               ))
//             }
//           </select>
//           <div className='filters'>
//             {showPrivateKeyInput && showDecryptButton && (
//               <>
//                 <button className='back-button selected' onClick={handleDecryptAll}>Decrypt All Fields</button>
                
//               </>
//             )}
//             {outputData && filterData(outputData).length>0 &&(
//             <button className='back-button selected' onClick={handleSelectAll}>{selectAllText}</button>
//             )}
//             {selectedData&&selectedData.length>0&&(
//             <button className='back-button selected' onClick={copySelectedDataToClipboard}>Copy Selected to Clipboard</button>
//              )}
//             <div className='dekrypted-container'>
//               {renderFilteredData()}
//             </div>
//           </div>
//         </div>  
//       )}
//       {verificationStatus === 'error' && <p>⚠️Incorrect username or password!</p>}
    
//     </>  
//   );
// };

// export default MyForm;


// import React, { useContext, useState } from 'react';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  
// import { BooksContext } from '../../BooksContext';

// const MyForm = () => {
//   const { uiMain, fieldState } = useContext(BooksContext);
//   const [userid, setUserid] = useState('');
//   const [idprice, setIdprice] = useState(fieldState.idprice || "");
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedData, setDecryptedData] = useState([]);
//   const [privateKey, setPrivateKey] = useState('');
//   const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false);
//   const [searchValue, setSearchValue] = useState('');
//   const [filterField, setFilterField] = useState('');

//   const { decryptRSA } = RSAEncryption();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formData = new FormData();
//     formData.append('userid', userid);
//     formData.append('idpric', idprice);
    
//     const apiUrl = uiMain.Urorder;
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//           setShowPrivateKeyInput(true);
//         } else {
//           setVerificationStatus('error');
//           setResponseData([]);
//           setShowPrivateKeyInput(false);
//         }
       
//       } else {
//         console.error('Error:1', data.message);
//         setVerificationStatus('error');
//         setShowPrivateKeyInput(false);
//       }
//     } catch (error) {
//       console.error('Error:2', error);
//       setVerificationStatus('error');
//       setShowPrivateKeyInput(false);
//     }
//   };

//   const handleDecryptField = async (fieldValue1, fieldValue2) => {
//     const encryptedMessage = fieldValue1 + fieldValue2;
//     const decryptedText = await decryptRSA(privateKey, encryptedMessage);
//     return decryptedText;
//   };

//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const decryptedItem = {};
//       for (const field in item) {
//         if (field.endsWith('1')) {
//           const counterpart = field.slice(0, -1) + '2';
//           const value1 = item[field];
//           const value2 = item[counterpart];
//           if (value1 && value2 && value1 !== "" && value2 !== "") {
//             const decryptedValue = await handleDecryptField(value1, value2);
//             decryptedItem[field] = decryptedValue;
//           } else {
//             decryptedItem[field] = "";
//           }
//         }
//       }
//       return decryptedItem;
//     }));
//     setDecryptedData(decrypted);
//   };

//   const handleOutputData = () => {
//     const output = [];
//     responseData.forEach((item, index) => {
//       const outputItem = {};
//       for (const field in item) {
//         if (!field.endsWith('1') && !field.endsWith('2')) {
//           if (decryptedData[index] && decryptedData[index][field + '1']) {
//           //  outputItem[field] = item[field] !== "undefined" ? item[field] : decryptedData[index][field + '1'];
//             outputItem[field] = decryptedData[index][field + '1'] !== "" ?   decryptedData[index][field + '1'] : item[field] ;
//           } else {
//             outputItem[field] = item[field];
//           }
//         }
//       }
//       output.push(outputItem);
//     });
//     return output;
//   };

//   const outputData = handleOutputData();

//   const handleImportFromClipboard = () => {
//     navigator.clipboard.readText()
//       .then(text => setPrivateKey(text))
//       .catch(err => console.error('Failed to read clipboard contents: ', err));
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPrivateKey(event.target.result);
//     };
//     reader.readAsText(file);
//   };

//   const filterData = (data) => {
//     if (!searchValue || !filterField) {
//       return data;
//     }

//     return data.filter((item) =>
//       item[filterField].toLowerCase().includes(searchValue.toLowerCase())
//     );
//   };

//   const renderFilteredData = () => {
//     const filteredData = filterData(outputData);
//     return (
//       <div className='dekrypted-container'>
//         {filteredData.map((outputItem, index) => (
//           <div className='dekrypted' key={index}>
//             <h3>Decrypted Data for UserID: {index + 1}</h3>
//             <ul>
//               {Object.entries(outputItem).map(([field, value]) => (
//                 <li key={field}>
//                   {field}: {value}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     );
//   };

  
//   console.log(responseData);
//   console.log(decryptedData);
//   console.log(outputData)


//   return (
//     <> 
//     {showPrivateKeyInput && (
//         <div>
//           <label>
//             Private Key:
//             <input type="text" className='form-input' value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
//           </label>
//           <button className='selected' onClick={handleImportFromClipboard}>Import from Clipboard</button>
//           <input className='selected' type="file" onChange={handleFileUpload} />
//         </div>
//       )}
     
//       <form onSubmit={handleSubmit}>
//         {!showPrivateKeyInput && (
//           <div>
//             <label>
//               User ID:
//               <input type="text" className='form-input' value={userid} onChange={(e) => setUserid(e.target.value)} required/>
//             </label>
//             <label>
//               Price ID:
//               <input type="text" className='form-input' value={idprice} onChange={(e) => setIdprice(e.target.value)} />
//             </label>
//             <button className='back-button selected' type="submit">Submit</button>
//           </div>
//         )}
//       </form>
//       {verificationStatus === 'verified' && responseData && (
//     <div>
//       <input
//        type="search"
//        className='form-input'
//         value={searchValue}
//         onChange={(e) => setSearchValue(e.target.value)}
//         placeholder="Filter..."
//       />
//       <select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
//         <option value="">Select Filter Field</option>
//         {outputData.length > 0 &&
//           Object.keys(outputData[0]).map((field) => (
//             <option key={field} value={field}>
//               {field}
//             </option>
//           ))
//         }
//       </select>
//         <div>
//           <button className='back-button selected' onClick={handleDecryptAll}>Decrypt All Fields</button>
//           <div className='dekrypted-container'>
//             {renderFilteredData()}
//           </div>
//         </div>
//       </div>  
//       )}
//       {verificationStatus === 'error' && <p>Incorrect username or password.</p>}
    
//       </>  
//   );
// };

// export default MyForm;



// import React, { useContext, useState } from 'react';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  // Подключение модуля RSAEncryption
// import { BooksContext } from '../../BooksContext';

// const MyForm = () => {
//   const { uiMain, fieldState } = useContext(BooksContext);
//   const [userid, setUserid] = useState('');
//   const [idprice, setIdprice] = useState(fieldState.idprice||"");
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedData, setDecryptedData] = useState([]);
//   const [privateKey, setPrivateKey] = useState('');
//   const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false);

//   const { decryptRSA } = RSAEncryption();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formData = new FormData();
//     formData.append('userid', userid);
//     formData.append('idpric', idprice);
    
//     const apiUrl = uiMain.Urorder;
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//           setShowPrivateKeyInput(true); // Показываем поле ввода для приватного ключа после успешной верификации
//         } else {
//           setVerificationStatus('error');
//           setResponseData([]);
//           setShowPrivateKeyInput(false);
//         }
       
//       } else {
//         console.error('Error:1', data.message);
//         setVerificationStatus('error');
//         setShowPrivateKeyInput(false);
//       }
//     } catch (error) {
//       console.error('Error:2', error);
//       setVerificationStatus('error');
//       setShowPrivateKeyInput(false);
//     }
//   };

//   const handleDecryptField = async (fieldValue1, fieldValue2) => {
//     const encryptedMessage = fieldValue1 + fieldValue2;
//     const decryptedText = await decryptRSA(privateKey, encryptedMessage); // Расшифровка с использованием введенного приватного ключа
//     return decryptedText; // Возвращаем расшифрованный текст
//   };


//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const decryptedItem = {};
//       for (const field in item) {
//         if (field.endsWith('1')) {
//           const counterpart = field.slice(0, -1) + '2';
//           const value1 = item[field];
//           const value2 = item[counterpart];
//           console.log(value1)
//           console.log(value2)
//           if (value1 && value2 && value1 !== "" && value2 !== "") {
//             const decryptedValue = await handleDecryptField(value1 , value2); // Объединяем значения "1" и "2" частей перед расшифровкой
//             decryptedItem[field] = decryptedValue;
//             console.log(decryptedValue)
//             //decryptedItem[counterpart] = decryptedValue; // Обе части поля будут содержать одно и то же расшифрованное значение
//           } else {
//             decryptedItem[field] = "";
//             //decryptedItem[counterpart] = "";
//           }
//         }
//       }
//       return decryptedItem;
//     }));
//     setDecryptedData(decrypted);
//     console.log(decrypted)
//   };
// console.log(decryptedData)
// const handleOutputData = () => {
//   const output = [];

//   responseData.forEach((item, index) => {
//     const outputItem = {};
//     for (const field in item) {
//       if (!field.endsWith('1') && !field.endsWith('2')) {
//         if (decryptedData[index] && decryptedData[index][field + '1'] ) {
//           outputItem[field] = item[field] !== "undefined" ? item[field] : decryptedData[index][field + '1'];
//         } else {
//           outputItem[field] = item[field];
//         }
//       }
//     }
//     output.push(outputItem);
//   });

//   return output;
// };


//   const outputData = handleOutputData();

//   const handleImportFromClipboard = () => {
//     navigator.clipboard.readText()
//       .then(text => setPrivateKey(text))
//       .catch(err => console.error('Failed to read clipboard contents: ', err));
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPrivateKey(event.target.result);
//     };
//     reader.readAsText(file);
//   };

//   console.log(decryptedData);
//   console.log(responseData);
// console.log(outputData)
//   return (
//     <div>
//       <div>
//         {showPrivateKeyInput && (
//           <div>
//             <label>
//               Private Key:
//               <input type="text" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
//             </label>
//             <button className='selected' onClick={handleImportFromClipboard}>Import from Clipboard</button>
//             <input className='selected' type="file" onChange={handleFileUpload} />
//           </div>
//         )}
//       </div>
//       <form onSubmit={handleSubmit}>
//         <>
//         {!showPrivateKeyInput && (
//           <div>
//             <label>
//               User ID:
//               <input  type="text" value={userid} onChange={(e) => setUserid(e.target.value)} />
//             </label>
//             <label>
//               Price ID:
//               <input  type="text" value={idprice} onChange={(e) => setIdprice(e.target.value)} />
//             </label>
//             <button className='back-button selected' type="submit">Submit</button>
//           </div>
//         )}
//         </>
//       </form>
//       {verificationStatus === 'verified' && responseData && (
//         <div>
//           {/* Вывод ответа */}
//           <button className='back-button selected' onClick={handleDecryptAll}>Decrypt All Fields</button>
//           <div className='dekrypted-container'>
//           {outputData.map((outputItem, index) => (
           
//             <div className='dekrypted' key={index}>
//               <h3>Decrypted Data for UserID: {index + 1}</h3>
//               <ul>
//                 {Object.entries(outputItem).map(([field, value]) => (
//                   <li key={field}>
//                     {field}: {value}
//                   </li>
//                 ))}
//               </ul>
//             </div>
           
//           ))}
//            </div>
//         </div>
//       )}
//       {verificationStatus === 'error' && <p>Incorrect username or password.</p>}
//     </div>
//   );
// };

// export default MyForm;



// import React, { useState } from 'react';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  // Подключение модуля RSAEncryption

// const MyForm = () => {
//   const [userid, setUserid] = useState('');
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedData, setDecryptedData] = useState([]);
//   const [privateKey, setPrivateKey] = useState('');
//   const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false);

//   const { decryptRSA } = RSAEncryption();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formData = new FormData();
//     formData.append('userid', userid);
   
//     try {
//       const response = await fetch('https://script.google.com/macros/s/AKfycbzGK2Zf0KmGKmBOFO92OavONViWNl7qqTPP7NEWPLNpf_r-5mOYFnFN2r8xpbbpSlas/exec', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//           setShowPrivateKeyInput(true); // Показываем поле ввода для приватного ключа после успешной верификации
//         } else {
//           setVerificationStatus('error');
//           setResponseData([]);
//           setShowPrivateKeyInput(false);
//         }
       
//       } else {
//         console.error('Error:', data.message);
//         setVerificationStatus('error');
//         setShowPrivateKeyInput(false);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setVerificationStatus('error');
//       setShowPrivateKeyInput(false);
//     }
//   };

//   const handleDecryptField = async (fieldValue1, fieldValue2) => {
//     const encryptedMessage = fieldValue1 + fieldValue2;
//     const decryptedText = await decryptRSA(privateKey, encryptedMessage); // Расшифровка с использованием введенного приватного ключа
//     return decryptedText; // Возвращаем расшифрованный текст
//   };


//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const decryptedItem = {};
//       for (const field in item) {
//         if (field.endsWith('1')) {
//           const counterpart = field.slice(0, -1) + '2';
//           const value1 = item[field];
//           const value2 = item[counterpart];
//           console.log(value1)
//           console.log(value2)
//           if (value1 && value2 && value1 !== "" && value2 !== "") {
//             const decryptedValue = await handleDecryptField(value1 , value2); // Объединяем значения "1" и "2" частей перед расшифровкой
//             decryptedItem[field] = decryptedValue;
//             console.log(decryptedValue)
//             //decryptedItem[counterpart] = decryptedValue; // Обе части поля будут содержать одно и то же расшифрованное значение
//           } else {
//             decryptedItem[field] = "";
//             //decryptedItem[counterpart] = "";
//           }
//         }
//       }
//       return decryptedItem;
//     }));
//     setDecryptedData(decrypted);
//     console.log(decrypted)
//   };
  

//   // const handleDecryptAll = async () => {
//   //   const decrypted = await Promise.all(responseData.map(async (item) => {
//   //     const decryptedItem = {};
//   //     for (const field in item) {
//   //       if (field.endsWith('1')) {
//   //         const counterpart = field.slice(0, -1) + '2';
//   //         decryptedItem[field] = await handleDecryptField(item[field], item[counterpart]);
//   //        // decryptedItem[counterpart] = await handleDecryptField(item[counterpart], item[field]);
//   //       }
//   //     }
//   //     return decryptedItem;
//   //   }));
//   //   setDecryptedData(decrypted);
//   //   console.log(decrypted)
//   // };

//   const handleImportFromClipboard = () => {
//     navigator.clipboard.readText()
//       .then(text => setPrivateKey(text))
//       .catch(err => console.error('Failed to read clipboard contents: ', err));
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPrivateKey(event.target.result);
//     };
//     reader.readAsText(file);
//   };
// console.log(decryptedData)
// console.log(responseData)
//   return (
//     <div>
//       <div>
//         {showPrivateKeyInput && (
//           <div>
//             <label>
//               Private Key:
//               <input type="text" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
//             </label>
//             <button onClick={handleImportFromClipboard}>Import from Clipboard</button>
//             <input type="file" onChange={handleFileUpload} />
//           </div>
//         )}
//       </div>
//       <form onSubmit={handleSubmit}>
//         {!showPrivateKeyInput && (
//           <div>
//             <label>
//               User ID:
//               <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} />
//             </label>
//             <button type="submit">Submit</button>
//           </div>
//         )}
//       </form>
//       {verificationStatus === 'verified' && responseData && (
//         <div>
//           {/* Вывод ответа */}
//           <button onClick={handleDecryptAll}>Decrypt All Fields</button>
//           {decryptedData.map((decryptedItem, index) => (
//             <div key={index}>
//               <h3>Decrypted Data for UserID: {index + 1}</h3>
//               <ul>
//                 {Object.entries(decryptedItem).map(([field, value]) => (
//                   <li key={field}>
//                     {field}: {value}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       )}
//       {verificationStatus === 'error' && <p>Incorrect username or password.</p>}
//     </div>
//   );
// };

// export default MyForm;


// import React, { useState } from 'react';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  // Подключение модуля RSAEncryption

// const MyForm = () => {
//   const [userid, setUserid] = useState('');
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedMessages, setDecryptedMessages] = useState([]);
//   const [privateKey, setPrivateKey] = useState('');
//   const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false);

//   const { decryptRSA } = RSAEncryption();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formData = new FormData();
//     formData.append('userid', userid);
   
//     try {
//       const response = await fetch('https://script.google.com/macros/s/AKfycbzGK2Zf0KmGKmBOFO92OavONViWNl7qqTPP7NEWPLNpf_r-5mOYFnFN2r8xpbbpSlas/exec', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//           setShowPrivateKeyInput(true); // Показываем поле ввода для приватного ключа после успешной верификации
//         } else {
//           setVerificationStatus('error');
//           setResponseData([]);
//           setShowPrivateKeyInput(false);
//         }
       
//       } else {
//         console.error('Error:', data.message);
//         setVerificationStatus('error');
//         setShowPrivateKeyInput(false);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setVerificationStatus('error');
//       setShowPrivateKeyInput(false);
//     }
//   };

//   const handleDecrypt = async (encryptedMessage) => {
//     const decryptedText = await decryptRSA(privateKey, encryptedMessage); // Расшифровка с использованием введенного приватного ключа
//     console.log('Расшифрованный текст:', decryptedText);
//     return decryptedText; // Возвращаем расшифрованный текст
//   };

//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const encryptedMessage = item.FirstName1 + item.FirstName2; // Соединение FirstName1 и FirstName2
//       return await handleDecrypt(encryptedMessage);
//     }));
//     setDecryptedMessages(decrypted);
//   };

//   const handleImportFromClipboard = () => {
//     navigator.clipboard.readText()
//       .then(text => setPrivateKey(text))
//       .catch(err => console.error('Failed to read clipboard contents: ', err));
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPrivateKey(event.target.result);
//     };
//     reader.readAsText(file);
//   };

//   return (
//     <div>
//       <div>
//         {showPrivateKeyInput && (
//           <div>
//             <label>
//               Private Key:
//               <input  type="hidden"  value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
//             </label>
//             <button onClick={handleImportFromClipboard}>Import from Clipboard</button>
//             <input type="file" onChange={handleFileUpload} />
//           </div>
//         )}
//       </div>
//       <form onSubmit={handleSubmit}>
//         {!showPrivateKeyInput && (
//           <div>
//             <label>
//               User ID:
//               <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} />
//             </label>
//             <button type="submit">Submit</button>
//           </div>
//         )}
//       </form>
//       {verificationStatus === 'verified' && responseData && (
//         <div>
//           {/* Вывод ответа */}
//           {responseData.map((item, index) => (
//             <div key={index}>
//               <p>{item.FirstName1}</p>
//               <p>{item.FirstName2}</p>
//               <button onClick={handleDecryptAll}>Decrypt</button>
//               {decryptedMessages[index] && <p>Decrypted Message: {decryptedMessages[index]}</p>}
//             </div>
//           ))}
//         </div>
//       )}
//       {verificationStatus === 'error' && <p>Incorrect username or password.</p>}
//     </div>
//   );
// };

// export default MyForm;

// import React, { useState } from 'react';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  // Подключение модуля RSAEncryption

// const MyForm = () => {
//   const [userid, setUserid] = useState('');
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedMessages, setDecryptedMessages] = useState([]);
//   const [privateKey, setPrivateKey] = useState('');

//   const { decryptRSA } = RSAEncryption();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formData = new FormData();
//     formData.append('userid', userid);
   
//     try {
//       const response = await fetch('https://script.google.com/macros/s/AKfycbzGK2Zf0KmGKmBOFO92OavONViWNl7qqTPP7NEWPLNpf_r-5mOYFnFN2r8xpbbpSlas/exec', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//         } else {
//           setVerificationStatus('error');
//           setResponseData([]);
//         }
       
//       } else {
//         console.error('Error:', data.message);
//         setVerificationStatus('error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setVerificationStatus('error');
//     }
//   };

//   const handleDecrypt = async (encryptedMessage) => {
//     const decryptedText = await decryptRSA(privateKey, encryptedMessage); // Расшифровка с использованием введенного приватного ключа
//     console.log('Расшифрованный текст:', decryptedText);
//     return decryptedText; // Возвращаем расшифрованный текст
//   };

//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const encryptedMessage = item.FirstName1 + item.FirstName2; // Соединение FirstName1 и FirstName2
//       return await handleDecrypt(encryptedMessage);
//     }));
//     setDecryptedMessages(decrypted);
//   };

//   const handleImportFromClipboard = () => {
//     navigator.clipboard.readText()
//       .then(text => setPrivateKey(text))
//       .catch(err => console.error('Failed to read clipboard contents: ', err));
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPrivateKey(event.target.result);
//     };
//     reader.readAsText(file);
//   };

//   return (
//     <div>
//       <div>
//         <label>
//           Private Key:
//           <input type="text" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
//         </label>
//         <button onClick={handleImportFromClipboard}>Import from Clipboard</button>
//         <input type="file" onChange={handleFileUpload} />
//       </div>
//       <form onSubmit={handleSubmit}>
//         <label>
//           User ID:
//           <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//       {verificationStatus === 'verified' && responseData && (
//         <div>
//           {/* Вывод ответа */}
//           {responseData.map((item, index) => (
//             <div key={index}>
//               <p>{item.FirstName1}</p>
//               <p>{item.FirstName2}</p>
//               <button onClick={handleDecryptAll}>Decrypt</button>
//               {decryptedMessages[index] && <p>Decrypted Message: {decryptedMessages[index]}</p>}
//             </div>
//           ))}
//         </div>
//       )}
//       {verificationStatus === 'error' && <p>Incorrect username or password.</p>}
//     </div>
//   );
// };

// export default MyForm;


// import React, { useState } from 'react';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  // Подключение модуля RSAEncryption

// const MyForm = () => {
//   const [userid, setUserid] = useState('');
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedMessages, setDecryptedMessages] = useState([]);
//   const [privateKey, setPrivateKey] = useState('');

//   const { decryptRSA } = RSAEncryption();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formData = new FormData();
//     formData.append('userid', userid);
   
//     try {
//       const response = await fetch('https://script.google.com/macros/s/AKfycbzGK2Zf0KmGKmBOFO92OavONViWNl7qqTPP7NEWPLNpf_r-5mOYFnFN2r8xpbbpSlas/exec', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//         } else {
//           setVerificationStatus('error');
//           setResponseData([]);
//         }
       
//       } else {
//         console.error('Error:', data.message);
//         setVerificationStatus('error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setVerificationStatus('error');
//     }
//   };

//   const handleDecrypt = async (encryptedMessage) => {
//     const decryptedText = await decryptRSA(privateKey, encryptedMessage); // Расшифровка с использованием введенного приватного ключа
//     console.log('Расшифрованный текст:', decryptedText);
//     return decryptedText; // Возвращаем расшифрованный текст
//   };

//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const encryptedMessage = item.FirstName1 + item.FirstName2; // Соединение FirstName1 и FirstName2
//       return await handleDecrypt(encryptedMessage);
//     }));
//     setDecryptedMessages(decrypted);
//   };

//   const handleImportFromClipboard = () => {
//     navigator.clipboard.readText()
//       .then(text => setPrivateKey(text))
//       .catch(err => console.error('Failed to read clipboard contents: ', err));
//   };

//   return (
//     <div>
//       <div>
//         <label>
//           Private Key:
//           <input type="text" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
//         </label>
//         <button onClick={handleImportFromClipboard}>Import from Clipboard</button>
//       </div>
//       <form onSubmit={handleSubmit}>
//         <label>
//           User ID:
//           <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//       {verificationStatus === 'verified' && responseData && (
//         <div>
//           {/* Вывод ответа */}
//           {responseData.map((item, index) => (
//             <div key={index}>
//               <p>{item.FirstName1}</p>
//               <p>{item.FirstName2}</p>
//               <button onClick={handleDecryptAll}>Decrypt</button>
//               {decryptedMessages[index] && <p>Decrypted Message: {decryptedMessages[index]}</p>}
//             </div>
//           ))}
//         </div>
//       )}
//       {verificationStatus === 'error' && <p>Incorrect username or password.</p>}
//     </div>
//   );
// };

// export default MyForm;


// import React, { useState } from 'react';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  // Подключение модуля RSAEncryption

// const MyForm = () => {
//   const [userid, setUserid] = useState('');
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedMessages, setDecryptedMessages] = useState([]);
//   const [privateKey, setPrivateKey] = useState('');

//   const { decryptRSA } = RSAEncryption();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formData = new FormData();
//     formData.append('userid', userid);
   
//     try {
//       const response = await fetch('https://script.google.com/macros/s/AKfycbzGK2Zf0KmGKmBOFO92OavONViWNl7qqTPP7NEWPLNpf_r-5mOYFnFN2r8xpbbpSlas/exec', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//         } else {
//           setVerificationStatus('error');
//           setResponseData([]);
//         }
       
//       } else {
//         console.error('Error:', data.message);
//         setVerificationStatus('error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setVerificationStatus('error');
//     }
//   };

//   const handleDecrypt = async (encryptedMessage) => {
//     const decryptedText = await decryptRSA(privateKey, encryptedMessage); // Расшифровка с использованием введенного приватного ключа
//     console.log('Расшифрованный текст:', decryptedText);
//     return decryptedText; // Возвращаем расшифрованный текст
//   };

//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const encryptedMessage = item.FirstName1 + item.FirstName2; // Соединение FirstName1 и FirstName2
//       return await handleDecrypt(encryptedMessage);
//     }));
//     setDecryptedMessages(decrypted);
//   };

//   return (
//     <div>
//       <div>
//         <label>
//           Private Key:
//           <input type="text" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
//         </label>
//       </div>
//       <form onSubmit={handleSubmit}>
//         <label>
//           User ID:
//           <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//       {verificationStatus === 'verified' && responseData && (
//         <div>
//           {/* Вывод ответа */}
//           {responseData.map((item, index) => (
//             <div key={index}>
//               <p>{item.FirstName1}</p>
//               <p>{item.FirstName2}</p>
//               <button onClick={handleDecryptAll}>Decrypt</button>
//               {decryptedMessages[index] && <p>Decrypted Message: {decryptedMessages[index]}</p>}
//             </div>
//           ))}
//         </div>
//       )}
//       {verificationStatus === 'error' && <p>Incorrect username or password.</p>}
//     </div>
//   );
// };

// export default MyForm;



// import React, { useState } from 'react';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  // Подключение модуля RSAEncryption

// const MyForm = () => {
//   const [userid, setUserid] = useState('');
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedMessages, setDecryptedMessages] = useState([]);

//   const { decryptRSA } = RSAEncryption();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formData = new FormData();
//     formData.append('userid', userid);
   
//     try {
//       const response = await fetch('https://script.google.com/macros/s/AKfycbzGK2Zf0KmGKmBOFO92OavONViWNl7qqTPP7NEWPLNpf_r-5mOYFnFN2r8xpbbpSlas/exec', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !== "Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//         } else {
//           setVerificationStatus('error');
//           setResponseData([]);
//         }
       
//       } else {
//         console.error('Error:', data.message);
//         setVerificationStatus('error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setVerificationStatus('error');
//     }
//   };

//   const handleDecrypt = async (encryptedMessage) => {
//     const privateKeyText = 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCqtsLSNVD8b4ioGA2YBhu/qWFStugA+A3Pkch0qshLQVrWHL2dzSceEEB5q2ESGVqrpRhoVygG0yBEqLXxx9qS6bSExEzMfNmzDQh6BnJEMRCY6yW0wLMnuE3vr9czUj+DH7V/eXuHqcp+X0XdarM6HAgwW+mZQMIR+b74Khwm1m7SQ84On7F/QPzeXP0ZtOAYLHK60tz+YhhSDEe7nBCmPvkkvVg4Mk07nCXo4EmjrK5RYXgUJMFpV/lyb7AgOYS9mjwFZIquNNZp8bMzusgBhWlJNaY3wjEl347Fs9PN0h4ZF7dGJdxNmDSR3TchgAD7CETUDg2g4Ur7emegofn3AgMBAAECggEAAfjo6PnRt4uTAMd/sgpxW/ZZLVX3Tzo5Gp/8uLsCY7rbvE6KXZ4xqKttEJrLcnnq2MHTCt2QP6fvyatIqC70FloZ36YkRwEy7gUlXGziTr8MXzU+8xwo1bl6OQiHNsy+oXAGg58D2i461y6YRYsb3/zT7A8byff8EK4Z0o8rUm2HR+QkScNeopUmc+d0ZJbp/UdiCvK0xXvCfAIn+8JWSt/vih+wJoy11G0zYwG5Va4CdQ/LLd1Row7pU4vwXwZ3ji73GT49go21YdzxIOVFCRXwzQrgrpIL6YDO/MmsiXHsiJRzuhMkVF9tgWh3gTBazr8msP3U3vYnGa0y9LnegQKBgQDkKlfluZK1xUZ6+CamlrvXeSqzp4FUoybphkayQnKWFZxp7OjE1Ci3cgJcBjoi2wZHwHKM4XehRJ/1qTX4jofYGc13cNvLdLBWKqg/mAiX6m8Q8q1QZCIGoYENsCI4XeZD2e7PPXHaSFNmkuNwCtdvx9hzxjZpBXQBesdTsNgrdwKBgQC/ijHVixgBi/TcRFlJl6mNiv0+CKP0mQl+GmO0uFXPIbdwJh2gNvKiiGSZv4/HE7R/j8ccOcbu/bU8fR54o0YS+kpyWdCtX/zGRD+0sQfrj4Qnbno6ZsrF28AbOfkRygnzbx5vJzus+5opDrTybPqAfGZigK1B836fRPrEZStFgQKBgA/2amnW/s2avKCTxdh3yTJ89qDVAjZSp8FEtKN6BJw9bND4UxyaHzMeVc3sXZrcqebRLvJuP7lXnL1KFk2KYzSaMYa+rZHhWwjcOSMh1tASBa0w3TE3oC3IlMfJX8uDvj1W/N8g1FtKHhOaCTFogMQAPkNzRZE5YXFNDq7rO2RnAoGAE9X48Td1ZfubgRAm+wMU0Q66ySjV6efLXt7WwolwgYHpYFjiKoxmNkTPvkhjWGeHAsreAONO4cMueLQwaqfmAuMewJbikIHnSJUaz9ihjFiRhA/h4phwmWr3ixpG2/vDag1w5mv2tyRbQ7M9M/nrO1EmvT68Mp9H1rCrE5mykIECgYBlq3xc1iJznCidxL0VTnT0I65YJoR1gUIIPrfyDhEjhFEcFDFqhv3mvhUgHHZiVTTbbnix16uedDYVM0BoXYBtvGF7oDaAVmnJAbfR88pCKnZYiub6MrLrF0WrcNsrmXfVaKGDuSR0GampYrtYQyIpRmUD5PF2I/SCPVNcKeLWWQ=='; // Здесь должен быть ваш приватный ключ в формате base64
//     const decryptedText = await decryptRSA(privateKeyText, encryptedMessage); // Расшифровка
//     console.log('Расшифрованный текст:', decryptedText);
//     return decryptedText; // Возвращаем расшифрованный текст
//   };

//   const handleDecryptAll = async () => {
//     const decrypted = await Promise.all(responseData.map(async (item) => {
//       const encryptedMessage = item.FirstName1 + item.FirstName2; // Соединение FirstName1 и FirstName2
//       return await handleDecrypt(encryptedMessage);
//     }));
//     setDecryptedMessages(decrypted);
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <label>
//           User ID:
//           <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//       {verificationStatus === 'verified' && responseData && (
//         <div>
//           {/* Вывод ответа */}
//           {responseData.map((item, index) => (
//             <div key={index}>
//               <p>{item.FirstName1}</p>
//               <p>{item.FirstName2}</p>
//               <button onClick={() => handleDecryptAll(index)}>Decrypt</button>
//               {decryptedMessages[index] && <p>Decrypted Message: {decryptedMessages[index]}</p>}
//             </div>
//           ))}
//         </div>
//       )}
//       {verificationStatus === 'error' && <p>Incorrect username or password.</p>}
//     </div>
//   );
// };

// export default MyForm;


// import React, { useState } from 'react';
// import RSAEncryption from '../rsacomponent/RSAEncryption';  // Подключение модуля RSAEncryption

// const MyForm = () => {
//   const [userid, setUserid] = useState('');
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);
//   const [decryptedMessage, setDecryptedMessage] = useState('');
//   const { decryptRSA } = RSAEncryption();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formData = new FormData();
//     formData.append('userid', userid);
   
//     try {
//       const response = await fetch('https://script.google.com/macros/s/AKfycbzGK2Zf0KmGKmBOFO92OavONViWNl7qqTPP7NEWPLNpf_r-5mOYFnFN2r8xpbbpSlas/exec', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !=="Incorrect username or password.") {
//           setVerificationStatus('verified');
//           setResponseData(data);
//         } else {
//           setVerificationStatus('error');
//           setResponseData([]);
//         }
       
//       } else {
//         console.error('Error:', data.message);
//         setVerificationStatus('error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setVerificationStatus('error');
//     }
//   };
// console.log(responseData)
//   const handleDecrypt = async () => {
//     const privateKeyText = 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCqtsLSNVD8b4ioGA2YBhu/qWFStugA+A3Pkch0qshLQVrWHL2dzSceEEB5q2ESGVqrpRhoVygG0yBEqLXxx9qS6bSExEzMfNmzDQh6BnJEMRCY6yW0wLMnuE3vr9czUj+DH7V/eXuHqcp+X0XdarM6HAgwW+mZQMIR+b74Khwm1m7SQ84On7F/QPzeXP0ZtOAYLHK60tz+YhhSDEe7nBCmPvkkvVg4Mk07nCXo4EmjrK5RYXgUJMFpV/lyb7AgOYS9mjwFZIquNNZp8bMzusgBhWlJNaY3wjEl347Fs9PN0h4ZF7dGJdxNmDSR3TchgAD7CETUDg2g4Ur7emegofn3AgMBAAECggEAAfjo6PnRt4uTAMd/sgpxW/ZZLVX3Tzo5Gp/8uLsCY7rbvE6KXZ4xqKttEJrLcnnq2MHTCt2QP6fvyatIqC70FloZ36YkRwEy7gUlXGziTr8MXzU+8xwo1bl6OQiHNsy+oXAGg58D2i461y6YRYsb3/zT7A8byff8EK4Z0o8rUm2HR+QkScNeopUmc+d0ZJbp/UdiCvK0xXvCfAIn+8JWSt/vih+wJoy11G0zYwG5Va4CdQ/LLd1Row7pU4vwXwZ3ji73GT49go21YdzxIOVFCRXwzQrgrpIL6YDO/MmsiXHsiJRzuhMkVF9tgWh3gTBazr8msP3U3vYnGa0y9LnegQKBgQDkKlfluZK1xUZ6+CamlrvXeSqzp4FUoybphkayQnKWFZxp7OjE1Ci3cgJcBjoi2wZHwHKM4XehRJ/1qTX4jofYGc13cNvLdLBWKqg/mAiX6m8Q8q1QZCIGoYENsCI4XeZD2e7PPXHaSFNmkuNwCtdvx9hzxjZpBXQBesdTsNgrdwKBgQC/ijHVixgBi/TcRFlJl6mNiv0+CKP0mQl+GmO0uFXPIbdwJh2gNvKiiGSZv4/HE7R/j8ccOcbu/bU8fR54o0YS+kpyWdCtX/zGRD+0sQfrj4Qnbno6ZsrF28AbOfkRygnzbx5vJzus+5opDrTybPqAfGZigK1B836fRPrEZStFgQKBgA/2amnW/s2avKCTxdh3yTJ89qDVAjZSp8FEtKN6BJw9bND4UxyaHzMeVc3sXZrcqebRLvJuP7lXnL1KFk2KYzSaMYa+rZHhWwjcOSMh1tASBa0w3TE3oC3IlMfJX8uDvj1W/N8g1FtKHhOaCTFogMQAPkNzRZE5YXFNDq7rO2RnAoGAE9X48Td1ZfubgRAm+wMU0Q66ySjV6efLXt7WwolwgYHpYFjiKoxmNkTPvkhjWGeHAsreAONO4cMueLQwaqfmAuMewJbikIHnSJUaz9ihjFiRhA/h4phwmWr3ixpG2/vDag1w5mv2tyRbQ7M9M/nrO1EmvT68Mp9H1rCrE5mykIECgYBlq3xc1iJznCidxL0VTnT0I65YJoR1gUIIPrfyDhEjhFEcFDFqhv3mvhUgHHZiVTTbbnix16uedDYVM0BoXYBtvGF7oDaAVmnJAbfR88pCKnZYiub6MrLrF0WrcNsrmXfVaKGDuSR0GampYrtYQyIpRmUD5PF2I/SCPVNcKeLWWQ=='; // Здесь должен быть ваш приватный ключ в формате base64
//     console.log(responseData.FirstName1)
//     console.log(responseData.FirstName2)
//     const encryptedMessage = responseData.FirstName1 + responseData.FirstName2; // Соединение FirstName1 и FirstName2
//     const decryptedText = await decryptRSA(privateKeyText, encryptedMessage); // Расшифровка
//     console.log('Расшифрованный текст:', decryptedText);
//     setDecryptedMessage(decryptedText); // Установка расшифрованного сообщения в состояние
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <label>
//           User ID:
//           <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//       {verificationStatus === 'verified' && responseData && (
//         <div>
//           {/* Вывод ответа */}
//           <p>{responseData.FirstName1}</p>
//           <p>{responseData.FirstName2}</p>
//           <button onClick={handleDecrypt}>Decrypt</button> {/* Кнопка для расшифровки */}
//         </div>
//       )}
//       {verificationStatus === 'error' && <p>Incorrect username or password.</p>}
//       {decryptedMessage && <p>Decrypted Message: {decryptedMessage}</p>} {/* Отображение расшифрованного сообщения */}
//     </div>
//   );
// };

// export default MyForm;


// import React, { useState } from 'react';

// const MyForm = () => {
//   const [userid, setUserid] = useState('');
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const [responseData, setResponseData] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
  

//      const formData = new FormData();
//      formData.append('userid', userid);
   
//     try {
//       const response = await fetch('https://script.google.com/macros/s/AKfycbzGK2Zf0KmGKmBOFO92OavONViWNl7qqTPP7NEWPLNpf_r-5mOYFnFN2r8xpbbpSlas/exec', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         if (data !=="Incorrect username or password."){
//         setVerificationStatus('verified');
//         setResponseData(data);}
//         else{
//           setVerificationStatus('error');
//           setResponseData([]);
//         }
       
//       } else {
//         console.error('Error:', data.message);
//         setVerificationStatus('error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setVerificationStatus('error');
//     }
//   };
//   console.log(responseData)
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <label>
//           User ID:
//           <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//       {verificationStatus === 'verified' && responseData && (
//         <div>
//           {/* Вывод ответа */}
//         </div>
//       )}
//       {verificationStatus === 'error' && <p>Incorrect username or password.</p>}
//     </div>
//   );
// };

// export default MyForm;



// import React, { useState } from 'react';

// const MyForm = () => {
//   const [userid, setUserid] = useState('');
//   const [Idprice, setIdprice] = useState('');
//   const [verificationStatus, setVerificationStatus] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('userid', userid);
//     formData.append('Idprice', Idprice);

//     try {
//       const response = await fetch('https://script.google.com/macros/s/AKfycbzyNjfD_OmCFXYGq-9lt2bXzxFPpr0fOP2s_fMsZvjvpGnX18-GCdCJzZdETLpNPM9o/exec', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         console.log(data.message);
//         setVerificationStatus("verified"); // сохраняем статус верификации
//       } else {
//         console.error('Error:', data.message);
//         console.log('Response:', data);
//         setVerificationStatus('error'); // устанавливаем статус ошибки
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setVerificationStatus('error'); // устанавливаем статус ошибки
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <label>
//           User ID:
//           <input type="text" name="userid" value={userid} onChange={(e) => setUserid(e.target.value)} />
//           <input type="text" name="Idprice" value={Idprice} onChange={(e) => setIdprice(e.target.value)} />
//           <input type="text" name="fromDate" />
//           <input type="text" name="toDate"  />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//       {verificationStatus === 'verified' && <p>User ID verified successfully!</p>}
//       {verificationStatus === 'error' && <p>Incorrect username or password.</p>}
//     </div>
//   );
// };

// export default MyForm;


// import React, { useState } from 'react';

// const MyForm = () => {
//   const [userid, setUserid] = useState('');
//   const [response, setResponse] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const response = await fetch('https://script.google.com/macros/s/AKfycby6HgGRtbZJOlwHqLteYEkiqhMzv7aSgzQh8JlzzDxRQWxmBddjRX5xIXpxLpyKrbjc/exec', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: userid
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Response:', data);
//         setResponse(data); // сохраняем ответ в state
//       } else {
//         console.error('Error:', data.message);
//         setResponse('Incorrect username or password'); // сообщение об ошибке
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setResponse('An error occurred. Please try again.'); // сообщение об ошибке
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <label>
//           User ID:
//           <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//       {response && <p>{response}</p>}
//     </div>
//   );
// };

// export default MyForm;
