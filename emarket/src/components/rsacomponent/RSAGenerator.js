import React, { useState } from 'react';

const logChunks = (label, data) => {
  const chunks = [];
  for (let i = 0; i < data.length; i += 256) {
    chunks.push(data.substring(i, i + 256));
  }
  return chunks;
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(   
    () => alert('Copied to clipboard successfully!'),
    (err) => alert('⚠️Failed to copy to clipboard:', err)
  );
};

const saveToFile = (filename, content) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};


const encryptPrivateKey = async (privateKeyBase64, password) => {
  const enc = new TextEncoder();
  
  // Hash the password using SHA-256 to get a fixed-size key
  const passwordHash = await crypto.subtle.digest('SHA-256', enc.encode(password));
  
  // Import the hashed password as a key
  const key = await crypto.subtle.importKey(
    'raw',
    passwordHash,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  // Derive IV from the password hash (first 12 bytes)
  const iv = new Uint8Array(passwordHash).slice(0, 12);

  // Encrypt the private key
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    enc.encode(privateKeyBase64)
  );

  // Encode the encrypted data to base64
  const encryptedBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
 
  return encryptedBase64;
};

const RSAGenerator = () => {
  const [publicKeyChunks, setPublicKeyChunks] = useState([]);
  const [privateKey, setPrivateKey] = useState(null);
  const [encryptEnabled, setEncryptEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState(null);

  const generateKeys = async () => {
    try {
      const keys = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: { name: 'SHA-256' }
        },
        true,
        ['encrypt', 'decrypt']
      );

      const exportedPublicKey = await crypto.subtle.exportKey('spki', keys.publicKey);
      const exportedPrivateKey = await crypto.subtle.exportKey('pkcs8', keys.privateKey);

      const publicKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPublicKey)));
      const privateKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPrivateKey)));

      setPublicKeyChunks(logChunks('Public Key:', publicKeyBase64));
      setPrivateKey(privateKeyBase64);
    } catch (error) {
      console.error('Error generating keys:', error);
      alert('⚠️Error generating keys::', error)
    }
  };

  const handleEncryptPrivateKey = async () => {
    if (password === confirmPassword) {
      const encryptedKey = await encryptPrivateKey(privateKey, password);
      setEncryptedPrivateKey(encryptedKey);
    } else {
      console.error('Passwords do not match');
      alert('⚠️Passwords do not match')
    }
  };

  const handleTextareaChange = (event) => {
    setPrivateKey(event.target.value);
  };

  return (
    <div>
      <button className='selected' onClick={generateKeys}>RSA Key Pair Generator</button>

      {publicKeyChunks.length > 0 && (
        <div>
          <h3>Public Key Chunks:</h3>
          {publicKeyChunks.map((chunk, index) => (
            <div key={index}>
              <div className="filters">
                <button className='selected' onClick={() => copyToClipboard(chunk)}>Copy Public Key {index + 1}</button>
              </div>
              <div className="filters">
                <textarea className='form-input' value={chunk} readOnly rows={7} cols={40} />
              </div>
            </div>
          ))}
        </div>
      )}

      {privateKey && (
        <div>
          <h3>Private Key:</h3>
          <div className="filters">
            <button className='selected' onClick={() => copyToClipboard(privateKey)}>Copy Private Key</button>
            <button className='selected' onClick={() => saveToFile('privateKey.txt', privateKey)}>Save Private Key to File</button>
          </div>
          <div className="filters">
            <textarea className='form-input' defaultValue={privateKey} onChange={handleTextareaChange} rows={8} cols={40} />
          </div>
        </div>
      )} 

      {privateKey && (
        <div>
          <h3>Encrypt Private Key:</h3>
          <div className="filters">
            <label>
              <input
                type="checkbox"
                checked={encryptEnabled}
                onChange={() => setEncryptEnabled(!encryptEnabled)}
              /> Enable Encryption
            </label>
          </div>

          {encryptEnabled && (
            <div>
              <div className="filters">
                <input
                  className='form-input' autoFocus
                  type="password"
                  minLength={3}
                  maxLength={42}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="filters">
                <input
                  className='form-input'
                  type="password"
                  minLength={3}
                  maxLength={42}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="filters">
                <button className={confirmPassword!=="" && password === confirmPassword ?'selected':""}
                  onClick={handleEncryptPrivateKey}
                  disabled={confirmPassword!=="" && password !== confirmPassword}
                >
                  Encrypt Private Key
                </button>
              </div>
              {encryptedPrivateKey && (
                <div>
                  <h4>Encrypted Private Key:</h4>
                  <div className="filters">
                    <button className='selected' onClick={() => copyToClipboard(encryptedPrivateKey)}>Copy Encrypted Private Key</button>
                    <button className='selected' onClick={() => saveToFile('encryptedPrivateKey.txt', encryptedPrivateKey)}>Save Encrypted Private Key to File</button>
                  </div>
                  <div className="filters">                   
                    <textarea className='form-input' value={encryptedPrivateKey} readOnly rows={8} cols={40} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}     
    </div>
  );
};

export default RSAGenerator;