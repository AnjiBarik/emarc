import React, { useEffect, useState} from 'react';
import './Slider.css'; 
import { BooksContext } from '../../BooksContext';

function Slider() {
    const { uiState, setUiMain, uiMain } = React.useContext(BooksContext);
    const [imageError, setImageError] = useState(false);
   
    const publicUrl = `${window.location.origin}${window.location.pathname}`;
    const folder = 'logoimg';

    //get Browser language
    const [language, setLanguage] = useState('');

    useEffect(() => {
        const browserLanguage = navigator.language || navigator.languages[0];
        browserLanguage.startsWith('en') ? setLanguage('en') : setLanguage(browserLanguage);
      }, []);
      

    //console.log(language)

    const handleImageError = () => {
        // Handle image loading errors here
        //console.log('Image failed to load');
        setImageError(true);
    };

    const handleSlideClick = (slideIndex) => {
      setUiMain(uiState[slideIndex]);
    };

    const getImageSrc = (slide) => {
        if (slide.logopablic) {            
            return `${process.env.PUBLIC_URL}/${folder}/${slide.logopablic}` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${slide.logopablic}`;           
        }
        return slide.logo || '';
    };

    const getSlideClasses = (index) => {
        return ` ${uiMain.id === index+1  ? 'active selected' : ''} `;
    };

    const uniqueAuthors = [...new Set(uiState.map(slide => slide.author))];

    return (
        <div className="slider-container">
            {uniqueAuthors.map(author => {
                const slidesByAuthor = uiState.filter(slide => slide.author === author);                
                const slide = slidesByAuthor.find(slide => slide.lang === language || slide.lang === uiMain.lang) || slidesByAuthor[0];
                const slideIndex = uiState.indexOf(slide);

                return (
                    <div key={author} className="slide-container" onClick={() => handleSlideClick(slideIndex)}>
                        {(!imageError && (slide.logo || slide.logopablic )) ? (
                            <img
                                className={`slide ${getSlideClasses(slideIndex)}`}
                                src={getImageSrc(slide)}
                                alt={slide.title || `Slide ${slideIndex + 1}`}
                                onError={handleImageError}
                            />
                        ) : (
                            <div className="slide">
                                <span className={`slide-text ${getSlideClasses(slideIndex)}`}>{slide.title}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Slider;

