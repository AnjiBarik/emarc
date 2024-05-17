import React, { useState } from 'react';

const RSAKeyGenerator = () => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const generateKeys = async () => {
    try {
      const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );

      const exportedPublicKey = await window.crypto.subtle.exportKey(
        'spki',
        publicKey
      );

      const exportedPrivateKey = await window.crypto.subtle.exportKey(
        'pkcs8',
        privateKey
      );

      const publicKeyPEM = `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(
        exportedPublicKey
      )}\n-----END PUBLIC KEY-----`;

      const privateKeyPEM = `-----BEGIN PRIVATE KEY-----\n${arrayBufferToBase64(
        exportedPrivateKey
      )}\n-----END PRIVATE KEY-----`;
      console.log(exportedPublicKey)
      console.log(arrayBufferToBase64(
        exportedPublicKey
      ))
      console.log(arrayBufferToBase64(
        exportedPrivateKey
      ))
      console.log(exportedPrivateKey)
      setPublicKey(publicKeyPEM);
      setPrivateKey(privateKeyPEM);
    } catch (error) {
      console.error('Error generating keys:', error);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
    
  };

    
console.log(publicKey)
console.log(publicKey.length)

console.log(privateKey)
console.log(typeof(privateKey))
console.log(privateKey.length)

  return (
    <div>
      <button onClick={generateKeys}>Generate RSA Keys</button>
      <div>
        <h3>Public Key:</h3>
        <pre>{publicKey}</pre>
      </div>
      <div>
        <h3>Private Key:</h3>
        <pre>{privateKey}</pre>
      </div>
    </div>
  );
};

export default RSAKeyGenerator;
