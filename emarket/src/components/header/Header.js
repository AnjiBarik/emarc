import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import './header.css';

export default function Header() {
  const { theme, setTheme, uiState, idLoudPrice, setUiMain, uiMain, setSelectUiState } = React.useContext(BooksContext);

  const {    
    email,    
    dark,
    light,
    inst,
    face,
    telegram,
    fone,
    tik,
    you,
    card,
    location,
    about, } = useIcons();
      
  const [logo, setLogo] = useState('');
  const [title, setTitle] = useState('');  

  useEffect(() => {
    const selectedUiState = uiState[idLoudPrice - 1] || uiState.find(item => item.type === "start") || uiState[0];
    if (selectedUiState) {    
      const publicUrl = `${window.location.origin}${window.location.pathname}`; 
      setLogo((selectedUiState.logopablic ? `${process.env.PUBLIC_URL}/logoimg/${selectedUiState.logopablic}`|| `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}logoimg/${selectedUiState.logopablic}` : selectedUiState.logo))
      setTitle(selectedUiState.title);
      setSelectUiState(selectedUiState)
    }
  }, [idLoudPrice, uiState, setSelectUiState]);

  const toggleTheme = () => {
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
  };

  const HandleLoad = () => {
    // setUiMain(uiState[idLoudPrice - 1] || uiState.filter(item => item.type === "start")[0] || uiState[0]);
    setUiMain(uiState[idLoudPrice - 1] || uiState.find(item => item.type === "start") || uiState[0]);
  };

  const [currentLink, setCurrentLink] = useState(null);
  const [currentButtonIndex, setCurrentButtonIndex] = useState(null);

  const handleButtonClick = (link, index) => {
    if (currentButtonIndex === index && currentLink === link) {      
      setCurrentLink(null);
      setCurrentButtonIndex(null);
    } else {      
      setCurrentLink(link);
      setCurrentButtonIndex(index);
    }
  }; 

  return (
    <section className={theme}>
      <section className='header'>       
        <section className="header-left">
           <Link to="/" className='sort-button selected'>
             <div onClick={HandleLoad}>
               {logo ? (
                 <img className='artmini selected' src={logo} alt={title} />
               ) : (
                 <h1>{title}</h1>
               )}
             </div>
           </Link>
           <button className='sort-button selected' onClick={toggleTheme}>
             {theme === 'light' && (
               <img className="back-button" src={dark} alt="dark theme"/>
             )}
             {theme !== 'light' && (
               <img className="back-button" src={light} alt="light theme"/>
             )}
           </button>
         </section>          
        <section className="header-right">
          {((uiMain.fone && uiMain.fone !== "") || 
            (uiMain.inst && uiMain.inst !== "") || 
            (uiMain.face && uiMain.face !== "") || 
            (uiMain.telegram && uiMain.telegram !== "") ||
            (uiMain.email && uiMain.email !== "") ||
            (uiMain.tik && uiMain.tik !== "") ||
            (uiMain.you && uiMain.you !== "") ||
            (uiMain.card && uiMain.card !== "") ||
            (uiMain.location && uiMain.location !== "") ||
            (uiMain.about && uiMain.about !== "")) && (
              <>
                {uiMain.fone && uiMain.fone !== "" && (
                  <div>                    
                      <img src={fone} className="back-button selected" onClick={() => handleButtonClick(uiMain.fone, 0)} alt={uiMain.fone}/>                   
                    {currentButtonIndex === 0 && (
                      <a href={`tel:${currentLink}`} target="_blank" rel="noopener noreferrer">
                      <b> {currentLink} </b> 
                      </a>
                    )}
                  </div>
                )}
                {uiMain.inst && uiMain.inst !== "" && (
                  <div>                    
                      <img src={inst} className="back-button selected" onClick={() => handleButtonClick(uiMain.inst, 1)} alt={uiMain.inst}/>                   
                    {currentButtonIndex === 1 && (
                      <a href={`https://www.instagram.com/${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.face && uiMain.face !== "" && (
                  <div>                    
                      <img src={face} className="back-button selected" onClick={() => handleButtonClick(uiMain.face, 2)} alt={uiMain.face}/>                   
                    {currentButtonIndex === 2 && (
                      <a href={`https://www.facebook.com/${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.telegram && uiMain.telegram !== "" && (
                  <div>                   
                      <img src={telegram} className="back-button selected" onClick={() => handleButtonClick(uiMain.telegram, 3)} alt={uiMain.telegram}/>                  
                    {currentButtonIndex === 3 && (
                      <a href={`https://t.me/${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.email && uiMain.email !== "" && (
                  <div>                    
                      <img src={email} className="back-button selected" onClick={() => handleButtonClick(uiMain.email, 4)} alt={uiMain.email}/>                  
                    {currentButtonIndex === 4 && (
                      <a href={`mailto:${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.tik && uiMain.tik !== "" && (
                  <div>                    
                      <img src={tik} className="back-button selected" onClick={() => handleButtonClick(uiMain.tik, 5)} alt={uiMain.tik}/>                  
                    {currentButtonIndex === 5 && (
                      <a href={`https://www.tiktok.com/${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.you && uiMain.you !== "" && (
                  <div>                   
                      <img src={you} className="back-button selected" onClick={() => handleButtonClick(uiMain.you, 6)} alt={uiMain.you}/>                  
                    {currentButtonIndex === 6 && (
                      <a href={`https://www.youtube.com/${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.card && uiMain.card !== "" && (
                  <div>                   
                      <img src={card} className="back-button selected" onClick={() => handleButtonClick(uiMain.card, 7)} alt={uiMain.card}/>                    
                    {currentButtonIndex === 7 && (
                      <a href={currentLink} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.location && uiMain.location !== "" && (
                  <div>                   
                      <img src={location} className="back-button selected" onClick={() => handleButtonClick(uiMain.location, 8)} alt={uiMain.location}/>                  
                    {currentButtonIndex === 8 && (
                      <a href={`https://maps.google.com/?q=${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.about && uiMain.about !== "" && (
                  <div>                   
                      <img src={about} className="back-button selected" onClick={() => handleButtonClick(uiMain.about, 9)} alt={uiMain.about}/>                  
                    {currentButtonIndex === 9 && (
                      <a href={currentLink} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
        </section>
      </section>
    </section>
  );
}