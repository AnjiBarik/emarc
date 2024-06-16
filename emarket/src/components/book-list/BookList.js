import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  } = useContext(BooksContext);

  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState({});
  const [showSections, setShowSections] = useState(false);
  const navigate = useNavigate();
 
  // Set initial sortedBooks when books are loaded
  const sortedBooks = React.useMemo(() => {
    return books.filter(
      (book) => book.Visibility !== '0' &&
        ((!selectedSection || selectedSection === 'Show all') || book.section === selectedSection) &&
        (!selectedSubsection || book.partition === selectedSubsection)
    );
  }, [books, selectedSection, selectedSubsection]);
  // Populate sections and subsections from books
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
  };

  const handleSubsectionClick = (subsection) => {
    setSelectedSubsection(subsection);    
  };

  const toggleSections = () => setShowSections(prevState => !prevState);

  useEffect(() => {
    if (books.length === 0) {
      navigate('/');
    }
  }, [books, navigate]);

  if (books.length === 0) {
    return null;
  }

  return (   
    <section className={theme}  >
      {/* Menu buttons */}
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
      
      {/* Selected tags */}
      <section className="filters" key={`${selectedSection}-${selectedSubsection}`}>
        <div className="selected-tags">
          <span>
            Found: <strong>{sortedBooks.length}</strong>
          </span>
          {selectedSection && (
            <button className="selected-button" onClick={() => handleSectionClick('Show all')}>
             {selectedSection}<span>❌</span>
            </button>
          )}
          {selectedSubsection && (            
            <button className="selected-button" onClick={() => handleSubsectionClick(null)}>
              {selectedSubsection}<span>❌</span>
            </button>
          )}
        </div>
      </section>

      {/* Sections and subsections list */}
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
      
      {/* Toggle sections button */}
      {showSections && (
        <section className="filters">
          <button onClick={toggleSections}>
            <img className="back-button" src={upmenu} alt="Cancel" />
          </button>
        </section>
      )}
      
      {/* Sorted books display */}
      <SortCart props={sortedBooks}/>
    </section>
  );
}
