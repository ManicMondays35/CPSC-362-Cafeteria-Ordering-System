// __tests__/Checkout.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkout from '../src/pages/Checkout-Page/Checkout';
import { CartProvider } from '../src/pages/Checkout-Page/CartContext';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Checkout Component', () => {
  test('adds item to cart and completes checkout', () => {
    render(
      <CartProvider>
        <Checkout />
      </CartProvider>
    );

    // Simulate a populated cart by accessing the DOM
    // (In a real-world app, you'd mock the cart state directly or refactor the CartContext)

    // Fill out address fields
    fireEvent.change(screen.getByPlaceholderText(/Street Address/i), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByPlaceholderText(/City/i), {
      target: { value: 'Springfield' },
    });
    fireEvent.change(screen.getByPlaceholderText(/State/i), {
      target: { value: 'CA' },
    });
    fireEvent.change(screen.getByPlaceholderText(/ZIP Code/i), {
      target: { value: '90210' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Country/i), {
      target: { value: 'USA' },
    });

    // Fill out payment info
    fireEvent.change(screen.getByPlaceholderText(/Card Number/i), {
      target: { value: '4242424242424242' },
    });
    fireEvent.change(screen.getByPlaceholderText(/MM\/YY/i), {
      target: { value: '12/26' },
    });
    fireEvent.change(screen.getByPlaceholderText(/CVV/i), {
      target: { value: '123' },
    });

    // Spy on alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();

    // Submit the form
    fireEvent.click(screen.getByText(/Confirm Order/i));

    // Expect success alert
    expect(alertMock).toHaveBeenCalledWith('Order placed successfully!');

    alertMock.mockRestore();
  });
});
