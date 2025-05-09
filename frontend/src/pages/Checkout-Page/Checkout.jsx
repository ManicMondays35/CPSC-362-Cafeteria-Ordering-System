import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../Checkout-Page/CartContext";

const CheckoutContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-image: url("https://images.unsplash.com/photo-1730780883153-b3c046b001c1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
`;

const CartItemsBox = styled.div`
  width: 60%;
  height: 400px;
  background-color: #f1f1f1;
  padding: 10px;
  overflow-y: scroll;
`;

const CartItem = styled.div`
  background: white;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
`;

const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
`;

const QtyButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: #800080;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background-color: rgb(83, 0, 83);
  }
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
`;

const TotalBox = styled.div`
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  height: 150px;
`;

const AddressBox = styled.div`
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
`;

const PaymentBox = styled.div`
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
`;

const PaymentInput = styled.input`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; 
`;

const PaymentRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%; 
`;

const PaymentField = styled.div`
  flex: 1;
  min-width: 0; 
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckoutButton = styled.button`
  padding: 10px;
  background-color: #800080;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: rgb(83, 0, 83);
  }
`;

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, incrementItem, decrementItem, clearCart } = useCart();
  const [cardNumber, setCardNumber] = React.useState('');
  const [expDate, setExpDate] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [userEmail, setUserEmail] = React.useState('');
  const [address, setAddress] = React.useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Error with Token Exchange');
      return;
    }
  
    // Address validation
    if (!address.street.trim()) {
      alert('Please enter your street address');
      return;
    }
    if (address.street.length < 5) {
      alert('Street address seems too short');
      return;
    }
    if (!address.city.trim()) {
      alert('Please enter your city');
      return;
    }
    if (!/^[a-zA-Z\s-]+$/.test(address.city)) {
      alert('City name can only contain letters, spaces and hyphens');
      return;
    }
    if (!address.state.trim()) {
      alert('Please enter your state/province');
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(address.state)) {
      alert('State can only contain letters and spaces');
      return;
    }
    if (!address.zip.trim()) {
      alert('Please enter your ZIP/postal code');
      return;
    }
    if (!/^\d{5}(-\d{4})?$/.test(address.zip)) {
      alert('Please enter a valid ZIP code (5 digits or 9 digits with hyphen)');
      return;
    }
    if (!address.country.trim()) {
      alert('Please enter your country');
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(address.country)) {
      alert('Country name can only contain letters and spaces');
      return;
    }
  
    // Payment validation
    if (!cardNumber || !expDate || !cvv) {
      alert('Please fill in all payment details');
      return;
    }
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      alert('Please enter a valid 16-digit card number');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expDate)) {
      alert('Please enter expiration date in MM/YY format');
      return;
    }
    const month = parseInt(expDate.split('/')[0], 10);
    if (month < 1 || month > 12) {
      alert('Month must be between 01-12');
      return;
    }
    if (cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv)) {
      alert('Please enter a valid CVV (3 or 4 digits)');
      return;
    }
  
    try {
      const orderNumber = `ORD-${Date.now()}`;
      
      // Prepare the order data
      const orderData = {
        orderNumber,
        userEmail,
        total: total,
        delivered: 'pending' // You might want to track order status
      };
  
      const response = await axios.post(
        'http://localhost:4000/checkout',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.data.success) {
        alert('Order Submitted Successfully!');
        clearCart();
        navigate('/home');
      } else {
        alert('Order submission failed: ' + response.data.message);
      }
    } catch(err) {
      alert('Error submitting order: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <CheckoutContainer>
      <CartItemsBox>
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => (
            <CartItem key={index}>
              <strong>{item.name}</strong> - ${item.price.toFixed(2)} each
              <QtyControls>
                <QtyButton onClick={() => decrementItem(item.name)}>-</QtyButton>
                <span>{item.quantity}</span>
                <QtyButton onClick={() => incrementItem(item.name)}>+</QtyButton>
              </QtyControls>
              <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
            </CartItem>
          ))
        )}
      </CartItemsBox>
  
      <RightSide>
        <TotalBox>
          <h3>Total</h3>
          <p>${total.toFixed(2)}</p>
        </TotalBox>
  
        {/* New Email Box - Added above AddressBox */}
        <AddressBox>
          <h3>Contact Information</h3>
          <PaymentInput
            type="email"
            placeholder="Email Address"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </AddressBox>
  
        <AddressBox>
          <h3>Delivery Information</h3>
          <PaymentInput
            type="text"
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => setAddress({...address, street: e.target.value})}
          />
          <PaymentRow>
            <PaymentField>
              <PaymentInput
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({...address, city: e.target.value})}
              />
            </PaymentField>
            <PaymentField>
              <PaymentInput
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({...address, state: e.target.value})}
              />
            </PaymentField>
          </PaymentRow>
          <PaymentRow>
            <PaymentField>
              <PaymentInput
                type="text"
                placeholder="ZIP Code"
                value={address.zip}
                onChange={(e) => setAddress({...address, zip: e.target.value})}
              />
            </PaymentField>
            <PaymentField>
              <PaymentInput
                type="text"
                placeholder="Country"
                value={address.country}
                onChange={(e) => setAddress({...address, country: e.target.value})}
              />
            </PaymentField>
          </PaymentRow>
        </AddressBox>
  
        <PaymentBox>
          <h3>Payment Information</h3>
          <PaymentInput
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
            maxLength="16"
          />
          <PaymentRow>
            <PaymentField>
              <PaymentInput
                type="text"
                placeholder="MM/YY"
                value={expDate}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 5) {
                    let newValue = value.replace(/\D/g, '');
                    if (newValue.length > 2) {
                      newValue = newValue.substring(0, 2) + '/' + newValue.substring(2);
                    }
                    setExpDate(newValue);
                  }
                }}
                maxLength="5"
              />
            </PaymentField>
            <PaymentField>
              <PaymentInput
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength="4"
              />
            </PaymentField>
          </PaymentRow>
        </PaymentBox>
  
        <ButtonBox>
          <CheckoutButton onClick={handleCheckout}>Confirm Order</CheckoutButton>
          <CheckoutButton onClick={() => navigate('/menu')}>Back to Menu</CheckoutButton>
        </ButtonBox>
      </RightSide>
    </CheckoutContainer>
  );
}
export default Checkout;
