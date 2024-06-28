import React, { useState, useEffect, useCallback, useContext } from 'react';
import './bookList.css';
import { useNavigate, Link } from 'react-router-dom';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import SortCart from './SortCart';

export default function Search() {
  const {
    books,
    theme,
    glsearch,
    setSearch,
    searchOptions,
    setSearchOptions,
    fieldState,
  } = useContext(BooksContext);

  const {
    burger,
    cancel,
    upmenu,
    filter,
    search, } = useIcons();

  const [sortBook, setSortBook] = useState([]);
  const [showSections, setShowSections] = useState(false);
  const navigate = useNavigate();

  const toggleSections = () => {
    setShowSections((prevState) => !prevState);
  };

  const findBook = useCallback(() => {
    let filteredBooks = books.filter(
      (book) =>
        (searchOptions.byTitle && book.title.toString().toLowerCase().includes(glsearch.toLowerCase())) ||
        (searchOptions.byID && book.id.toString().toLowerCase().includes(glsearch.toLowerCase())) ||
        (searchOptions.byAuthor && book.author.toString().toLowerCase().includes(glsearch.toLowerCase())) ||
        (searchOptions.byTags &&
          (book.tags1.toString().toLowerCase().includes(glsearch.toLowerCase()) ||
            book.tags2.toString().toLowerCase().includes(glsearch.toLowerCase()) ||
            book.tags3.toString().toLowerCase().includes(glsearch.toLowerCase()) ||
            book.tags4.toString().toLowerCase().includes(glsearch.toLowerCase()) ||
            book.tags5.toString().toLowerCase().includes(glsearch.toLowerCase()) ||
            book.tags6.toString().toLowerCase().includes(glsearch.toLowerCase()) ||
            book.tags7.toString().toLowerCase().includes(glsearch.toLowerCase()) ||
            book.tags8.toString().toLowerCase().includes(glsearch.toLowerCase()) ||
            book.size.toString().toLowerCase().includes(glsearch.toLowerCase()) ||
            book.color.toString().toLowerCase().includes(glsearch.toLowerCase()))) ||
        (searchOptions.byDescription &&
          (book.shortDescription.toString().toLowerCase().includes(glsearch.toLowerCase()) ||
            book.description.toString().toLowerCase().includes(glsearch.toLowerCase())))
    );
    setSortBook(filteredBooks.filter((book) => book.Visibility !== '0'));
  }, [books, glsearch, searchOptions]);

  useEffect(() => {
    if (books.length === 0) {
      navigate('/');
    }
    findBook();
  }, [books, findBook, navigate]);

  if (books.length === 0) {
    return null;
  }

 
  const resetSearch = () => {
    setSearch("");
  };

  const handleCheckboxChange = (option) => {
    setSearchOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  return (
    <section className={theme}>
      <section className="filters">
        <Link to="/BookList">
          <button className='sort-button'>
            <img className="back-button" src={burger} alt="category" />
          </button>
        </Link>
        <Link to="/Filter">
          <button className='sort-button'>
            <img className="back-button" src={filter} alt="filter" />
          </button>
        </Link>
        <button className='sort-button selected'>
          {!showSections && (
            <img className="back-button selected" src={search} onClick={toggleSections} alt="Search" />
          )}
          {showSections && (
            <img className="back-button selected" src={cancel} onClick={toggleSections} alt="Cancel" />
          )}
        </button>
      </section>

      <section className="filters">
        <div className="selected-tags">
          {/* Found: {sortBook.length} */}
          <span>
            Found: <strong>{sortBook.length}</strong>
          </span>
          {glsearch && (
            <button className="selected-button" onClick={resetSearch}>
              Search by: <strong>{glsearch}</strong> <span>❌</span>
            </button>
          )}
        </div>
      </section>

      {showSections && (
        <>
          <div className='filters'>
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              id="searchName"
              title="Search by id name author"
              placeholder="🔎Search by ..."
              value={glsearch}
            />
            <button className='selected-button'>
              <img className="back-button" src={cancel} onClick={resetSearch} alt="Cancel" />
            </button>
          </div>
          <div className="filters">
            <label>
              <input
                type="checkbox"
                checked={searchOptions.byTitle}
                onChange={() => handleCheckboxChange('byTitle')}
              />
              {fieldState.title && fieldState.title !== "" ? fieldState.title : "Product Name:"}
            </label>
          </div>
          <div className="filters">
            <label>
              <input
                type="checkbox"
                checked={searchOptions.byID}
                onChange={() => handleCheckboxChange('byID')}
              />
              {fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}
            </label>
          </div>
          <div className="filters">
            <label>
              <input
                type="checkbox"
                checked={searchOptions.byAuthor}
                onChange={() => handleCheckboxChange('byAuthor')}
              />
              {fieldState.author && fieldState.author !== "" ? fieldState.author : "Author:"}
            </label>
          </div>
          <div className="filters">
            <label>
              <input
                type="checkbox"
                checked={searchOptions.byTags}
                onChange={() => handleCheckboxChange('byTags')}
              />
              #Tags
            </label>
          </div>
          <div className="filters">
            <label>
              <input
                type="checkbox"
                checked={searchOptions.byDescription}
                onChange={() => handleCheckboxChange('byDescription')}
              />
              {fieldState.shortDescription && fieldState.shortDescription !== "" ? fieldState.shortDescription : "Description:"}
            </label>
          </div>
        </>
      )}

      {showSections && (
        <section className="filters">
          <button>
            <img className="back-button" src={upmenu} onClick={toggleSections} alt="Cancel" />
          </button>
        </section>
      )}

      <SortCart props={sortBook} />
    </section>
  );
}