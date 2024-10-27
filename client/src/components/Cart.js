/*
MIT License

Copyright (c) 2023 Slash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Action types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter(item => item.title !== action.payload.title),
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
};

// Create context
const CartContext = createContext();

// CartProvider component
const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const saveCartToServer = async () => {
      try {
        await axios.post('http://localhost:8000/api/saveCart', { items: cartState.items });
      } catch (error) {
        console.error('Error saving cart to server:', error);
      }
    };

    saveCartToServer();
  }, [cartState]);

  const addToCart = (item) => {
    console.log('Adding to cart:', item);
    dispatch({ type: ADD_TO_CART, payload: item });
  };
  const removeFromCart = (item) => {
    console.log('Removing from cart:', item);
    dispatch({ type: REMOVE_FROM_CART, payload: item });
  };
  return (
    <CartContext.Provider value={{ cartState, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartProvider, useCart };
