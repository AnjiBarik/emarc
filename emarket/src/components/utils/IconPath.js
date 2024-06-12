import { useEffect, useState } from 'react';

const IconPath = (iconName) => {
  const [iconPath, setIconPath] = useState('');

  const loadIcon = async (src) => {
    try {
      const img = new Image();
      img.src = src;
      await new Promise((resolve) => { img.onload = resolve; });     
      return src;           
    } catch {
      return false;
    }
  };
 
  useEffect(() => {
    const getIconPath = async () => {
      const PablikIconPath = `${process.env.PUBLIC_URL}/iconimg/${iconName}`;
      const validPath = await loadIcon(PablikIconPath);
      console.log(validPath)
      setIconPath(validPath);
    };

    getIconPath();
  }, [iconName]);

  return iconPath;
};

export default IconPath;

// import { useEffect, useState } from 'react';

// const IconPath = (iconName) => {
//   const [iconPath, setIconPath] = useState('');

//   const loadIcon = async (src) => {
//     try {
//       const img = new Image();
//       img.src = src;
//       await new Promise((resolve) => { img.onload = resolve; });
//       return src;
//     } catch {
//       return false;
//     }
//   };

//   useEffect(() => {
//     const getIconPath = async () => {
//       const PablikIconPath = `${process.env.PUBLIC_URL}/iconimg/${iconName}`;
//       const validPath = await loadIcon(PablikIconPath);
//       console.log(validPath)
//       setIconPath(validPath);
//     };

//     getIconPath();
//   }, [iconName]);

//   return iconPath;
// };

// export default IconPath;

// Pablik IconPath for theme
// import { useEffect, useState, useContext } from 'react';
// import { BooksContext } from '../../BooksContext';

// const IconPath = (iconName) => {
//   const { theme } = useContext(BooksContext);
//   const [iconPath, setIconPath] = useState('');

//   const loadIcon = (src) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.src = src;
//       img.onload = () => resolve(src);
//       img.onerror = () => reject();
//     });
//   };

  

//   useEffect(() => {
//     const darkIconPath = `${process.env.PUBLIC_URL}/iconimg/dark/${iconName}`;
//     const liteIconPath = `${process.env.PUBLIC_URL}/iconimg/${iconName}`;
   

//     const checkIconPath = async () => {
//       if (theme === 'dark') {
//         try {
//           const validPath = await loadIcon(darkIconPath);
//           setIconPath(validPath);
//         } catch {
//           try {
//             const validPath = await loadIcon(liteIconPath);
//             setIconPath(validPath);
//           } catch {
//             setIconPath(false)
//           }
//         }
//       } else {
//         try {
//           const validPath = await loadIcon(liteIconPath);
//           setIconPath(validPath);
//         } catch {
          
//           setIconPath(false)
//         }
//       }
//     };

//     checkIconPath();
//   }, [theme, iconName]);

//   return iconPath;
// };

// export default IconPath;


// import { useEffect, useState, useContext } from 'react';
// import { BooksContext } from '../../BooksContext';

// const IconPath = (iconName) => {
//   const { theme } = useContext(BooksContext);
//   const [iconPath, setIconPath] = useState('');

//   const loadIcon = async (src) => {
//     try {
//       const img = new Image();
//       img.src = src;
//       await new Promise((resolve) => { img.onload = resolve; });
//       return src;
//     } catch {
//       return false;
//     }
//   };

//   useEffect(() => {
//     const getIconPath = async () => {
//       const themePath = theme === 'dark' ? '/img/dark/' : '/img/';
//       const validPath = await loadIcon(`${process.env.PUBLIC_URL}${themePath}${iconName}`);
//       console.log(validPath)
//       setIconPath(validPath);
//     };

//     getIconPath();
//   }, [theme, iconName]);

//   return iconPath;
// };

// export default IconPath;








// import  { useEffect, useState, useContext } from 'react';
// import { BooksContext } from '../../BooksContext';

// const IconPath = ( iconName ) => {
//     const { theme } = useContext(BooksContext);
//     const [iconPath, setIconPath] = useState('');


//     // useEffect(() => {
//     //   const darkIconPath = `${process.env.PUBLIC_URL}/img/dark/${iconName}`;
//     //   const defaultIconPath = `${process.env.PUBLIC_URL}/img/${iconName}`;
  
//     //   const checkIconPath = async () => {
//     //     try {
//     //       const response = await fetch(darkIconPath);
//     //       const text = await response.text();
          
//     //       // Check if the response contains an error message or unexpected content
//     //       if (!response.ok || text.includes('You need to enable JavaScript to run this app') || text.includes('<html>')) {
//     //         setIconPath(defaultIconPath);
//     //       } else {
//     //         setIconPath(darkIconPath);
//     //       }
//     //     } catch (error) {
//     //       setIconPath(defaultIconPath);
//     //     }
//     //   };
  
//     //   if (theme === 'dark') {
//     //     checkIconPath();
//     //   } else {
//     //     setIconPath(defaultIconPath);
//     //   }
//     // }, [theme, iconName]);

//     const loadIcon = (src, fallback) => {
//         return new Promise((resolve, reject) => {
//           const img = new Image();
//           img.src = src;
//           img.onload = () => resolve(src);
//           console.log(src)
//           img.onerror = () => reject(fallback);
//         });
//       };
    
//       useEffect(() => {
//         const darkIconPath = `${process.env.PUBLIC_URL}/img/dark/${iconName}`;
//         const liteIconPath = `${process.env.PUBLIC_URL}/img/${iconName}`;
//         const defaultIconPath = `../cart/img/${iconName}`;
    
//         const checkIconPath = async () => {
//           if (theme === 'dark') {
//             try {
//               // const validPath = await loadIcon(darkIconPath, defaultIconPath);
//              // const validPath = await loadIcon(darkIconPath, liteIconPath);
//            // console.log(await loadIcon(darkIconPath, liteIconPath))
            
//               //  const validPath2 = await loadIcon(validPath, defaultIconPath);
//             const validPath2 = await loadIcon(darkIconPath);
                     
//             console.log(validPath2)  
//             setIconPath(validPath2);
//             } catch {
//               try{
//               const validPath2 = await loadIcon(liteIconPath);
//               console.log(validPath2)  
//             setIconPath(validPath2);
//               }
              
//               catch {
//               setIconPath(defaultIconPath);
//               console.log(defaultIconPath)
//             }
//           }
//           } else {
//             try{
//             const validPath2 = await loadIcon(liteIconPath);
//             setIconPath(validPath2);
//             console.log(validPath2)
//           } catch {
//             setIconPath(defaultIconPath);
//               console.log(defaultIconPath)
//           }    
//           }
//         };
    
//         checkIconPath();
//       }, [theme, iconName]);
    
//       return iconPath;
//     };
    
//     export default IconPath;