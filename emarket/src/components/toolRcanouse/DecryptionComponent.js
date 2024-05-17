// DecryptionComponent.js
import React, { useState } from 'react';

const DecryptionComponent = ({ privateKey, encryptedText, decryptFunction, onDecrypt }) => {
  const [error, setError] = useState(null);

  const handleDecrypt = async () => {
    try {
      const decryptedData = await decryptFunction(privateKey, new TextEncoder().encode(encryptedText));
      onDecrypt(decryptedData);
      setError(null);
    } catch (error) {
      setError('Ошибка при дешифровании');
    }
  };

  return null;
};

export default DecryptionComponent;
