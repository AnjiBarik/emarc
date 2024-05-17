import React, { useState, useEffect } from 'react';
import { BooksContext } from '../../BooksContext';
//import { SHA256 } from 'crypto-js';
import { hashPasswordAndUsername } from './HashUtils';
import favorite from '../cart/img/favorite.png';
import addfavorite from '../cart/img/addfavorite.png';
//import { Await } from 'react-router-dom';

const CartMemo = () => {
  const {
    setCartItems,
    cartItems,
    books,
    order,
    setOrder,
    loggedIn,
    fieldState,
    uiMain,
    savedLogin,
    savedPassword
  } = React.useContext(BooksContext);

  const [selectedItems, setSelectedItems] = useState([]);
  console.log(order)
  

  useEffect(() => {
    if (loggedIn && order && order !== "" && order.trim() !== "") {
        const orderItems = order.split(';');
        const items = [];
        console.log(orderItems)
        orderItems.forEach(orderItem => {
            const orderParts = orderItem.split(':');
            console.log(orderParts)
            const idpraceorder = orderParts[0];
            console.log(idpraceorder)
            for (let i = 1; i < orderParts.length; i += 2) {
                const id = orderParts[i];
                const count = orderParts[i + 1];
                items.push({ idpraceorder, id, count });
            }
        });
        console.log(items)
        setSelectedItems(items);
    }
}, [loggedIn, order]);

  // useEffect(() => {
  //   if (loggedIn && order && order !== "" && order.trim() !== "") {
  //     const orderItems = order.split(';');
  //     console.log(orderItems)
  //     const items = [];
  //     orderItems.forEach(orderItem => {
  //       const orderParts = orderItem.split(':');
  //       console.log(orderParts)
  //       for (let i = 0; i < orderParts.length; i += 3) {
  //         const idpraceorder = orderParts[i];
  //         console.log(idpraceorder)
  //         const id = orderParts[i + 1];
  //         console.log(id)
  //         const count = orderParts[i + 2];
  //         console.log(count)
  //         items.push({ idpraceorder, id, count });
  //       }
  //     });
  //     setSelectedItems(items);
  //     console.log(items)
  //   }
  // }, [loggedIn, order]);

  const handleAdd = () => {
    console.log(selectedItems)
    const itemsToAdd = selectedItems.filter(item => item.idpraceorder === fieldState.idprice);
    const updatedCartItems = [...cartItems];
    console.log(itemsToAdd)
    itemsToAdd.forEach(item => {
      const book = books.find(book => book.id === item.id);
     console.log(book)
      if (book && book.Visibility !== 0) {
        const existingItemIndex = updatedCartItems.findIndex(cartItem => cartItem.id === item.id);
        console.log(existingItemIndex)
        const maxCount = book.maxcount && book.maxcount !== "" ? parseInt(book.maxcount) : 1;
        if (existingItemIndex !== -1) {
          //const maxCount = book.maxcount !== "" ? parseInt(book.maxcount) : 1;
          updatedCartItems[existingItemIndex].count = Math.min(updatedCartItems[existingItemIndex].count + parseInt(item.count), maxCount);
      }
       else {
          updatedCartItems.push({ ...book, count: Math.min(parseInt(item.count), maxCount) });
        }
      }
    });
    setCartItems(updatedCartItems);
    console.log(updatedCartItems)
  };


  const handleAddToFavorites = async () => {
  //const handleAddToFavorites = () => {
    const favoritesString = cartItems.map(item => `${item.id}:${item.count}`).join(':');
    const newOrderItem = `${fieldState.idprice}:${favoritesString};`;

    const regex = new RegExp(`${fieldState.idprice}:[^;]*;`);
    const match = order.match(regex);
    console.log(regex)
    console.log(match)
    let newOrder;

    // Если часть строки существует, заменяем ее на новую переменную
    if (match) {
        newOrder = order.replace(match[0], newOrderItem);
        setOrder(newOrder)
        console.log(newOrder)
    } else {
        // Если часть строки не существует, добавляем новую переменную в конец строки order
        newOrder = order + newOrderItem;
        setOrder(newOrder)
        console.log(newOrder)
    }

    const formData = new FormData();
    formData.append('isVerification', 3);
    formData.append('Name', savedLogin);
    //formData.append('Password',  SHA256(savedPassword).toString());
    formData.append("Password", await hashPasswordAndUsername(savedLogin, savedPassword));
    formData.append('Order', newOrder);

    for (const pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const apiUrl = uiMain.Urregform;

    fetch(apiUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
      .then(data => {
        if (data === 'Incorrect username or password.') {
          alert('⚠️Incorrect username or password.');
        } else {
          alert('Updated successfully!');
        }
    })
    .catch(error => {
        // Обработка ошибки
        alert('⚠️Error: ' + error.message);
    });
  };

  return (
    <>
      {loggedIn && order && order !== "" && order.trim() !== ""  && (
        <button className='sort-button' onClick={handleAdd}>
           <img src={favorite} className="back-button" alt="favorite cart" />
        </button>
      )}
         
     {loggedIn &&
      cartItems &&
      cartItems.length > 0 &&
      fieldState.idprice &&
      fieldState.idprice !== "" && (
       <button className='sort-button' onClick={handleAddToFavorites}>
         <img src={addfavorite} className="back-button" alt="add favorite cart" />
       </button>
     )}
   </>
  );
};

export default CartMemo;



// import React, { useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import favorite from '../cart/img/favorite.png';
// import addfavorite from '../cart/img/addfavorite.png';

// const CartMemo = () => {
//   const {
//     setCartItems,
//     cartItems,
//     books,
//     order,
//     loggedIn,
//     fieldState,
//     uiMain,
//     savedLogin,
//     savedPassword
//   } = React.useContext(BooksContext);

  
//   const [selectedItems, setSelectedItems] = useState([]);
// console.log(order)
//   useEffect(() => {
//     if (loggedIn && order && order !== "" && order.trim() !== "") {
//       const orderItems = order.split(';');
//       const items = [];
//       orderItems.forEach(orderItem => {
//         const orderParts = orderItem.split(':');
//         for (let i = 0; i < orderParts.length; i += 3) {
//           const idpraceorder = orderParts[i];
//           const id = orderParts[i + 1];
//           const count = orderParts[i + 2];
//           items.push({ idpraceorder, id, count });
//         }
//       });
//       setSelectedItems(items);
//     }
//   }, [loggedIn, order]);

//   const handleAdd = () => {
//     const itemsToAdd = selectedItems.filter(item => item.idpraceorder === fieldState.idprice);
//     const updatedCartItems = [...cartItems];
//     console.log(itemsToAdd)
//     itemsToAdd.forEach(item => {
//       const book = books.find(book => book.id === item.id);
     
//       if (book) {
//         const existingItemIndex = updatedCartItems.findIndex(cartItem => cartItem.id === item.id);
//         console.log(existingItemIndex)
//         if (existingItemIndex !== -1) {
//           const maxCount = book.maxcount !== "" ? parseInt(book.maxcount) : 1;
//           updatedCartItems[existingItemIndex].count = Math.min(updatedCartItems[existingItemIndex].count + parseInt(item.count), maxCount);
//       }
//        else {
//           updatedCartItems.push({ ...book, count: parseInt(item.count) });
//         }
//       }
//     });
//     setCartItems(updatedCartItems);
//     console.log(updatedCartItems)
   
//   };

//   const handleAddToFavorites = () => {
//     //const favoritesString = cartItems.map(item => `${item.id}:${item.count}`).join(';');
//     const favoritesString = cartItems.map(item => `${item.id}:${item.count}`).join(':');
//     const newOrderItem = `${fieldState.idprice}:${favoritesString};`;
// console.log(favoritesString)
// console.log(newOrderItem)
//     // Проверяем, существует ли часть строки в order, начинающаяся с fieldState.idprice
//     const regex = new RegExp(`${fieldState.idprice}:[^;]*;`);
//     const match = order.match(regex);
// console.log(regex)
// console.log(match)
//     // Если часть строки существует, заменяем ее на новую переменную
//     if (match) {
//       const newOrder = order.replace(match[0], newOrderItem);
//       //setOrder(newOrder);
//       console.log(newOrder)
//     } else {
//       // Если часть строки не существует, добавляем новую переменную в конец строки order
//       //setOrder(order + newOrderItem);
//       console.log(order + newOrderItem)
//     }
//   };


//   const [formData, setFormData] = useState({
//     Name: savedLogin,
//     Password1: savedPassword,
//   });
  
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     formData.isVerification = 3;

//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);

//   const apiUrl = uiMain.Urregform;

//   fetch(apiUrl, {
//     method: "POST",
//     body: formDatab
//   })
//     .then(response => response.text())
//     .then(data => {
//         if (data === 'Incorrect username or password.') {
//           alert('⚠️Incorrect username or password.');
//         }  else {
//             alert('Welcome! (No additional information available)');
//           }
//     })
//     .catch(error => {
//       alert('⚠️Error: ' + error.message);
//     });
//   };

//   return (
//     <>
//       {loggedIn && order && order !== "" && order.trim() !== ""  && (
//         <button className='sort-button' onClick={handleAdd}>
//            <img src={favorite} className="back-button" alt="favorite cart" />
//         </button>
//       )}
         
//      {loggedIn &&
//       cartItems &&
//       cartItems.length > 0 &&
//       fieldState.idprice &&
//       fieldState.idprice !== "" && (
//        <button className='sort-button' onClick={handleAddToFavorites}>
//          <img src={addfavorite} className="back-button" alt="favorite cart" />
//        </button>
//      )}
//    </>
//   );
// };

// export default CartMemo;


// import React, { useState, useEffect } from 'react';
// import { BooksContext } from '../../BooksContext';
// import favorite from '../cart/img/favorite.png';
// import addfavorite from '../cart/img/addfavorite.png';

// const CartMemo = () => {
//   const {
//     setCartItems,
//     cartItems,
//     books,
//     order,
//     loggedIn,
//     fieldState,
//   } = React.useContext(BooksContext);

  
//   const [selectedItems, setSelectedItems] = useState([]);
// console.log(order)
//   useEffect(() => {
//     if (loggedIn && order && order !== "" && order.trim() !== "") {
//       const orderItems = order.split(';');
//       const items = [];
//       orderItems.forEach(orderItem => {
//         const orderParts = orderItem.split(':');
//         for (let i = 0; i < orderParts.length; i += 3) {
//           const idpraceorder = orderParts[i];
//           const id = orderParts[i + 1];
//           const count = orderParts[i + 2];
//           items.push({ idpraceorder, id, count });
//         }
//       });
//       setSelectedItems(items);
//     }
//   }, [loggedIn, order]);

//   const handleAdd = () => {
//     const itemsToAdd = selectedItems.filter(item => item.idpraceorder === fieldState.idprice);
//     const updatedCartItems = [...cartItems];
//     console.log(itemsToAdd)
//     itemsToAdd.forEach(item => {
//       const book = books.find(book => book.id === item.id);
     
//       if (book) {
//         const existingItemIndex = updatedCartItems.findIndex(cartItem => cartItem.id === item.id);
//         console.log(existingItemIndex)
//         if (existingItemIndex !== -1) {
//           const maxCount = book.maxcount !== "" ? parseInt(book.maxcount) : 1;
//           updatedCartItems[existingItemIndex].count = Math.min(updatedCartItems[existingItemIndex].count + parseInt(item.count), maxCount);
//       }
//        else {
//           updatedCartItems.push({ ...book, count: parseInt(item.count) });
//         }
//       }
//     });
//     setCartItems(updatedCartItems);
//     console.log(updatedCartItems)
   
//   };

//   // const handleReplace = () => {
//   //   const itemsToReplace = selectedItems.filter(item => item.idpraceorder === fieldState.idprice);
//   //   const updatedCartItems = itemsToReplace.map(item => {
//   //     const book = books.find(book => book.id === item.id);
//   //     return { ...book, count: parseInt(item.count) };
//   //   });
//   //   setCartItems(updatedCartItems);
//   //   console.log(updatedCartItems)
//   //   setShowModal(false);
//   // };

//   // const showChooseButton = () => {
//   //   if (selectedItems.length === 0) return false;
//   //   return selectedItems.some(item => item.idpraceorder === fieldState.idprice);
//   // };

   
//   const handleAddToFavorites = () => {
//     //const favoritesString = cartItems.map(item => `${item.id}:${item.count}`).join(';');
//     const favoritesString = cartItems.map(item => `${item.id}:${item.count}`).join(':');
//     const newOrderItem = `${fieldState.idprice}:${favoritesString};`;
// console.log(favoritesString)
// console.log(newOrderItem)
//     // Проверяем, существует ли часть строки в order, начинающаяся с fieldState.idprice
//     const regex = new RegExp(`${fieldState.idprice}:[^;]*;`);
//     const match = order.match(regex);
// console.log(regex)
// console.log(match)
//     // Если часть строки существует, заменяем ее на новую переменную
//     if (match) {
//       const newOrder = order.replace(match[0], newOrderItem);
//       //setOrder(newOrder);
//       console.log(newOrder)
//     } else {
//       // Если часть строки не существует, добавляем новую переменную в конец строки order
//       //setOrder(order + newOrderItem);
//       console.log(order + newOrderItem)
//     }
//   };


//   // const handleAddToFavorites = () => {
//   //   const favoritesString = cartItems.map(item => `${fieldState.idprice}:${item.id}:${item.count}`).join(';');
//   //   console.log("Favorites:", favoritesString);
//   // };

//   return (
//     <>
//       {loggedIn && order && order !== "" && order.trim() !== ""  && (
//         <button className='sort-button' onClick={handleAdd}>
//            <img src={favorite} className="back-button" alt="favorite cart" />
//         </button>
//       )}
//       {/* {showModal && (
//         <div>
//           {cartItems && cartItems.length > 0 ? (
//             <div>
//               <button onClick={handleAdd}>Add</button>
             
//             </div>
//           ) : 
//           <button onClick={handleAdd}>Add</button>} 
          
//         </div>
//       )} */}
    
//      {loggedIn &&
//       cartItems &&
//       cartItems.length > 0 &&
//       fieldState.idprice &&
//       fieldState.idprice !== "" && (
//        <button className='sort-button' onClick={handleAddToFavorites}>
//          <img src={addfavorite} className="back-button" alt="favorite cart" />
//        </button>
//      )}
//    </>
//   );
// };

// export default CartMemo;




// import React, { useState } from 'react';
// import { BooksContext } from '../../BooksContext';

// const CartMemo = () => {
//   const {
//     setCartItems,
//     cartItems,
//     books,
//     order,
//     loggedIn,
//     fieldState,
//   } = React.useContext(BooksContext);

//   const [showModal, setShowModal] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);

//   React.useEffect(() => {
//     if (loggedIn && order && order !== "" && order.trim() !== "") {
//       const orderItems = order.split(';');
//       const items = [];
//       orderItems.forEach(orderItem => {
//         const orderParts = orderItem.split(':');
//         for (let i = 0; i < orderParts.length; i += 3) {
//           const idpraceorder = orderParts[i];
//           console.log(idpraceorder)
//           const id = orderParts[i + 1];
//           const count = orderParts[i + 2];
//           items.push({ id, count });
//         }
//       });
//       setSelectedItems(items);
//       console.log(items)
//     }
//   }, [loggedIn, order]);

//   const handleAction = (action) => {
//     if (action === 'Add') {
//       const newCartItems = [...cartItems];
//       selectedItems.forEach(item => {
//         const book = books.find(book => book.id === item.id);
//         console.log(book)
//         if (book) {
//           const existingItemIndex = newCartItems.findIndex(cartItem => cartItem.id === item.id);
//           if (existingItemIndex !== -1) {
//             newCartItems[existingItemIndex].count += parseInt(item.count);
//           } else {
//             newCartItems.push({ ...book, count: parseInt(item.count) });
//           }
//         }
//       });
//       setCartItems(newCartItems);
//       console.log(newCartItems)
//     } else if (action === 'Replace') {
//       const newCartItems = selectedItems.map(item => {
//         const book = books.find(book => book.id === item.id);
//         return book ? { ...book, count: parseInt(item.count) } : null;
//       }).filter(item => item !== null);
//       setCartItems(newCartItems);
//       console.log(newCartItems)
//     }
//     setShowModal(false);
//   };

//   return (
//     <>
//       {loggedIn && order && order !== "" && order.trim() !== "" && fieldState.idprice === idpraceorder &&(
//         <button onClick={() => setShowModal(true)}>Выбрать</button>
//       )}
//       {showModal && (
//         <div>
//           {cartItems && cartItems.length > 0 ? (
//             <div>
//               <button onClick={() => handleAction('Add')}>Add</button>
//               <button onClick={() => handleAction('Replace')}>Replace</button>
//             </div>
//           ) :  <button onClick={() => handleAction('Replace')}>Replace</button>}
//         </div>
//       )}
//     </>
//   );
// };

// export default CartMemo;


