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
    </div>
  );
};

export default AdminDashboard;
