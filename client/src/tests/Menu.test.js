import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import Menu from '../components/Menu';
import { BrowserRouter } from 'react-router-dom';
import * as utils from '../util';
import userEvent from '@testing-library/user-event';

// Mock the utils module
jest.mock('../util', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mock window.alert
window.alert = jest.fn();

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
    
    const searchInput = screen.getByLabelText(/enter the item/i);
    const searchButton = screen.getByText(/search/i);
    const websiteSelect = screen.getByLabelText(/choose the website/i);
    
    // Fill in form
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'ab' } });
      // Select a website
      fireEvent.mouseDown(websiteSelect);
    });

    // Select Amazon option
    const amazonOption = screen.getByText('Amazon');
    fireEvent.click(amazonOption);

    // Click search
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // The API should be called with both website and search term
    expect(utils.default).toHaveBeenCalledWith('az', 'ab');
  });

  test('shows loading state during fetch', async () => {
    utils.default.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({}), 100))
    );
    
    renderWithRouter(<Menu />);
    
    const searchInput = screen.getByLabelText(/enter the item/i);
    const searchButton = screen.getByText(/search/i);
    const websiteSelect = screen.getByLabelText(/choose the website/i);
    
    // Fill in search form
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.mouseDown(websiteSelect);
    });

    // Select Amazon option
    const amazonOption = screen.getByText('Amazon');
    fireEvent.click(amazonOption);

    // Click search to trigger loading state
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Check for loading state by looking for CircularProgress
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
    
    // Optionally, verify the button is disabled during loading
    expect(searchButton).toBeDisabled();
  });
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};
