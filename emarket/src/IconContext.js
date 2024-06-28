import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

import langIcon from './components/assets/iconimg/lang.png';
import darkIcon from './components/assets/iconimg/dark.png';
import lightIcon from './components/assets/iconimg/light.png';
import emailIcon from './components/assets/iconimg/email.png';
import instIcon from './components/assets/iconimg/inst.png';
import faceIcon from './components/assets/iconimg/face.png';
import telegramIcon from './components/assets/iconimg/telegram.png';
import foneIcon from './components/assets/iconimg/fone.png';
import tikIcon from './components/assets/iconimg/tik.png';
import youIcon from './components/assets/iconimg/you.png';
import cardIcon from './components/assets/iconimg/card.png';
import locationIcon from './components/assets/iconimg/location.png';
import aboutIcon from './components/assets/iconimg/about.png';
import loading3Icon from './components/assets/iconimg/loading3.png';
import loading2Icon from './components/assets/iconimg/loading2.png';
import loading1Icon from './components/assets/iconimg/loading1.png';
import avaIcon from './components/assets/iconimg/user.png';
import carticonIcon from './components/assets/iconimg/carticon.png';
import homeIcon from './components/assets/iconimg/home.png';
import searchIcon from './components/assets/iconimg/search.png';
import categoryIcon from './components/assets/iconimg/category.png';
import notFoundIcon from './components/assets/iconimg/imageNotFound.png';
import burgerIcon from './components/assets/iconimg/burger.png';
import cancelIcon from './components/assets/iconimg/cancel.png';
import upmenuIcon from './components/assets/iconimg/upmenu.png';
import filterIcon from './components/assets/iconimg/filter.png';
import filterremoveIcon from './components/assets/iconimg/filterremove.png';
import discontIcon from './components/assets/iconimg/discont.png';
import newcartIcon from './components/assets/iconimg/new.png';
import popularIcon from './components/assets/iconimg/popular.png';
import downSortIcon from './components/assets/iconimg/down_sort.png';
import upSortIcon from './components/assets/iconimg/up_sort.png';
import listIcon from './components/assets/iconimg/list_icon.png';
import comfyIcon from './components/assets/iconimg/comfy_icon.png';
import cartaddIcon from './components/assets/iconimg/cartaddicon.png';
import cartuplIcon from './components/assets/iconimg/uploadcarticon.png';
import buynowIcon from './components/assets/iconimg/buynow.png';
import upIcon from './components/assets/iconimg/up.png';
import cartIcon from './components/assets/iconimg/cart.svg';
import backIcon from './components/assets/iconimg/back.png';
import uploadIcon from './components/assets/iconimg/orderfailure.png';
import checkIcon from './components/assets/iconimg/check.png';
import favoriteIcon from './components/assets/iconimg/favorite.png';
import addfavoriteIcon from './components/assets/iconimg/addfavorite.png';
import callIcon from './components/assets/iconimg/call.png';
import userIcon from './components/assets/iconimg/user.png';
import chatIcon from './components/assets/iconimg/chat.png';
import addressIcon from './components/assets/iconimg/location.png';
import enterIcon from './components/assets/iconimg/enter.png';
import useraddIcon from './components/assets/iconimg/useradd.png';
import logoutIcon from './components/assets/iconimg/logout.png';
import userokIcon from './components/assets/iconimg/userok.png';
import nicknameIcon from './components/assets/iconimg/nickname.png';
import passwordIcon from './components/assets/iconimg/password.png';
import infoIcon from './components/assets/iconimg/info.png';
import zoomoutIcon from './components/assets/iconimg/zoomout.png';
import zoominIcon from './components/assets/iconimg/zoomin.png';

const IconContext = createContext();

export const IconProvider = ({ children }) => {
  const initialIcons = useMemo(() => ({
    lang: langIcon,
    dark: darkIcon,
    light: lightIcon,
    email: emailIcon,
    inst: instIcon,
    face: faceIcon,
    telegram: telegramIcon,
    fone: foneIcon,
    tik: tikIcon,
    you: youIcon,
    card: cardIcon,
    location: locationIcon,
    about: aboutIcon,
    loading3: loading3Icon,
    loading2: loading2Icon,
    loading1: loading1Icon,
    ava: avaIcon,
    carticon: carticonIcon,
    home: homeIcon,
    search: searchIcon,
    category: categoryIcon,
    notFound: notFoundIcon,
    burger: burgerIcon,
    cancel: cancelIcon,
    upmenu: upmenuIcon,
    filter: filterIcon,
    filterremove: filterremoveIcon,
    discont: discontIcon,
    newcart: newcartIcon,
    popular: popularIcon,
    down_sort: downSortIcon,
    up_sort: upSortIcon,
    list_icon: listIcon,
    comfy_icon: comfyIcon,
    cartadd: cartaddIcon,
    cartupl: cartuplIcon,
    buynow: buynowIcon,
    up: upIcon,
    cart: cartIcon,
    back: backIcon,
    upload: uploadIcon,
    check: checkIcon,
    favorite: favoriteIcon,
    addfavorite: addfavoriteIcon,
    call: callIcon,
    user: userIcon,
    chat: chatIcon,
    addressIcon: addressIcon,
    enter: enterIcon,
    useradd: useraddIcon,
    logout: logoutIcon,
    userok: userokIcon,
    nickname: nicknameIcon,
    password: passwordIcon,
    info: infoIcon,
    zoomout: zoomoutIcon,
    zoomin: zoominIcon,
  }), []);

  const [icons, setIcons] = useState(initialIcons);

  // const checkImageExists = useCallback((url) => {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.onload = () => resolve(true);
  //     img.onerror = () => resolve(false);
  //     img.src = url;
  //   });
  // }, []);

  const checkImageExists = useCallback((url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded successfully:', url);
        resolve(true);
      };
      img.onerror = () => {
        console.log('Failed to load image:', url);
        resolve(false);
      };
      img.src = url;
    });
  }, []);
  

  const iconPath = useCallback(async (iconName) => {
    const folder = 'iconimg';
    const defaultUrl = initialIcons[iconName];


    const publicUrl = `${window.location.origin}${window.location.pathname}`;        
    console.log(publicUrl)
    // const url = `${process.env.PUBLIC_URL}/${folder}/${iconName}` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${iconName}`;
    //const url = `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${iconName}`;
     const url = `${process.env.PUBLIC_URL}/${folder}/${iconName}`; 
    console.log(url)  
  

    try {
      const exists = await checkImageExists(url);
      console.log('Trying to load:', url, 'Exists:', exists);
      return exists ? url : defaultUrl;
    } catch (error) {
      console.error('Error checking image existence:', error);
      return defaultUrl;
    }
  }, [checkImageExists, initialIcons]);

  useEffect(() => {
    const loadIcons = async () => {
      const iconNames = Object.keys(initialIcons);

      const iconPaths = await Promise.all(
        iconNames.map(async (iconName) => {
          try {
            const path = await iconPath(iconName);
            return [iconName, path];
          } catch (error) {
            console.error(`Error loading icon ${iconName}:`, error);
            return [iconName, initialIcons[iconName]];
          }
        })
      );

      const newIcons = Object.fromEntries(iconPaths);
      setIcons((prevIcons) => ({ ...prevIcons, ...newIcons }));
    };

    loadIcons();
  }, [iconPath, initialIcons]);

  return (
    <IconContext.Provider value={icons}>
      {children}
    </IconContext.Provider>
  );
};

export const useIcons = () => {
  return useContext(IconContext);
};





// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// import langIcon from './components/assets/iconimg/lang.png';
// import darkIcon from './components/assets/iconimg/dark.png';
// import lightIcon from './components/assets/iconimg/light.png';
// import emailIcon from './components/assets/iconimg/email.png';
// import instIcon from './components/assets/iconimg/inst.png';
// import faceIcon from './components/assets/iconimg/face.png';
// import telegramIcon from './components/assets/iconimg/telegram.png';
// import foneIcon from './components/assets/iconimg/fone.png';
// import tikIcon from './components/assets/iconimg/tik.png';
// import youIcon from './components/assets/iconimg/you.png';
// import cardIcon from './components/assets/iconimg/card.png';
// import locationIcon from './components/assets/iconimg/location.png';
// import aboutIcon from './components/assets/iconimg/about.png';
// import loading3Icon from './components/assets/iconimg/loading3.png';
// import loading2Icon from './components/assets/iconimg/loading2.png';
// import loading1Icon from './components/assets/iconimg/loading1.png';
// import avaIcon from './components/assets/iconimg/user.png';
// import carticonIcon from './components/assets/iconimg/carticon.png';
// import homeIcon from './components/assets/iconimg/home.png';
// import searchIcon from './components/assets/iconimg/search.png';
// import categoryIcon from './components/assets/iconimg/category.png';
// import notFoundIcon from './components/assets/iconimg/imageNotFound.png';
// import burgerIcon from './components/assets/iconimg/burger.png';
// import cancelIcon from './components/assets/iconimg/cancel.png';
// import upmenuIcon from './components/assets/iconimg/upmenu.png';
// import filterIcon from './components/assets/iconimg/filter.png';
// import filterremoveIcon from './components/assets/iconimg/filterremove.png';
// import discontIcon from './components/assets/iconimg/discont.png';
// import newcartIcon from './components/assets/iconimg/new.png';
// import popularIcon from './components/assets/iconimg/popular.png';
// import downSortIcon from './components/assets/iconimg/down_sort.png';
// import upSortIcon from './components/assets/iconimg/up_sort.png';
// import listIcon from './components/assets/iconimg/list_icon.png';
// import comfyIcon from './components/assets/iconimg/comfy_icon.png';
// import cartaddIcon from './components/assets/iconimg/cartaddicon.png';
// import cartuplIcon from './components/assets/iconimg/uploadcarticon.png';
// import buynowIcon from './components/assets/iconimg/buynow.png';
// import upIcon from './components/assets/iconimg/up.png';
// import cartIcon from './components/assets/iconimg/cart.svg';
// import backIcon from './components/assets/iconimg/back.png';
// import uploadIcon from './components/assets/iconimg/orderfailure.png';
// import checkIcon from './components/assets/iconimg/check.png';
// import favoriteIcon from './components/assets/iconimg/favorite.png';
// import addfavoriteIcon from './components/assets/iconimg/addfavorite.png';
// import callIcon from './components/assets/iconimg/call.png';
// import userIcon from './components/assets/iconimg/user.png';
// import chatIcon from './components/assets/iconimg/chat.png';
// import addressIcon from './components/assets/iconimg/location.png';
// import enterIcon from './components/assets/iconimg/enter.png';
// import useraddIcon from './components/assets/iconimg/useradd.png';
// import logoutIcon from './components/assets/iconimg/logout.png';
// import userokIcon from './components/assets/iconimg/userok.png';
// import nicknameIcon from './components/assets/iconimg/nickname.png';
// import passwordIcon from './components/assets/iconimg/password.png';
// import infoIcon from './components/assets/iconimg/info.png';
// import zoomoutIcon from './components/assets/iconimg/zoomout.png';
// import zoominIcon from './components/assets/iconimg/zoomin.png';

// const IconContext = createContext();

// export const IconProvider = ({ children }) => {
//   // Initial default icons
//   const initialIcons = {
//     lang: langIcon,
//     dark: darkIcon,
//     light: lightIcon,
//     email: emailIcon,
//     inst: instIcon,
//     face: faceIcon,
//     telegram: telegramIcon,
//     fone: foneIcon,
//     tik: tikIcon,
//     you: youIcon,
//     card: cardIcon,
//     location: locationIcon,
//     about: aboutIcon,
//     loading3: loading3Icon,
//     loading2: loading2Icon,
//     loading1: loading1Icon,
//     ava: avaIcon,
//     carticon: carticonIcon,
//     home: homeIcon,
//     search: searchIcon,
//     category: categoryIcon,
//     notFound: notFoundIcon,
//     burger: burgerIcon,
//     cancel: cancelIcon,
//     upmenu: upmenuIcon,
//     filter: filterIcon,
//     filterremove: filterremoveIcon,
//     discont: discontIcon,
//     newcart: newcartIcon,
//     popular: popularIcon,
//     down_sort: downSortIcon,
//     up_sort: upSortIcon,
//     list_icon: listIcon,
//     comfy_icon: comfyIcon,
//     cartadd: cartaddIcon,
//     cartupl: cartuplIcon,
//     buynow: buynowIcon,
//     up: upIcon,
//     cart: cartIcon,
//     back: backIcon,
//     upload: uploadIcon,
//     check: checkIcon,
//     favorite: favoriteIcon,
//     addfavorite: addfavoriteIcon,
//     call: callIcon,
//     user: userIcon,
//     chat: chatIcon,
//     addressIcon: addressIcon,
//     enter: enterIcon,
//     useradd: useraddIcon,
//     logout: logoutIcon,
//     userok: userokIcon,
//     nickname: nicknameIcon,
//     password: passwordIcon,
//     info: infoIcon,
//     zoomout: zoomoutIcon,
//     zoomin: zoominIcon,
//   };

//   const [icons, setIcons] = useState(initialIcons);

//   const checkImageExists = useCallback((url) => {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.onload = () => resolve(true);
//       img.onerror = () => resolve(false);
//       img.src = url;
//     });
//   }, []);

//   const iconPath = useCallback(async (iconName) => {
//     const folder = 'iconimg';
//     const publicUrl = `${window.location.origin}${window.location.pathname}`;
//     const defaultUrl = initialIcons[iconName];
//     const url = `${process.env.PUBLIC_URL}/${folder}/${iconName}` 
//     || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${iconName}`;

//     const exists = await checkImageExists(url);
//     return exists ? url : defaultUrl;
//   }, [checkImageExists]);

//   useEffect(() => {
//     const loadIcons = async () => {
//       const iconNames = Object.keys(initialIcons);

//       const iconPaths = await Promise.all(
//         iconNames.map(async (iconName) => {
//           const path = await iconPath(iconName);
//           return [iconName, path];
//         })
//       );

//       const newIcons = Object.fromEntries(iconPaths);
//       setIcons(newIcons);
//     };

//     loadIcons();
//   }, [iconPath]);

//   return (
//     <IconContext.Provider value={icons}>
//       {children}
//     </IconContext.Provider>
//   );
// };

// export const useIcons = () => {
//   return useContext(IconContext);
// };




// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// const IconContext = createContext();

// export const IconProvider = ({ children }) => {
//   const [icons, setIcons] = useState({});

//   const checkImageExists = useCallback((url) => {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.onload = () => resolve(true);
//       img.onerror = () => resolve(false);
//       img.src = url;
//     });
//   }, []);

//   const iconPath = useCallback(async (iconName) => {
//     const folder = 'iconimg';
//     const publicUrl = `${window.location.origin}${window.location.pathname}`;    
//     const defaultUrl = require(`./components/assets/iconimg/${iconName}`); 

//     const url = `${process.env.PUBLIC_URL}/${folder}/${iconName}` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${iconName}`;
    
//     const exists = await checkImageExists(url);
//     return exists ? url : defaultUrl;
//   }, [checkImageExists]);

//   useEffect(() => {
//     const loadIcons = async () => {
//       const lang = await iconPath('lang.png');
//       const dark = await iconPath('dark.png');
//       const light = await iconPath('light.png');
//       const email = await iconPath('email.png');
//       const inst = await iconPath('inst.png');
//       const face = await iconPath('face.png');
//       const telegram = await iconPath('telegram.png');
//       const fone = await iconPath('fone.png');
//       const tik = await iconPath('tik.png');
//       const you = await iconPath('you.png');
//       const card = await iconPath('card.png');
//       const location = await iconPath('location.png');
//       const about = await iconPath('about.png');
//       const loading3 = await iconPath('loading3.png');
//       const loading2 = await iconPath('loading2.png');
//       const loading1 = await iconPath('loading1.png');
//       const ava = await iconPath('user.png');
//       const carticon = await iconPath('carticon.png');
//       const home = await iconPath('home.png');
//       const search = await iconPath('search.png');
//       const category = await iconPath('category.png');
//       const notFound = await iconPath('imageNotFound.png');


//       const burger = await iconPath('burger.png');
//       const cancel = await iconPath('cancel.png');
//       const upmenu = await iconPath('upmenu.png');
//       const filter = await iconPath('filter.png');
     
//       const filterremove = await iconPath('filterremove.png');
      
//       const discont = await iconPath('discont.png');
//       const newcart = await iconPath('new.png');
//       const popular = await iconPath('popular.png');
//       const down_sort = await iconPath('down_sort.png');
//       const up_sort = await iconPath('up_sort.png');
//       const list_icon = await iconPath('list_icon.png');
//       const comfy_icon = await iconPath('comfy_icon.png');

//       const cartadd = await iconPath('cartaddicon.png');
//       const cartupl = await iconPath('uploadcarticon.png');
//       const buynow = await iconPath('buynow.png');

//       const up = await iconPath('up.png');

//       const cart = await iconPath('cart.svg');
//       const back = await iconPath('back.png');
//       const upload = await iconPath('orderfailure.png');
//       const check = await iconPath('check.png');
//       const favorite = await iconPath('favorite.png');
//       const addfavorite = await iconPath('addfavorite.png');
//       const call = await iconPath('call.png');
      
//       const user = await iconPath('user.png');
//       const chat = await iconPath('chat.png');
//       const addressIcon = await iconPath('location.png');
//       const enter = await iconPath('enter.png');
//       const useradd = await iconPath('useradd.png');
//       const logout = await iconPath('logout.png');
//       const userok = await iconPath('userok.png');
//       const nickname = await iconPath('nickname.png');
//       const password = await iconPath('password.png');
      
//       const info = await iconPath('info.png');
     
//       const zoomout = await iconPath('zoomout.png');
//       const zoomin = await iconPath('zoomin.png');
     
      
      

//       setIcons({
//         lang,
//         burger,
//         cancel,
//         upmenu,
//         filter,
//         search,
//         filterremove, 
//         notFound,
//         discont,
//         newcart, 
//         popular, 
//         down_sort,  
//         up_sort,  
//         list_icon, 
//         comfy_icon,
//         cart,
//         back,
//         upload,
//         check,
//         favorite,
//         addfavorite,
//         call,
//         email,
//         user,
//         chat,
//         addressIcon,
//         enter,
//         useradd,
//         logout,
//         userok,
//         nickname,
//         password,
//         ava,
//         carticon,
//         home,
//         category,
//         info,
//         cartadd,
//         cartupl,
//         buynow,
//         zoomout,
//         zoomin,
//         up,
//         loading3,
//         loading2,
//         loading1,
//         dark,
//         light,
//         inst,
//         face,
//         telegram,
//         fone,
//         tik,
//         you,
//         card,
//         location,
//         about,       
//       });
//     };

//     loadIcons();
//   }, [iconPath]);
// console.log(icons)
//   return (
//     <IconContext.Provider value={icons}>
//       {children}
//     </IconContext.Provider>
//   );
// };

// export const useIcons = () => {
//   return useContext(IconContext);
// };