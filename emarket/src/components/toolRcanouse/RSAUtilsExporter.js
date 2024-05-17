// RSAUtilsExporter.js
import React from 'react';
import { encryptRSA, decryptRSA } from './rsaUtils';

const RSAUtilsExporter = ({ children }) => {
  const exportFunctions = {
    encryptRSA,
    decryptRSA,
  };

  return children(exportFunctions);
};

export default RSAUtilsExporter;
