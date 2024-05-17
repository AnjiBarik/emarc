// ExampleUsage.js
import React, { useState } from 'react';
import RSAUtilsExporter from './RSAUtilsExporter';
import EncryptionComponent from './EncryptionComponent';
import DecryptionComponent from './DecryptionComponent';
import { encryptRSA, decryptRSA } from './rsaUtils'

const ExampleUsage = () => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState(null);

  const handleEncryptError = (errorMessage) => {
    console.error(errorMessage);
    setError(errorMessage);
  };

  const handleDecryptError = (errorMessage) => {
    console.error(errorMessage);
    setError(errorMessage);
  };

  const handleAction = async () => {
    try {
      const encryptedData = await encryptRSA(publicKey, plaintext);
      setEncryptedText(new TextDecoder().decode(encryptedData));
      setError(null);
    } catch (error) {
      handleEncryptError('Ошибка при шифровании');
    }

    try {
      const decryptedData = await decryptRSA(privateKey, new TextEncoder().encode(encryptedText));
      setDecryptedText(decryptedData);
      setError(null);
    } catch (error) {
      handleDecryptError('Ошибка при дешифровании');
    }
  };

  return (
    <RSAUtilsExporter>
      {({ encryptRSA, decryptRSA }) => (
        <div>
          <h2>Ввод данных</h2>
          <textarea value={publicKey} onChange={(e) => setPublicKey(e.target.value)} placeholder="Вставьте публичный ключ" />
          <textarea value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="Вставьте приватный ключ" />
          <textarea value={plaintext} onChange={(e) => setPlaintext(e.target.value)} placeholder="Текст для шифрования" />

          <button onClick={handleAction}>Выполнить действие</button>

          <div>
            <h3>Зашифрованный текст:</h3>
            <pre>{encryptedText}</pre>
          </div>

          <div>
            <h3>Расшифрованный текст:</h3>
            <pre>{decryptedText}</pre>
          </div>

          {error && <p>{error}</p>}
        </div>
      )}
    </RSAUtilsExporter>
  );
};

export default ExampleUsage;



// // ExampleUsage.js
// import React, { useState } from 'react';
// import RSAUtilsExporter from './RSAUtilsExporter';
// import EncryptionComponent from './EncryptionComponent';
// import DecryptionComponent from './DecryptionComponent';
// //import EncryptionComponent from './EncryptionComponent';
// // import DecryptionComponent from './DecryptionComponent';
// import { encryptRSA, decryptRSA } from './rsaUtils'

// const ExampleUsage = () => {
//   const [publicKey, setPublicKey] = useState('');
//   const [privateKey, setPrivateKey] = useState('');
//   const [plaintext, setPlaintext] = useState('');
//   const [encryptedText, setEncryptedText] = useState('');
//   const [decryptedText, setDecryptedText] = useState('');
//   const [error, setError] = useState(null);

//   const handleEncryptError = (errorMessage) => {
//     console.error(errorMessage);
//     setError(errorMessage);
//   };

//   const handleDecryptError = (errorMessage) => {
//     console.error(errorMessage);
//     setError(errorMessage);
//   };

//   const handleAction = async () => {
//     try {
//       const encryptedData = await encryptRSA(publicKey, plaintext);
//       setEncryptedText(new TextDecoder().decode(encryptedData));
//       setError(null);
//     } catch (error) {
//       handleEncryptError('Ошибка при шифровании');
//     }

//     try {
//       const decryptedData = await decryptRSA(privateKey, new TextEncoder().encode(encryptedText));
//       setDecryptedText(decryptedData);
//       setError(null);
//     } catch (error) {
//       handleDecryptError('Ошибка при дешифровании');
//     }
//   };

//   return (
//     <RSAUtilsExporter>
//       {({ encryptRSA, decryptRSA }) => (
//         <div>
//           <h2>Генерация ключей</h2>
//           <textarea value={publicKey} onChange={(e) => setPublicKey(e.target.value)} placeholder="Публичный ключ" />
//           <textarea value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="Приватный ключ" />
//           <textarea value={plaintext} onChange={(e) => setPlaintext(e.target.value)} placeholder="Текст для шифрования" />

//           <button onClick={handleAction}>Выполнить действие</button>

//           <div>
//             <h3>Зашифрованный текст:</h3>
//             <pre>{encryptedText}</pre>
//           </div>

//           <div>
//             <h3>Расшифрованный текст:</h3>
//             <pre>{decryptedText}</pre>
//           </div>

//           {error && <p>{error}</p>}
//         </div>
//       )}
//     </RSAUtilsExporter>
//   );
// };

// export default ExampleUsage;


// // ExampleUsage.js
// import React, { useState } from 'react';
// import RSAUtilsExporter from './RSAUtilsExporter';
// import EncryptionComponent from './EncryptionComponent';
// import DecryptionComponent from './DecryptionComponent';

// const ExampleUsage = () => {
//   const [publicKey, setPublicKey] = useState('');
//   const [privateKey, setPrivateKey] = useState('');
//   const [plaintext, setPlaintext] = useState('');
//   const [encryptedText, setEncryptedText] = useState('');
//   const [decryptedText, setDecryptedText] = useState('');
//   const [error, setError] = useState(null);

//   const handleEncryptError = (errorMessage) => {
//     console.error(errorMessage);
//     setError(errorMessage);
//   };

//   const handleDecryptError = (errorMessage) => {
//     console.error(errorMessage);
//     setError(errorMessage);
//   };

//   return (
//     <RSAUtilsExporter>
//       {({ encryptRSA, decryptRSA }) => (
//         <div>
//           <h2>Генерация ключей</h2>
//           <textarea value={publicKey} onChange={(e) => setPublicKey(e.target.value)} placeholder="Публичный ключ" />
//           <textarea value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="Приватный ключ" />
//           <textarea value={plaintext} onChange={(e) => setPlaintext(e.target.value)} placeholder="Текст для шифрования" />

//           <EncryptionComponent
//             publicKey={publicKey}
//             plaintext={plaintext}
//             encryptFunction={encryptRSA}
//             onEncrypt={(encryptedData) => {
//               setEncryptedText(encryptedData);
//               setError(null);
//             }}
//             onError={handleEncryptError}
//           />

//           <DecryptionComponent
//             privateKey={privateKey}
//             encryptedText={encryptedText}
//             decryptFunction={decryptRSA}
//             onDecrypt={(decryptedData) => {
//               setDecryptedText(decryptedData);
//               setError(null);
//             }}
//             onError={handleDecryptError}
//           />

//           <div>
//             <h3>Зашифрованный текст:</h3>
//             <pre>{encryptedText}</pre>
//           </div>

//           <div>
//             <h3>Расшифрованный текст:</h3>
//             <pre>{decryptedText}</pre>
//           </div>

//           {error && <p>{error}</p>}
//         </div>
//       )}
//     </RSAUtilsExporter>
//   );
// };

// export default ExampleUsage;
