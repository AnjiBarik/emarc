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
     




      setIcons({
        lang,
        burger,
        cancel,
        upmenu,
        filter,
        search,
        
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