import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import Shelf from './Shelf';
import './bookList.css';
import { BooksContext } from '../../BooksContext';
import ScrollToTopButton from './ScrollToTopButton';
import down_sort from '../cart/img/down_sort.png';
import up_sort from '../cart/img/up_sort.png';
import list_icon from '../cart/img/list_icon.png';
import comfy_icon from '../cart/img/comfy_icon.png';
import burger from '../cart/img/burger.png';
import cancel from '../cart/img/cancel.png';
import upmenu from '../cart/img/upmenu.png';
import filter from '../cart/img/filter.png';
import search from '../cart/img/search.png';
import discont from '../cart/img/discont.png';
import newcart from '../cart/img/new.png';
import popular from '../cart/img/popular.png';


export default function BookList() {
  const {
    theme,
    books,
    filterBooks,
    selectedSection,
    setSelectedSection,
    selectedSubsection,
    setSelectedSubsection,
    sortedBooks,
    setSortedBooks,
  } = useContext(BooksContext);

  const [widthBlock, setWidthBlock] = useState(0);
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState({});
  const [showSections, setShowSections] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');

  // const [sortedBooks, setSortedBooks] = useState([]);
  // useEffect(() => {
  //   if (filterBooks.length > 0) {
  //     setSortedBooks(filterBooks);
  //   } else if (sortedBooks.length === 0) {
  //     setSortedBooks([...books.filter((book) => book.Visibility !== '0')]);
  //   }
  // }, [filterBooks, books, sortedBooks.length, setSortedBooks]);

  useEffect(() => {
    const fetchData = async () => {
      // Ожидание, пока props.length > 0
      while (books.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Ожидание 1 секунду
      }
      // Как только props.length > 0, устанавливаем sortBooks
     if (!selectedSection) {
      setSortedBooks([...books.filter((book) => book.Visibility !== '0')]);
    }
    };

    fetchData(); // Вызов асинхронной функции
  }, [books, selectedSection, setSortedBooks]);

console.log(selectedSection)
  console.log(books)
  console.log(sortedBooks);
  useEffect(() => {
  const extractSections = () => {
    const uniqueSections = ['Показать все', ...new Set(books.map(book => book.section))];
    setSections(uniqueSections);

    const subs = {};
    books.forEach(book => {
      if (!subs[book.section]) subs[book.section] = new Set();
      if (book.partition) {
        subs[book.section].add(book.partition);
      }
    });
    setSubsections(subs);
  };
  
    extractSections();
  }, [books]);

  const sortBy = (type) => {
    let sortedBooksCopy = [...sortedBooks];
    sortedBooksCopy.sort((a, b) => {
      if (a.sorted === type && b.sorted !== type) return -1;
      return 1;
    });
    setSelectedSort(type);
    setSortedBooks(sortedBooksCopy);
  };

  const sortByNew = () => sortBy('new');
  const sortByPopular = () => sortBy('popular');
  const sortBySale = () => sortBy('sale');

  const sortLowPrice = () => {
    setSortedBooks(prevBooks => [...prevBooks].sort((a, b) => a.price - b.price));
    setSelectedSort('lowPrice');
  };

  const sortHighPrice = () => {
    setSortedBooks(prevBooks => [...prevBooks].sort((a, b) => b.price - a.price));
    setSelectedSort('highPrice');
  };

  const list = () => setWidthBlock(1);
  const comfy = () => setWidthBlock(0);

  const toggleSections = () => setShowSections(prevState => !prevState);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setSelectedSubsection(null);
    if (section === 'Показать все') {
      setSortedBooks([...books.filter((book) => book.Visibility !== '0')]);
    } else {
      const filteredBooks = ([...books.filter((book) => book.Visibility !== '0')]).filter(book => book.section === section);
      setSortedBooks(filteredBooks);
    }
  };

  const handleSubsectionClick = (subsection) => {
    setSelectedSubsection(subsection);
    const filteredBooks = ([...books.filter((book) => book.Visibility !== '0')]).filter(book => book.section === selectedSection && book.partition === subsection);
    setSortedBooks(filteredBooks);
  };

  return (
    
    <section className={theme}>
      <section className="filters">
       
          <button onClick={toggleSections}>
            {!showSections ? <img className="back-button" src={burger} alt='menu'/> : <img className="back-button" src={cancel} alt='cancel menu'/>}
          </button>

          <Link to="/Search" className="back-button"> 
            <img className="back-button" src={filter} alt="filter" />
          </Link>
          <Link to="/GlSearch" className="back-button"> 
            <img className="back-button" src={search} alt="search" />
          </Link>
         
          <section className="filters">
          <div className="selected-tags">
          
            Found {sortedBooks.length}
         
          {selectedSection && (
            <button className="selected-button" onClick={() => handleSectionClick('Показать все')}>
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
        {showSections && (
          <div className="section-list">
            <ul>
              {sections.map((section, index) => (
                <li key={index} onClick={() => handleSectionClick(section)} className={selectedSection === section ? 'selected' : ''}>
                  {section === 'Показать все' ? (
                    section
                  ) : (
                    <>
                      {section} {subsections[section] && subsections[section].size > 0 && <span style={{ marginLeft: '4px' }}>+</span>}
                    </>
                  )}
                </li>
              ))}
            </ul>
            <button>
              {showSections && <img className="back-button" src={upmenu} onClick={toggleSections} alt="Cancel" />}
            </button>
          </div>
        )}
        {showSections && selectedSection && selectedSection !== 'Показать все' && (
          <div className="subsection-list">
            <ul>
              {Array.from(subsections[selectedSection] || []).map((subsection, index) => (
                <li key={index} onClick={() => handleSubsectionClick(subsection)} className={selectedSubsection === subsection ? 'selected' : ''}>
                  {subsection}
                </li>
              ))}
            </ul>
          </div>
        )}
        {sortedBooks.length>0 &&(
        <div className="filters">  
          {/* <button onClick={list}> */}
            <img className="back-button" src={list_icon} alt='List view' onClick={list}/>
          {/* </button> */}
          {/* <button onClick={comfy}> */}
            <img className="back-button" src={comfy_icon} alt='Comfortable view' onClick={comfy}/>
          {/* </button> */}
          {/* <button onClick={sortLowPrice}> */}
            <img className={`back-button ${selectedSort === 'lowPrice' && 'selected'}`} src={up_sort} alt='price up' onClick={sortLowPrice}/>
          {/* </button> */}
          {/* <button onClick={sortHighPrice}> */}
            <img className={`back-button ${selectedSort === 'highPrice' && 'selected'}`} src={down_sort} alt='price down' onClick={sortHighPrice}/>
          {/* </button> */}
          
          {sortedBooks.some(book => book.sorted === 'new') && (
            // <button className={`sort-button ${selectedSort === 'new' && 'selected'}`} onClick={sortByNew}>
             <img src={newcart} className={`back-button ${selectedSort === 'new' && 'selected'}`} onClick={sortByNew} alt='newcart'/>
            // </button>
          )}
          {sortedBooks.some(book => book.sorted === 'popular') && (
            // <button className={`sort-button ${selectedSort === 'popular' && 'selected'}`} onClick={sortByPopular}>
             <img src={popular} className={`back-button ${selectedSort === 'popular' && 'selected'}`} onClick={sortByPopular} alt='popular'/>
          // </button>
           )}
          {sortedBooks.some(book => book.sorted === 'sale') && (
            // <button className={`sort-button ${selectedSort === 'sale' && 'selected'}`} onClick={sortBySale}>
             <img src={discont} className={`back-button ${selectedSort === 'sale' && 'selected'}`} onClick={sortBySale} alt='discont'/>
            // </button>
          )}
        </div>
       
        
       
          )}

      
      </section>
      {sortedBooks.length===0 &&(
           <div> Oops found 0 try again </div>
          )}
      <ScrollToTopButton />
      <Shelf book={sortedBooks.filter(book => book.Visibility !== 0)} widhtblock={widthBlock} />
    </section>
    
  );
}
