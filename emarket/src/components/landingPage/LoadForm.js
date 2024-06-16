import { BooksContext } from '../../BooksContext';
import React, { useContext, useState } from "react";
import LoadingAnimation from '../utils/LoadingAnimation';  

export default function Form() {
  const { setBooks, setFieldState, uiMain, idLoudPrice, setIdLoudPrice, setCartItems, setTotalPrice, setTotalCount } = useContext(BooksContext);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      {idLoudPrice !== uiMain.id && (
        <div className='container-submit'>
          {loading ? (
            <LoadingAnimation />
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
