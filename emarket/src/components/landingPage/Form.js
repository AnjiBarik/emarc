import { BooksContext } from '../../BooksContext';
import React, { useContext, useState, useEffect } from "react";
import loading3 from '../cart/img/loading3.png';
import loading2 from '../cart/img/loading2.png';
import loading1 from '../cart/img/loading1.png';

export default function Form() {
  const { setBooks, setFieldState, uiMain, idLoudPrice, setIdLoudPrice, setCartItems, setTotalPrice, setTotalCount } = useContext(BooksContext);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(loading1);

  function Submit(e) {
    e.preventDefault();
    setLoading(true);

    const clearCart = () => {
      setCartItems([]);
      setTotalPrice(0);
      setTotalCount(0);     
    };

    const formEle = document.querySelector("form");
    const formDatab = new FormData(formEle);
    const apiUrl = uiMain.Urprice;

    fetch(apiUrl, { method: "POST", body: formDatab })
      .then((res) => res.json())
      .then((data) => {
        const lastIndex = data.length - 1;
        const lastItem = data[lastIndex];
        const otherItems = data.slice(0, lastIndex);

        setBooks(otherItems);
        setFieldState(lastItem);
        setIdLoudPrice(uiMain.id);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      })
      .finally(() => {
        setLoading(false);
        clearCart();
      });
  }

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingImage((prevImage) => {
          if (prevImage === loading1) {
            return loading2;
          } else if (prevImage === loading2) {
            return loading3;
          } else {
            return loading1;
          }
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [loading]);
//console.log(idLoudPrice)
  return (
    <>
      {idLoudPrice !== uiMain.id && (
        <div className='container-submit'>
          {loading ? (
            <img src={loadingImage} className='loading' alt="Loading" />
          ) : (
            <form className="form" onSubmit={Submit}>
              <input
                name="submit"
                type="submit"
                className='loading-submit color-transition'
                value={uiMain.shopping || "Start shopping"}
              />
            </form>
          )}
        </div>
      )}
    </>
  );
}



// import { BooksContext } from '../../BooksContext';
// import React, { useContext, useState, useEffect } from "react";
// //import { Link } from "react-router-dom";
// import loading3 from '../cart/img/loading3.png';
// import loading2 from '../cart/img/loading2.png';
// import loading1 from '../cart/img/loading1.png';
// //import { useNavigate } from 'react-router-dom'; 

// export default function Form() {
//   const { setBooks, books, fieldState, setFieldState, uiMain, idLoudPrice, setIdLoudPrice, setCartItems,  setTotalPrice, setTotalCount} = useContext(BooksContext);
//   const [loading, setLoading] = useState(false);
//   const [loadingImage, setLoadingImage] = useState(loading1);
//   //const navigate = useNavigate(); 

//   function Submit(e) {
//     e.preventDefault();
//     setLoading(true);

//     const clearCart = () => {
//       setCartItems([]);
//       setTotalPrice(0);
//       setTotalCount(0);     
//     };


//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);
//     // const apiUrl = "https://script.google.com/macros/s/AKfycbybvuGbsK7-2Wa8PFYurOjt7R6a4wq3NnzqAcMn6tLLGBIxpa6o_KUkVLXX5SDkG7P4ng/exec";
//     const apiUrl = uiMain.Urprice
// console.log(apiUrl );

//     fetch(apiUrl, { method: "POST", body: formDatab })
//       .then((res) => res.json())
//       .then((data) => {
//         // console.log(data);
//         // setBooks(data);
//         // console.log(books);
//         const lastIndex = data.length - 1;
//     const lastItem = data[lastIndex];
//     const otherItems = data.slice(0, lastIndex);

//     console.log(lastItem);
//     console.log(typeof(lastItem));
//     console.log(otherItems);

//     setBooks(otherItems); // Присваиваем все элементы, кроме последнего, состоянию books
//     setFieldState(lastItem); // Присваиваем последний элемент состоянию setFieldState

//     setIdLoudPrice(uiMain.id)


//     console.log(books);
//     console.log(fieldState);
//     console.log(typeof(fieldState));
//       })
//       .catch((error) => {
//         console.log(error);
//       })
//       .finally(() => {
//         setLoading(false);
//         clearCart();
//         //navigate('/BookList'); 
//       });
//   }

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setLoadingImage((prevImage) => {
//         if (prevImage === loading1) {
//           return loading2;
//         } else if (prevImage === loading2) {
//           return loading3;
//         } else {
//           return loading1;
//         }
//       });
//     }, 200);
//     return () => clearInterval(interval);
//   }, []);
// //console.log(idLoudPrice)
//   return (
//     <>
//    {idLoudPrice !== uiMain.id &&(
   
//     <div className='container-submit'>
//       {loading ? (
//         <img src={loadingImage} className='loading' alt="Loading" />
//       ) : (
//         <form className="form" onSubmit={(e) => Submit(e)}>
//            {/* {uiMain.id}
//            {idLoudPrice}
//          {uiMain.Urprice} */}
        
//           <input name="submit" type="submit" className='loading-submit color-transition' value={uiMain.shopping || "Start shopping"} />
//         </form>
//       )}
//     </div>
    
//     )}
//     </>
//   );
// }






// import { BooksContext } from '../../BooksContext';
// import React, { useContext, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import loading3 from '../cart/img/loading3.png';
// import loading2 from '../cart/img/loading2.png';
// import loading1 from '../cart/img/loading1.png';

// export default function Form() {
//   const { setBooks, theme, books } = useContext(BooksContext);
//   const [loading, setLoading] = useState(false);
//   const [loadingImage, setLoadingImage] = useState(loading1);

//   function Submit(e) {
//     e.preventDefault();
//     setLoading(true);
//     const formEle = document.querySelector("form");
//     const formDatab = new FormData(formEle);
//     const apiUrl = "https://script.google.com/macros/s/AKfycbzEVBlyWipAkf4hGHRkEh9cfUAc4ogY-1qF8bLg3YMqk2qa5-jnaWjyBVrIWOZ3gF4QLA/exec";
//     fetch(apiUrl, {
//       method: "POST",
//       body: formDatab
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         setBooks(data);
//         console.log(books);
//       })
//       .catch((error) => {
//         console.log(error);
//       })
//       .finally(() => {
//         setLoading(false);
//         <Link to="/"> Go</Link>
//       });
//   }

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setLoadingImage((prevImage) => {
//         if (prevImage === loading1) {
//           return loading2;
//         } else if (prevImage === loading2) {
//           return loading3;
//         } else {
//           return loading1;
//         }
//       });
//     }, 200);

//     return () => clearInterval(interval);
//   }, []);

//   return (
    
//     <div className='container-submit'>
//       {loading ? (
//         <img src={loadingImage} className='loading' alt="Loading" />
//       ) : (
//         <form className="form" onSubmit={(e) => Submit(e)}>
        
//           <input name="submit" type="submit" className='loading-submit' value="Shopping" />
         
//         </form>
//       )}
//     </div>
    
    // <div className={theme}>
    //   {loading ? (
    //     <p>Загрузка...</p>
    //   ) : (
    //     <form className="form" onSubmit={(e) => Submit(e)}>
          
    //       <input name="submit" type="submit" value="Submit" />
    //     </form>
    //   )}
    // </div>
//   );
// }


// import { BooksContext } from '../../BooksContext';
// import React, { useContext } from "react";

// export default function Form() {
//   const {setBooks, theme, books,}=useContext(BooksContext)
//   function Submit(e) {
//       const formEle = document.querySelector("form");
//       const formDatab = new FormData(formEle);
//       const apiUrl = "https://script.google.com/macros/s/AKfycbzEVBlyWipAkf4hGHRkEh9cfUAc4ogY-1qF8bLg3YMqk2qa5-jnaWjyBVrIWOZ3gF4QLA/exec";
//       fetch(
//         apiUrl,
//         {
//           method: "POST",
//           body: formDatab
//         }
//       )
//         .then((res) => res.json())
//         .then((data) => {
//           console.log(data);
//           console.log(typeof(data))
//           setBooks(data)
//           console.log(books)
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//     return (
//       <div className={theme}>
        
      
//           <form className="form" onSubmit={(e) => Submit(e)}>
//             {/* <input placeholder="Your Name" name="Name" type="text" /> */}
//             {/* <input placeholder="Your Email" name="Email" type="text" />
//             <input placeholder="Your Message" name="Message" type="text" /> */}
//             <input name="submit" type="submit"  value="Submit"/>
//           </form>
//         </div>
     
//     );
//   }
  