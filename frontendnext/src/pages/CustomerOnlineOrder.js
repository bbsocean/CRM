import React, { useState } from 'react';

import a3 from '../components/Images/a3.png'; // Adjusted relative path

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  return (
    <div className="checkout-container">
      {/* Form Section */}
      <div className="form-section">
        <h2>Fill the order form below to complete your purchase</h2>

        <form>
          {/* Basic Information */}
          <div className="form-group">
            <h3>1. Your Basic Information</h3>
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
            <input type="tel" placeholder="Mobile Number" required />
            <input type="email" placeholder="Email Address" required />
          </div>

          {/* Billing Address */}
          <div className="form-group">
            <h3>2. Billing Address</h3>
            <input type="text" placeholder="No & Street" required />
            <input type="text" placeholder="City" required />
            <input type="text" placeholder="State" required />
            <input type="text" placeholder="Country" required />
            <input type="text" placeholder="Zip Code" required />
          </div>

          {/* Payment Information */}
          <div className="form-group">
            <h3>3. Your Payment Information</h3>
            <div className="payment-methods">
              <button
                type="button"
                className={paymentMethod === 'card' ? 'active' : ''}
                onClick={() => handlePaymentChange('card')}
              >
                Card
              </button>
              <button
                type="button"
                className={paymentMethod === 'gpay' ? 'active' : ''}
                onClick={() => handlePaymentChange('gpay')}
              >
                GPay
              </button>
              <button
                type="button"
                className={paymentMethod === 'paypal' ? 'active' : ''}
                onClick={() => handlePaymentChange('paypal')}
              >
                PayPal
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-details">
                <input type="text" placeholder="Card Number" required />
                <div className="card-expiry">
                  <input type="text" placeholder="Month" required />
                  <input type="text" placeholder="Year" required />
                </div>
                <input type="text" placeholder="CVV" required />
              </div>
            )}
          </div>

          <button type="submit" className="checkout-button">
            Checkout Now
          </button>
        </form>
      </div>

      {/* Purchase Details Section */}
      <div className="details-section">
        <div className="purchase-details">
          <h3>Purchase Details</h3>
          <p><strong>Item:</strong> Vintage Jewelry</p>
          <p><strong>Quantity:</strong> 1</p>
          <p><strong>Price:</strong> $360.00</p>
          <p><strong>Tax:</strong> $18.00</p>
          <p><strong>GST:</strong> $7.20</p>
          <p><strong>Total:</strong> $385.20</p>
        </div>

        <div className="plan-details">
          <h3>Plan Details</h3>
          <img src={a3} alt="Jewelry" />
          <ul>
            <li>22K Gold Antique Design</li>
            <li>High-Quality Zircon Stones</li>
            <li>Hallmarked Jewelry</li>
            <li>Peacock Design</li>
          </ul>
        </div>
      </div>

      <style>
        {`
        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(to right,rgb(238, 217, 188),rgb(236, 174, 154));
            font-family: Arial, sans-serif;
          }

            .checkout-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-section {
  flex: 2;
  margin-right: 20px;
}
  .form-section h2 {
      background-color: rgb(37, 13, 5);
      color: rgb(241, 235, 233); /* Set the text color to blue */
      font-size: 24px; /* Optional: Adjust the font size */
      font-weight: bold; /* Optional: Make the text bold */
      margin-bottom: 25px; /* Add spacing below the heading */
      text-align: center; /* Optional: Center align the text */
    }

.details-section {
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2, h3 {
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.payment-methods button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.payment-methods .active {
  background-color: #007bff;
  color: white;
}

.checkout-button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.purchase-details, .plan-details {
  margin-bottom: 20px;
}

.plan-details img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 10px;
}
  @media (max-width: 768px) {
  .checkout-container {
    flex-direction: column;
  }
  .form-section, .details-section {
    margin-right: 0;
    margin-bottom: 20px;
  }
}


        `}
      </style>
    </div>
  );
};

export default CheckoutForm;
