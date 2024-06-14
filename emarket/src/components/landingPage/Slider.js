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
            //return `${process.env.PUBLIC_URL}/logoimg/${slide.logopablic}`;
            //return `${process.env.PUBLIC_URL}/${folder}/${slide.logopablic}` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${slide.logopablic}`;
            return `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${slide.logopablic}`;
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




// import React, { useState, useEffect } from 'react';
// import './Slider.css'; 
// import { BooksContext } from '../../BooksContext';

// function Slider() {
//     const { uiState, setUiMain, uiMain, idLoudPrice } = React.useContext(BooksContext);
//     const [idLoudPriceLang, setIdLoudPriceLang] = useState(null);
//     const [currentSlide, setCurrentSlide] = useState(getInitialSlideIndex());
//     //const [selectedLogoIndex, setSelectedLogoIndex] = useState(currentSlide);
//     const [imageError, setImageError] = useState(false);
    

//     useEffect(() => {
//         if (idLoudPrice && idLoudPrice !== 0) {
//             const loudPriceSlide = uiState.find(slide => slide.id === idLoudPrice);
//             if (loudPriceSlide) {
//                 setIdLoudPriceLang(loudPriceSlide.lang);
//             }
//         }
//     }, [idLoudPrice, uiState]);

//     // useEffect(() => {
//     //     const newSlideIndex = uiState.findIndex(slide => slide.author === uiMain.author && slide.lang === uiMain.lang);
//     //     setCurrentSlide(newSlideIndex);
//     //     console.log(newSlideIndex)
//     //     console.log(currentSlide)
//     //     //setSelectedLogoIndex(newSlideIndex);
//     // }, [uiMain, uiState]);

//     console.log(idLoudPrice)
//     console.log(idLoudPriceLang)


//     function getInitialSlideIndex() {
//         if (idLoudPriceLang) {
//                         const index = uiState.findIndex(slide => slide.lang === idLoudPriceLang);
//                         if (index !== -1) {
                            
//                             console.log(index)
                          
                            
//                             return index;
//                         }
//                     }
        
//         if (uiMain && uiMain.lang) {
//             const index = uiState.findIndex(slide => slide.lang === uiMain.lang);
//             if (index !== -1) {
//                 return index;
//             }
//         }
//         return uiState.findIndex(slide => slide.author === uiState[0].author);
//     }

//     const handleImageError = () => {
//         // Handle image loading errors here
//         console.log('Image failed to load');
//         setImageError(true);
//     };

//     const handleSlideClick = (slideIndex) => {
//         setCurrentSlide(slideIndex);
//         setUiMain(uiState[slideIndex]);
//     };

//     const getImageSrc = (slide) => {
//         if (slide.logopablic) {
//             return `${process.env.PUBLIC_URL}/logoimg/${slide.logopablic}`;
//         }
//         return slide.logo || '';
//     };

//     const getSlideClasses = (index) => {
// console.log(index)
// console.log(currentSlide)

//        // return ` ${currentSlide === index ? 'active selected' : ''} `;
//         return ` ${uiMain.id === index+1  ? 'active selected' : ''} `;
//     };

//     const uniqueAuthors = [...new Set(uiState.map(slide => slide.author))];
// console.log(uiMain)
//     return (
//         <div className="slider-container">
//             {uniqueAuthors.map(author => {
//                 const slidesByAuthor = uiState.filter(slide => slide.author === author);
//                 const slide = slidesByAuthor.find(slide => slide.lang === uiMain.lang) || slidesByAuthor[0];
//                 const slideIndex = uiState.indexOf(slide);

//                 return (
//                     <div key={author} className="slide-container" onClick={() => handleSlideClick(slideIndex)}>
//                         {(!imageError && (slide.logo || slide.logopablic )) ? (
//                             <img
//                                 className={`slide ${getSlideClasses(slideIndex)}`}
//                                 src={getImageSrc(slide)}
//                                 alt={slide.title || `Slide ${slideIndex + 1}`}
//                                 onError={handleImageError}
//                             />
//                         ) : (
//                             <div className="slide">
//                                 <span className={`slide-text ${getSlideClasses(slideIndex)}`}>{slide.title}</span>
//                             </div>
//                         )}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default Slider;




// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import './Slider.css'; 
// import { BooksContext } from '../../BooksContext';

// function Slider() {
//     const { uiState, setUiMain, uiMain, idLoudPrice } = useContext(BooksContext);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [selectedLogoIndex, setSelectedLogoIndex] = useState(0);
//     const [imageError, setImageError] = useState(false);
//     const [idLoudPriceLang, setIdLoudPriceLang] = useState(null);

//     useEffect(() => {
//         if (idLoudPrice && idLoudPrice !== 0) {
//             const loudPriceSlide = uiState.find(slide => slide.id === idLoudPrice);
//             if (loudPriceSlide) {
//                 setIdLoudPriceLang(loudPriceSlide.lang);
//             }
//         }
//     }, [idLoudPrice, uiState]);

//     const setInitialSlideIndex = useCallback(() => {
//         if (idLoudPriceLang) {
//             const index = uiState.findIndex(slide => slide.lang === idLoudPriceLang);
//             if (index !== -1) {
//                 setCurrentSlide(index);
//                 console.log(index)
//                 console.log(currentSlide)
//                 setSelectedLogoIndex(index);
//                 return;
//             }
//         }
//         if (uiMain && uiMain.lang) {
//             const index = uiState.findIndex(slide => slide.lang === uiMain.lang);
//             if (index !== -1) {
//                 setCurrentSlide(index);
//                 console.log(index)
//                 console.log(currentSlide)
//                 setSelectedLogoIndex(index);
//                 return;
//             }
//         }
//         setCurrentSlide(0);
//         setSelectedLogoIndex(0);
//         console.log("f")
//     }, [uiMain, uiState, idLoudPriceLang]);

//     useEffect(() => {
//         setInitialSlideIndex();
//     }, [ uiState, idLoudPriceLang, setInitialSlideIndex]);

//     const handleImageError = () => {
//         console.log('Image failed to load');
//         setImageError(true);
//     };

//     const handleSlideClick = (slideIndex) => {
//         setCurrentSlide(slideIndex);
//         console.log(slideIndex)
//                 console.log(currentSlide)
//         setUiMain(uiState[slideIndex]);
//         setImageError(false);
//     };

//     const getImageSrc = (slide) => {
//         if (slide.logopablic) {
//             return `${process.env.PUBLIC_URL}/logoimg/${slide.logopablic}`;
//         }
//         return slide.logo;
//     };

//     const getSlideClasses = (index) => {
//         console.log(index)
//         console.log(currentSlide)
//         return `${currentSlide === index ? 'active' : ''} ${selectedLogoIndex === index ? 'selected' : ''}`;
//     };

//     const getSlideForAuthor = (author) => {
//         const slidesByAuthor = uiState.filter(slide => slide.author === author);
//         if (uiMain && uiMain.lang && slidesByAuthor.some(slide => slide.lang === uiMain.lang)) {
//             return slidesByAuthor.find(slide => slide.lang === uiMain.lang);
//         }
//         return slidesByAuthor.find(slide => slide.lang === idLoudPriceLang) || slidesByAuthor[0];
//     };

//     const uniqueAuthors = [...new Set(uiState.map(slide => slide.author))];
//     console.log(currentSlide)
//     return (
//         <div className="slider-container">
//             {uniqueAuthors.map(author => {
//                 const slide = getSlideForAuthor(author);
//                 const slideIndex = uiState.indexOf(slide);

//                 return (
//                     <div key={author} className="slide-container" onClick={() => handleSlideClick(slideIndex)}>
//                         <div className= {getSlideClasses(slideIndex)}>
//                         {(!imageError && (slide.logo || slide.logopablic)) ? (
//                             <img
//                                 // className={`slide ${getSlideClasses(slideIndex)}`}
//                                 className='slide'
//                                 src={getImageSrc(slide)}
//                                 alt={slide.title || `Slide ${slideIndex + 1}`}
//                                 onError={handleImageError}
//                             />
//                         ) : (
//                             // <div className={`slide ${getSlideClasses(slideIndex)}`}>
//                             <div>
//                                 <span className={`slide-text ${getSlideClasses(slideIndex)}`}>{slide.title}</span>
//                             </div>
//                         )}
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default Slider;










// import React, { useState, useEffect } from 'react';
// import './Slider.css'; 
// import { BooksContext } from '../../BooksContext';

// function Slider() {
//     const { uiState, setUiMain, uiMain, idLoudPrice } = React.useContext(BooksContext);
//     const [currentSlide, setCurrentSlide] = useState(getInitialSlideIndex());
//     const [selectedLogoIndex, setSelectedLogoIndex] = useState(currentSlide);
// console.log(idLoudPrice)
// idLoudPrice && idLoudPrice!==0 && console.log(uiState.find(slide => slide.id ===idLoudPrice))
//   //  console.log((uiState.find(slide => slide.id ===idLoudPrice)).lang)
//     useEffect(() => {
//         const newSlideIndex = uiState.findIndex(slide => slide.author === uiMain.author && slide.lang === uiMain.lang);
//         setCurrentSlide(newSlideIndex);
//         setSelectedLogoIndex(newSlideIndex);
//     }, [uiMain, uiState]);

//     function getInitialSlideIndex() {
//         if (uiMain && uiMain.lang) {
//             const index = uiState.findIndex(slide => slide.lang === uiMain.lang);
//             if (index !== -1) {
//                 console.log(index)
//                 return index;               
//             }
//         }
//         return uiState.findIndex(slide => slide.author === uiState[0].author);
//     }

//     const handleImageError = () => {
//         // Handle image loading errors here
//         console.log('Image failed to load');
//     };

//     const handleSlideClick = (slideIndex) => {
//         setCurrentSlide(slideIndex);
//         setUiMain(uiState[slideIndex]);
//     };

//     const getImageSrc = (slide) => {
//         if (slide.logopablic) {
//             return `${process.env.PUBLIC_URL}/logoimg/${slide.logopablic}`;
//         }
//         // return slide.logo || '';
//         return slide.logo ;
//     };

//     const getSlideClasses = (index) => {
//         return ` ${currentSlide === index ? 'active' : ''} ${selectedLogoIndex === index ? 'selected' : ''}`;
//     };

//     const getSlideForAuthor = (author) => {
//         const slidesByAuthor = uiState.filter(slide => slide.author === author);
//         if (uiMain && uiMain.lang && slidesByAuthor.some(slide => slide.lang === uiMain.lang)) {
//             return slidesByAuthor.find(slide => slide.lang === uiMain.lang);
//         }
//         return slidesByAuthor[0];
//     };

//     const uniqueAuthors = [...new Set(uiState.map(slide => slide.author))];

//     return (
//         <div className="slider-container">
//             {uniqueAuthors.map(author => {
//                 const slide = getSlideForAuthor(author);
//                 const slideIndex = uiState.indexOf(slide);

//                 return (
//                     <div key={author} className="slide-container" onClick={() => handleSlideClick(slideIndex)}>
//                         {slide.logo || slide.logopablic ? (
//                             <img
//                                 className={`slide ${getSlideClasses(slideIndex)}`}
//                                 src={getImageSrc(slide)}
//                                 alt={slide.title || `Slide ${slideIndex + 1}`}
//                                 onError={handleImageError}
//                             />
//                         ) : (
//                             <div className="slide">
//                                 <span className={`slide-text ${getSlideClasses(slideIndex)}`}>{slide.title}</span>
//                             </div>
//                         )}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default Slider;


// import React, { useState, useEffect } from 'react';
// import './Slider.css'; 
// import { BooksContext } from '../../BooksContext';

// function Slider() {
//     const { uiState, setUiMain, uiMain } = React.useContext(BooksContext);
//     const [currentSlide, setCurrentSlide] = useState(getInitialSlideIndex());
//     const [selectedLogoIndex, setSelectedLogoIndex] = useState(currentSlide);

//     useEffect(() => {
//         const newSlideIndex = uiState.findIndex(slide => slide.author === uiMain.author && slide.lang === uiMain.lang);
//         setCurrentSlide(newSlideIndex);
//         setSelectedLogoIndex(newSlideIndex);
//     }, [uiMain, uiState]);

//     function getInitialSlideIndex() {
//         if (uiMain && uiMain.lang) {
//             const index = uiState.findIndex(slide => slide.lang === uiMain.lang);
//             if (index !== -1) {
//                 return index;
//             }
//         }
//         return uiState.findIndex(slide => slide.author === uiState[0].author);
//     }

//     const handleImageError = () => {
//         // Handle image loading errors here
//         console.log('Image failed to load');
//     };

//     const handleSlideClick = (slideIndex) => {
//         setCurrentSlide(slideIndex);
//         setUiMain(uiState[slideIndex]);
//     };

//     const getImageSrc = (slide) => {
//         if (slide.logopablic) {
//             return `${process.env.PUBLIC_URL}/logoimg/${slide.logopablic}`;
//         }
//         return slide.logo || '';
//     };

//     const getSlideClasses = (index) => {
//         return `slide ${currentSlide === index ? 'active' : ''} ${selectedLogoIndex === index ? 'selected' : ''}`;
//     };

//     const uniqueAuthors = [...new Set(uiState.map(slide => slide.author))];

//     return (
//         <div className="slider-container">
//             {uniqueAuthors.map(author => {
//                 const slidesByAuthor = uiState.filter(slide => slide.author === author);
//                 const slide = slidesByAuthor.find(slide => slide.lang === uiMain.lang) || slidesByAuthor[0];
//                 const slideIndex = uiState.indexOf(slide);

//                 return (
//                     <div key={author} className="slide-container" onClick={() => handleSlideClick(slideIndex)}>
//                         {slide.logo || slide.logopablic ? (
//                             <img
//                                 className={getSlideClasses(slideIndex)}
//                                 src={getImageSrc(slide)}
//                                 alt={slide.title || `Slide ${slideIndex + 1}`}
//                                 onError={handleImageError}
//                             />
//                         ) : (
//                             <div className="slide">
//                                 <span className={getSlideClasses(slideIndex)}>{slide.title}</span>
//                             </div>
//                         )}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default Slider;



// import React, { useState, useEffect } from 'react';
// import './Slider.css'; 
// import { BooksContext } from '../../BooksContext';

// function Slider() {
//     const { uiState, setUiMain, uiMain } = React.useContext(BooksContext);
//     const [currentSlide, setCurrentSlide] = useState(getInitialSlideIndex());
//     const [selectedLogoIndex, setSelectedLogoIndex] = useState(currentSlide);

//     useEffect(() => {
//         const newSlideIndex = uiState.findIndex(slide => slide.author === uiMain.author && slide.lang === uiMain.lang);
//         setCurrentSlide(newSlideIndex);
//         setSelectedLogoIndex(newSlideIndex);
//     }, [uiMain, uiState]);

//     function getInitialSlideIndex() {
//         if (uiMain && uiMain.lang) {
//             const index = uiState.findIndex(slide => slide.lang === uiMain.lang);
//             if (index !== -1) {
//                 return index;
//             }
//         }
//         return uiState.findIndex(slide => slide.author === uiState[0].author);
//     }

//     const handleImageError = () => {
//         // Handle image loading errors here
//         // For now, you can console.log the error
//         console.log('Image failed to load');
//     };

//     const handleSlideClick = (slideIndex) => {
//         setCurrentSlide(slideIndex);
//         setUiMain(uiState[slideIndex]);
//     };

//     const uniqueAuthors = [...new Set(uiState.map(slide => slide.author))]; // Get unique authors

//     return (
//         <div className="slider-container">
//             {uniqueAuthors.map(author => {
//                 const slidesByAuthor = uiState.filter(slide => slide.author === author);
//                 if (uiMain && uiMain.lang && slidesByAuthor.some(slide => slide.lang === uiMain.lang)) {
//                     const slideIndex = slidesByAuthor.findIndex(slide => slide.lang === uiMain.lang);
//                     const slide = slidesByAuthor[slideIndex];
//                     return (
//                         <div key={author} className="slide-container" onClick={() => handleSlideClick(uiState.indexOf(slide))}>
//                             {slide.logo ? (
//                                 <img
//                                     className={`slide ${currentSlide === uiState.indexOf(slide) ? 'active' : ''} ${selectedLogoIndex === uiState.indexOf(slide) ? 'selected' : ''}`}
//                                     src={slide.logo}
//                                     alt={slide.title || `Slide ${uiState.indexOf(slide) + 1}`}
//                                     onError={handleImageError}
//                                 />
//                             ) : (
//                                 <div className='slide'> 
//                                 <span className={`slide-text ${currentSlide === uiState.indexOf(slide) ? 'active' : ''} ${selectedLogoIndex === uiState.indexOf(slide) ? 'selected' : ''}`}>{slide.title}</span>
//                                 </div>
//                             )}
//                         </div> 
//                     );
//                 } else {
//                     const slideIndex = uiState.findIndex(slide => slide.author === author);
//                     const slide = uiState[slideIndex];
//                     return (
//                         <div key={author} className="slide-container" onClick={() => handleSlideClick(slideIndex)}>
//                             {slide.logo ? (
//                                 <img
//                                     className={`slide ${currentSlide === slideIndex ? 'active' : ''} ${selectedLogoIndex === slideIndex ? 'selected' : ''}`}
//                                     src={slide.logo}
//                                     alt={slide.title || `Slide ${slideIndex + 1}`}
//                                     onError={handleImageError}
//                                 />
//                             ) : (
//                                 <span className={`slide-text ${currentSlide === slideIndex ? 'active' : ''} ${selectedLogoIndex === uiState.indexOf(slide) ? 'selected' : ''}`}>{slide.title}</span>
//                             )}
//                         </div>
//                     );
//                 }
//             })}
//         </div>
//     );
// }

// export default Slider;


// import React, { useState, useEffect } from 'react';
// import './Slider.css'; // Подключаем файл со стилями
// import { BooksContext } from '../../BooksContext';

// function Slider() {
//     const { uiState, setUiMain, uiMain } = React.useContext(BooksContext);
//     const [currentSlide, setCurrentSlide] = useState(getInitialSlideIndex());
//     const [selectedLogoIndex, setSelectedLogoIndex] = useState(currentSlide);

//     useEffect(() => {
//         setSelectedLogoIndex(currentSlide);
//     }, [currentSlide]);

//     function getInitialSlideIndex() {
//         if (uiMain && uiMain.lang) {
//             const index = uiState.findIndex(slide => slide.lang === uiMain.lang);
//             if (index !== -1) {
//                 return index;
//             }
//         }
//         return uiState.findIndex(slide => slide.author === uiState[0].author);
//     }

//     const handleImageError = () => {
//         // Handle image loading errors here
//         // For now, you can console.log the error
//         console.log('Image failed to load');
//     };

//     const handleSlideClick = (slideIndex) => {
//         setCurrentSlide(slideIndex);
//         setUiMain(uiState[slideIndex]);
//     };

//     const uniqueAuthors = [...new Set(uiState.map(slide => slide.author))]; // Get unique authors

//     return (
//         <div className="slider-container">
//             {uniqueAuthors.map(author => {
//                 const slidesByAuthor = uiState.filter(slide => slide.author === author);
//                 if (uiMain && uiMain.lang && slidesByAuthor.some(slide => slide.lang === uiMain.lang)) {
//                     const slideIndex = slidesByAuthor.findIndex(slide => slide.lang === uiMain.lang);
//                     const slide = slidesByAuthor[slideIndex];
//                     return (
//                         <div key={author} className="slide-container" onClick={() => handleSlideClick(uiState.indexOf(slide))}>
//                             {slide.logo ? (
//                                 <img
//                                     className={`slide ${currentSlide === uiState.indexOf(slide) ? 'active' : ''} ${selectedLogoIndex === uiState.indexOf(slide) ? 'selected' : ''}`}
//                                     src={slide.logo}
//                                     alt={slide.title || `Slide ${uiState.indexOf(slide) + 1}`}
//                                     onError={handleImageError}
//                                 />
//                             ) : (
//                                 <div className='slide'> 
//                                 <span className={`slide-text ${currentSlide === uiState.indexOf(slide) ? 'active' : ''}`}>{slide.title}</span>
//                                 </div>
//                             )}
//                         </div> 
//                     );
//                 } else {
//                     const slideIndex = uiState.findIndex(slide => slide.author === author);
//                     const slide = uiState[slideIndex];
//                     return (
//                         <div key={author} className="slide-container" onClick={() => handleSlideClick(slideIndex)}>
//                             {slide.logo ? (
//                                 <img
//                                     className={`slide ${currentSlide === slideIndex ? 'active' : ''} ${selectedLogoIndex === slideIndex ? 'selected' : ''}`}
//                                     src={slide.logo}
//                                     alt={slide.title || `Slide ${slideIndex + 1}`}
//                                     onError={handleImageError}
//                                 />
//                             ) : (
//                                 <span className={`slide-text ${currentSlide === slideIndex ? 'active' : ''}`}>{slide.title}</span>
//                             )}
//                         </div>
//                     );
//                 }
//             })}
//         </div>
//     );
// }

// export default Slider; 



// import React, { useState } from 'react';
// import './Slider.css'; // Подключаем файл со стилями
// import { BooksContext } from '../../BooksContext';

// function Slider() {
//     const { uiState, setUiMain, uiMain } = React.useContext(BooksContext);
//     const [currentSlide, setCurrentSlide] = useState(getInitialSlideIndex());

//     function getInitialSlideIndex() {
//         if (uiMain && uiMain.lang) {
//             const index = uiState.findIndex(slide => slide.lang === uiMain.lang);
//             if (index !== -1) {
//                 return index;
//             }
//         }
//         return uiState.findIndex(slide => slide.author === uiState[0].author);
//     }

//     const handleImageError = () => {
//         // Handle image loading errors here
//         // For now, you can console.log the error
//         console.log('Image failed to load');
//     };

//     const handleSlideClick = (slideIndex) => {
//         setCurrentSlide(slideIndex);
//         setUiMain(uiState[slideIndex]);
//     };

//     const uniqueAuthors = [...new Set(uiState.map(slide => slide.author))]; // Get unique authors

//     return (
//         <div className="slider-container">
//             {uniqueAuthors.map(author => {
//                 const slidesByAuthor = uiState.filter(slide => slide.author === author);
//                 if (uiMain && uiMain.lang && slidesByAuthor.some(slide => slide.lang === uiMain.lang)) {
//                     const slideIndex = slidesByAuthor.findIndex(slide => slide.lang === uiMain.lang);
//                     const slide = slidesByAuthor[slideIndex];
//                     return (
//                         <div key={author} className="slide-container" onClick={() => handleSlideClick(uiState.indexOf(slide))}>
//                             {slide.logo ? (
//                                 <img
//                                     className={`slide ${currentSlide === uiState.indexOf(slide) ? 'active selected' : ''}`}
//                                     src={slide.logo}
//                                     alt={slide.title || `Slide ${uiState.indexOf(slide) + 1}`}
//                                     onError={handleImageError}
//                                 />
//                             ) : (
//                                 <div className='slide'> 
//                                 <span className={`slide-text ${currentSlide === uiState.indexOf(slide) ? 'active selected' : ''}`}>{slide.title}</span>
//                                 </div>
//                             )}
//                         </div> 
//                     );
//                 } else {
//                     const slideIndex = uiState.findIndex(slide => slide.author === author);
//                     const slide = uiState[slideIndex];
//                     return (
//                         <div key={author} className="slide-container" onClick={() => handleSlideClick(slideIndex)}>
//                             {slide.logo ? (
//                                 <img
//                                     className={`slide ${currentSlide === slideIndex ? 'active' : ''}`}
//                                     src={slide.logo}
//                                     alt={slide.title || `Slide ${slideIndex + 1}`}
//                                     onError={handleImageError}
//                                 />
//                             ) : (
//                                 <span className={`slide-text ${currentSlide === slideIndex ? 'active' : ''}`}>{slide.title}</span>
//                             )}
//                         </div>
//                     );
//                 }
//             })}
//         </div>
//     );
// }

// export default Slider;




// import React, { useState, useEffect } from 'react';
// import './Slider.css'; // Подключаем файл со стилями
// import { BooksContext } from '../../BooksContext';

// function Slider() {
//     const { uiState, setUiMain, uiMain } = React.useContext(BooksContext);
//     const [currentSlide, setCurrentSlide] = useState(getInitialSlideIndex());

//     function getInitialSlideIndex() {
//         if (uiMain && uiMain.lang) {
//             const index = uiState.findIndex(slide => slide.author === uiMain.lang);
//             return index !== -1 ? index : 0;
//         } else {
//             return uiState.findIndex(slide => slide.author === uiState[0].author);
//         }
//     }

//     const handleImageError = () => {
//         // Handle image loading errors here
//         // For now, you can console.log the error
//         console.log('Image failed to load');
//     };

//     const handleSlideClick = (slideIndex) => {
//         setCurrentSlide(slideIndex);
//         setUiMain(uiState[slideIndex]);
//     };

//     const uniqueAuthors = [...new Set(uiState.map(slide => slide.author))]; // Get unique authors

//     return (
//         <div className="slider-container">
//             {uniqueAuthors.map(author => {
//                 const slideIndex = uiState.findIndex(slide => slide.author === author);
//                 const slide = uiState[slideIndex];
//                 return (
//                     <div key={author} className="slide-container" onClick={() => handleSlideClick(slideIndex)}>
//                         {slide.logo ? (
//                             <img
//                                 className={`slide ${currentSlide === slideIndex ? 'active' : ''}`}
//                                 src={slide.logo}
//                                 alt={slide.title || `Slide ${slideIndex + 1}`}
//                                 onError={handleImageError}
//                             />
//                         ) : (
//                             <span className={`slide-text ${currentSlide === slideIndex ? 'active' : ''}`}>{slide.title}</span>
//                         )}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default Slider;



// import React, { useState } from 'react';
// import './Slider.css'; // Подключаем файл со стилями
// import { BooksContext } from '../../BooksContext';

// function Slider() {
//     const { uiState, setUiMain, uiMain } = React.useContext(BooksContext);
//     const [currentSlide, setCurrentSlide] = useState(0);

//     const nextSlide = () => {
//         setCurrentSlide(prevSlide => (prevSlide === uiState.length - 1 ? 0 : prevSlide + 1));
//     };

//     const prevSlide = () => {
//         setCurrentSlide(prevSlide => (prevSlide === 0 ? uiState.length - 1 : prevSlide - 1));
//     };

//     const handleImageError = () => {
//         // Handle image loading errors here
//         // For now, you can console.log the error
//         console.log('Image failed to load');
//     };

//     const handleSlideClick = (slideIndex) => {
//         setUiMain(uiState[slideIndex]);
//         setCurrentSlide(slideIndex);
//     };
// console.log(uiMain)
// //console.log(uiMain[0].UrFrame)
//     return (
//         <div className="slider-container">
//             <button className="prev" onClick={prevSlide}>&#10094;</button>
//             {uiState.map((slide, index) => (
//                 <div key={index} className="img-container" onClick={() => handleSlideClick(index)}>
//                     {slide.logo ? (
//                         <img
//                             className={`slide ${currentSlide === index ? 'active' : ''}`}
//                             src={slide.logo}
//                             alt={slide.title || `Slide ${index + 1}`}
//                             onError={handleImageError}
//                         />
//                     ) : (
//                         <span className={`slide-text ${currentSlide === index ? 'active' : ''}`}>{slide.title}</span>
//                     )}
//                 </div>
//             ))}
//             <button className="next" onClick={nextSlide}>&#10095;</button>
//         </div>
//     );
// }

// export default Slider;



// import React, { useState } from 'react';
// import './Slider.css'; // Подключаем файл со стилями
// import { BooksContext } from '../../BooksContext';

// function Slider() {
//     const { uiState } = React.useContext(BooksContext);
//     const [currentSlide, setCurrentSlide] = useState(0);

//     const nextSlide = () => {
//         setCurrentSlide(prevSlide => (prevSlide === uiState.length - 1 ? 0 : prevSlide + 1));
//     };

//     const prevSlide = () => {
//         setCurrentSlide(prevSlide => (prevSlide === 0 ? uiState.length - 1 : prevSlide - 1));
//     };

//     const handleImageError = () => {
//         // Handle image loading errors here
//         // For now, you can console.log the error
//         console.log('Image failed to load');
//     };

//     return (
//         <div className="slider-container">
//             <button className="prev" onClick={prevSlide}>&#10094;</button>
//             {uiState[currentSlide]?.logo ? (
//                 <img
//                     className="slide"
//                     src={uiState[currentSlide].logo}
//                     alt={uiState[currentSlide]?.title || `Slide ${currentSlide + 1}`}
//                     onError={handleImageError}
//                 />
//             ) : (
//                 <span className="slide-text">{uiState[currentSlide]?.title}</span>
//             )}
//             <button className="next" onClick={nextSlide}>&#10095;</button>
//         </div>
//     );
// }

// export default Slider;


// import React, { useState } from 'react';
// import './Slider.css'; // Подключаем файл со стилями
// import { BooksContext } from '../../BooksContext';

// function Slider() {
//     const { theme, uiState, setUiState, uiMain, setUiMain } = React.useContext(BooksContext);
//     const [currentSlide, setCurrentSlide] = useState(0);

//     const logos = uiState.map(item => item.logo); // Получаем массив логотипов из uiState

//     const nextSlide = () => {
//         setCurrentSlide(prevSlide => (prevSlide === logos.length - 1 ? 0 : prevSlide + 1));
//     };

//     const prevSlide = () => {
//         setCurrentSlide(prevSlide => (prevSlide === 0 ? logos.length - 1 : prevSlide - 1));
//     };

//     return (
//         <div className="slider-container">
//             <button className="prev" onClick={prevSlide}>&#10094;</button>
//             <img className="slide" src={logos[currentSlide]} alt={`Slide ${currentSlide}`} />
//             <button className="next" onClick={nextSlide}>&#10095;</button>
//         </div>
//     );
// }

// export default Slider;


// import React, { useState } from 'react';
// import './Slider.css'; // Подключаем файл со стилями
// import { BooksContext } from '../../BooksContext';
// function Slider() {
//     const { theme ,uiState, setUiState, uiMain, setUiMain} = React.useContext(BooksContext);
//     const [currentSlide, setCurrentSlide] = useState(0);
   
//     //const logos = uiState.map(item => item.logo);
//     const images = [
//         'image1.jpg',
//         'image2.jpg',
//         'image3.jpg',
//         // Добавьте пути к вашим изображениям
//     ];

//     const nextSlide = () => {
//         setCurrentSlide((prevSlide) => (prevSlide === images.length - 1 ? 0 : prevSlide + 1));
//     };

//     const prevSlide = () => {
//         setCurrentSlide((prevSlide) => (prevSlide === 0 ? images.length - 1 : prevSlide - 1));
//     };

//     return (
//         <div className="slider-container">
//             <button className="prev" onClick={prevSlide}>&#10094;</button>
//             <img className="slide" src={images[currentSlide]} alt={`Slide ${currentSlide}`} />
//             <button className="next" onClick={nextSlide}>&#10095;</button>
//         </div>
//     );
// }

// export default Slider;
