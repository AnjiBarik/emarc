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

 
  const convertToUTC = (date) => {
    const utcDate = new Date(date);
    return utcDate.toISOString();
  };

  // const convertToUTC = (dateString) => {
  //   const date = new Date(dateString);
  //   return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString();
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);

    const formData = new FormData();
    formData.append('userid', userid);
    formData.append('idprice', idprice);
    
    if (startDate) { 
      console.log((startDate))
      console.log(convertToUTC(startDate))
      formData.append('startdate', convertToUTC(startDate));
    }
    if (endDate) { 
      console.log((endDate))
      console.log(convertToUTC(endDate))
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
