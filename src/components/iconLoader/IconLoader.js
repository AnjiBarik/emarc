import React, { useEffect, useState } from 'react';
import { IconProvider } from '../../IconContext';
import { initialIcons } from './iconImports';  
import getPublicUrl from '../functional/getPublicUrl';

const IconLoader = ({ children }) => {
  const [loadedIcons, setLoadedIcons] = useState(null);

  useEffect(() => {
    const checkImageExists = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    const iconPath = async (iconName, defaultUrl) => {
      const folder = 'iconimg';
      const url = getPublicUrl({ folder, filename: iconName });
      const exists = await checkImageExists(url);
      return exists ? url : defaultUrl;
    };

    const loadIcons = async () => {
      const iconsToLoad = Object.keys(initialIcons).map((key) => ({
        name: `${key}.png`,
        key,
      }));

      const loadedIcons = {};

      for (const icon of iconsToLoad) {
        try {
          loadedIcons[icon.key] = await iconPath(icon.name, initialIcons[icon.key]);
        } catch (error) {
          console.error(`Error loading icon ${icon.name}:`, error);
        }
      }

      setLoadedIcons(loadedIcons);
    };

    loadIcons();
  }, []);

  if (!loadedIcons) {
    return <div>Loading icons...</div>;
  }

  return (
    <IconProvider icons={loadedIcons}>
      {children}
    </IconProvider>
  );
};

export default IconLoader;
