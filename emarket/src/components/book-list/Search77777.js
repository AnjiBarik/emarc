import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from "react-router-dom";
import Shelf from './Shelf';
import './bookList.css';
import { BooksContext } from '../../BooksContext';
import ScrollToTopButton from './ScrollToTopButton';
import cancel from '../cart/img/cancel.png';
import filter from '../cart/img/filter.png';
import filterremove from '../cart/img/filterremove.png';
import upmenu from '../cart/img/upmenu.png';
import down_sort from '../cart/img/down_sort.png';
import up_sort from '../cart/img/up_sort.png';
import list_icon from '../cart/img/list_icon.png';
import comfy_icon from '../cart/img/comfy_icon.png';
import burger from '../cart/img/burger.png';
import search from '../cart/img/search.png';
import discont from '../cart/img/discont.png';
import newcart from '../cart/img/new.png';
import popular from '../cart/img/popular.png';

export default function Search() {
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

  const [select, setSelect] = useState('section');
  const [selectedSorted, setSelectedSorted] = useState('default');
  const [sortedBooks, setSortedBooks] = useState([...books.filter((book) => book.Visibility !== '0')]);
  const [uniqueTags1, setUniqueTags1] = useState([]);
  const [uniqueTags2, setUniqueTags2] = useState([]);
  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [uniqueColor, setUniqueColor] = useState([]);
  const [uniqueAuthors, setUniqueAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedSort, setSelectedSort] = useState('');
  const [widthBlock, setWidthBlock] = useState(0);
  const [showSections, setShowSections] = useState(true);

  const toggleSections = () => {
    setShowSections((prevState) => !prevState);
  };

  const handleSelection = useCallback(
    (selectedItems, item, setSelectedItems) => {
      setSelectedItems((prevItems) =>
        prevItems.includes(item)
          ? prevItems.filter((selectedItem) => selectedItem !== item)
          : [...prevItems, item]
      );
    },
    []
  );

  const filterBooks = useCallback(
    (books, key, values) => {
      return values.length > 0 ? books.filter((book) => values.includes(book[key])) : books;
    },
    []
  );

  const findBook = useCallback(() => {
    let filteredBooks = books.filter(
      (book) =>
        book.title.toLowerCase().includes(input.toLowerCase()) ||
        book.id.toString().toLowerCase().includes(input.toLowerCase()) ||
        book.author.toString().toLowerCase().includes(input.toLowerCase())
    );

    if (select === 'section' && selectedSection && selectedSection !== 'Показать все') {
      filteredBooks = filteredBooks.filter((book) => book.section === selectedSection);
      if (selectedSubsection) {
        filteredBooks = filteredBooks.filter((book) => book.partition === selectedSubsection);
      }
    }

    if (selectedSorted !== 'default') {
      filteredBooks = [...filteredBooks.filter((book) => book.sorted === selectedSorted)];
    }

    if (selectedTags1.length > 0) {
      filteredBooks = filteredBooks.filter((book) => selectedTags1.includes(book.tags1));
    }

    if (selectedTags2.length > 0) {
      filteredBooks = filteredBooks.filter((book) => selectedTags2.includes(book.tags2));
    }

    filteredBooks = filterBooks(filteredBooks, 'size', selectedSizes);
    filteredBooks = filterBooks(filteredBooks, 'color', selectedColor);
    filteredBooks = filteredBooks.filter((book) => book.Visibility !== '0');
    setSortedBooks(filteredBooks);
  },
  [books, input, select, selectedSizes, selectedSorted, selectedTags1, selectedTags2, selectedColor, selectedSection, selectedSubsection, filterBooks]);

  const findUniqueValues = useCallback(() => {
    const uniqueTags1Set = new Set();
    const uniqueTags2Set = new Set();
    const uniqueSizesSet = new Set();
    const uniqueSortedValuesSet = new Set();
    const uniqueColorSet = new Set();
    const uniqueAuthorsSet = new Set();

    if (select === 'section' && selectedSection && selectedSection !== 'Показать все') {
      let filteredBooks = books.filter((book) => book.section === selectedSection);
      if (selectedSubsection) {
        filteredBooks = filteredBooks.filter((book) => book.partition === selectedSubsection);
      }
      filteredBooks.forEach((book) => {
        uniqueTags1Set.add(book.tags1);
        uniqueTags2Set.add(book.tags2);
        uniqueSizesSet.add(book.size);
        uniqueSortedValuesSet.add(book.sorted);
        uniqueColorSet.add(book.color);
        uniqueAuthorsSet.add(book.author);
      });
    } else {
      books.forEach((book) => {
        uniqueTags1Set.add(book.tags1);
        uniqueTags2Set.add(book.tags2);
        uniqueSizesSet.add(book.size);
        uniqueSortedValuesSet.add(book.sorted);
        uniqueColorSet.add(book.color);
        uniqueAuthorsSet.add(book.author);
      });
    }

    setUniqueTags1(Array.from(uniqueTags1Set).filter((tag) => tag.trim() !== ''));
    setUniqueTags2(Array.from(uniqueTags2Set).filter((tag) => tag.trim() !== ''));
    setUniqueSizes(Array.from(uniqueSizesSet).filter((size) => size && size.trim() !== ''));
    setUniqueColor(Array.from(uniqueColorSet).filter((color) => color && color.trim() !== ''));
    setUniqueAuthors(Array.from(uniqueAuthorsSet).filter((author) => author && author.trim() !== ''));
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
    setSortedBooks(books.filter((book) => book.Visibility !== '0'));
  };

  useEffect(() => {
    findBook();
    findUniqueValues();
  }, [findBook, findUniqueValues]);

  const sortByNew = () => {
    setSortedBooks((prevBooks) => [...prevBooks].sort((a, b) => (a.sorted === 'new' && b.sorted !== 'new' ? -1 : 1)));
    setSelectedSort('new');
  };

  const sortByPopular = () => {
    setSortedBooks((prevBooks) => [...prevBooks].sort((a, b) => (a.sorted === 'popular' && b.sorted !== 'popular' ? -1 : 1)));
    setSelectedSort('popular');
  };

  const sortBySale = () => {
    setSortedBooks((prevBooks) => [...prevBooks].sort((a, b) => (a.sorted === 'sale' && b.sorted !== 'sale' ? -1 : 1)));
    setSelectedSort('sale');
  };

  const sortLowPrice = () => {
    setSortedBooks((prevBooks) => [...prevBooks].sort((a, b) => a.price - b.price));
    setSelectedSort('lowPrice');
  };

  const sortHighPrice = () => {
    setSortedBooks((prevBooks) => [...prevBooks].sort((a, b) => b.price - a.price));
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
        <sections className="filters">
          
          <Link to="/">
           <img className="back-button" src={burger} alt="category" />
          </Link>
          <button>
            {!showSections && (
              <img className="back-button" src={filter} onClick={toggleSections} alt='filter'/>
            )}
            {showSections && (
              <img className="back-button" src={cancel} onClick={toggleSections} alt='close filter'/>
            )}
          </button>
          <Link to="/GlSearch" className="back-button"> 
            <img className="back-button" src={search} alt="search" />
          </Link>  
        </sections>
        <section className="filters">
          <div className="selected-tags">
            Found {sortedBooks.length}
            {select === 'section' && selectedSection ? (
              <button className="selected-button" onClick={() => setSelect('allSections')}>
                {selectedSection}
                {selectedSubsection && `> ${selectedSubsection}`}
                <span>&times;</span>
              </button>
            ) : (
              <button className="selected-button" onClick={() => setSelect('allSections')}>
                All Sections
                <span>&times;</span>
              </button>
            )}
            {selectedSorted !== 'default' && (
              <button className="selected-button" onClick={() => setSelectedSorted('default')}>
                {selectedSorted}
                <span>&times;</span>
              </button>
            )}
            {input && (
              <button className="selected-button"  onClick={() => setInput('')}>
                Search by: {input}
                <span>&times;</span>
              </button>
            )}
            {selectedSizes.map((size) => (
              <button className="selected-button" key={size} onClick={() => handleSelection(selectedSizes, size, setSelectedSizes)}>
                Size: {size}
                <span>&times;</span>
              </button>
            ))}
            {selectedColor.map((color) => (
              <button className="selected-button" key={color} onClick={() => handleSelection(selectedColor, color, setSelectedColor)}>
                Color: {color}
                <span>&times;</span>
              </button>
            ))}
            {selectedAuthors.map((author) => (
              <button className="selected-button" key={author} onClick={() => handleSelection(selectedAuthors, author, setSelectedAuthors)}>
                Author: {author}
                <span>&times;</span>
              </button>
            ))}
            {selectedTags1.map((tag) => (
              <button className="selected-button" key={tag} onClick={() => handleSelection(selectedTags1, tag, setSelectedTags1)}>
                Tag1: {tag}
                <span>&times;</span>
              </button>
            ))}
            {selectedTags2.map((tag) => (
              <button className="selected-button" key={tag} onClick={() => handleSelection(selectedTags2, tag, setSelectedTags2)}>
                Tag2: {tag}
                <span>&times;</span>
              </button>
            ))}
          </div>
        </section>
        {showSections && (
          <section className="filters">
            <section className="filters">
              <button onClick={resetFilters}>
                <img className='back-button' src={filterremove} alt='filterremote'/>
              </button>
            </section>
            <section className="filters">
              Search in:
              {selectedSection && (
                <label>
                  <input type="radio" value="section" checked={select === 'section'} onChange={() => setSelect('section')} />
                  {selectedSubsection ? selectedSection + '>' + selectedSubsection : selectedSection}
                </label>
              )}
              <label>
                <input type="radio" value="allSections" checked={select === 'allSections'} onChange={() => setSelect('allSections')} />
                All Sections
              </label>
            </section>
            <section className="filters">
              <input onChange={(e) => setInput(e.target.value)} type="search" id="searchName" title="Filter by book name" placeholder="Filter by id name author" value={input} />
              {input && (
                // <button className="clear-input" onClick={() => setInput('')}>
                  // ❌
                // </button>
                 <img className="back-button" src={cancel} onClick={() => setInput('')} alt="Cancel" />
              )}
            </section>
            <section className="filters">
              <div>
                <h3>Filter by Tags</h3>
                <table>
                  <tbody>
                    <tr>
                      <th>Size:</th>
                      {uniqueSizes.map((size) => (
                        <td key={size}>
                        <label>
                          <input type="checkbox" value={size} checked={selectedSizes.includes(size)} onChange={() => handleSelection(selectedSizes, size, setSelectedSizes)} />
                          {size}
                        </label>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th>Color:</th>
                    {uniqueColor.map((color) => (
                      <td key={color}>
                        <label>
                          <input type="checkbox" value={color} checked={selectedColor.includes(color)} onChange={() => handleSelection(selectedColor, color, setSelectedColor)} />
                          {color}
                        </label>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th>Author:</th>
                    {uniqueAuthors.map((author) => (
                      <td key={author}>
                        <label>
                          <input type="checkbox" value={author} checked={selectedAuthors.includes(author)} onChange={() => handleSelection(selectedAuthors, author, setSelectedAuthors)} />
                          {author}
                        </label>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th>Tag1:</th>
                    {uniqueTags1.map((tag1) => (
                      <td key={tag1}>
                        <label>
                          <input type="checkbox" value={tag1} checked={selectedTags1.includes(tag1)} onChange={() => handleSelection(selectedTags1, tag1, setSelectedTags1)} />
                          {tag1}
                        </label>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th>Tag2:</th>
                    {uniqueTags2.map((tag2) => (
                      <td key={tag2}>
                        <label>
                          <input type="checkbox" value={tag2} checked={selectedTags2.includes(tag2)} onChange={() => handleSelection(selectedTags2, tag2, setSelectedTags2)} />
                          {tag2}
                        </label>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <button>
                {showSections && (
                  <img className="back-button" src={upmenu} onClick={toggleSections} alt="Cancel" />
                )}
              </button>
            </div>
          </section>
        </section>
      )} 
     {sortedBooks.length>0 &&(
     <div className="filters">
          <button onClick={list}>
            <img className="back-button" src={list_icon} alt='List view' />
          </button>
          <button onClick={comfy}>
            <img className="back-button" src={comfy_icon} alt='Comfortable view' />
          </button>
          <button onClick={sortLowPrice}>
            <img className={`back-button ${selectedSort === 'lowPrice' && 'selected'}`} src={up_sort} alt='price up'/>
          </button>
          <button onClick={sortHighPrice}>
            <img className={`back-button ${selectedSort === 'highPrice' && 'selected'}`} src={down_sort} alt='price down'/>
          </button>
          
          {sortedBooks.some(book => book.sorted === 'new') && (
            <button className={`sort-button ${selectedSort === 'new' && 'selected'}`} onClick={sortByNew}>
             <img src={newcart} className='back-button' alt='newcart'/>
            </button>
          )}
          {sortedBooks.some(book => book.sorted === 'popular') && (
            <button className={`sort-button ${selectedSort === 'popular' && 'selected'}`} onClick={sortByPopular}>
             <img src={popular} className='back-button' alt='popular'/>
          </button>
           )}
          {sortedBooks.some(book => book.sorted === 'sale') && (
            <button className={`sort-button ${selectedSort === 'sale' && 'selected'}`} onClick={sortBySale}>
             <img src={discont} className='back-button' alt='discont'/>
            </button>
          )}

        </div>
        )}
      {sortedBooks.length===0 &&(
        <div>Oops found 0 try again</div>
      )}

    <ScrollToTopButton />
    <Shelf book={sortedBooks.filter(book => book.Visibility !== 0)} widhtblock={widthBlock}/>
    
    </section>
  );
}
