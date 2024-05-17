import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PriceBlock from './PriceBlock';

test('increment button increases count input by 1 and changes total price', () => {
  render(
    <BrowserRouter>
     <PriceBlock title="Book Title" price={10} cartItems={[]} theme="light" />
    </BrowserRouter>
  );
  const decrementButton = screen.getByTestId('increment');
  const inputElement = screen.getByTestId('count-input');
  const totalPriceElement = screen.getByTestId('totalPrice');

  expect(inputElement.value).toBe('1');
  expect(totalPriceElement.textContent).toBe('10.00');
  
  fireEvent.click(decrementButton);
   
  expect(inputElement.value).toBe('2');
  expect(totalPriceElement.textContent).toBe('20.00');
});

test('input value changes total price', () => {
  render(
    <BrowserRouter> 
     <PriceBlock title="Book Title" price={10} cartItems={[]} theme="light" />
    </BrowserRouter>
);
  
  const inputElement = screen.getByTestId('count-input');
  const totalPriceElement = screen.getByTestId('totalPrice');

  fireEvent.change(inputElement, { target: { value: '5' } });

  expect(totalPriceElement.textContent).toBe('50.00');
});