import React, { useState } from 'react';
import DecryptPrivateKey from './DecryptPrivateKey'; 

const logChunks = (label, data) => {
  const chunks = [];
  for (let i = 0; i < data.length; i += 256) {
    chunks.push(data.substring(i, i + 256));
  }
  return chunks;
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(
    () => console.log('Copied to clipboard successfully!'),
    (err) => console.error('Failed to copy to clipboard:', err)
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
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    new TextEncoder().encode(privateKeyBase64)
  );

  const encryptedBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
  const ivBase64 = btoa(String.fromCharCode.apply(null, iv));
  const saltBase64 = btoa(String.fromCharCode.apply(null, salt));

  return `${saltBase64}:${ivBase64}:${encryptedBase64}`;
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
    }
  };

  const handleEncryptPrivateKey = async () => {
    if (password === confirmPassword) {
      const encryptedKey = await encryptPrivateKey(privateKey, password);
      setEncryptedPrivateKey(encryptedKey);
    } else {
      console.error('Passwords do not match');
    }
  };

  return (
    <div>
      <button onClick={generateKeys}>RSA Key Pair Generator</button>

      {publicKeyChunks.length > 0 && (
        <div>
          <h3>Public Key Chunks:</h3>
          {publicKeyChunks.map((chunk, index) => (
            <div key={index}>
              <div className="filters">
                <button onClick={() => copyToClipboard(chunk)}>Copy Public Key {index + 1}</button>
              </div>
              <div className="filters">
                <textarea value={chunk} readOnly rows={7} cols={40} />
              </div>
            </div>
          ))}
        </div>
      )}

      {privateKey && (
        <div>
          <h3>Private Key:</h3>
          <div className="filters">
            <button onClick={() => copyToClipboard(privateKey)}>Copy Private Key</button>
            <button onClick={() => saveToFile('privateKey.txt', privateKey)}>Save Private Key to File</button>
          </div>
          <div className="filters">
            <textarea defaultValue={privateKey}  rows={8} cols={40} />
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
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="filters">
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="filters">
                <button
                  onClick={handleEncryptPrivateKey}
                  disabled={password !== confirmPassword}
                >
                  Encrypt Private Key
                </button>
              </div>
              {encryptedPrivateKey && (
                <div>
                  <h4>Encrypted Private Key:</h4>
                  <div className="filters">
                    <button onClick={() => copyToClipboard(encryptedPrivateKey)}>Copy Encrypted Private Key</button>
                    <button onClick={() => saveToFile('encryptedPrivateKey.txt', encryptedPrivateKey)}>Save Encrypted Private Key to File</button>
                  </div>
                  <div className="filters">
                    {/* <textarea value={encryptedPrivateKey} readOnly rows={8} cols={40} /> */}
                    <textarea value={encryptedPrivateKey} readOnly rows={8} cols={40} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {encryptedPrivateKey && (
        <div>
          <h3>Decrypt Private Key:</h3>
          <DecryptPrivateKey encryptedKey={encryptedPrivateKey} />
        </div>
      )}
    </div>
  );
};

export default RSAGenerator;


// import React, { useState } from 'react';

// const logChunks = (label, data) => {
//   const chunks = [];
//   for (let i = 0; i < data.length; i += 256) {
//     chunks.push(data.substring(i, i + 256));
//   }
//   return chunks;
// };

// const copyToClipboard = (text) => {
//   navigator.clipboard.writeText(text).then(
//     () => console.log('Copied to clipboard successfully!'),
//     (err) => console.error('Failed to copy to clipboard:', err)
//   );
// };

// const saveToFile = (filename, content) => {
//   const blob = new Blob([content], { type: 'text/plain' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = filename;
//   link.click();
// };

// const encryptPrivateKey = async (privateKeyBase64, password) => {
//   const enc = new TextEncoder();
//   const keyMaterial = await crypto.subtle.importKey(
//     'raw',
//     enc.encode(password),
//     'PBKDF2',
//     false,
//     ['deriveKey']
//   );

//   const salt = crypto.getRandomValues(new Uint8Array(16));
//   const key = await crypto.subtle.deriveKey(
//     {
//       name: 'PBKDF2',
//       salt: salt,
//       iterations: 100000,
//       hash: 'SHA-256'
//     },
//     keyMaterial,
//     { name: 'AES-GCM', length: 256 },
//     false,
//     ['encrypt']
//   );

//   const iv = crypto.getRandomValues(new Uint8Array(12));
//   const encrypted = await crypto.subtle.encrypt(
//     {
//       name: 'AES-GCM',
//       iv: iv
//     },
//     key,
//     new TextEncoder().encode(privateKeyBase64)
//   );

//   const encryptedBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
//   const ivBase64 = btoa(String.fromCharCode.apply(null, iv));
//   const saltBase64 = btoa(String.fromCharCode.apply(null, salt));

//   return `${saltBase64}:${ivBase64}:${encryptedBase64}`;
// };

// const RSAGenerator = () => {
//   const [publicKeyChunks, setPublicKeyChunks] = useState([]);
//   const [privateKey, setPrivateKey] = useState(null);
//   const [encryptEnabled, setEncryptEnabled] = useState(false);
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [encryptedPrivateKey, setEncryptedPrivateKey] = useState(null);

//   const generateKeys = async () => {
//     try {
//       const keys = await crypto.subtle.generateKey(
//         {
//           name: 'RSA-OAEP',
//           modulusLength: 2048,
//           publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
//           hash: { name: 'SHA-256' }
//         },
//         true,
//         ['encrypt', 'decrypt']
//       );

//       const exportedPublicKey = await crypto.subtle.exportKey('spki', keys.publicKey);
//       const exportedPrivateKey = await crypto.subtle.exportKey('pkcs8', keys.privateKey);

//       const publicKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPublicKey)));
//       const privateKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPrivateKey)));

//       setPublicKeyChunks(logChunks('Public Key:', publicKeyBase64));
//       setPrivateKey(privateKeyBase64);
//     } catch (error) {
//       console.error('Error generating keys:', error);
//     }
//   };

//   const handleEncryptPrivateKey = async () => {
//     if (password === confirmPassword) {
//       const encryptedKey = await encryptPrivateKey(privateKey, password);
//       setEncryptedPrivateKey(encryptedKey);
//     } else {
//       console.error('Passwords do not match');
//     }
//   };

//   return (
//     <div>
//       <button onClick={generateKeys}>RSA Key Pair Generator</button>

//       {publicKeyChunks.length > 0 && (
//         <div>
//           <h3>Public Key Chunks:</h3>
//           {publicKeyChunks.map((chunk, index) => (
//             <div key={index}>
//               <div className="filters"><button onClick={() => copyToClipboard(chunk)}>Copy Public Key {index + 1}</button></div>
//               <div className="filters"><textarea value={chunk} readOnly rows={7} cols={40} /></div>
//             </div>
//           ))}
//         </div>
//       )}

//       {privateKey && (
//         <div>
//           <h3>Private Key:</h3>
//           <div className="filters">
//             <button onClick={() => copyToClipboard(privateKey)}>Copy Private Key</button>
//             <button onClick={() => saveToFile('privateKey.txt', privateKey)}>Save Private Key to File</button>
//           </div>
//           <div className="filters"><textarea value={privateKey} readOnly rows={8} cols={40} /></div>
//         </div>
//       )}

//       {privateKey && (
//         <div>
//           <h3>Encrypt Private Key:</h3>
//           <div className="filters">
//             <label>
//               <input
//                 type="checkbox"
//                 checked={encryptEnabled}
//                 onChange={() => setEncryptEnabled(!encryptEnabled)}
//               /> Enable Encryption
//             </label>
//           </div>

//           {encryptEnabled && (
//             <div>
//               <div className="filters">
//                 <input
//                   type="password"
//                   placeholder="Enter password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//               <div className="filters">
//                 <input
//                   type="password"
//                   placeholder="Confirm password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//               </div>
//               <div className="filters">
//                 <button
//                   onClick={handleEncryptPrivateKey}
//                   disabled={password !== confirmPassword}
//                 >
//                   Encrypt Private Key
//                 </button>
//               </div>
//               {encryptedPrivateKey && (
//                 <div>
//                   <h4>Encrypted Private Key:</h4>
//                   <div className="filters"><textarea value={encryptedPrivateKey} readOnly rows={8} cols={40} /></div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RSAGenerator;


//!Basical version
// import React, { useState } from 'react';

// const logChunks = (label, data) => {
//   const chunks = [];
//   for (let i = 0; i < data.length; i += 256) {
//     chunks.push(data.substring(i, i + 256));
//   }
//   return chunks;
// };

// const copyToClipboard = (text) => {
//   navigator.clipboard.writeText(text).then(
//     () => console.log('Copied to clipboard successfully!'),
//     (err) => console.error('Failed to copy to clipboard:', err)
//   );
// };

// const saveToFile = (filename, content) => {
//   const blob = new Blob([content], { type: 'text/plain' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = filename;
//   link.click();
// };

// const RSAGenerator = () => {
//   const [publicKeyChunks, setPublicKeyChunks] = useState([]);
//   const [privateKey, setPrivateKey] = useState(null);

//   const generateKeys = async () => {
//     try {
//       const keys = await crypto.subtle.generateKey(
//         {
//           name: 'RSA-OAEP',
//           modulusLength: 2048,
//           publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
//           hash: { name: 'SHA-256' }
//         },
//         true,
//         ['encrypt', 'decrypt']
//       );

//       const exportedPublicKey = await crypto.subtle.exportKey('spki', keys.publicKey);
//       const exportedPrivateKey = await crypto.subtle.exportKey('pkcs8', keys.privateKey);

//       const publicKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPublicKey)));
//       const privateKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPrivateKey)));

//       setPublicKeyChunks(logChunks('Public Key:', publicKeyBase64));
//       setPrivateKey(privateKeyBase64);
//     } catch (error) {
//       console.error('Error generating keys:', error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={generateKeys}>RSA Key Pair Generator</button>

//       {publicKeyChunks.length > 0 && (
//         <div>
//           <h3>Public Key Chunks:</h3>
//           {publicKeyChunks.map((chunk, index) => (
//             <div  key={index}>
//               <div className="filters"><button onClick={() => copyToClipboard(chunk)}>Copy publicKey {index + 1}</button></div>
//               <div className="filters"><textarea value={chunk} readOnly rows={7} cols={40} /></div>
              
//             </div>
//           ))}
//         </div>
//       )}

//       {privateKey && (
//         <div>
//           <h3>Private Key:</h3>
//           <div className="filters">
//             <button onClick={() => copyToClipboard(privateKey)}>Copy Private Key</button>
//             <button onClick={() => saveToFile('privateKey.txt', privateKey)}>Save Private Key to File</button>
//           </div>  
//           <div className="filters"><textarea value={privateKey} readOnly rows={8} cols={40} /></div>
          
//         </div>
//       )}
//     </div>
//   );
// };

// export default RSAGenerator;



// import React, { useState } from 'react';

// const logChunks = (label, data) => {
//   const chunks = [];
//   for (let i = 0; i < data.length; i += 256) {
//     chunks.push(data.substring(i, i + 256));
//   }

//   chunks.forEach((chunk, index) => {
//     console.log(`${label} Chunk ${index + 1}:`, chunk);
//   });
// };

// const RSAGenerator = () => {
//   const [publicKey, setPublicKey] = useState(null);
//   const [privateKey, setPrivateKey] = useState(null);

//   const generateKeys = async () => {
//     try {
//       const keys = await crypto.subtle.generateKey(
//         {
//           name: 'RSA-OAEP',
//           modulusLength: 2048,
//           publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
//           hash: { name: 'SHA-256' }
//         },
//         true,
//         ['encrypt', 'decrypt']
//       );

//       const exportedPublicKey = await crypto.subtle.exportKey('spki', keys.publicKey);
//       const exportedPrivateKey = await crypto.subtle.exportKey('pkcs8', keys.privateKey);

//       const publicKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPublicKey)));
//       const privateKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPrivateKey)));

//       setPublicKey(publicKeyBase64);
//       setPrivateKey(privateKeyBase64);

//       logChunks('Public Key:', publicKeyBase64);
//       logChunks('Private Key:', privateKeyBase64);
//       console.log('Public Key:', publicKeyBase64);
//       console.log('Private Key:', privateKeyBase64);
//     } catch (error) {
//       console.error('Error generating keys:', error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={generateKeys}>RSA Key Pair Generators</button>
//     </div>
//   );
// };

// export default RSAGenerator;


