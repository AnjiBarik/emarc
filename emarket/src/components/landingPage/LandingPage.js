import React, { useState, useEffect, useCallback } from 'react';
import Slider from './Slider';
import './LandingPage.css';
import Submit from './LoadForm';
import { BooksContext } from '../../BooksContext';
import LangComponent from  './LangComponent';
import tuning from '../assets/data/tuning.json';

function LandingPage() {
    const { theme,  uiMain, fieldState, setUiState, setUiMain } = React.useContext(BooksContext);

    const [loading, setLoading] = useState(true);       

    const publicUrl = `${window.location.origin}${window.location.pathname}`;
    const folder = 'data';    
    const tuningUrl = `${process.env.PUBLIC_URL}/${folder}/tuning.json` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/tuning.json`;            

    const handleLoad = () => {
        setLoading(false);
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
        <div className={theme} tabIndex={0}>            
            <section className="intro">               
                <LangComponent/> 
            </section>
            <section className="slider-section">
                <Slider />             
            </section>           
            {loading && (uiMain.UrFrame || uiMain.UrFrame!=="") && <p>🌀Loading content...</p>}           
            {uiMain.UrFrame && uiMain.UrFrame!==""&&(
            <>  
            <button className='selected-button' onClick={() => window.open(uiMain.UrFrame, '_blank')}>Open in new tab</button>
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
            </>
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