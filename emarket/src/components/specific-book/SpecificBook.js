import React, { useState, useEffect, useContext } from 'react';
import './specificBook.css';
import PriceBlock from './PriceBlock';
import ScrollToTopButton from '../utils/ScrollToTopButton';
import { Link, useNavigate} from 'react-router-dom';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import InfoModal from './InfoModal';

export default function SpecificBook() {
  const { books, specificBook, theme, fieldState } = useContext(BooksContext);

  const {    
    notFound,
    discont,
    newcart, 
    popular,     
    back,    
    carticon,    
    zoomout,
    zoomin, } = useIcons();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate(); 
  const { id } = specificBook;  

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedBook, setSelectedBook] = useState(() => books.find(book => book.id === id));
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [colorRGB, setColorRGB] = useState({});

  const publicUrl = `${window.location.origin}${window.location.pathname}`;
  const folder = 'img';

  useEffect(() => {
    const processImages = () => {
      if (selectedBook) {
        if (selectedBook.imageblockpublic && selectedBook.imageblockpublic !== '') {
          setImages(
            selectedBook.imageblockpublic.split(',').map(element => `${process.env.PUBLIC_URL}/${folder}/${element}` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${element}`)
          );
        } else if (selectedBook.imageblock && selectedBook.imageblock !== '') {
          setImages(selectedBook.imageblock.split(','));        
        } else {
          setImages([]); // Handle the case where there are no image sources
        }
      }
    };

    processImages();
  }, [selectedBook, publicUrl]);

  useEffect(() => {
    if (selectedBook && selectedBook.length !== 0) {
      const parseBlock = (block) => {
        if (!block || block === "") {
          return [];
        }

        const pairs = block.split(',').map(pair => {
          const [itemId, value] = pair.trim().split(':');
          return { itemId, value };
        }).filter(pair => pair.itemId && pair.value);

        const selectedPair = pairs.find(pair => pair.itemId === selectedBook.id);
        const otherPairs = pairs.filter(pair => pair.itemId !== selectedBook.id);

        return selectedPair ? [selectedPair, ...otherPairs] : otherPairs;
      };

      const sizesOrdered = parseBlock(selectedBook.sizeblock);
      const colorsOrdered = parseBlock(selectedBook.colorblock);

      setSizes(sizesOrdered);
      setColors(colorsOrdered);
    }
  }, [selectedBook]);

  const handleSizeClick = (itemId) => {   
    const newSelectedBook = books.find(book => book.id === itemId);
    setSelectedBook(newSelectedBook);
  };

  const handleColorClick = (itemId) => {    
    setCurrentImageIndex(0);
    const newSelectedBook = books.find(book => book.id === itemId);
    setSelectedBook(newSelectedBook);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

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

  useEffect(() => {
    if (books.length === 0 || specificBook.length === 0) {
      navigate('/');
    }
  }, [books, specificBook, navigate]);

  if (books.length === 0) {
    return null;
  }

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };
  
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
              <span translate="no"><strong>{selectedBook.id}</strong></span>
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
                  onClick={!isFullscreen? openFullscreen:closeFullscreen}
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
                  <button className={`img-icon ${currentImageIndex === index ? 'selected-img-icon' : ''}`} key={index} onClick={() => handleImageClick(index)}>
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
            <div className="size-buttons" >
              {selectedBook.sizeblock !== undefined && selectedBook.size !== '' && (<b>{fieldState.size && fieldState.size !== "" ? fieldState.size : "Size:"}</b>)}
              {selectedBook.size !== '' && sizes.length > 0 &&
                sizes.map(({ itemId, value }) => (
                  <button
                    key={itemId}
                    className={`size-button ${selectedBook.id === itemId ? 'selected' : ''}`}
                    onClick={() => handleSizeClick(itemId)}
                  >
                  {value}
                  </button>
                ))}
              {selectedBook.sizeblock === "" && (<b>{selectedBook.size}</b>)}
              {fieldState.sizeblockinfo && fieldState.sizeblockinfo !== "" && (<InfoModal text={fieldState.sizeblockinfo} />)}
            </div>
            <div className="size-buttons">
              {selectedBook.colorblock !== undefined && selectedBook.color !== '' && (<b>{fieldState.color && fieldState.color !== "" ? fieldState.color : "Color:"}</b>)}
              {selectedBook.color !== '' && colors.length > 0 &&
                colors.map(({ itemId, value }) => (
                  <button
                    key={itemId}
                    className={`size-button ${selectedBook.id === itemId ? 'selected' : ''}`}
                    onClick={() => handleColorClick(itemId)}
                  >
                    {value}
                    {colorRGB[value.trim()] && (
                        <span
                        className='circle' 
                        style={{ backgroundColor: `rgb(${colorRGB[value.trim()]})` }}
                      ></span>
                      )}
                  </button>
                ))}
              {selectedBook.colorblock === "" && (<b className="size-button selected" >
               {selectedBook.color}
               {colorRGB[selectedBook.color.trim()] && (
               <span
               className='circle' 
               style={{ backgroundColor: `rgb(${colorRGB[selectedBook.color.trim()]})` }}
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
                <span>{selectedBook.author}</span>
              </p>
            )}
            {selectedBook.tags1 !== undefined && selectedBook.tags1 !== "" && (
              <p>
                <b>{fieldState.tags1 && fieldState.tags1 !== "" ? fieldState.tags1 : "Tags 1:"}</b>
                <span>{selectedBook.tags1}</span>
              </p>
            )}
            {selectedBook.tags2 !== undefined && selectedBook.tags2 !== "" && (
              <p>
                <b>{fieldState.tags2 && fieldState.tags2 !== "" ? fieldState.tags2 : "Tags 2:"}</b>
                <span>{selectedBook.tags2}</span>
              </p>
            )}
            {selectedBook.tags3 !== undefined && selectedBook.tags3 !== "" && (
              <p>
                <b>{fieldState.tags3 && fieldState.tags3 !== "" ? fieldState.tags3 : "Tags 3:"}</b>
                <span>{selectedBook.tags3}</span>
              </p>
            )}
            {selectedBook.tags4 !== undefined && selectedBook.tags4 !== "" && (
              <p>
                <b>{fieldState.tags4 && fieldState.tags4 !== "" ? fieldState.tags4 : "Tags 4:"}</b>
                <span>{selectedBook.tags4}</span>
              </p>
            )}

            {selectedBook.shortDescription !== undefined && selectedBook.shortDescription !== "" && (
              <p className='cart-text'>
                <b> {fieldState.shortDescription && fieldState.shortDescription !== "" ? fieldState.shortDescription : "shortDescription:"} </b>
                <span>{selectedBook.shortDescription}</span>
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
                <span>{selectedBook.description}</span>
              </p>
            </section>
          )}
        </section>
      )}
      <ScrollToTopButton />
    </section>
  );
}
