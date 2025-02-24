import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const AgentDashboard = () => {
  const { agentId } = useParams();  // Get agentId from URL params
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    salesHistory: [],
    commissions: [],
    topProducts: [],
  });

  useEffect(() => {
    axiosInstance.get(`/dashboard/agent/${agentId}`)
      .then(response => setDashboardData(response.data))
      .catch(error => console.error('Error fetching agent dashboard:', error));
  }, [agentId]);

  return (
    <div className="agent-dashboard-container">
      <h1>Agent Dashboard</h1>
      <div className="dashboard-metrics">
        <p><strong>Total Sales:</strong> ₹{dashboardData.totalSales.toLocaleString()}</p>
        <p><strong>Total Commissions:</strong> ₹{dashboardData.totalCommissions.toLocaleString()}</p>
        <p><strong>Pending Commissions:</strong> ₹{dashboardData.pendingCommissions.toLocaleString()}</p>
      </div>

      <h2>Top Products Sold</h2>
      <ul>
        {dashboardData.topProducts.length > 0 ? (
          dashboardData.topProducts.map((product, index) => (
            <li key={index}>
              {product.productName} - {product.totalUnitsSold} units
            </li>
          ))
        ) : (
          <p>No product sales data available.</p>
        )}
      </ul>

      <h2>Sales History</h2>
      <ul>
        {dashboardData.salesHistory.map((sale, index) => (
          <li key={index}>
            Product: <strong>{sale.productName}</strong>, Amount: ₹{sale.saleAmount}, Date: {new Date(sale.saleDate).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <h2>Commission Details</h2>
      <ul>
        {dashboardData.commissions.length > 0 ? (
          dashboardData.commissions.map((commission, index) => (
            <li key={index}>
              Amount: ₹{commission.amount}, Status: {commission.status}, Date: {new Date(commission.date).toLocaleDateString()}
            </li>
          ))
        ) : (
          <p>No commission data available.</p>
        )}
      </ul>

      <style>
        {`
          .agent-dashboard-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .dashboard-metrics {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            background-color: #ffffff;
            margin-bottom: 20px;
          }

          h2 {
            margin-top: 20px;
            color: #333;
          }

          ul {
            padding-left: 20px;
          }

          ul li {
            margin-bottom: 8px;
          }
        `}
      </style>
    </div>
  );
};

export default AgentDashboard;
