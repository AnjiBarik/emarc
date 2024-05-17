import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import './bookList.css';
import { BooksContext } from '../../BooksContext';

import burger from '../cart/img/burger.png';
import cancel from '../cart/img/cancel.png';
import upmenu from '../cart/img/upmenu.png';
import filter from '../cart/img/filter.png';
import search from '../cart/img/search.png';

import SortCart from './SortCart';

export default function BookList() {
  const {
    theme,
    books,
    selectedSection,
    setSelectedSection,
    selectedSubsection,
    setSelectedSubsection,
    sortedBooks,
    setSortedBooks,
  } = useContext(BooksContext);

  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState({});
  const [showSections, setShowSections] = useState(false);

  useEffect(() => {
    if (books.length > 0 && !selectedSection) {
      setSortedBooks([...books.filter((book) => book.Visibility !== '0')]);
    }
  }, [books, selectedSection, setSortedBooks]);

  useEffect(() => {
    if (books.length > 0) {
      const uniqueSections = ['Show all', ...new Set(books.map(book => book.section))];
      setSections(uniqueSections);

      const subs = {};
      books.forEach(book => {
        if (!subs[book.section]) subs[book.section] = new Set();
        if (book.partition) {
          subs[book.section].add(book.partition);
        }
      });
      setSubsections(subs);
    }
  }, [books]);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setSelectedSubsection(null);
    if (section === 'Show all') {
      setSortedBooks([...books.filter((book) => book.Visibility !== '0')]);
    } else {
      const filteredBooks = books.filter((book) => book.Visibility !== '0' && book.section === section);
      setSortedBooks(filteredBooks);
    }
  };

  const handleSubsectionClick = (subsection) => {
    setSelectedSubsection(subsection);
    const filteredBooks = books.filter((book) => book.Visibility !== '0' && book.section === selectedSection && book.partition === subsection);
    setSortedBooks(filteredBooks);
  };

  const toggleSections = () => setShowSections(prevState => !prevState);

  if (books.length === 0) {
    window.location.href = '/';
    return null;
  }

  return (
    <section className={theme}>
      <section className="filters">
        <button className='sort-button selected' onClick={toggleSections}>
          {!showSections ? <img className="back-button selected" src={burger} alt='menu'/> : <img className="back-button selected" src={cancel} alt='cancel menu'/>}
        </button>

        <Link to="/Filter">
          <button className='sort-button'>
            <img className="back-button" src={filter} alt="filter" />
          </button>
        </Link>
        <Link to="/Search">
          <button className='sort-button'>
            <img className="back-button" src={search} alt="search" />
          </button>
        </Link>
      </section>
      
      <section className="filters">
        <div className="selected-tags">
          Found: {sortedBooks.length}
          {selectedSection && (
            <button className="selected-button" onClick={() => handleSectionClick('Show all')}>
              {selectedSection}<span>❌</span>
            </button>
          )}
          {selectedSubsection && (
            <button className="selected-button" onClick={() => handleSectionClick(selectedSection)}>
              {selectedSubsection}<span>❌</span>
            </button>
          )}
        </div>
      </section>

      <section className="filters">
        {showSections && (
          <div className="section-list">
            <ul className="no-markers">
              {sections.map((section, index) => (
                <li key={index} onClick={() => handleSectionClick(section)} className={selectedSection === section ? 'selected' : ''}>
                  {section === 'Show all' ? section : (
                    <>
                      {section} {subsections[section] && subsections[section].size > 0 && <span style={{ marginLeft: '4px' }}>+</span>}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {showSections && selectedSection && selectedSection !== 'Show all' && (
          <div className="subsection-list">
            <ul className="no-markers">
              {Array.from(subsections[selectedSection] || []).map((subsection, index) => (
                <li key={index} onClick={() => handleSubsectionClick(subsection)} className={selectedSubsection === subsection ? 'selected' : ''}>
                  {subsection}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      
      {showSections && (
        <section className="filters">
          <button onClick={toggleSections}>
            <img className="back-button" src={upmenu} alt="Cancel" />
          </button>
        </section>
      )}
      
      <SortCart props={sortedBooks}/>
    </section>
  );
}


// import React, { useEffect, useState, useContext } from 'react';
// import { Link } from "react-router-dom";
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';

// import burger from '../cart/img/burger.png';
// import cancel from '../cart/img/cancel.png';
// import upmenu from '../cart/img/upmenu.png';
// import filter from '../cart/img/filter.png';
// import search from '../cart/img/search.png';

// import SortCart from './SortCart';

// export default function BookList() {
//   const {
//     theme,
//     books,
//     selectedSection,
//     setSelectedSection,
//     selectedSubsection,
//     setSelectedSubsection,
//     sortedBooks,
//     setSortedBooks,
//   } = useContext(BooksContext);


//   if ( books.length === 0 ) {
   
//     window.location.href = '/';
//   }


//   console.log(typeof(books))
//   const [sections, setSections] = useState([]);
//   const [subsections, setSubsections] = useState({});
//   const [showSections, setShowSections] = useState(false);
//   useEffect(() => {
//     const fetchData = async () => {
//       // Ожидание, пока props.length > 0
//       while (books.length === 0) {
//         await new Promise(resolve => setTimeout(resolve, 1000)); // Ожидание 1 секунду
//       }
//       // Как только props.length > 0, устанавливаем sortBooks
//      if (!selectedSection) {
//       setSortedBooks([...books.filter((book) => book.Visibility !== '0')]);
//     }
//     };

//     fetchData(); // Вызов асинхронной функции
//   }, [books, selectedSection, setSortedBooks]);

// console.log(selectedSection)
//   console.log(books)
//   console.log(sortedBooks);
//   useEffect(() => {
//   const extractSections = () => {
//     const uniqueSections = ['Show all', ...new Set(books.map(book => book.section))];
//     setSections(uniqueSections);

//     const subs = {};
//     books.forEach(book => {
//       if (!subs[book.section]) subs[book.section] = new Set();
//       if (book.partition) {
//         subs[book.section].add(book.partition);
//       }
//     });
//     setSubsections(subs);
//   };
  
//     extractSections();
//   }, [books]);

  

//   const handleSectionClick = (section) => {
//     setSelectedSection(section);
//     setSelectedSubsection(null);
//     if (section === 'Show all') {
//       setSortedBooks([...books.filter((book) => book.Visibility !== '0')]);
//     } else {
//       const filteredBooks = ([...books.filter((book) => book.Visibility !== '0')]).filter(book => book.section === section);
//       setSortedBooks(filteredBooks);
//     }
//   };

//   const handleSubsectionClick = (subsection) => {
//     setSelectedSubsection(subsection);
//     const filteredBooks = ([...books.filter((book) => book.Visibility !== '0')]).filter(book => book.section === selectedSection && book.partition === subsection);
//     setSortedBooks(filteredBooks);
//   };

//   const toggleSections = () => setShowSections(prevState => !prevState);

//   return (
    
//     <section className={theme}>
//       <section className="filters">
       
//           <button className='sort-button selected' onClick={toggleSections}>
//             {!showSections ? <img className="back-button selected" src={burger} alt='menu'/> : <img className="back-button selected" src={cancel} alt='cancel menu'/>}
//           </button>

//           <Link to="/Filter" > 
//           <button className='sort-button'> 
//             <img className="back-button" src={filter} alt="filter" />
//           </button>  
//           </Link>
//           <Link to="/Search" > 
//           <button className='sort-button'> 
//             <img className="back-button" src={search} alt="search" />
//           </button>    
//           </Link>
//       </section>   
//           <section className="filters">
//           <div className="selected-tags">
          
//            Found: {sortedBooks.length} 
         
//           {selectedSection && (
//             <button className="selected-button" onClick={() => handleSectionClick('Show all')}>
//               {selectedSection}<span>❌</span>
//             </button>
//           )}
//           {selectedSubsection && (
//             <button className="selected-button" onClick={() => handleSectionClick(selectedSection)}>
//               {selectedSubsection}<span>❌</span>
//             </button>
//           )}
//         </div>
//         </section>
//         <section className="filters">
//         {showSections && (
//           <div className="section-list">
//             <ul className="no-markers">
//               {sections.map((section, index) => (
//                 <li key={index} onClick={() => handleSectionClick(section)} className={selectedSection === section ? 'selected' : ''}>
//                   {section === 'Show all' ? (section) : (
//                     <>
//                       {section} {subsections[section] && subsections[section].size > 0 && <span style={{ marginLeft: '4px' }}>+</span>}
//                     </>
//                   )}
//                 </li>
//               )
//               )}
            
//             </ul>
//           </div>
//          )}
//         {showSections && selectedSection && selectedSection !== 'Show all' && (
//           <div className="subsection-list">
//             <ul className="no-markers">
//               {Array.from(subsections[selectedSection] || []).map((subsection, index) => (
//                 <li key={index} onClick={() => handleSubsectionClick(subsection)} className={selectedSubsection === subsection ? 'selected' : ''}>
//                   {subsection}
//                 </li>
//               ))}
//             </ul>
//           </div>
        
//         )}
//        </section>
        
//         {showSections && (
//         <section className="filters">
//          <button>
//             <img className="back-button" src={upmenu} onClick={toggleSections} alt="Cancel" />
//          </button> 
//         </section>
//         )}
     
//       <SortCart props={sortedBooks}/>
//     </section>
//   );
// }
