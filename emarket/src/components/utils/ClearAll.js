import React, { useContext } from "react";
import { BooksContext } from '../../BooksContext';

export default function ClearAll({ clearLogin }) {
  const { setCartItems, setTotalPrice, setTotalCount, setSelectedSection, setSelectedSubsection, setInput, setSelectedTags1, setSelectedTags2, setSelectedSizes, setSelectedColor, setSelectedAuthors, setSelectedTags3, setSelectedTags4, setSearch, setSearchOptions, setLoggedIn, setSavedLogin, setSavedPassword } = useContext(BooksContext);

  const resetStates = () => {
    setCartItems([]);
    setTotalPrice(0);
    setTotalCount(0);
    setSelectedSection(null);
    setSelectedSubsection(null);
    setInput('');
    setSelectedTags1([]);
    setSelectedTags2([]);
    setSelectedSizes([]);
    setSelectedColor([]);
    setSelectedAuthors([]);
    setSelectedTags3([]);
    setSelectedTags4([]);
    setSearch("");
    setSearchOptions({
      byTitle: true,
      byID: true,
      byAuthor: true,
      byTags: false,
      byDescription: false
    });

    if (!clearLogin) {
      setLoggedIn(false);
      setSavedLogin('');
      setSavedPassword('');
    }
  };

  return { resetStates };
}
