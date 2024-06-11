import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './bookList.css';
import { BooksContext } from '../../BooksContext';
import cancel from '../cart/img/cancel.png';
import filter from '../cart/img/filter.png';
import filterremove from '../cart/img/filterremove.png';
import upmenu from '../cart/img/upmenu.png';
import burger from '../cart/img/burger.png';
import search from '../cart/img/search.png';
import SortCart from './SortCart';

// Utility function to apply filters
const applyFilters = (books, filters) => {
  let filteredBooks = books.filter((book) => book.Visibility !== '0');

  if (filters.select === 'section' && filters.selectedSection && filters.selectedSection !== 'Show all') {
    filteredBooks = filteredBooks.filter((book) => book.section === filters.selectedSection);
    if (filters.selectedSubsection) {
      filteredBooks = filteredBooks.filter((book) => book.partition === filters.selectedSubsection);
    }
  }

  if (filters.input) {
    filteredBooks = filteredBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(filters.input.toLowerCase()) ||
        book.id.toString().toLowerCase().includes(filters.input.toLowerCase()) ||
        book.author.toString().toLowerCase().includes(filters.input.toLowerCase())
    );
  }

  if (filters.selectedTags1.length > 0) {
    filteredBooks = filteredBooks.filter((book) => filters.selectedTags1.includes(book.tags1));
  }

  if (filters.selectedTags2.length > 0) {
    filteredBooks = filteredBooks.filter((book) => filters.selectedTags2.includes(book.tags2));
  }

  if (filters.selectedTags3.length > 0) {
    filteredBooks = filteredBooks.filter((book) => filters.selectedTags3.includes(book.tags3));
  }

  if (filters.selectedTags4.length > 0) {
    filteredBooks = filteredBooks.filter((book) => filters.selectedTags4.includes(book.tags4));
  }

  if (filters.selectedSizes.length >0) {
    filteredBooks = filteredBooks.filter((book) => filters.selectedSizes.includes(book.size));
  }

  if (filters.selectedColor.length >0) {
    filteredBooks = filteredBooks.filter((book) => filters.selectedColor.includes(book.color));
  }
  return filteredBooks;
};

export default function Filter() {
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
    selectedTags3,
    setSelectedTags3,
    selectedTags4, 
    setSelectedTags4,
    selectedSizes,
    setSelectedSizes,
    selectedColor,
    setSelectedColor,
    fieldState
  } = useContext(BooksContext);

  const [select, setSelect] = useState('section');
  const [sortedBooks, setSortedBooks] = useState([...books.filter((book) => book.Visibility !== '0')]);
  const [uniqueTags1, setUniqueTags1] = useState([]);
  const [uniqueTags2, setUniqueTags2] = useState([]);
  const [uniqueTags3, setUniqueTags3] = useState([]); 
  const [uniqueTags4, setUniqueTags4] = useState([]); 
  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [uniqueColor, setUniqueColor] = useState([]);
  const [uniqueAuthors, setUniqueAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [showSections, setShowSections] = useState(false);
  const navigate = useNavigate();

 
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

  const findBook = useCallback(() => {
  
    const filters = {
      selectedSection,
      selectedSubsection,
      selectedTags1,
      selectedTags2,
      selectedTags3,
      selectedTags4,
      selectedSizes,
      selectedColor,
      select,
      input,
    };

    let filteredBooks = applyFilters(books, filters);

    setSortedBooks(filteredBooks);
  }, [select, books, input, selectedSizes, selectedTags1, selectedTags2, selectedTags3, selectedTags4, selectedColor, selectedSection, selectedSubsection]);

  const findUniqueValues = useCallback(() => {
    const uniqueTags1Set = new Set();
    const uniqueTags2Set = new Set();
    const uniqueTags3Set = new Set();
    const uniqueTags4Set = new Set();
    const uniqueSizesSet = new Set();
    const uniqueColorSet = new Set();
    const uniqueAuthorsSet = new Set();

    const filters = {
      selectedSection,
      selectedSubsection,
      selectedTags1,
      selectedTags2,
      selectedTags3,
      selectedTags4,
      selectedSizes,
      selectedColor,
      select,
      input,
    };

    let filteredBooks = applyFilters(books, filters);

    filteredBooks.forEach(book => {
      uniqueTags1Set.add(book.tags1);
      uniqueTags2Set.add(book.tags2);
      uniqueTags3Set.add(book.tags3);
      uniqueTags4Set.add(book.tags4);
      uniqueSizesSet.add(book.size);
      uniqueColorSet.add(book.color);
      uniqueAuthorsSet.add(book.author);
    });

    setUniqueTags1(Array.from(uniqueTags1Set).filter(tag => (typeof tag === 'string' || typeof tag === 'number') && tag.toString().trim() !== ''));
    setUniqueTags2(Array.from(uniqueTags2Set).filter(tag => (typeof tag === 'string' || typeof tag === 'number') && tag.toString().trim() !== ''));
    setUniqueTags3(Array.from(uniqueTags3Set).filter(tag => (typeof tag === 'string' || typeof tag === 'number') && tag.toString().trim() !== ''));
    setUniqueTags4(Array.from(uniqueTags4Set).filter(tag => (typeof tag === 'string' || typeof tag === 'number') && tag.toString().trim() !== ''));
    setUniqueSizes(Array.from(uniqueSizesSet).filter(size => (typeof size === 'string' || typeof size === 'number') && size.toString().trim() !== ''));
    setUniqueColor(Array.from(uniqueColorSet).filter(color => (typeof color === 'string' || typeof color === 'number') && color.toString().trim() !== ''));
    setUniqueAuthors(Array.from(uniqueAuthorsSet).filter(author => (typeof author === 'string' || typeof author === 'number') && author.toString().trim() !== ''));
  }, [select, input, books, selectedSection, selectedSubsection, selectedTags1, selectedTags2, selectedTags3, selectedTags4, selectedSizes, selectedColor]);

  const resetFilters = () => {
    setInput('');   
    setSelect('allSections');
    setSelectedTags1([]);
    setSelectedTags2([]);
    setSelectedTags3([]); 
    setSelectedTags4([]); 
    setSelectedSizes([]);
    setSelectedColor([]);
    setSelectedAuthors([]);
    setSortedBooks(books.filter((book) => book.Visibility !== '0'));
  };

  useEffect(() => {
    findBook();
    findUniqueValues();
  // }, [findBook, findUniqueValues, select]);
  }, [findBook, findUniqueValues]);

  useEffect(() => {
    if (books.length === 0) {
      navigate('/');
    }
  }, [books, navigate]);

  if (books.length === 0) {
    return null;
  }

  const handleStateChange = (key, value) => {
    if (key === 'select') {
      setSelect(value);
    } else if (key === 'input') {
      setInput(value);
    }
  };

  return (
    <>
      {/* <section className={theme} key={`${select}`}>  */}
      <section className={theme}>
        <section className="filters">

          <Link to="/BookList">
            <button className={`sort-button ${select === 'section' && selectedSection && selectedSection !== 'Show all' && 'selected'}`}>
              <img className={`back-button ${select === 'section' && selectedSection && selectedSection !== 'Show all' && 'selected'}`} src={burger} alt="category" />
            </button>
          </Link>
          <button className='sort-button selected' >
            {!showSections && (
              <img className="back-button selected" src={filter} onClick={toggleSections} alt='filter' />
            )}
            {showSections && (
              <img className="back-button selected" src={cancel} onClick={toggleSections} alt='close filter' />
            )}
          </button>
          <Link to="/Search" >
            <button className='sort-button'>
              <img className="back-button" src={search} alt="search" />
            </button>
          </Link>
        </section>
        {/* <section className="filters"> */}
        <section className="filters" key={`${select}`}>
          <div className="selected-tags">           
            <span>
            Found: <strong>{sortedBooks.length}</strong>
            </span>
            {select === 'section' && selectedSection && selectedSection !== 'Show all' ? (              
              <button className="selected-button" onClick={() => handleStateChange('select', 'allSections')}> 
                {selectedSection}
                {selectedSubsection && `> ${selectedSubsection}`}
                <span>❌</span>
              </button>
            ) : (             
              <button className="selected-button" onClick={() => handleStateChange('select', 'allSections')}>
                All Sections
                <span>❌</span>
              </button>
            )}

            {input && (              
              <button className="selected-button" onClick={() => handleStateChange('input', '')}>
                Filter by: {input}
                <span>❌</span>
              </button>
            )}
            {selectedSizes.map((size) => (
              <button className="selected-button" key={size} onClick={() => handleSelection(selectedSizes, size, setSelectedSizes)}>
                {fieldState.size && fieldState.size !== "" ? fieldState.size : "Size:"} {size}
                <span>❌</span>
              </button>
            ))}
            {selectedColor.map((color) => (
              <button className="selected-button" key={color} onClick={() => handleSelection(selectedColor, color, setSelectedColor)}>
                {fieldState.color && fieldState.color !== "" ? fieldState.color : "Color:"} {color}
                <span>❌</span>
              </button>
            ))}
            {selectedAuthors.map((author) => (
              <button className="selected-button" key={author} onClick={() => handleSelection(selectedAuthors, author, setSelectedAuthors)}>
                {fieldState.author && fieldState.author !== "" ? fieldState.author : "Author:"} {author}
                <span>❌</span>
              </button>
            ))}
            {selectedTags1.map((tag) => (
              <button className="selected-button" key={tag} onClick={() => handleSelection(selectedTags1, tag, setSelectedTags1)}>
                {fieldState.tags1 && fieldState.tags1 !== "" ? fieldState.tags1 : "Tags 1:"} {tag}
                <span>❌</span>
              </button>
            ))}
            {selectedTags2.map((tag) => (
              <button className="selected-button" key={tag} onClick={() => handleSelection(selectedTags2, tag, setSelectedTags2)}>
                {fieldState.tags2 && fieldState.tags2 !== "" ? fieldState.tags2 : "Tags 2:"} {tag}
                <span>❌</span>
              </button>
            ))}
            {selectedTags3.map((tag) => ( 
              <button className="selected-button" key={tag} onClick={() => handleSelection(selectedTags3, tag, setSelectedTags3)}>
                {fieldState.tags3 && fieldState.tags3 !== "" ? fieldState.tags3 : "Tags 3:"} {tag}
                <span>❌</span>
              </button>
            ))}
            {selectedTags4.map((tag) => ( 
              <button className="selected-button" key={tag} onClick={() => handleSelection(selectedTags4, tag, setSelectedTags4)}>
                {fieldState.tags4 && fieldState.tags4 !== "" ? fieldState.tags4 : "Tags 4:"} {tag}
                <span>❌</span>
              </button>
            ))}
          </div>
        </section>
        {showSections && (
         <>         
            <section className="filters">
              <button className='selected-button' onClick={resetFilters}>
                <img className='back-button' src={filterremove} alt='filterremote' />
              </button>
            </section>

            <section className="filters">
              {selectedSection && selectedSection !== 'Show all' && (
                <label>                  
                  <input type="radio" value="section" checked={select === 'section'} onChange={() => handleStateChange('select', 'section')} />
                  {selectedSubsection ? selectedSection + '>' + selectedSubsection : selectedSection}
                </label>
              )}
              <label>
                <input
                  type="radio"
                  value="allSections"
                  checked={!selectedSection || selectedSection === 'Show all' || select === 'allSections'}                  
                  onChange={() => handleStateChange('select', 'allSections')}
                />
                All Sections
              </label>              
              <input onChange={(e) => handleStateChange('input', e.target.value)} type="search" id="searchName" title="Filter by id name author" placeholder="Filter by ..." value={input} />
            </section>
            <section className="filters">
                <div className="section-list">
                <h3>Filter by #Tags</h3>
                {uniqueSizes.length>0 && (
                  <div className="section-list">
                    <h3>{fieldState.size && fieldState.size !== "" ? fieldState.size : "Size:"}</h3>
                    <ul className="no-markers filters">
                      {uniqueSizes.map((size) => (
                        <li key={size}>
                          <label className="filters">
                            <input type="checkbox" value={size} checked={selectedSizes.includes(size)} onChange={() => handleSelection(selectedSizes, size, setSelectedSizes)} />
                            {size}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {uniqueColor.length>0 && (
                  <div className="section-list">
                    <h3>{fieldState.color && fieldState.color !== "" ? fieldState.color : "Color:"}</h3>
                    <ul className="no-markers filters">
                      {uniqueColor.map((color) => (
                        <li key={color}>
                          <label className="filters">
                            <input type="checkbox" value={color} checked={selectedColor.includes(color)} onChange={() => handleSelection(selectedColor, color, setSelectedColor)} />
                            {color}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {uniqueAuthors.length>0 && (
                  <div className="section-list">
                    <h3>{fieldState.author && fieldState.author !== "" ? fieldState.author : "Author:"}</h3>
                    <ul className="no-markers filters">
                      {uniqueAuthors.map((author) => (
                        <li key={author}>
                          <label className="filters">
                            <input type="checkbox" value={author} checked={selectedAuthors.includes(author)} onChange={() => handleSelection(selectedAuthors, author, setSelectedAuthors)} />
                            {author}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {uniqueTags1.length>0 && (
                  <div className="section-list">
                    <h3>{fieldState.tags1 && fieldState.tags1 !== "" ? fieldState.tags1 : "Tags 1:"}</h3>
                    <ul className="no-markers filters">
                      {uniqueTags1.map((tag1) => (
                        <li key={tag1}>
                          <label className="filters">
                            <input type="checkbox" value={tag1} checked={selectedTags1.includes(tag1)} onChange={() => handleSelection(selectedTags1, tag1, setSelectedTags1)} />
                            {tag1}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {uniqueTags2.length>0 && (
                  <div className="section-list">
                    <h3>{fieldState.tags2 && fieldState.tags2 !== "" ? fieldState.tags2 : "Tags 2:"}</h3>
                    <ul className="no-markers filters">
                      {uniqueTags2.map((tag2) => (
                        <li key={tag2}>
                          <label className="filters">
                            <input type="checkbox" value={tag2} checked={selectedTags2.includes(tag2)} onChange={() => handleSelection(selectedTags2, tag2, setSelectedTags2)} />
                            {tag2}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {uniqueTags3.length>0 && (
                  <div className="section-list">
                    <h3>{fieldState.tags3 && fieldState.tags3 !== "" ? fieldState.tags3 : "Tags 3:"}</h3> 
                    <ul className="no-markers filters">
                      {uniqueTags3.map((tag3) => (
                        <li key={tag3}>
                          <label className="filters">
                            <input type="checkbox" value={tag3} checked={selectedTags3.includes(tag3)} onChange={() => handleSelection(selectedTags3, tag3, setSelectedTags3)} />
                            {tag3}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {uniqueTags4.length>0 && (
                  <div className="section-list">
                    <h3>{fieldState.tags4 && fieldState.tags4 !== "" ? fieldState.tags4 : "Tags 4:"}</h3> 
                    <ul className="no-markers filters">
                      {uniqueTags4.map((tag4) => (
                        <li key={tag4}>
                          <label className="filters">
                            <input type="checkbox" value={tag4} checked={selectedTags4.includes(tag4)} onChange={() => handleSelection(selectedTags4, tag4, setSelectedTags4)} />
                            {tag4}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                </div>              
            </section>          
          </>
        )}

        {showSections && (
          <section className="filters">
            <button>
              <img className="back-button" src={upmenu} onClick={toggleSections} alt="Cancel" />
            </button>
          </section>
        )}

        <SortCart props={sortedBooks} />
      </section>
    </>
  );
}



// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import cancel from '../cart/img/cancel.png';
// import filter from '../cart/img/filter.png';
// import filterremove from '../cart/img/filterremove.png';
// import upmenu from '../cart/img/upmenu.png';
// import burger from '../cart/img/burger.png';
// import search from '../cart/img/search.png';
// import SortCart from './SortCart';

// // Utility function to apply filters
// const applyFilters = (books, filters) => {
//   let filteredBooks = books.filter((book) => book.Visibility !== '0');

//   if (filters.select === 'section' && filters.selectedSection && filters.selectedSection !== 'Show all') {
//     filteredBooks = filteredBooks.filter((book) => book.section === filters.selectedSection);
//     if (filters.selectedSubsection) {
//       filteredBooks = filteredBooks.filter((book) => book.partition === filters.selectedSubsection);
//     }
//   }

//   if (filters.input) {
//     filteredBooks = filteredBooks.filter(
//       (book) =>
//         book.title.toLowerCase().includes(filters.input.toLowerCase()) ||
//         book.id.toString().toLowerCase().includes(filters.input.toLowerCase()) ||
//         book.author.toString().toLowerCase().includes(filters.input.toLowerCase())
//     );
//   }

//   if (filters.selectedTags1.length > 0) {
//     filteredBooks = filteredBooks.filter((book) => filters.selectedTags1.includes(book.tags1));
//   }

//   if (filters.selectedTags2.length > 0) {
//     filteredBooks = filteredBooks.filter((book) => filters.selectedTags2.includes(book.tags2));
//   }

//   if (filters.selectedTags3.length > 0) {
//     filteredBooks = filteredBooks.filter((book) => filters.selectedTags3.includes(book.tags3));
//   }

//   if (filters.selectedTags4.length > 0) {
//     filteredBooks = filteredBooks.filter((book) => filters.selectedTags4.includes(book.tags4));
//   }

//   if (filters.selectedSizes.length >0) {
//     filteredBooks = filteredBooks.filter((book) => filters.selectedSizes.includes(book.size));
//   }

//   if (filters.selectedColor.length >0) {
//     filteredBooks = filteredBooks.filter((book) => filters.selectedColor.includes(book.color));
//   }
//   return filteredBooks;
// };

// export default function Filter() {
//   const {
//     selectedSection,
//     selectedSubsection,
//     theme,
//     books,
//     input,
//     setInput,
//     selectedTags1,
//     setSelectedTags1,
//     selectedTags2,
//     setSelectedTags2,
//     selectedTags3,
//     setSelectedTags3,
//     selectedTags4, 
//     setSelectedTags4,
//     selectedSizes,
//     setSelectedSizes,
//     selectedColor,
//     setSelectedColor,
//     fieldState
//   } = useContext(BooksContext);

//   const [select, setSelect] = useState('section');
//   const [sortedBooks, setSortedBooks] = useState([...books.filter((book) => book.Visibility !== '0')]);
//   const [uniqueTags1, setUniqueTags1] = useState([]);
//   const [uniqueTags2, setUniqueTags2] = useState([]);
//   const [uniqueTags3, setUniqueTags3] = useState([]); 
//   const [uniqueTags4, setUniqueTags4] = useState([]); 
//   const [uniqueSizes, setUniqueSizes] = useState([]);
//   const [uniqueColor, setUniqueColor] = useState([]);
//   const [uniqueAuthors, setUniqueAuthors] = useState([]);
//   const [selectedAuthors, setSelectedAuthors] = useState([]);
//   const [showSections, setShowSections] = useState(false);
//   const navigate = useNavigate();

 
//   const toggleSections = () => {
//     setShowSections((prevState) => !prevState);
//   };

//   const handleSelection = useCallback(
//     (selectedItems, item, setSelectedItems) => {
//       setSelectedItems((prevItems) =>
//         prevItems.includes(item)
//           ? prevItems.filter((selectedItem) => selectedItem !== item)
//           : [...prevItems, item]
//       );
//     },
//     []
//   );

//   const findBook = useCallback(() => {
  
//     const filters = {
//       selectedSection,
//       selectedSubsection,
//       selectedTags1,
//       selectedTags2,
//       selectedTags3,
//       selectedTags4,
//       selectedSizes,
//       selectedColor,
//       select,
//       input,
//     };

//     let filteredBooks = applyFilters(books, filters);

//     setSortedBooks(filteredBooks);
//   }, [select, books, input, selectedSizes, selectedTags1, selectedTags2, selectedTags3, selectedTags4, selectedColor, selectedSection, selectedSubsection]);

//   const findUniqueValues = useCallback(() => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();
//     const uniqueTags3Set = new Set();
//     const uniqueTags4Set = new Set();
//     const uniqueSizesSet = new Set();
//     const uniqueColorSet = new Set();
//     const uniqueAuthorsSet = new Set();

//     const filters = {
//       selectedSection,
//       selectedSubsection,
//       selectedTags1,
//       selectedTags2,
//       selectedTags3,
//       selectedTags4,
//       selectedSizes,
//       selectedColor,
//       select,
//       input,
//     };

//     let filteredBooks = applyFilters(books, filters);

//     filteredBooks.forEach(book => {
//       uniqueTags1Set.add(book.tags1);
//       uniqueTags2Set.add(book.tags2);
//       uniqueTags3Set.add(book.tags3);
//       uniqueTags4Set.add(book.tags4);
//       uniqueSizesSet.add(book.size);
//       uniqueColorSet.add(book.color);
//       uniqueAuthorsSet.add(book.author);
//     });

//     setUniqueTags1(Array.from(uniqueTags1Set).filter(tag => (typeof tag === 'string' || typeof tag === 'number') && tag.toString().trim() !== ''));
//     setUniqueTags2(Array.from(uniqueTags2Set).filter(tag => (typeof tag === 'string' || typeof tag === 'number') && tag.toString().trim() !== ''));
//     setUniqueTags3(Array.from(uniqueTags3Set).filter(tag => (typeof tag === 'string' || typeof tag === 'number') && tag.toString().trim() !== ''));
//     setUniqueTags4(Array.from(uniqueTags4Set).filter(tag => (typeof tag === 'string' || typeof tag === 'number') && tag.toString().trim() !== ''));
//     setUniqueSizes(Array.from(uniqueSizesSet).filter(size => (typeof size === 'string' || typeof size === 'number') && size.toString().trim() !== ''));
//     setUniqueColor(Array.from(uniqueColorSet).filter(color => (typeof color === 'string' || typeof color === 'number') && color.toString().trim() !== ''));
//     setUniqueAuthors(Array.from(uniqueAuthorsSet).filter(author => (typeof author === 'string' || typeof author === 'number') && author.toString().trim() !== ''));
//   }, [select, input, books, selectedSection, selectedSubsection, selectedTags1, selectedTags2, selectedTags3, selectedTags4, selectedSizes, selectedColor]);

//   const resetFilters = () => {
//     setInput('');   
//     setSelect('allSections');
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setSelectedTags3([]); 
//     setSelectedTags4([]); 
//     setSelectedSizes([]);
//     setSelectedColor([]);
//     setSelectedAuthors([]);
//     setSortedBooks(books.filter((book) => book.Visibility !== '0'));
//   };

//   useEffect(() => {
//     findBook();
//     findUniqueValues();
//   }, [findBook, findUniqueValues, select]);

//   useEffect(() => {
//     if (books.length === 0) {
//       navigate('/');
//     }
//   }, [books, navigate]);

//   if (books.length === 0) {
//     return null;
//   }

//   const handleStateChange = (key, value) => {
//     if (key === 'select') {
//       setSelect(value);
//     } else if (key === 'input') {
//       setInput(value);
//     }
//   };

//   return (
//     <>
//       {/* <section className={theme} key={`${select}`}>  */}
//       <section className={theme}>
//         <section className="filters">

//           <Link to="/BookList">
//             <button className={`sort-button ${select === 'section' && selectedSection && selectedSection !== 'Show all' && 'selected'}`}>
//               <img className={`back-button ${select === 'section' && selectedSection && selectedSection !== 'Show all' && 'selected'}`} src={burger} alt="category" />
//             </button>
//           </Link>
//           <button className='sort-button selected' >
//             {!showSections && (
//               <img className="back-button selected" src={filter} onClick={toggleSections} alt='filter' />
//             )}
//             {showSections && (
//               <img className="back-button selected" src={cancel} onClick={toggleSections} alt='close filter' />
//             )}
//           </button>
//           <Link to="/Search" >
//             <button className='sort-button'>
//               <img className="back-button" src={search} alt="search" />
//             </button>
//           </Link>
//         </section>
//         {/* <section className="filters"> */}
//         <section className="filters" key={`${select}`}>
//           <div className="selected-tags">           
//             <span>
//             Found: <strong>{sortedBooks.length}</strong>
//             </span>
//             {select === 'section' && selectedSection && selectedSection !== 'Show all' ? (              
//               <button className="selected-button" onClick={() => handleStateChange('select', 'allSections')}> 
//                 {selectedSection}
//                 {selectedSubsection && `> ${selectedSubsection}`}
//                 <span>❌</span>
//               </button>
//             ) : (             
//               <button className="selected-button" onClick={() => handleStateChange('select', 'allSections')}>
//                 All Sections
//                 <span>❌</span>
//               </button>
//             )}

//             {input && (              
//               <button className="selected-button" onClick={() => handleStateChange('input', '')}>
//                 Filter by: {input}
//                 <span>❌</span>
//               </button>
//             )}
//             {selectedSizes.map((size) => (
//               <button className="selected-button" key={size} onClick={() => handleSelection(selectedSizes, size, setSelectedSizes)}>
//                 {fieldState.size && fieldState.size !== "" ? fieldState.size : "Size:"} {size}
//                 <span>❌</span>
//               </button>
//             ))}
//             {selectedColor.map((color) => (
//               <button className="selected-button" key={color} onClick={() => handleSelection(selectedColor, color, setSelectedColor)}>
//                 {fieldState.color && fieldState.color !== "" ? fieldState.color : "Color:"} {color}
//                 <span>❌</span>
//               </button>
//             ))}
//             {selectedAuthors.map((author) => (
//               <button className="selected-button" key={author} onClick={() => handleSelection(selectedAuthors, author, setSelectedAuthors)}>
//                 {fieldState.author && fieldState.author !== "" ? fieldState.author : "Author:"} {author}
//                 <span>❌</span>
//               </button>
//             ))}
//             {selectedTags1.map((tag) => (
//               <button className="selected-button" key={tag} onClick={() => handleSelection(selectedTags1, tag, setSelectedTags1)}>
//                 {fieldState.tags1 && fieldState.tags1 !== "" ? fieldState.tags1 : "Tags 1:"} {tag}
//                 <span>❌</span>
//               </button>
//             ))}
//             {selectedTags2.map((tag) => (
//               <button className="selected-button" key={tag} onClick={() => handleSelection(selectedTags2, tag, setSelectedTags2)}>
//                 {fieldState.tags2 && fieldState.tags2 !== "" ? fieldState.tags2 : "Tags 2:"} {tag}
//                 <span>❌</span>
//               </button>
//             ))}
//             {selectedTags3.map((tag) => ( 
//               <button className="selected-button" key={tag} onClick={() => handleSelection(selectedTags3, tag, setSelectedTags3)}>
//                 {fieldState.tags3 && fieldState.tags3 !== "" ? fieldState.tags3 : "Tags 3:"} {tag}
//                 <span>❌</span>
//               </button>
//             ))}
//             {selectedTags4.map((tag) => ( 
//               <button className="selected-button" key={tag} onClick={() => handleSelection(selectedTags4, tag, setSelectedTags4)}>
//                 {fieldState.tags4 && fieldState.tags4 !== "" ? fieldState.tags4 : "Tags 4:"} {tag}
//                 <span>❌</span>
//               </button>
//             ))}
//           </div>
//         </section>
//         {showSections && (
//          <>         
//             <section className="filters">
//               <button className='selected-button' onClick={resetFilters}>
//                 <img className='back-button' src={filterremove} alt='filterremote' />
//               </button>
//             </section>

//             <section className="filters">
//               {selectedSection && selectedSection !== 'Show all' && (
//                 <label>                  
//                   <input type="radio" value="section" checked={select === 'section'} onChange={() => handleStateChange('select', 'section')} />
//                   {selectedSubsection ? selectedSection + '>' + selectedSubsection : selectedSection}
//                 </label>
//               )}
//               <label>
//                 <input
//                   type="radio"
//                   value="allSections"
//                   checked={!selectedSection || selectedSection === 'Show all' || select === 'allSections'}                  
//                   onChange={() => handleStateChange('select', 'allSections')}
//                 />
//                 All Sections
//               </label>              
//               <input onChange={(e) => handleStateChange('input', e.target.value)} type="search" id="searchName" title="Filter by id name author" placeholder="Filter by ..." value={input} />
//             </section>
//             <section className="filters">
//                 <div className="section-list">
//                 <h3>Filter by #Tags</h3>
//                   <div className="section-list">
//                     <h3>{fieldState.size && fieldState.size !== "" ? fieldState.size : "Size:"}</h3>
//                     <ul className="no-markers filters">
//                       {uniqueSizes.map((size) => (
//                         <li key={size}>
//                           <label className="filters">
//                             <input type="checkbox" value={size} checked={selectedSizes.includes(size)} onChange={() => handleSelection(selectedSizes, size, setSelectedSizes)} />
//                             {size}
//                           </label>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="section-list">
//                     <h3>{fieldState.color && fieldState.color !== "" ? fieldState.color : "Color:"}</h3>
//                     <ul className="no-markers filters">
//                       {uniqueColor.map((color) => (
//                         <li key={color}>
//                           <label className="filters">
//                             <input type="checkbox" value={color} checked={selectedColor.includes(color)} onChange={() => handleSelection(selectedColor, color, setSelectedColor)} />
//                             {color}
//                           </label>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="section-list">
//                     <h3>{fieldState.author && fieldState.author !== "" ? fieldState.author : "Author:"}</h3>
//                     <ul className="no-markers filters">
//                       {uniqueAuthors.map((author) => (
//                         <li key={author}>
//                           <label className="filters">
//                             <input type="checkbox" value={author} checked={selectedAuthors.includes(author)} onChange={() => handleSelection(selectedAuthors, author, setSelectedAuthors)} />
//                             {author}
//                           </label>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="section-list">
//                     <h3>{fieldState.tags1 && fieldState.tags1 !== "" ? fieldState.tags1 : "Tags 1:"}</h3>
//                     <ul className="no-markers filters">
//                       {uniqueTags1.map((tag1) => (
//                         <li key={tag1}>
//                           <label className="filters">
//                             <input type="checkbox" value={tag1} checked={selectedTags1.includes(tag1)} onChange={() => handleSelection(selectedTags1, tag1, setSelectedTags1)} />
//                             {tag1}
//                           </label>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="section-list">
//                     <h3>{fieldState.tags2 && fieldState.tags2 !== "" ? fieldState.tags2 : "Tags 2:"}</h3>
//                     <ul className="no-markers filters">
//                       {uniqueTags2.map((tag2) => (
//                         <li key={tag2}>
//                           <label className="filters">
//                             <input type="checkbox" value={tag2} checked={selectedTags2.includes(tag2)} onChange={() => handleSelection(selectedTags2, tag2, setSelectedTags2)} />
//                             {tag2}
//                           </label>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="section-list">
//                     <h3>{fieldState.tags3 && fieldState.tags3 !== "" ? fieldState.tags3 : "Tags 3:"}</h3> 
//                     <ul className="no-markers filters">
//                       {uniqueTags3.map((tag3) => (
//                         <li key={tag3}>
//                           <label className="filters">
//                             <input type="checkbox" value={tag3} checked={selectedTags3.includes(tag3)} onChange={() => handleSelection(selectedTags3, tag3, setSelectedTags3)} />
//                             {tag3}
//                           </label>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="section-list">
//                     <h3>{fieldState.tags4 && fieldState.tags4 !== "" ? fieldState.tags4 : "Tags 4:"}</h3> 
//                     <ul className="no-markers filters">
//                       {uniqueTags4.map((tag4) => (
//                         <li key={tag4}>
//                           <label className="filters">
//                             <input type="checkbox" value={tag4} checked={selectedTags4.includes(tag4)} onChange={() => handleSelection(selectedTags4, tag4, setSelectedTags4)} />
//                             {tag4}
//                           </label>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>              
//             </section>          
//           </>
//         )}

//         {showSections && (
//           <section className="filters">
//             <button>
//               <img className="back-button" src={upmenu} onClick={toggleSections} alt="Cancel" />
//             </button>
//           </section>
//         )}

//         <SortCart props={sortedBooks} />
//       </section>
//     </>
//   );
// }



// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import { Link } from "react-router-dom";
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import cancel from '../cart/img/cancel.png';
// import filter from '../cart/img/filter.png';
// import filterremove from '../cart/img/filterremove.png';
// import upmenu from '../cart/img/upmenu.png';
// import burger from '../cart/img/burger.png';
// import search from '../cart/img/search.png';
// import SortCart from './SortCart';

// export default function Search() {
//   const {
//     selectedSection,
//     selectedSubsection,
//     theme,
//     books,
//     input,
//     setInput,
//     selectedTags1,
//     setSelectedTags1,
//     selectedTags2,
//     setSelectedTags2,
//     selectedSizes,
//     setSelectedSizes,
//     selectedColor,
//     setSelectedColor,
//     fieldState
//   } = useContext(BooksContext);


//   if ( books.length === 0 ) {
   
//     window.location.href = '/';
//   }


//   const [select, setSelect] = useState('section');
// //   const [selectedSorted, setSelectedSorted] = useState('default');
//   const [sortedBooks, setSortedBooks] = useState([...books.filter((book) => book.Visibility !== '0')]);
//   const [uniqueTags1, setUniqueTags1] = useState([]);
//   const [uniqueTags2, setUniqueTags2] = useState([]);
//   const [uniqueSizes, setUniqueSizes] = useState([]);
//   const [uniqueColor, setUniqueColor] = useState([]);
//   const [uniqueAuthors, setUniqueAuthors] = useState([]);
//   const [selectedAuthors, setSelectedAuthors] = useState([]);
//   const [showSections, setShowSections] = useState(false);

//   const toggleSections = () => {
//     setShowSections((prevState) => !prevState);
//   };

//   const handleSelection = useCallback(
//     (selectedItems, item, setSelectedItems) => {
//       setSelectedItems((prevItems) =>
//         prevItems.includes(item)
//           ? prevItems.filter((selectedItem) => selectedItem !== item)
//           : [...prevItems, item]
//       );
//     },
//     []
//   );

//   const filterBooks = useCallback(
//     (books, key, values) => {
//       return values.length > 0 ? books.filter((book) => values.includes(book[key])) : books;
//     },
//     []
//   );

//   const findBook = useCallback(() => {
//     let filteredBooks = books.filter(
//       (book) =>
//         book.title.toLowerCase().includes(input.toLowerCase()) ||
//         book.id.toString().toLowerCase().includes(input.toLowerCase()) ||
//         book.author.toString().toLowerCase().includes(input.toLowerCase())
//     );

//     if (select === 'section' && selectedSection && selectedSection !== 'Show all') {
//       filteredBooks = filteredBooks.filter((book) => book.section === selectedSection);
//       if (selectedSubsection) {
//         filteredBooks = filteredBooks.filter((book) => book.partition === selectedSubsection);
//       }
//     }

   
//     if (selectedTags1.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTags1.includes(book.tags1));
//     }

//     if (selectedTags2.length > 0) {
//       filteredBooks = filteredBooks.filter((book) => selectedTags2.includes(book.tags2));
//     }

//     filteredBooks = filterBooks(filteredBooks, 'size', selectedSizes);
//     filteredBooks = filterBooks(filteredBooks, 'color', selectedColor);
//     filteredBooks = filteredBooks.filter((book) => book.Visibility !== '0');
//     setSortedBooks(filteredBooks);
//   },
//   [books, input, select, selectedSizes,  selectedTags1, selectedTags2, selectedColor, selectedSection, selectedSubsection, filterBooks]);

//   const findUniqueValues = useCallback(() => {
//     const uniqueTags1Set = new Set();
//     const uniqueTags2Set = new Set();
//     const uniqueSizesSet = new Set();
//     const uniqueSortedValuesSet = new Set();
//     const uniqueColorSet = new Set();
//     const uniqueAuthorsSet = new Set();
  
//     const filteredBooks = select === 'section' && selectedSection && selectedSection !== 'Show all'
//       ? books.filter(book => book.section === selectedSection && (!selectedSubsection || book.partition === selectedSubsection))
//       : books;
  
//     filteredBooks.forEach(book => {
//       if (book.Visibility !== '0') {
//         uniqueTags1Set.add(book.tags1);
//         uniqueTags2Set.add(book.tags2);
//         uniqueSizesSet.add(book.size);
//         uniqueSortedValuesSet.add(book.sorted);
//         uniqueColorSet.add(book.color);
//         uniqueAuthorsSet.add(book.author);
//       }
//     });
  
//     setUniqueTags1(Array.from(uniqueTags1Set).filter(tag => (typeof tag === 'string' || typeof tag === 'number') && tag.toString().trim() !== ''));
//     setUniqueTags2(Array.from(uniqueTags2Set).filter(tag => (typeof tag === 'string' || typeof tag === 'number') && tag.toString().trim() !== ''));
//     setUniqueSizes(Array.from(uniqueSizesSet).filter(size => (typeof size === 'string' || typeof size === 'number') && size.toString().trim() !== ''));
//     setUniqueColor(Array.from(uniqueColorSet).filter(color => (typeof color === 'string' || typeof color === 'number') && color.toString().trim() !== ''));
//     setUniqueAuthors(Array.from(uniqueAuthorsSet).filter(author => (typeof author === 'string' || typeof author === 'number') && author.toString().trim() !== ''));
  
//   }, [books, select, selectedSection, selectedSubsection]);
  

//   const resetFilters = () => {
//     setInput('');
//     setSelect('section');
//     setSelectedTags1([]);
//     setSelectedTags2([]);
//     setSelectedSizes([]);
//     setSelectedColor([]);
//     setSelectedAuthors([]);
//     // setSelectedSorted('default');
//     setSortedBooks(books.filter((book) => book.Visibility !== '0'));
//   };

//   useEffect(() => {
//     findBook();
//     findUniqueValues();
//   }, [findBook, findUniqueValues]);
// console.log(sortedBooks)
//   return (
//     <>     
//       <section className={theme}>
//         <section className="filters">
          
//           <Link to="/BookList">
//           <button  className={`sort-button ${select === 'section' && selectedSection && selectedSection !== 'Show all' && 'selected'}`}>   
//            <img className={`back-button ${select === 'section' && selectedSection && selectedSection !== 'Show all' && 'selected'}`} src={burger} alt="category" />
//           </button> 
//           </Link>
//           <button className='sort-button selected' > 
//             {!showSections && (
//               <img className="back-button selected" src={filter} onClick={toggleSections} alt='filter'/>
//             )}
//             {showSections && (
//               <img className="back-button selected" src={cancel} onClick={toggleSections} alt='close filter'/>
//             )}
//           </button>
//           <Link to="/GlSearch" > 
//           <button className='sort-button'> 
//             <img className="back-button" src={search} alt="search" />
//           </button>  
//           </Link>  
//         </section>
//         <section className="filters">
//           <div className="selected-tags">
//             Found: {sortedBooks.length}
          
//             {select === 'section' && selectedSection && selectedSection !== 'Show all' ? (
//   <button className="selected-button" onClick={() => setSelect('allSections')}>
//     {selectedSection}
//     {selectedSubsection && `> ${selectedSubsection}`}
//     <span>❌</span>
//   </button>
// ) : (
//   <button className="selected-button" onClick={() => setSelect('allSections')}>
//     All Sections
//     <span>❌</span>
//   </button>
// )}

//             {input && (
//               <button className="selected-button"  onClick={() => setInput('')}>
//                 Filter by: {input}
//                 <span>❌</span>
//               </button>
//             )}
//             {selectedSizes.map((size) => (
//               <button className="selected-button" key={size} onClick={() => handleSelection(selectedSizes, size, setSelectedSizes)}>
//                 {fieldState.size && fieldState.size!=="" ? fieldState.size :  "Size:"} {size}
//                 <span>❌</span>
//               </button>
//             ))}
//             {selectedColor.map((color) => (
//               <button className="selected-button" key={color} onClick={() => handleSelection(selectedColor, color, setSelectedColor)}>
//                 {fieldState.color && fieldState.color!=="" ? fieldState.color :  "Color:"} {color}
//                 <span>❌</span>
//               </button>
//             ))}
//             {selectedAuthors.map((author) => (
//               <button className="selected-button" key={author} onClick={() => handleSelection(selectedAuthors, author, setSelectedAuthors)}>
//                {fieldState.author && fieldState.author!=="" ? fieldState.author :  "Author:"} {author}
//                 <span>❌</span>
//               </button>
//             ))}
//             {selectedTags1.map((tag) => (
//               <button className="selected-button" key={tag} onClick={() => handleSelection(selectedTags1, tag, setSelectedTags1)}>
//                 {fieldState.tags1 && fieldState.tags1!=="" ? fieldState.tags1 :  "Tags 1:"} {tag}
//                 <span>❌</span>
//               </button>
//             ))}
//             {selectedTags2.map((tag) => (
//               <button className="selected-button" key={tag} onClick={() => handleSelection(selectedTags2, tag, setSelectedTags2)}>
//                 {fieldState.tags2 && fieldState.tags2!=="" ? fieldState.tags2 :  "Tags 2:"} {tag}
//                 <span>❌</span>
//               </button>
//             ))}
//           </div>
//         </section>
//         {showSections && (
//           <section className="filters">
//             <section className="filters">
//               <button  className='selected-button' onClick={resetFilters}>
//                 <img className='back-button' src={filterremove} alt='filterremote'/>
//               </button>
//             </section>

//             <section className="filters">
//   {selectedSection && selectedSection !== 'Show all' && (
//     <label>
//       <input type="radio" value="section" checked={select === 'section'} onChange={() => setSelect('section')} />
//       {selectedSubsection ? selectedSection + '>' + selectedSubsection : selectedSection}
//     </label>
//   )}
//   <label>
//   <input 
//     type="radio" 
//     value="allSections" 
//     checked={!selectedSection || selectedSection === 'Show all' || select === 'allSections'} 
//     onChange={() => setSelect('allSections')} 
//   />
//   All Sections
// </label>

// </section>

//             <section className="filters">
//               <input onChange={(e) => setInput(e.target.value)} type="search" id="searchName" title="Filter by id name author" placeholder="Filter by ..." value={input} />
//               {input && (
//                  <button className='selected-button'>
//                  <img className="back-button" src={cancel} onClick={() => setInput('')} alt="Cancel" />
//                  </button>
                               
//               )}
//             </section>
//             <section className="filters">
//               <div>
//                 <h3>Filter by #Tags</h3>
                        
//             <div className="section-list">
//   <div className="section-list">
//     <h3>{fieldState.size && fieldState.size!=="" ? fieldState.size :  "Size:"}</h3>
//     <ul className="no-markers filters">
//       {uniqueSizes.map((size) => (
//         <li key={size}>
//           <label className="filters">
//             <input type="checkbox" value={size} checked={selectedSizes.includes(size)} onChange={() => handleSelection(selectedSizes, size, setSelectedSizes)} />
//             {size}
//           </label>
//         </li>
//       ))}
//     </ul>
//   </div>

//   <div className="section-list">
//     <h3>{fieldState.color && fieldState.color!=="" ? fieldState.color :  "Color:"}</h3>
//     <ul className="no-markers filters">
//       {uniqueColor.map((color) => (
//         <li key={color}>
//           <label className="filters">
//             <input type="checkbox" value={color} checked={selectedColor.includes(color)} onChange={() => handleSelection(selectedColor, color, setSelectedColor)} />
//             {color}
//           </label>
//         </li>
//       ))}
//     </ul>
//   </div>

//   <div className="section-list">
//     <h3>{fieldState.author && fieldState.author!=="" ? fieldState.author :  "Author:"}</h3>
//     <ul className="no-markers filters">
//       {uniqueAuthors.map((author) => (
//         <li key={author}>
//           <label className="filters">
//             <input type="checkbox" value={author} checked={selectedAuthors.includes(author)} onChange={() => handleSelection(selectedAuthors, author, setSelectedAuthors)} />
//             {author}
//           </label>
//         </li>
//       ))}
//     </ul>
//   </div>

//   <div className="section-list">
//     <h3>{fieldState.tags1 && fieldState.tags1!=="" ? fieldState.tags1 :  "Tags 1:"}</h3>
//     <ul className="no-markers filters">
//       {uniqueTags1.map((tag1) => (
//         <li key={tag1}>
//           <label className="filters">
//             <input type="checkbox" value={tag1} checked={selectedTags1.includes(tag1)} onChange={() => handleSelection(selectedTags1, tag1, setSelectedTags1)} />
//             {tag1}
//           </label>
//         </li>
//       ))}
//     </ul>
//   </div>

//   <div className="section-list">
//     <h3>{fieldState.tags2 && fieldState.tags2!=="" ? fieldState.tags2 :  "Tags 2:"}</h3>
//     <ul className="no-markers filters">
//       {uniqueTags2.map((tag2) => (
//         <li key={tag2}>
//           <label className="filters">
//             <input type="checkbox" value={tag2} checked={selectedTags2.includes(tag2)} onChange={() => handleSelection(selectedTags2, tag2, setSelectedTags2)} />
//             {tag2}
//           </label>
//         </li>
//       ))}
//     </ul>
//   </div>
// </div>


//             </div>
//           </section>
//         </section>
//       )} 

//         {showSections && (
//         <section className="filters">
//          <button>
//             <img className="back-button" src={upmenu} onClick={toggleSections} alt="Cancel" />
//          </button> 
//         </section>
//         )}  

//      <SortCart props={sortedBooks}/>
//     </section>
//     </>
//    );
// }
