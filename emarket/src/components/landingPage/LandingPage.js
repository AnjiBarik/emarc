import React, { useState, useEffect, useCallback } from 'react';
import Slider from './Slider';
import './LandingPage.css';
import Submit from './Form';
import { BooksContext } from '../../BooksContext';
import LangComponent from  './LangComponent';
import RSAGenerator from '../rsacomponent/RSAGenerator';
//import ExampleApp from '../rsacomponent/ExampleApp';
import tuning from '../book-list/tuning.json';

function LandingPage() {
    const { theme,  uiMain, fieldState, setUiState, setUiMain} = React.useContext(BooksContext);

    const [loading, setLoading] = useState(true);
   // const [load, setLoad] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'iframeError') {
                console.error('Error loading iframe content:', event.data.error);
                setError(event.data.error);
                setLoading(false);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const handleLoad = () => {
        setLoading(false);
    };


    const [visibilityKeyGen, setVisibilityKeyGen] = useState(false);

    const handleKeyDown = (e) => {
      if (e.key === 'K') {
        setVisibilityKeyGen(true);
        console.log(visibilityKeyGen)
      }
      console.log(e.key)
    };


    // const tuningUrl = `${process.env.PUBLIC_URL}/data/tuning.json`;
    // console.log(tuningUrl)
    
       
      const initializeState = useCallback((data) => {
        setUiState(data.tuning);
    
        if (uiMain.length < 1) {
          const startItem = data.tuning.find(item => item.type === "start");
          setUiMain(startItem);
        }
    
        if (uiMain.loadprice === "true" && fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
          setUiState(prevState => {
            const maxId = prevState.reduce((max, item) => (item.id > max ? item.id : max), 0);
            const updatedUiMain = { ...uiMain };
    
            if (fieldState.titleprice) updatedUiMain.title = fieldState.titleprice;
            if (fieldState.lang) updatedUiMain.lang = fieldState.lang;
            if (fieldState.UrFrame) updatedUiMain.UrFrame = fieldState.UrFrame;
            updatedUiMain.Urprice = fieldState.Urprice;
            updatedUiMain.logo = fieldState.logo;
            updatedUiMain.author = fieldState.author || (uiMain.author + (fieldState.idprice || "LOL"));
            updatedUiMain.type = updatedUiMain.type === "start" ? "add" : updatedUiMain.type;
            updatedUiMain.id = maxId + 1;
    
            return [...prevState, updatedUiMain];
          });
        }
    
      // setLoad(false);
      }, [fieldState, uiMain, setUiMain, setUiState]);
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const tuningUrl = `${process.env.PUBLIC_URL}/data/tuning.json`;
            const response = await fetch(tuningUrl);
            const tuningData = await response.json();
            console.log(tuningData)
            initializeState(tuningData);
          } catch  {
          // } catch (err) {
            //console.log(err.message);
            console.log(tuning)
            initializeState(tuning);
          }
        };
    
        fetchData();
      }, [fieldState, uiMain, initializeState]);  

    //  console.log(load)

    // if (load) {
    // return <div>...Loading...</div>;
    // }


    return (
        <div className={theme} onKeyDown={handleKeyDown} tabIndex={0}>
            
            <section className="intro">
               
                <LangComponent/> 

              <div >
              {/* Your RSA components */}
              {visibilityKeyGen &&  <div><RSAGenerator/></div>}
              </div>

            </section>
            <section className="slider-section">
                <Slider />
             
            </section>
            {loading && (uiMain.UrFrame || uiMain.UrFrame!=="") && <p>Loading content...</p>}
            {error && <p>Error loading content</p>}
            {uiMain.UrFrame && uiMain.UrFrame!==""&&(
            <section style={{ height: '100vh' }}>
                <iframe style={{ border: 'none' }}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    src={uiMain.UrFrame}
                    title="External Content"
                    width="100%"
                    height="100%"
                    onLoad={handleLoad}
                ></iframe>
            </section>
            )}
             {(!uiMain.UrFrame || uiMain.UrFrame==="")&&(
                <div className='main'></div>
            )} 


            <div className='loadPrice'>
                <Submit/>
            </div>
           
        </div>
    );
}

export default LandingPage;


// import React, { useState, useEffect } from 'react';
// import Slider from './Slider';
// import './LandingPage.css';
// import Submit from './Form';
// import { BooksContext } from '../../BooksContext';
// import LangComponent from  './LangComponent';
// import RSAGenerator from '../rsacomponent/RSAGenerator';
// //import ExampleApp from '../rsacomponent/ExampleApp';

// function LandingPage() {
//     const { theme,  uiMain } = React.useContext(BooksContext);

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const handleMessage = (event) => {
//             if (event.data.type === 'iframeError') {
//                 console.error('Error loading iframe content:', event.data.error);
//                 setError(event.data.error);
//                 setLoading(false);
//             }
//         };

//         window.addEventListener('message', handleMessage);

//         return () => {
//             window.removeEventListener('message', handleMessage);
//         };
//     }, []);

//     const handleLoad = () => {
//         setLoading(false);
//     };


//     const [visibilityKeyGen, setVisibilityKeyGen] = useState(false);

//     const handleKeyDown = (e) => {
//       if (e.key === 'K') {
//         setVisibilityKeyGen(true);
//         console.log(visibilityKeyGen)
//       }
//       console.log(e.key)
//     };

//     return (
//         <div className={theme} onKeyDown={handleKeyDown} tabIndex={0}>
            
//             <section className="intro">
               
//                 <LangComponent/> 

//               <div >
//               {/* Your RSA components */}
//               {visibilityKeyGen &&  <div><RSAGenerator/></div>}
//               </div>

//             </section>
//             <section className="slider-section">
//                 <Slider />
             
//             </section>
//             {loading && (uiMain.UrFrame || uiMain.UrFrame!=="") && <p>Loading content...</p>}
//             {error && <p>Error loading content</p>}
//             {uiMain.UrFrame && uiMain.UrFrame!==""&&(
//             <section style={{ height: '100vh' }}>
//                 <iframe style={{ border: 'none' }}
//                     sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
//                     src={uiMain.UrFrame}
//                     title="External Content"
//                     width="100%"
//                     height="100%"
//                     onLoad={handleLoad}
//                 ></iframe>
//             </section>
//             )}
//              {(!uiMain.UrFrame || uiMain.UrFrame==="")&&(
//                 <div className='main'></div>
//             )} 


//             <div className='loadPrice'>
//                 <Submit/>
//             </div>
           
//         </div>
//     );
// }

// export default LandingPage;



// import React, { useState, useEffect } from 'react';
// import Slider from './Slider'; // Импортируем компонент слайдера
// import './LandingPage.css'; // Подключаем файл со стилями
// import Submit from './Form';
// import { BooksContext } from '../../BooksContext';
// import LangComponent from  './LangComponent';


// function LandingPage() {
//     const { theme ,uiState, setUiState, uiMain, setUiMain} = React.useContext(BooksContext);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

  


//     const handleLoad = () => {
//         setLoading(false);
//     };

//     const handleError = (event) => {
//         setError(event);
//         console.error("Ошибка загрузки содержимого iframe:", event);
//     };

//     return (
//         <div className={theme}>
//             <header>
//                 <h1>Добро пожаловать в наш интернет-магазин</h1>
//             </header>
//             <section className="intro">
//                 <p>Покупайте у нас лучшие товары по самым выгодным ценам.</p>
//                 <LangComponent/>
               
//                {/* <img src={uiMain.logo}/> */}
//                 {uiMain.UrFrame}  {uiMain.Urprice} {uiMain.Urregform} {uiMain.Urorder}
//             </section>
//             <section className="slider-section">
//                 <Slider />
//             </section>    
//                 {loading && <p>Загрузка...</p>}
//                 {error && <p>Произошла ошибка при загрузке содержимого.</p>}
//                 <section style={{ height: '100vh' }}>
//                 <iframe style={{border:"none"}}
                    
//                     sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  
//                  src={uiMain.UrFrame}

                

//                     title="External Content"
//                     width="100%"
//                     height="100%"
                   
//                     onLoad={handleLoad}
//                     onError={handleError}
//                 ></iframe>
//                 </section>
            
//             <section className="description">
//                 <p>У нас вы найдете широкий выбор товаров высокого качества.</p>
//             </section>
//             <div className='loadPrice'>
//                 <Submit/>
//             </div>
//             <section className="features">
//                 <div className="feature">
//                     <img src="image1.jpg" alt="Преимущество 1" />
//                     <p>Быстрая доставка</p>
//                 </div>
//                 <div className="feature">
//                     <img src="image2.jpg" alt="Преимущество 2" />
//                     <p>Широкий ассортимент</p>
//                 </div>
//                 <div className="feature">
//                     <img src="image3.jpg" alt="Преимущество 3" />
//                     <p>Высокое качество товаров</p>
//                 </div>
//                 <div className="feature">
//                     <img src="image4.jpg" alt="Преимущество 4" />
//                     <p>Привлекательные цены</p>
//                 </div>
//             </section>
//         </div>
//     );
// }

// export default LandingPage;


// import React from 'react';
// import Slider from './Slider'; // Импортируем компонент слайдера
// import './LandingPage.css'; // Подключаем файл со стилями
// import Submit from './Form';
// import { BooksContext } from '../../BooksContext';

// function LandingPage() {
//     const { theme  } = React.useContext(BooksContext);
    
//     return (
       
//          <div className={theme}> 
       

//             <header>
//                 <h1>Добро пожаловать в наш интернет-магазин</h1>
//             </header>
//             <section className="intro">
//                 <p>Покупайте у нас лучшие товары по самым выгодным ценам.</p>
//             </section>
//             <section className="slider-section">
//                 <Slider />
//             </section>
          
//             <section style={{ height: '100vh' }}>
//             <iframe 
//              style={{border:"none"}}
//                     src="https://anjibarik.github.io/"
                  
//                     title="External Content"
//                     width="100%"
//                     height="100%"
                    
//                 ></iframe>
//             </section>    
//             <section className="description">
//                 <p>У нас вы найдете широкий выбор товаров высокого качества.</p>
//             </section>
//             <div className='loadPrice'>
//             <Submit/>
//             </div>
//             <section className="features">
//                 <div className="feature">
//                     <img src="image1.jpg" alt="Преимущество 1" />
//                     <p>Быстрая доставка</p>
//                 </div>
//                 <div className="feature">
//                     <img src="image2.jpg" alt="Преимущество 2" />
//                     <p>Широкий ассортимент</p>
//                 </div>
//                 <div className="feature">
//                     <img src="image3.jpg" alt="Преимущество 3" />
//                     <p>Высокое качество товаров</p>
//                 </div>
//                 <div className="feature">
//                     <img src="image4.jpg" alt="Преимущество 4" />
//                     <p>Привлекательные цены</p>
                  
//                 </div>
//             </section>
//             <section className="filter">
           
//             </section>    
//          </div> 
         
//     );
// }

// export default LandingPage;
