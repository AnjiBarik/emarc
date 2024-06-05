import React, { createContext, useState } from 'react';
//import tuning from '../src/components/book-list/tuning.json';


const BooksContext = createContext();

const BooksProvider = ({ children }) => {
  // const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [specificBook, setSpecificBook] = useState([]);
  const [fieldState, setFieldState] = useState({});
  const [uiState, setUiState] = useState([]);
  const [uiMain, setUiMain] = useState([]);
  const [idLoudPrice, setIdLoudPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [theme, setTheme] = useState('light');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [message, setMessage] = useState('');
  const [promo, setPromo] = useState('');
  const [order, setOrder] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [savedLogin, setSavedLogin] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const [filterBooks, setFilterBooks] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubsection, setSelectedSubsection] = useState(null);
  //const [sortedBooks, setSortedBooks] = useState([]);
  const [input, setInput] = useState('');
  const [selectedTags1, setSelectedTags1] = useState([]);
  const [selectedTags2, setSelectedTags2] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedTags3, setSelectedTags3] = useState([]);
  const [selectedTags4, setSelectedTags4] = useState([]);
  const [glsearch, setSearch] = useState("");
  const [searchOptions, setSearchOptions] = useState({
    byTitle: true,
    byID: true,
    byAuthor: true,
    byTags: false,
    byDescription: false
  });

  // const tuningUrl = `${process.env.PUBLIC_URL}/data/tuning.json`;
  // console.log(tuningUrl)

//!   
  // const initializeState = useCallback((data) => {
  //   setUiState(data.tuning);

  //   if (uiMain.length < 1) {
  //     const startItem = data.tuning.find(item => item.type === "start");
  //     setUiMain(startItem);
  //   }

  //   if (uiMain.loadprice === "true" && fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
  //     setUiState(prevState => {
  //       const maxId = prevState.reduce((max, item) => (item.id > max ? item.id : max), 0);
  //       const updatedUiMain = { ...uiMain };

  //       if (fieldState.titleprice) updatedUiMain.title = fieldState.titleprice;
  //       if (fieldState.lang) updatedUiMain.lang = fieldState.lang;
  //       if (fieldState.UrFrame) updatedUiMain.UrFrame = fieldState.UrFrame;
  //       updatedUiMain.Urprice = fieldState.Urprice;
  //       updatedUiMain.logo = fieldState.logo;
  //       updatedUiMain.author = fieldState.author || (uiMain.author + (fieldState.idprice || "LOL"));
  //       updatedUiMain.type = updatedUiMain.type === "start" ? "add" : updatedUiMain.type;
  //       updatedUiMain.id = maxId + 1;

  //       return [...prevState, updatedUiMain];
  //     });
  //   }

  //   setLoading(false);
  // }, [fieldState, uiMain]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(tuningUrl);
  //       const tuningData = await response.json();
  //       console.log(tuningData)
  //       initializeState(tuningData);
  //     } catch  {
  //     // } catch (err) {
  //       //console.log(err.message);
  //       console.log(tuning)
  //       initializeState(tuning);
  //     }
  //   };

  //   fetchData();
  // }, [fieldState, uiMain, initializeState, tuningUrl]);  


// const initializeState = (data) => {
//   setUiState(data.tuning);

//   if (uiMain.length < 1) {
//     const startItem = data.tuning.find(item => item.type === "start");
//     setUiMain(startItem);
//   }

//   if (uiMain.loadprice === "true" && fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
//     setUiState(prevState => {
//       const maxId = prevState.reduce((max, item) => (item.id > max ? item.id : max), 0);
//       const updatedUiMain = { ...uiMain };

//       if (fieldState.titleprice) updatedUiMain.title = fieldState.titleprice;
//       if (fieldState.lang) updatedUiMain.lang = fieldState.lang;
//       if (fieldState.UrFrame) updatedUiMain.UrFrame = fieldState.UrFrame;
//       updatedUiMain.Urprice = fieldState.Urprice;
//       updatedUiMain.logo = fieldState.logo;
//       updatedUiMain.author = fieldState.author || (uiMain.author + (fieldState.idprice || "LOL"));
//       updatedUiMain.type = updatedUiMain.type === "start" ? "add" : updatedUiMain.type;
//       updatedUiMain.id = maxId + 1;

//       return [...prevState, updatedUiMain];
//     });
//   }

//   setLoading(false);
// };

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await fetch(tuningUrl);
//       const tuningData = await response.json();
//       initializeState(tuningData);
//     } catch (err) {
//       console.log(err.message);
//       initializeState(tuning);
//     }
//   };

//   fetchData();
// }, [fieldState, uiMain]);


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch data
//         //const response = await fetch('/emarc/data/tuning.json');
//         const response = await fetch(tuningUrl);
//         const tuning = await response.json();
// console.log(tuning)
//         setUiState(tuning.tuning);

//         if (uiMain.length < 1) {
//           const startItem = tuning.tuning.find(item => item.type === "start");
//           setUiMain(startItem);
//         }

//         // Update UI state
//         if (uiMain.loadprice === "true" && fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
//           setUiState(prevState => {
//             const maxId = prevState.reduce((max, item) => (item.id > max ? item.id : max), 0);
//             const updatedUiMain = { ...uiMain };

//             if (fieldState.titleprice) updatedUiMain.title = fieldState.titleprice;
//             if (fieldState.lang) updatedUiMain.lang = fieldState.lang;
//             if (fieldState.UrFrame) updatedUiMain.UrFrame = fieldState.UrFrame;
//             updatedUiMain.Urprice = fieldState.Urprice;
//             updatedUiMain.logo = fieldState.logo;
//             updatedUiMain.author = fieldState.author || (uiMain.author + (fieldState.idprice || "LOL"));
//             updatedUiMain.type = updatedUiMain.type === "start" ? "add" : updatedUiMain.type;
//             updatedUiMain.id = maxId + 1;

//             return [...prevState, updatedUiMain];
//           });
//         }

//         setLoading(false);
//       } catch (err) {
//         console.log(err.message);
//       }
//     };

//     fetchData();
//   }, [fieldState, uiMain]);

const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const contextValue = {
    message, setMessage, promo, setPromo, order, setOrder, loggedIn, setLoggedIn, savedLogin, setSavedLogin, savedPassword, setSavedPassword,
    totalPrice, setTotalPrice, cartItems, setCartItems, theme, setTheme, totalCount, setTotalCount, books, setBooks,
    specificBook, setSpecificBook, filterBooks, setFilterBooks, selectedSection, setSelectedSection,
    selectedSubsection, setSelectedSubsection, input, setInput, selectedTags1, setSelectedTags1, selectedTags2, setSelectedTags2,
    selectedSizes, setSelectedSizes, selectedColor, setSelectedColor, glsearch, setSearch, searchOptions, setSearchOptions,
    uiState, setUiState, uiMain, setUiMain, fieldState, setFieldState, idLoudPrice, setIdLoudPrice, selectedTags3, setSelectedTags3,
    selectedTags4, setSelectedTags4, showRegistrationForm, setShowRegistrationForm
  };

  // if (loading) {
  //   return <div>...Loading...</div>;
  // }

  return (
    <BooksContext.Provider value={contextValue}>
      {children}
    </BooksContext.Provider>
  );
};

export { BooksContext, BooksProvider };


// import React, { createContext, useState, useEffect } from 'react';
// import tuning from '../src/components/book-list/tuning.json';

// const BooksContext = createContext();

// const BooksProvider = ({ children }) => {
 
//   const [loading, setLoading] = useState(true);
//   const [books, setBooks] = useState([]);
//   const [specificBook, setSpecificBook] = useState([]);
//   const [fieldState, setFieldState] = useState({});
    
//   const [uiState, setUiState] = useState([]);
//   const [uiMain, setUiMain] = useState([]);

// ///!!!!
//   // useEffect(() => {
//   //   const fetchDataWithDelay = async () => {
//   //     try {
//   //       await new Promise(resolve => setTimeout(resolve, 100));
//   //       setUiState(tuning.tuning);
//   //       if (uiMain.length < 1) {
//   //         setUiMain(tuning.tuning.filter(item => item.type === "start")[0]);
//   //       }
//   //       setLoading(false);
//   //     } catch (err) {
//   //       console.log(err.message);
//   //     }
//   //   };
  
//   //   const updateUiState = () => {
//   //     if (uiMain.loadprice === "true" && fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
//   //       setUiState(prevState => {
//   //         const maxId = prevState.length > 0 ? prevState.reduce((max, item) => (item.id > max ? item.id : max), 0) : 0;
//   //         const updatedUiMain = { ...uiMain };
//   //         if (fieldState.titleprice && fieldState.titleprice !== "") updatedUiMain.title = fieldState.titleprice;
//   //         if (fieldState.lang && fieldState.lang !== "") updatedUiMain.lang = fieldState.lang;
//   //         updatedUiMain.UrFrame = fieldState.UrFrame;
//   //         updatedUiMain.Urprice = fieldState.Urprice;
//   //         updatedUiMain.logo = fieldState.logo;
//   //         if (fieldState.author && fieldState.author !== "") {
//   //           updatedUiMain.author = fieldState.author;
//   //         } else {
//   //           updatedUiMain.author = uiMain.author + (fieldState.idprice || "LOL");
//   //         }
//   //         if (updatedUiMain.type === "start") updatedUiMain.type = "add";
//   //         updatedUiMain.id = maxId + 1;
//   //         return [...prevState, updatedUiMain];
//   //       });
//   //     }
//   //   };
  
//   //   fetchDataWithDelay();
//   //   updateUiState();
//   // }, [fieldState, uiMain]);
  
// //+++
//   useEffect(() => {
//     const updateUiState = () => {
//       if (uiMain.loadprice === "true" && fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
//         setUiState(prevState => {
//           const maxId = prevState.length > 0 ? prevState.reduce((max, item) => (item.id > max ? item.id : max), 0) : 0;
//           const updatedUiMain = { ...uiMain };
//           if (fieldState.titleprice && fieldState.titleprice !== "") updatedUiMain.title = fieldState.titleprice;
//           if (fieldState.lang && fieldState.lang !== "") updatedUiMain.lang = fieldState.lang;
//           if (fieldState.UrFrame && fieldState.UrFrame !== "") updatedUiMain.UrFrame = fieldState.UrFrame;
//           //updatedUiMain.UrFrame = fieldState.UrFrame;
//           updatedUiMain.Urprice = fieldState.Urprice;
//           // if (fieldState.logo && fieldState.logo !== "") updatedUiMain.logo = fieldState.logo;
//           updatedUiMain.logo = fieldState.logo
//           if (fieldState.author && fieldState.author !== "") {
//             updatedUiMain.author = fieldState.author;
//           } else {
//             updatedUiMain.author = uiMain.author + (fieldState.idprice || "LOL");
//           }
//           if (updatedUiMain.type === "start") updatedUiMain.type = "add";
//           updatedUiMain.id = maxId + 1;
//           return [...prevState, updatedUiMain];
//         });
//       }
//     };
  
//     const fetchDataWithDelay = async () => {
//       try {
//         await new Promise(resolve => setTimeout(resolve, 100));
//         setUiState(tuning.tuning);
//         updateUiState();
//         if (uiMain.length < 1) {
//           setUiMain(tuning.tuning.filter(item => item.type === "start")[0]);
//         }
//         setLoading(false);
//       } catch (err) {
//         console.log(err.message);
//       }
//     };
  
//     fetchDataWithDelay();
//     console.log("bc")
//   // }, [fieldState]);
// }, [fieldState, uiMain]);
  
  



//   // useEffect(() => {
//   //   const getMaxId = () => {
//   //     const ids = uiState.map(item => item.id);
//   //     return ids.length > 0 ? Math.max(...ids) : 0;
//   //   };
  
//   //   const updateUiState = () => {
//   //     const maxId = getMaxId();
//   //     if (fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
//   //       setUiState(prevState => {
//   //         const updatedUiMain = { ...uiMain };
//   //         if (fieldState.title && fieldState.title !== "") updatedUiMain.title = fieldState.title;
//   //         if (fieldState.lang && fieldState.lang !== "") updatedUiMain.lang = fieldState.lang;
//   //         if (fieldState.UrFrame && fieldState.UrFrame !== "") updatedUiMain.UrFrame = fieldState.UrFrame;
//   //         updatedUiMain.Urprice = fieldState.Urprice;
//   //         // if (fieldState.logo && fieldState.logo !== "") updatedUiMain.logo = fieldState.logo;
//   //         updatedUiMain.logo = fieldState.logo;
//   //         if (fieldState.author && fieldState.author !== "") {
//   //           updatedUiMain.author = fieldState.author;
//   //         } else {
//   //           updatedUiMain.author = uiMain.author + (fieldState.idprice || "LOL");
//   //         }
//   //         if (updatedUiMain.type === "start") updatedUiMain.type = "add";
//   //         updatedUiMain.id = maxId + 1;
//   //         return [...prevState, updatedUiMain];
//   //       });
//   //     }
//   //   };
  
//   //   const fetchDataWithDelay = async () => {
//   //     try {
//   //       await new Promise(resolve => setTimeout(resolve, 100));
//   //       setUiState(tuning.tuning);
//   //       updateUiState();
//   //       if (uiMain.length < 1) {
//   //         setUiMain(tuning.tuning.filter(item => item.type === "start")[0]);
//   //       }
//   //       setLoading(false);
//   //     } catch (err) {
//   //       console.log(err.message);
//   //     }
//   //   };
  
//   //   fetchDataWithDelay();
//   // }, [uiMain, fieldState]);
  
  


//   // useEffect(() => {
//   //   const getMaxId = () => {
//   //     // Получаем массив id из элементов uiState
//   //     const ids = uiState.map(item => item.id);
//   //     // Находим максимальное значение id
//   //     return ids.length > 0 ? Math.max(...ids) : 0;
//   //   };
  
//   //   const updateUiState = () => {
//   //     // Получаем максимальное значение id
//   //     const maxId = getMaxId();
//   //     // Проверяем наличие и непустое значение fieldState.Urprice
//   //     if (fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
//   //       // Создаем копию объекта uiMain
//   //       const updatedUiMain = { ...uiMain };
//   //       // Заменяем нужные значения на значения из fieldState
//   //       if (fieldState.title&&fieldState.title!=="") updatedUiMain.title = fieldState.title;
//   //       if (fieldState.lang&&fieldState.lang!=="") updatedUiMain.lang = fieldState.lang;
//   //       if (fieldState.UrFrame&&fieldState.UrFrame!=="")updatedUiMain.UrFrame = fieldState.UrFrame;
//   //       updatedUiMain.Urprice = fieldState.Urprice
//   //       if (fieldState.logo&&fieldState.logo!=="")updatedUiMain.logo = fieldState.logo
//   //       if (fieldState.author&&fieldState.author!=="") {
//   //         // Если author уникален, используем его
//   //         updatedUiMain.author = fieldState.author;
//   //       } else {
//   //         // Иначе комбинируем uiMain.author и fieldState.idprice, или используем символ LOL
//   //         updatedUiMain.author = uiMain.author + (fieldState.idprice || "LOL");
//   //       }
        
        
       
//   //       if (updatedUiMain.type === "start") updatedUiMain.type = "add";
//   //       // Устанавливаем новый id следующим за максимальным
//   //       updatedUiMain.id = maxId + 1;
  
//   //       // Добавляем обновленный объект в uiState
//   //       setUiState(prevState => [...prevState, updatedUiMain]);
//   //     }
//   //   };
  
//   //   const fetchDataWithDelay = async () => {
//   //     try {
//   //       await new Promise(resolve => setTimeout(resolve, 100));
        
//   //       setUiState(tuning.tuning);
        
//   //       // Вызываем функцию для обновления uiState
//   //       updateUiState();
        
//   //       // Если массив uiMain пуст, устанавливаем его
//   //       if (uiMain.length < 1) {
//   //         setUiMain(tuning.tuning.filter(item => item.type === "start")[0]);
//   //       }
  
//   //       setLoading(false);
//   //     } catch (err) {
//   //       console.log(err.message);
//   //     }
//   //   };
  
//   //   fetchDataWithDelay();
//   // }, [uiMain, uiMain.length, fieldState]); // Добавляем fieldState в зависимости
  
  
  
// //   useEffect(() => {
// //     // Функція для отримання даних про книжки зі зовнішнього JSON-файлу 
// //     const fetchDataWithDelay = async () => {
// //       try {
// //       await new Promise(resolve => setTimeout(resolve, 100));
      
// //       setUiState(tuning.tuning);
// //       uiMain.length < 1 && (setUiMain( tuning.tuning.filter(item => item.type === "start")[0]));
// //         setLoading(false);
// //     } catch (err) {
// //       console.log(err.message);
// //     }
// //     };

// //     fetchDataWithDelay();
// // }, [uiMain.length]);






// console.log(uiState)
// console.log(uiMain)
// console.log(uiMain.Urprice)
// console.log(typeof(uiState))
// console.log(typeof(uiMain))
// console.log((uiState).length)
// //console.log((uiMain).length)



// console.log(uiState.map(item => item.type === "start" && item.id).filter(Boolean))

// console.log(uiState.find(item => item.type === "start")?.id)
// // const startItem = uiState.find(item => item.type === "start");
// // if (startItem) {
// //   console.log(startItem.Urprice)
// //   // Теперь у вас есть переменные id, name, url и otherValues, которые содержат остальные свойства объекта
// // }


//   const [idLoudPrice, setIdLoudPrice] = useState(0);
//   const [cartItems, setCartItems] = useState([]);
//   const [theme, setTheme] = useState('light');
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [totalCount, setTotalCount] = useState(0);

//   const [message, setMessage] = useState('');
//   const [promo, setPromo] = useState('');
//   const [order, setOrder] = useState('');
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [savedLogin, setSavedLogin] = useState('');
//   const [savedPassword, setSavedPassword] = useState('');
  
//   const [filterBooks, setFilterBooks] = useState([]);
    
//   const [selectedSection, setSelectedSection] = useState(null);
//   const [selectedSubsection, setSelectedSubsection] = useState(null);
//   const [sortedBooks, setSortedBooks] = useState([]);

//   const [input, setInput] = useState('');
//   const [selectedTags1, setSelectedTags1] = useState([]);
//   const [selectedTags2, setSelectedTags2] = useState([]);
//   const [selectedSizes, setSelectedSizes] = useState([]);
//   const [selectedColor, setSelectedColor] = useState([]);

//   ////////////////
//   const [selectedTags3, setSelectedTags3] = useState([]);
//   const [selectedTags4, setSelectedTags4] = useState([]);


//   const [glsearch, setSearch] = useState("");
//   const [searchOptions, setSearchOptions] = useState({
//     byTitle: true,
//     byID: true,
//     byAuthor: true,
//     byTags: false,
//     byDescription: false
//   });
//   const contextValue = {
//     message, setMessage,promo, setPromo,order, setOrder,loggedIn, setLoggedIn,savedLogin, setSavedLogin,savedPassword, setSavedPassword,
//     totalPrice,
//     setTotalPrice,
//     cartItems,
//     setCartItems,
//     theme,
//     setTheme,
//     totalCount,
//     setTotalCount,
//     books, 
//     setBooks,
//     specificBook, setSpecificBook,
//     filterBooks, setFilterBooks,
//     sortedBooks, setSortedBooks,
//     selectedSection, setSelectedSection,
//     selectedSubsection, setSelectedSubsection,
   
//     input, setInput,selectedTags1, setSelectedTags1,selectedTags2, setSelectedTags2,selectedSizes, setSelectedSizes,
//     selectedColor, setSelectedColor,
//     glsearch, setSearch,
//     searchOptions, setSearchOptions,
//     uiState, setUiState,
//     uiMain, setUiMain,
//     fieldState, setFieldState,
//     idLoudPrice, setIdLoudPrice,
    
//     selectedTags3, setSelectedTags3,
//     selectedTags4, setSelectedTags4    
//   };

//   if (loading) {
//     return <div>...Loading...</div>;
//   }

//   return (
//     <BooksContext.Provider value={contextValue}>
//       {children}
//     </BooksContext.Provider>
//   );
//  };

// export { BooksContext, BooksProvider };