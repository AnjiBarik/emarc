import { BooksContext } from '../../BooksContext';
import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../utils/LoadingAnimation';
import ClearAll from '../utils/ClearAll'; 

export default function Form() {
  const { setBooks, setFieldState, uiMain, idLoudPrice, setIdLoudPrice, loggedIn, selectUiState } = useContext(BooksContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearAll = ClearAll({ 
    clearLogin: loggedIn && uiMain.Urregform && selectUiState.Urregform && uiMain.Urregform === selectUiState.Urregform 
  });

  function Submit(e) {
    e.preventDefault();
    setLoading(true);

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
        alert('⚠️Price did not load, try another one or later');
      })
      .finally(() => {
        setLoading(false);
        clearAll.resetStates();
        navigate('/BookList');
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