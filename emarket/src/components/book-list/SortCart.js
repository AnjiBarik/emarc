import React, { useEffect, useState, useContext } from 'react';
import Shelf from './Shelf';
import './bookList.css';
import { BooksContext } from '../../BooksContext';
import ScrollToTopButton from './ScrollToTopButton';
import down_sort from '../cart/img/down_sort.png';
import up_sort from '../cart/img/up_sort.png';
import list_icon from '../cart/img/list_icon.png';
import comfy_icon from '../cart/img/comfy_icon.png';
import discont from '../cart/img/discont.png';
import newcart from '../cart/img/new.png';
import popular from '../cart/img/popular.png';


export default function SortCart({props}) {
  const {
    theme,  uiMain      
  } = useContext(BooksContext);
 
  const [widthBlock, setWidthBlock] = useState(0);
  const [sortBooks, setSortBooks] = useState([]);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedWidth, setSelectedWidth] = useState('');
  const [priceblock, setPriceblock] = useState(false);

  useEffect(() => {
    if (uiMain&&uiMain.nopriceblock) {
    setPriceblock(true); // Price block is not displayed
    }
  }, [uiMain, uiMain.nopriceblock]);
  //console.log(uiMain.nopriceblock)
  //console.log(priceblock)
  useEffect(() => {
    if (props) {
      setSortBooks(props);
    }
  }, [props]);
  
  const sortBy = (type) => {
    let sortedBooksCopy = [...sortBooks];
    sortedBooksCopy.sort((a, b) => (a.sorted === type && b.sorted !== type ? -1 : 1));
    setSelectedSort(type);
    setSortBooks(sortedBooksCopy);
  };

  const sortByNew = () => sortBy('new');
  const sortByPopular = () => sortBy('popular');
  const sortBySale = () => sortBy('sale');

  const sortLowPrice = () => {
    setSortBooks(prevBooks => [...prevBooks].sort((a, b) => a.price - b.price));
    setSelectedSort('lowPrice');
  };

  const sortHighPrice = () => {
    setSortBooks(prevBooks => [...prevBooks].sort((a, b) => b.price - a.price));
    setSelectedSort('highPrice');
  };

  const list = () => {setWidthBlock(1); setSelectedWidth('list');}
  const comfy = () => {setWidthBlock(0); setSelectedWidth('comfy');}
 
  return (
    <section className={theme}>
      <section className="filters">
       
      {sortBooks.length>0 &&(
        <div className="filters">  
          <button className={`sort-button ${selectedWidth === 'list' && 'selected'}`} onClick={list}>
            <img className={`back-button ${selectedWidth === 'list' && 'selected'}`} src={list_icon} alt='List view' onClick={list}/>
          </button>
          <button className={`sort-button ${selectedWidth === 'comfy' && 'selected'}`} onClick={comfy}>
            <img className={`back-button ${selectedWidth === 'comfy' && 'selected'}`} src={comfy_icon} alt='Comfortable view' onClick={comfy}/>
          </button>
          <button className={`sort-button ${selectedSort === 'lowPrice' && 'selected'}`} onClick={sortLowPrice}>
            <img className={`back-button ${selectedSort === 'lowPrice' && 'selected'}`} src={up_sort} alt='price up' onClick={sortLowPrice}/>
          </button>
          <button className={`sort-button ${selectedSort === 'highPrice' && 'selected'}`} onClick={sortHighPrice}>
            <img className={`back-button ${selectedSort === 'highPrice' && 'selected'}`} src={down_sort} alt='price down' onClick={sortHighPrice}/>
          </button>
          
          {sortBooks.some(book => book.sorted === 'new') && (
            <button className={`sort-button ${selectedSort === 'new' && 'selected'}`} onClick={sortByNew}>
             <img src={newcart} className={`back-button ${selectedSort === 'new' && 'selected'}`} onClick={sortByNew} alt='newcart'/>
            </button>
          )}
          {sortBooks.some(book => book.sorted === 'popular') && (
            <button className={`sort-button ${selectedSort === 'popular' && 'selected'}`} onClick={sortByPopular}>
             <img src={popular} className={`back-button ${selectedSort === 'popular' && 'selected'}`} onClick={sortByPopular} alt='popular'/>
            </button>
           )}
          {sortBooks.some(book => book.sorted === 'sale') && (
            <button className={`sort-button ${selectedSort === 'sale' && 'selected'}`} onClick={sortBySale}>
             <img src={discont} className={`back-button ${selectedSort === 'sale' && 'selected'}`} onClick={sortBySale} alt='discont'/>
            </button>
          )}
        </div>
        )}
            
      </section>
      {sortBooks.length===0 &&(
           <div> Oops found 0 try again </div>
          )}
      <ScrollToTopButton />
      <Shelf book={sortBooks} widhtblock={widthBlock}  nopriceblock={priceblock}/>
    </section>
  );
}
