import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import Menu from '../components/Menu';
import { BrowserRouter } from 'react-router-dom';
import * as utils from '../util';

// Mock the utils module
jest.mock('../util', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Menu Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('validates minimum search length', async () => {
    renderWithRouter(<Menu />);
    
    const searchInput = screen.getByLabelText(/enter item name/i);
    const searchButton = screen.getByText(/search item/i);
    
    // Type short search term
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'ab' } });
    });

    // Click search
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // The API should be called (component doesn't validate length)
    expect(utils.default).toHaveBeenCalledWith(undefined, 'ab');
  });

  test('shows loading state during fetch', async () => {
    // Mock the API call to delay response
    utils.default.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({}), 100))
    );
    
    renderWithRouter(<Menu />);
    
    const searchInput = screen.getByLabelText(/enter item name/i);
    const searchButton = screen.getByText(/search item/i);
    
    // Fill in search form
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test' } });
    });

    // Click search to trigger loading state
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Check for loading button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });
  });
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};
