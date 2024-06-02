import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { BooksContext } from '../../BooksContext';
import IconPath from '../book-list/IconPath'; 
import './header.css';
import dark from '../cart/img/dark.png';
import light from '../cart/img/light.png';
import inst from '../cart/img/inst.png';
import face from '../cart/img/face.png';
import telegram from '../cart/img/telegram.png';
import fone from '../cart/img/fone.png';
import email from '../cart/img/email.png';
import tik from '../cart/img/tik.png';
import you from '../cart/img/you.png';
import card from '../cart/img/card.png';
import location from '../cart/img/location.png';
import about from '../cart/img/about.png';


export default function Header() {
  const { theme, setTheme, uiState, idLoudPrice, setUiMain, uiMain } = React.useContext(BooksContext);
  //const { logo, title } = uiState[idLoudPrice - 1] || uiState.filter(item => item.type === "start")[0];

  const [logo, setLogo] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const selectedUiState = uiState[idLoudPrice - 1] || uiState.find(item => item.type === "start");
    if (selectedUiState) {
      //setLogo(selectedUiState.logo);
      setLogo((selectedUiState.logopablic ? `${process.env.PUBLIC_URL}/logoimg/${selectedUiState.logopablic}` : selectedUiState.logo))
      setTitle(selectedUiState.title);
    }
  }, [idLoudPrice, uiState]);



  //  const { logo, title } = uiState[idLoudPrice - 1] || (uiState.length > 0 && uiState.find(item => item.type === "start")) || {};

//  dark = IconPath('dark.png') || dark;  
//  light = IconPath('light.png') || light; 
//  inst = IconPath('inst.png') || inst;
//  face = IconPath('face.png') || face;
//  telegram = IconPath('telegram.png') || telegram;
//  fone = IconPath('fone.png') || fone;
//  email = IconPath('email.png') || email;
//  tik = IconPath('tik.png') || tik;
//  you = IconPath('you.png') || you;
//  card = IconPath('card.png') || card;
//  location = IconPath('location.png') || location;
//  about = IconPath('about.png') || about;


  const toggleTheme = () => {
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
  };

  const HandleLoad = () => {
    setUiMain(uiState[idLoudPrice - 1] || uiState.filter(item => item.type === "start")[0]);
  };

  const [currentLink, setCurrentLink] = useState(null);
  const [currentButtonIndex, setCurrentButtonIndex] = useState(null);

  const handleButtonClick = (link, index) => {
    if (currentButtonIndex === index && currentLink === link) {
      // Если текущая ссылка уже открыта, закрываем её
      setCurrentLink(null);
      setCurrentButtonIndex(null);
    } else {
      // Если текущая ссылка не совпадает с новой, открываем новую ссылку
      setCurrentLink(link);
      setCurrentButtonIndex(index);
    }
  };

  return (
    <section className={theme}>
      <section className='header'>
        {/* Левая часть хедера */}
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
        {/* Правая часть хедера */}
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
                    <button className='sort-button' onClick={() => handleButtonClick(uiMain.fone, 0)}>
                      <img src={fone} className="back-button" alt={uiMain.fone}/>
                    </button>
                    {currentButtonIndex === 0 && (
                      <a href={`tel:${currentLink}`} target="_blank" rel="noopener noreferrer">
                      <b> {currentLink} </b> 
                      </a>
                    )}
                  </div>
                )}
                {uiMain.inst && uiMain.inst !== "" && (
                  <div>
                    <button className='sort-button' onClick={() => handleButtonClick(uiMain.inst, 1)}>
                      <img src={inst} className="back-button" alt={uiMain.inst}/>
                    </button>
                    {currentButtonIndex === 1 && (
                      <a href={`https://www.instagram.com/${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.face && uiMain.face !== "" && (
                  <div>
                    <button className='sort-button' onClick={() => handleButtonClick(uiMain.face, 2)}>
                      <img src={face} className="back-button" alt={uiMain.face}/>
                    </button>
                    {currentButtonIndex === 2 && (
                      <a href={`https://www.facebook.com/${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.telegram && uiMain.telegram !== "" && (
                  <div>
                    <button className='sort-button' onClick={() => handleButtonClick(uiMain.telegram, 3)}>
                      <img src={telegram} className="back-button" alt={uiMain.telegram}/>
                    </button>
                    {currentButtonIndex === 3 && (
                      <a href={`https://t.me/${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.email && uiMain.email !== "" && (
                  <div>
                    <button className='sort-button' onClick={() => handleButtonClick(uiMain.email, 4)}>
                      <img src={email} className="back-button" alt={uiMain.email}/>
                    </button>
                    {currentButtonIndex === 4 && (
                      <a href={`mailto:${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.tik && uiMain.tik !== "" && (
                  <div>
                    <button className='sort-button' onClick={() => handleButtonClick(uiMain.tik, 5)}>
                      <img src={tik} className="back-button" alt={uiMain.tik}/>
                    </button>
                    {currentButtonIndex === 5 && (
                      <a href={`https://www.tiktok.com/${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.you && uiMain.you !== "" && (
                  <div>
                    <button className='sort-button' onClick={() => handleButtonClick(uiMain.you, 6)}>
                      <img src={you} className="back-button" alt={uiMain.you}/>
                    </button>
                    {currentButtonIndex === 6 && (
                      <a href={`https://www.youtube.com/${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.card && uiMain.card !== "" && (
                  <div>
                    <button className='sort-button' onClick={() => handleButtonClick(uiMain.card, 7)}>
                      <img src={card} className="back-button" alt={uiMain.card}/>
                    </button>
                    {currentButtonIndex === 7 && (
                      <a href={currentLink} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.location && uiMain.location !== "" && (
                  <div>
                    <button className='sort-button' onClick={() => handleButtonClick(uiMain.location, 8)}>
                      <img src={location} className="back-button" alt={uiMain.location}/>
                    </button>
                    {currentButtonIndex === 8 && (
                      <a href={`https://maps.google.com/?q=${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.about && uiMain.about !== "" && (
                  <div>
                    <button className='sort-button' onClick={() => handleButtonClick(uiMain.about, 9)}>
                      <img src={about} className="back-button" alt={uiMain.about}/>
                    </button>
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



// import React, { useState } from 'react';
// import './header.css';
// import dark from '../cart/img/dark.png';
// import light from '../cart/img/light.png';
// import { Link } from "react-router-dom";
// import { BooksContext } from '../../BooksContext';
// import inst from '../cart/img/inst.png';
// import face from '../cart/img/face.png';
// import telegram from '../cart/img/telegram.png';
// import fone from '../cart/img/fone.png';
// import email from '../cart/img/email.png';
// import tik from '../cart/img/tik.png';
// import you from '../cart/img/you.png';
// import card from '../cart/img/card.png';
// import location from '../cart/img/location.png';

// export default function Header() {
//   const { theme, setTheme, uiState, idLoudPrice, setUiMain, uiMain } = React.useContext(BooksContext);
//   const { logo, title } = uiState[idLoudPrice - 1] || uiState.filter(item => item.type === "start")[0];
  
//   const toggleTheme = () => {
//     setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const HandleLoad = () => {
//     setUiMain(uiState[idLoudPrice - 1] || uiState.filter(item => item.type === "start")[0]);
//   };

//   const [currentLink, setCurrentLink] = useState(null);
//   const [currentButtonIndex, setCurrentButtonIndex] = useState(null);

//   const handleButtonClick = (link, index) => {
//     if (currentButtonIndex === index && currentLink === link) {
//       // Если текущая ссылка уже открыта, закрываем её
//       setCurrentLink(null);
//       setCurrentButtonIndex(null);
//     } else {
//       // Если текущая ссылка не совпадает с новой, открываем новую ссылку
//       setCurrentLink(link);
//       setCurrentButtonIndex(index);
//     }
//   };

//   return (
//     <section className={theme}>
//       <section className='header'>
//         {/* Левая часть хедера */}
        // <section className="header-left">
        //    <Link to="/" className='sort-button selected'>
        //      <div onClick={HandleLoad}>
        //        {logo ? (
        //          <img className='artmini selected' src={logo} alt={title} />
        //        ) : (
        //          <h1>{title}</h1>
        //        )}
        //      </div>
        //    </Link>
        //    <button className='sort-button selected' onClick={toggleTheme}>
        //      {theme === 'light' && (
        //        <img className="back-button" src={dark} alt="dark theme"/>
        //      )}
        //      {theme !== 'light' && (
        //        <img className="back-button" src={light} alt="light theme"/>
        //      )}
        //    </button>
        //  </section>   
                
//         {/* Правая часть хедера */}
//         <section className="header-right">
//           {((uiMain.fone && uiMain.fone !== "") || 
//             (uiMain.inst && uiMain.inst !== "") || 
//             (uiMain.face && uiMain.face !== "") || 
//             (uiMain.telegram && uiMain.telegram !== "") ||
//             (uiMain.email && uiMain.email !== "") ||
//             (uiMain.tik && uiMain.tik !== "") ||
//             (uiMain.you && uiMain.you !== "") ||
//             (uiMain.card && uiMain.card !== "") ||
//             (uiMain.location && uiMain.location !== "")) && (
//               <>
//                 {uiMain.fone && uiMain.fone !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={() => handleButtonClick(uiMain.fone, 0)}>
//                       <img src={fone} className="back-button" alt={uiMain.fone}/>
//                     </button>
//                     {currentButtonIndex === 0 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//                 {uiMain.inst && uiMain.inst !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={() => handleButtonClick(uiMain.inst, 1)}>
//                       <img src={inst} className="back-button" alt={uiMain.inst}/>
//                     </button>
//                     {currentButtonIndex === 1 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//                 {uiMain.face && uiMain.face !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={() => handleButtonClick(uiMain.face, 2)}>
//                       <img src={face} className="back-button" alt={uiMain.face}/>
//                     </button>
//                     {currentButtonIndex === 2 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//                 {uiMain.telegram && uiMain.telegram !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={() => handleButtonClick(uiMain.telegram, 3)}>
//                       <img src={telegram} className="back-button" alt={uiMain.telegram}/>
//                     </button>
//                     {currentButtonIndex === 3 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//                 {uiMain.email && uiMain.email !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={() => handleButtonClick(uiMain.email, 4)}>
//                       <img src={email} className="back-button" alt={uiMain.email}/>
//                     </button>
//                     {currentButtonIndex === 4 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//                 {uiMain.tik && uiMain.tik !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={() => handleButtonClick(uiMain.tik, 5)}>
//                       <img src={tik} className="back-button" alt={uiMain.tik}/>
//                     </button>
//                     {currentButtonIndex === 5 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//                 {uiMain.you && uiMain.you !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={() => handleButtonClick(uiMain.you, 6)}>
//                       <img src={you} className="back-button" alt={uiMain.you}/>
//                     </button>
//                     {currentButtonIndex === 6 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//                 {uiMain.card && uiMain.card !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={()=> handleButtonClick(uiMain.card, 7)}>
//                       <img src={card} className="back-button" alt={uiMain.card}/>
//                     </button>
//                     {currentButtonIndex === 7 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//                 {uiMain.location && uiMain.location !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={() => handleButtonClick(uiMain.location, 8)}>
//                       <img src={location} className="back-button" alt={uiMain.location}/>
//                     </button>
//                     {currentButtonIndex === 8 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//               </>
//             )}
//         </section>
//       </section>
//     </section>
//   );
// }




// import React, { useState } from 'react';
// import './header.css';
// import dark from '../cart/img/dark.png';
// import light from '../cart/img/light.png';
// import { Link } from "react-router-dom";
// import { BooksContext } from '../../BooksContext';
// import inst from '../cart/img/inst.png';
// import face from '../cart/img/face.png';
// import tik from '../cart/img/tik.png';
// import you from '../cart/img/you.png';
// import telegram from '../cart/img/telegram.png';
// import fone from '../cart/img/fone.png';
// import email from '../cart/img/email.png';

// export default function Header() {
//   const { theme, setTheme, uiState, idLoudPrice, setUiMain, uiMain } = React.useContext(BooksContext);
//   const { logo, title } = uiState[idLoudPrice - 1] || uiState.filter(item => item.type === "start")[0];
  
//   const toggleTheme = () => {
//     setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const HandleLoad = () => {
//     setUiMain(uiState[idLoudPrice - 1] || uiState.filter(item => item.type === "start")[0]);
//   };

//   const [currentLink, setCurrentLink] = useState(null);
//   const [currentButtonIndex, setCurrentButtonIndex] = useState(null);

//   const handleButtonClick = (link, index) => {
//     if (currentButtonIndex === index && currentLink === link) {
//       // Если текущая ссылка уже открыта, закрываем её
//       setCurrentLink(null);
//       setCurrentButtonIndex(null);
//     } else {
//       // Если текущая ссылка не совпадает с новой, открываем новую ссылку
//       setCurrentLink(link);
//       setCurrentButtonIndex(index);
//     }
//   };

//   return (
//     <section className={theme}>
//       <section className='header'>
//         {/* Ліва частина хедера */}
//         <section className="header-left">
//           <Link to="/" className='sort-button selected'>
//             <div onClick={HandleLoad}>
//               {logo ? (
//                 <img className='artmini selected' src={logo} alt={title} />
//               ) : (
//                 <h1>{title}</h1>
//               )}
//             </div>
//           </Link>
//           <button className='sort-button selected' onClick={toggleTheme}>
//             {theme === 'light' && (
//               <img className="back-button" src={dark} />
//             )}
//             {theme !== 'light' && (
//               <img className="back-button" src={light} />
//             )}
//           </button>
//         </section>   
//         {/* Права частина хедера */}
//         <section className="header-right">
//           {((uiMain.fone && uiMain.fone !== "") || 
//             (uiMain.inst && uiMain.inst !== "") || 
//             (uiMain.face && uiMain.face !== "") || 
//             (uiMain.telegram && uiMain.telegram !== "")) && (
//               <>
//                 {uiMain.fone && uiMain.fone !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={() => handleButtonClick(uiMain.fone, 0)}>
//                       <img src={fone} className="back-button" alt={uiMain.fone}/>
//                     </button>
//                     {currentButtonIndex === 0 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//                 {uiMain.inst && uiMain.inst !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={() => handleButtonClick(uiMain.inst, 1)}>
//                       <img src={inst} className="back-button" alt={uiMain.inst}/>
//                     </button>
//                     {currentButtonIndex === 1 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//                 {uiMain.face && uiMain.face !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={() => handleButtonClick(uiMain.face, 2)}>
//                       <img src={face} className="back-button" alt={uiMain.face}/>
//                     </button>
//                     {currentButtonIndex === 2 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//                 {uiMain.telegram && uiMain.telegram !== "" && (
//                   <div>
//                     <button className='sort-button' onClick={() => handleButtonClick(uiMain.telegram, 3)}>
//                       <img src={telegram} className="back-button" alt={uiMain.telegram}/>
//                     </button>
//                     {currentButtonIndex === 3 && (
//                       <a href={currentLink} target="_blank" rel="noopener noreferrer">
//                         {currentLink}
//                       </a>
//                     )}
//                   </div>
//                 )}
//               </>
//             )}
//         </section>
//       </section>
//     </section>
//   );
// }





// import React, { useState } from 'react';
// import './header.css';
// import dark from '../cart/img/dark.png';
// import light from '../cart/img/light.png';

// import { Link } from "react-router-dom";
// import { BooksContext } from '../../BooksContext';
// import inst from '../cart/img/inst.png';
// import face from '../cart/img/face.png';
// import tik from '../cart/img/tik.png';
// import you from '../cart/img/you.png';
// import telegram from '../cart/img/telegram.png';
// import fone from '../cart/img/fone.png';
// import email from '../cart/img/email.png';

// export default function Header() {
 
  
 
//   const { theme, setTheme, uiState, idLoudPrice, setUiMain, uiMain  } = React.useContext(BooksContext);
//   const { logo, title} = (uiState[idLoudPrice-1]||uiState.filter(item => item.type === "start")[0]);
//   console.log(uiState[idLoudPrice-1])
//   console.log(idLoudPrice)
//   console.log(idLoudPrice-1)
//  const toggleTheme = () => {
//   setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
// };

 
 

// const HandleLoad=()=>{
//   setUiMain(uiState[idLoudPrice-1]||uiState.filter(item => item.type === "start")[0])
// }
  
// console.log(uiMain.fone)

// const [isLinkOpen, setIsLinkOpen] = useState(false);
//   const [currentLink, setCurrentLink] = useState('');

//   const handleButtonClick = (link) => {
//     setCurrentLink(link);
//     setIsLinkOpen(prevState => !prevState);
//   };

//   return (
//     <>
//     <section className={theme}>
//     <section className='header'>
//       {/* Ліва частина хедера */}
//       <section className="header-left">
       
//         <Link to="/">

//         <div onClick={HandleLoad}>
//       {/* Отображаем логотип, если он есть, иначе отображаем название */}
//       {logo ? (
//         <img src={logo} alt={title} />
//       ) : (
//         <h1>{title}</h1>
//       )}

     
//     </div>
//         </Link>
      
//         {/* <LangComponent/> */}
     
         
//       <button className='sort-button selected'>
//             {theme === 'light' &&( <img className="back-button" src={dark} onClick={toggleTheme}/> )}
//             {theme !== 'light' &&(<img className="back-button" src={light} onClick={toggleTheme}/>)}

//           </button>
         
//           </section>   
//       {/* Права частина хедера */}
//       <section className="header-right">
// {/* {uiMain.fone&&uiMain.fone!==""&&(<button className='sort-button'><img src={fone} className="back-button" alt={uiMain.fone}/></button>)} */}
      
// {((uiMain.fone && uiMain.fone !== "") ||
      
//        (uiMain.inst && uiMain.inst !== "") ||
//        (uiMain.face && uiMain.face !== "") ||
//        (uiMain.telegram && uiMain.telegram !== "")) && (
//         <>
//           {uiMain.fone && uiMain.fone !== "" && (
//             <button className='sort-button' onClick={() => handleButtonClick(uiMain.fone)}>
//               <img src={fone} className="back-button" alt={uiMain.fone}/>
//             </button>
//           )}
//           {uiMain.inst && uiMain.inst !== "" && (
//             <button className='sort-button' onClick={() => handleButtonClick(uiMain.inst)}>
//                <img src={inst} className="back-button" alt={uiMain.inst}/>
//             </button>
//           )}
//           {uiMain.face && uiMain.face !== "" && (
//             <button className='sort-button' onClick={() => handleButtonClick(uiMain.face)}>
//               <img src={face} className="back-button" alt={uiMain.face}/>
//             </button>
//           )}
//           {uiMain.telegram && uiMain.telegram !== "" && (
//             <button className='sort-button' onClick={() => handleButtonClick(uiMain.telegram)}>
//                <img src={telegram} className="back-button" alt={uiMain.telegram}/>
//             </button>
//           )}
//           {isLinkOpen && (
//             <a href={currentLink} target="_blank" rel="noopener noreferrer">
//               {currentLink}
//             </a>
//           )}
//         </>
//       )}
      
//       </section>
//       </section>
//       </section>
//     </>
//   );
// }