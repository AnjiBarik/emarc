import React, { useContext } from 'react';
import { BooksContext } from '../../BooksContext';
import RSAGenerator from '../rsacomponent/RSAGenerator';
import MyForm from './MyForm';

export default function AdminPanel  ()  {
  const {theme} = useContext(BooksContext);
  
  return (
    <div className={`main-form ${theme}`}>   
    <section className="filters">
      <h1>Admin Panel</h1>
    </section> 
    <hr />
    <section className="filters">
      <RSAGenerator />
    </section>
    <hr />
    <section className="filters"> 
      <MyForm />
    </section>   
    </div>
    
  );
};


