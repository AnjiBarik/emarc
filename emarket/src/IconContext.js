import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const IconContext = createContext();

export const IconProvider = ({ children }) => {
  const [icons, setIcons] = useState({});

  const checkImageExists = useCallback((url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }, []);

  const iconPath = useCallback(async (iconName) => {
    const folder = 'iconimg';
    const publicUrl = `${window.location.origin}${window.location.pathname}`;    
    const defaultUrl = require(`./components/assets/iconimg/${iconName}`); 

    const url = `${process.env.PUBLIC_URL}/${folder}/${iconName}` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${iconName}`;
    
    const exists = await checkImageExists(url);
    return exists ? url : defaultUrl;
  }, [checkImageExists]);

  useEffect(() => {
    const loadIcons = async () => {
      const lang = await iconPath('lang.png');
      const burger = await iconPath('burger.png');
      const cancel = await iconPath('cancel.png');
      const upmenu = await iconPath('upmenu.png');
      const filter = await iconPath('filter.png');
      const search = await iconPath('search.png');
      const filterremove = await iconPath('filterremove.png');
      const notFound = await iconPath('imageNotFound.png');
      const discont = await iconPath('discont.png');
      const newcart = await iconPath('new.png');
      const popular = await iconPath('popular.png');
      const down_sort = await iconPath('down_sort.png');
      const up_sort = await iconPath('up_sort.png');
      const list_icon = await iconPath('list_icon.png');
      const comfy_icon = await iconPath('comfy_icon.png');
      const cart = await iconPath('cart.svg');
      const back = await iconPath('back.png');
      const upload = await iconPath('orderfailure.png');
      const check = await iconPath('check.png');
      const favorite = await iconPath('favorite.png');
      const addfavorite = await iconPath('addfavorite.png');
      const call = await iconPath('call.png');
      const email = await iconPath('email.png');
      const user = await iconPath('user.png');
      const chat = await iconPath('chat.png');
      const addressIcon = await iconPath('location.png');
      const enter = await iconPath('enter.png');
      const useradd = await iconPath('useradd.png');
      const logout = await iconPath('logout.png');
      const userok = await iconPath('userok.png');
      const nickname = await iconPath('nickname.png');
      const password = await iconPath('password.png');
      const ava = await iconPath('user.png');
      const carticon = await iconPath('carticon.png');
      const home = await iconPath('home.png');
      const category = await iconPath('category.png');
      const info = await iconPath('info.png');
      const cartadd = await iconPath('cartaddicon.png');
      const cartupl = await iconPath('uploadcarticon.png');
      const buynow = await iconPath('buynow.png');
      const zoomout = await iconPath('zoomout.png');
      const zoomin = await iconPath('zoomin.png');
      const up = await iconPath('up.png');
      const loading3 = await iconPath('loading3.png');
      const loading2 = await iconPath('loading2.png');
      const loading1 = await iconPath('loading1.png');
      const dark = await iconPath('dark.png');
      const light = await iconPath('light.png');
      const inst = await iconPath('inst.png');
      const face = await iconPath('face.png');
      const telegram = await iconPath('telegram.png');
      const fone = await iconPath('fone.png');
      const tik = await iconPath('tik.png');
      const you = await iconPath('you.png');
      const card = await iconPath('card.png');
      const location = await iconPath('location.png');
      const about = await iconPath('about.png');

      setIcons({
        lang,
        burger,
        cancel,
        upmenu,
        filter,
        search,
        filterremove, 
        notFound,
        discont,
        newcart, 
        popular, 
        down_sort,  
        up_sort,  
        list_icon, 
        comfy_icon,
        cart,
        back,
        upload,
        check,
        favorite,
        addfavorite,
        call,
        email,
        user,
        chat,
        addressIcon,
        enter,
        useradd,
        logout,
        userok,
        nickname,
        password,
        ava,
        carticon,
        home,
        category,
        info,
        cartadd,
        cartupl,
        buynow,
        zoomout,
        zoomin,
        up,
        loading3,
        loading2,
        loading1,
        dark,
        light,
        inst,
        face,
        telegram,
        fone,
        tik,
        you,
        card,
        location,
        about,       
      });
    };

    loadIcons();
  }, [iconPath]);

  return (
    <IconContext.Provider value={icons}>
      {children}
    </IconContext.Provider>
  );
};

export const useIcons = () => {
  return useContext(IconContext);
};