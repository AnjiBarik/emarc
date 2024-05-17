import React, { useState } from 'react';
import RSAEncryption from './RSAEncryption'; 

const ExampleApp = () => {
  const { encryptRSA, decryptRSA, encryptedMessage } = RSAEncryption();
  const [plaintext, setPlaintext] = useState('');

  // Обработчик изменения текста в инпуте
  const handlePlaintextChange = (event) => {
    setPlaintext(event.target.value);
  };
  // Генерация ключей и шифрование сообщения
  const handleEncrypt = async () => {
    const publicKeyText = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt1G32C2H9pCoT47Ocroeb1clPq5HpniR3T7VcTUh8TY4W3if7D6QXCGk4d9Yh9Quu2PiGnYbQodlN9wlFlQHHo5yXqP2jnw/ZLstYMTn8dUT7dmcW2ZThwcxWtU76PbQk/8ry57KC8v7XY5za9E0bBb1wWqbBoTmcw96HsJOAY0GdNott6StJ5VKrCbpiP9NZ+FJQlgXUjbH+fpYwf2vFEkElnt9Ug6WtEnZYH7Y/CyAhKuQPzUIBnJByVzI7DCGB5+CCShh1CskRBD2sjVtY5RyeI1YAPgi1YPMDTIXe4pkJXlrTbl5WBgoL/9sWYA/HztbRuFBKkpichFc2S+YxQIDAQAB'; // Здесь должен быть ваш публичный ключ в формате base64
    //const plaintext = 'Hello, world!';
    await encryptRSA(publicKeyText, plaintext);
    console.log('Зашифрованное сообщение:', encryptedMessage);
    const chunkSize = 256;
  for (let i = 0; i < encryptedMessage.length; i += chunkSize) {
    const chunk = encryptedMessage.substring(i, i + chunkSize);
    console.log('Часть', i / chunkSize + 1, ':', chunk);
  }
  };

  // Дешифрование сообщения
  const handleDecrypt = async () => {
    const privateKeyText = 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3UbfYLYf2kKhPjs5yuh5vVyU+rkemeJHdPtVxNSHxNjhbeJ/sPpBcIaTh31iH1C67Y+IadhtCh2U33CUWVAcejnJeo/aOfD9kuy1gxOfx1RPt2ZxbZlOHBzFa1Tvo9tCT/yvLnsoLy/tdjnNr0TRsFvXBapsGhOZzD3oewk4BjQZ02i23pK0nlUqsJumI/01n4UlCWBdSNsf5+ljB/a8USQSWe31SDpa0Sdlgftj8LICEq5A/NQgGckHJXMjsMIYHn4IJKGHUKyREEPayNW1jlHJ4jVgA+CLVg8wNMhd7imQleWtNuXlYGCgv/2xZgD8fO1tG4UEqSmJyEVzZL5jFAgMBAAECggEAJQVQvkx7n7SY+PAbCxpBGTUdJWpmt9yzgF23FxSm1SKhAP/8M+ZymtiEhsTnCQ81nMxQFg3x9V6Id15y8u5nPamAuVIdcarv1nTidh9tw+3HB4qhw+eHSMaQFgrn/WUSvECU5JsdrII2Mi+ZaZWnI4kDelsAEbH3JBdlDx8oR7GNwGqvqcMlXnJ3gQMLoGKS3Nm3nD5qnPtBDmfmrgGmU8kIrM3ps/eBuQK4Lr2OqjGROzaLCKdaz0SvPBlb9chSnSHMVEd+IhiH8L/de4P3VTPVi1w1TssZ1ySu5+AYIytrRHPBttBETI2YDqDQ3hu/FnHFymjGWGNKy0GeC1FOwQKBgQD7AUQeQne352IqW7/8+cxD8ZtM/0lc88B1gzkRGRHyQO1Ej+Qw7JXUufOAQnAipET4Wec3oLk6l4V2gp8vzOx7gUERJbxEeO1ThZGF+mkaVW9cGEwMoVv/4Y/aDopmqACNj7J+rePGVaup4+keNKsZInyd3ZmTQiIvXfNssIcstQKBgQC696FHDyWV/v+x74X+z32PNU892oeBnCYCvXQGEhmNy5Ne49wNPrR5eLukUBAxnnFNKCj7MLTfqU+WKmRjgGYsWKxw4wn2Ss6EX7j67uWM2QvKx/mi5iFRWerQil30z4YTyadQsTRv+Khns2Ec8Ajd6bH9EHx9UKI6kqr/joxV0QKBgQD0RpMob79a9pAOcSQy6lfkd6mQEZIwJ/hRZNeQ0Dkq7gz7AJ4vDs/yKtXTKNVAoWWN3NCsznn1j6iPYSfSuTgcKfpM2dCTQqyU8BRjswO+YQ7zLaI1WIPUToxUxnni1fVTz1kC9/AIATADMo6YmuE4oNtuN09ShLYIKwLP8CxdUQKBgExRyQO4qx8PeFCp9YiOKjLLEA2vpqDBnMKBk1rnCIdZEk8ptCmz7vem0PHBvNqEUrusKQ5gU3T5KAOkSlZTk2GG0N1D0E05PBPM/zVvT0SvVKDyAHT+e5s5mSCHWtMT4ycwqZvGuiD638N09a9aTERJoN4sXKTKxW4jcKnhBmgBAoGBAItLLEHZaEDw+yT5OQrPBgz0qTj7B+uRk3dF7vbrlx6btkY7tBdLIYVM2YGE5SLwlCS03Y0leYRnFXea0mjFdgvcpHCcpyzMEjVomjsw9ZKwEdTiEd9CFHUes4uIJlLS9HTz111S+Onf/T0l1NoexUjjgUPXyxW1poMG/fMaeUdA'; // Здесь должен быть ваш приватный ключ в формате base64
    const decryptedText = await decryptRSA(privateKeyText, encryptedMessage);
    console.log('Расшифрованный текст:', decryptedText);   
  };

  return (
    <div>
       <input type="text" value={plaintext} onChange={handlePlaintextChange} placeholder="Введите текст для шифрования" />
      <button onClick={handleEncrypt}>Зашифровать сообщение</button>
      <button onClick={handleDecrypt}>Дешифровать сообщение</button>
    </div>
  );
};

export default ExampleApp;
