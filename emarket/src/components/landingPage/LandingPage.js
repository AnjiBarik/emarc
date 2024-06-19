import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Slider from './Slider';
import './LandingPage.css';
import Submit from './LoadForm';
import { BooksContext } from '../../BooksContext';
import LangComponent from  './LangComponent';
import tuning from '../assets/data/tuning.json';

function LandingPage() {
    const { theme,  uiMain, fieldState, setUiState, setUiMain, promo } = React.useContext(BooksContext);

    const [loading, setLoading] = useState(true);       

    const publicUrl = `${window.location.origin}${window.location.pathname}`;
    const folder = 'data';    
    const tuningUrl = `${process.env.PUBLIC_URL}/${folder}/tuning.json` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/tuning.json`;            

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
    
    //get Browser language
    const [language, setLanguage] = useState('');

    useEffect(() => {
        const browserLanguage = navigator.language || navigator.languages[0];
        browserLanguage.startsWith('en') ? setLanguage('en') : setLanguage(browserLanguage);
      }, []);
    //console.log(language) 
       
      const initializeState = useCallback((data) => {
        setUiState(data.tuning);
    
        // if (uiMain.length < 1) {
        //   const startItem = data.tuning.find(item => item.type === "start");
        //   setUiMain(startItem);
        // }
        
        if (uiMain.length < 1) {
          let startItem = null;         
          // If there is a "langstart" and it is "auto", find the item with type "start" and lang equal to browser language
          startItem = data.tuning.find(item => item.type === "start" && item.langstart && item.langstart === 'auto' && item.lang === language);
                 
          // If no suitable startItem is found, find the first item with type "start"
          if (!startItem) {
              startItem = data.tuning.find(item => item.type === "start");
          }
  
          // If still no suitable startItem is found, use the first item in the data
          if (!startItem) {
              startItem = data.tuning[0];
          }
  
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
            updatedUiMain.author = fieldState.authorprice || (uiMain.author + (fieldState.idprice || "LOL"));
            updatedUiMain.type = updatedUiMain.type === "start" ? "add" : updatedUiMain.type;
            updatedUiMain.id = maxId + 1;
    
            return [...prevState, updatedUiMain];
          });
        }    
      
      }, [fieldState, uiMain, setUiMain, setUiState, language]);
    
      useEffect(() => {
        const fetchData = async () => {
          try {      
            const response = await fetch(tuningUrl);
            const tuningData = await response.json();            
            initializeState(tuningData);
          } catch  {            
            initializeState(tuning);
          }
        };
    
        fetchData();
      }, [fieldState, uiMain, initializeState, tuningUrl]); 

    
    return (
        <div className={theme} onKeyDown={handleKeyDown} tabIndex={0}>            
            <section className="intro">               
                <LangComponent/> 
              <div>             
              {(visibilityKeyGen || promo === fieldState.idprice)  &&  
               <Link to="/AdminPanel" >
                 <button className='back-button selected'>
                 AdminPanel
                 </button>
               </Link>
              }
              </div>

            </section>
            <section className="slider-section">
                <Slider />             
            </section>
            <button onClick={() => window.open(uiMain.UrFrame, '_blank')}>Open in new tab</button>
            {loading && (uiMain.UrFrame || uiMain.UrFrame!=="") && <p>🌀Loading content...</p>}           
            {uiMain.UrFrame && uiMain.UrFrame!==""&&(
            <section style={{ height: '100vh' }}>
                <iframe style={{ border: 'none' }}               
                    // sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    sandbox="allow-scripts allow-popups allow-forms"
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


// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import Slider from './Slider';
// import './LandingPage.css';
// import Submit from './LoadForm';
// import { BooksContext } from '../../BooksContext';
// import LangComponent from './LangComponent';
// import tuning from '../assets/data/tuning.json';

// function LandingPage() {
//     const { theme, uiMain, fieldState, setUiState, setUiMain, promo } = React.useContext(BooksContext);

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const publicUrl = `${window.location.origin}${window.location.pathname}`;
//     const folder = 'data';
//     const tuningUrl = `${process.env.PUBLIC_URL}/${folder}/tuning.json` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/tuning.json`;

//     const [visibilityKeyGen, setVisibilityKeyGen] = useState(false);

//     const handleKeyDown = (e) => {
//         if (e.key === 'K') {
//             setVisibilityKeyGen(true);
//             console.log(visibilityKeyGen);
//         }
//         console.log(e.key);
//     };

//     const initializeState = useCallback((data) => {
//         setUiState(data.tuning);

//         if (uiMain.length < 1) {
//             const startItem = data.tuning.find(item => item.type === "start");
//             setUiMain(startItem);
//         }

//         if (uiMain.loadprice === "true" && fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
//             setUiState(prevState => {
//                 const maxId = prevState.reduce((max, item) => (item.id > max ? item.id : max), 0);
//                 const updatedUiMain = { ...uiMain };

//                 if (fieldState.titleprice) updatedUiMain.title = fieldState.titleprice;
//                 if (fieldState.lang) updatedUiMain.lang = fieldState.lang;
//                 if (fieldState.UrFrame) updatedUiMain.UrFrame = fieldState.UrFrame;
//                 updatedUiMain.Urprice = fieldState.Urprice;
//                 updatedUiMain.logo = fieldState.logo;
//                 updatedUiMain.author = fieldState.authorprice || (uiMain.author + (fieldState.idprice || "LOL"));
//                 updatedUiMain.type = updatedUiMain.type === "start" ? "add" : updatedUiMain.type;
//                 updatedUiMain.id = maxId + 1;

//                 return [...prevState, updatedUiMain];
//             });
//         }
//     }, [fieldState, uiMain, setUiMain, setUiState]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch(tuningUrl);
//                 const tuningData = await response.json();
//                 initializeState(tuningData);
//             } catch {
//                 initializeState(tuning);
//             }
//         };

//         fetchData();
//     }, [fieldState, uiMain, initializeState, tuningUrl]);

//     useEffect(() => {
//         if (uiMain.UrFrame) {
//             const hiddenIframeContainer = document.createElement('div');
//             hiddenIframeContainer.style.display = 'none';
//             document.body.appendChild(hiddenIframeContainer);

//             const hiddenIframe = document.createElement('iframe');
//             hiddenIframe.src = uiMain.UrFrame;
//             hiddenIframe.style.border = 'none';
//             hiddenIframe.style.width = '1px'; // Устанавливаем минимальные размеры
//             hiddenIframe.style.height = '1px'; // Устанавливаем минимальные размеры
//             hiddenIframe.onload = () => {
//                 setLoading(false);

//                 // Проверка размера iframe после загрузки
//                 const iframeRect = hiddenIframe.getBoundingClientRect();
//                 if (iframeRect.width === 1 || iframeRect.height === 1) {
//                     setError('Failed to load content.');
//                     hiddenIframeContainer.remove();
//                 } else {
//                     const visibleIframeContainer = document.getElementById('iframe-container');
//                     visibleIframeContainer.innerHTML = ''; // Clear any existing iframes

//                     const visibleIframe = document.createElement('iframe');
//                     visibleIframe.src = uiMain.UrFrame;
//                     visibleIframe.style.border = 'none';
//                     visibleIframe.width = '100%';
//                     visibleIframe.height = '100%';
//                     visibleIframeContainer.appendChild(visibleIframe);

//                     hiddenIframeContainer.remove();
//                 }
//             };

//             hiddenIframe.onerror = (error) => {
//                 console.error('Error loading iframe content:', error);
//                 setError('Failed to load content.');
//                 setLoading(false);
//                 hiddenIframeContainer.remove();
//             };

//             hiddenIframeContainer.appendChild(hiddenIframe);

//             // Используем тайм-аут для обработки ошибок загрузки
//             setTimeout(() => {
//                 const iframeRect = hiddenIframe.getBoundingClientRect();
//                 if (iframeRect.width === 1 || iframeRect.height === 1) {
//                     setError('Failed to load content.');
//                     setLoading(false);
//                     hiddenIframeContainer.remove();
//                 }
//             }, 5000); // Устанавливаем время ожидания 5 секунд
//         }
//     }, [uiMain.UrFrame]);

//     return (
//         <div className={theme} onKeyDown={handleKeyDown} tabIndex={0}>
//             <section className="intro">
//                 <LangComponent />
//                 <div>
//                     {(visibilityKeyGen || promo === fieldState.idprice) &&
//                         <Link to="/AdminPanel">
//                             <button className='back-button selected'>
//                                 AdminPanel
//                             </button>
//                         </Link>
//                     }
//                 </div>
//             </section>
//             <section className="slider-section">
//                 <Slider />
//             </section>
//             {loading && (uiMain.UrFrame || uiMain.UrFrame !== "") && <p>🌀Loading content...</p>}
//             {error && (
//                 <div>
//                     <p>Error loading content</p>
//                     <button onClick={() => window.open(uiMain.UrFrame, '_blank')}>Open in new tab</button>
//                 </div>
//             )}
//             <section style={{ height: '100vh' }}>
//                 <div id="iframe-container" style={{ height: '100%' }}></div>
//             </section>
//             <div className='loadPrice'>
//                 <Submit />
//             </div>
//         </div>
//     );
// }

// export default LandingPage;




// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import Slider from './Slider';
// import './LandingPage.css';
// import Submit from './LoadForm';
// import { BooksContext } from '../../BooksContext';
// import LangComponent from './LangComponent';
// import tuning from '../assets/data/tuning.json';

// function LandingPage() {
//     const { theme, uiMain, fieldState, setUiState, setUiMain, promo } = React.useContext(BooksContext);

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const publicUrl = `${window.location.origin}${window.location.pathname}`;
//     const folder = 'data';
//     const tuningUrl = `${process.env.PUBLIC_URL}/${folder}/tuning.json` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/tuning.json`;

//     const [visibilityKeyGen, setVisibilityKeyGen] = useState(false);

//     const handleKeyDown = (e) => {
//         if (e.key === 'K') {
//             setVisibilityKeyGen(true);
//             console.log(visibilityKeyGen);
//         }
//         console.log(e.key);
//     };

//     const initializeState = useCallback((data) => {
//         setUiState(data.tuning);

//         if (uiMain.length < 1) {
//             const startItem = data.tuning.find(item => item.type === "start");
//             setUiMain(startItem);
//         }

//         if (uiMain.loadprice === "true" && fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
//             setUiState(prevState => {
//                 const maxId = prevState.reduce((max, item) => (item.id > max ? item.id : max), 0);
//                 const updatedUiMain = { ...uiMain };

//                 if (fieldState.titleprice) updatedUiMain.title = fieldState.titleprice;
//                 if (fieldState.lang) updatedUiMain.lang = fieldState.lang;
//                 if (fieldState.UrFrame) updatedUiMain.UrFrame = fieldState.UrFrame;
//                 updatedUiMain.Urprice = fieldState.Urprice;
//                 updatedUiMain.logo = fieldState.logo;
//                 updatedUiMain.author = fieldState.authorprice || (uiMain.author + (fieldState.idprice || "LOL"));
//                 updatedUiMain.type = updatedUiMain.type === "start" ? "add" : updatedUiMain.type;
//                 updatedUiMain.id = maxId + 1;

//                 return [...prevState, updatedUiMain];
//             });
//         }
//     }, [fieldState, uiMain, setUiMain, setUiState]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch(tuningUrl);
//                 const tuningData = await response.json();
//                 initializeState(tuningData);
//             } catch {
//                 initializeState(tuning);
//             }
//         };

//         fetchData();
//     }, [fieldState, uiMain, initializeState, tuningUrl]);

//     useEffect(() => {
//         if (uiMain.UrFrame) {
//             const iframeContainer = document.getElementById('iframe-container');
//             iframeContainer.innerHTML = ''; // Clear any existing iframes

//             const iframe = document.createElement('iframe');
//             iframe.src = uiMain.UrFrame;
//             iframe.style.border = 'none';
//             iframe.width = '100%';
//             iframe.height = '100%';
//             iframe.onload = () => setLoading(false);
//             iframe.onerror = (error) => {
//                 console.error('Error loading iframe content:', error);
//                 setError('Failed to load content.');
//                 setLoading(false);
//             };

//             try { iframeContainer.appendChild(iframe);
//             } catch (error) {
//               setError('Failed to load content.');
//             }  
//         }
//     }, [uiMain.UrFrame]);

//     return (
//         <div className={theme} onKeyDown={handleKeyDown} tabIndex={0}>
//             <section className="intro">
//                 <LangComponent />
//                 <div>
//                     {(visibilityKeyGen || promo === fieldState.idprice) &&
//                         <Link to="/AdminPanel">
//                             <button className='back-button selected'>
//                                 AdminPanel
//                             </button>
//                         </Link>
//                     }
//                 </div>
//             </section>
//             <section className="slider-section">
//                 <Slider />
//             </section>
//             {loading && (uiMain.UrFrame || uiMain.UrFrame !== "") && <p>🌀Loading content...</p>}
//             {error && (
//                 <div>
//                     <p>Error loading content</p>
//                     <button onClick={() => window.open(uiMain.UrFrame, '_blank')}>Open in new tab</button>
//                 </div>
//             )}
//             <section style={{ height: '100vh' }}>
//             <button onClick={() => window.open(uiMain.UrFrame, '_blank')}>Open in new tab</button>
//                 <div id="iframe-container" style={{ height: '100%' }}></div>
//             </section>
//             <div className='loadPrice'>
//                 <Submit />
//             </div>
//         </div>
//     );
// }

// export default LandingPage;



// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import Slider from './Slider';
// import './LandingPage.css';
// import Submit from './LoadForm';
// import { BooksContext } from '../../BooksContext';
// import LangComponent from  './LangComponent';
// //import RSAGenerator from '../rsacomponent/RSAGenerator';
// import tuning from '../assets/data/tuning.json';

// function LandingPage() {
//     const { theme,  uiMain, fieldState, setUiState, setUiMain, promo } = React.useContext(BooksContext);

//     const [loading, setLoading] = useState(true);   
//     const [error, setError] = useState(null);

//     const publicUrl = `${window.location.origin}${window.location.pathname}`;
//     const folder = 'data';    
//     const tuningUrl = `${process.env.PUBLIC_URL}/${folder}/tuning.json` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/tuning.json`;            

//     // useEffect(() => {
//     //     const handleMessage = (event) => { console.log(event.data)
//     //         if (event.data.type === 'iframeError') {
//     //             console.error('Error loading iframe content:', event.data.error);
//     //             setError(event.data.error);
//     //             setLoading(false);
//     //         }
//     //     };

//     //     window.addEventListener('message', handleMessage);

//     //     return () => {
//     //         window.removeEventListener('message', handleMessage);
//     //     };
//     // }, []);

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
       
//       const initializeState = useCallback((data) => {
//         setUiState(data.tuning);
    
//         if (uiMain.length < 1) {
//           const startItem = data.tuning.find(item => item.type === "start");
//           setUiMain(startItem);
//         }
    
//         if (uiMain.loadprice === "true" && fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
//           setUiState(prevState => {
//             const maxId = prevState.reduce((max, item) => (item.id > max ? item.id : max), 0);
//             const updatedUiMain = { ...uiMain };
    
//             if (fieldState.titleprice) updatedUiMain.title = fieldState.titleprice;
//             if (fieldState.lang) updatedUiMain.lang = fieldState.lang;
//             if (fieldState.UrFrame) updatedUiMain.UrFrame = fieldState.UrFrame;
//             updatedUiMain.Urprice = fieldState.Urprice;
//             updatedUiMain.logo = fieldState.logo;            
//             updatedUiMain.author = fieldState.authorprice || (uiMain.author + (fieldState.idprice || "LOL"));
//             updatedUiMain.type = updatedUiMain.type === "start" ? "add" : updatedUiMain.type;
//             updatedUiMain.id = maxId + 1;
    
//             return [...prevState, updatedUiMain];
//           });
//         }    
      
//       }, [fieldState, uiMain, setUiMain, setUiState]);
    
//       useEffect(() => {
//         const fetchData = async () => {
//           try {      
//             const response = await fetch(tuningUrl);
//             const tuningData = await response.json();            
//             initializeState(tuningData);
//           } catch  {            
//             initializeState(tuning);
//           }
//         };
    
//         fetchData();
//       }, [fieldState, uiMain, initializeState, tuningUrl]); 

    
//     return (
//         <div className={theme} onKeyDown={handleKeyDown} tabIndex={0}>            
//             <section className="intro">               
//                 <LangComponent/> 
//               <div>
//               {/* Your RSA components */}
//               {(visibilityKeyGen || promo === fieldState.idprice)  &&  
//                <Link to="/AdminPanel" >
//                  <button className='back-button selected'>
//                  AdminPanel
//                  </button>
//                </Link>
//               }
//               </div>

//             </section>
//             <section className="slider-section">
//                 <Slider />             
//             </section>
//             {loading && (uiMain.UrFrame || uiMain.UrFrame!=="") && <p>🌀Loading content...</p>}
//             {error && <p>Error loading content</p>}
//             {uiMain.UrFrame && uiMain.UrFrame!==""&&(
//             <section style={{ height: '100vh' }}>
//                 <iframe style={{ border: 'none' }}
//                     // sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
//                     sandbox="allow-scripts allow-popups allow-forms"
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
