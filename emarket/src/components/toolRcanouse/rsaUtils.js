// rsaUtils.js
export const encryptRSA = async (publicKeyPEM, plaintext) => {
  try {
    const publicKey = await window.crypto.subtle.importKey(
      'spki',
      pemToArrayBuffer(publicKeyPEM),
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['encrypt']
    );

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      new TextEncoder().encode(plaintext)
    );

    return new Uint8Array(encryptedData);
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw error;
  }
};

export const decryptRSA = async (privateKeyPEM, ciphertext) => {
  try {
    const privateKey = await window.crypto.subtle.importKey(
      'pkcs8',
      pemToArrayBuffer(privateKeyPEM),
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['decrypt']
    );

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      ciphertext
    );

    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw error;
  }
};

const pemToArrayBuffer = (pemString) => {
  try {
    const base64String = pemString
      .replace(/-----BEGIN (RSA )?((PUBLIC|PRIVATE) )?KEY-----\n/, '')
      .replace(/-----END (RSA )?((PUBLIC|PRIVATE) )?KEY-----\n/, '')
      .replace(/\s/g, ''); // Удаляем все пробельные символы

    console.log('base64String:', base64String); // Выводим содержимое base64String в консоль

    const binaryString = window.atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    console.error('Error decoding PEM:', error);
    throw error;
  }
};



// // rsaUtils.js
// export const encryptRSA = async (publicKey, plaintext) => {
//     try {
//       const key = await window.crypto.subtle.importKey(
//         'spki',
//         publicKey,
//         {
//           name: 'RSA-OAEP',
//           hash: 'SHA-256',
//         },
//         true,
//         ['encrypt']
//       );
  
//       const encryptedData = await window.crypto.subtle.encrypt(
//         {
//           name: 'RSA-OAEP',
//         },
//         key,
//         new TextEncoder().encode(plaintext)
//       );
  
//       return new Uint8Array(encryptedData);
//     } catch (error) {
//       console.error('Error encrypting data:', error);
//       return null;
//     }
//   };
  
//   export const decryptRSA = async (privateKey, ciphertext) => {
//     try {
//       const key = await window.crypto.subtle.importKey(
//         'pkcs8',
//         privateKey,
//         {
//           name: 'RSA-OAEP',
//           hash: 'SHA-256',
//         },
//         true,
//         ['decrypt']
//       );
  
//       const decryptedData = await window.crypto.subtle.decrypt(
//         {
//           name: 'RSA-OAEP',
//         },
//         key,
//         ciphertext
//       );
  
//       return new TextDecoder().decode(decryptedData);
//     } catch (error) {
//       console.error('Error decrypting data:', error);
//       return null;
//     }
//   };
  