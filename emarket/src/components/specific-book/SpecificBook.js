import React, { useState, useEffect, useContext } from 'react';
import './specificBook.css';
import PriceBlock from './PriceBlock';
import ScrollToTopButton from '../book-list/ScrollToTopButton';
import { Link, useNavigate } from 'react-router-dom';
import { BooksContext } from '../../BooksContext';
import discont from '../cart/img/discont.png';
import newcart from '../cart/img/new.png';
import back from '../cart/img/back.png';
import carticon from '../cart/img/carticon.png';
import popular from '../cart/img/popular.png';
import zoomout from '../cart/img/zoomout.png';
import zoomin from '../cart/img/zoomin.png';
import notFound from '../cart/img/notFound.gif';
import InfoModal from './InfoModal';


export default function SpecificBook() {
  const { books, specificBook, theme, fieldState } = useContext(BooksContext);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    size,
    sizeblock,
    color,
    colorblock
  } = specificBook;

  
  
  
  
  // if (books.length === 0 || specificBook.length === 0) {
  //   window.location.href = '/';
  // }

  //const [selectedSize, setSelectedSize] = useState(size);
  //const [selectedBook, setSelectedBook] = useState(books.find(book => book.id === id));
  //const [selectedColor, setSelectedColor] = useState(color);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedBook, setSelectedBook] = useState(() => books.find(book => book.id === id));
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState({});
  const [colors, setColors] = useState({});
  const [colorRGB, setColorRGB] = useState({});

  useEffect(() => {
    const processImages = () => {
      if (selectedBook) {
        if (selectedBook.imageblockpublic && selectedBook.imageblockpublic !== '') {
          setImages(
            selectedBook.imageblockpublic.split(',').map(element => `${process.env.PUBLIC_URL}/img/${element}`)
          );
        } else if (selectedBook.imageblock && selectedBook.imageblock !== '') {
          setImages(selectedBook.imageblock.split(','));
        } else {
          setImages([]); // Handle the case where there are no image sources
        }
      }
    };

    processImages();
  }, [selectedBook]);
  
  // if (books.length === 0 || specificBook.length === 0) {
  //   window.location.href = '/';
  // }

  // let images = [];

  // if (selectedBook) {
  //   if (selectedBook.imageblockpublic && selectedBook.imageblockpublic !== '') {
  //     images = selectedBook.imageblockpublic.split(',').map(element => `${process.env.PUBLIC_URL}/img/${element}`);
  //   } else if (selectedBook.imageblock && selectedBook.imageblock !=="") {
  //     images = selectedBook.imageblock.split(',');
  //   }
  // }
  

  // let images = [];
  // if (selectedBook && selectedBook.imageblock) {
  //   images = selectedBook.imageblock.split(',');

  // }
console.log(images)

useEffect(() => {
  const parseBlock = (block) => {
    if (!block || block === "") {
      return {};
    }

    return block.split(',').reduce((acc, pair) => {
      const [itemId, value] = pair.trim().split(':');
      if (itemId && value) {
        acc[itemId] = value;
      }
      return acc;
    }, {});
  };

  setSizes(parseBlock(sizeblock));
  setColors(parseBlock(colorblock));
}, [sizeblock, colorblock]);




// const sizes = sizeblock && sizeblock!==""
// ? sizeblock.split(',').reduce((acc, pair) => {
//     const [itemId, sizeValue] = pair.trim().split(':');
//     if (itemId && sizeValue) {
//       acc[itemId] = sizeValue;
//     }
//     return acc;
//   }, {})
// : {};

  // const sizes = {};

  // if (sizeblock) {
  //   for (const pair of sizeblock.split(',')) {
  //     const [itemId, sizeValue] = pair.trim().split(':');
  //     if (itemId && sizeValue) {
  //       sizes[itemId] = sizeValue;
  //     }
  //   }
  // }

console.log(sizes)

  // const parseSizeBlock = (sizeBlock) => {
  //   const sizes = {};
  //   if (sizeBlock) {
  //     const sizePairs = sizeBlock.split(',');
  //     sizePairs.forEach(pair => {
  //       const [itemId, sizeValue] = pair.split(':');
  //       if (itemId && sizeValue) {
  //         sizes[itemId.trim()] = sizeValue.trim();
  //       }
  //     });
  //   }
  //   return sizes;
  // };

  // const sizes = parseSizeBlock(sizeblock);

  const handleSizeClick = (itemId) => {
    //setSelectedSize(itemId);
    setCurrentImageIndex(0);

    const newSelectedBook = books.find(book => book.id === itemId);
    setSelectedBook(newSelectedBook);
  };

  // const colors = colorblock && colorblock!==""
  //     ? colorblock.split(',').reduce((acc, pair) => {
  //       const [itemId, colorValue] = pair.trim().split(':');
  //       if (itemId && colorValue) {
  //         acc[itemId] = colorValue;
  //       }
  //       return acc;
  //     }, {})
  //   : {};

console.log(colors)
  // const parseColorBlock = (colorBlock) => {
  //   const colors = {};
  //   if (colorBlock) {
  //     const colorPairs = colorBlock.split(',');
  //     colorPairs.forEach(pair => {
  //       const [itemId, colorValue] = pair.split(':');
  //       if (itemId && colorValue) {
  //         colors[itemId.trim()] = colorValue.trim();
  //       }
  //     });
  //   }
  //   return colors;
  // };

  // const colors = parseColorBlock(colorblock);

  const handleColorClick = (itemId) => {
    //setSelectedColor(itemId);
    setCurrentImageIndex(0);

    const newSelectedBook = books.find(book => book.id === itemId);
    setSelectedBook(newSelectedBook);
  };

  // const [isFullscreen, setIsFullscreen] = useState(false);

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  //const navigate = useNavigate();

 

  useEffect(() => {
    const parseColorBlock = (colorblock) => {
      if (!colorblock) {
        return {};
      }

      return colorblock.split(';')
        .map(colorItem => colorItem.split(':'))
        .reduce((acc, [colorName, rgb]) => ({
          ...acc,
          [colorName.trim()]: rgb.trim().slice(1, -1),
        }), {});
    };

    setColorRGB(parseColorBlock(fieldState.colorblock));
  }, [fieldState.colorblock]);

  
  console.log(colorRGB)
  // const colorRGB = fieldState.colorblock
  // ? fieldState.colorblock
  //     .split(';')
  //     .map(colorItem => colorItem.split(':'))
  //     .reduce((acc, [colorName, rgb]) => ({ ...acc, [colorName.trim()]: rgb.trim().slice(1, -1) }), {})
  // : {};

  useEffect(() => {
    if (books.length === 0) {
      navigate('/');
    }
  }, [books, navigate]);

  if (books.length === 0) {
    return null;
  }

  return (
    <section className={theme}>
      <section className="filters">
        <button className='sort-button selected' onClick={() => navigate(-1)}>
          <img src={back} className="back-button selected" alt="Back to main page" />
        </button>
        <Link to="/cart">
          <img src={carticon} className="back-button selected" alt="Go to cart" />
        </Link>
      </section>
      {selectedBook && (
        <section className="book-page">
          <section className="about">
            <div className="book-text">
              <b>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</b>
              {selectedBook.id}
              <div className={isFullscreen ? 'fullscreen-overlay' : 'img-conteiner'}>
                {selectedBook.sorted === 'new' &&
                  <img src={newcart} className="art-icon" alt="New" />
                }
                {selectedBook.sorted === 'sale' &&
                  <img src={discont} className="art-icon" alt="Discount" />
                }
                {selectedBook.sorted === 'popular' &&
                  <img src={popular} className="art-icon" alt="Popular" />
                }
                <img
                  src={images[currentImageIndex]}
                  alt={selectedBook.title}
                  onError={(e) => { e.target.src = notFound; }}
                  onClick={openFullscreen}
                  className={isFullscreen ? 'fullscreen-image' : (selectedBook.art === "width" ? 'artwidth' : 'art')}
                />
                {!isFullscreen && (
                  <button onClick={openFullscreen} className="zoom-button">
                    <img src={zoomin} alt="Zoom" className='zoom-img' />
                  </button>
                )}
                {isFullscreen && (
                  <button onClick={closeFullscreen} className="close-button">
                    <img src={zoomout} alt="Zoom Out" className='zoom-img' />
                  </button>
                )}
              </div>
            </div>
            <div className="book-buttons">
              {selectedBook.imageblock.split(',').length > 1 &&
                selectedBook.imageblock.split(',').map((_, index) => (
                  <button className={`img-icon ${currentImageIndex === index ? 'selected-img-icon' : ''}`} key={index} onClick={() => setCurrentImageIndex(index)}>
                    <img
                      src={images[index]}
                      className='artmini'
                      alt={selectedBook.title}
                      onError={(e) => {
                        e.target.src = notFound;
                      }}
                    />
                  </button>
                ))}
            </div>
            <div className="size-buttons">
              {sizeblock !== undefined && size !== '' && (<b>{fieldState.size && fieldState.size !== "" ? fieldState.size : "Size:"}</b>)}
              {size !== '' &&
                Object.entries(sizes).map(([itemId, sizeValue]) => (
                  <button
                    key={sizeValue}
                    className={`size-button ${selectedBook.id === itemId ? 'selected' : ''}`}
                    onClick={() => handleSizeClick(itemId)}
                  >
                    {sizeValue}
                  </button>
                ))}
              {sizeblock === "" && (<b>{size}</b>)}
              {fieldState.sizeblockinfo && fieldState.sizeblockinfo !== "" && (<InfoModal text={fieldState.sizeblockinfo} />)}
            </div>
            <div className="size-buttons">
              {colorblock !== undefined && color !== '' && (<b>{fieldState.color && fieldState.color !== "" ? fieldState.color : "Color:"}</b>)}
              {color !== '' &&
                Object.entries(colors).map(([itemId, colorValue]) => (
                  <button
                    key={colorValue}
                    className={`size-button ${selectedBook.id === itemId ? 'selected' : ''}`}
                    onClick={() => handleColorClick(itemId)}
                  >
                    {colorValue}
                    {colorRGB[colorValue.trim()] && (
                        <span
                        className='circle' 
                        style={{ backgroundColor: `rgb(${colorRGB[colorValue.trim()]})` }}
                      ></span>
                      )}
                  </button>
                ))}
              {colorblock === "" && (<b>{color}
               {colorRGB[color.trim()] && (
               <span
               className='circle' 
               style={{ backgroundColor: `rgb(${colorRGB[color.trim()]})` }}
               ></span>
               )}
               </b>
              )}
            </div>
            <p className='cart-text'>
              <b>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Product Name:"}</b>
              {selectedBook.title}
            </p>
            <PriceBlock showPrice={true} id={selectedBook.id} />
          
           </section>
          <section className="about">
            {selectedBook.author !== undefined && selectedBook.author !== "" && (
              <p>
                <b>{fieldState.author && fieldState.author !== "" ? fieldState.author : "Author:"}</b>
                {selectedBook.author}
              </p>
            )}
            {selectedBook.tags1 !== undefined && selectedBook.tags1 !== "" && (
              <p>
                <b>{fieldState.tags1 && fieldState.tags1 !== "" ? fieldState.tags1 : "Tags 1:"}</b>
                {selectedBook.tags1}
              </p>
            )}
            {selectedBook.tags2 !== undefined && selectedBook.tags2 !== "" && (
              <p>
                <b>{fieldState.tags2 && fieldState.tags2 !== "" ? fieldState.tags2 : "Tags 2:"}</b>
                {selectedBook.tags2}
              </p>
            )}
            {selectedBook.tags3 !== undefined && selectedBook.tags3 !== "" && (
              <p>
                <b>{fieldState.tags3 && fieldState.tags3 !== "" ? fieldState.tags3 : "Tags 3:"}</b>
                {selectedBook.tags3}
              </p>
            )}
            {selectedBook.tags4 !== undefined && selectedBook.tags4 !== "" && (
              <p>
                <b>{fieldState.tags4 && fieldState.tags4 !== "" ? fieldState.tags4 : "Tags 4:"}</b>
                {selectedBook.tags4}
              </p>
            )}

            {selectedBook.shortDescription !== undefined && selectedBook.shortDescription !== "" && (
              <p className='cart-text'>
                <b> {fieldState.shortDescription && fieldState.shortDescription !== "" ? fieldState.shortDescription : "shortDescription:"} </b>
                {selectedBook.shortDescription}
              </p>
            )}
            {(selectedBook.tags5 || selectedBook.tags6 || selectedBook.tags7 || selectedBook.tags8) && (
              <section className="about">
                <div className='size-buttons'>
                <b>{fieldState.additionalTags && fieldState.additionalTags !== "" ? fieldState.additionalTags : "Additional Tags:"}</b>
                {fieldState.additionalTagsinfo && fieldState.additionalTagsinfo !== "" && (<InfoModal text={fieldState.additionalTagsinfo} />)}
                </div>
                <table>
                  <tbody>
                    {selectedBook.tags5 && selectedBook.tags5 !== "" && (
                      <tr>
                        <td><b>{fieldState.tags5 && fieldState.tags5 !== "" ? fieldState.tags5 : "Tags 5:"}</b></td>
                        <td>{selectedBook.tags5}</td>
                      </tr>
                    )}
                    {selectedBook.tags6 && selectedBook.tags6 !== "" && (
                      <tr>
                        <td><b>{fieldState.tags6 && fieldState.tags6 !== "" ? fieldState.tags6 : "Tags 6:"}</b></td>
                        <td>{selectedBook.tags6}</td>
                      </tr>
                    )}
                    {selectedBook.tags7 && selectedBook.tags7 !== "" && (
                      <tr>
                        <td><b>{fieldState.tags7 && fieldState.tags7 !== "" ? fieldState.tags7 : "Tags 7:"}</b></td>
                        <td>{selectedBook.tags7}</td>
                      </tr>
                    )}
                    {selectedBook.tags8 && selectedBook.tags8 !== "" && (
                      <tr>
                        <td><b>{fieldState.tags8 && fieldState.tags8 !== "" ? fieldState.tags8 : "Tags 8:"}</b></td>
                        <td>{selectedBook.tags8}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            )}
          </section >
          {selectedBook.description !== undefined && selectedBook.description !== "" && (
            <section className="about">
              <p className='cart-text'>
                <b>{fieldState.description && fieldState.description !== "" ? fieldState.description : "Description:"} </b>
                {selectedBook.description}
              </p>
            </section>
          )}
        </section>
      )}
      <ScrollToTopButton />
    
    </section>
  );
}


// import React, { useState, useContext } from 'react';
// import './specificBook.css';
// import PriceBlock from './PriceBlock';
// import ScrollToTopButton from '../book-list/ScrollToTopButton';
// // import notFound from '../book-list/img/imageNotFound.png';
// import { Link , useNavigate} from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import discont from '../cart/img/discont.png';
// import newcart from '../cart/img/new.png';
// import back from '../cart/img/back.png';
// import carticon from '../cart/img/carticon.png';
// import popular from '../cart/img/popular.png';
// import zoomout from '../cart/img/zoomout.png';
// import zoomin from '../cart/img/zoomin.png';
// import notFound from '../cart/img/notFound.gif';


// export default function SpecificBook() {
  
//   const { books, specificBook, theme, fieldState } = useContext(BooksContext);

//   const {
//     id,
//     size,
//     sizeblock,
//     color,
//     colorblock
//   } = specificBook;


//   const [selectedSize, setSelectedSize] = useState(size);
//   const [selectedBook, setSelectedBook] = useState(books.find(book => book.id === id));
//   const [selectedColor, setSelectedColor] = useState(color);
  
//   if ( books.length === 0 || specificBook.length === 0) {
   
//     window.location.href = '/';
//   }

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   
//   let images;
//   if (selectedBook && selectedBook.imageblock) {
//     images = selectedBook.imageblock.split(',');
//   } else {
   
//     images = []; 
//   }
  
  

//   const parseSizeBlock = (sizeBlock) => {
//     const sizes = {};
//     if (sizeBlock) {
//       const sizePairs = sizeBlock.split(',');
//       sizePairs.forEach(pair => {
//         const [itemId, sizeValue] = pair.split(':');
//         if (itemId && sizeValue) {
//           sizes[itemId.trim()] = sizeValue.trim();
//         }
//       });
//     }
//     return sizes;
//   };

//   const sizes = parseSizeBlock(sizeblock);

//   const handleSizeClick = (itemId) => {
//     setSelectedSize(itemId);
//     setCurrentImageIndex(0)
    
//     const newSelectedBook = books.find(book => book.id === itemId);
//     setSelectedBook(newSelectedBook);
//   };

//   const parseColorBlock = (colorBlock) => {
//     const colors = {};
//     if (colorBlock) {
//       const colorPairs = colorBlock.split(',');
//       colorPairs.forEach(pair => {
//         const [itemId, colorValue] = pair.split(':');
//         if (itemId && colorValue) {
//           colors[itemId.trim()] = colorValue.trim();
//         }
//       });
//     }
//     return colors;
//   };

//   const colors = parseColorBlock(colorblock);

//   const handleColorClick = (itemId) => {
//     setSelectedColor(itemId);
//     setCurrentImageIndex(0)
    
//     const newSelectedBook = books.find(book => book.id === itemId);
//     setSelectedBook(newSelectedBook);
//   };


 
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const openFullscreen = () => {
//     setIsFullscreen(true);
//   };

//   const closeFullscreen = () => {
//     setIsFullscreen(false);
//   };

//   const navigate = useNavigate();

//   return (
//     <section className={theme}>
//       <section className="filters">
//       <button className='sort-button selected' onClick={() => navigate(-1)}>
//       <img src={back} className="back-button selected" alt="Back to main page" />
//       </button>
      
      
//       <Link to="/cart" >
//         <img src={carticon} className="back-button selected" alt="Go to cart" />
//       </Link>
//       </section>
//       {selectedBook && (   
//         <section className="book-page">
//           <section className="about">
//             <div className="book-text">
//               <b>{fieldState.id && fieldState.id!=="" ? fieldState.id :  "id:"}</b>
//               {selectedBook.id}
//               {/* <div className='img-container'>      */}
//               <div className={isFullscreen ? 'fullscreen-overlay' : 'img-conteiner'}> 
//                 {selectedBook.sorted === 'new' && 
//                   <img src={newcart} className="art-icon" alt="New" />
//                 }
//                 {selectedBook.sorted === 'sale' && 
//                   <img src={discont} className="art-icon" alt="Discount" />
//                 }
//                 {selectedBook.sorted === 'popular' && 
//                   <img src={popular} className="art-icon" alt="Popular" />
//                 }  
            
              
             
//       <img
//         src={images[currentImageIndex]}
//         alt={selectedBook.title}
//         onError={(e) => { e.target.src = notFound; }}
//         onClick={openFullscreen}
        
//         className={isFullscreen ? 'fullscreen-image' : (selectedBook.art === "width" ? 'artwidth' : 'art')}

//       />
//       {!isFullscreen && (
//         <button onClick={openFullscreen} className="zoom-button">
//           <img src={zoomin} alt="Zoom" className='zoom-img'/>
//           </button>
//       )}
//       {isFullscreen && (
//         <button onClick={closeFullscreen} className="close-button">
//            <img src={zoomout} alt="Zoom Out" className='zoom-img'/>
//         </button>
//       )}
//     </div>


             
//             </div> 
//             <div className="book-buttons">
//               {selectedBook.imageblock.split(',').length > 1 &&
//                 selectedBook.imageblock.split(',').map((_, index) => (
//                   <button className={`img-icon ${currentImageIndex === index ? 'selected-img-icon' : ''}`} key={index} onClick={() => setCurrentImageIndex(index)}>
//                     <img
//                       src={images[index]}
//                       className='artmini'
//                       alt={selectedBook.title}
//                       onError={(e) => {
//                         e.target.src = notFound;
//                       }}
//                     />
//                   </button>
//                 ))}
//             </div>
//             <div className="size-buttons">
//               {sizeblock !== undefined && size !== '' &&(<b>{fieldState.size && fieldState.size!=="" ? fieldState.size :  "Size:"}</b>)}
//               {size !== '' &&
//                 Object.entries(sizes).map(([itemId, sizeValue]) => (
//                   <button
//                     key={sizeValue}
//                     className={`size-button ${selectedBook.id === itemId ? 'selected' : ''}`}
//                     onClick={() => handleSizeClick(itemId)}
//                   >
//                     {sizeValue}
//                   </button>
//                 ))}
//               {sizeblock === "" && (<b>{size}</b>)}
//             </div>
//             <div className="size-buttons">
//               {colorblock !== undefined && color !== '' &&(<b>{fieldState.color && fieldState.color!=="" ? fieldState.color :  "Color:"}</b>)}
//               {color !== '' &&
//                 Object.entries(colors).map(([itemId, colorValue]) => (
//                   <button
//                     key={colorValue}
//                     className={`size-button ${selectedBook.id === itemId ? 'selected' : ''}`}
//                     onClick={() => handleColorClick(itemId)}
//                   >
//                     {colorValue}
//                   </button>
//                 ))}
//               {colorblock === "" && (<b>{color}</b>)}
//             </div>
//             <p className='cart-text'>
//               <b>{fieldState.title && fieldState.title!=="" ? fieldState.title :  "Product Name:"}</b>
//               {selectedBook.title}
//             </p>
//             <PriceBlock showPrice={true} id={selectedBook.id} />
//           </section>
//           <section className="about">
//             {selectedBook.author !== undefined && selectedBook.author !== "" &&(
//               <p>
//                 <b>{fieldState.author && fieldState.author!=="" ? fieldState.author :  "Author:"}</b>
//                 {selectedBook.author}
//               </p>
//             )}
//             {selectedBook.tags1 !== undefined && selectedBook.tags1 !== "" &&(
//               <p>
//                 <b>{fieldState.tags1 && fieldState.tags1!=="" ? fieldState.tags1 :  "Tags 1:"}</b>
//                 {selectedBook.tags1}
//               </p>
//             )}
//             {selectedBook.tags2 !== undefined && selectedBook.tags2 !== "" &&(
//               <p>
//                 <b>{fieldState.tags2 && fieldState.tags2!=="" ? fieldState.tags2 :  "Tags 2:"}</b>
//                 {selectedBook.tags2}
//               </p>
//             )}
//             {selectedBook.tags3 !== undefined && selectedBook.tags3 !== "" &&(
//               <p>
//                 <b>{fieldState.tags3 && fieldState.tags3!=="" ? fieldState.tags3 :  "Tags 3:"}</b>
//                 {selectedBook.tags3}
//               </p>
//             )}
//             {selectedBook.tags4 !== undefined && selectedBook.tags4 !== "" &&(
//               <p>
//                 <b>{fieldState.tags4 && fieldState.tags4!=="" ? fieldState.tags4 :  "Tags 4:"}</b>
//                 {selectedBook.tags4}
//               </p>
//             )}

//             {selectedBook.shortDescription !== undefined && selectedBook.shortDescription !== "" &&(
//             <p className='cart-text'>
//               <b> {fieldState.shortDescription && fieldState.shortDescription!=="" ? fieldState.shortDescription :  "shortDescription:"} </b>
//               {selectedBook.shortDescription}
//             </p>
//             )}
//             {(selectedBook.tags5 || selectedBook.tags6 || selectedBook.tags7 || selectedBook.tags8) && (
//               <section className="about">
//                 <b>{fieldState.additionalTags && fieldState.additionalTags!=="" ? fieldState.additionalTags :  "Additional Tags:"}</b>
//                 <table>
//                   <tbody>
//                     {selectedBook.tags5 && selectedBook.tags5 !== "" && (
//                       <tr>
//                         <td><b>{fieldState.tags5 && fieldState.tags5!=="" ? fieldState.tags5 :  "Tags 5:"}</b></td>
//                         <td>{selectedBook.tags5}</td>
//                       </tr>
//                     )}
//                     {selectedBook.tags6 && selectedBook.tags6 !== "" && (
//                       <tr>
//                         <td><b>{fieldState.tags6 && fieldState.tags6!=="" ? fieldState.tags6 :  "Tags 6:"}</b></td>
//                         <td>{selectedBook.tags6}</td>
//                       </tr>
//                     )}
//                     {selectedBook.tags7 && selectedBook.tags7 !== "" && (
//                       <tr>
//                         <td><b>{fieldState.tags7 && fieldState.tags7!=="" ? fieldState.tags7 :  "Tags 7:"}</b></td>
//                         <td>{selectedBook.tags7}</td>
//                       </tr>
//                     )}
//                     {selectedBook.tags8 && selectedBook.tags8 !== "" && (
//                       <tr>
//                         <td><b>{fieldState.tags8 && fieldState.tags8!=="" ? fieldState.tags8 :  "Tags 8:"}</b></td>
//                         <td>{selectedBook.tags8}</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </section>
//             )}
//           </section >
//           {selectedBook.description !== undefined && selectedBook.description !== "" &&(
//           <section className="about">
            
//             <p className='cart-text'>
//               <b>{fieldState.description && fieldState.description!=="" ? fieldState.description :  "Description:"} </b>
//               {selectedBook.description}
//             </p>
//           </section>
//           )}
//         </section>
//       )}
//       <ScrollToTopButton />
//     </section>
//   );
// }



// import React, { useState, useContext } from 'react';
// import './specificBook.css';
// import PriceBlock from './PriceBlock';
// import ScrollToTopButton from '../book-list/ScrollToTopButton';
// import notFound from '../book-list/img/imageNotFound.png';
// import { Link } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';
// import discont from '../cart/img/discont.png';
// import newcart from '../cart/img/new.png';
// import back from '../cart/img/back.png';
// import carticon from '../cart/img/carticon.png';
// import popular from '../cart/img/popular.png';

// export default function SpecificBook() {
  
//   const { books, specificBook, theme } = useContext(BooksContext);

//   const {
//     id,
//     size,
//     sizeblock,
//     color,
//     colorblock
//   } = specificBook;


// const [selectedSize, setSelectedSize] = useState(size);
//   const [selectedBook, setSelectedBook] = useState(books.find(book => book.id === id));
//   const [selectedColor, setSelectedColor] = useState(color);
  
//   if ( books.length === 0||specificBook.length === 0) {
   
//     window.location.href = '/';
//   }

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   
//   let images;
//   if (selectedBook && selectedBook.imageblock) {
//     images = selectedBook.imageblock.split(',');
//   } else {
   
//     images = []; 
//   }
  
  

//   const parseSizeBlock = (sizeBlock) => {
//     const sizes = {};
//     if (sizeBlock) {
//       const sizePairs = sizeBlock.split(',');
//       sizePairs.forEach(pair => {
//         const [itemId, sizeValue] = pair.split(':');
//         if (itemId && sizeValue) {
//           sizes[itemId.trim()] = sizeValue.trim();
//         }
//       });
//     }
//     return sizes;
//   };

//   const sizes = parseSizeBlock(sizeblock);

//   const handleSizeClick = (itemId) => {
//     setSelectedSize(itemId);
//     setCurrentImageIndex(0)
    
//     const newSelectedBook = books.find(book => book.id === itemId);
//     setSelectedBook(newSelectedBook);
//   };

//   const parseColorBlock = (colorBlock) => {
//     const colors = {};
//     if (colorBlock) {
//       const colorPairs = colorBlock.split(',');
//       colorPairs.forEach(pair => {
//         const [itemId, colorValue] = pair.split(':');
//         if (itemId && colorValue) {
//           colors[itemId.trim()] = colorValue.trim();
//         }
//       });
//     }
//     return colors;
//   };

//   const colors = parseColorBlock(colorblock);

//   const handleColorClick = (itemId) => {
//     setSelectedColor(itemId);
//     setCurrentImageIndex(0)
    
//     const newSelectedBook = books.find(book => book.id === itemId);
//     setSelectedBook(newSelectedBook);
//   };


//   return (
//     <section className={theme}>
//       <Link to="/" >
    
//         <img src={back} className="back-button selected"/>
     
//       </Link>
//       <Link to="/cart" >
        
//       <img src={carticon} className="back-button selected"/>
      
//       </Link>
      
//       {selectedBook&& (   
//       <section className="book-page">
       
//         <section className="about">
//         <div className="book-text">
//           <b>id: </b>
//           {selectedBook.id}

//           <div className='img-conteiner'>     
//           {selectedBook.sorted === 'new' && 
//           <img src={newcart} className="art-icon"/>
//    }
//           {selectedBook.sorted === 'sale' && 
//             <img src={discont} className="art-icon"/> }

// {selectedBook.sorted === 'popular' && 
//             <img src={popular} className="art-icon"/> }  

// </div> 

    
// <img
//            src= {images[currentImageIndex]} className='art'
//             alt="myFace"
//             onError={(e) => {
//               e.target.src = notFound;
//             }}
//           />
// </div> 

//  <div className="book-buttons">
//           {selectedBook.imageblock.split(',').length > 1 &&
//            selectedBook.imageblock.split(',').map((_, index) => (
//                <button className={`img-icon ${currentImageIndex === index ? 'selected' : ''}`} key={index} onClick={() => setCurrentImageIndex(index)}>
//                   <img
//            src= {images[index]} className='artmini'
//              alt="myFace"
//             onError={(e) => {
//               e.target.src = notFound;
//             }}
//           />
                      
//               </button>
//             ))}
//         </div>
       
//         <div className="size-buttons">
//           {sizeblock !==undefined &&size !== '' &&(<b>Size</b>)}
//           {size !== '' &&
//             Object.entries(sizes).map(([itemId, sizeValue]) => (
              
//               <button
//                 key={sizeValue}
//                 className={`size-button ${selectedBook.id === itemId ? 'selected' : ''}`}
//                 onClick={() => handleSizeClick(itemId)}
//               >
//                 {sizeValue}
//               </button>
//             ))}
//             {sizeblock===""&&(<b>{size}</b>)}
//         </div>
       

//         <div className="size-buttons">
//           {colorblock !==undefined &&color !== '' &&(<b>Color:</b>)}
//           {color !== '' &&
//             Object.entries(colors).map(([itemId, colorValue]) => (
              
//               <button
//                 key={colorValue}
//                 className={`size-button ${selectedBook.id === itemId ? 'selected' : ''}`}
//                 onClick={() => handleColorClick(itemId)}
//               >
//                 {colorValue}
                
//               </button>
//             ))}
//             {colorblock===""&&(<b>{color}</b>)}
//         </div>
        
        
//         <p className='cart-text'>
//             <b>Book name: </b>
//             {selectedBook.title}
//           </p>
//           <PriceBlock showPrice={true} id={selectedBook.id} />
//         </section>
         
//         <section className="about">
        
//         {selectedBook.author!==undefined&&selectedBook.author!=="" &&(
//           <p>
//             <b>Book author:</b>
//             {selectedBook.author}
//           </p>
//            )}

//           {selectedBook.tags1!==undefined&&selectedBook.tags1!=="" &&(
//           <p>
//             <b>Book tags1:</b>
//             {selectedBook.tags1}
//           </p>
//            )}
          
//           {selectedBook.tags2!==undefined&&selectedBook.tags2!=="" &&(
//           <p>
//             <b>Book tags2:</b>
//             {selectedBook.tags2}
//           </p>
//            )}
//           {selectedBook.size!==undefined && selectedBook.size!=="" &&(
//             <p>
//             <b>Size:</b>
//             {selectedBook.size}
//           </p>
//           )}
//           <p className='cart-text'>
//             <b> shortDescription: </b>
//             {selectedBook.shortDescription}
//           </p>
          
//           {
//   (selectedBook.tags3 || selectedBook.tags4 || selectedBook.tags5 || selectedBook.tags6) && (
//     <section className="about">
//       <b>Additional Tags:</b>
//       <table>
//         <tbody>
//           {selectedBook.tags3 && selectedBook.tags3 !== "" && (
//             <tr>
//               <td><b>Tag 3:</b></td>
//               <td>{selectedBook.tags3}</td>
//             </tr>
//           )}
//           {selectedBook.tags4 && selectedBook.tags4 !== "" && (
//             <tr>
//               <td><b>Tag 4:</b></td>
//               <td>{selectedBook.tags4}</td>
//             </tr>
//           )}
//           {selectedBook.tags5 && selectedBook.tags5 !== "" && (
//             <tr>
//               <td><b>Tag 5:</b></td>
//               <td>{selectedBook.tags5}</td>
//             </tr>
//           )}
//           {selectedBook.tags6 && selectedBook.tags6 !== "" && (
//             <tr>
//               <td><b>Tag 6:</b></td>
//               <td>{selectedBook.tags6}</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </section>
//   )
// }




//         </section >
//         <section className="about">
       
//         <p className='cart-text'>
//               <b>Description: </b>
//               {selectedBook.description}
//             </p>

      
//       </section>
     
//       </section>
//         )}
//       <ScrollToTopButton />
//     </section>
//   );
// }



// import React, { useState } from 'react';
// import './specificBook.css';
// import PriceBlock from './PriceBlock';
// import ScrollToTopButton from '../book-list/ScrollToTopButton';
// import notFound from '../book-list/img/imageNotFound.png';
// import { Link } from 'react-router-dom';
// import { BooksContext } from '../../BooksContext';


// export default function SpecificBook() {
//   const {
//     id,
//     author,
//     image,
//     title,
//     description,
//     shortDescription,
//     tags1,
//     tags2,
//     sorted,
//     size,
//     sizeblock
//   } = JSON.parse(localStorage.specificBook);
//   const { books } = useContext(BooksContext);
//   const [selectedSize, setSelectedSize] = useState(size);

//   const parseSizeBlock = (sizeBlock) => {
//     const sizes = {};
//     if (sizeBlock) {
//       const sizePairs = sizeBlock.split(',');
//       sizePairs.forEach(pair => {
//         const [itemId, sizeValue] = pair.split(':');
//         if (itemId && sizeValue) {
//           sizes[itemId.trim()] = sizeValue.trim();
//         }
//       });
//     }
//     return sizes;
//   };

//   const sizes = parseSizeBlock(sizeblock);

//   const handleSizeClick = (itemId) => {
//     setSelectedSize(itemId);
//     // Здесь можно добавить логику для обработки изменения размера
//   };

//   return (
//     <section className="contener">
//       <Link to="/" className="back-button">
//         <button className="purchase button custom-element">Back</button>
//       </Link>
//       <Link to="/cart" className="back-button">
//         <button className="purchase button custom-element">Cart</button>
//       </Link>
//       <section className="book-page">
//         <p className="book-text">
//           <b>id: </b>
//           {id}
//           {sorted === 'new' && <span className="badge">New</span>}
//           {sorted === 'sale' && <span className="badge">Sale</span>}
//         </p>
//         <div className="size-buttons">
//           {size !== '' &&
//             Object.entries(sizes).map(([itemId, sizeValue]) => (
//               <button
//                 key={sizeValue}
//                 className={`size-button ${selectedSize === itemId ? 'selected' : ''}`}
//                 onClick={() => handleSizeClick(itemId)}
//               >
//                 {sizeValue}
//               </button>
//             ))}
//         </div>
//         <figure>
//           <img
//             src={image === '' ? notFound : image}
//             alt={title}
//             onError={(e) => {
//               e.target.src = notFound;
//             }}
//           />
//           <figcaption>
//             <p>
//               <b>Description: </b>
//               {description}
//             </p>
//           </figcaption>
//         </figure>
//         <section className="about">
//           <p>
//             <b>Book name: </b>
//             {title}
//           </p>
//           <p>
//             <b>Book author:</b> {author}
//           </p>
//           <p>
//             <b>Book level:</b> {tags1}
//           </p>
//           <p>
//             <b>Book tags:</b>
//             {tags2}
//           </p>
//         </section>
//         <PriceBlock showPrice={true} id={id} />
//       </section>
//       <ScrollToTopButton />
//     </section>
//   );
// }




// import React from 'react';
// import './specificBook.css';
// import PriceBlock from './PriceBlock'; 
// import  ScrollToTopButton  from '../book-list/ScrollToTopButton';
// import notFound from '../book-list/img/imageNotFound.png';
// import { Link } from "react-router-dom";



// export default function SpecificBook() {

  
//   // Отримання даних про обрану книжку з localStorage
//   const { id, author,  image, title, description, shortDescription, tags1, tags2, sorted } = JSON.parse(localStorage.specificBook);

  

//   return (
//     <section className="contener">
     
     
//      <Link to="/" className="back-button">
//              <button  className="purchase button custom-element">
//                 Back
//                 </button>
//         </Link>
//         <Link to="/cart" className="back-button">
//              <button  className="purchase button custom-element">
//                 Cart
//                 </button>
//         </Link>
     
     
//       <section className="book-page">
        
//       <p className="book-text">
//         <b>id: </b>
//         {id}
//         {sorted === 'new' && <span className="badge">New</span>}
//         {sorted === 'sale' && <span className="badge">Sale</span>}
//       </p>
        
        
//         <figure>
//           <img src={image === '' ? notFound : image} alt={title}
//           onError={(e) => {
//             e.target.src = notFound; // Установить изображение по умолчанию в случае ошибки
//           }}
//           />
//           <figcaption>
//             <p><b>Description: </b>{description}</p>
//           </figcaption>
//         </figure>
//         <section className="about">
//           <p><b>Book name: </b>{title}</p>
//           <p><b>Book author:</b> {author}</p>
//           <p><b>Book level:</b> {tags1}</p>
//           <p><b>Book tags:</b>{tags2}</p>
//         </section>
//         <PriceBlock showPrice={true}  id={id}  /> {/* Використовуємо компонент PriceBlock */}
//       </section>
//       <ScrollToTopButton />
//       </section>
//   );
// }