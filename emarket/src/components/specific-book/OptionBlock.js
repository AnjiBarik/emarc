import React, { useContext, useState, useEffect } from 'react';
import { BooksContext } from '../../BooksContext';
import './optionBlock.css';
import Shelf from '../book-list/Shelf';


export default function OptionBlock({ id }) {
    const { books, fieldState } = useContext(BooksContext);
    const [option, setOption] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
  

    useEffect(() => {
        const selectBook = books.find(book => book.id === id);
        if (selectBook) {
            const optionblock = selectBook.optionblock;
            if (optionblock) {
                const optionIds = optionblock.split(';').filter(Boolean);
                const filteredBooks = books.filter(book => optionIds.includes(book.id) && book.Visibility !== '0');
                //setOption(filteredBooks.map(book => ({ ...book, shelfVisible: false })));
                setOption(filteredBooks.map(book => ({ ...book })))

            }
        }
    }, [id, books]);

    useEffect(() => {
        const selectedPrices = selectedBooks.map(book => parseFloat(book.optionprice || book.price));
        const totalPrice = selectedPrices.reduce((acc, price) => acc + price, 0);
        setTotalPrice(totalPrice);
    }, [selectedBooks]);

   
    const toggleSelectBook = (book) => {
        const updatedSelectedBooks = selectedBooks.includes(book)
            ? selectedBooks.filter(selectBook => selectBook !== book)
            : [...selectedBooks, book];
        setSelectedBooks(updatedSelectedBooks);
    };

   
console.log((selectedBooks))
    return (
        <>
        <div className="option-container">
            {option.length > 0 && (
                <>
                    {selectedBooks.length > 0 && (
                        <>
                            <table>
                                <tbody>
                                    {selectedBooks.map((book, index) => (
                                        <tr key={index}>
                                            <td>{book.id}</td>
                                            <td>{book.title.length > 25 ? book.title.slice(0, 25) + '...' : book.title}</td>
                                            <td>{book.optionprice ? book.optionprice : book.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
<div>`➕Total Price: ${totalPrice}`</div>
                  
                </>
            )}
        </div>
<section className='slider-option'>
    {option && (
        <>
          {option.map(book => (                                           
            <div  onClick={() => toggleSelectBook(book)} className={`option ${selectedBooks.some(selectedBook => selectedBook.id === book.id) ? 'select' : ''}`} >
                                                    {/* {book.optionprice ? (
                                                        <div className='back-button'>
                                                         <span>{fieldState.price && fieldState.price!=="" ? fieldState.price :  "Price,$"}  </span>
                                                            <span style={{ textDecoration: 'line-through' }}>{book.price}</span>
                                                            <span>{book.optionprice}</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                        <span>{fieldState.price && fieldState.price!=="" ? fieldState.price :  "Price,$"}  </span>
                                                        <span>{book.price}</span>
                                                        </>
                                                    )} */}
             <Shelf style={{"minHeight": "10vh", "paddingBottom": "5px"}} book={option.filter(option => option.id === book.id)}  nopriceblock={true} widhtblock={1} />
          </div>                                    
          ))}
        </>
    )}
    </section>
    </>
    );
}


// import React, { useContext, useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import Shelf from '../book-list/Shelf';
// import imageNotFound from '../book-list/img/imageNotFound.png';

// export default function OptionBlock({ id }) {
//     const { books } = useContext(BooksContext);
//     const [option, setOption] = useState([]);
//     const [selectedBooks, setSelectedBooks] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [showTable, setShowTable] = useState(false);
//     const [persistedSelectedBooks, setPersistedSelectedBooks] = useState([]);

//     useEffect(() => {
//         const selectedBook = books.find(book => book.id === id);
//         if (selectedBook) {
//             const optionblock = selectedBook.optionblock;
//             if (optionblock) {
//                 const optionIds = optionblock.split(';').filter(Boolean);
//                 const filteredBooks = books.filter(book => optionIds.includes(book.id) && book.Visibility !== '0');
//                 setOption(filteredBooks.map(book => ({ ...book, shelfVisible: false })));
//             }
//         }
//     }, [id, books]);

//     useEffect(() => {
//         const selectedPrices = selectedBooks.map(book => parseFloat(book.optionprice || book.price));
//         const totalPrice = selectedPrices.reduce((acc, price) => acc + price, 0);
//         setTotalPrice(totalPrice);
//     }, [selectedBooks]);

//     useEffect(() => {
//         if (showTable) {
//             setPersistedSelectedBooks(selectedBooks);
//         }
//     }, [showTable, selectedBooks]);

//     const toggleSelectBook = (book) => {
//         const updatedSelectedBooks = selectedBooks.includes(book)
//             ? selectedBooks.filter(selectedBook => selectedBook !== book)
//             : [...selectedBooks, book];
//         setSelectedBooks(updatedSelectedBooks);
//     };

//     const toggleTableVisibility = () => {
//         setShowTable(!showTable);
//         if (!showTable) {
//             setSelectedBooks(persistedSelectedBooks);
//         }
//     };

//     const toggleShelfVisibility = (bookId) => {
//         setOption(option.map(book => {
//             if (book.id === bookId) {
//                 return { ...book, shelfVisible: !book.shelfVisible };
//             }
//             return book;
//         }));
//     };

//     return (
//         <div className="option-container">
//             {option.length > 0 && (
//                 <>
//                     {selectedBooks.length > 0 && (
//                         <>
//                             <table>
//                                 <tbody>
//                                     {selectedBooks.map((book, index) => (
//                                         <tr key={index}>
//                                             <td>{book.id}</td>
//                                             <td>{book.title.length > 25 ? book.title.slice(0, 25) + '...' : book.title}</td>
//                                             <td>{book.optionprice ? book.optionprice : book.price}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </>
//                     )}

//                     <button onClick={toggleTableVisibility}>
//                         {showTable
//                             ? `🔼Total Price: ${totalPrice}`
//                             : totalPrice > 0
//                             ? `🔽Total Price: ${totalPrice}`
//                             : `➕ ${totalPrice}`}
//                     </button>
//                     {showTable && (
//                         <>
//                             <table>
//                                 <tbody>
//                                     {option.map(book => (
//                                         <React.Fragment key={book.id}>
//                                             <tr>
//                                                 <td>
//                                                     {book.image ? (
//                                                         <img src={book.image} alt={book.title} style={{ width: '50px', height: '50px' }} />
//                                                     ) : book.imageblock && book.imageblock.split(',')[0] ? (
//                                                         <img src={book.imageblock.split(',')[0]} alt={book.title} style={{ width: '50px', height: '50px' }} />
//                                                     ) : (
//                                                         <img src={imageNotFound} alt="ImageNotFound" style={{ width: '50px', height: '50px' }} />
//                                                     )}
//                                                 </td>
//                                                 <td>
//                                                     <b onClick={() => toggleSelectBook(book)}>
//                                                         {book.title}
//                                                     </b>
//                                                 </td>
//                                                 <td>
//                                                     {book.optionprice ? (
//                                                         <>
//                                                             <span style={{ textDecoration: 'line-through' }}>{book.price}</span>
//                                                             <span>{book.optionprice}</span>
//                                                         </>
//                                                     ) : (
//                                                         <span>{book.price}</span>
//                                                     )}
//                                                 </td>
//                                                 <td>
//                                                     <input
//                                                         type="checkbox"
//                                                         onChange={() => toggleSelectBook(book)}
//                                                         checked={selectedBooks.some(selectedBook => selectedBook.id === book.id)}
//                                                         onClick={(e) => e.stopPropagation()} // Prevent checkbox toggle when clicking on info button
//                                                     />
//                                                 </td>
//                                                 <td>
//                                                     <button onClick={(e) => { e.stopPropagation(); toggleShelfVisibility(book.id); }}>
//                                                         ℹ️
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                             {book.shelfVisible && (
//                                                 <tr>
//                                                     <td colSpan={5}>
//                                                         <Shelf book={option.filter(option => option.id === book.id)}  />
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </React.Fragment>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             <div className="summary-row">
//                                 <span>Total Price: {totalPrice}</span>
//                             </div>
//                         </>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }



// import React, { useContext, useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import Shelf from '../book-list/Shelf';
// import imageNotFound from '../book-list/img/imageNotFound.png';

// export default function OptionBlock({ id }) {
//     const { books } = useContext(BooksContext);
//     const [option, setOption] = useState([]);
//     const [selectedBooks, setSelectedBooks] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [showTable, setShowTable] = useState(false);
//     const [persistedSelectedBooks, setPersistedSelectedBooks] = useState([]);

//     useEffect(() => {
//         const selectedBook = books.find(book => book.id === id);
//         if (selectedBook) {
//             const optionblock = selectedBook.optionblock;
//             if (optionblock) {
//                 const optionIds = optionblock.split(';').filter(Boolean);
//                 const filteredBooks = books.filter(book => optionIds.includes(book.id) && book.Visibility !== '0');
//                 setOption(filteredBooks.map(book => ({ ...book, shelfVisible: false })));
//             }
//         }
//     }, [id, books]);

//     useEffect(() => {
//         const selectedPrices = selectedBooks.map(book => parseFloat(book.optionprice || book.price));
//         const totalPrice = selectedPrices.reduce((acc, price) => acc + price, 0);
//         setTotalPrice(totalPrice);
//     }, [selectedBooks]);

//     useEffect(() => {
//         if (showTable) {
//             setPersistedSelectedBooks(selectedBooks);
//         }
//     }, [showTable, selectedBooks]);

//     const toggleSelectBook = (book) => {
//         const updatedSelectedBooks = selectedBooks.includes(book)
//             ? selectedBooks.filter(selectedBook => selectedBook !== book)
//             : [...selectedBooks, book];
//         setSelectedBooks(updatedSelectedBooks);
//     };

//     const toggleTableVisibility = () => {
//         setShowTable(!showTable);
//         if (!showTable) {
//             setSelectedBooks(persistedSelectedBooks);
//         }
//     };

//     const toggleShelfVisibility = (bookId) => {
//         setOption(option.map(book => {
//             if (book.id === bookId) {
//                 return { ...book, shelfVisible: !book.shelfVisible };
//             }
//             return book;
//         }));
//     };

//     return (
//         <div className="option-container">
//             {option.length > 0 && (
//                 <>
//                     <button onClick={toggleTableVisibility}>
//                         {showTable
//                             ? `Hide Table ${totalPrice}`
//                             : totalPrice > 0
//                             ? `Show Table ${totalPrice}`
//                             : `Select ${totalPrice}`}
//                     </button>
//                     {showTable && (
//                         <>
//                             <table>
//                                 <thead>
//                                     <tr>
//                                         <th>Image</th> {/* Добавлен первый столбец */}
//                                         <th>Title</th>
//                                         <th>Price, $</th>
//                                         <th></th>
//                                         <th>Toggle Shelf</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {option.map(book => (
//                                         <React.Fragment key={book.id}>
//                                             <tr>
//                                                 <td>
//                                                     {book.image ? (
//                                                         <img src={book.image} alt={book.title} style={{ width: '50px', height: '50px' }} />
//                                                     ) : book.imageblock && book.imageblock.split(',')[0] ? (
//                                                         <img src={book.imageblock.split(',')[0]} alt={book.title} style={{ width: '50px', height: '50px' }} />
//                                                     ) : (
//                                                         <img src={imageNotFound} alt="NotFound" style={{ width: '50px', height: '50px' }} />
//                                                     )}
//                                                 </td>
//                                                 <td>
//                                                     <b onClick={() => toggleSelectBook(book)}>
//                                                         {book.title}
//                                                     </b>
//                                                 </td>
//                                                 <td>
//                                                     {book.optionprice ? (
//                                                         <>
//                                                             <span style={{ textDecoration: 'line-through' }}>{book.price}</span>
//                                                             <span>{book.optionprice}</span>
//                                                         </>
//                                                     ) : (
//                                                         <span>{book.price}</span>
//                                                     )}
//                                                 </td>
//                                                 <td>
//                                                     <input
//                                                         type="checkbox"
//                                                         onChange={() => toggleSelectBook(book)}
//                                                         checked={selectedBooks.includes(book)}
//                                                     />
//                                                 </td>
//                                                 <td>
//                                                     <button onClick={() => toggleShelfVisibility(book.id)}>
//                                                         Toggle Shelf
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                             {book.shelfVisible && (
//                                                 <tr>
//                                                     <td colSpan={5}>
//                                                         <Shelf book={option.filter(option => option.id === book.id)} widthblock={1} />
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </React.Fragment>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             <div className="summary-row">
//                                 <span>Total Price: {totalPrice}</span>
//                             </div>
//                         </>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }


// import React, { useContext, useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import Shelf from '../book-list/Shelf';


// export default function OptionBlock({ id }) {
//     const { books } = useContext(BooksContext);
//     const [option, setOption] = useState([]);
//     const [selectedBooks, setSelectedBooks] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [showTable, setShowTable] = useState(false);
//     const [persistedSelectedBooks, setPersistedSelectedBooks] = useState([]);

//     useEffect(() => {
//         const selectedBook = books.find(book => book.id === id);
//         if (selectedBook) {
//             const optionblock = selectedBook.optionblock;
//             if (optionblock) {
//                 const optionIds = optionblock.split(';').filter(Boolean);
//                 const filteredBooks = books.filter(book => optionIds.includes(book.id) && book.Visibility !== '0');
//                 setOption(filteredBooks.map(book => ({ ...book, shelfVisible: false })));
//             }
//         }
//     }, [id, books]);

//     useEffect(() => {
//         const selectedPrices = selectedBooks.map(book => parseFloat(book.optionprice || book.price));
//         const totalPrice = selectedPrices.reduce((acc, price) => acc + price, 0);
//         setTotalPrice(totalPrice);
//     }, [selectedBooks]);

//     useEffect(() => {
//         if (showTable) {
//             setPersistedSelectedBooks(selectedBooks);
//         }
//     }, [showTable, selectedBooks]);

//     const toggleSelectBook = (book) => {
//         const updatedSelectedBooks = selectedBooks.includes(book)
//             ? selectedBooks.filter(selectedBook => selectedBook !== book)
//             : [...selectedBooks, book];
//         setSelectedBooks(updatedSelectedBooks);
//     };

//     const toggleTableVisibility = () => {
//         setShowTable(!showTable);
//         if (!showTable) {
//             setSelectedBooks(persistedSelectedBooks);
//         }
//     };

//     const toggleShelfVisibility = (bookId) => {
//         setOption(option.map(book => {
//             if (book.id === bookId) {
//                 return { ...book, shelfVisible: !book.shelfVisible };
//             }
//             return book;
//         }));
//     };

//     return (
//         <div className="option-container">
//             {option.length > 0 && (
//                 <>
//                     <button onClick={toggleTableVisibility}>
//                         {showTable
//                             ? `Hide Table ${totalPrice}`
//                             : totalPrice > 0
//                             ? `Show Table ${totalPrice}`
//                             : `Select ${totalPrice}`}
//                     </button>
//                     {showTable && (
//                         <>
//                             <table>
//                                 <thead>
//                                     <tr>
//                                         <th>Title</th>
//                                         <th>Price, $</th>
//                                         <th></th>
//                                         <th>Toggle Shelf</th> {/* Добавлен столбец с кнопкой */}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {option.map(book => (
//                                         <React.Fragment key={book.id}>
//                                             <tr>
//                                                 <td>
//                                                     <b onClick={() => toggleSelectBook(book)}>
//                                                         {book.title}
//                                                     </b>
//                                                 </td>
//                                                 <td>
//                                                     {book.optionprice ? (
//                                                         <>
//                                                             <span style={{ textDecoration: 'line-through' }}>{book.price}</span>
//                                                             <span>{book.optionprice}</span>
//                                                         </>
//                                                     ) : (
//                                                         <span>{book.price}</span>
//                                                     )}
//                                                 </td>
//                                                 <td>
//                                                     <input
//                                                         type="checkbox"
//                                                         onChange={() => toggleSelectBook(book)}
//                                                         checked={selectedBooks.includes(book)}
//                                                     />
//                                                 </td>
//                                                 <td>
//                                                     <button onClick={() => toggleShelfVisibility(book.id)}>
//                                                         Toggle Shelf
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                             {book.shelfVisible && (
//                                                 <tr>
//                                                     <td colSpan={4}>
//                                                         <Shelf book={option.filter(option => option.id === book.id)}  />
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </React.Fragment>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             <div className="summary-row">
//                                 <span>Total Price: {totalPrice}</span>
//                             </div>
//                         </>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }



// import React, { useContext, useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import Shelf from '../book-list/Shelf';


// export default function OptionBlock({ id }) {
//     const { books } = useContext(BooksContext);
//     const [option, setOption] = useState([]);
//     const [selectedBooks, setSelectedBooks] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [showTable, setShowTable] = useState(false);
//     const [persistedSelectedBooks, setPersistedSelectedBooks] = useState([]);

//     useEffect(() => {
//         const selectedBook = books.find(book => book.id === id);
//         if (selectedBook) {
//             const optionblock = selectedBook.optionblock;
//             if (optionblock) {
//                 const optionIds = optionblock.split(';').filter(Boolean);
//                 const filteredBooks = books.filter(book => optionIds.includes(book.id) && book.Visibility !== '0');
//                 setOption(filteredBooks.map(book => ({ ...book, shelfVisible: false })));
//             }
//         }
//     }, [id, books]);

//     useEffect(() => {
//         const selectedPrices = selectedBooks.map(book => parseFloat(book.optionprice || book.price));
//         const totalPrice = selectedPrices.reduce((acc, price) => acc + price, 0);
//         setTotalPrice(totalPrice);
//     }, [selectedBooks]);

//     useEffect(() => {
//         if (showTable) {
//             setPersistedSelectedBooks(selectedBooks);
//         }
//     }, [showTable, selectedBooks]);

//     const toggleSelectBook = (book) => {
//         if (selectedBooks.includes(book)) {
//             setSelectedBooks(selectedBooks.filter(selectedBook => selectedBook !== book));
//         } else {
//             setSelectedBooks([...selectedBooks, book]);
//         }
//     };

//     const toggleTableVisibility = () => {
//         setShowTable(!showTable);
//         if (!showTable) {
//             setSelectedBooks(persistedSelectedBooks);
//         }
//     };

//     const toggleShelfVisibility = (bookId) => {
//         setOption(option.map(book => {
//             if (book.id === bookId) {
//                 return { ...book, shelfVisible: !book.shelfVisible };
//             }
            
//             return book;
//         }));
//     };

//     return (
//         <div className="option-container">
//             {option.length > 0 && (
//                 <>
//                     <button onClick={toggleTableVisibility}>
//                         {showTable
//                             ? `Hide Table ${totalPrice}`
//                             : totalPrice > 0
//                             ? `Show Table ${totalPrice}`
//                             : `Select ${totalPrice}`}
//                     </button>
//                     {showTable && (
//                         <>
//                             <table>
//                                 <thead>
//                                     <tr>
//                                         <th>Title</th>
//                                         <th>Price, $</th>
//                                         <th></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {option.map(book => (
//                                         <React.Fragment key={book.id}>
//                                             <tr>
//                                                 <td>
//                                                     <b onClick={() => toggleShelfVisibility(book.id)}>
//                                                         {book.title}
//                                                     </b>
//                                                 </td>
//                                                 <td>
//                                                     {book.optionprice ? (
//                                                         <>
//                                                             <span style={{ textDecoration: 'line-through' }}>{book.price}</span>
//                                                             <span>{book.optionprice}</span>
//                                                         </>
//                                                     ) : (
//                                                         <span>{book.price}</span>
//                                                     )}
//                                                 </td>
//                                                 <td>
//                                                     <input
//                                                         type="checkbox"
//                                                         onChange={() => toggleSelectBook(book)}
//                                                         checked={selectedBooks.includes(book)}
//                                                     />
//                                                 </td>
//                                             </tr>
//                                             {book.shelfVisible && (
//                                                 <tr>
//                                                     <td colSpan={3}>
//                                                     <Shelf book={option.filter(option => option.id === book.id)} widhtblock ={1} />
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </React.Fragment>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             <div className="summary-row">
//                                 <span>Total Price: {totalPrice}</span>
//                             </div>
//                         </>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }


// import React, { useContext, useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import Shelf from '../book-list/Shelf';


// export default function OptionBlock({ id }) {
//     const { books } = useContext(BooksContext);
//     const [option, setOption] = useState([]);
//     const [selectedBooks, setSelectedBooks] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [showTable, setShowTable] = useState(false);
//     const [persistedSelectedBooks, setPersistedSelectedBooks] = useState([]);
    


//     useEffect(() => {
//         const selectedBook = books.find(book => book.id === id);
//         if (selectedBook) {
//             const optionblock = (selectedBook.optionblock);
//             console.log((optionblock))

//             console.log(selectedBook)
//             if (optionblock) {
//                 const optionIds = optionblock.split(';').filter(Boolean);
//                 //const optionPrice = optionIds.split(':').filter(Boolean);
//                 const filteredBooks = books.filter(book => optionIds.includes(book.id) && book.Visibility !== '0');
//                 setOption(filteredBooks);
//                 console.log(filteredBooks)
//                 console.log(optionIds)
//                // console.log(optionPrice)
//             }
//         }
//     }, [id, books]);

//     useEffect(() => {
//         const selectedPrices = selectedBooks.map(book => parseFloat(book.optionprice || book.price));
//         const totalPrice = selectedPrices.reduce((acc, price) => acc + price, 0);
//         setTotalPrice(totalPrice);
//     }, [selectedBooks]);

//     useEffect(() => {
//         if (showTable) {
//             setPersistedSelectedBooks(selectedBooks);
//         }
//     }, [showTable, selectedBooks]);

//     const toggleSelectBook = (book) => {
//         if (selectedBooks.includes(book)) {
//             setSelectedBooks(selectedBooks.filter(selectedBook => selectedBook !== book));
//         } else {
//             setSelectedBooks([...selectedBooks, book]);
//         }
//     };

//     const toggleTableVisibility = () => {
//         setShowTable(!showTable);
//         if (!showTable) {
//             setSelectedBooks(persistedSelectedBooks);
//         }
//     };

//     return (
//         <div className="option-container">
//             {option.length > 0 && (
//                 <>
//                     <button onClick={toggleTableVisibility}>
//                         {showTable
//                             ? `Hide Table ${totalPrice}`
//                             : totalPrice > 0
//                             ? `Show Table ${totalPrice}`
//                             : `Select ${totalPrice}`}
//                     </button>
//                     {showTable && (
//                         <>
//                             <table>
//                                 <thead>
//                                     <tr>
//                                         <th>Title</th>
//                                         <th>Price, $</th>
//                                         <th></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {option.map(book => (
//                                         <>
//                                         <tr key={book.id}>
//                                             <td> <b>  {book.title}
//     </b></td>
//                                             <td>
//                                                 {book.optionprice ? (
//                                                     <>
//                                                         <span style={{ textDecoration: 'line-through' }}>{book.price}</span>
//                                                         <span>{book.optionprice}</span>
//                                                     </>
//                                                 ) : (
//                                                     <span>{book.price}</span>
//                                                 )}
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     type="checkbox"
//                                                     onChange={() => toggleSelectBook(book)}
//                                                     checked={selectedBooks.includes(book)}
//                                                 />
//                                             </td>
//                                         </tr>
//                                        <tr>
//                                        <td colSpan="3">
//                                         <Shelf book={option.filter(option => option.id === book.id)} widthblock={1} />
//                                         </td>
//                                         </tr>
//                                          </>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             <div className="summary-row">
//                                 <span>Total Price: {totalPrice}</span>
//                             </div>
//                         </>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }



// import React, { useContext, useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import Shelf from '../book-list/Shelf'; // Import the Shelf component
// import SpecificBook from './SpecificBook';

// export default function OptionBlock({ id }) {
//     const { books,specificBook, setSpecificBook } = useContext(BooksContext);
//     const [option, setOption] = useState([]);
//     const [selectedBooks, setSelectedBooks] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [showTable, setShowTable] = useState(false);
//     const [persistedSelectedBooks, setPersistedSelectedBooks] = useState([]);
//     const [selectedBookId, setSelectedBookId] = useState(null); // State to store the ID of the selected book

//     useEffect(() => {
//         const selectedBook = books.find(book => book.id === id);
//         if (selectedBook) {
//             const optionblock = selectedBook.optionblock;
//             if (optionblock) {
//                 const optionIds = optionblock.split(',').filter(Boolean);
//                 const filteredBooks = books.filter(book => optionIds.includes(book.id) && book.Visibility !== '0');
//                 setOption(filteredBooks);
//             }
//         }
//     }, [id, books]);

//     useEffect(() => {
//         const selectedPrices = selectedBooks.map(book => parseFloat(book.optionprice || book.price));
//         const totalPrice = selectedPrices.reduce((acc, price) => acc + price, 0);
//         setTotalPrice(totalPrice);
//     }, [selectedBooks]);

//     useEffect(() => {
//         if (showTable) {
//             setPersistedSelectedBooks(selectedBooks);
//         }
//     }, [showTable, selectedBooks]);

//     const toggleSelectBook = (book) => {
//         if (selectedBooks.includes(book)) {
//             setSelectedBooks(selectedBooks.filter(selectedBook => selectedBook !== book));
//         } else {
//             setSelectedBooks([...selectedBooks, book]);
//         }
//     };

//     const toggleTableVisibility = () => {
//         setShowTable(!showTable);
//         if (!showTable) {
//             setSelectedBooks(persistedSelectedBooks);
//         }
//     };

//     const handleTitleClick = (bookId) => {
//         setSelectedBookId(bookId); // Set the selected book ID when the title is clicked
//        setSpecificBook(books.find(book => book.id === selectedBookId))
//     };

//     console.log([books.find(book => book.id === selectedBookId)])
//     return (
//         <div className="option-container">
//             {option.length > 0 && (
//                 <>
//                     <button onClick={toggleTableVisibility}>
//                         {totalPrice === 0 ? `Select ${totalPrice}` : (showTable ? `Hide Table ${totalPrice}` : `Show Table ${totalPrice}`)}
//                     </button>
//                     {showTable && (
//                         <>
//                             <table>
//                                 <thead>
//                                     <tr>
//                                         <th>Title</th>
//                                         <th>Price</th>
//                                         <th>Checkbox</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {option.map(book => (
//                                         <tr key={book.id}>
//                                             <td onClick={() => handleTitleClick(book.id)}>{book.title}</td>
//                                             <td>
//                                                 {book.optionprice ? (
//                                                     <>
//                                                         <span style={{ textDecoration: 'line-through' }}>{book.price}</span>
//                                                         <span>{book.optionprice}</span>
//                                                     </>
//                                                 ) : (
//                                                     <span>{book.price}</span>
//                                                 )}
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     type="checkbox"
//                                                     onChange={() => toggleSelectBook(book)}
//                                                     checked={selectedBooks.includes(book)}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             <div className="summary-row">
//                                 <span>Total Price: {totalPrice}</span>
//                             </div>
                        
//                             <div className={'id-container'}>{selectedBookId && <Shelf book={[books.find(book => book.id === selectedBookId)]} t={0} />} 
//                     </div>
//                         </>
//                     )}
                   
                 
//                 </>
//             )}
//         </div>
//     );
// }






// import React, { useContext, useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';

// export default function OptionBlock({ id }) {
//     const { books } = useContext(BooksContext);
//     const [option, setOption] = useState([]);
//     const [selectedBooks, setSelectedBooks] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [showTable, setShowTable] = useState(false);

//     useEffect(() => {
//         const selectedBook = books.find(book => book.id === id);
//         if (selectedBook) {
//             const optionblock = selectedBook.optionblock;
//             if (optionblock) {
//                 const optionIds = optionblock.split(',').filter(Boolean);
//                 const filteredBooks = books.filter(book => optionIds.includes(book.id) && book.Visibility !== '0');
//                 setOption(filteredBooks);
//             }
//         }
//     }, [id, books]);

//     // Update selected books and total price when checkboxes are toggled
//     useEffect(() => {
//         const selectedPrices = selectedBooks.map(book => parseFloat(book.optionprice || book.price));
//         const totalPrice = selectedPrices.reduce((acc, price) => acc + price, 0);
//         setTotalPrice(totalPrice);
//     }, [selectedBooks]);

//     // Toggle book selection
//     const toggleSelectBook = (book) => {
//         if (selectedBooks.includes(book)) {
//             setSelectedBooks(selectedBooks.filter(selectedBook => selectedBook !== book));
//         } else {
//             setSelectedBooks([...selectedBooks, book]);
//         }
//     };

//     // Handle button click to toggle table visibility
//     const toggleTableVisibility = () => {
//         setShowTable(!showTable);
//     };

//     // Handle button click to increase total price
//     const increaseTotalPrice = () => {
//         setTotalPrice(totalPrice + 1);
//     };

//     return (
//         <div className="option-container">
          
//             { option.length > 0 &&(
//                 <>
//                 <button onClick={toggleTableVisibility}>{showTable ? `Hide Table ${totalPrice}` : `Show Table ${totalPrice}`}
// </button>
//                 {showTable  && (
// <>
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Title</th>
//                                 <th>Price</th>
//                                 <th>Checkbox</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {option.map(book => (
//                                 <tr key={book.id}>
//                                     <td>{book.title}</td>
//                                     <td>
//                                         {book.optionprice ? (
//                                             <>
//                                                 <span style={{ textDecoration: 'line-through' }}>{book.price}</span>
//                                                 <span>{book.optionprice}</span>
//                                             </>
//                                         ) : (
//                                             <span>{book.price}</span>
//                                         )}
//                                     </td>
//                                     <td><input type="checkbox" onChange={() => toggleSelectBook(book)} /></td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <div className="summary-row">
//                         <span>Total Price: {totalPrice}</span>
//                         {/* <button onClick={increaseTotalPrice}>+1</button> */}
//                     </div>
//                     </>
//                     )}
//                 </>

//            ) }
//         </div>
//     );
// }


// import React, { useContext, useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';

// export default function OptionBlock({ id }) {
//     const { books } = useContext(BooksContext);
//     const [option, setOption] = useState([]);
//     const [selectedBooks, setSelectedBooks] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);

//     useEffect(() => {
//         const selectedBook = books.find(book => book.id === id);
//         if (selectedBook) {
//             const optionblock = selectedBook.optionblock;
//             if (optionblock) {
//                 const optionIds = optionblock.split(',').filter(Boolean);
//                 const filteredBooks = books.filter(book => optionIds.includes(book.id) && book.Visibility !== '0');
//                 setOption(filteredBooks);
//             }
//         }
//     }, [id, books]);

//     // Update selected books and total price when checkboxes are toggled
//     useEffect(() => {
//         const selectedPrices = selectedBooks.map(book => parseFloat(book.optionprice || book.price));
//         const totalPrice = selectedPrices.reduce((acc, price) => acc + price, 0);
//         setTotalPrice(totalPrice);
//     }, [selectedBooks]);

//     // Toggle book selection
//     const toggleSelectBook = (book) => {
//         if (selectedBooks.includes(book)) {
//             setSelectedBooks(selectedBooks.filter(selectedBook => selectedBook !== book));
//         } else {
//             setSelectedBooks([...selectedBooks, book]);
//         }
//     };

//     return (
//         <div className="option-container">
//             {option.length > 0 &&
//                 <>
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Title</th>
//                                 <th>Price</th>
//                                 <th>Checkbox</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {option.map(book => (
//                                 <tr key={book.id}>
//                                     <td>{book.title}</td>
//                                     <td>
//                                         {book.optionprice ?
//                                             <span style={{ textDecoration: 'line-through' }}>{book.price}</span>
//                                             :
//                                             <>{book.price}</>
//                                         }
//                                         {book.optionprice && <span style={{ color: 'red' }}>{book.optionprice}</span>}
//                                     </td>
//                                     <td><input type="checkbox" onChange={() => toggleSelectBook(book)} /></td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {selectedBooks.length > 0 &&
//                         <div className="summary-row">
//                             <span>Total Price: {totalPrice}</span>
//                         </div>
//                     }
//                 </>
//             }
//         </div>
//     );
// }


// import React, { useContext, useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';

// export default function OptionBlock({ id }) {
//     const { books } = useContext(BooksContext);
//     const [option, setOption] = useState([]);
//     const [selectedBooks, setSelectedBooks] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);

//     useEffect(() => {
//         const selectedBook = books.find(book => book.id === id);
//         if (selectedBook) {
//             const optionblock = selectedBook.optionblock;
//             if (optionblock) {
//                 const optionIds = optionblock.split(',').filter(Boolean);
//                 const filteredBooks = books.filter(book => optionIds.includes(book.id) && book.Visibility !== '0');
//                 setOption(filteredBooks);
//             }
//         }
//     }, [id, books]);

//     // Update selected books and total price when checkboxes are toggled
//     useEffect(() => {
//         const selectedPrices = selectedBooks.map(book => parseFloat(book.optionprice || book.price));
//         const totalPrice = selectedPrices.reduce((acc, price) => acc + price, 0);
//         setTotalPrice(totalPrice);
//     }, [selectedBooks]);

//     // Toggle book selection
//     const toggleSelectBook = (book) => {
//         if (selectedBooks.includes(book)) {
//             setSelectedBooks(selectedBooks.filter(selectedBook => selectedBook !== book));
//         } else {
//             setSelectedBooks([...selectedBooks, book]);
//         }
//     };

//     return (
//         <div className="option-container">
//             {option.length > 0 &&
//                 <>
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Title</th>
//                                 <th>Price</th>
//                                 <th>Checkbox</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {option.map(book => (
//                                 <tr key={book.id}>
//                                     <td>{book.title}</td>
//                                     <td>{book.optionprice || book.price}</td>
//                                     <td><input type="checkbox" onChange={() => toggleSelectBook(book)} /></td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {selectedBooks.length > 0 &&
//                         <div className="summary-row">
//                             <span>Total Price: {totalPrice}</span>
//                         </div>
//                     }
//                 </>
//             }
//         </div>
//     );
// }



// import React, { useContext, useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';

// export default function OptionBlock({ id }) {
//     const { books } = useContext(BooksContext);
//     const [option, setOption] = useState([]);

//     useEffect(() => {
//         const selectedBook = books.find(book => book.id === id);
//         if (selectedBook) {
//             const optionblock = selectedBook.optionblock;
//             if (optionblock) {
//                 const optionIds = optionblock.split(',').filter(Boolean);
//                 const filteredBooks = books.filter(book => optionIds.includes(book.id) && book.Visibility !== '0');
//                 setOption(filteredBooks);
//             }
//         }
//     }, [id, books]);

//     return (
//         <div className="option-container">
//             {option.length > 0 &&
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Title</th>
//                             <th>Author</th>
//                             <th>Visibility</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {option.map(book => (
//                             <tr key={book.id}>
//                                 <td>{book.title}</td>
//                                 <td>{book.author}</td>
//                                 <td>{book.Visibility}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             }
//         </div>
//     );
// }


// import React, { useContext, useState, useMemo, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';

// export default function OptionBlock({id}) {
//     const {  books } = useContext(BooksContext);
//    const [option, setOption]=useState('');
//     let selectedblock = books.find((book) => book.id === id).optionblock;
//    useEffect( ()=>{if (selectedblock!==undefined||selectedblock!==""||selectedblock!==null){setOption(selectedblock.split(','))}},[]);
//     console.log(selectedblock);
//     console.log(option)
//     return(
//         <div className="option-container">
//             {option.length>0&&(
//                 <>
//               {option}
//                 </>
//             )}
//         </div>
//     )
    
    
// }    