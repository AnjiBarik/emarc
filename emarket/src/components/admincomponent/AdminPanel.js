import React from 'react';
import RSAGenerator from '../rsacomponent/RSAGenerator';
import MyForm from './MyForm';

export default function AdminPanel  ()  {
  return (
    <div>
      <h1>Admin Panel</h1>
      <RSAGenerator />
      <MyForm />
    </div>
  );
};


