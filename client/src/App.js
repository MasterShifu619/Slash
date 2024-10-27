import React from "react";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { theme } from "./configs/theme";
import Main from "./Main";
import { BrowserRouter as Router } from "react-router-dom";
import { CartProvider } from './components/Cart';

/**
 * Main point of rendering for the interactive web page
 * @returns
 */
function App() {
  return (
    <CartProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Main />
        </Router>
      </ThemeProvider>
    </CartProvider>
  );
}

export default App;
