import React, { useState } from 'react';

const decryptPrivateKey = async (encryptedKey, password) => {
  try {
    const [saltBase64, ivBase64, dataBase64] = encryptedKey.split(':');
    const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
    const data = Uint8Array.from(atob(dataBase64), c => c.charCodeAt(0));

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

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
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    throw new Error('Decryption failed');
  }
};

const DecryptPrivateKey = ({ encryptedKey }) => {
  const [password, setPassword] = useState('');
  const [decryptedKey, setDecryptedKey] = useState(null);
  const [error, setError] = useState(null);

  const handleDecrypt = async () => {
    try {
      const key = await decryptPrivateKey(encryptedKey, password);
      setDecryptedKey(key);
      setError(null);
    } catch (err) {
      setError('Decryption failed. Please check your password.');
    }
  };

  return (
    <div>
      <div className="filters">
        <input
          type="password"
          placeholder="Enter password to decrypt"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleDecrypt}>Decrypt Private Key</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {decryptedKey && (
        <div>
          <h4>Decrypted Private Key:</h4>
          <div className="filters">
            <textarea value={decryptedKey} readOnly rows={8} cols={40} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DecryptPrivateKey;
