import React, { useEffect, useState, useContext } from 'react';
import Shelf from './Shelf';
import './bookList.css';
import { BooksContext } from '../../BooksContext';
import { Link } from 'react-router-dom';
import ScrollToTopButton from './ScrollToTopButton';
import down_sort from '../cart/img/down_sort.png';
import up_sort from '../cart/img/up_sort.png';
import list_icon from '../cart/img/list_icon.png';
import comfy_icon from '../cart/img/comfy_icon.png';
import burger from '../cart/img/burger.png';

export default function BookList() {
  const { theme, books, filterBooks, setFilterBooks } = useContext(BooksContext);
  const [sortedBooks, setSortedBooks] = useState([]);
  const [widthBlock, setWidthBlock] = useState(0);
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubsection, setSelectedSubsection] = useState(null);
  const [showSections, setShowSections] = useState(false);
  const [input, setInput] = useState('');
  const [select, setSelect] = useState('default');
  const [selectedTags1, setSelectedTags1] = useState([]);
  const [selectedTags2, setSelectedTags2] = useState([]);
  const [selectedTips, setSelectedTips] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSorted, setSelectedSorted] = useState('default');
  const [selectedColor, setSelectedColor] = useState([]);
  const [uniqueTags1, setUniqueTags1] = useState([]);
  const [uniqueTags2, setUniqueTags2] = useState([]);
  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [uniqueSortedValues, setUniqueSortedValues] = useState([]);
  const [uniqueColor, setUniqueColor] = useState([]);

  useEffect(() => {
    setSortedBooks(filterBooks.length > 0 ? filterBooks : books);
  }, [filterBooks, books]);

  useEffect(() => {
    extractSections();
  }, [books]);

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

  const lowPrice = () => {
    setSortedBooks(prevBooks => (
      [...prevBooks].sort((a, b) => a.price - b.price)
    ));
  };

  const highPrice = () => {
    setSortedBooks(prevBooks => (
      [...prevBooks].sort((a, b) => b.price - a.price)
    ));
  };

  const list = () => {
    setWidthBlock(1);
  };

  const comfy = () => {
    setWidthBlock(0);
  };

  const toggleSections = () => {
    setShowSections(prevState => !prevState);
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setSelectedSubsection(null);
    if (section === 'Показать все') {
      setSortedBooks(books);
    } else {
      const filteredBooks = books.filter(book => book.section === section);
      setSortedBooks(filteredBooks);
    }
  };

  const handleSubsectionClick = (subsection) => {
    setSelectedSubsection(subsection);
    const filteredBooks = books.filter(book => book.section === selectedSection && book.partition === subsection);
    setSortedBooks(filteredBooks);
  };

  const handleShowAll = () => {
    resetFilters();
    setSortedBooks(books.filter((book) => book.Visibility !== '0'));
  };

  const handleSelection = (selectedItems, item, setSelectedItems) => {
    setSelectedItems((prevItems) =>
      prevItems.includes(item) ? prevItems.filter((selectedItem) => selectedItem !== item) : [...prevItems, item]
    );
  };

  const filtersBooks = (books, key, values) => {
    return values.length > 0 ? books.filter((book) => values.includes(book[key])) : books;
  };

  const findBook = () => {
    let filteredBooks = books.filter((book) => book.title.toLowerCase().includes(input.toLowerCase()));

    if (selectedSorted !== 'default') {
      filteredBooks = [...filteredBooks.filter((book) => book.sorted === selectedSorted)];
    }

    if (selectedTags1.length > 0) {
      filteredBooks = filteredBooks.filter((book) => selectedTags1.includes(book.tags1));
    }

    if (selectedTags2.length > 0) {
      filteredBooks = filteredBooks.filter((book) => selectedTags2.includes(book.tags2));
    }

    if (selectedTips.length > 0) {
      filteredBooks = filteredBooks.filter((book) => selectedTips.includes(book.Tip));
    }

    filteredBooks = filtersBooks(filteredBooks, 'size', selectedSizes);
    filteredBooks = filtersBooks(filteredBooks, 'color', selectedColor);
    filteredBooks = filteredBooks.filter((book) => book.Visibility !== '0');

    if (select === 'ascPrice') {
      setSortedBooks(filteredBooks.sort((a, b) => a.price - b.price));
    } else if (select === 'descPrice') {
      setSortedBooks(filteredBooks.sort((a, b) => b.price - a.price));
    } else {
      setSortedBooks(filteredBooks);
    }
  };

  const findUniqueValues = () => {
    const uniqueTags1Set = new Set();
    const uniqueTags2Set = new Set();
    const uniqueSizesSet = new Set();
    const uniqueSortedValuesSet = new Set();
    const uniqueColorSet = new Set();

    books.forEach((book) => {
      uniqueTags1Set.add(book.tags1);
      uniqueTags2Set.add(book.tags2);
      uniqueSizesSet.add(book.size);
      uniqueSortedValuesSet.add(book.sorted);
      uniqueColorSet.add(book.color);
    });

    setUniqueTags1(Array.from(uniqueTags1Set).filter((tag) => tag.trim() !== ''));
    setUniqueTags2(Array.from(uniqueTags2Set).filter((tag) => tag.trim() !== ''));
    setUniqueSizes(Array.from(uniqueSizesSet).filter((size) => size && size.trim() !== ''));
    setUniqueSortedValues(Array.from(uniqueSortedValuesSet).filter((value) => value !== ''));
    setUniqueColor(Array.from(uniqueColorSet).filter((color) => color && color.trim() !== ''));
  };

  const resetFilters = () => {
    setInput('');
    setSelect('default');
    setSelectedTags1([]);
    setSelectedTags2([]);
    setSelectedSizes([]);
    setSelectedColor([]);
    setSelectedSorted('default');
  };

  useEffect(() => {
    findBook();
    findUniqueValues();
  }, [input, select, selectedTags1, selectedTags2, selectedTips, selectedSizes, selectedSorted, selectedColor]);

  const filtrSet = () => {
    setFilterBooks(sortedBooks);
  };

  return (
    <>
      <section className={theme}>
        <section className="filters">
          <p>Found {sortedBooks.length} books</p>
          <input
            onChange={(e) => setInput(e.target.value)}
            type="search"
            id="searchName"
            title="Search by book name"
            placeholder="🔎Search by name"
            value={input}
          />
          <button onClick={handleShowAll}>All</button>
          <div className="sorted-buttons">
            {uniqueSortedValues.map((sorted) => (
              <button
                key={sorted}
                onClick={() => setSelectedSorted((prevSorted) => (prevSorted === sorted ? 'default' : sorted))}
                style={{
                  backgroundColor: selectedSorted === sorted ? 'green' : 'transparent',
                }}
              >
                {sorted}
              </button>
            ))}
          </div>
        </section>
      </section>
      <div>
        <h3>Filter by Tags</h3>
        <table>
          <tbody>
            <tr>
              <th>Tag1:</th>
              {uniqueTags1.map((tag1) => (
                <td key={tag1}>
                  <label>
                    <input
                      type="checkbox"
                      value={tag1}
                      checked={selectedTags1.includes(tag1)}
                      onChange={() => handleSelection(selectedTags1, tag1, setSelectedTags1)}
                    />
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
                    <input
                      type="checkbox"
                      value={tag2}
                      checked={selectedTags2.includes(tag2)}
                      onChange={() => handleSelection(selectedTags2, tag2, setSelectedTags2)}
                    />
                    {tag2}
                  </label>
                </td>
              ))}
            </tr>
            <tr>
              <th>Size:</th>
              {uniqueSizes.map((size) => (
                <td key={size}>
                  <label>
                    <input
                      type="checkbox"
                      value={size}
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSelection(selectedSizes, size, setSelectedSizes)}
                    />
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
                    <input
                      type="checkbox"
                      value={color}
                      checked={selectedColor.includes(color)}
                      onChange={() => handleSelection(selectedColor, color, setSelectedColor)}
                    />
                    {color}
                  </label>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <button onClick={resetFilters}>Cancel</button>
      </div>
      <Link to="/" className="back-button" onClick={filtrSet}>
        <button>Ok</button>
      </Link>
      <ScrollToTopButton />
      <section className="filters">
        <button>
          <img className="back-button" src={burger} onClick={toggleSections} />
        </button>
        {showSections && (
          <div className="section-list">
            <ul>
              {sections.map((section, index) => (
                <li key={index} onClick={() => handleSectionClick(section)}>
                  {section === 'Показать все' ? (
                    section
                  ) : (
                    <>
                      {section}
                      {subsections[section] && subsections[section].size > 0 && <span style={{ marginLeft: '4px' }}>+</span>}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedSection && selectedSection !== 'Показать все' && (
          <div className="subsection-list">
            <ul>
              {Array.from(subsections[selectedSection] || []).map((subsection, index) => (
                <li key={index} onClick={() => handleSubsectionClick(subsection)}>
                  {subsection}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button>
          <img className="back-button" src={list_icon} onClick={list} />
        </button>
        <button>
          <img className="back-button" src={comfy_icon} onClick={comfy} />
        </button>
        <button>
          <img className="back-button" src={up_sort} onClick={lowPrice} />
        </button>
        <button>
          <img className="back-button" src={down_sort} onClick={highPrice} />
        </button>
      </section>
      <Shelf book={sortedBooks} widhtblock={widthBlock} />
    </>
  );
}
