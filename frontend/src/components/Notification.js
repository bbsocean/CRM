import React, { useEffect, useState } from 'react';
import socket from '../api/socket';

function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for events from the backend
    socket.on('saleCreated', (data) => {
      setNotifications((prev) => [...prev, `New sale: ${data.productName} - Amount: ${data.saleAmount}`]);
    });

    socket.on('commissionPaid', (data) => {
      setNotifications((prev) => [...prev, `Commission paid: ${data.amount} to ${data.recipientId}`]);
    });

    socket.on('payoutCompleted', (data) => {
      setNotifications((prev) => [...prev, `Payout completed: ${data.amount} to ${data.recipientId}`]);
    });

    return () => {
      socket.off('saleCreated');
      socket.off('commissionPaid');
      socket.off('payoutCompleted');
    };
  }, []);

  return (
    <div className="notification-container">
      <h4>Notifications</h4>
      <ul>
        {notifications.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

      <style>
        {`
        .notification-container {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  max-width: 400px;
  margin: 20px auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.notification-container h4 {
  margin-bottom: 10px;
}

.notification-container ul {
  list-style-type: none;
  padding: 0;
}

.notification-container li {
  background: #e8f5e9;
  margin-bottom: 5px;
  padding: 8px;
  border-radius: 4px;
}

`}
      </style>
    </div>
  );
}

export default Notification;
