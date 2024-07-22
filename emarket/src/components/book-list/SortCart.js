import React, { useEffect, useState, useContext } from 'react';
import Shelf from './Shelf';
import './bookList.css';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import ScrollToTopButton from '../utils/ScrollToTopButton';

export default function SortCart({ props, componentName }) {
  const {
    theme,
    uiMain,
    sortStates,
    setSortStates
  } = useContext(BooksContext);

  const {
    discont,
    newcart,
    popular,
    down_sort,
    up_sort,
    list_icon,
    comfy_icon
  } = useIcons();

  const [widthBlock, setWidthBlock] = useState(sortStates[componentName].view === 'list' ? 1 : 0);
  const [sortBooks, setSortBooks] = useState([]);
  const [selectedSort, setSelectedSort] = useState(sortStates[componentName].type);
  const [selectedDirection, setSelectedDirection] = useState(sortStates[componentName].direction);
  const [selectedWidth, setSelectedWidth] = useState(sortStates[componentName].view);
  const [priceblock, setPriceblock] = useState(false);

  useEffect(() => {
    if (uiMain && uiMain.nopriceblock) {
      setPriceblock(true); // Price block is not displayed
    }
  }, [uiMain, uiMain.nopriceblock]);

  useEffect(() => {
    if (props) {
      setSortBooks(props);
    }
  }, [props]);

  useEffect(() => {
    setSelectedSort(sortStates[componentName].type);
    setSelectedDirection(sortStates[componentName].direction);
    setSelectedWidth(sortStates[componentName].view);

    if (props) {
      let sortedBooksCopy = [...props];
      if (sortStates[componentName].direction === 'lowPrice') {
        sortedBooksCopy.sort((a, b) => a.price - b.price);
      } else if (sortStates[componentName].direction === 'highPrice') {
        sortedBooksCopy.sort((a, b) => b.price - a.price);
      }
      if (sortStates[componentName].type) {
        sortedBooksCopy.sort((a, b) => (a.sorted === sortStates[componentName].type && b.sorted !== sortStates[componentName].type ? -1 : 1));
      }
      setSortBooks(sortedBooksCopy);
    }
  }, [sortStates, componentName, props]);

  const updateSortStates = (newState) => {
    setSortStates(prevStates => {
      const currentComponentState = prevStates[componentName];
      const updatedState = { ...currentComponentState, ...newState };

      // Check if the state actually changed
      if (JSON.stringify(currentComponentState) !== JSON.stringify(updatedState)) {
        return {
          ...prevStates,
          [componentName]: updatedState
        };
      }

      // Return the same state if nothing changed
      return prevStates;
    });
  };

  const sortBy = (type) => {
    if (selectedSort === type) return;
    let sortedBooksCopy = [...sortBooks];
    sortedBooksCopy.sort((a, b) => (a.sorted === type && b.sorted !== type ? -1 : 1));
    setSelectedSort(type);
    setSortBooks(sortedBooksCopy);
    updateSortStates({ type });
  };

  const sortLowPrice = () => {
    if (selectedDirection === 'lowPrice') return;
    setSortBooks(prevBooks => [...prevBooks].sort((a, b) => a.price - b.price));
    setSelectedDirection('lowPrice');
    updateSortStates({ direction: 'lowPrice' });
  };

  const sortHighPrice = () => {
    if (selectedDirection === 'highPrice') return;
    setSortBooks(prevBooks => [...prevBooks].sort((a, b) => b.price - a.price));
    setSelectedDirection('highPrice');
    updateSortStates({ direction: 'highPrice' });
  };

  const list = () => {
    if (selectedWidth === 'list') return;
    setWidthBlock(1);
    setSelectedWidth('list');
    updateSortStates({ view: 'list' });
  };

  const comfy = () => {
    if (selectedWidth === 'comfy') return;
    setWidthBlock(0);
    setSelectedWidth('comfy');
    updateSortStates({ view: 'comfy' });
  };

  return (
    <section className={theme}>
      <section className="filters">
        {sortBooks.length > 0 && (
          <div className="filters">
            <button className={`sort-button ${selectedWidth === 'list' && 'selected'}`} onClick={list}>
              <img className={`back-button ${selectedWidth === 'list' && 'selected'}`} src={list_icon} alt='List view' onClick={list} />
            </button>
            <button className={`sort-button ${selectedWidth === 'comfy' && 'selected'}`} onClick={comfy}>
              <img className={`back-button ${selectedWidth === 'comfy' && 'selected'}`} src={comfy_icon} alt='Comfortable view' onClick={comfy} />
            </button>
            <button className={`sort-button ${selectedDirection === 'lowPrice' && 'selected'}`} onClick={sortLowPrice}>
              <img className={`back-button ${selectedDirection === 'lowPrice' && 'selected'}`} src={up_sort} alt='price up' onClick={sortLowPrice} />
            </button>
            <button className={`sort-button ${selectedDirection === 'highPrice' && 'selected'}`} onClick={sortHighPrice}>
              <img className={`back-button ${selectedDirection === 'highPrice' && 'selected'}`} src={down_sort} alt='price down' onClick={sortHighPrice} />
            </button>

            {sortBooks.some(book => book.sorted === 'new') && (
              <button className={`sort-button ${selectedSort === 'new' && 'selected'}`} onClick={() => sortBy('new')}>
                <img src={newcart} className={`back-button ${selectedSort === 'new' && 'selected'}`} onClick={() => sortBy('new')} alt='newcart' />
              </button>
            )}
            {sortBooks.some(book => book.sorted === 'popular') && (
              <button className={`sort-button ${selectedSort === 'popular' && 'selected'}`} onClick={() => sortBy('popular')}>
                <img src={popular} className={`back-button ${selectedSort === 'popular' && 'selected'}`} onClick={() => sortBy('popular')} alt='popular' />
              </button>
            )}
            {sortBooks.some(book => book.sorted === 'sale') && (
              <button className={`sort-button ${selectedSort === 'sale' && 'selected'}`} onClick={() => sortBy('sale')}>
                <img src={discont} className={`back-button ${selectedSort === 'sale' && 'selected'}`} onClick={() => sortBy('sale')} alt='discont' />
              </button>
            )}
          </div>
        )}
      </section>
      {sortBooks.length === 0 && (
        <div> Oops found 0 try again </div>
      )}
      <ScrollToTopButton />
      <Shelf book={sortBooks} widhtblock={widthBlock} nopriceblock={priceblock} />
    </section>
  );
}



// import React, { useEffect, useState, useContext } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import { useIcons } from '../../IconContext';
// import ScrollToTopButton from '../utils/ScrollToTopButton';

// export default function SortCart({ props, componentName }) {
//   const {
//     theme,
//     uiMain,
//     sortStates,
//     setSortStates
//   } = useContext(BooksContext);

//   const {
//     discont,
//     newcart,
//     popular,
//     down_sort,
//     up_sort,
//     list_icon,
//     comfy_icon
//   } = useIcons();

//   const [widthBlock, setWidthBlock] = useState(sortStates[componentName].view === 'list' ? 1 : 0);
//   const [sortBooks, setSortBooks] = useState([]);
//   const [selectedSort, setSelectedSort] = useState(sortStates[componentName].type);
//   const [selectedDirection, setSelectedDirection] = useState(sortStates[componentName].direction);
//   const [selectedWidth, setSelectedWidth] = useState(sortStates[componentName].view);
//   const [priceblock, setPriceblock] = useState(false);
// console.log(sortStates)
//   useEffect(() => {
//     if (uiMain && uiMain.nopriceblock) {
//       setPriceblock(true); // Price block is not displayed
//     }
//   }, [uiMain, uiMain.nopriceblock]);

//   useEffect(() => {
//     if (props) {
//       setSortBooks(props);
//     }
//   }, [props]);

//   useEffect(() => {
//     setSelectedSort(sortStates[componentName].type);
//     setSelectedDirection(sortStates[componentName].direction);
//     setSelectedWidth(sortStates[componentName].view);
//   }, [sortStates, componentName]);

//   const updateSortStates = (newState) => {
//     setSortStates(prevStates => {
//       const currentComponentState = prevStates[componentName];
//       const updatedState = { ...currentComponentState, ...newState };

//       // Check if the state actually changed
//       if (JSON.stringify(currentComponentState) !== JSON.stringify(updatedState)) {
//         return {
//           ...prevStates,
//           [componentName]: updatedState
//         };
//       }

//       // Return the same state if nothing changed
//       return prevStates;
//     });
//   };

//   const sortBy = (type) => {
//     if (selectedSort === type) return;
//     let sortedBooksCopy = [...sortBooks];
//     sortedBooksCopy.sort((a, b) => (a.sorted === type && b.sorted !== type ? -1 : 1));
//     setSelectedSort(type);
//     setSortBooks(sortedBooksCopy);
//     updateSortStates({ type });
//   };

//   const sortLowPrice = () => {
//     if (selectedDirection === 'lowPrice') return;
//     setSortBooks(prevBooks => [...prevBooks].sort((a, b) => a.price - b.price));
//     setSelectedDirection('lowPrice');
//     updateSortStates({ direction: 'lowPrice' });
//   };

//   const sortHighPrice = () => {
//     if (selectedDirection === 'highPrice') return;
//     setSortBooks(prevBooks => [...prevBooks].sort((a, b) => b.price - a.price));
//     setSelectedDirection('highPrice');
//     updateSortStates({ direction: 'highPrice' });
//   };

//   const list = () => {
//     if (selectedWidth === 'list') return;
//     setWidthBlock(1);
//     setSelectedWidth('list');
//     updateSortStates({ view: 'list' });
//   };

//   const comfy = () => {
//     if (selectedWidth === 'comfy') return;
//     setWidthBlock(0);
//     setSelectedWidth('comfy');
//     updateSortStates({ view: 'comfy' });
//   };
// console.log(sortBooks)
//   return (
//     <section className={theme}>
//       <section className="filters">
//         {sortBooks.length > 0 && (
//           <div className="filters">
//             <button className={`sort-button ${selectedWidth === 'list' && 'selected'}`} onClick={list}>
//               <img className={`back-button ${selectedWidth === 'list' && 'selected'}`} src={list_icon} alt='List view' onClick={list} />
//             </button>
//             <button className={`sort-button ${selectedWidth === 'comfy' && 'selected'}`} onClick={comfy}>
//               <img className={`back-button ${selectedWidth === 'comfy' && 'selected'}`} src={comfy_icon} alt='Comfortable view' onClick={comfy} />
//             </button>
//             <button className={`sort-button ${selectedDirection === 'lowPrice' && 'selected'}`} onClick={sortLowPrice}>
//               <img className={`back-button ${selectedDirection === 'lowPrice' && 'selected'}`} src={up_sort} alt='price up' onClick={sortLowPrice} />
//             </button>
//             <button className={`sort-button ${selectedDirection === 'highPrice' && 'selected'}`} onClick={sortHighPrice}>
//               <img className={`back-button ${selectedDirection === 'highPrice' && 'selected'}`} src={down_sort} alt='price down' onClick={sortHighPrice} />
//             </button>

//             {sortBooks.some(book => book.sorted === 'new') && (
//               <button className={`sort-button ${selectedSort === 'new' && 'selected'}`} onClick={() => sortBy('new')}>
//                 <img src={newcart} className={`back-button ${selectedSort === 'new' && 'selected'}`} onClick={() => sortBy('new')} alt='newcart' />
//               </button>
//             )}
//             {sortBooks.some(book => book.sorted === 'popular') && (
//               <button className={`sort-button ${selectedSort === 'popular' && 'selected'}`} onClick={() => sortBy('popular')}>
//                 <img src={popular} className={`back-button ${selectedSort === 'popular' && 'selected'}`} onClick={() => sortBy('popular')} alt='popular' />
//               </button>
//             )}
//             {sortBooks.some(book => book.sorted === 'sale') && (
//               <button className={`sort-button ${selectedSort === 'sale' && 'selected'}`} onClick={() => sortBy('sale')}>
//                 <img src={discont} className={`back-button ${selectedSort === 'sale' && 'selected'}`} onClick={() => sortBy('sale')} alt='discont' />
//               </button>
//             )}
//           </div>
//         )}
//       </section>
//       {sortBooks.length === 0 && (
//         <div> Oops found 0 try again </div>
//       )}
//       <ScrollToTopButton />
//       <Shelf book={sortBooks} widhtblock={widthBlock} nopriceblock={priceblock} />
//     </section>
//   );
// }


// import React, { useEffect, useState, useContext } from 'react';
// import Shelf from './Shelf';
// import './bookList.css';
// import { BooksContext } from '../../BooksContext';
// import { useIcons } from '../../IconContext';
// import ScrollToTopButton from '../utils/ScrollToTopButton';

// export default function SortCart({props}) {
//   const {
//     theme,  uiMain      
//   } = useContext(BooksContext);

//   const {   
//         discont,
//         newcart, 
//         popular, 
//         down_sort,  
//         up_sort,  
//         list_icon, 
//         comfy_icon, } = useIcons();
 
//   const [widthBlock, setWidthBlock] = useState(0);
//   const [sortBooks, setSortBooks] = useState([]);
//   const [selectedSort, setSelectedSort] = useState('');
//   const [selectedWidth, setSelectedWidth] = useState('');
//   const [priceblock, setPriceblock] = useState(false);

//   useEffect(() => {
//     if (uiMain&&uiMain.nopriceblock) {
//     setPriceblock(true); // Price block is not displayed
//     }
//   }, [uiMain, uiMain.nopriceblock]);
  
//   useEffect(() => {
//     if (props) {
//       setSortBooks(props);
//     }
//   }, [props]);
  
//   const sortBy = (type) => {
//     let sortedBooksCopy = [...sortBooks];
//     sortedBooksCopy.sort((a, b) => (a.sorted === type && b.sorted !== type ? -1 : 1));
//     setSelectedSort(type);
//     setSortBooks(sortedBooksCopy);
//   };

//   const sortByNew = () => sortBy('new');
//   const sortByPopular = () => sortBy('popular');
//   const sortBySale = () => sortBy('sale');

//   const sortLowPrice = () => {
//     setSortBooks(prevBooks => [...prevBooks].sort((a, b) => a.price - b.price));
//     setSelectedSort('lowPrice');
//   };

//   const sortHighPrice = () => {
//     setSortBooks(prevBooks => [...prevBooks].sort((a, b) => b.price - a.price));
//     setSelectedSort('highPrice');
//   };

//   const list = () => {setWidthBlock(1); setSelectedWidth('list');}
//   const comfy = () => {setWidthBlock(0); setSelectedWidth('comfy');}
 
//   return (
//     <section className={theme}>
//       <section className="filters">
       
//       {sortBooks.length>0 &&(
//         <div className="filters">  
//           <button className={`sort-button ${selectedWidth === 'list' && 'selected'}`} onClick={list}>
//             <img className={`back-button ${selectedWidth === 'list' && 'selected'}`} src={list_icon} alt='List view' onClick={list}/>
//           </button>
//           <button className={`sort-button ${selectedWidth === 'comfy' && 'selected'}`} onClick={comfy}>
//             <img className={`back-button ${selectedWidth === 'comfy' && 'selected'}`} src={comfy_icon} alt='Comfortable view' onClick={comfy}/>
//           </button>
//           <button className={`sort-button ${selectedSort === 'lowPrice' && 'selected'}`} onClick={sortLowPrice}>
//             <img className={`back-button ${selectedSort === 'lowPrice' && 'selected'}`} src={up_sort} alt='price up' onClick={sortLowPrice}/>
//           </button>
//           <button className={`sort-button ${selectedSort === 'highPrice' && 'selected'}`} onClick={sortHighPrice}>
//             <img className={`back-button ${selectedSort === 'highPrice' && 'selected'}`} src={down_sort} alt='price down' onClick={sortHighPrice}/>
//           </button>
          
//           {sortBooks.some(book => book.sorted === 'new') && (
//             <button className={`sort-button ${selectedSort === 'new' && 'selected'}`} onClick={sortByNew}>
//              <img src={newcart} className={`back-button ${selectedSort === 'new' && 'selected'}`} onClick={sortByNew} alt='newcart'/>
//             </button>
//           )}
//           {sortBooks.some(book => book.sorted === 'popular') && (
//             <button className={`sort-button ${selectedSort === 'popular' && 'selected'}`} onClick={sortByPopular}>
//              <img src={popular} className={`back-button ${selectedSort === 'popular' && 'selected'}`} onClick={sortByPopular} alt='popular'/>
//             </button>
//            )}
//           {sortBooks.some(book => book.sorted === 'sale') && (
//             <button className={`sort-button ${selectedSort === 'sale' && 'selected'}`} onClick={sortBySale}>
//              <img src={discont} className={`back-button ${selectedSort === 'sale' && 'selected'}`} onClick={sortBySale} alt='discont'/>
//             </button>
//           )}
//         </div>
//         )}
            
//       </section>
//       {sortBooks.length===0 &&(
//            <div> Oops found 0 try again </div>
//           )}
//       <ScrollToTopButton />
//       <Shelf book={sortBooks} widhtblock={widthBlock}  nopriceblock={priceblock}/>
//     </section>
//   );
// }
