import React from "react";
import { Route, Routes } from "react-router-dom";
import BookList from "./components/book-list/BookList";
import Cart from "./components/cart/Cart";
import SpecificBook from "./components/specific-book/SpecificBook";
import Page404 from "./components/Page404";
import { Layout } from "./components/Layout";
import Form from "./components/cart/Rform";
//import { BooksContext } from "./BooksContext";
//import useGoogleSheets from 'use-google-sheets';
import RegistrationForm from "./components/cart/RegistrationForm"
import Filter from "./components/book-list/Filter";
import Search from "./components/book-list/Search";
import LandingPage from "./components/landingPage/LandingPage";

function App() {

return (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<LandingPage />} />
      <Route path="BookList" element={<BookList />} />
      <Route path="cart" element={<Cart />} />
      <Route path="specificbook" element={<SpecificBook />} />
      <Route path="Filter" element={<Filter />} />
      <Route path="Search" element={<Search />} />
      <Route path="RegistrationForm" element={<RegistrationForm />} />
      <Route path="Form" element={<Form />} />
      <Route path="*" element={<Page404 />} />
    </Route>
  </Routes>
);




  // return (
  //   <>
  //     <Routes>
        
  //       <Route path="/" element={<Layout />}>
                      
  //       <Route index element={<LandingPage />} />
                
  //       <Route path="BookList" element={<BookList />} />
                      
  //       <Route path="cart" element={<Cart />} />
       
  //       <Route path="specificbook" element={<SpecificBook />} />

  //       <Route path="Filter" element={<Filter />} />
  //       <Route path="Search" element={<Search />} />

  //       <Route path="RegistrationForm" element={<RegistrationForm />} />
  //       <Route path="Form" element={<Form />} />
        
  //       <Route path="*" element={<Page404 />} />
      
  //       </Route>
  //     </Routes>
  //   </>
  // );
}

export default App;

