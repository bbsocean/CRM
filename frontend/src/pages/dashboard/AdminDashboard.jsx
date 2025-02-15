import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import axiosInstance from '../../api/axiosInstance';

// Establish Socket.IO connection
const socket = io('http://localhost:5000');

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [realTimeSales, setRealTimeSales] = useState([]); // For real-time sales updates

  // Fetch initial overview data from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard/admin-overview')
      .then(response => setOverview(response.data))
      .catch(error => console.error('Error fetching admin overview:', error));
  }, []);

  // Real-time updates listener
  useEffect(() => {
    socket.on('update-dashboard', (newSale) => {
      console.log('Real-time sale received:', newSale);
      setRealTimeSales((prevSales) => [...prevSales, newSale]);
    });

    // Cleanup on component unmount
    return () => socket.off('update-dashboard');
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Total Sales: {overview.totalSales}</p>
      <p>Total Commissions: {overview.totalCommissions}</p>
      <p>Pending Commissions: {overview.pendingCommissions}</p>
      <p>Total Payouts: {overview.totalPayouts}</p>

      <h2>Top Agents</h2>
      <ul>
        {overview.topAgents?.map(agent => (
          <li key={agent.agentId}>
            {agent.agentDetails?.name || 'N/A'} - Sales: {agent.totalSales}
          </li>
        ))}
      </ul>

      <h2>Real-Time Sales Updates</h2>
      <ul>
        {realTimeSales.map((sale, index) => (
          <li key={index}>
            Product: {sale.productName}, Amount: {sale.saleAmount}
          </li>
        ))}
      </ul>
      <style>
        {`
        .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Arial, sans-serif';
    color: #333;
}

.dashboard-title {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
}

.dashboard-stat {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
}

.dashboard-stat h3 {
    margin: 0;
    color: #2980b9;
    font-size: 18px;
}

.dashboard-stat p {
    font-size: 16px;
    color: #666;
}

.section-title {
    font-size: 22px;
    color: #34495e;
    margin-top: 30px;
    margin-bottom: 15px;
    border-bottom: 2px solid #ddd;
    padding-bottom: 5px;
}

.data-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.data-list li {
    background-color: #ffffff;
    padding: 10px 15px;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    transition: all 0.3s ease;
}

.data-list li:hover {
    background-color: #eaf2f8;
    border-color: #3498db;
}

.data-list span {
    font-weight: bold;
}

.dashboard-button {
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.dashboard-button:hover {
    background-color: #2980b9;
}

/* Responsive Design */
@media (max-width: 768px) {
    .dashboard-container {
        padding: 10px;
    }

    .dashboard-stat {
        flex-direction: column;
        text-align: center;
    }

    .dashboard-stat h3 {
        margin-bottom: 5px;
    }

    .dashboard-button {
        width: 100%;
        margin-top: 10px;
    }
}
`}
      </style>
    </div>
  );
};

export default AdminDashboard;
