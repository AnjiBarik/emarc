import React, { useState } from 'react';

const RSAEncryption = () => {
  const [encryptedMessage, setEncryptedMessage] = useState('');

  const encryptRSA = async (publicKeyText, plaintext) => {
    try {
      const publicKey = await importPublicKey(publicKeyText);

      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP'
        },
        publicKey,
        new TextEncoder().encode(plaintext)
      );

      const base64EncodedEncryptedMessage = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
      setEncryptedMessage(base64EncodedEncryptedMessage);

      return base64EncodedEncryptedMessage;
    } catch (error) {
      console.error('Error encrypting:', error);
    }
  };

  const decryptRSA = async (privateKeyText, encryptedMessage) => {
    try {
      const privateKey = await importPrivateKey(privateKeyText);

      const encryptedUint8Array = new Uint8Array(atob(encryptedMessage).split('').map(char => char.charCodeAt(0)));
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP'
        },
        privateKey,
        encryptedUint8Array
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Error decrypting:', error);
    }
  };

  const importPublicKey = async (publicKeyText) => {
    const publicKeyArrayBuffer = Uint8Array.from(atob(publicKeyText), c => c.charCodeAt(0)).buffer;
    return await crypto.subtle.importKey(
      'spki',
      publicKeyArrayBuffer,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' }
      },
      false,
      ['encrypt']
    );
  };

  const importPrivateKey = async (privateKeyText) => {
    const privateKeyArrayBuffer = Uint8Array.from(atob(privateKeyText), c => c.charCodeAt(0)).buffer;
    return await crypto.subtle.importKey(
      'pkcs8',
      privateKeyArrayBuffer,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' }
      },
      false,
      ['decrypt']
    );
  };

  return {
    encryptedMessage,
    encryptRSA,
    decryptRSA
  };
};

export default RSAEncryption;
