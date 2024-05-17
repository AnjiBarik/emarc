import React, { useState } from 'react';

const logChunks = (label, data) => {
  const chunks = [];
  for (let i = 0; i < data.length; i += 256) {
    chunks.push(data.substring(i, i + 256));
  }

  chunks.forEach((chunk, index) => {
    console.log(`${label} Chunk ${index + 1}:`, chunk);
  });
};

const RSAGenerator = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);

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

      setPublicKey(publicKeyBase64);
      setPrivateKey(privateKeyBase64);

      logChunks('Public Key:', publicKeyBase64);
      logChunks('Private Key:', privateKeyBase64);
      console.log('Public Key:', publicKeyBase64);
      console.log('Private Key:', privateKeyBase64);
    } catch (error) {
      console.error('Error generating keys:', error);
    }
  };

  return (
    <div>
      <button onClick={generateKeys}>RSA Key Pair Generators</button>
    </div>
  );
};

export default RSAGenerator;


// import React, { useState } from 'react';

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

//       console.log('Public Key:', publicKeyBase64);
//       console.log(publicKeyBase64.length)
//       console.log('Private Key:', privateKeyBase64);
//     } catch (error) {
//       console.error('Error generating keys:', error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={generateKeys}>Сгенерировать</button>
//     </div>
//   );
// };

// export default RSAGenerator;



// import React, { useState } from 'react';

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

//       setPublicKey(new TextDecoder().decode(exportedPublicKey));
//       setPrivateKey(new TextDecoder().decode(exportedPrivateKey));

//       console.log('Public Key:', publicKey);
//       console.log(atob(publicKey))
//       console.log('Private Key:', privateKey);
//     } catch (error) {
//       console.error('Error generating keys:', error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={generateKeys}>Сгенерировать</button>
//     </div>
//   );
// };

// export default RSAGenerator;
