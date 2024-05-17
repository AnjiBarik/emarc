

function generateKeyPair() {
    return crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt']);
}

function exportPublicKey(publicKey) {
    return crypto.subtle.exportKey('spki', publicKey).then(spki => arrayBufferToBase64(spki));
}

function exportPrivateKey(privateKey) {
    return crypto.subtle.exportKey('pkcs8', privateKey).then(pkcs8 => arrayBufferToBase64(pkcs8));
}

function encryptData(publicKey, data) {
    return crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, data);
}

function decryptData(privateKey, encryptedData) {
    return crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedData);
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function printEncryptedData(encryptedData) {
    console.log('Encrypted Data:');
    const encryptedString = arrayBufferToBase64(encryptedData);
    for (let i = 0; i < encryptedString.length; i += 256) {
        console.log(encryptedString.substring(i, i + 256));
    }
}

function splitStringIntoChunks(str, chunkSize) {
    const chunks = [];
    for (let i = 0; i < str.length; i += chunkSize) {
        chunks.push(str.substring(i, i + chunkSize));
    }
    return chunks;
}

function Demo(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    console.log('Original Message:', message);

    let privateKey;

    let encryptedMessage1, encryptedMessage2;
    let publicKeyChunks1, publicKeyChunks2;

    generateKeyPair()
        .then((keyPair) => {
            const { publicKey, privateKey: privKey } = keyPair;
            privateKey = privKey;

            return Promise.all([
                exportPublicKey(publicKey),
                exportPrivateKey(privateKey),
                encryptData(publicKey, data)
            ]);
        })
        .then(([publicKeyPEM, privateKeyPEM, encryptedData]) => {
            console.log('Public Key:');
            const publicKeyLines = splitStringIntoChunks(publicKeyPEM, 256);
            publicKeyLines.forEach(line => console.log(line));
            console.log('Private Key:', privateKeyPEM);
            printEncryptedData(encryptedData);

            encryptedMessage1 = arrayBufferToBase64(encryptedData);
            publicKeyChunks1 = publicKeyLines.join('\n');

            return decryptData(privateKey, encryptedData);
        })
        .then(decryptedData => {
            const decryptedMessage = new TextDecoder().decode(decryptedData);
            console.log('Decrypted Message:', decryptedMessage);

            // Saving encrypted message and public key for verification
            encryptedMessage2 = arrayBufferToBase64(decryptedData);
            publicKeyChunks2 = splitStringIntoChunks(publicKeyChunks1, 256).join('\n');

            // Output for verification
            console.log('Encrypted Message 1:');
            console.log(encryptedMessage1);
            console.log('Encrypted Message 2:');
            console.log(encryptedMessage2);
            console.log('Public Key Chunks 1:');
            console.log(publicKeyChunks1);
            console.log('Public Key Chunks 2:');
            console.log(publicKeyChunks2);
        })
        .catch(error => console.error('Error:', error));
}

// Добавляем кнопку "Сгенерировать ключи"
const generateKeysButton = document.createElement('button');
generateKeysButton.textContent = 'Сгенерировать ключи';
generateKeysButton.addEventListener('click', () => {
    Demo('Пример сообщения для шифрования Пример сообщения для шифрования Пример сообщения для шифрования');
});
document.body.appendChild(generateKeysButton);

export default Demo;



// function generateKeyPair() {
//     return crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt']);
// }

// function exportPublicKey(publicKey) {
//     return crypto.subtle.exportKey('spki', publicKey).then(spki => arrayBufferToBase64(spki));
// }

// function exportPrivateKey(privateKey) {
//     return crypto.subtle.exportKey('pkcs8', privateKey).then(pkcs8 => arrayBufferToBase64(pkcs8));
// }

// function encryptData(publicKey, data) {
//     return crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, data);
// }

// function decryptData(privateKey, encryptedData) {
//     return crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedData);
// }

// function arrayBufferToBase64(buffer) {
//     const bytes = new Uint8Array(buffer);
//     let binary = '';
//     for (let i = 0; i < bytes.byteLength; i++) {
//         binary += String.fromCharCode(bytes[i]);
//     }
//     return btoa(binary);
// }

// function printEncryptedData(encryptedData) {
//     console.log('Encrypted Data:');
//     const encryptedString = arrayBufferToBase64(encryptedData);
//     for (let i = 0; i < encryptedString.length; i += 256) {
//         console.log(encryptedString.substring(i, i + 256));
//     }
// }

// function splitStringIntoChunks(str, chunkSize) {
//     const chunks = [];
//     for (let i = 0; i < str.length; i += chunkSize) {
//         chunks.push(str.substring(i, i + chunkSize));
//     }
//     return chunks;
// }

// function Demo(message) {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(message);
//     console.log('Original Message:', message);

//     let privateKey;

//     generateKeyPair()
//         .then((keyPair) => {
//             const { publicKey, privateKey: privKey } = keyPair;
//             privateKey = privKey;

//             return Promise.all([
//                 exportPublicKey(publicKey),
//                 exportPrivateKey(privateKey),
//                 encryptData(publicKey, data)
//             ]);
//         })
//         .then(([publicKeyPEM, privateKeyPEM, encryptedData]) => {
//             console.log('Public Key:');
//             const publicKeyLines = splitStringIntoChunks(publicKeyPEM, 256);
//             publicKeyLines.forEach(line => console.log(line));
//             console.log('Private Key:', privateKeyPEM);
//             printEncryptedData(encryptedData);
//             return decryptData(privateKey, encryptedData);
//         })
//         .then(decryptedData => {
//             const decryptedMessage = new TextDecoder().decode(decryptedData);
//             console.log('Decrypted Message:', decryptedMessage);
//         })
//         .catch(error => console.error('Error:', error));
// }

// // Добавляем кнопку "Сгенерировать ключи"
// const generateKeysButton = document.createElement('button');
// generateKeysButton.textContent = 'Сгенерировать ключи';
// generateKeysButton.addEventListener('click', () => {
//     Demo('Пример сообщения для шифрования');
// });
// document.body.appendChild(generateKeysButton);

// export default Demo;

// function Demo() {
//     const message = 'Сквозь туман и мрак ночи, ветер 11111 Сквозь туман и мрак ночи, ветер 11111 Сквозь туман и мрак ночи, ветер 11111 ';
//     const encoder = new TextEncoder();
//     const data = encoder.encode(message);
//     console.log('Original Message:', message);

//     crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt'])
//         .then((keyPair) => {
//             const { publicKey, privateKey } = keyPair;

//             // Convert public key to PEM format
//             return crypto.subtle.exportKey('spki', publicKey)
//                 .then(spki => {
//                     const publicKeyPEM = arrayBufferToBase64(spki);
//                     console.log('Public Key:', publicKeyPEM);
//                     console.log(publicKeyPEM.length)
//                 })
//                 .then(() => {
//                     // Convert private key to PEM format
//                     return crypto.subtle.exportKey('pkcs8', privateKey);
//                 })
//                 .then(pkcs8 => {
//                     const privateKeyPEM = arrayBufferToBase64(pkcs8);
//                     console.log('Private Key:', privateKeyPEM);
//                 })
//                 .then(() => {
//                     // Encrypt data
//                     return crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, data);
//                 })
//                 .then(encryptedData => {
//                     // Convert encryptedData to string
//                     const encryptedString = arrayBufferToBase64(encryptedData);
//                     console.log('Encrypted Data:');
//                     console.log(encryptedString.length)
//                     for (let i = 0; i < encryptedString.length; i += 256) {
//                         console.log(encryptedString.substring(i, i + 256));
//                     }

//                     // Decrypt data
//                     return crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedData);
//                 })
//                 .then(decryptedData => {
//                     const decryptedMessage = new TextDecoder().decode(decryptedData);
//                     console.log('Decrypted Message:', decryptedMessage);
//                 });
//         });
// }

// function arrayBufferToBase64(buffer) {
//     const bytes = new Uint8Array(buffer);
//     let binary = '';
//     for (let i = 0; i < bytes.byteLength; i++) {
//         binary += String.fromCharCode(bytes[i]);
//     }
//     return btoa(binary);
// }

// export default Demo;




// function Demo() {
//     const message = 'Hello, world!';
//     const encoder = new TextEncoder();
//     const data = encoder.encode(message);
//     console.log('Original Message:', message);

//     crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 1024, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt'])
//         .then((keyPair) => {
//             const { publicKey, privateKey } = keyPair;

//             // Convert public key to PEM format
//             return crypto.subtle.exportKey('spki', publicKey)
//                 .then(spki => {
//                     const publicKeyPEM = `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(spki)}\n-----END PUBLIC KEY-----`;
//                     console.log('Public Key:', publicKeyPEM);
//                     console.log(publicKeyPEM.length)
//                     console.log(arrayBufferToBase64(spki))
//                 })
//                 .then(() => {
//                     // Convert private key to PEM format
//                     return crypto.subtle.exportKey('pkcs8', privateKey);
//                 })
//                 .then(pkcs8 => {
//                     const privateKeyPEM = `-----BEGIN PRIVATE KEY-----\n${arrayBufferToBase64(pkcs8)}\n-----END PRIVATE KEY-----`;
//                     console.log('Private Key:', privateKeyPEM);
//                     console.log( privateKeyPEM.length)
//                 })
//                 .then(() => {
//                     // Encrypt data
//                     return crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, data);
//                 })
//                 .then(encryptedData => {
//                     console.log('Encrypted Data:', arrayBufferToBase64(encryptedData));
//                     console.log((arrayBufferToBase64(encryptedData).length))
//                     console.log(encryptedData)

//                     // Decrypt data
//                     return crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedData);
//                 })
//                 .then(decryptedData => {
//                     const decryptedMessage = new TextDecoder().decode(decryptedData);
//                     console.log('Decrypted Message:', decryptedMessage);
//                 });
//         });
// }

// function arrayBufferToBase64(buffer) {
//     const bytes = new Uint8Array(buffer);
//     let binary = '';
//     for (let i = 0; i < bytes.byteLength; i++) {
//         binary += String.fromCharCode(bytes[i]);
//     }
//     return btoa(binary);
// }

// export default Demo;


// function Demo() {
//     const message = 'Hello, world!';
//     const encoder = new TextEncoder();
//     const data = encoder.encode(message);
//     console.log(data);

//     crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt'])
//         .then((keyPair) => {
//             const { publicKey, privateKey } = keyPair;

//             // Export public key
//             return crypto.subtle.exportKey('spki', publicKey)
//                 .then((exportedKey) => {
//                     // Convert exportedKey to string
//                     const publicKeyString = Array.from(new Uint8Array(exportedKey)).map(byte => String.fromCharCode(byte)).join('');
//                     const publicKeyLines = publicKeyString.match(/.{1,256}/g); // Output publicKey as strings of 256 characters
//                     console.log(publicKeyLines);
// console.log(publicKeyString)
// console.log(publicKeyString.length)
// console.log(privateKey)
// console.log(typeof(privateKey))

//                     return crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, data)
//                         .then(encryptedData => {
//                             // Convert encryptedData to string
//                             const encryptedString = Array.from(new Uint8Array(encryptedData)).map(byte => String.fromCharCode(byte)).join('');
//                             const encryptedLines = encryptedString.match(/.{1,256}/g); // Output encryptedData as strings of 256 characters
//                             console.log(encryptedString)
//                             console.log(encryptedString.length)

                            
//                             console.log(encryptedLines);
//                             console.log(`Number of lines in encryptedData: ${encryptedLines.length}`);

//                             return crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedData);
//                         })
//                         .then(decryptedData => {
//                             // Convert decryptedData to string
//                             const decryptedString = new TextDecoder().decode(decryptedData);
//                             console.log(decryptedString);
//                         });
//                 });
//         });
// }

// export default Demo;


// function Demo() {
//     const message = 'Hello, world!';
//     const encoder = new TextEncoder();
//     const data = encoder.encode(message);
//     console.log(data);

//     crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt'])
//         .then((keyPair) => {
//             const { publicKey, privateKey } = keyPair;
// console.log(publicKey)
//             return crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, data)
//                 .then(encryptedData => {
//                     // Convert encryptedData to string
//                     const encryptedString = Array.from(new Uint8Array(encryptedData)).map(byte => String.fromCharCode(byte)).join('');
//                     // console.log(encryptedString.match(/.{1,256}/g)); // Output encryptedData as strings of 256 characters
//                     const encryptedLines = encryptedString.match(/.{1,256}/g); // Output encryptedData as strings of 256 characters
//                     console.log(encryptedString.length)
//                     console.log(encryptedLines);
//                     console.log(`Number of lines in encryptedData: ${encryptedLines.length}`);
//                     return crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedData);
//                 })
//                 .then(decryptedData => {
//                     // Convert decryptedData to string
//                     const decryptedString = new TextDecoder().decode(decryptedData);
//                     console.log(decryptedString);
//                 });
//         });
// }

// export default Demo;


// import React, { useEffect } from 'react';

// function Demo() {
//     const message = 'Hello, world!';
//     const encoder = new TextEncoder();
//     const data = encoder.encode(message);
//     console.log(data)
//     crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt'])
//         .then((keyPair) => {
//             const { publicKey, privateKey } = keyPair;
    
//             return crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, data)
//                 .then(encryptedData => {
//                     console.log(encryptedData);
    
//                     return crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedData);
//                 })
//                 .then(decryptedData => console.log((decryptedData)));
//         });
// }

// export default Demo;


// const message = 'Hello, world!';
// const encoder = new TextEncoder();
// const data = encoder.encode(message);
// function Demo(){
// // Generate RSA key pair
// const rsaParams = { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' };
// crypto.subtle.generateKey(rsaParams, true, ['encrypt', 'decrypt'])
//     .then((rsaKeyPair) => {
//         const { publicKey, privateKey } = rsaKeyPair;

//         // Export RSA public key
//         return crypto.subtle.exportKey('spki', publicKey)
//             .then((exportedPublicKey) => {
//                 // Generate AES key
//                 const aesKey = crypto.getRandomValues(new Uint8Array(32));

//                 // Import AES key
//                 return crypto.subtle.importKey('raw', aesKey, { name: 'AES-CBC' }, false, ['encrypt'])
//                     .then((importedAesKey) => {
//                         // Encrypt data with AES
//                         return crypto.subtle.encrypt({ name: 'AES-CBC', iv: crypto.getRandomValues(new Uint8Array(16)) }, importedAesKey, data)
//                             .then((encryptedData) => {
//                                 // Encrypt AES key with RSA public key
//                                 return crypto.subtle.encrypt(rsaParams, exportedPublicKey, aesKey)
//                                     .then((encryptedAesKey) => {
//                                         console.log(encryptedData, encryptedAesKey);
//                                         // Decrypt AES key with RSA private key
//                                         return crypto.subtle.decrypt(rsaParams, privateKey, encryptedAesKey)
//                                             .then((decryptedAesKey) => {
//                                                 // Decrypt data with AES
//                                                 return crypto.subtle.decrypt({ name: 'AES-CBC', iv: crypto.getRandomValues(new Uint8Array(16)) }, decryptedAesKey, encryptedData)
//                                                     .then((decryptedData) => console.log(new TextDecoder().decode(decryptedData)));
//                                             });
//                                     });
//                             });
//                     });
//             });
//     });
//  } export default Demo;