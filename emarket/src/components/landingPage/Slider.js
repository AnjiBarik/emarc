import React, { useState, useEffect } from 'react';
import './Slider.css'; 
import { BooksContext } from '../../BooksContext';

function Slider() {
    const { uiState, setUiMain, uiMain } = React.useContext(BooksContext);
    const [currentSlide, setCurrentSlide] = useState(getInitialSlideIndex());
    const [selectedLogoIndex, setSelectedLogoIndex] = useState(currentSlide);

    useEffect(() => {
        const newSlideIndex = uiState.findIndex(slide => slide.author === uiMain.author && slide.lang === uiMain.lang);
        setCurrentSlide(newSlideIndex);
        setSelectedLogoIndex(newSlideIndex);
    }, [uiMain, uiState]);

    function getInitialSlideIndex() {
        if (uiMain && uiMain.lang) {
            const index = uiState.findIndex(slide => slide.lang === uiMain.lang);
            if (index !== -1) {
                return index;
            }
        }
        return uiState.findIndex(slide => slide.author === uiState[0].author);
    }

    const handleImageError = () => {
        // Handle image loading errors here
        // For now, you can console.log the error
        console.log('Image failed to load');
    };

    const handleSlideClick = (slideIndex) => {
        setCurrentSlide(slideIndex);
        setUiMain(uiState[slideIndex]);
    };

    const uniqueAuthors = [...new Set(uiState.map(slide => slide.author))]; // Get unique authors

    return (
        <div className="slider-container">
            {uniqueAuthors.map(author => {
                const slidesByAuthor = uiState.filter(slide => slide.author === author);
                if (uiMain && uiMain.lang && slidesByAuthor.some(slide => slide.lang === uiMain.lang)) {
                    const slideIndex = slidesByAuthor.findIndex(slide => slide.lang === uiMain.lang);
                    const slide = slidesByAuthor[slideIndex];
                    return (
                        <div key={author} className="slide-container" onClick={() => handleSlideClick(uiState.indexOf(slide))}>
                            {slide.logo ? (
                                <img
                                    className={`slide ${currentSlide === uiState.indexOf(slide) ? 'active' : ''} ${selectedLogoIndex === uiState.indexOf(slide) ? 'selected' : ''}`}
                                    src={slide.logo}
                                    alt={slide.title || `Slide ${uiState.indexOf(slide) + 1}`}
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className='slide'> 
                                <span className={`slide-text ${currentSlide === uiState.indexOf(slide) ? 'active' : ''} ${selectedLogoIndex === uiState.indexOf(slide) ? 'selected' : ''}`}>{slide.title}</span>
                                </div>
                            )}
                        </div> 
                    );
                } else {
                    const slideIndex = uiState.findIndex(slide => slide.author === author);
                    const slide = uiState[slideIndex];
                    return (
                        <div key={author} className="slide-container" onClick={() => handleSlideClick(slideIndex)}>
                            {slide.logo ? (
                                <img
                                    className={`slide ${currentSlide === slideIndex ? 'active' : ''} ${selectedLogoIndex === slideIndex ? 'selected' : ''}`}
                                    src={slide.logo}
                                    alt={slide.title || `Slide ${slideIndex + 1}`}
                                    onError={handleImageError}
                                />
                            ) : (
                                <span className={`slide-text ${currentSlide === slideIndex ? 'active' : ''} ${selectedLogoIndex === uiState.indexOf(slide) ? 'selected' : ''}`}>{slide.title}</span>
                            )}
                        </div>
                    );
                }
            })}
        </div>
    );
}

export default Slider;


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