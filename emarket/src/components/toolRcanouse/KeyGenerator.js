// KeyGenerator.js

import React from 'react';
import { generateKeyPair } from './Demo'; // Импорт функции для генерации ключей

class KeyGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            publicKey: '',
            privateKey: ''
        };
    }

    handleGenerateKeysClick = () => {
        generateKeyPair()
            .then(([publicKeyPEM, privateKeyPEM]) => {
                this.setState({
                    publicKey: publicKeyPEM,
                    privateKey: privateKeyPEM
                });
            })
            .catch(error => console.error('Error generating keys:', error));
    };

    render() {
        return (
            <div>
                <button onClick={this.handleGenerateKeysClick}>Generate Keys</button>
                <div>
                    <h3>Public Key:</h3>
                    <pre>{this.state.publicKey}</pre>
                </div>
                <div>
                    <h3>Private Key:</h3>
                    <pre>{this.state.privateKey}</pre>
                </div>
            </div>
        );
    }
}

export default KeyGenerator;
