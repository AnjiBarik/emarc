// EncryptionComponent.js
import React, { useState } from 'react';

const EncryptionComponent = ({ publicKey, plaintext, encryptFunction, onEncrypt }) => {
  const [error, setError] = useState(null);

  const handleEncrypt = async () => {
    try {
      const encryptedData = await encryptFunction(publicKey, plaintext);
      onEncrypt(new TextDecoder().decode(encryptedData));
      setError(null);
    } catch (error) {
      setError('Ошибка при шифровании');
    }
  };

  return null;
};

export default EncryptionComponent;
