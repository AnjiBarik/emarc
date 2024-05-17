import React, { useState } from 'react'; 
import './signin.css';
import ava from './img/avatar.png';
import Footer from "../footer/Footer";
import { Link } from "react-router-dom";
import { SHA256 } from 'crypto-js';
import { BooksContext } from '../../BooksContext';

export default function SignIn() {
    const [input, setInput] = useState('');
    const { setCartItems } = React.useContext(BooksContext);
    
    function hashString(str) {
        return SHA256(str).toString();
    }
    
    function handleSignIn() {
        const hashedInput = hashString(input);
        const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || {};
        const userPurchases = storedPurchases[hashedInput] || [];
        
        localStorage.setItem('bookToCart', JSON.stringify(userPurchases));
        setCartItems(userPurchases);
        localStorage.setItem('username', input);
    }

    return (
        <> 
            <section className="header">
                <h1>JS BAND STORE/Barik&nbsp;Andrei </h1>
            </section>
            <div className="mainBlock">
                <section className="autorization-block dark">
                    <img src={ava} alt="avatar"/>
                    <div className="input-block">
                        <label htmlFor="username">Username</label>
                        <input value={input} onChange={e => setInput(e.target.value)} type="text" id="username" title="Please enter a name with at least 4 characters" placeholder="type Username"/>
                        <Link to="/booklist">
                        <button id='submit' type="button" disabled={input.length < 4 || input.length > 16} onClick={handleSignIn}>Sign In</button>
                        </Link>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}