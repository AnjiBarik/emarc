import React, { useState, useEffect } from 'react';
import './scrollToTopButton.css';
import up from '../cart/img/up.png';

export default function ScrollToTopButton() {
    const [showButton, setShowButton] = useState(false);

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

	return (
		<>
			{showButton && (
				<img src={up} alt='button-up'  className="button-up" onClick={scrollUp}/>
                // <button className="button-up" onClick={scrollUp}>
				// ▲
				// </button>
			)}
		</>
	);
}