import React, { useState } from 'react';
import { useIcons } from '../../IconContext';
import './InfoModal.css'; 

//import info from '../cart/img/info.png';

const InfoModal = ({ text }) => {

    const { info } = useIcons();
      
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <button className='sort-button' onClick={openModal}>
            <img src={info} className="back-button" alt="info" /> 
            </button>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <p>{text}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InfoModal;
