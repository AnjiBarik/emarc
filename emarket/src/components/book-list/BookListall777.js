import React, { useEffect, useState, useContext, useCallback } from 'react';
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
import filterremove from '../cart/img/filterremove.png';

export default function BookList() {
  const {
    selectedSection,
    selectedSubsection,
    theme,
    books,
    input,
    setInput,
    selectedTags1,
    setSelectedTags1,
    selectedTags2,
    setSelectedTags2,
    selectedSizes,
    setSelectedSizes,
    selectedColor,
    setSelectedColor,
  } = useContext(BooksContext);

  const [widthBlock, setWidthBlock] = useState(0);
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState({});
  const [showSections, setShowSections] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [sortedBooks, setSortedBooks] = useState([...books]);
  const [uniqueTags1, setUniqueTags1] = useState([]);
  const [uniqueTags2, setUniqueTags2] = useState([]);
  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [uniqueColor, setUniqueColor] = useState([]);
  const [uniqueAuthors, setUniqueAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [select, setSelect] = useState('section');
  const [selectedSorted, setSelectedSorted] = useState('default');

  const toggleSections = () => {
    setShowSections(prevState => !prevState);
  };

  const handleShowAll = () => {
    resetFilters();
    setSortedBooks(books.filter(book => book.Visibility !== '0'));
  };

  const handleSelection = useCallback((selectedItems, item, setSelectedItems) => {
    setSelectedItems(prevItems =>
      prevItems.includes(item) ?
        prevItems.filter(selectedItem => selectedItem !== item) :
        [...prevItems, item]
    );
  }, []);

  const filterBooks = useCallback((books, key, values) => {
    return values.length > 0 ? books.filter(book => values.includes(book[key])) : books;
  }, []);

  const findBook = useCallback(() => {
    let filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(input.toLowerCase()) ||
      book.id.toString().toLowerCase().includes(input.toLowerCase()) ||
      book.author.toString().toLowerCase().includes(input.toLowerCase())
    );

    if (select === 'section' && selectedSection && selectedSection !== 'Показать все') {
      filteredBooks = filteredBooks.filter(book => book.section === selectedSection);
      if (selectedSubsection) {
        filteredBooks = filteredBooks.filter(book => book.partition === selectedSubsection);
      }
    }

    if (selectedSorted !== 'default') {
      filteredBooks = [...filteredBooks.filter(book => book.sorted === selectedSorted)];
    }

    if (selectedTags1.length > 0) {
      filteredBooks = filteredBooks.filter(book => selectedTags1.includes(book.tags1));
    }

    if (selectedTags2.length > 0) {
      filteredBooks = filteredBooks.filter(book => selectedTags2.includes(book.tags2));
    }

    filteredBooks = filterBooks(filteredBooks, 'size', selectedSizes);
    filteredBooks = filterBooks(filteredBooks, 'color', selectedColor);
    filteredBooks = filteredBooks.filter(book => book.Visibility !== '0');
    setSortedBooks(filteredBooks);
  }, [books, input, select, selectedSizes, selectedSorted, selectedTags1, selectedTags2, selectedColor, selectedSection, selectedSubsection, filterBooks]);

  const findUniqueValues = useCallback(() => {
    const uniqueTags1Set = new Set();
    const uniqueTags2Set = new Set();
    const uniqueSizesSet = new Set();
    const uniqueSortedValuesSet = new Set();
    const uniqueColorSet = new Set();
    const uniqueAuthorsSet = new Set();

    if (select === 'section' && selectedSection && selectedSection !== 'Показать все') {
      let filteredBooks = books.filter(book => book.section === selectedSection);
      if (selectedSubsection) {
        filteredBooks = filteredBooks.filter(book => book.partition === selectedSubsection);
      }
      filteredBooks.forEach(book => {
        uniqueTags1Set.add(book.tags1);
        uniqueTags2Set.add(book.tags2);
        uniqueSizesSet.add(book.size);
        uniqueSortedValuesSet.add(book.sorted);
        uniqueColorSet.add(book.color);
        uniqueAuthorsSet.add(book.author);
      });
    } else {
      books.forEach(book => {
        uniqueTags1Set.add(book.tags1);
        uniqueTags2Set.add(book.tags2);
        uniqueSizesSet.add(book.size);
        uniqueSortedValuesSet.add(book.sorted);
        uniqueColorSet.add(book.color);
        uniqueAuthorsSet.add(book.author);
      });
    }

    setUniqueTags1(Array.from(uniqueTags1Set).filter(tag => tag.trim() !== ''));
    setUniqueTags2(Array.from(uniqueTags2Set).filter(tag => tag.trim() !== ''));
    setUniqueSizes(Array.from(uniqueSizesSet).filter(size => size && size.trim() !== ''));
    setUniqueColor(Array.from(uniqueColorSet).filter(color => color && color.trim() !== ''));
    setUniqueAuthors(Array.from(uniqueAuthorsSet).filter(author => author && author.trim() !== ''));
  }, [books, select, selectedSection, selectedSubsection]);

  const resetFilters = () => {
    setInput('');
    setSelect('section');
    setSelectedTags1([]);
    setSelectedTags2([]);
    setSelectedSizes([]);
    setSelectedColor([]);
    setSelectedAuthors([]);
    setSelectedSorted('default');
  };

  useEffect(() => {
    findBook();
    findUniqueValues();
  }, [findBook, findUniqueValues]);

  const sortByNew = () => {
    setSortedBooks(prevBooks => [...prevBooks].sort((a, b) => (a.sorted === 'new' && b.sorted !== 'new' ? -1 : 1)));
    setSelectedSort('new');
  };

  const sortByPopular = () => {
    setSortedBooks(prevBooks => [...prevBooks].sort((a, b) => (a.sorted === 'popular' && b.sorted !== 'popular' ? -1 : 1)));
    setSelectedSort('popular');
  };

  const sortBySale = () => {
    setSortedBooks(prevBooks => [...prevBooks].sort((a, b) => (a.sorted === 'sale' && b.sorted !== 'sale' ? -1 : 1)));
    setSelectedSort('sale');
  };

  const lowPrice = () => {
    setSortedBooks(prevBooks => [...prevBooks].sort((a, b) => a.price - b.price));
    setSelectedSort('lowPrice');
  };

  const highPrice = () => {
    setSortedBooks(prevBooks => [...prevBooks].sort((a, b) => b.price - a.price));
    setSelectedSort('highPrice');
  };

  const list = () => {
    setWidthBlock(1);
  };

  const comfy = () => {
    setWidthBlock(0);
  };

  return (
    <section className={theme}>
      <section className="filters">
        <sections className="filters">
          <button onClick={toggleSections}>
            {!showSections ? <img className="back-button" src={burger} /> : <img className="back-button" src={cancel} />}
          </button>
        </sections>
        <section className="filters">
          <button>
            Found {sortedBooks.length}
          </button>
          {selectedSection && (
            <button className="selected-button" onClick={() => setSelect('allSections')}>
              {selectedSection}<span>&times;</span>
            </button>
          )}
          {selectedSubsection && (
            <button className="selected-button" onClick={() => setSelect('allSections')}>
              {selectedSubsection}<span>&times;</span>
            </button>
          )}
        </section>
        {showSections && (
          <div className="section-list">
            <ul>
              {sections.map((section, index) => (
                <li key={index} onClick={() => setSelect('allSections')} className={selectedSection === section ? 'selected' : ''}>
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
                <li key={index} onClick={() => setSelect('allSections')} className={selectedSubsection === subsection ? 'selected' : ''}>
                  {subsection}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="filters">
          <button onClick={list}>
            <img className="back-button" src={list_icon} />
          </button>
          <button onClick={comfy}>
            <img className="back-button" src={comfy_icon} />
          </button>
          <button onClick={lowPrice}>
            <img className={`back-button ${selectedSort === 'lowPrice' && 'selected'}`} src={up_sort} />
          </button>
          <button onClick={highPrice}>
            <img className={`back-button ${selectedSort === 'highPrice' && 'selected'}`} src={down_sort} />
          </button>
          <button className={`sort-button ${selectedSort === 'new' && 'selected'}`} onClick={sortByNew}>New</button>
          <button className={`sort-button ${selectedSort === 'popular' && 'selected'}`} onClick={sortByPopular}>Popular</button>
          <button className={`sort-button ${selectedSort === 'sale' && 'selected'}`} onClick={sortBySale}>Sale</button>
        </div>
      </section>
      <ScrollToTopButton />
      <Shelf book={sortedBooks} widhtblock={widthBlock} />
    </section>
  );
}
