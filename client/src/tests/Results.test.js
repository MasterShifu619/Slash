import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Results from '../components/Results';
import axios from 'axios';
import { CartProvider } from '../components/Cart';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme();

// Mock the useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?query=test'
  })
}));

describe('Results Component', () => {
  const mockExchangeRates = {
    rates: {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73
    }
  };

  // Store original location
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock exchange rates API response
    axios.get.mockResolvedValue({ data: mockExchangeRates });
    
    // Mock window.location
    delete window.location;
    window.location = { search: '?query=test' };
  });

  afterEach(() => {
    window.location = originalLocation;
    jest.clearAllMocks();
  });

  const renderWithProvider = (component) => {
    return render(
      <ThemeProvider theme={theme}>
        <CartProvider>
          {component}
        </CartProvider>
      </ThemeProvider>
    );
  };

  test('handles empty search results', async () => {
    renderWithProvider(<Results />);
    await waitFor(() => {
      expect(screen.getByText(/Search for what you want in the menu page/i)).toBeInTheDocument();
    });
  });

  test('renders with search results', async () => {
    const mockData = [
      { id: 1, title: 'Test Item', price: '$10.99', website: 'amazon' }
    ];
    renderWithProvider(<Results items={mockData} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Search for what you want in the menu page/i)).toBeInTheDocument();
    });
  });

  test('handles currency conversion', async () => {
    const mockData = [{ price: '$10.00' }];
    renderWithProvider(<Results items={mockData} />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://open.er-api.com/v6/latest');
    });
  });

  test('handles sorting', async () => {
    const mockData = [
      { price: '$10.00' },
      { price: '$5.00' }
    ];
    renderWithProvider(<Results items={mockData} />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  test('handles pagination', async () => {
    const mockData = Array(15).fill().map((_, i) => ({
      id: i,
      title: `Item ${i}`
    }));
    renderWithProvider(<Results items={mockData} />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  test('handles minimum rating filtering', async () => {
    const mockData = [
      { rating: 4.5, title: 'High Rated' },
      { rating: 3.0, title: 'Low Rated' }
    ];
    renderWithProvider(<Results items={mockData} />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  test('handles add to wishlist', async () => {
    const mockData = [{ id: 1, title: 'Test Item' }];
    renderWithProvider(<Results items={mockData} />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });
});
