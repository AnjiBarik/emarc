import React from 'react';
import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';
import PriceBlock from '../specific-book/PriceBlock';
import { BooksContext } from '../../BooksContext';
import { useContext } from 'react';
import discont from '../cart/img/discont.png';
import newcart from '../cart/img/new.png';
import popular from '../cart/img/popular.png';

export default function Shelf(props) {
  const { setSpecificBook, fieldState } = useContext(BooksContext);  
  const currentImageIndex = 0

  const publicUrl = `${window.location.origin}${window.location.pathname}`;
  const folder = 'img';

  const shelf = props.book.map((el, index) => {
  

const imagespublic = el.imageblockpublic && el.imageblockpublic!=="" ? el.imageblockpublic.split(',').map(element => `${process.env.PUBLIC_URL}/img/${element}` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${element}`):el.imageblock.split(',');
const imageSource = el.imagepublic && el.imagepublic!=="" ?`${process.env.PUBLIC_URL}/img/${el.imagepublic}` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${el.imagepublic}`:el.image && el.image !== '' ? el.image : imagespublic[currentImageIndex] ;
console.log(imagespublic)

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
          id={el.id}
          className={`book custom-element ${props.widhtblock === 1 ? 'widhtblock' : 'widhtblock1'}`}
        >
          <div className='img-container'>
         
          <div className='img-conteiner'>  
          <Link
              style={{ cursor: 'pointer' }}
              to='/specificbook'
              onClick={() => bookInfo(el.id)}
          >
            <p className='book-id'>
              <b>{fieldState.id && fieldState.id !== '' ? fieldState.id : 'id:'}</b>
              {el.id}
            </p>
           
            {el.sorted === 'new' && <img src={newcart} className='art-icon' alt='New Cart' />}
            {el.sorted === 'sale' && <img src={discont} className='art-icon' alt='Discount Cart' />}
            {el.sorted === 'popular' && <img src={popular} className='art-icon' alt='Popular Cart' />}
           
            {el.size !== undefined && el.size !== '' && (
             
                <p className='book-text'>
                  <b className='book-size'>
                    {fieldState.size && fieldState.size !== '' ? fieldState.size : 'Size:'}
                    {el.sizeblock && el.sizeblock !== '' ? <b>{'<'}{el.size}{'>'}</b> : <b>{el.size}</b>}
                  </b>
                </p>
            
            )}
            {el.color !== undefined && el.color !== '' && (
             
                <p className='book-text'>
                  <b className='book-size color-size'>
                    {fieldState.color && fieldState.color !== '' ? fieldState.color : 'Color:'}
                    {el.colorblock && el.colorblock !== '' ? (
                      <>
                        <b>{'<'}{el.color}{'>'}</b>
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
              
            )}
           
            <LazyImage
                  src={imageSource}
                  alt={el.title}                 
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
                          
          </Link>
          </div>
         
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
              <Link
                style={{ cursor: 'pointer' }}
                to='/specificbook'
                onClick={() => bookInfo(el.id)}
              >
                <button  className='view-btn button'>
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
          
          <PriceBlock showPrice={false} id={el.id} />
        </div>
       )} 
        </div>
      </section>
    );
  });


  const bookInfo = (id) => {    
    // const bookData = props.book.find((book) => book.id === id);
    // setSpecificBook(bookData);    
    setSpecificBook({id});   
  };

  return <section className='book-list'>{shelf}</section>;
}