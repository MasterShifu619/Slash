import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppContext, AppProvider } from '../header/AppContext';
import { useContext } from 'react';

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const TestConsumer = () => {
    const context = useContext(AppContext);
    
    if (!context) {
      return <div>No context provided</div>;
    }

    return (
      <div>
        <div data-testid="drawer-state">{context.isDrawerOpen.toString()}</div>
        <div data-testid="theme-state">{context.theme}</div>
        <button onClick={context.toggleDrawer}>Toggle Drawer</button>
        <button onClick={context.toggleTheme}>Toggle Theme</button>
      </div>
    );
  };

  test('provides default context values', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    expect(screen.getByTestId('drawer-state')).toHaveTextContent('false');
    expect(screen.getByTestId('theme-state')).toHaveTextContent('light');
  });

  test('toggles drawer state', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    
    const toggleButton = screen.getByText('Toggle Drawer');
    fireEvent.click(toggleButton);
    
    expect(screen.getByTestId('drawer-state')).toHaveTextContent('true');
  });

  test('persists theme preference', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    
    const toggleButton = screen.getByText('Toggle Theme');
    fireEvent.click(toggleButton);
    
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(screen.getByTestId('theme-state')).toHaveTextContent('dark');
  });

  test('shares context between multiple consumers', () => {
    render(
      <AppProvider>
        <TestConsumer />
        <TestConsumer />
      </AppProvider>
    );
    
    const toggleButtons = screen.getAllByText('Toggle Drawer');
    fireEvent.click(toggleButtons[0]);
    
    const drawerStates = screen.getAllByTestId('drawer-state');
    expect(drawerStates[0]).toHaveTextContent('true');
    expect(drawerStates[1]).toHaveTextContent('true');
  });

  test('initializes theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    
    expect(screen.getByTestId('theme-state')).toHaveTextContent('dark');
  });
});
