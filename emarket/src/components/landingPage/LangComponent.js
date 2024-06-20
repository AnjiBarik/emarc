import React, { useState, useContext, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import { BooksContext } from '../../BooksContext';
import iconPath from '../utils/IconPath'; 
//import langicon from '../assets/iconimg/lang.png';
//import lang from '../assets/iconimg/lang.png';



const LangComponent = () => {
  const { uiState, uiMain, setUiMain, idLoudPrice } = useContext(BooksContext);
  const { author } = uiMain;
  const [activeLangId, setActiveLangId] = useState(null);
  const [visibilityKeyGen, setVisibilityKeyGen] = useState(false);

  //const lang = iconPath('lang.png') ||langicon ;
  const lang = iconPath('lang.png') ;  

  const renderLangButtons = () => {
    return uiState
      .filter(item => item.author === author)
      .map(item => (
        <button
          key={item.id}
          onClick={() => handleLangClick(item.id)}
          className={activeLangId === item.id ? 'selected-button selected' : 'selected-button'}
          style={{ cursor: 'pointer' }}
        >
          {item.lang}
        </button>
      ));
  };

  const handleLangClick = langId => {
    setActiveLangId(langId);
  
    const selectedLang = uiState.find(item => item.id === langId);    
    
    if (selectedLang) {     
      setUiMain(selectedLang)      
    }
  };

  useEffect(() => {
    setActiveLangId(uiMain.id);
  }, [uiMain]);
  
  const handleDoubleClick = () => {
    idLoudPrice && idLoudPrice > 0 ? 
    setVisibilityKeyGen(prevValue => !prevValue) :
    setVisibilityKeyGen(false);   
  };

  return (
    <div className='filters'  >
      <img className="back-button selected" src={lang} onDoubleClick={handleDoubleClick} alt='Language Selection' />      
      {visibilityKeyGen   &&  
               <Link to="/AdminPanel" >
                 <button className='back-button selected'>
                 AdminPanel
                 </button>
               </Link>
              }
      {renderLangButtons()}
     
    </div>
  );
};

export default LangComponent;