import React, { useState } from 'react';

const decryptPrivateKey = async (encryptedKey, password) => {
  try {
    const data = Uint8Array.from(atob(encryptedKey), c => c.charCodeAt(0));

    const enc = new TextEncoder();
    // Hash the password using SHA-256 to get a fixed-size key
    const passwordHash = await crypto.subtle.digest('SHA-256', enc.encode(password));
    
    // Import the hashed password as a key
    const key = await crypto.subtle.importKey(
      'raw',
      passwordHash,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    // Derive IV from the password hash (first 12 bytes)
    const iv = new Uint8Array(passwordHash).slice(0, 12);

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

const DecryptPrivateKey = ({ encryptedKey, onDecrypted }) => {
  const [password, setPassword] = useState('');
  const [decryptedKey, setDecryptedKey] = useState(null);
  const [error, setError] = useState(null);

  const handleDecrypt = async () => {
    try {
      const key = await decryptPrivateKey(encryptedKey, password);
      onDecrypted(key);
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
          className='form-input' autoFocus
          type="password"
          placeholder="Enter password to decrypt"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='selected' onClick={handleDecrypt}>Decrypt Private Key</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {decryptedKey && (
        <h4>Private key  successfully decrypted</h4>
        // <div>
        //   <h4>Decrypted Private Key:</h4>
        //   <div className="filters">
        //     <textarea value={decryptedKey} readOnly rows={8} cols={40} />
        //   </div>
        // </div>
      )}
    </div>
  );
};

export default DecryptPrivateKey;