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

  const checkImageExists = useCallback((url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }, []);

  const iconPath = useCallback(async (iconName, iconKey) => {
    try {
      const folder = 'iconimg';
      const publicUrl = `${window.location.origin}${window.location.pathname}`;
      const defaultUrl = initialIcons[iconKey];

      const url = `${process.env.PUBLIC_URL}/${folder}/${iconName}` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${iconName}`;

      const exists = await checkImageExists(url);
      return exists ? url : defaultUrl;
    } catch (error) {
      console.error(`Error loading icon ${iconName}:`, error);
      return initialIcons[iconKey];
    }
  }, [checkImageExists, initialIcons]);

  const loadIcons = useCallback(async () => {
    const iconsToLoad = [
      { name: 'lang.png', key: 'lang' },
      { name: 'dark.png', key: 'dark' },
      { name: 'light.png', key: 'light' },
      { name: 'email.png', key: 'email' },
      { name: 'inst.png', key: 'inst' },
      { name: 'face.png', key: 'face' },
      { name: 'telegram.png', key: 'telegram' },
      { name: 'fone.png', key: 'fone' },
      { name: 'tik.png', key: 'tik' },
      { name: 'you.png', key: 'you' },
      { name: 'card.png', key: 'card' },
      { name: 'location.png', key: 'location' },
      { name: 'about.png', key: 'about' },
      { name: 'loading3.png', key: 'loading3' },
      { name: 'loading2.png', key: 'loading2' },
      { name: 'loading1.png', key: 'loading1' },
      { name: 'user.png', key: 'ava' },
      { name: 'carticon.png', key: 'carticon' },
      { name: 'home.png', key: 'home' },
      { name: 'search.png', key: 'search' },
      { name: 'category.png', key: 'category' },
      { name: 'imageNotFound.png', key: 'notFound' },
      { name: 'burger.png', key: 'burger' },
      { name: 'cancel.png', key: 'cancel' },
      { name: 'upmenu.png', key: 'upmenu' },
      { name: 'filter.png', key: 'filter' },
      { name: 'filterremove.png', key: 'filterremove' },
      { name: 'discont.png', key: 'discont' },
      { name: 'new.png', key: 'newcart' },
      { name: 'popular.png', key: 'popular' },
      { name: 'down_sort.png', key: 'down_sort' },
      { name: 'up_sort.png', key: 'up_sort' },
      { name: 'list_icon.png', key: 'list_icon' },
      { name: 'comfy_icon.png', key: 'comfy_icon' },
      { name: 'cartaddicon.png', key: 'cartadd' },
      { name: 'uploadcarticon.png', key: 'cartupl' },
      { name: 'buynow.png', key: 'buynow' },
      { name: 'up.png', key: 'up' },
      { name: 'cart.svg', key: 'cart' },
      { name: 'back.png', key: 'back' },
      { name: 'orderfailure.png', key: 'upload' },
      { name: 'check.png', key: 'check' },
      { name: 'favorite.png', key: 'favorite' },
      { name: 'addfavorite.png', key: 'addfavorite' },
      { name: 'call.png', key: 'call' },
      { name: 'user.png', key: 'user' },
      { name: 'chat.png', key: 'chat' },
      { name: 'location.png', key: 'addressIcon' },
      { name: 'enter.png', key: 'enter' },
      { name: 'useradd.png', key: 'useradd' },
      { name: 'logout.png', key: 'logout' },
      { name: 'userok.png', key: 'userok' },
      { name: 'nickname.png', key: 'nickname' },
      { name: 'password.png', key: 'password' },
      { name: 'info.png', key: 'info' },
      { name: 'zoomout.png', key: 'zoomout' },
      { name: 'zoomin.png', key: 'zoomin' },
    ];

    const loadedIcons = {};

    for (const icon of iconsToLoad) {
      try {
        loadedIcons[icon.key] = await iconPath(icon.name, icon.key);
      } catch (error) {
        console.error(`Error loading icon ${icon.name}:`, error);
      }
    }

    setIcons(loadedIcons);
  }, [iconPath]);

  useEffect(() => {
    loadIcons();
  }, [loadIcons]);

 // console.log(icons);

  return (
    <IconContext.Provider value={icons}>
      {children}
    </IconContext.Provider>
  );
};

export const useIcons = () => {
  return useContext(IconContext);
};