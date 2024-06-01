import React, { useState, useEffect } from "react";
import loading3 from '../cart/img/loading3.png';
import loading2 from '../cart/img/loading2.png';
import loading1 from '../cart/img/loading1.png';

const LoadingAnimation = () => {
  const [loadingImage, setLoadingImage] = useState(loading1);

  useEffect(() => {
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

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return <img src={loadingImage} className='loading' alt="Loading" />;
};

export default LoadingAnimation;
