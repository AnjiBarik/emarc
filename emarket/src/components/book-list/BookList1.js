import React, { useEffect, useState, useContext, useCallback } from 'react';
import Shelf from './Shelf';
import './bookList.css';
import { BooksContext } from '../../BooksContext';
import ScrollToTopButton from './ScrollToTopButton';

export default function BookList() {
  const { theme, setTheme, books } = useContext(BooksContext);

  const toggleTheme = () => {
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
  };

  const getLocalStorageItem = (key, defaultValue) => {
    return localStorage.getItem(key) || defaultValue;
  };

  const [input, setInput] = useState(getLocalStorageItem('bookListInput', ''));
  const [select, setSelect] = useState(getLocalStorageItem('bookListSelect', 'default'));
  const [selectedTags1, setSelectedTags1] = useState(JSON.parse(getLocalStorageItem('selectedTags1', '[]')));
  const [selectedTags2, setSelectedTags2] = useState(JSON.parse(getLocalStorageItem('selectedTags2', '[]')));
  const [selectedTips, setSelectedTips] = useState(JSON.parse(getLocalStorageItem('selectedTips', '[]')));
  const [selectedSizes, setSelectedSizes] = useState(JSON.parse(getLocalStorageItem('selectedSizes', '[]')));
  const [selectedSorted, setSelectedSorted] = useState(getLocalStorageItem('selectedSorted', 'default'));

  const [sortedBooks, setSortedBooks] = useState([...books]);
  const [uniqueTags1, setUniqueTags1] = useState([]);
  const [uniqueTags2, setUniqueTags2] = useState([]);
  const [uniqueTipValues, setUniqueTipValues] = useState([]);
  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [uniqueSortedValues, setUniqueSortedValues] = useState([]);
  const [filterWindowVisible, setFilterWindowVisible] = useState(false);

  const applyFilter = () => setFilterWindowVisible(false);
  const filtrReset = () => setSelectedTags1([]) || setSelectedTags2([]) || setSelectedTips([]) || setSelectedSizes([]) || setSelectedSorted('default') || setFilterWindowVisible(false);

  const resetFilters = () => {
    setInput('');
    setSelect('default');
    filtrReset();
  };

  const handleShowAll = () => {
    resetFilters();
    setSortedBooks(books.filter((book) => book.Visibility !== '0'));
  };

  const handleSelection = useCallback((selectedItems, item, setSelectedItems) => {
    if (selectedItems.includes(item) || item === '') {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  }, []);

  const handleSelectionSize = useCallback((selectedItems, item, setSelectedItems) => {
    if (selectedItems.includes(item) || item === '') {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  }, []);

  const filterBySize = useCallback((books, sizes) => {
    return sizes.length > 0 ? books.filter((book) => sizes.includes(book.size)) : books;
  }, []);

  const findBook = useCallback(() => {
    const filterBookList = (books, key, value) => {
      return books.filter((book) => book[key].toLowerCase().includes(value.toLowerCase()));
    };

    let filteredBooks = filterBookList(books, 'title', input);

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

    filteredBooks = filterBySize(filteredBooks, selectedSizes);

    filteredBooks = filteredBooks.filter((book) => book.Visibility !== '0');

    if (select === 'ascPrice') {
      setSortedBooks(filteredBooks.sort((a, b) => a.price - b.price));
    } else if (select === 'descPrice') {
      setSortedBooks(filteredBooks.sort((a, b) => b.price - a.price));
    } else {
      setSortedBooks(filteredBooks);
    }
  }, [books, filterBySize, input, select, selectedSizes, selectedSorted, selectedTags1, selectedTags2, selectedTips]);

  const findUniqueTags = useCallback(() => {
    const uniqueTags1Set = new Set();
    const uniqueTags2Set = new Set();

    books.forEach((book) => {
      uniqueTags1Set.add(book.tags1);
      uniqueTags2Set.add(book.tags2);
    });

    setUniqueTags1(Array.from(uniqueTags1Set).filter((tag1) => tag1.trim() !== ''));
    setUniqueTags2(Array.from(uniqueTags2Set).filter((tag2) => tag2.trim() !== ''));
  }, [books]);

  const findUniqueTipValues = useCallback(() => {
    setUniqueTipValues(Array.from(new Set(books.map((book) => book.Tip))));
  }, [books]);

  const findUniqueSizes = useCallback(() => {
    const uniqueSizesSet = new Set();

    books.forEach((book) => {
      uniqueSizesSet.add(book.size);
    });

    setUniqueSizes(Array.from(uniqueSizesSet).filter((size) => size && size.trim() !== ''));
  }, [books]);

  const handleSelectionSorted = useCallback((item) => {
    setSelectedSorted(item === selectedSorted ? 'default' : item);
  }, [selectedSorted]);

  const findUniqueSortedValues = useCallback(() => {
    setUniqueSortedValues(Array.from(new Set(books.map((book) => book.sorted))));
  }, [books]);

  useEffect(() => {
    const storedTags1 = JSON.parse(getLocalStorageItem('selectedTags1', '[]'));
    const storedTags2 = JSON.parse(getLocalStorageItem('selectedTags2', '[]'));
    const storedTips = JSON.parse(getLocalStorageItem('selectedTips', '[]'));
    const storedSizes = JSON.parse(getLocalStorageItem('selectedSizes', '[]'));
    const storedSorted = getLocalStorageItem('selectedSorted', 'default');

    setSelectedTags1(storedTags1);
    setSelectedTags2(storedTags2);
    setSelectedTips(storedTips);
    setSelectedSizes(storedSizes);
    setSelectedSorted(storedSorted);
  }, []);

  useEffect(() => {
    localStorage.setItem('bookListInput', input);
    localStorage.setItem('bookListSelect', select);
    localStorage.setItem('selectedSizes', JSON.stringify(selectedSizes));
    localStorage.setItem('selectedSorted', selectedSorted);
  }, [input, select, selectedSizes, selectedSorted]);

  useEffect(() => {
    findBook();
    findUniqueTipValues();
  }, [findBook, findUniqueTipValues]);

  useEffect(() => {
    findUniqueTags();
    findUniqueSizes();
    findUniqueSortedValues();
  }, [findUniqueTags, findUniqueSizes, findUniqueSortedValues]);

  return (
    <>
      <section className={theme}>
        <section className="filters">
          <button
            className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🔅' : '🔆'}
          </button>

          <input
            onChange={(e) => setInput(e.target.value)}
            type="search"
            id="searchName"
            title="Search by book name"
            placeholder="🔎Search by name"
            value={input}
          />

          <select
            onChange={(e) => {
              setSelect(e.target.value);
            }}
            id="sortPrice"
            title="sortPrice"
            autoComplete="off"
            value={select}
          >
            <option value="default">Sort default</option>
            <option value="ascPrice">Sort by Price (Low to High)</option>
            <option value="descPrice">Sort by Price (High to Low)</option>
            
          </select>

          <button onClick={resetFilters} className="reset-button">
            ❌
          </button>

          <button onClick={() => setFilterWindowVisible(true)}>Filter</button>

          <button onClick={handleShowAll}>All</button>

          {/* Buttons for selecting "Tip" in the main window */}
          <div className="tip-buttons">
            {uniqueTipValues.map((tip) => (
              <button
                key={tip}
                onClick={() => handleSelection(selectedTips, tip, setSelectedTips)}
                style={{
                  backgroundColor: selectedTips.includes(tip) ? 'green' : 'transparent',
                }}
              >
                {tip}
              </button>
            ))}
          </div>

          {/* Buttons for selecting "Sorted" in the main window */}
          <div className="sorted-buttons">
            {uniqueSortedValues.map((sorted) => (
              <button
                key={sorted}
                onClick={() => handleSelectionSorted(sorted)}
                style={{
                  backgroundColor: selectedSorted === sorted ? 'green' : 'transparent',
                }}
              >
                {sorted}
              </button>
            ))}
          </div>
        </section>

        <ScrollToTopButton />
        <Shelf book={sortedBooks} />
      </section>

      {filterWindowVisible && (
        <div className="filter-window">
          <h3>Filter by Tags</h3>
          <div>
            <label>Tag1:</label>
            {uniqueTags1.map((tag1) => (
              <label key={tag1}>
                <input
                  type="checkbox"
                  value={tag1}
                  checked={selectedTags1.includes(tag1)}
                  onChange={() => handleSelection(selectedTags1, tag1, setSelectedTags1)}
                />
                {tag1}
              </label>
            ))}
          </div>
          <div>
            <label>Tag2</label>
            {uniqueTags2.map((tag2) => (
              <label key={tag2}>
                <input
                  type="checkbox"
                  value={tag2}
                  checked={selectedTags2.includes(tag2)}
                  onChange={() => handleSelection(selectedTags2, tag2, setSelectedTags2)}
                />
                {tag2}
              </label>
            ))}
          </div>

          <div>
            <label>Size:</label>
            {uniqueSizes.map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  value={size}
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSelectionSize(selectedSizes, size, setSelectedSizes)}
                />
                {size}
              </label>
            ))}
          </div>

          <div>
            <label>Sorted:</label>
            {uniqueSortedValues.map((sorted) => (
              <label key={sorted}>
                <input
                  type="checkbox"
                  value={sorted}
                  checked={selectedSorted === sorted}
                  onChange={() => handleSelectionSorted(sorted)}
                />
                {sorted}
              </label>
            ))}
          </div>

          <button onClick={applyFilter}>OK</button>
          <button onClick={filtrReset}>Cancel</button>
        </div>
      )}
    </>
  );
}


// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from './ScrollToTopButton';

// export default function BookList() {
//   const { theme, setTheme, books } = useContext(BooksContext);

//   const toggleTheme = () => {
//     setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const getLocalStorageItem = (key, defaultValue) => {
//     return localStorage.getItem(key) || defaultValue;
//   };

//   const [input, setInput] = useState(getLocalStorageItem('bookListInput', ''));
//   const [select, setSelect] = useState(getLocalStorageItem('bookListSelect', 'default'));
//   const [selectedTags1, setSelectedTags1] = useState(JSON.parse(getLocalStorageItem('selectedTags1', '[]')));
//   const [selectedTags2, setSelectedTags2] = useState(JSON.parse(getLocalStorageItem('selectedTags2', '[]')));
//   const [selectedTips, setSelectedTips] = useState(JSON.parse(getLocalStorageItem('selectedTips', '[]')));
//   const [selectedSizes, setSelectedSizes] = useState(JSON.parse(getLocalStorageItem('selectedSizes', '[]')));

//   const [sortedBooks, setSortedBooks] = useState([...books]);
//   const [uniqueTags1, setUniqueTags1] = useState([]);
//   const [uniqueTags2, setUniqueTags2] = useState([]);
//   const [uniqueTipValues, setUniqueTipValues] = useState([]);
//   const [uniqueSizes, setUniqueSizes] = useState([]);
//   const [filterWindowVisible, setFilterWindowVisible] = useState(false);

//   const applyFilter = () => setFilterWindowVisible(false);
//   const filtrReset = () => setSelectedTags1([]) || setSelectedTags2([]) || setSelectedTips([]) || setSelectedSizes([]) || setFilterWindowVisible(false);

//   const resetFilters = () => {
//     setInput('');
//     setSelect('default');
//     filtrReset();
//   };

//   const handleShowAll = () => {
//     resetFilters();
//     setSortedBooks(books.filter((book) => book.Visibility !== '0'));
//   };

//   const handleSelection = useCallback((selectedItems, item, setSelectedItems) => {
//     if (selectedItems.includes(item) || item === '') {
//       setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
//     } else {
//       setSelectedItems([...selectedItems, item]);
//     }
//   }, []);

//   const handleSelectionSize = useCallback((selectedItems, item, setSelectedItems) => {
//     if (selectedItems.includes(item) || item === '') {
//       setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
//     } else {
//       setSelectedItems([...selectedItems, item]);
//     }
//   }, []);

//   const filterBySize = useCallback((books, sizes) => {
//     return sizes.length > 0 ? books.filter((book) => sizes.includes(book.size)) : books;
//   }, []);

//   const findBook = useCallback(() => {
//     const filterBookList = (books, key, value) => {
//       return books.filter((book) => book[key].toLowerCase().includes(value.toLowerCase()));
//     };

//     let filteredBooks = filterBookList(books, 'title', input);

//     if (select === 'new') {
//       filteredBooks = [...filteredBooks.filter((book) => book.sorted === 'new')];
//     } else if (select === 'popular') {
//       filteredBooks = [...filteredBooks.filter((book) => book.sorted === 'popular')];
//     } else if (select === 'sale') {
//       filteredBooks = [...filteredBooks.filter((book) => book.sorted === 'sale')];
//     }

//     if (selectedTags1.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTags1.includes(book.tags1));
//     }

//     if (selectedTags2.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTags2.includes(book.tags2));
//     }

//     if (selectedTips.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTips.includes(book.Tip));
//     }

//     filteredBooks = filterBySize(filteredBooks, selectedSizes);

//     filteredBooks = filteredBooks.filter((book) => book.Visibility !== '0');

//     if (select === 'ascPrice') {
//       setSortedBooks(filteredBooks.sort((a, b) => a.price - b.price));
//     } else if (select === 'descPrice') {
//       setSortedBooks(filteredBooks.sort((a, b) => b.price - a.price));
//     } else {
//       setSortedBooks(filteredBooks);
//     }
//   }, [books, filterBySize, input, select, selectedSizes, selectedTags1, selectedTags2, selectedTips]);

//   const findUniqueTags = useCallback(() => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();

//     books.forEach((book) => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//     });

//     setUniqueTags1(Array.from(uniqueTags1Set).filter((tag1) => tag1.trim() !== ''));
//     setUniqueTags2(Array.from(uniqueTags2Set).filter((tag2) => tag2.trim() !== ''));
//   }, [books]);

//   const findUniqueTipValues = useCallback(() => {
//     setUniqueTipValues(Array.from(new Set(books.map((book) => book.Tip))));
//   }, [books]);

//   const findUniqueSizes = useCallback(() => {
//     const uniqueSizesSet = new Set();

//     books.forEach((book) => {
//       uniqueSizesSet.add(book.size);
//     });

//     setUniqueSizes(Array.from(uniqueSizesSet).filter((size) => size && size.trim() !== ''));
//   }, [books]);

//   useEffect(() => {
//     const storedTags1 = JSON.parse(getLocalStorageItem('selectedTags1', '[]'));
//     const storedTags2 = JSON.parse(getLocalStorageItem('selectedTags2', '[]'));
//     const storedTips = JSON.parse(getLocalStorageItem('selectedTips', '[]'));
//     const storedSizes = JSON.parse(getLocalStorageItem('selectedSizes', '[]'));

//     setSelectedTags1(storedTags1);
//     setSelectedTags2(storedTags2);
//     setSelectedTips(storedTips);
//     setSelectedSizes(storedSizes);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('bookListInput', input);
//     localStorage.setItem('bookListSelect', select);
//     localStorage.setItem('selectedSizes', JSON.stringify(selectedSizes));
//   }, [input, select, selectedSizes]);

//   useEffect(() => {
//     findBook();
//     findUniqueTipValues();
//   }, [findBook, findUniqueTipValues]);

//   useEffect(() => {
//     findUniqueTags();
//     findUniqueSizes();
//   }, [findUniqueTags, findUniqueSizes]);

//   return (
//     <>
//       <section className={theme}>
//         <section className="filters">
//           <button
//             className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
//             onClick={toggleTheme}
//           >
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>

//           <input
//             onChange={(e) => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />

//           <select
//             onChange={(e) => {
//               setSelect(e.target.value);
//             }}
//             id="sortPrice"
//             title="sortPrice"
//             autoComplete="off"
//             value={select}
//           >
//             <option value="default">Sort default</option>
//             <option value="ascPrice">Sort by Price (Low to High)</option>
//             <option value="descPrice">Sort by Price (High to Low)</option>
//             <option value="new">New</option>
//             <option value="popular">Popular</option>
//             <option value="sale">Sale</option>
//           </select>

//           <button onClick={resetFilters} className="reset-button">
//             ❌
//           </button>

//           <button onClick={() => setFilterWindowVisible(true)}>Filter</button>

//           <button onClick={handleShowAll}>All</button>

//           {/* Buttons for selecting "Tip" in the main window */}
//           <div className="tip-buttons">
//             {uniqueTipValues.map((tip) => (
//               <button
//                 key={tip}
//                 onClick={() => handleSelection(selectedTips, tip, setSelectedTips)}
//                 style={{
//                   backgroundColor: selectedTips.includes(tip) ? 'green' : 'transparent',
//                 }}
//               >
//                 {tip}
//               </button>
//             ))}
//           </div>
//         </section>

//         <ScrollToTopButton />
//         <Shelf book={sortedBooks} />
//       </section>

//       {filterWindowVisible && (
//         <div className="filter-window">
//           <h3>Filter by Tags</h3>
//           <div>
//             <label>Tag1:</label>
//             {uniqueTags1.map((tag1) => (
//               <label key={tag1}>
//                 <input
//                   type="checkbox"
//                   value={tag1}
//                   checked={selectedTags1.includes(tag1)}
//                   onChange={() => handleSelection(selectedTags1, tag1, setSelectedTags1)}
//                 />
//                 {tag1}
//               </label>
//             ))}
//           </div>
//           <div>
//             <label>Tag2</label>
//             {uniqueTags2.map((tag2) => (
//               <label key={tag2}>
//                 <input
//                   type="checkbox"
//                   value={tag2}
//                   checked={selectedTags2.includes(tag2)}
//                   onChange={() => handleSelection(selectedTags2, tag2, setSelectedTags2)}
//                 />
//                 {tag2}
//               </label>
//             ))}
//           </div>

//           <div>
//             <label>Size:</label>
//             {uniqueSizes.map((size) => (
//               <label key={size}>
//                 <input
//                   type="checkbox"
//                   value={size}
//                   checked={selectedSizes.includes(size)}
//                   onChange={() => handleSelectionSize(selectedSizes, size, setSelectedSizes)}
//                 />
//                 {size}
//               </label>
//             ))}
//           </div>

//           <button onClick={applyFilter}>OK</button>
//           <button onClick={filtrReset}>Cancel</button>
//         </div>
//       )}
//     </>
//   );
// }


// import React, { useEffect, useState, useContext } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from './ScrollToTopButton';

// export default function BookList() {
//   const { theme, setTheme, books } = useContext(BooksContext);

//   const toggleTheme = () => {
//     setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const getLocalStorageItem = (key, defaultValue) => {
//     return localStorage.getItem(key) || defaultValue;
//   };

//   const [input, setInput] = useState(getLocalStorageItem('bookListInput', ''));
//   const [select, setSelect] = useState(getLocalStorageItem('bookListSelect', 'default'));
//   const [selectedTags1, setSelectedTags1] = useState(JSON.parse(getLocalStorageItem('selectedTags1', '[]')));
//   const [selectedTags2, setSelectedTags2] = useState(JSON.parse(getLocalStorageItem('selectedTags2', '[]')));
//   const [selectedTips, setSelectedTips] = useState(JSON.parse(getLocalStorageItem('selectedTips', '[]')));
//   const [selectedSizes, setSelectedSizes] = useState(JSON.parse(getLocalStorageItem('selectedSizes', '[]')));

//   const [sortedBooks, setSortedBooks] = useState([...books]);
//   const [uniqueTags1, setUniqueTags1] = useState([]);
//   const [uniqueTags2, setUniqueTags2] = useState([]);
//   const [uniqueTipValues, setUniqueTipValues] = useState([]);
//   const [uniqueSizes, setUniqueSizes] = useState([]);
//   const [filterWindowVisible, setFilterWindowVisible] = useState(false);

//   const applyFilter = () => setFilterWindowVisible(false);
//   const filtrReset = () => setSelectedTags1([]) || setSelectedTags2([]) || setSelectedTips([]) || setSelectedSizes([]) || setFilterWindowVisible(false);

//   const resetFilters = () => {
//     setInput('');
//     setSelect('default');
//     filtrReset();
//   };

//   const handleShowAll = () => {
//     resetFilters();
//     setSortedBooks(books.filter((book) => book.Visibility !== '0'));
//   };

//   const handleSelection = (selectedItems, item, setSelectedItems) => {
//     if (selectedItems.includes(item) || item === '') {
//       setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
//     } else {
//       setSelectedItems([...selectedItems, item]);
//     }
//   };

//   const handleSelectionSize = (selectedItems, item, setSelectedItems) => {
//     if (selectedItems.includes(item) || item === '') {
//       setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
//     } else {
//       setSelectedItems([...selectedItems, item]);
//     }
//   };

//   const filterBySize = (books, sizes) => {
//     return sizes.length > 0 ? books.filter((book) => sizes.includes(book.size)) : books;
//   };

//   const findBook = () => {
//     const filterBookList = (books, key, value) => {
//       return books.filter((book) => book[key].toLowerCase().includes(value.toLowerCase()));
//     };

//     let filteredBooks = filterBookList(books, 'title', input);

//     if (selectedTags1.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTags1.includes(book.tags1));
//     }

//     if (selectedTags2.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTags2.includes(book.tags2));
//     }

//     if (selectedTips.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTips.includes(book.Tip));
//     }

//     filteredBooks = filterBySize(filteredBooks, selectedSizes);

//     filteredBooks = filteredBooks.filter((book) => book.Visibility !== '0');

//     if (select === 'ascPrice') {
//       setSortedBooks(filteredBooks.sort((a, b) => a.price - b.price));
//     } else if (select === 'descPrice') {
//       setSortedBooks(filteredBooks.sort((a, b) => b.price - a.price));
//     } else if (select === 'new') {
//       setSortedBooks([...books.filter((book) => book.sorted === 'new')]);
//     } else if (select === 'popular') {
//       setSortedBooks([...books.filter((book) => book.sorted === 'popular')]);
//     } else if (select === 'sale') {
//       setSortedBooks([...books.filter((book) => book.sorted === 'sale')]);
//     } else {
//       setSortedBooks(filteredBooks);
//     }
//   };

//   const findUniqueTags = () => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();

//     books.forEach((book) => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//     });

//     setUniqueTags1(Array.from(uniqueTags1Set).filter((tag1) => tag1.trim() !== ''));
//     setUniqueTags2(Array.from(uniqueTags2Set).filter((tag2) => tag2.trim() !== ''));
//   };

//   const findUniqueTipValues = () => {
//     setUniqueTipValues(Array.from(new Set(books.map((book) => book.Tip))));
//   };

//   const findUniqueSizes = () => {
//     const uniqueSizesSet = new Set();

//     books.forEach((book) => {
//       uniqueSizesSet.add(book.size);
//     });

//     setUniqueSizes(Array.from(uniqueSizesSet).filter((size) => size && size.trim() !== ''));
//   };

//   useEffect(() => {
//     const storedTags1 = JSON.parse(getLocalStorageItem('selectedTags1', '[]'));
//     const storedTags2 = JSON.parse(getLocalStorageItem('selectedTags2', '[]'));
//     const storedTips = JSON.parse(getLocalStorageItem('selectedTips', '[]'));
//     const storedSizes = JSON.parse(getLocalStorageItem('selectedSizes', '[]'));

//     setSelectedTags1(storedTags1);
//     setSelectedTags2(storedTags2);
//     setSelectedTips(storedTips);
//     setSelectedSizes(storedSizes);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('bookListInput', input);
//     localStorage.setItem('bookListSelect', select);
//     localStorage.setItem('selectedSizes', JSON.stringify(selectedSizes));
//   }, [input, select, selectedSizes]);

//   useEffect(() => {
//     findBook();
//     findUniqueTipValues();
//   }, [findBook,  findUniqueTipValues ]);

//   useEffect(() => {
//     findUniqueTags();
//     findUniqueSizes();
//   }, [books, findUniqueTags, findUniqueSizes]);

//   return (
//     <>
//       <section className={theme}>
//         <section className="filters">
//           <button
//             className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
//             onClick={toggleTheme}
//           >
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>

//           <input
//             onChange={(e) => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />

//           <select
//             onChange={(e) => {
//               setSelect(e.target.value);
//             }}
//             id="sortPrice"
//             title="sortPrice"
//             autoComplete="off"
//             value={select}
//           >
//             <option value="default">Sort default</option>
//             <option value="ascPrice">Sort by Price (Low to High)</option>
//             <option value="descPrice">Sort by Price (High to Low)</option>
//             <option value="new">New</option>
//             <option value="popular">Popular</option>
//             <option value="sale">Sale</option>
//           </select>

//           <button onClick={resetFilters} className="reset-button">
//             ❌
//           </button>

//           <button onClick={() => setFilterWindowVisible(true)}>Filter</button>

//           <button onClick={handleShowAll}>All</button>

//           {/* Buttons for selecting "Tip" in the main window */}
//           <div className="tip-buttons">
//             {uniqueTipValues.map((tip) => (
//               <button
//                 key={tip}
//                 onClick={() => handleSelection(selectedTips, tip, setSelectedTips)}
//                 style={{
//                   backgroundColor: selectedTips.includes(tip) ? 'green' : 'transparent',
//                 }}
//               >
//                 {tip}
//               </button>
//             ))}
//           </div>

          
          
//         </section>

//         <ScrollToTopButton />
//         <Shelf book={sortedBooks} />
//       </section>

//       {filterWindowVisible && (
//         <div className="filter-window">
//           <h3>Filter by Tags</h3>
//           <div>
//             <label>Tag1:</label>
//             {uniqueTags1.map((tag1) => (
//               <label key={tag1}>
//                 <input
//                   type="checkbox"
//                   value={tag1}
//                   checked={selectedTags1.includes(tag1)}
//                   onChange={() => handleSelection(selectedTags1, tag1, setSelectedTags1)}
//                 />
//                 {tag1}
//               </label>
//             ))}
//           </div>
//           <div>
//             <label>Tag2:</label>
//             {uniqueTags2.map((tag2) => (
//               <label key={tag2}>
//                 <input
//                   type="checkbox"
//                   value={tag2}
//                   checked={selectedTags2.includes(tag2)}
//                   onChange={() => handleSelection(selectedTags2, tag2, setSelectedTags2)}
//                 />
//                 {tag2}
//               </label>
//             ))}
//           </div>

//           <div>
//             <label>Size:</label>
//             {uniqueSizes.map((size) => (
//               <label key={size}>
//                 <input
//                   type="checkbox"
//                   value={size}
//                   checked={selectedSizes.includes(size)}
//                   onChange={() => handleSelectionSize(selectedSizes, size, setSelectedSizes)}
//                 />
//                 {size}
//               </label>
//             ))}
//           </div>

//           <button onClick={applyFilter}>OK</button>
//           <button onClick={filtrReset}>Cancel</button>
//         </div>
//       )}
//     </>
//   );
// }



// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from './ScrollToTopButton';

// export default function BookList() {
//   const { theme, setTheme, books } = useContext(BooksContext);

//   const toggleTheme = () => {
//     setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const getLocalStorageItem = (key, defaultValue) => {
//     return localStorage.getItem(key) || defaultValue;
//   };

//   const [input, setInput] = useState(getLocalStorageItem('bookListInput', ''));
//   const [select, setSelect] = useState(getLocalStorageItem('bookListSelect', 'default'));
//   const [selectedTags1, setSelectedTags1] = useState(JSON.parse(getLocalStorageItem('selectedTags1', '[]')));
//   const [selectedTags2, setSelectedTags2] = useState(JSON.parse(getLocalStorageItem('selectedTags2', '[]')));
//   const [selectedTips, setSelectedTips] = useState(JSON.parse(getLocalStorageItem('selectedTips', '[]')));

//   const [sortedBooks, setSortedBooks] = useState([...books]);
//   const [uniqueTags1, setUniqueTags1] = useState([]);
//   const [uniqueTags2, setUniqueTags2] = useState([]);
//   const [uniqueTipValues, setUniqueTipValues] = useState([]);
//   const [filterWindowVisible, setFilterWindowVisible] = useState(false);

//   const applyFilter = () => setFilterWindowVisible(false);
//   const filtrReset = () => setSelectedTags1([]) || setSelectedTags2([]) || setSelectedTips([]) || setFilterWindowVisible(false);

//   const resetFilters = () => {
//     setInput('');
//     setSelect('default');
//     filtrReset();
//   };

//   const handleShowAll = () => {
//     resetFilters();
//     setSortedBooks(books.filter((book) => book.Visibility !== '0'));
//   };

//   const handleSelection = (selectedItems, item, setSelectedItems) => {
//     if (selectedItems.includes(item) || item === '') {
//       setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
//     } else {
//       setSelectedItems([...selectedItems, item]);
//     }
//   };

//   const findBook = useCallback(() => {
//     const filterBookList = (books, key, value) => {
//       return books.filter((book) => book[key].toLowerCase().includes(value.toLowerCase()));
//     };
  
//     let filteredBooks = filterBookList(books, 'title', input);
  
//     if (selectedTags1.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTags1.includes(book.tags1));
//     }
  
//     if (selectedTags2.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTags2.includes(book.tags2));
//     }
  
//     if (selectedTips.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTips.includes(book.Tip));
//     }
  
//     filteredBooks = filteredBooks.filter((book) => book.Visibility !== '0');
  
//     if (select === 'lowPrice') {
//       setSortedBooks(filteredBooks.sort((a, b) => a.price - b.price));
//     } else if (select === 'highPrice') {
//       setSortedBooks(filteredBooks.sort((a, b) => b.price - a.price));
//     } else if (select === 'new') {
//       setSortedBooks([...books.filter((book) => book.sorted === 'new')]);
//     } else if (select === 'popular') {
//       setSortedBooks([...books.filter((book) => book.sorted === 'popular')]);
//     } else if (select === 'sale') {
//       setSortedBooks([...books.filter((book) => book.sorted === 'sale')]);

//     } else 
//     {
//       setSortedBooks(filteredBooks);
//     }
//   }, [input, select, books, selectedTags1, selectedTags2, selectedTips]);
  
   
//   const findUniqueTags = () => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();

//     books.forEach((book) => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//     });

//     setUniqueTags1(Array.from(uniqueTags1Set).filter((tag1) => tag1.trim() !== ''));
//     setUniqueTags2(Array.from(uniqueTags2Set).filter((tag2) => tag2.trim() !== ''));
//   };

//   const findUniqueTipValues = () => {
//     setUniqueTipValues(Array.from(new Set(books.map((book) => book.Tip))));
//   };

//   useEffect(() => {
//     const storedTags1 = JSON.parse(getLocalStorageItem('selectedTags1', '[]'));
//     const storedTags2 = JSON.parse(getLocalStorageItem('selectedTags2', '[]'));
//     const storedTips = JSON.parse(getLocalStorageItem('selectedTips', '[]'));

//     setSelectedTags1(storedTags1);
//     setSelectedTags2(storedTags2);
//     setSelectedTips(storedTips);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('bookListInput', input);
//     localStorage.setItem('bookListSelect', select);
//   }, [input, select]);

//   useEffect(() => {
//     findBook();
//     findUniqueTipValues();
//   }, [findBook]);

//   useEffect(() => {
//     findUniqueTags();
//   }, [books ]);

//   return (
//     <>
//       <section className={theme}>
//         <section className="filters">
//           <button
//             className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
//             onClick={toggleTheme}
//           >
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>

//           <input
//             onChange={(e) => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />

//           <select
//             onChange={(e) => {
//               setSelect(e.target.value);
             
//             }}
//             id="sortPrice"
//             title="sortPrice"
//             autoComplete="off"
//             value={select}
//           >
//             <option value="default">Sort default</option>
//             <option value="lowPrice">lowPrice</option>
//             <option value="highPrice">highPrice</option>
//             <option value="new">New</option>
//             <option value="popular">Popular</option>
//             <option value="sale">Sale</option>
//           </select>

//           <button onClick={resetFilters} className="reset-button">
//             ❌
//           </button>

//           <button onClick={() => setFilterWindowVisible(true)}>Filter</button>

//           <button onClick={handleShowAll}>All</button>

//           {/* Buttons for selecting "Tip" in the main window */}
//           <div className="tip-buttons">
//             {uniqueTipValues.map((tip) => (
//               <button
//                 key={tip}
//                 onClick={() => handleSelection(selectedTips, tip, setSelectedTips)}
//                 style={{
//                   backgroundColor: selectedTips.includes(tip) ? 'green' : 'transparent',
//                 }}
//               >
//                 {tip}
//               </button>
//             ))}
//           </div>
//         </section>
//         <ScrollToTopButton />
//         <Shelf book={sortedBooks} />
//       </section>

//       {filterWindowVisible && (
//         <div className="filter-window">
//           <h3>Фільтр за тегами</h3>
//           <div>
//             <label>Тег1:</label>
//             {uniqueTags1.map((tag1) => (
//               <label key={tag1}>
//                 <input
//                   type="checkbox"
//                   value={tag1}
//                   checked={selectedTags1.includes(tag1)}
//                   onChange={() => handleSelection(selectedTags1, tag1, setSelectedTags1)}
//                 />
//                 {tag1}
//               </label>
//             ))}
//           </div>
//           <div>
//             <label>Тег2:</label>
//             {uniqueTags2.map((tag2) => (
//               <label key={tag2}>
//                 <input
//                   type="checkbox"
//                   value={tag2}
//                   checked={selectedTags2.includes(tag2)}
//                   onChange={() => handleSelection(selectedTags2, tag2, setSelectedTags2)}
//                 />
//                 {tag2}
//               </label>
//             ))}
//           </div>
//           <button onClick={applyFilter}>ОК</button>
//           <button onClick={filtrReset}>Скасувати</button>
//         </div>
//       )}
//     </>
//   );
// }




// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from './ScrollToTopButton';

// export default function BookList() {
//   const { theme, setTheme, books } = useContext(BooksContext);

//   const toggleTheme = () => {
//     setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const getLocalStorageItem = (key, defaultValue) => {
//     return localStorage.getItem(key) || defaultValue;
//   };

//   const [input, setInput] = useState(getLocalStorageItem('bookListInput', ''));
//   const [select, setSelect] = useState(getLocalStorageItem('bookListSelect', 'default'));
//   const [selectedTags1, setSelectedTags1] = useState(JSON.parse(getLocalStorageItem('selectedTags1', '[]')));
//   const [selectedTags2, setSelectedTags2] = useState(JSON.parse(getLocalStorageItem('selectedTags2', '[]')));
//   const [selectedTips, setSelectedTips] = useState(JSON.parse(getLocalStorageItem('selectedTips', '[]')));

//   const [sortedBooks, setSortedBooks] = useState([...books]);
//   const [uniqueTags1, setUniqueTags1] = useState([]);
//   const [uniqueTags2, setUniqueTags2] = useState([]);
//   const [uniqueTipValues, setUniqueTipValues] = useState([]);
//   const [filterWindowVisible, setFilterWindowVisible] = useState(false);

//   const applyFilter = () => setFilterWindowVisible(false);
//   const filtrReset = () => setSelectedTags1([]) || setSelectedTags2([]) || setSelectedTips([]) || setFilterWindowVisible(false);

//   const resetFilters = () => {
//     setInput('');
//     setSelect('default');
//     filtrReset();
//   };

//   const handleShowAll = () => {
//     resetFilters();
//     setSortedBooks(books.filter((book) => book.Visibility !== '0'));
//   };

//   const handleSelection = (selectedItems, item, setSelectedItems) => {
//     if (selectedItems.includes(item) || item === '') {
//       setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
//     } else {
//       setSelectedItems([...selectedItems, item]);
//     }
//   };

//   const findBook = useCallback(() => {
//     const filterBookList = (books, key, value) => {
//       return books.filter((book) => book[key].toLowerCase().includes(value.toLowerCase()));
//     };
  
//     let filteredBooks = filterBookList(books, 'title', input);
  
//     if (selectedTags1.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTags1.includes(book.tags1));
//     }
  
//     if (selectedTags2.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTags2.includes(book.tags2));
//     }
  
//     if (selectedTips.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTips.includes(book.Tip));
//     }
  
//     filteredBooks = filteredBooks.filter((book) => book.Visibility !== '0');
  
//     if (select === 'lowPrice') {
//       setSortedBooks(filteredBooks.sort((a, b) => a.price - b.price));
//     } else if (select === 'highPrice') {
//       setSortedBooks(filteredBooks.sort((a, b) => b.price - a.price));
//     } else {
//       setSortedBooks(filteredBooks);
//     }
//   }, [input, select, books, selectedTags1, selectedTags2, selectedTips]);
  
  
//   const findUniqueTags = () => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();

//     books.forEach((book) => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//     });

//     setUniqueTags1(Array.from(uniqueTags1Set).filter((tag1) => tag1.trim() !== ''));
//     setUniqueTags2(Array.from(uniqueTags2Set).filter((tag2) => tag2.trim() !== ''));
//   };

//   const findUniqueTipValues = () => {
//     setUniqueTipValues(Array.from(new Set(books.map((book) => book.Tip))));
//   };

//   useEffect(() => {
//     const storedTags1 = JSON.parse(getLocalStorageItem('selectedTags1', '[]'));
//     const storedTags2 = JSON.parse(getLocalStorageItem('selectedTags2', '[]'));
//     const storedTips = JSON.parse(getLocalStorageItem('selectedTips', '[]'));

//     setSelectedTags1(storedTags1);
//     setSelectedTags2(storedTags2);
//     setSelectedTips(storedTips);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('bookListInput', input);
//     localStorage.setItem('bookListSelect', select);
//   }, [input, select]);

//   useEffect(() => {
//     findBook();
//     findUniqueTipValues();
//   }, [findBook]);

//   useEffect(() => {
//     findUniqueTags();
//   }, [books]);

//   return (
//     <>
//       <section className={theme}>
//         <section className="filters">
//           <button
//             className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
//             onClick={toggleTheme}
//           >
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>

//           <input
//             onChange={(e) => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />

//           <select
//             onChange={(e) => setSelect(e.target.value)}
//             id="sortPrice"
//             title="sortPrice"
//             autoComplete="off"
//             value={select}
//           >
//             <option value="default">default</option>
//             <option value="lowPrice">lowPrice</option>
//             <option value="highPrice">highPrice</option>
//           </select>

//           <button onClick={resetFilters} className="reset-button">
//             ❌
//           </button>

//           <button onClick={() => setFilterWindowVisible(true)}>Фільтр</button>

//           <button onClick={handleShowAll}>Показати все</button>

//           {/* Buttons for selecting "Tip" in the main window */}
//           <div className="tip-buttons">
//             {uniqueTipValues.map((tip) => (
//               <button
//                 key={tip}
//                 onClick={() => handleSelection(selectedTips, tip, setSelectedTips)}
//                 style={{
//                   backgroundColor: selectedTips.includes(tip) ? 'green' : 'transparent',
//                 }}
//               >
//                 {tip}
//               </button>
//             ))}
//           </div>
//         </section>
//         <ScrollToTopButton />
//         <Shelf book={sortedBooks} />
//       </section>

//       {filterWindowVisible && (
//         <div className="filter-window">
//           <h3>Фільтр за тегами</h3>
//           <div>
//             <label>Тег1:</label>
//             {uniqueTags1.map((tag1) => (
//               <label key={tag1}>
//                 <input
//                   type="checkbox"
//                   value={tag1}
//                   checked={selectedTags1.includes(tag1)}
//                   onChange={() => handleSelection(selectedTags1, tag1, setSelectedTags1)}
//                 />
//                 {tag1}
//               </label>
//             ))}
//           </div>
//           <div>
//             <label>Тег2:</label>
//             {uniqueTags2.map((tag2) => (
//               <label key={tag2}>
//                 <input
//                   type="checkbox"
//                   value={tag2}
//                   checked={selectedTags2.includes(tag2)}
//                   onChange={() => handleSelection(selectedTags2, tag2, setSelectedTags2)}
//                 />
//                 {tag2}
//               </label>
//             ))}
//           </div>
//           <button onClick={applyFilter}>ОК</button>
//           <button onClick={filtrReset}>Скасувати</button>
//         </div>
//       )}
//     </>
//   );
// }




// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from './ScrollToTopButton';

// export default function BookList() {
//   const { theme, setTheme, books } = useContext(BooksContext);

//   const toggleTheme = () => {
//     setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const initialInput = localStorage.getItem('bookListInput') || '';
//   const initialSelect = localStorage.getItem('bookListSelect') || 'default';
//   const initialSelectedTags1 = JSON.parse(localStorage.getItem('selectedTags1')) || [];
//   const initialSelectedTags2 = JSON.parse(localStorage.getItem('selectedTags2')) || [];
//   const initialSelectedTips = JSON.parse(localStorage.getItem('selectedTips')) || [];

//   const [input, setInput] = useState(initialInput);
//   const [select, setSelect] = useState(initialSelect);
//   const [sortedBooks, setSortedBooks] = useState([...books]);
//   const [selectedTags1, setSelectedTags1] = useState(initialSelectedTags1);
//   const [selectedTags2, setSelectedTags2] = useState(initialSelectedTags2);
//   const [selectedTips, setSelectedTips] = useState(initialSelectedTips);
//   const [uniqueTags1, setUniqueTags1] = useState([]);
//   const [uniqueTags2, setUniqueTags2] = useState([]);
//   const [uniqueTipValues, setUniqueTipValues] = useState([]);
//   const [filterWindowVisible, setFilterWindowVisible] = useState(false);

//   const applyFilter = () => {
//     setFilterWindowVisible(false);
//   };

//   const handleReset = () => {
//     setInput('');
//     setSelect('default');
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setSelectedTips([]);
//     setFilterWindowVisible(false);
//   };

//   const filtrReset = () => {
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setSelectedTips([]);
//     setFilterWindowVisible(false);
//   };

//   const handleShowAll = () => {
//     // Скидання фільтрів та відображення всіх книжок
//     handleReset();
//     setSortedBooks([...books]);
    
//   };

//   const handleTipSelection = (tip) => {
//     if (selectedTips.includes(tip)) {
//       setSelectedTips(selectedTips.filter((selectedTip) => selectedTip !== tip));
//     } else {
//       setSelectedTips([...selectedTips, tip]);
//     }
//   };

//   const handleTagSelection1 = (tag1) => {
//     if (tag1 === '') {
//       return; // Ignore empty values
//     }

//     if (selectedTags1.includes(tag1)) {
//       setSelectedTags1(selectedTags1.filter((tag) => tag !== tag1));
//     } else {
//       setSelectedTags1([...selectedTags1, tag1]);
//     }
//   };

//   const handleTagSelection2 = (tag2) => {
//     if (tag2 === '') {
//       return; // Ignore empty values
//     }

//     if (selectedTags2.includes(tag2)) {
//       setSelectedTags2(selectedTags2.filter((tag) => tag !== tag2));
//     } else {
//       setSelectedTags2([...selectedTags2, tag2]);
//     }
//   };

//   useEffect(() => {
//     // Збереження вибраних тегів в локальне сховище
//     localStorage.setItem('selectedTags1', JSON.stringify(selectedTags1));
//     localStorage.setItem('selectedTags2', JSON.stringify(selectedTags2));
//     localStorage.setItem('selectedTips', JSON.stringify(selectedTips));
//   }, [selectedTags1, selectedTags2, selectedTips]);

//   const findBook = useCallback(() => {
//     let sortedBooksCopy = [...books];
  
//     sortedBooksCopy = sortedBooksCopy.filter(
//       (el) =>
//         el.title.toLowerCase().includes(input.trim().toLowerCase()) &&
//         el.Visibiliti !== "0"
//     );
  
//     if (selectedTags1.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter((book) =>
//         selectedTags1.includes(book.tags1)
//       );
//     }
  
//     if (selectedTags2.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter((book) =>
//         selectedTags2.includes(book.tags2)
//       );
//     }
  
//     if (selectedTips.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter((book) =>
//         selectedTips.includes(book.Tip)
//       );
//     }
  
//     if (select === 'lowPrice') {
//       setSortedBooks(
//         sortedBooksCopy
//           .filter((book) => book.Visibiliti !== "0")
//           .sort((a, b) => a.price - b.price)
//       );
//     } else if (select === 'highPrice') {
//       setSortedBooks(
//         sortedBooksCopy
//           .filter((book) => book.Visibiliti !== "0")
//           .sort((a, b) => b.price - a.price)
//       );
//     } else {
//       setSortedBooks(sortedBooksCopy.filter((book) => book.Visibiliti !== "0"));
//     }
//   }, [input, select, books, selectedTags1, selectedTags2, selectedTips]);
  

//   const findUniqueTags = () => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();

//     books.forEach((book) => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//     });

//     const uniqueTags1Array = Array.from(uniqueTags1Set);
//     const uniqueTags2Array = Array.from(uniqueTags2Set);

//     setUniqueTags1(uniqueTags1Array);
//     setUniqueTags2(uniqueTags2Array);
//   };

//   function getUniqueValues(arr, key) {
//     const uniqueValues = new Set();
//     arr.forEach((item) => {
//       if (item[key]) {
//         uniqueValues.add(item[key]);
//       }
//     });
//     return Array.from(uniqueValues);
//   }

//   const findUniqueTipValues = () => {
//     const uniqueTipValues = getUniqueValues(books, 'Tip');
//     setUniqueTipValues(uniqueTipValues);
//   };

//   useEffect(() => {
//     // Відновлення вибраних тегів з локального сховища при завантаженні компонента
//     const storedTags1 = JSON.parse(localStorage.getItem('selectedTags1'));
//     const storedTags2 = JSON.parse(localStorage.getItem('selectedTags2'));
//     const storedTips = JSON.parse(localStorage.getItem('selectedTips'));

//     if (storedTags1) {
//       setSelectedTags1(storedTags1);
//     }

//     if (storedTags2) {
//       setSelectedTags2(storedTags2);
//     }

//     if (storedTips) {
//       setSelectedTips(storedTips);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('bookListInput', input);
//     localStorage.setItem('bookListSelect', select);
//   }, [input, select]);

//   useEffect(() => {
//     findBook();
//     findUniqueTipValues();
//   }, [findBook]);

//   useEffect(() => {
//     findUniqueTags();
//   }, [books]);

//   return (
//     <>
//       <section className={theme}>
//         <section className="filters">
//           <button
//             className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
//             onClick={toggleTheme}
//           >
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>

//           <input
//             onChange={(e) => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />

//           <select
//             onChange={(e) => setSelect(e.target.value)}
//             id="sortPrice"
//             title="sortPrice"
//             autoComplete="off"
//             value={select}
//           >
//             <option value="default">default</option>
//             <option value="lowPrice">lowPrice</option>
//             <option value="highPrice">highPrice</option>
//           </select>

//           <button onClick={handleReset} className="reset-button">
//             ❌
//           </button>

//           <button onClick={() => setFilterWindowVisible(true)}>Фільтр</button>

//           <button onClick={handleShowAll}>Показати все</button>

//           {/* Buttons for selecting "Tip" in the main window */}
//           <div className="tip-buttons">
//             {uniqueTipValues.map((tip) => (
//               <button
//                 key={tip}
//                 onClick={() => handleTipSelection(tip)}
//                 style={{
//                   backgroundColor: selectedTips.includes(tip) ? 'green' : 'transparent',
//                 }}
//               >
//                 {tip}
//               </button>
//             ))}
//           </div>
//         </section>
//         <ScrollToTopButton />
//         <Shelf book={sortedBooks} />
//       </section>

//       {filterWindowVisible && (
//         <div className="filter-window">
//           <h3>Фільтр за тегами</h3>
//           <div>
//             <label>Тег1:</label>
//             {uniqueTags1
//               .filter((tag1) => tag1.trim() !== '') // Filter out empty values
//               .map((tag1) => (
//                 <label key={tag1}>
//                   <input
//                     type="checkbox"
//                     value={tag1}
//                     checked={selectedTags1.includes(tag1)}
//                     onChange={() => handleTagSelection1(tag1)}
//                   />
//                   {tag1}
//                 </label>
//               ))}
//           </div>
//           <div>
//             <label>Тег2:</label>
//             {uniqueTags2
//               .filter((tag2) => tag2.trim() !== '') // Filter out empty values
//               .map((tag2) => (
//                 <label key={tag2}>
//                   <input
//                     type="checkbox"
//                     value={tag2}
//                     checked={selectedTags2.includes(tag2)}
//                     onChange={() => handleTagSelection2(tag2)}
//                   />
//                   {tag2}
//                 </label>
//               ))}
//           </div>
//           <button onClick={applyFilter}>ОК</button>
//           <button onClick={filtrReset}>Скасувати</button>
//         </div>
//       )}
//     </>
//   );
// }



// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from './ScrollToTopButton';

// export default function BookList() {
//   const { theme, setTheme, books } = useContext(BooksContext);

//   const toggleTheme = () => {
//     setTheme(theme => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const initialInput = localStorage.getItem('bookListInput') || '';
//   const initialSelect = localStorage.getItem('bookListSelect') || 'default';
//   const initialSelectedTags1 = JSON.parse(localStorage.getItem('selectedTags1')) || [];
//   const initialSelectedTags2 = JSON.parse(localStorage.getItem('selectedTags2')) || [];
//   const initialSelectedTips = JSON.parse(localStorage.getItem('selectedTips')) || [];

//   const [input, setInput] = useState(initialInput);
//   const [select, setSelect] = useState(initialSelect);
//   const [sortedBooks, setSortedBooks] = useState([...books]);
//   const [selectedTags1, setSelectedTags1] = useState(initialSelectedTags1);
//   const [selectedTags2, setSelectedTags2] = useState(initialSelectedTags2);
//   const [selectedTips, setSelectedTips] = useState(initialSelectedTips);
//   const [uniqueTags1, setUniqueTags1] = useState([]);
//   const [uniqueTags2, setUniqueTags2] = useState([]);
//   const [uniqueTipValues, setUniqueTipValues] = useState([]);
//   const [filterWindowVisible, setFilterWindowVisible] = useState(false);

//   const applyFilter = () => {
//     setFilterWindowVisible(false);
//   };

//   const handleReset = () => {
//     setInput('');
//     setSelect('default');
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setSelectedTips([]);
//     setFilterWindowVisible(false);
//   };

//   const filtrReset = () => {
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setSelectedTips([]);
//     setFilterWindowVisible(false);
//   };

//   const handleShowAll = () => {
//     // Скидання фільтрів та відображення всіх книжок
//     handleReset();
//     setSortedBooks([...books]);
    
//   };

//   const handleTipSelection = (tip) => {
//     if (selectedTips.includes(tip)) {
//       setSelectedTips(selectedTips.filter(selectedTip => selectedTip !== tip));
//     } else {
//       setSelectedTips([...selectedTips, tip]);
//     }
//   };

//   const handleTagSelection1 = (tag1) => {
//     if (tag1 === "") {
//       return; // Ignore empty values
//     }
  
//     if (selectedTags1.includes(tag1)) {
//       setSelectedTags1(selectedTags1.filter(tag => tag !== tag1));
//     } else {
//       setSelectedTags1([...selectedTags1, tag1]);
//     }
//   };
  
//   const handleTagSelection2 = (tag2) => {
//     if (tag2 === "") {
//       return; // Ignore empty values
//     }
  
//     if (selectedTags2.includes(tag2)) {
//       setSelectedTags2(selectedTags2.filter(tag => tag !== tag2));
//     } else {
//       setSelectedTags2([...selectedTags2, tag2]);
//     }
//   };
  


 

//   useEffect(() => {
//     // Збереження вибраних тегів в локальне сховище
//     localStorage.setItem('selectedTags1', JSON.stringify(selectedTags1));
//     localStorage.setItem('selectedTags2', JSON.stringify(selectedTags2));
//     localStorage.setItem('selectedTips', JSON.stringify(selectedTips));
//   }, [selectedTags1, selectedTags2, selectedTips]);

//   const findBook = useCallback(() => {
//     let sortedBooksCopy = [...books];

//     sortedBooksCopy = sortedBooksCopy.filter(el =>
//       el.title.toLowerCase().includes(input.trim().toLowerCase())
//     );

//     if (selectedTags1.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTags1.includes(book.tags1)
//       );
//     }

//     if (selectedTags2.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTags2.includes(book.tags2)
//       );
//     }

//     if (selectedTips.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTips.includes(book.Tip)
//       );
//     }

//     if (select === 'lowPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => a.price - b.price));
//     } else if (select === 'highPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => b.price - a.price));
//     } else {
//       setSortedBooks(sortedBooksCopy);
//     }
//   }, [input, select, books, selectedTags1, selectedTags2, selectedTips]);

//   const findUniqueTags = () => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();

//     books.forEach(book => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//     });

//     const uniqueTags1Array = Array.from(uniqueTags1Set);
//     const uniqueTags2Array = Array.from(uniqueTags2Set);

//     setUniqueTags1(uniqueTags1Array);
//     setUniqueTags2(uniqueTags2Array);
//   };

//   function getUniqueValues(arr, key) {
//     const uniqueValues = new Set();
//     arr.forEach(item => {
//       if (item[key]) {
//         uniqueValues.add(item[key]);
//       }
//     });
//     return Array.from(uniqueValues);
//   }

//   const findUniqueTipValues = () => {
//     const uniqueTipValues = getUniqueValues(books, 'Tip');
//     setUniqueTipValues(uniqueTipValues);
//   };

//   useEffect(() => {
//     // Відновлення вибраних тегів з локального сховища при завантаженні компонента
//     const storedTags1 = JSON.parse(localStorage.getItem('selectedTags1'));
//     const storedTags2 = JSON.parse(localStorage.getItem('selectedTags2'));
//     const storedTips = JSON.parse(localStorage.getItem('selectedTips'));
    
//     if (storedTags1) {
//       setSelectedTags1(storedTags1);
//     }

//     if (storedTags2) {
//       setSelectedTags2(storedTags2);
//     }

//     if (storedTips) {
//       setSelectedTips(storedTips);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('bookListInput', input);
//     localStorage.setItem('bookListSelect', select);
//   }, [input, select]);

//   useEffect(() => {
//     findBook();
//     findUniqueTipValues();
//   }, [findBook]);

//   useEffect(() => {
//     findUniqueTags();
//   }, [books]);

//   return (
//     <>
//       <section className={theme}>
//         <section className="filters">
//           <button
//             className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
//             onClick={toggleTheme}
//           >
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>

//           <input
//             onChange={e => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />

//           <select
//             onChange={e => setSelect(e.target.value)}
//             id="sortPrice"
//             title="sortPrice"
//             autoComplete="off"
//             value={select}
//           >
//             <option value="default">default</option>
//             <option value="lowPrice">lowPrice</option>
//             <option value="highPrice">highPrice</option>
//           </select>

//           <button onClick={handleReset} className="reset-button">
//             ❌
//           </button>

//           <button onClick={() => setFilterWindowVisible(true)}>Фільтр</button>

//           <button onClick={handleShowAll}>Показати все</button>

//           {/* Buttons for selecting "Tip" in the main window */}
//           <div className="tip-buttons">
//             {uniqueTipValues.map(tip => (
//               <button
//                 key={tip}
//                 onClick={() => handleTipSelection(tip)}
//                 style={{
//                   backgroundColor: selectedTips.includes(tip) ? 'green' : 'transparent',
//                 }}
//               >
//                 {tip}
//               </button>
//             ))}
//           </div>
//         </section>
//         <ScrollToTopButton />
//         <Shelf book={sortedBooks} />
//       </section>

//       {filterWindowVisible && (
//   <div className="filter-window">
//     <h3>Фільтр за тегами</h3>
//     <div>
//       <label>Тег1:</label>
//       {uniqueTags1
//         .filter(tag1 => tag1.trim() !== '') // Filter out empty values
//         .map(tag1 => (
//           <label key={tag1}>
//             <input
//               type="checkbox"
//               value={tag1}
//               checked={selectedTags1.includes(tag1)}
//               onChange={() => handleTagSelection1(tag1)}
//             />
//             {tag1}
//           </label>
//         ))}
//     </div>
//     <div>
//       <label>Тег2:</label>
//       {uniqueTags2
//         .filter(tag2 => tag2.trim() !== '') // Filter out empty values
//         .map(tag2 => (
//           <label key={tag2}>
//             <input
//               type="checkbox"
//               value={tag2}
//               checked={selectedTags2.includes(tag2)}
//               onChange={() => handleTagSelection2(tag2)}
//             />
//             {tag2}
//           </label>
//         ))}
//     </div>
//     <button onClick={applyFilter}>ОК</button>
//     <button onClick={filtrReset}>Скасувати</button>
//   </div>
// )}



    
//     </>
//   );
// }



// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from './ScrollToTopButton';

// export default function BookList() {
//   const { theme, setTheme, books } = useContext(BooksContext);

//   const toggleTheme = () => {
//     setTheme(theme => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const initialInput = localStorage.getItem('bookListInput') || '';
//   const initialSelect = localStorage.getItem('bookListSelect') || 'default';
//   const initialSelectedTags1 = JSON.parse(localStorage.getItem('selectedTags1')) || [];
//   const initialSelectedTags2 = JSON.parse(localStorage.getItem('selectedTags2')) || [];
//   const initialSelectedTips = JSON.parse(localStorage.getItem('selectedTips')) || [];

//   const [input, setInput] = useState(initialInput);
//   const [select, setSelect] = useState(initialSelect);
//   const [sortedBooks, setSortedBooks] = useState([...books]);
//   const [selectedTags1, setSelectedTags1] = useState(initialSelectedTags1);
//   const [selectedTags2, setSelectedTags2] = useState(initialSelectedTags2);
//   const [selectedTips, setSelectedTips] = useState(initialSelectedTips);
//   const [uniqueTags1, setUniqueTags1] = useState([]);
//   const [uniqueTags2, setUniqueTags2] = useState([]);
//   const [uniqueTipValues, setUniqueTipValues] = useState([]);
//   const [filterWindowVisible, setFilterWindowVisible] = useState(false);

//   const applyFilter = () => {
//     setFilterWindowVisible(false);
//   };

//   const handleReset = () => {
//     setInput('');
//     setSelect('default');
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setSelectedTips([]);
//     setFilterWindowVisible(false);
//   };

//   const filtrReset = () => {
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setSelectedTips([]);
//     setFilterWindowVisible(false);
//   };

//   const handleShowAll = () => {
//     // Скидання фільтрів та відображення всіх книжок
//     handleReset();
//     setSortedBooks([...books]);
//   };

//   const handleTipSelection = (tip) => {
//     if (selectedTips.includes(tip)) {
//       setSelectedTips(selectedTips.filter(selectedTip => selectedTip !== tip));
//     } else {
//       setSelectedTips([...selectedTips, tip]);
//     }
//   };

//   const handleTagSelection1 = (tag1) => {
//     if (selectedTags1.includes(tag1)) {
//       setSelectedTags1(selectedTags1.filter(tag => tag !== tag1));
//     } else {
//       setSelectedTags1([...selectedTags1, tag1]);
//     }
//   };

//   const handleTagSelection2 = (tag2) => {
//     if (selectedTags2.includes(tag2)) {
//       setSelectedTags2(selectedTags2.filter(tag => tag !== tag2));
//     } else {
//       setSelectedTags2([...selectedTags2, tag2]);
//     }
//   };

//   useEffect(() => {
//     // Збереження вибраних тегів в локальне сховище
//     localStorage.setItem('selectedTags1', JSON.stringify(selectedTags1));
//     localStorage.setItem('selectedTags2', JSON.stringify(selectedTags2));
//     localStorage.setItem('selectedTips', JSON.stringify(selectedTips));
//   }, [selectedTags1, selectedTags2, selectedTips]);

//   const findBook = useCallback(() => {
//     let sortedBooksCopy = [...books];

//     sortedBooksCopy = sortedBooksCopy.filter(el =>
//       el.title.toLowerCase().includes(input.trim().toLowerCase())
//     );

//     if (selectedTags1.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTags1.includes(book.tags1)
//       );
//     }

//     if (selectedTags2.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTags2.includes(book.tags2)
//       );
//     }

//     if (selectedTips.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTips.includes(book.Tip)
//       );
//     }

//     if (select === 'lowPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => a.price - b.price));
//     } else if (select === 'highPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => b.price - a.price));
//     } else {
//       setSortedBooks(sortedBooksCopy);
//     }
//   }, [input, select, books, selectedTags1, selectedTags2, selectedTips]);

//   const findUniqueTags = () => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();

//     books.forEach(book => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//     });

//     const uniqueTags1Array = Array.from(uniqueTags1Set);
//     const uniqueTags2Array = Array.from(uniqueTags2Set);

//     setUniqueTags1(uniqueTags1Array);
//     setUniqueTags2(uniqueTags2Array);
//   };


// function getUniqueValues(arr, key) {
//   const uniqueValues = new Set();
//   arr.forEach(item => {
//     if (item[key]) {
//       uniqueValues.add(item[key]);
//     }
//   });
//   return Array.from(uniqueValues);
// }

//   const findUniqueTipValues = () => {
//     const uniqueTipValues = getUniqueValues(books, 'Tip');
//     setUniqueTipValues(uniqueTipValues);
//   };

//   useEffect(() => {
//     // Відновлення вибраних тегів з локального сховища при завантаженні компонента
//     const storedTags1 = JSON.parse(localStorage.getItem('selectedTags1'));
//     const storedTags2 = JSON.parse(localStorage.getItem('selectedTags2'));
//     const storedTips = JSON.parse(localStorage.getItem('selectedTips'));
    
//     if (storedTags1) {
//       setSelectedTags1(storedTags1);
//     }

//     if (storedTags2) {
//       setSelectedTags2(storedTags2);
//     }

//     if (storedTips) {
//       setSelectedTips(storedTips);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('bookListInput', input);
//     localStorage.setItem('bookListSelect', select);
//   }, [input, select]);

//   useEffect(() => {
//     findBook();
//     findUniqueTipValues();
//   }, [findBook]);

//   useEffect(() => {
//     findUniqueTags();
//   }, [books]);

//   return (
//     <>
//       <section className={theme}>
//         <section className="filters">
//           <button
//             className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
//             onClick={toggleTheme}
//           >
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>

//           <input
//             onChange={e => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />

//           <select
//             onChange={e => setSelect(e.target.value)}
//             id="sortPrice"
//             title="sortPrice"
//             autoComplete="off"
//             value={select}
//           >
//             <option value="default">default</option>
//             <option value="lowPrice">lowPrice</option>
//             <option value="highPrice">highPrice</option>
//           </select>

//           <button onClick={handleReset} className="reset-button">
//             ❌
//           </button>

//           <button onClick={() => setFilterWindowVisible(true)}>Фільтр</button>

//           <button onClick={handleShowAll}>Показати все</button>
//         </section>
//         <ScrollToTopButton />
//         <Shelf book={sortedBooks} />
//       </section>

//       {filterWindowVisible && (
//         <div className="filter-window">
//           <h3>Фільтр за тегами</h3>
//           <div>
//             <label>Тег1:</label>
//             {uniqueTags1.map(tag1 => (
//               <button
//                 key={tag1}
//                 onClick={() => handleTagSelection1(tag1)}
//                 style={{
//                   backgroundColor: selectedTags1.includes(tag1) ? 'green' : 'transparent',
//                 }}
//               >
//                 {tag1}
//               </button>
//             ))}
//           </div>
//           <div>
//             <label>Тег2:</label>
//             {uniqueTags2.map(tag2 => (
//               <button
//                 key={tag2}
//                 onClick={() => handleTagSelection2(tag2)}
//                 style={{
//                   backgroundColor: selectedTags2.includes(tag2) ? 'green' : 'transparent',
//                 }}
//               >
//                 {tag2}
//               </button>
//             ))}
//           </div>
//           <div>
//             <label>Tip:</label>
//             {uniqueTipValues.map(tip => (
//               <button
//                 key={tip}
//                 onClick={() => handleTipSelection(tip)}
//                 style={{
//                   backgroundColor: selectedTips.includes(tip) ? 'green' : 'transparent',
//                 }}
//               >
//                 {tip}
//               </button>
//             ))}
//           </div>
//           <button onClick={applyFilter}>ОК</button>
//           <button onClick={filtrReset}>Скасувати</button>
//         </div>
//       )}
//     </>
//   );
// }




// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from './ScrollToTopButton';

// export default function BookList() {
//   const { theme, setTheme, books } = useContext(BooksContext);

//   const toggleTheme = () => {
//     setTheme(theme => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const initialInput = localStorage.getItem('bookListInput') || '';
//   const initialSelect = localStorage.getItem('bookListSelect') || 'default';
//   const initialSelectedTags1 = JSON.parse(localStorage.getItem('selectedTags1')) || [];
//   const initialSelectedTags2 = JSON.parse(localStorage.getItem('selectedTags2')) || [];

//   const [input, setInput] = useState(initialInput);
//   const [select, setSelect] = useState(initialSelect);
//   const [sortedBooks, setSortedBooks] = useState([...books]);
//   const [selectedTags1, setSelectedTags1] = useState(initialSelectedTags1);
//   const [selectedTags2, setSelectedTags2] = useState(initialSelectedTags2);
//   const [uniqueTags1, setUniqueTags1] = useState([]);
//   const [uniqueTags2, setUniqueTags2] = useState([]);
//   const [filterWindowVisible, setFilterWindowVisible] = useState(false);

//   const applyFilter = () => {
//     setFilterWindowVisible(false);
//   };

//   const handleReset = () => {
//     setInput('');
//     setSelect('default');
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setFilterWindowVisible(false);
//   };

//   const filtrReset = () => {
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setFilterWindowVisible(false);
//   };

//   const handleTagSelection1 = (tag1) => {
//     if (selectedTags1.includes(tag1)) {
//       setSelectedTags1(selectedTags1.filter(tag => tag !== tag1));
//     } else {
//       setSelectedTags1([...selectedTags1, tag1]);
//     }
//   };

//   const handleTagSelection2 = (tag2) => {
//     if (selectedTags2.includes(tag2)) {
//       setSelectedTags2(selectedTags2.filter(tag => tag !== tag2));
//     } else {
//       setSelectedTags2([...selectedTags2, tag2]);
//     }
//   };

//   useEffect(() => {
//     // Збереження вибраних тегів в локальне сховище
//     localStorage.setItem('selectedTags1', JSON.stringify(selectedTags1));
//     localStorage.setItem('selectedTags2', JSON.stringify(selectedTags2));
//   }, [selectedTags1, selectedTags2]);

//   const findBook = useCallback(() => {
//     let sortedBooksCopy = [...books];

//     sortedBooksCopy = sortedBooksCopy.filter(el =>
//       el.title.toLowerCase().includes(input.trim().toLowerCase())
//     );

//     if (selectedTags1.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTags1.includes(book.tags1)
//       );
//     }

//     if (selectedTags2.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTags2.includes(book.tags2)
//       );
//     }

//     if (select === 'lowPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => a.price - b.price));
//     } else if (select === 'highPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => b.price - a.price));
//     } else {
//       setSortedBooks(sortedBooksCopy);
//     }
//   }, [input, select, books, selectedTags1, selectedTags2]);

//   const findUniqueTags = () => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();

//     books.forEach(book => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//     });

//     const uniqueTags1Array = Array.from(uniqueTags1Set);
//     const uniqueTags2Array = Array.from(uniqueTags2Set);

//     setUniqueTags1(uniqueTags1Array);
//     setUniqueTags2(uniqueTags2Array);
//   };

//   useEffect(() => {
//     // Відновлення вибраних тегів з локального сховища при завантаженні компонента
//     const storedTags1 = JSON.parse(localStorage.getItem('selectedTags1'));
//     const storedTags2 = JSON.parse(localStorage.getItem('selectedTags2'));
    
//     if (storedTags1) {
//       setSelectedTags1(storedTags1);
//     }

//     if (storedTags2) {
//       setSelectedTags2(storedTags2);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('bookListInput', input);
//     localStorage.setItem('bookListSelect', select);
//   }, [input, select]);

//   useEffect(() => {
//     findBook();
//   }, [findBook]);

//   useEffect(() => {
//     findUniqueTags();
//   }, [books]);

//   return (
//     <>
//       <section className={theme}>
//         <section className="filters">
//           <button
//             className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
//             onClick={toggleTheme}
//           >
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>

//           <input
//             onChange={e => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />

//           <select
//             onChange={e => setSelect(e.target.value)}
//             id="sortPrice"
//             title="sortPrice"
//             autoComplete="off"
//             value={select}
//           >
//             <option value="default">default</option>
//             <option value="lowPrice">lowPrice</option>
//             <option value="highPrice">highPrice</option>
//           </select>

//           <button onClick={handleReset} className="reset-button">
//             ❌
//           </button>

//           <button onClick={() => setFilterWindowVisible(true)}>Фільтр</button>
//         </section>
//         <ScrollToTopButton />
//         <Shelf book={sortedBooks} />
//       </section>

//       {filterWindowVisible && (
//         <div className="filter-window">
//           <h3>Фільтр за тегами</h3>
//           <div>
//             <label>Тег1:</label>
//             {uniqueTags1.map(tag1 => (
//               <label key={tag1}>
//                 <input
//                   type="checkbox"
//                   value={tag1}
//                   checked={selectedTags1.includes(tag1)}
//                   onChange={() => handleTagSelection1(tag1)}
//                 />
//                 {tag1}
//               </label>
//             ))}
//           </div>
//           <div>
//             <label>Тег2:</label>
//             {uniqueTags2.map(tag2 => (
//               <label key={tag2}>
//                 <input
//                   type="checkbox"
//                   value={tag2}
//                   checked={selectedTags2.includes(tag2)}
//                   onChange={() => handleTagSelection2(tag2)}
//                 />
//                 {tag2}
//               </label>
//             ))}
//           </div>
//           <button onClick={applyFilter}>ОК</button>
//           <button onClick={filtrReset}>Скасувати</button>
//         </div>
//       )}
//     </>
//   );
// }


// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from './ScrollToTopButton';

// export default function BookList() {
//   const { theme, setTheme, books } = useContext(BooksContext);

//   const toggleTheme = () => {
//     setTheme(theme => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const initialInput = localStorage.getItem('bookListInput') || '';
//   const initialSelect = localStorage.getItem('bookListSelect') || 'default';

//   const [input, setInput] = useState(initialInput);
//   const [select, setSelect] = useState(initialSelect);
//   const [sortedBooks, setSortedBooks] = useState([...books]);
//   const [selectedTags1, setSelectedTags1] = useState([]);
//   const [selectedTags2, setSelectedTags2] = useState([]);
//   const [uniqueTags1, setUniqueTags1] = useState([]);
//   const [uniqueTags2, setUniqueTags2] = useState([]);
//   const [filterWindowVisible, setFilterWindowVisible] = useState(false);

//   const applyFilter = () => {
//     setFilterWindowVisible(false);
//   };

//   const handleReset = () => {
//     setInput('');
//     setSelect('default');
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setFilterWindowVisible(false);
//     findBook();
//   };

//   const filtrReset = () => {
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setFilterWindowVisible(false);
//   };

//   const handleTagSelection1 = (tag1) => {
//     if (selectedTags1.includes(tag1)) {
//       setSelectedTags1(selectedTags1.filter(tag => tag !== tag1));
//     } else {
//       setSelectedTags1([...selectedTags1, tag1]);
//     }
//   };

//   const handleTagSelection2 = (tag2) => {
//     if (selectedTags2.includes(tag2)) {
//       setSelectedTags2(selectedTags2.filter(tag => tag !== tag2));
//     } else {
//       setSelectedTags2([...selectedTags2, tag2]);
//     }
//   };

//   useEffect(() => {
//     // Збереження вибраних тегів в локальне сховище
//     localStorage.setItem('selectedTags1', JSON.stringify(selectedTags1));
//     localStorage.setItem('selectedTags2', JSON.stringify(selectedTags2));
//   }, [selectedTags1, selectedTags2]);

//   const findBook = useCallback(() => {
//     let sortedBooksCopy = [...books];

//     sortedBooksCopy = sortedBooksCopy.filter(el =>
//       el.title.toLowerCase().includes(input.trim().toLowerCase())
//     );

//     if (selectedTags1.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTags1.includes(book.tags1)
//       );
//     }

//     if (selectedTags2.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTags2.includes(book.tags2)
//       );
//     }

//     if (select === 'lowPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => a.price - b.price));
//     } else if (select === 'highPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => b.price - a.price));
//     } else {
//       setSortedBooks(sortedBooksCopy);
//     }
//   }, [input, select, books, selectedTags1, selectedTags2]);

//   const findUniqueTags = () => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();

//     books.forEach(book => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//     });

//     const uniqueTags1Array = Array.from(uniqueTags1Set);
//     const uniqueTags2Array = Array.from(uniqueTags2Set);

//     setUniqueTags1(uniqueTags1Array);
//     setUniqueTags2(uniqueTags2Array);
//   };

//   useEffect(() => {
//     // Відновлення вибраних тегів з локального сховища при завантаженні компонента
//     const storedTags1 = JSON.parse(localStorage.getItem('selectedTags1'));
//     const storedTags2 = JSON.parse(localStorage.getItem('selectedTags2'));
    
//     if (storedTags1) {
//       setSelectedTags1(storedTags1);
//     }

//     if (storedTags2) {
//       setSelectedTags2(storedTags2);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('bookListInput', input);
//     localStorage.setItem('bookListSelect', select);
//   }, [input, select]);

//   useEffect(() => {
//     findBook();
//   }, [findBook]);

//   useEffect(() => {
//     findUniqueTags();
//   }, [books]);

//   return (
//     <>
//       <section className={theme}>
//         <section className="filters">
//           <button
//             className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
//             onClick={toggleTheme}
//           >
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>

//           <input
//             onChange={e => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />

//           <select
//             onChange={e => setSelect(e.target.value)}
//             id="sortPrice"
//             title="sortPrice"
//             autoComplete="off"
//             value={select}
//           >
//             <option value="default">default</option>
//             <option value="lowPrice">lowPrice</option>
//             <option value="highPrice">highPrice</option>
//           </select>

//           <button onClick={handleReset} className="reset-button">
//             ❌
//           </button>

//           <button onClick={() => setFilterWindowVisible(true)}>Фільтр</button>
//         </section>
//         <ScrollToTopButton />
//         <Shelf book={sortedBooks} />
//       </section>

//       {filterWindowVisible && (
//         <div className="filter-window">
//           <h3>Фільтр за тегами</h3>
//           <div>
//             <label>Тег1:</label>
//             {uniqueTags1.map(tag1 => (
//               <label key={tag1}>
//                 <input
//                   type="checkbox"
//                   value={tag1}
//                   checked={selectedTags1.includes(tag1)}
//                   onChange={() => handleTagSelection1(tag1)}
//                 />
//                 {tag1}
//               </label>
//             ))}
//           </div>
//           <div>
//             <label>Тег2:</label>
//             {uniqueTags2.map(tag2 => (
//               <label key={tag2}>
//                 <input
//                   type="checkbox"
//                   value={tag2}
//                   checked={selectedTags2.includes(tag2)}
//                   onChange={() => handleTagSelection2(tag2)}
//                 />
//                 {tag2}
//               </label>
//             ))}
//           </div>
//           <button onClick={applyFilter}>ОК</button>
//           <button onClick={filtrReset}>Скасувати</button>
//         </div>
//       )}
//     </>
//   );
// }



// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from './ScrollToTopButton';

// export default function BookList() {
//   const { theme, setTheme, books } = useContext(BooksContext);

//   const toggleTheme = () => {
//     setTheme(theme => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const initialInput = localStorage.getItem('bookListInput') || '';
//   const initialSelect = localStorage.getItem('bookListSelect') || 'default';

//   const [input, setInput] = useState(initialInput);
//   const [select, setSelect] = useState(initialSelect);
//   const [sortedBooks, setSortedBooks] = useState([...books]);
//   const [selectedTags1, setSelectedTags1] = useState([]);
//   const [selectedTags2, setSelectedTags2] = useState([]);
//   const [uniqueTags1, setUniqueTags1] = useState([]);
//   const [uniqueTags2, setUniqueTags2] = useState([]);
//   const [filterWindowVisible, setFilterWindowVisible] = useState(false);

//   // const toggleTag1 = tag1 => {
//   //   if (selectedTags1.includes(tag1)) {
//   //     setSelectedTags1(selectedTags1.filter(tag => tag !== tag1));
//   //   } else {
//   //     setSelectedTags1([...selectedTags1, tag1]);
//   //   }
//   // };

//   // const toggleTag2 = tag2 => {
//   //   if (selectedTags2.includes(tag2)) {
//   //     setSelectedTags2(selectedTags2.filter(tag => tag !== tag2));
//   //   } else {
//   //     setSelectedTags2([...selectedTags2, tag2]);
//   //   }
//   // };

//   const applyFilter = () => {
//     setFilterWindowVisible(false);
//   };

//   const handleReset = () => {
//     setInput('');
//     setSelect('default');
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//   };

//   const filtrReset = () => {
    
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setFilterWindowVisible(false)
//   };


//   const handleTagSelection1 = (tag1) => {
//     if (selectedTags1.includes(tag1)) {
//       setSelectedTags1(selectedTags1.filter(tag => tag !== tag1));
//     } else {
//       setSelectedTags1([...selectedTags1, tag1]);
//     }
//   };

//   const handleTagSelection2 = (tag2) => {
//     if (selectedTags2.includes(tag2)) {
//       setSelectedTags2(selectedTags2.filter(tag => tag !== tag2));
//     } else {
//       setSelectedTags2([...selectedTags2, tag2]);
//     }
//   };

//   const findBook = useCallback(() => {
//     let sortedBooksCopy = [...books];

//     sortedBooksCopy = sortedBooksCopy.filter(el =>
//       el.title.toLowerCase().includes(input.trim().toLowerCase())
//     );

//     if (selectedTags1.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTags1.includes(book.tags1)
//       );
//     }

//     if (selectedTags2.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTags2.includes(book.tags2)
//       );
//     }

//     if (select === 'lowPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => a.price - b.price));
//     } else if (select === 'highPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => b.price - a.price));
//     } else {
//       setSortedBooks(sortedBooksCopy);
//     }
//   }, [input, select, books, selectedTags1, selectedTags2]);

//   const findUniqueTags = () => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();

//     books.forEach(book => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//     });

//     const uniqueTags1Array = Array.from(uniqueTags1Set);
//     const uniqueTags2Array = Array.from(uniqueTags2Set);

//     setUniqueTags1(uniqueTags1Array);
//     setUniqueTags2(uniqueTags2Array);
//   };

//   useEffect(() => {
//     localStorage.setItem('bookListInput', input);
//     localStorage.setItem('bookListSelect', select);
//   }, [input, select]);

//   useEffect(() => {
//     findBook();
//   }, [findBook]);

//   useEffect(() => {
//     findUniqueTags();
//   }, [books]);

//   return (
//     <>
//       <section className={theme}>
//         <section className="filters">
//           <button
//             className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
//             onClick={toggleTheme}
//           >
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>

//           <input
//             onChange={e => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />

//           <select
//             onChange={e => setSelect(e.target.value)}
//             id="sortPrice"
//             title="sortPrice"
//             autoComplete="off"
//             value={select}
//           >
//             <option value="default">default</option>
//             <option value="lowPrice">lowPrice</option>
//             <option value="highPrice">highPrice</option>
//           </select>

//           <button onClick={handleReset} className="reset-button">
//             ❌
//           </button>

//           <button onClick={() => setFilterWindowVisible(true)}>Фільтр</button>

//           {/* <select
//             id="filterTags1"
//             title="Filter by tags1"
//             multiple
//             value={selectedTags1}
//             onChange={() => {}}
//           >
//             {uniqueTags1.map(tag1 => (
//               <option
//                 key={tag1}
//                 value={tag1}
//                 onClick={() => handleTagSelection1(tag1)}
//               >
//                 {tag1}
//               </option>
//             ))}
//           </select>

//           <select
//             id="filterTags2"
//             title="Filter by tags2"
//             multiple
//             value={selectedTags2}
//             onChange={() => {}}
//           >
//             {uniqueTags2.map(tag2 => (
//               <option
//                 key={tag2}
//                 value={tag2}
//                 onClick={() => handleTagSelection2(tag2)}
//               >
//                 {tag2}
//               </option>
//             ))}
//           </select> */}
//         </section>
//         <ScrollToTopButton />
//         <Shelf book={sortedBooks} />
//       </section>

//       {filterWindowVisible && (
//         <div className="filter-window">
//           <h3>Фільтр за тегами</h3>
//           <div>
//             <label>Тег1:</label>
//             {uniqueTags1.map(tag1 => (
//               <label key={tag1}>
//                 <input
//                   type="checkbox"
//                   value={tag1}
//                   checked={selectedTags1.includes(tag1)}
//                   onChange={() => handleTagSelection1(tag1)}
//                 />
//                 {tag1}
//               </label>
//             ))}
//           </div>
//           <div>
//             <label>Тег2:</label>
//             {uniqueTags2.map(tag2 => (
//               <label key={tag2}>
//                 <input
//                   type="checkbox"
//                   value={tag2}
//                   checked={selectedTags2.includes(tag2)}
//                   onChange={() => handleTagSelection2(tag2)}
//                 />
//                 {tag2}
//               </label>
//             ))}
//           </div>
//           <button onClick={applyFilter}>ОК</button>
//           <button onClick={filtrReset}>Скасувати</button>
//         </div>
//       )}
//     </>
//   );
// }



// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from './ScrollToTopButton';

// export default function BookList() {
//   const { theme, setTheme, books } = useContext(BooksContext);

//   const toggleTheme = () => {
//     setTheme(theme => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const initialInput = localStorage.getItem('bookListInput') || '';
//   const initialSelect = localStorage.getItem('bookListSelect') || 'default';

//   const [input, setInput] = useState(initialInput);
//   const [select, setSelect] = useState(initialSelect);
//   const [sortedBooks, setSortedBooks] = useState([...books]);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [uniqueTags, setUniqueTags] = useState([]);
//   const [filterWindowVisible, setFilterWindowVisible] = useState(false);
//   const [selectedTags2, setSelectedTags2] = useState([]);

//   const toggleTag2 = tag2 => {
//     if (selectedTags2.includes(tag2)) {
//       setSelectedTags2(selectedTags2.filter(tag => tag !== tag2));
//     } else {
//       setSelectedTags2([...selectedTags2, tag2]);
//     }
//   };

//   const applyFilter = () => {
//     setSelectedTags(selectedTags2);
//     setFilterWindowVisible(false);
//   };

//   const handleReset = () => {
//     setInput('');
//     setSelect('default');
//     setSelectedTags([]);
//   };

//   const handleTagSelection = (event, tag) => {
//     const isChecked = event.target.checked;

//     if (isChecked) {
//       setSelectedTags([...selectedTags, tag]);
//     } else {
//       setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag));
//     }
//   };

//   const findBook = useCallback(() => {
//     let sortedBooksCopy = [...books];

//     sortedBooksCopy = sortedBooksCopy.filter(el =>
//       el.title.toLowerCase().includes(input.trim().toLowerCase())
//     );

//     if (selectedTags.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTags.includes(book.tags1) || selectedTags.includes(book.tags2)
//       );
//     }

//     if (select === 'lowPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => a.price - b.price));
//     } else if (select === 'highPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => b.price - a.price));
//     } else {
//       setSortedBooks(sortedBooksCopy);
//     }
//   }, [input, select, books, selectedTags]);

//   const findUniqueTags = () => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();

//     books.forEach(book => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//     });

//     const uniqueTags1Array = Array.from(uniqueTags1Set);
//     const uniqueTags2Array = Array.from(uniqueTags2Set);

//     const uniqueTags1WithStatus = uniqueTags1Array.map(tag1 => ({
//       label: tag1,
//       selected: selectedTags.includes(tag1),
//     }));

//     const uniqueTags2WithStatus = uniqueTags2Array.map(tag2 => ({
//       label: tag2,
//       selected: selectedTags.includes(tag2),
//     }));

//     const allUniqueTags = [...uniqueTags1WithStatus, ...uniqueTags2WithStatus];

//     setUniqueTags(allUniqueTags);
//   };

//   useEffect(() => {
//     localStorage.setItem('bookListInput', input);
//     localStorage.setItem('bookListSelect', select);
//   }, [input, select]);

//   useEffect(() => {
//     findBook();
//   }, [findBook]);

//   useEffect(() => {
//     findUniqueTags();
//   }, [selectedTags, books]);

//   return (
//     <>
//       <section className={theme}>
//         <section className="filters">
//           <button
//             className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
//             onClick={toggleTheme}
//           >
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>

//           <input
//             onChange={e => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />

//           <select
//             onChange={e => setSelect(e.target.value)}
//             id="sortPrice"
//             title="sortPrice"
//             autoComplete="off"
//             value={select}
//           >
//             <option value="default">default</option>
//             <option value="lowPrice">lowPrice</option>
//             <option value="highPrice">highPrice</option>
//           </select>

//           <button onClick={handleReset} className="reset-button">
//             ❌
//           </button>

//           <button onClick={() => setFilterWindowVisible(true)}>Фільтр</button>

//           <select
//             id="filterTags"
//             title="Filter by tags"
//             multiple
//             value={selectedTags}
//             onChange={() => {}}
//           >
//             {uniqueTags.map(tag => (
//               <option
//                 key={tag.label}
//                 value={tag.label}
//                 onClick={event => handleTagSelection(event, tag.label)}
//               >
//                 {tag.label}
//               </option>
//             ))}
//           </select>
//         </section>
//         <ScrollToTopButton />
//         <Shelf book={sortedBooks} />
//       </section>

//       {filterWindowVisible && (
//         <div className="filter-window">
//           <h3>Фільтр за тегами</h3>
//           <div>
//             <label>Тег1:</label>
//             <select
//               value={selectedTags}
//               onChange={e => setSelectedTags(e.target.value)}
//             >
//               <option value="">Будь-який тег1</option>
//               {uniqueTags.map(tag => (
//                 <option key={tag.label} value={tag.label}>
//                   {tag.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label>Тег2:</label>
//             {uniqueTags.map(tag => (
//               <label key={tag.label}>
//                 <input
//                   type="checkbox"
//                   value={tag.label}
//                   checked={selectedTags2.includes(tag.label)}
//                   onChange={() => toggleTag2(tag.label)}
//                 />
//                 {tag.label}
//               </label>
//             ))}
//           </div>
//           <button onClick={applyFilter}>ОК</button>
//         </div>
//       )}
//     </>
//   );
// }



// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import ScrollToTopButton from './ScrollToTopButton';

// export default function BookList() {
//   const { theme, setTheme, books } = useContext(BooksContext);

//   const toggleTheme = () => {
//     setTheme(theme => (theme === 'light' ? 'dark' : 'light'));
//   };

//   const initialInput = localStorage.getItem('bookListInput') || '';
//   const initialSelect = localStorage.getItem('bookListSelect') || 'default';

//   const [input, setInput] = useState(initialInput);
//   const [select, setSelect] = useState(initialSelect);
//   const [sortedBooks, setSortedBooks] = useState([...books]);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [uniqueTags, setUniqueTags] = useState([]);

//   useEffect(() => {
//     localStorage.setItem('bookListInput', input);
//     localStorage.setItem('bookListSelect', select);
//   }, [input, select]);

//   const findBook = useCallback(() => {
//     let sortedBooksCopy = [...books];

//     sortedBooksCopy = sortedBooksCopy.filter(el =>
//       el.title.toLowerCase().includes(input.trim().toLowerCase())
//     );

//     if (selectedTags.length > 0) {
//       sortedBooksCopy = sortedBooksCopy.filter(book =>
//         selectedTags.includes(book.tags1) || selectedTags.includes(book.tags2)
//       );
//     }

//     if (select === 'lowPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => a.price - b.price));
//     } else if (select === 'highPrice') {
//       setSortedBooks(sortedBooksCopy.sort((a, b) => b.price - a.price));
//     } else {
//       setSortedBooks(sortedBooksCopy);
//     }
//   }, [input, select, books, selectedTags]);

//   useEffect(() => {
//     findBook();
//   }, [findBook]);

//   const handleReset = () => {
//     setInput('');
//     setSelect('default');
//     setSelectedTags([]);
//   };

//   const handleTagSelection = (event, tag) => {
//     const isChecked = event.target.checked;

//     if (isChecked) {
//       setSelectedTags([...selectedTags, tag]);
//     } else {
//       setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag));
//     }
//   };

//   // Define and set uniqueTags
//   const findUniqueTags = () => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();

//     books.forEach(book => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//     });

//     const uniqueTags1Array = Array.from(uniqueTags1Set);
//     const uniqueTags2Array = Array.from(uniqueTags2Set);

//     const uniqueTags1WithStatus = uniqueTags1Array.map(tag1 => ({
//       label: tag1,
//       selected: selectedTags.includes(tag1),
//     }));

//     const uniqueTags2WithStatus = uniqueTags2Array.map(tag2 => ({
//       label: tag2,
//       selected: selectedTags.includes(tag2),
//     }));

//     const allUniqueTags = [...uniqueTags1WithStatus, ...uniqueTags2WithStatus];

//     setUniqueTags(allUniqueTags);
//   };

//   useEffect(() => {
//     findUniqueTags();
//   }, [selectedTags, books]);

//   return (
//     <>
//       <section className={theme}>
//         <section className="filters">
//           <button
//             className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
//             onClick={toggleTheme}
//           >
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>

//           <input
//             onChange={e => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />

//           <select
//             onChange={e => setSelect(e.target.value)}
//             id="sortPrice"
//             title="sortPrice"
//             autoComplete="off"
//             value={select}
//           >
//             <option value="default">default</option>
//             <option value="lowPrice">lowPrice</option>
//             <option value="highPrice">highPrice</option>
//           </select>

//           <button onClick={handleReset} className="reset-button">
//             ❌
//           </button>

//           <select
//             id="filterTags"
//             title="Filter by tags"
//             multiple
//             value={selectedTags}
//             onChange={() => {}}
//           >
//             {uniqueTags.map(tag => (
//               <option
//                 key={tag.label}
//                 value={tag.label}
//                 onClick={event => handleTagSelection(event, tag.label)}
//               >
//                 {tag.label}
//               </option>
//             ))}
//           </select>
//         </section>
//         <ScrollToTopButton />
//         <Shelf book={sortedBooks} />
//       </section>
//     </>
//   );
// }


// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import  ScrollToTopButton  from './ScrollToTopButton';

// export default function BookList() {
 
//   const {  theme, setTheme, books } = useContext(BooksContext);
 
  

//   // Змінюємо тему
//   const toggleTheme = () => {
//     setTheme(theme => (theme === 'light' ? 'dark' : 'light'));
//   };

//   // Зчитуємо значення з `localStorage`, якщо вони там є
//   const initialInput = localStorage.getItem('bookListInput') || '';
//   const initialSelect = localStorage.getItem('bookListSelect') || 'default';

//   // Використовуємо хук `useState` для збереження стану введення та сортування
//   const [input, setInput] = useState(initialInput);
//   const [select, setSelect] = useState(initialSelect);
//   const [sortedBooks, setSortedBooks] = useState([...books]);
//  // Зберігаємо значення в `localStorage` при зміні
//   useEffect(() => {
//    localStorage.setItem('bookListInput', input);
//    localStorage.setItem('bookListSelect', select);
//   }, [input, select]);

//   const findBook=useCallback(() => {
//   let sortedBooksCopy = [...books];
//     // Фільтруємо книжки за введеним рядком пошуку
//     sortedBooksCopy = sortedBooksCopy.filter(el =>
//       el.title.toLowerCase().includes(input.trim().toLowerCase())
//     );

// // Сортуємо книжки залежно від обраного значення сортування
// if (select === 'lowPrice') {
//   setSortedBooks(
//     sortedBooksCopy.sort((a, b) => a.price - b.price)
//   );
// } else if (select === 'highPrice') {
//   setSortedBooks(
//     sortedBooksCopy.sort((a, b) => b.price - a.price)
//   );
// } else {
//   setSortedBooks(sortedBooksCopy); // Залишаємо сортування за замовчуванням
// }
// }, [input, select, books]);
//   useEffect(() => {
//     findBook();
//   }, [findBook]);

//   // Функція для скидання значень інпута та селекта в дефолт
//   const handleReset = () => {
//     setInput('');
//     setSelect('default');
//   };


//   return (
//     <>
//       <section className={theme}>
//         {/* <section className="header">
//          <Header />
//         </section> */}
//         <section className="filters">
//           {/* Відображаємо кнопку для зміни теми */}
//           <button className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`} 
//             onClick={toggleTheme}>
//             {theme === 'light' ? '🔅' : '🔆'}
//           </button>
//           {/* Пошук за ім'ям */}
//           <input
//             onChange={e => setInput(e.target.value)}
//             type="search"
//             id="searchName"
//             title="Search by book name"
//             placeholder="🔎Search by book name"
//             value={input}
//           />
//           {/* Вибір сортування за ціною */}
//           <select onChange={e => setSelect(e.target.value)} 
//           id="sortPrice" title="sortPrice" 
//           autoComplete="off"
//           value={select}
//           >
//             <option value="default">default</option>
//             <option value="lowPrice">lowPrice</option>
//             {/* <option value="midPrice">from 15 to 30</option> */}
//             <option value="highPrice">highPrice</option>
//           </select>
//           {/* Кнопка для скидання значень інпута та селекта в дефолт */}
//           <button onClick={handleReset} className="reset-button">
//           ❌
//           </button>
//         </section>
//         <ScrollToTopButton />
//         {/* Передаємо відсортований масив книжок у компонент `Shelf` */}
//         <Shelf book={sortedBooks} />
//         {/* <Footer /> */}
//       </section>
//     </>
//   );
// }