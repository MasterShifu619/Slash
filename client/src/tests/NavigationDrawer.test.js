import { render, fireEvent, screen } from '@testing-library/react';
import NavigationDrawer from '../header/NavigationDrawer';
import { BrowserRouter } from 'react-router-dom';
import { AppContext } from '../header/AppContext';
import { routes } from '../configs/routes';

// Mock Material-UI styles
jest.mock('@mui/styles/withStyles', () => {
  return (styles) => (Component) => (props) => <Component {...props} classes={{}} />;
});

// Mock all MUI icons at once
jest.mock('@mui/icons-material', () => ({
  Summarize: () => 'SummarizeIcon',
  Equalizer: () => 'EqualizerIcon',
  Insights: () => 'InsightsIcon',
  FormatListBulleted: () => 'FormatListBulletedIcon'
}));

const renderWithProviders = (component, contextOverrides = {}) => {
  const defaultContext = {
    isDrawerOpen: true,
    theme: 'light',
    toggleDrawer: jest.fn(),
    toggleTheme: jest.fn(),
    ...contextOverrides
  };

  return {
    ...render(
      <AppContext.Provider value={defaultContext}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AppContext.Provider>
    ),
    mockContext: defaultContext
  };
};

describe('NavigationDrawer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all navigation items', () => {
    renderWithProviders(<NavigationDrawer />);
    
    routes.forEach(route => {
      if (route.name) {
        expect(screen.getByText(route.name)).toBeInTheDocument();
      }
    });
  });

  test('handles click navigation and closes drawer', () => {
    const { mockContext } = renderWithProviders(<NavigationDrawer />);
    
    // Get the drawer component
    const drawer = screen.getByRole('presentation');
    
    // Find the backdrop and click it to close the drawer
    const backdrop = drawer.querySelector('.MuiBackdrop-root');
    fireEvent.click(backdrop);
    
    // Verify drawer toggle was called
    expect(mockContext.toggleDrawer).toHaveBeenCalledTimes(1);
  });

  test('drawer responds to context state', () => {
    // First render with drawer closed
    const { rerender } = renderWithProviders(<NavigationDrawer />, {
      isDrawerOpen: false
    });
    
    // When drawer is closed, it shouldn't be in the document
    const closedDrawer = screen.queryByRole('presentation');
    expect(closedDrawer).not.toBeInTheDocument();
    
    // Rerender with drawer open
    const mockContext = {
      isDrawerOpen: true,
      theme: 'light',
      toggleDrawer: jest.fn(),
      toggleTheme: jest.fn()
    };

    rerender(
      <AppContext.Provider value={mockContext}>
        <BrowserRouter>
          <NavigationDrawer />
        </BrowserRouter>
      </AppContext.Provider>
    );
    
    // When drawer is open, it should be in the document
    const openDrawer = screen.getByRole('presentation');
    expect(openDrawer).toBeInTheDocument();
  });

  test('navigation links have correct paths', () => {
    renderWithProviders(<NavigationDrawer />);
    
    routes.forEach(route => {
      if (route.name) {
        const link = screen.getByText(route.name).closest('a');
        expect(link).toHaveAttribute('href', route.path);
      }
    });
  });
});
