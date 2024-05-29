import React, { useState, useContext, useEffect  } from 'react';
import { BooksContext } from '../../BooksContext';
import langicon from '../cart/img/lang.png';
import IconPath from '../book-list/IconPath'; 

const LangComponent = () => {
  const { uiState, uiMain, setUiMain } = useContext(BooksContext);
  const { author } = uiMain;
  const [activeLangId, setActiveLangId] = useState(null);

 const lang = IconPath('lang.png') || langicon;

  console.log(lang)

  // Функция для отображения кнопок с языками
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

  // Обработчик нажатия на кнопку языка
  const handleLangClick = langId => {
    setActiveLangId(langId);

    // Находим объект в uiState по id и устанавливаем uiMain
    const selectedLang = uiState.find(item => item.id === langId);
    // если найдено совпадение по id, то устанавливаем uiMain, иначе не делаем ничего
    //console.log(uiMain)
    //console.log(selectedLang)
    
    if (selectedLang) {
      // Устанавливаем новый uiMain с отфильтрованным uiState
      setUiMain(selectedLang)
      // setUiMain({
      //   ...uiMain,
      //   ...selectedLang,
      // });
      //console.log(uiMain)
    }
  };

  useEffect(() => {
    setActiveLangId(uiMain.id);
  }, [uiMain]);

  return (
    <div className='filters'>
      <img className="back-button selected" src={lang} alt='Language Selection'/>
      {/* <img className="back-button selected" src={`${process.env.PUBLIC_URL}/img/lang.png`} alt='Language Selection'/> */}
      {/* Отображаем кнопки с языками */}
      {renderLangButtons()}
    </div>
  );
};

export default LangComponent;


// import React, { useContext } from 'react';
// import { BooksContext } from '../../BooksContext';

// const Lang = () => {
//   const { uiState, uiMain } = useContext(BooksContext);

//   const { logo, title, author } = uiMain;

//   // Функция для отображения кнопок с языками
//   const renderLangButtons = () => {
//     return uiState.filter(item => item.author === author).map((item, index) => (
//       <button key={index}>{item.lang}</button>
//     ));
//   };

//   return (
//     <div>
//       {/* Отображаем логотип, если он есть, иначе отображаем название */}
//       {logo ? (
//         <img src={logo} alt={title} />
//       ) : (
//         <h1>{title}</h1>
//       )}

//       {/* Отображаем кнопки с языками */}
//       {renderLangButtons()}
//     </div>
//   );
// };

// export default Lang;