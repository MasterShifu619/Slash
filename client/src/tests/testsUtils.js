import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { AppProvider } from '../header/AppContext';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CartProvider } from '../components/Cart';
import { theme } from '../configs/theme';

// Import actual axios to preserve its structure
import axios from 'axios';

// Mock axios while preserving its structure
jest.mock('axios', () => {
  const originalModule = jest.requireActual('axios');
  return {
    __esModule: true,
    ...originalModule,
    default: {
      ...originalModule.default,
      get: jest.fn(() => Promise.resolve({ 
        data: {
          rates: {
            EUR: 0.845,
            GBP: 0.73,
            JPY: 110.42
          }
        }
      })),
      create: () => ({
        get: jest.fn(() => Promise.resolve({ data: {} })),
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() }
        }
      })
    }
  };
});

// Create a wrapper component that includes all providers
const TestWrapper = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CartProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

// Custom render function
const render = (ui, options) =>
  rtlRender(ui, { wrapper: TestWrapper, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };
