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
    topPerformance: [],
  });

  const [loading, setLoading] = useState(true); // For loading state 
  const [error, setError] = useState(null); // For error handling

  // Fetch dashboard data from the backend API
  useEffect(() => {
    const fetchAgentDashboard = async () => {
      try {
        const response = await axiosInstance.get(`/dashboard/agent/${agentId}`);
        setDashboardData(response.data);  // Set the API response to state
      } catch (error) {
        setError('Error fetching dashboard data'); 
       } finally{ 
          setLoading(false); // End loading state
        console.error('Error fetching agent dashboard:', error);

      }
    };

    fetchAgentDashboard();
  }, [agentId]);

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>{error}</div>;

  return (
    <div className="agent-dashboard-container">
      <h1>Agent Dashboard</h1>

      <div className="dashboard-overview">
        <p><strong>Total Sales:</strong> {dashboardData.totalSales}</p>
        <p><strong>Total Commissions:</strong> {dashboardData.totalCommissions}</p>
        <p><strong>Pending Commissions:</strong> {dashboardData.pendingCommissions}</p>
      </div>

      <h2>Sales History</h2>
      <ul>
        {dashboardData.salesHistory.map((sale, index) => (
          <li key={index}>
            Product: {sale.productName}, Amount: {sale.saleAmount}, Date: {new Date(sale.saleDate).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <h2>Top Products</h2>
      <ul>
        {dashboardData.topProducts.map((product, index) => (
          <li key={index}>
            {product.productName}: {product.saleAmount} sales
          </li>
        ))}
      </ul>

      <h2>Top Performances (Daily, Weekly, Monthly)</h2>
      <ul>
        {dashboardData.topPerformance.map((performance, index) => (
          <li key={index}>
            Date: {new Date(performance.date).toLocaleDateString()} - Sales: {performance.sales}
          </li>
        ))}
      </ul>

      <style>
        {`
          .agent-dashboard-container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .dashboard-overview {
            margin-bottom: 20px;
          }

          h2 {
            margin-top: 20px;
            color: #333;
          }

          ul {
            list-style-type: none;
            padding: 0;
          }

          li {
            padding: 10px;
            background-color: #fff;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            border-radius: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default AgentDashboard;
