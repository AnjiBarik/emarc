import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
//import notFound from './img/imageNotFound.png';
import LazyImage from './LazyImage';
import PriceBlock from '../specific-book/PriceBlock';
import { BooksContext } from '../../BooksContext';
import { useContext } from 'react';
import discont from '../cart/img/discont.png';
import newcart from '../cart/img/new.png';
import popular from '../cart/img/popular.png';

export default function Shelf(props) {
  const { setSpecificBook, fieldState } = useContext(BooksContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
//  const [supportsIntersectionObserver, setSupportsIntersectionObserver] = useState(false);



  // useEffect(() => {
  //   if ('IntersectionObserver' in window) {
  //     setSupportsIntersectionObserver(true);
  //   }
  // }, []);

  // const lastBookRef = useCallback((node) => {
  //   if (!node || !supportsIntersectionObserver) return;

  //   const observer = new IntersectionObserver((entries) => {
  //     if (entries[0].isIntersecting) {
  //       loadImages();
  //       observer.unobserve(node);
  //     }
  //   });

  //   observer.observe(node);
  // }, [supportsIntersectionObserver]);

  // const loadImages = () => {
  //   const images = document.querySelectorAll('.lazy-img');
  //   images.forEach((img) => {
  //     const src = img.getAttribute('data-src');
  //     if (src) {
  //       img.src = src;
  //       img.removeAttribute('data-src');
  //     }
  //   });
  // };

  const shelf = props.book.map((el, index) => {
  //  const images = el.imageblock.split(',');
  //  const imageSource = el.image && el.image !== '' ? el.image : images[currentImageIndex];

const imagespublic = el.imageblockpublic && el.imageblockpublic!=="" ? el.imageblockpublic.split(',').map(element => `${process.env.PUBLIC_URL}/img/${element}`):el.imageblock.split(',');
const imageSource = el.imagepublic && el.imagepublic!=="" ?`${process.env.PUBLIC_URL}/img/${el.imagepublic}`:el.image && el.image !== '' ? el.image : imagespublic[currentImageIndex] ;
console.log(imagespublic)
//console.log(imageSourcepublic)
console.log(imageSource)

    const colorRGB = fieldState.colorblock
      ? fieldState.colorblock
          .split(';')
          .map(colorItem => colorItem.split(':'))
          .reduce((acc, [colorName, rgb]) => ({ ...acc, [colorName.trim()]: rgb.trim().slice(1, -1) }), {})
      : {};




    return (
      <section key={el.id} className='shelf-element'>
        <div
          // ref={index === props.book.length - 1 ? lastBookRef : null}
          id={el.id}
          className={`book custom-element ${props.widhtblock === 1 ? 'widhtblock' : 'widhtblock1'}`}
        >
          <div className='img-container'>
          <div className='img-conteiner'>   
            <p className='book-id'>
              <b>{fieldState.id && fieldState.id !== '' ? fieldState.id : 'id:'}</b>
              {el.id}
            </p>
            {el.sorted === 'new' && <img src={newcart} className='art-icon' alt='New Cart' />}
            {el.sorted === 'sale' && <img src={discont} className='art-icon' alt='Discount Cart' />}
            {el.sorted === 'popular' && <img src={popular} className='art-icon' alt='Popular Cart' />}
            {el.size !== undefined && el.size !== '' && (
              <Link style={{ cursor: 'pointer' }} to='/specificbook' onClick={(e) => bookInfo(e)}>
                <p className='book-text'>
                  <b className='book-size'>
                    {fieldState.size && fieldState.size !== '' ? fieldState.size : 'Size:'}
                    {el.sizeblock && el.sizeblock !== '' ? <b>↔️{el.size}↔️</b> : <b>{el.size}</b>}
                  </b>
                </p>
              </Link>
            )}
            {el.color !== undefined && el.color !== '' && (
              <Link style={{ cursor: 'pointer' }} to='/specificbook' onClick={(e) => bookInfo(e)}>
                <p className='book-text'>
                  <b className='book-size color-size'>
                    {fieldState.color && fieldState.color !== '' ? fieldState.color : 'Color:'}
                    {el.colorblock && el.colorblock !== '' ? (
                      <>
                        <b>↔️{el.color}↔️</b>
                        {colorRGB[el.color.trim()] && (
                           <span
                           className='circle' 
                           style={{ backgroundColor: `rgb(${colorRGB[el.color.trim()]})` }}
                         ></span>
                        )}
                      </>
                    ) : (
                      <>
                      <b>{el.color}</b>
                      {colorRGB[el.color.trim()] && (
                        <span
                        className='circle' 
                        style={{ backgroundColor: `rgb(${colorRGB[el.color.trim()]})` }}
                      ></span>
                      )}
                      </>
                    )}
                  </b>
                </p>
              </Link>
            )}
            <Link className='book-img' to='/specificbook' onClick={(e) => bookInfo(e)}>
            <LazyImage
                  src={imageSource}
                  alt={el.title}
                  // className={el.art === 'width' ? 'artwidth lazy-img' : 'art lazy-img'}
                  className={
                    props.widhtblock === 1
                      ? el.art === 'width'
                        ? 'widthartwidth lazy-img'
                        : 'widthart lazy-img'
                      : el.art === 'width'
                        ? 'artwidth lazy-img'
                        : 'art lazy-img'
                  }
                />
              
              
              {/* <img
                data-src={imageSource}
                alt={el.title}
                className={el.art === 'width' ? 'artwidth lazy-img' : 'art lazy-img'}
                onError={(e) => {
                  e.target.src = notFound;
                }}
              /> */}
            </Link>
          </div>
          {/* <div className={el.art === 'width' ? 'name-block-width' : 'name-block'}> */}
          <div className={
    props.widhtblock === 1
    ? el.art === 'width'
      ? 'widthname-block-width'
      : 'widthname-block'
    : el.art === 'width'
      ? 'name-block-width'
      : 'name-block'
    }>
            <p className='book-name'>
              <b>{fieldState.title && fieldState.title !== '' ? fieldState.title : 'Product Name:'}</b>
              {el.title.length >= 24 ? el.title.slice(0, 46) + '...' : el.title}
            </p>
          
            <p className='view-price'>
              <b>{fieldState.price && fieldState.price !== '' ? fieldState.price : 'Price, $'}</b> {el.saleprice ? (<><del>{el.saleprice}</del><b> {el.price}</b></>) : el.price}
              <Link to='/specificbook'>
                <button onClick={(e) => bookInfo(e)} className='view-btn button'>
                  {fieldState.view && fieldState.view !== '' ? fieldState.view : 'View'}
                </button>
              </Link>
            </p>          
          </div>
        </div>
        {props.widhtblock === 1 && (
          <div className={el.art === 'width' ? 'book-conteiner-width' : 'book-conteiner'}>
            {el.shortDescription !== undefined && props.widhtblock === 1 && (
              <p className='book-text'>
                <b>
                  {fieldState.shortDescription && fieldState.shortDescription !== ''
                    ? fieldState.shortDescription
                    : 'shortDescription:'}
                </b>{' '}
                {el.shortDescription.length >= 24 && props.widhtblock !== 1 ? el.shortDescription.slice(0, 46) + '...' : el.shortDescription}
              </p>
            )}
            {el.author !== undefined && props.widhtblock === 1 && (
              <p className='book-text'>
                <b>{fieldState.author && fieldState.author !== '' ? fieldState.author : 'Author:'}</b> {el.author}
              </p>
            )}
            {el.tags1 !== undefined && el.tags1 !== '' && props.widhtblock === 1 && (
              <p className='book-text'>
                <b>{fieldState.tags1 && fieldState.tags1 !== '' ? fieldState.tags1 : 'Tags 1:'}</b> {el.tags1}
              </p>
            )}
            {el.tags2 !== undefined && el.tags2 !== '' && props.widhtblock === 1 && (
              <p className='book-text'>
                <b>{fieldState.tags2 && fieldState.tags2 !== '' ? fieldState.tags2 : 'Tags 2:'}</b> {el.tags2}
              </p>
            )}
            {el.tags3 !== undefined && el.tags3 !== '' && props.widhtblock === 1 && (
              <p className='book-text'>
                <b>{fieldState.tags3 && fieldState.tags3 !== '' ? fieldState.tags3 : 'Tags 3:'}</b> {el.tags3}
              </p>
            )}
            {el.tags4 !== undefined && el.tags4 !== '' && props.widhtblock === 1 && (
              <p className='book-text'>
                <b>{fieldState.tags4 && fieldState.tags4 !== '' ? fieldState.tags4 : 'Tags 4:'}</b> {el.tags4}
              </p>
            )}
          </div>
        )}
        
       {!props.nopriceblock && (
        <div className='book-price'>
          {/* <PriceBlock showPrice={el.saleprice ? true : false} id={el.id} /> */}
          <PriceBlock showPrice={false} id={el.id} />
        </div>
       )} 
        </div>
      </section>
    );
  });

  function bookInfo(e) {
    let data = props.book.find((el) => el.id === e.target.closest('.book').id);
    setSpecificBook(data);
   // console.log(e.target.closest('.book').id)
  }

  return <section className='book-list'>{shelf}</section>;
}


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import notFound from './img/imageNotFound.png';
// import PriceBlock from '../specific-book/PriceBlock';
// import { BooksContext } from '../../BooksContext';
// import { useContext } from 'react';
// import discont from '../cart/img/discont.png';
// import newcart from '../cart/img/new.png';
// import popular from '../cart/img/popular.png';


// export default function Shelf(props) {
//   const { setSpecificBook, fieldState } = useContext(BooksContext);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [supportsIntersectionObserver, setSupportsIntersectionObserver] = useState(false);

//   useEffect(() => {
//     if ('IntersectionObserver' in window) {
//       setSupportsIntersectionObserver(true);
//     }
//   }, []);

//   const lastBookRef = useCallback((node) => {
//     if (!node || !supportsIntersectionObserver) return;

//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         loadImages();
//         observer.unobserve(node);
//       }
//     });

//     observer.observe(node);
//   }, [supportsIntersectionObserver]);

//   const loadImages = () => {
//     const images = document.querySelectorAll('.lazy-img');
//     images.forEach((img) => {
//       const src = img.getAttribute('data-src');
//       if (src) {
//         img.src = src;
//         img.removeAttribute('data-src');
//       }
//     });
//   };

//   const shelf = props.book.map((el, index) => {
//     const images = el.imageblock.split(',');
//     const imageSource = el.image && el.image !== '' ? el.image : images[currentImageIndex];

//     return (
//       <section key={el.id} className='shelf-element'>
//         <div
//           ref={index === props.book.length - 1 ? lastBookRef : null}
//           id={el.id}
//           className={`book custom-element ${props.widhtblock === 1 ? 'widhtblock' : 'widhtblock1'}`}
//         >
//           <div className='img-container'>
//           <div className='img-conteiner'>  
//             <p className='book-id'>
//               <b>{fieldState.id && fieldState.id !== '' ? fieldState.id : 'id:'}</b>
//               {el.id}
//             </p>
//             {el.sorted === 'new' && <img src={newcart} className='art-icon' alt='New Cart' />}
//             {el.sorted === 'sale' && <img src={discont} className='art-icon' alt='Discount Cart' />}
//             {el.sorted === 'popular' && <img src={popular} className='art-icon' alt='Popular Cart' />}
//             {el.size !== undefined && el.size !== '' && (
//               <Link style={{ cursor: 'pointer' }} to='/specificbook' onClick={(e) => bookInfo(e)}>
//               <p className='book-text'>
//                 <b  className='book-size'>
//                   {fieldState.size && fieldState.size !== '' ? fieldState.size : 'Size:'}
//                   {el.sizeblock && el.sizeblock !== '' ? <b>↔️{el.size}↔️</b> : <b>{el.size}</b> }
//                 </b>
//               </p>
//               </Link>
//             )}
//             {el.color !== undefined && el.color !== '' && (
//                <Link style={{ cursor: 'pointer' }} to='/specificbook' onClick={(e) => bookInfo(e)}>
//               <p className='book-text'>
//                 <b className='book-size color-size'>
//                   {fieldState.color && fieldState.color !== '' ? fieldState.color : 'Color:'}
//                   {el.colorblock && el.colorblock !== '' ? <b>↔️{el.color}↔️</b> : <b>{el.color}</b> }
//                 </b>
//               </p>
//               </Link>
//             )}
//             <Link className='book-img' to='/specificbook' onClick={(e) => bookInfo(e)}>
//               <img
//                 data-src={imageSource}
//                 alt={el.title}
//                 className={el.art === 'width' ? 'artwidth lazy-img' : 'art lazy-img'}
//                 onError={(e) => {
//                   e.target.src = notFound;
//                 }}
//               />
//             </Link>
//           </div>
//           <div className={el.art === 'width' ? 'name-block-width' : 'name-block'}>
//             <p className='book-name'>
//               <b>{fieldState.title && fieldState.title !== '' ? fieldState.title : 'Product Name:'}</b>
//               {el.title.length >= 24 ? el.title.slice(0, 46) + '...' : el.title}
//             </p>
//             <p className='view-price'>
//               <b>{fieldState.price && fieldState.price !== '' ? fieldState.price : 'Price, $'}</b> {el.saleprice ? <del>{el.saleprice}</del> : el.price}
//               <Link to='/specificbook'>
//                 <button onClick={(e) => bookInfo(e)} className='view-btn button'>
//                   {fieldState.view && fieldState.view !== '' ? fieldState.view : 'View'}
//                 </button>
//               </Link>
//             </p>
//           </div>
//           </div>
//           {props.widhtblock === 1 && (
//             <div className={el.art === 'width' ? 'book-conteiner-width' : 'book-conteiner'}>
//               {el.shortDescription !== undefined && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>
//                     {fieldState.shortDescription && fieldState.shortDescription !== ''
//                       ? fieldState.shortDescription
//                       : 'shortDescription:'}
//                   </b>{' '}
//                   {el.shortDescription.length >= 24 && props.widhtblock !== 1 ? el.shortDescription.slice(0, 46) + '...' : el.shortDescription}
//                 </p>
//               )}
//               {el.author !== undefined && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.author && fieldState.author !== '' ? fieldState.author : 'Author:'}</b> {el.author}
//                 </p>
//               )}
//               {el.tags1 !== undefined && el.tags1 !== '' && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.tags1 && fieldState.tags1 !== '' ? fieldState.tags1 : 'Tags 1:'}</b> {el.tags1}
//                 </p>
//               )}
//               {el.tags2 !== undefined && el.tags2 !== '' && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.tags2 && fieldState.tags2 !== '' ? fieldState.tags2 : 'Tags 2:'}</b> {el.tags2}
//                 </p>
//               )}
//               {el.tags3 !== undefined && el.tags3 !== '' && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.tags3 && fieldState.tags3 !== '' ? fieldState.tags3 : 'Tags 3:'}</b> {el.tags3}
//                 </p>
//               )}
//               {el.tags4 !== undefined && el.tags4 !== '' && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.tags4 && fieldState.tags4 !== '' ? fieldState.tags4 : 'Tags 4:'}</b> {el.tags4}
//                 </p>
//               )}
//             </div>
//           )}
//           <div className='book-price'>
//             <PriceBlock showPrice={el.saleprice ? true : false} id={el.id} />
            
//           </div>
         
//         </div>
//       </section>
//     );
//   });

//   function bookInfo(e) {
//     let data = props.book.find((el) => el.id === e.target.closest('.book').id);
//     setSpecificBook(data);
//   }

//   return <section className='book-list'>{shelf}</section>;
// }





// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import notFound from './img/imageNotFound.png';
// import PriceBlock from '../specific-book/PriceBlock';
// import { BooksContext } from '../../BooksContext';
// import { useContext } from 'react';
// import discont from '../cart/img/discont.png';
// import newcart from '../cart/img/new.png';
// import popular from '../cart/img/popular.png';

// const Shelf = (props) => {
//   const { setSpecificBook, fieldState } = useContext(BooksContext);
//   const [supportsIntersectionObserver, setSupportsIntersectionObserver] = useState(false);

//   useEffect(() => {
//     if ('IntersectionObserver' in window) {
//       setSupportsIntersectionObserver(true);
//     }
//   }, []);

//   const lastBookRef = useCallback((node) => {
//     if (!node || !supportsIntersectionObserver) return;

//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         loadImages();
//         observer.unobserve(node);
//       }
//     });

//     observer.observe(node);
//   }, [supportsIntersectionObserver]);

//   const [sizeClicked, setSizeClicked] = useState({}); 
//   const [colorClicked, setColorClicked] = useState({}); 

//   const loadImages = () => {
//     const images = document.querySelectorAll('.lazy-img');
//     images.forEach((img) => {
//       const src = img.getAttribute('data-src');
//       if (src) {
//         img.src = src;
//         img.removeAttribute('data-src');
//       }
//     });
//   };

//   const bookInfo = useCallback((book) => {
//     setSpecificBook(book);
//   }, [setSpecificBook]);

//   const handleClick = useCallback((id, setTypeClicked, type) => {
//     setTypeClicked((prevState) => ({
//       ...prevState,
//       [id]: !prevState[id],
//     }));
//   }, []);

//   const showItems = useCallback((items, id, type, setTypeClicked) => {
//     const itemsList = items.split(',').map((item) => {
//       const [itemId, itemValue] = item.split(':');
//       return { id: itemId, value: itemValue };
//     });

//     return (
//       <ul className='no-markers'>
//         {itemsList.map(({ id, value }) => (
//           <li className='selected' key={id}>
//             <Link to='/specificbook' onClick={() => bookInfo(props.book.find((book) => book.id === id))}>
//               {fieldState[type] && fieldState[type] !== '' ? fieldState[type] : `${type}:`} {value}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     );
//   }, [props.book, fieldState, bookInfo]);

//   const shelf = props.book.map((el, index) => {
//     const images = el.imageblock.split(',');
//     const imageSource = el.image && el.image !== '' ? el.image : images[0];

//     return (
//       <section key={el.id} className='shelf-element'>
//         <div
//           ref={index === props.book.length - 1 ? lastBookRef : null}
//           id={el.id}
//           className={`book custom-element ${props.widhtblock === 1 ? 'widhtblock' : 'widhtblock1'}`}
//         >
//           <div className='img-container'>
//             <div className='img-conteiner'>
//               <p className='book-id'>
//                 <b>{fieldState.id && fieldState.id !== '' ? fieldState.id : 'id:'}</b>
//                 {el.id}
//               </p>
//               {el.sorted === 'new' && <img src={newcart} className='art-icon' alt='New Cart' />}
//               {el.sorted === 'sale' && <img src={discont} className='art-icon' alt='Discount Cart' />}
//               {el.sorted === 'popular' && <img src={popular} className='art-icon' alt='Popular Cart' />}

//               {el.size && el.size !== '' && (
//                 <b className='book-size' onClick={() => handleClick(el.id, setSizeClicked, 'size')}>
//                   {sizeClicked[el.id] && el.sizeblock !== '' ? showItems(el.sizeblock, el.id, 'size', setSizeClicked) : el.sizeblock !== '' ? <b style={{ cursor: 'pointer' }}>◀️{fieldState.size && fieldState.size !== '' ? fieldState.size : 'Size:'} {el.size}▶️</b> : <b>{fieldState.size && fieldState.size !== '' ? fieldState.size : 'Size:'} {el.size}</b>}
//                 </b>
//               )}

//               {el.color && el.color !== '' && (
//                 <b className='book-size color-size' onClick={() => handleClick(el.id, setColorClicked, 'color')}>
//                   {colorClicked[el.id] && el.colorblock !== '' ? showItems(el.colorblock, el.id, 'color', setColorClicked) : el.colorblock !== '' ? <b style={{ cursor: 'pointer' }}>◀️{fieldState.color && fieldState.color !== '' ? fieldState.color : 'Color:'} {el.color}▶️</b> : <b>{fieldState.color && fieldState.color !== '' ? fieldState.color : 'Color:'} {el.color}</b>}
//                 </b>
//               )}

//               <Link className='book-img' to='/specificbook' onClick={() => bookInfo(el)}>
//                 <img
//                   data-src={imageSource}
//                   alt={el.title}
//                   className={el.art === 'width' ? 'artwidth lazy-img' : 'art lazy-img'}
//                   onError={(e) => {
//                     e.target.src = notFound;
//                   }}
//                   // loading="lazy"
//                 />
//               </Link>
//             </div>
//             <div className={el.art === 'width' ? 'name-block-width' : 'name-block'}>
//               <p className='book-name'>
//                 <b>{fieldState.title && fieldState.title !== '' ? fieldState.title : 'Product Name:'}</b>
//                 {el.title.length >= 24 ? el.title.slice(0, 46) + '...' : el.title}
//               </p>
//               <p className='view-price'>
//                 <b>{fieldState.price && fieldState.price !== '' ? fieldState.price : 'Price, $'}</b> {el.saleprice ? <del>{el.saleprice}</del> : el.price}
//                 <Link to='/specificbook'>
//                   <button onClick={() => bookInfo(el)} className='view-btn button'>
//                     {fieldState.view && fieldState.view !== '' ? fieldState.view : 'View'}
//                   </button>
//                 </Link>
//               </p>
//             </div>
//           </div>
//           {props.widhtblock === 1 && (
//             <div className={el.art === 'width' ? 'book-conteiner-width' : 'book-conteiner'}>
//               {el.shortDescription !== undefined && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>
//                     {fieldState.shortDescription && fieldState.shortDescription !== ''
//                       ? fieldState.shortDescription
//                       : 'shortDescription:'}
//                   </b>{' '}
//                   {el.shortDescription.length >= 24 && props.widhtblock !== 1 ? el.shortDescription.slice(0, 46) + '...' : el.shortDescription}
//                 </p>
//               )}
//               {el.author !== undefined && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.author && fieldState.author !== '' ? fieldState.author : 'Author:'}</b> {el.author}
//                 </p>
//               )}
//               {[el.tags1, el.tags2, el.tags3, el.tags4].map((tag, index) => (
//                 tag !== undefined && tag !== '' && props.widhtblock === 1 && (
//                   <p className='book-text' key={index}>
//                     <b>{fieldState[`tags${index + 1}`] && fieldState[`tags${index + 1}`] !== '' ? fieldState[`tags${index + 1}`] : `Tags ${index + 1}:`}</b> {tag}
//                   </p>
//                 )
//               ))}
//             </div>
//           )}
//           <div className='book-price'>
//             <PriceBlock showPrice={el.saleprice ? true : false} id={el.id} />
//           </div>
//         </div>
//       </section>
//     );
//   });

//   return <section className='book-list'>{shelf}</section>;
// };

// export default Shelf;




// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import notFound from './img/imageNotFound.png';
// import PriceBlock from '../specific-book/PriceBlock';
// import { BooksContext } from '../../BooksContext';
// import { useContext } from 'react';
// import discont from '../cart/img/discont.png';
// import newcart from '../cart/img/new.png';
// import popular from '../cart/img/popular.png';

// export default function Shelf(props) {
//   const { setSpecificBook, fieldState } = useContext(BooksContext);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [supportsIntersectionObserver, setSupportsIntersectionObserver] = useState(false);
//   const [sizeClicked, setSizeClicked] = useState({}); 

//   const [colorClicked, setColorClicked] = useState({});

//   useEffect(() => {
//     if ('IntersectionObserver' in window) {
//       setSupportsIntersectionObserver(true);
//     }
//   }, []);

//   const lastBookRef = useCallback((node) => {
//     if (!node || !supportsIntersectionObserver) return;

//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         loadImages();
//         observer.unobserve(node);
//       }
//     });

//     observer.observe(node);
//   }, [supportsIntersectionObserver]);

 

//   const loadImages = () => {
//     const images = document.querySelectorAll('.lazy-img');
//     images.forEach((img) => {
//       const src = img.getAttribute('data-src');
//       if (src) {
//         img.src = src;
//         img.removeAttribute('data-src');
//       }
//     });
//   };

//   const bookInfo = (book) => {
//     setSpecificBook(book);
//   };

//   const showSizes = (sizeblock) => {
//     const sizes = sizeblock.split(',').map(item => {
//       const [id, size] = item.split(':');
//       return { id, size };
//     });

//     return (
     
//       <ul className='no-markers'>
//         {sizes.map(({ id, size }) => (
//           <li className='selected' key={id}>
//             <Link to='/specificbook' onClick={() => bookInfo(props.book.find(book => book.id === id))}>{fieldState.size && fieldState.size !== '' ? fieldState.size : 'Size:'}{size}</Link>
//           </li>
//         ))}
//       </ul>
     
//     );
//   };

  
//   const showColor = (sizeblock) => {
//     const sizes = sizeblock.split(',').map(item => {
//       const [id, size] = item.split(':');
//       return { id, size };
//     });

//     return (
     
//       <ul className='no-markers'>
//         {sizes.map(({ id, size }) => (
//           <li className='selected' key={id}>
//             <Link to='/specificbook' onClick={() => bookInfo(props.book.find(book => book.id === id))}>{fieldState.color && fieldState.color !== '' ? fieldState.color : 'Color:'}{size}</Link>
//           </li>
//         ))}
//       </ul>
     
//     );
//   };
  
  
//   const handleClickSize = (id) => {
//     setSizeClicked(prevState => ({
//       ...prevState,
//       [id]: !prevState[id] 
//     }));
//   };

//   const handleClickColor = (id) => {
//     setColorClicked(prevState => ({
//       ...prevState,
//       [id]: !prevState[id] 
//     }));
//   };



//   const shelf = props.book.map((el, index) => {
//     const images = el.imageblock.split(',');
//     const imageSource = el.image && el.image !== '' ? el.image : images[currentImageIndex];

//     return (
//       <section key={el.id} className='shelf-element'>
//         <div
//           ref={index === props.book.length - 1 ? lastBookRef : null}
//           id={el.id}
//           className={`book custom-element ${props.widhtblock === 1 ? 'widhtblock' : 'widhtblock1'}`}
//         >
//           <div className='img-container'>
//             <div className='img-conteiner'>  
//               <p className='book-id'>
//                 <b>{fieldState.id && fieldState.id !== '' ? fieldState.id : 'id:'}</b>
//                 {el.id}
//               </p>
//               {el.sorted === 'new' && <img src={newcart} className='art-icon' alt='New Cart' />}
//               {el.sorted === 'sale' && <img src={discont} className='art-icon' alt='Discount Cart' />}
//               {el.sorted === 'popular' && <img src={popular} className='art-icon' alt='Popular Cart' />}
             
//               {el.size && el.size !==""&&(
//                 <b className='book-size' onClick={() => handleClickSize(el.id)}>
               
//                 {sizeClicked[el.id] && el.sizeblock !== '' ? showSizes(el.sizeblock) : el.sizeblock !== '' ? <b style={{ cursor: 'pointer' }}>◀️{fieldState.size && fieldState.size !== '' ? fieldState.size : 'Size:'} {el.size}▶️</b> :  <b>{fieldState.size && fieldState.size !== '' ? fieldState.size : 'Size:'} {el.size}</b>}
//               </b>
//               )}

//               {el.color && el.color !==""&&(
//                 <b className='book-size color-size' onClick={() => handleClickColor(el.id)}>
               
//                 {colorClicked[el.id] && el.colorblock !== '' ? showColor(el.colorblock) : el.colorblock !== '' ? <b style={{ cursor: 'pointer' }}>◀️{fieldState.color && fieldState.color !== '' ? fieldState.color : 'Color:'} {el.color}▶️</b> :  <b>{fieldState.color && fieldState.color !== '' ? fieldState.color : 'Color:'} {el.color}</b>}
//               </b>
//               )}


             
//               <Link className='book-img' to='/specificbook' onClick={() => bookInfo(el)}>
//                 <img
//                   data-src={imageSource}
//                   alt={el.title}
//                   className={el.art === 'width' ? 'artwidth lazy-img' : 'art lazy-img'}
//                   onError={(e) => {
//                     e.target.src = notFound;
//                   }}
//                   // loading="lazy"
//                 />
//               </Link>
//             </div>
//             <div className={el.art === 'width' ? 'name-block-width' : 'name-block'}>
//               <p className='book-name'>
//                 <b>{fieldState.title && fieldState.title !== '' ? fieldState.title : 'Product Name:'}</b>
//                 {el.title.length >= 24 ? el.title.slice(0, 46) + '...' : el.title}
//               </p>
//               <p className='view-price'>
//                 <b>{fieldState.price && fieldState.price !== '' ? fieldState.price : 'Price, $'}</b> {el.saleprice ? <del>{el.saleprice}</del> : el.price}
//                 <Link to='/specificbook'>
//                   <button onClick={() => bookInfo(el)} className='view-btn button'>
//                     {fieldState.view && fieldState.view !== '' ? fieldState.view : 'View'}
//                   </button>
//                 </Link>
//               </p>
//             </div>
//           </div>
//           {props.widhtblock === 1 && (
//             <div className={el.art === 'width' ? 'book-conteiner-width' : 'book-conteiner'}>
//               {el.shortDescription !== undefined && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>
//                     {fieldState.shortDescription && fieldState.shortDescription !== ''
//                       ? fieldState.shortDescription
//                       : 'shortDescription:'}
//                   </b>{' '}
//                   {el.shortDescription.length >= 24 && props.widhtblock !== 1 ? el.shortDescription.slice(0, 46) + '...' : el.shortDescription}
//                 </p>
//               )}
//               {el.author !== undefined && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.author && fieldState.author !== '' ? fieldState.author : 'Author:'}</b> {el.author}
//                 </p>
//               )}
//               {el.tags1 !== undefined && el.tags1 !== '' && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.tags1 && fieldState.tags1 !== '' ? fieldState.tags1 : 'Tags 1:'}</b> {el.tags1}
//                 </p>
//               )}
//               {el.tags2 !== undefined && el.tags2 !== '' && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.tags2 && fieldState.tags2 !== '' ? fieldState.tags2 : 'Tags 2:'}</b> {el.tags2}
//                 </p>
//               )}
//               {el.tags3 !== undefined && el.tags3 !== '' && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.tags3 && fieldState.tags3 !== '' ? fieldState.tags3 : 'Tags 3:'}</b> {el.tags3}
//                 </p>
//               )}
//               {el.tags4 !== undefined && el.tags4 !== '' && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.tags4 && fieldState.tags4 !== '' ? fieldState.tags4 : 'Tags 4:'}</b> {el.tags4}
//                 </p>
//               )}
//             </div>
//           )}
//           <div className='book-price'>
//             <PriceBlock showPrice={el.saleprice ? true : false} id={el.id} />
//           </div>
//         </div>
//       </section>
//     );
//   });

//   return <section className='book-list'>{shelf}</section>;
// }



// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import notFound from './img/imageNotFound.png';
// import PriceBlock from '../specific-book/PriceBlock';
// import { BooksContext } from '../../BooksContext';
// import { useContext } from 'react';
// import discont from '../cart/img/discont.png';
// import newcart from '../cart/img/new.png';
// import popular from '../cart/img/popular.png';

// export default function Shelf(props) {
//   const { setSpecificBook, fieldState } = useContext(BooksContext);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [supportsIntersectionObserver, setSupportsIntersectionObserver] = useState(false);

//   useEffect(() => {
//     if ('IntersectionObserver' in window) {
//       setSupportsIntersectionObserver(true);
//     }
//   }, []);

//   const lastBookRef = useCallback((node) => {
//     if (!node || !supportsIntersectionObserver) return;

//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         loadImages();
//         observer.unobserve(node);
//       }
//     });

//     observer.observe(node);
//   }, [supportsIntersectionObserver]);

//   const loadImages = () => {
//     const images = document.querySelectorAll('.lazy-img');
//     images.forEach((img) => {
//       const src = img.getAttribute('data-src');
//       if (src) {
//         img.src = src;
//         img.removeAttribute('data-src');
//       }
//     });
//   };

//   const shelf = props.book.map((el, index) => {
//     const images = el.imageblock.split(',');
//     const imageSource = el.image && el.image !== '' ? el.image : images[currentImageIndex];

//     return (
//       <section key={el.id} className='shelf-element'>
//         <div
//           ref={index === props.book.length - 1 ? lastBookRef : null}
//           id={el.id}
//           className={`book custom-element ${props.widhtblock === 1 ? 'widhtblock' : 'widhtblock1'}`}
//         >
//           <div className='img-container'>
//           <div className='img-conteiner'>  
//             <p className='book-id'>
//               <b>{fieldState.id && fieldState.id !== '' ? fieldState.id : 'id:'}</b>
//               {el.id}
//             </p>
//             {el.sorted === 'new' && <img src={newcart} className='art-icon' alt='New Cart' />}
//             {el.sorted === 'sale' && <img src={discont} className='art-icon' alt='Discount Cart' />}
//             {el.sorted === 'popular' && <img src={popular} className='art-icon' alt='Popular Cart' />}
//             {el.size !== undefined && el.size !== '' && (
//               <p className='book-text'>
//                 <b className='book-size'>{fieldState.size && fieldState.size !== '' ? fieldState.size : 'Size:'}
//                 {el.size}
//                 </b>
//               </p>
//             )}
//             {el.color !== undefined && el.color !== '' && (
//               <p className='book-text'>
//                 <b className='book-size color-size'>
//                   {fieldState.color && fieldState.color !== '' ? fieldState.color : 'Color:'}
//                   {el.color}
//                 </b>
//               </p>
//             )}
//             <Link className='book-img' to='/specificbook' onClick={(e) => bookInfo(e)}>
//               <img
//                 data-src={imageSource}
//                 alt={el.title}
//                 className={el.art === 'width' ? 'artwidth lazy-img' : 'art lazy-img'}
//                 onError={(e) => {
//                   e.target.src = notFound;
//                 }}
//               />
//             </Link>
//           </div>
//           <div className={el.art === 'width' ? 'name-block-width' : 'name-block'}>
//             <p className='book-name'>
//               <b>{fieldState.title && fieldState.title !== '' ? fieldState.title : 'Product Name:'}</b>
//               {el.title.length >= 24 ? el.title.slice(0, 46) + '...' : el.title}
//             </p>
//             <p className='view-price'>
//               <b>{fieldState.price && fieldState.price !== '' ? fieldState.price : 'Price, $'}</b> {el.saleprice ? <del>{el.saleprice}</del> : el.price}
//               <Link to='/specificbook'>
//                 <button onClick={(e) => bookInfo(e)} className='view-btn button'>
//                   {fieldState.view && fieldState.view !== '' ? fieldState.view : 'View'}
//                 </button>
//               </Link>
//             </p>
//           </div>
//           </div>
//           {props.widhtblock === 1 && (
//             <div className={el.art === 'width' ? 'book-conteiner-width' : 'book-conteiner'}>
//               {el.shortDescription !== undefined && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>
//                     {fieldState.shortDescription && fieldState.shortDescription !== ''
//                       ? fieldState.shortDescription
//                       : 'shortDescription:'}
//                   </b>{' '}
//                   {el.shortDescription.length >= 24 && props.widhtblock !== 1 ? el.shortDescription.slice(0, 46) + '...' : el.shortDescription}
//                 </p>
//               )}
//               {el.author !== undefined && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.author && fieldState.author !== '' ? fieldState.author : 'Author:'}</b> {el.author}
//                 </p>
//               )}
//               {el.tags1 !== undefined && el.tags1 !== '' && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.tags1 && fieldState.tags1 !== '' ? fieldState.tags1 : 'Tags 1:'}</b> {el.tags1}
//                 </p>
//               )}
//               {el.tags2 !== undefined && el.tags2 !== '' && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.tags2 && fieldState.tags2 !== '' ? fieldState.tags2 : 'Tags 2:'}</b> {el.tags2}
//                 </p>
//               )}
//               {el.tags3 !== undefined && el.tags3 !== '' && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.tags3 && fieldState.tags3 !== '' ? fieldState.tags3 : 'Tags 3:'}</b> {el.tags3}
//                 </p>
//               )}
//               {el.tags4 !== undefined && el.tags4 !== '' && props.widhtblock === 1 && (
//                 <p className='book-text'>
//                   <b>{fieldState.tags4 && fieldState.tags4 !== '' ? fieldState.tags4 : 'Tags 4:'}</b> {el.tags4}
//                 </p>
//               )}
//             </div>
//           )}
//           <div className='book-price'>
//             <PriceBlock showPrice={el.saleprice ? true : false} id={el.id} />
//           </div>
//         </div>
//       </section>
//     );
//   });

//   function bookInfo(e) {
//     let data = props.book.find((el) => el.id === e.target.closest('.book').id);
//     //localStorage.setItem('specificBook', JSON.stringify(data));
//     setSpecificBook(data);
//   }

//   return <section className='book-list'>{shelf}</section>;
// }



// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import notFound from './img/imageNotFound.png';
// import PriceBlock from '../specific-book/PriceBlock';
// import { BooksContext } from '../../BooksContext';
// import { useContext } from 'react';
// import discont from '../cart/img/discont.png';
// import newcart from '../cart/img/new.png';
// import popular from '../cart/img/popular.png';


// export default function Shelf(props, widthblock) {
//   const { setSpecificBook, fieldState } = useContext(BooksContext);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//  console.log(fieldState)
//  console.log(fieldState)


//   const shelf = props.book.map((el) => {
//     const images = el.imageblock.split(',');


   

//     return (
//       <section key={el.id} className='shelf-element'>
//         <div id={el.id} className={`book custom-element ${props.widhtblock === 1 ? "widhtblock" : 'widhtblock1'}`}>
//           <div className='img-conteiner'>
//           <div className='img-conteiner'>
//             <p className="book-id">
//               <b>{fieldState.id && fieldState.id!=="" ? fieldState.id :  "id:"}{el.id}</b>
//             </p>
//             {el.sorted === 'new' && 
//               <img src={newcart} className="art-icon" alt="New Cart" />
//             }  
//             {el.sorted === 'sale' && 
//               <img src={discont} className="art-icon" alt="Discount Cart" /> 
//             }
//             {el.sorted === 'popular' && 
//               <img src={popular} className="art-icon" alt="Popular Cart" /> 
//             }
//             {el.size !== undefined && el.size !=="" &&  (
//               <p className="book-text">
//                 <b className="book-size">{fieldState.size && fieldState.size!=="" ? fieldState.size :  "Size:"}{el.size}</b>
//               </p>
//             )}
//             {el.color !== undefined && el.color !=="" &&  (
//               <p className="book-text">
//                 <b className="book-size color-size">{fieldState.color && fieldState.color!=="" ? fieldState.color :  "Color:"}{el.color}</b>
//               </p>
//             )}





//             <Link className="book-img" to="/specificbook" onClick={(e) => bookInfo(e)}>
            
        
//               <img
//                 src={images[currentImageIndex]}
//                 alt={el.title}
//                 className={el.art === "width" ? 'artwidth' : 'art'}
//                 onError={(e) => {
//                   e.target.src = notFound;
//                 }}
//               />
//             </Link>
//           </div> 
//           <div className= {el.art === "width" ? 'name-block-width': 'name-block'} >
//           <p className="book-name">
//               <b> {fieldState.title && fieldState.title!=="" ? fieldState.title :  "Product Name:"}  </b>
//               {el.title.length >= 24 ? el.title.slice(0, 46) + '...' : el.title}
//             </p>
//             <p className="view-price">
            
//               <b> {fieldState.price && fieldState.price!=="" ? fieldState.price :  "Price, $"} </b>{' '}
//               {el.saleprice ? <del>{el.saleprice}</del> : el.price}
         
//             <Link to="/specificbook">
//               <button onClick={(e) => bookInfo(e)} className="view-btn button">
//               {fieldState.view && fieldState.view!=="" ? fieldState.view :  "View"}
//               </button>
//             </Link>
//             </p>
// </div>
// </div>
//          {props.widhtblock === 1 && (
//           <div className= {el.art === "width" ? 'book-conteiner-width': 'book-conteiner'} >
           
//             {el.shortDescription !== undefined && props.widhtblock === 1 && (
//               <p className="book-text">
//                 <b>{fieldState.shortDescription && fieldState.shortDescription!=="" ? fieldState.shortDescription :  "shortDescription:"} </b>
//                 {el.shortDescription.length >= 24 && props.widhtblock !== 1 ? el.shortDescription.slice(0, 46) + '...' : el.shortDescription}
//               </p>
//             )}
//             {el.author !== undefined && props.widhtblock === 1 &&(
//               <p className="book-text">
//                 <b>{fieldState.author && fieldState.author!=="" ? fieldState.author :  "Author:"} </b>  
//                 {el.author}
//               </p>
//             )}
//             {el.tags1 !== undefined && el.tags1 !== "" && props.widhtblock === 1 && (
//               <p className="book-text">
//                 <b>{fieldState.tags1 && fieldState.tags1!=="" ? fieldState.tags1 :  "Tags 1:"} </b>
//                 {el.tags1}
//               </p>
//             )}
//             {el.tags2 !== undefined && el.tags2 !== "" && props.widhtblock === 1 && (
//               <p className="book-text">
//                 <b>{fieldState.tags2 && fieldState.tags2!=="" ? fieldState.tags2 :  "Tags 2:"}</b>
//                 {el.tags2}
//               </p>
//             )}
//             {el.tags3 !== undefined && el.tags3 !== "" && props.widhtblock === 1 && (
//               <p className="book-text">
//                 <b>{fieldState.tags3 && fieldState.tags3!=="" ? fieldState.tags3 :  "Tags 3:"}</b>
//                 {el.tags3}
//               </p>
//             )}
//             {el.tags4 !== undefined && el.tags4 !== "" && props.widhtblock === 1 && (
//               <p className="book-text">
//                 <b>{fieldState.tags4 && fieldState.tags4!=="" ? fieldState.tags4 :  "Tags 4:"}</b>
//                 {el.tags4}
//               </p>
//             )}
          
//           </div>
//           )}
//           <div className="book-price">
//             <PriceBlock showPrice={el.saleprice ? true : false} id={el.id} />
          
        

//           </div>
//         </div>
//       </section>
//     );
//   });

//   function bookInfo(e) {
//     let data = props.book.find((el) => el.id === e.target.closest('.book').id);
//     //localStorage.setItem('specificBook', JSON.stringify(data));
//     setSpecificBook(data);
//   }

//   return <section className="book-list">{shelf}</section>;
// }



// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import notFound from './img/imageNotFound.png';
// import PriceBlock from '../specific-book/PriceBlock';
// import { BooksContext } from '../../BooksContext';
// import { useContext } from 'react';
// import discont from '../cart/img/discont.png';
// import newcart from '../cart/img/new.png';
// import popular from '../cart/img/popular.png';


// export default function Shelf(props, widhtblock) {
//   const { setSpecificBook } = useContext(BooksContext);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const shelf = props.book.map((el) => {
//     const images = el.imageblock.split(',');

//     return (
//       <section>
      
//       <div id={el.id} className={`book custom-element ${props.widhtblock === 1 ? "widhtblock": 'widhtblock1'}`} key={el.id}>
      
//       <div className='img-conteiner'>   
//       <p className="book-id">
//           <b>id:{el.id}</b>
        
//           </p>
          
//           {el.sorted === 'new' && 
//           <img src={newcart} className="art-icon"/>
//     }  
//           {el.sorted === 'sale' && 
//             <img src={discont} className="art-icon"/> 
          
//     }
    
//     {el.sorted === 'popular' && 
//             <img src={popular} className="art-icon"/> }  
         
      
       
        
//         {el.size !== undefined && el.size !=="" &&  (
//           <p className="book-text">
//             <b className="book-size">Size:{el.size}</b>
           
//           </p>
//         )}
        
//         {el.color !== undefined && el.color !=="" &&  (
//           <p className="book-text">
//             <b className="book-size color-size">Color:{el.color}</b>
           
//           </p>
//         )}


//         <Link className="book-img" to="/specificbook" onClick={(e) => bookInfo(e)}>
//           <img
//            src= {images[currentImageIndex]}
          
//             alt="myFace"
//             onError={(e) => {
//               e.target.src = notFound;
//             }}
//           />
//         </Link>
//       </div> 
//         <div className="book-conteiner">
//         <p className="book-text">
//           <b>Book name: </b>
//           {el.title.length >= 24 ? el.title.slice(0, 46) + '...' : el.title}
//         </p>
        
//         {el.shortDescription !== undefined && (
//           <p className="book-text">
//             <b>shortDescription: </b>
//             {el.shortDescription.length >= 24 &&props.widhtblock !==1? el.shortDescription.slice(0, 46) + '...' : el.shortDescription}
//           </p>
//         )}

//         {el.author !== undefined && (
//           <p className="book-text">
//             <b>Book author: </b>
//             {el.author}
//           </p>
//         )}
 

       
//          {el.tags1!==undefined&&el.tags1!=="" &&props.widhtblock === 1&&(
//           <p className="book-text">
//             <b>Book tags1:</b>
//             {el.tags1}
//           </p>
//            )}
//           {el.tags2!==undefined&&el.tags2!==""&&props.widhtblock === 1&&(
//           <p className="book-text">
//             <b>Book tags2:</b>
//             {el.tags2}
//           </p>
//            )}
       
//         </div>
        
//         <div className="book-price book-conteiner">
//           <p className="book-text">
//             <b>Price, $</b>{' '}
//             {el.saleprice ? <del>{el.saleprice}</del> : el.price}
//           </p>
//           <Link to="/specificbook">
//             <button onClick={(e) => bookInfo(e)} className="view-btn button">
//               View
//             </button>
//           </Link>
//         </div>
//         <div className="book-conteiner">
//         <PriceBlock showPrice={el.saleprice ? true : false} id={el.id} />
//         </div>
//       </div>
//       </section>
    
//     );
   
//   });
 
//   function bookInfo(e) {
//     let data = props.book.find((el) => el.id === e.target.closest('.book').id);
  
   
  
 
//     localStorage.setItem('specificBook', JSON.stringify(data));
//     setSpecificBook(data);
//   }

//   return <section className="book-list">{shelf}</section>;
// }



// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import notFound from './img/imageNotFound.png';
// import PriceBlock from '../specific-book/PriceBlock';
// import { BooksContext } from '../../BooksContext';
// import { useContext } from 'react';

// export default function Shelf(props) {
//   const { setSpecificBook } = useContext(BooksContext);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const shelf = props.book.map((el) => {
//     const images = el.image.split(',');
// console.log(images[currentImageIndex])
// console.log(images)
// console.log(el.image)
//     return (
//       <div id={el.id} className="book custom-element" key={el.id}>
//         <p className="book-text">
//           <b>id: </b>
//           {el.id}
//           {el.sorted === 'new' && <span className="badge">New</span>}
//           {el.sorted === 'sale' && <span className="badge">Sale</span>}
//         </p>
//         <Link className="book-img" to="/specificbook" onClick={(e) => bookInfo(e, images)}>
//           <img
//             src={el.image.split(',')[currentImageIndex] === undefined ? (el.image !== '' ? el.image : notFound) : el.image.split(',')[currentImageIndex]}
//             alt="myFace"
//             onError={(e) => {
//               e.target.src = notFound;
//             }}
//           />
//         </Link>
//         <p className="book-text">
//           <b>Book name: </b>
//           {el.title.length >= 24 ? el.title.slice(0, 24) + '...' : el.title}
//         </p>
//         {el.author !== undefined && (
//           <p className="book-text">
//             <b>Book author: </b>
//             {el.author}
//           </p>
//         )}
//         {el.size !== undefined && (
//           <p>
//             <b>Size:</b>
//             {el.size}
//           </p>
//         )}

//         <div className="book-buttons">
//           {el.image.split(',').length > 1 &&
//            el.image.split(',').map((_, index) => (
//               <button key={index} onClick={() => setCurrentImageIndex(index)}>
//                 Image {index + 1}
//               </button>
//             ))}
//         </div>

//         <div className="book-price">
//           <p className="book-text">
//             <b>Price, $</b>{' '}
//             {el.saleprice ? <del>{el.saleprice}</del> : el.price}
//           </p>
//           <Link to="/specificbook">
//             <button onClick={(e) => bookInfo(e, images)} className="view-btn button">
//               View
//             </button>
//           </Link>
//         </div>

//         <PriceBlock showPrice={el.saleprice ? true : false} id={el.id} />
//       </div>
//     );
//   });

//   function bookInfo(e, images) {
//     let data = props.book.find((el) => el.id === e.target.closest('.book').id);
//    // data.images = images; // Include all images in the data
  
//     // Store only the first image in localStorage
//     //data.image = images[0];
  
//     localStorage.setItem('specificBook', JSON.stringify(data));
//     setSpecificBook(data);
//   }

//   return <section className="book-list">{shelf}</section>;
// }


// import React from 'react';
// import { Link } from 'react-router-dom';
// import notFound from './img/imageNotFound.png';
// import PriceBlock from '../specific-book/PriceBlock';
// import { BooksContext } from '../../BooksContext';
// import { useContext } from 'react';

// export default function Shelf(props) {
//   const {  setSpecificBook } = useContext(BooksContext);
//   const shelf = props.book.map((el) => (
//     <div id={el.id} className="book custom-element" key={el.id}>
//       <p className="book-text">
//         <b>id: </b>
//         {el.id}
//         {el.sorted === 'new' && <span className="badge">New</span>}
//         {el.sorted === 'sale' && <span className="badge">Sale</span>}
//       </p>
//       <Link className="book-img" to="/specificbook" onClick={(e) => bookInfo(e)}>
//         <img
//           src={el.image === '' ? notFound : el.image}
//           alt="myFace"
//           onError={(e) => {
//             e.target.src = notFound;
//           }}
//         />
//       </Link>
//       <p className="book-text">
//         <b>Book name: </b>
//         {el.title.length >= 24 ? el.title.slice(0, 24) + '...' : el.title}
//       </p>
//       {el.author!==undefined &&(
//       <p className="book-text">
//         <b>Book author: </b>
//         {el.author}
//       </p>
//        )}
//       {el.size!==undefined &&(
//             <p>
//             <b>Size:</b>
//             {el.size}
//           </p>
//           )}
      
      
      
//       <div className="book-price">
//         <p className="book-text">
//           <b>Price, $</b>{' '}
//           {el.saleprice ? (
//             <del>{el.saleprice}</del>
//           ) : (
//             el.price
//           )}
//         </p>
//         <Link to="/specificbook">
//           <button onClick={(e) => bookInfo(e)} className="view-btn button">
//             View
//           </button>
//         </Link>
//       </div>

//       <PriceBlock showPrice={el.saleprice ? true : false} id={el.id} />
//     </div>
//   ));

//   function bookInfo(e) {
//     let data = props.book.find((el) => el.id === e.target.closest('.book').id);
//     localStorage.setItem('specificBook', JSON.stringify(data));
//     setSpecificBook(data);
//   }

//   return <section className="book-list">{shelf}</section>;
// }



// import React from 'react';
// import { Link } from 'react-router-dom';
// import notFound from './img/imageNotFound.png';
// import PriceBlock from '../specific-book/PriceBlock';


// export default function Shelf(props) {
   
//   // Використано метод `map` для створення масиву елементів компонента `div.book`
//   const shelf = props.book.map((el) => (
//     <div
//       id={el.id}
//       className="book custom-element"
//       key={el.id}
//     >
//       <p className="book-text">
//         <b>id: </b>
//         {el.id}
//       </p>
//       {/* Використовуємо `<Link>` для навігації на сторінку `specificbook` */}
//       <Link className="book-img " to="/specificbook" onClick={(e) => bookInfo(e)}>
//         <img src={el.image === '' ? notFound : el.image} alt="myFace"
//         onError={(e) => {
//           e.target.src = notFound; // Установить изображение по умолчанию в случае ошибки
//         }}
//         />
//       </Link>
//       <p className="book-text">
//         <b>Book name: </b>
//         {el.title.length >= 24 ? el.title.slice(0, 24) + '...' : el.title}
//       </p>
//       <p className="book-text">
//         <b>Book author: </b>
//         {el.author}
//       </p>
//       <div className="book-price">
//         <p className="book-text">
//           <b>Price, $</b> {el.price}
//         </p>
//         {/* Використовуємо `<Link>` для навігації на сторінку `specificbook` */}
//         <Link to="/specificbook">
//           <button onClick={(e) => bookInfo(e)} className="view-btn button">
//             View
//           </button>
//         </Link>
//       </div>

//       <PriceBlock showPrice={false}  id={el.id}  />
     
//     </div>
//   ));

//   // Функція, що зберігає об'єкт `data` в `localStorage`
//   function bookInfo(e) {
//     // Знаходимо відповідний об'єкт `data` в масиві `props.book` за допомогою id
//     let data = props.book.find((el) => el.id === (e.target.closest('.book').id));
//     console.log(data)
//     // Зберігаємо об'єкт `data` в `localStorage`
//     localStorage.setItem('specificBook', JSON.stringify(data));
//   }

//   return (
//     <section className="book-list">
//       {/* Відображаємо елементи книжок */}
//       {shelf}
//     </section>
//   );
// }