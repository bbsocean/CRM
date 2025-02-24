import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../api/axiosInstance';

const AdminOverview = () => {
    const [chartData, setChartData] = useState([]);

  const [overviewData, setOverviewData] = useState({
    totalSales: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    totalPayouts: 0,
    topAgents: [],
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/admin-overview');
        setOverviewData(response.data);
        const formattedData = data.topAgents.map((agent) => ({
            name: agent.agentDetails.name,
            sales: agent.totalSales,
            }));
            setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching admin overview:', error);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Overview Dashboard</h1>

      <div className="dashboard-stat">
        <h3>Total Sales</h3>
        <p>${overviewData.totalSales.toLocaleString()}</p>
      </div>

      <div className="dashboard-stat">
        <h3>Total Commissions</h3>
        <p>{overviewData.totalCommissions}</p>
      </div>

      <div className="dashboard-stat">
        <h3>Pending Commissions</h3>
        <p>{overviewData.pendingCommissions}</p>
      </div>

      <div className="dashboard-stat">
        <h3>Total Payouts</h3>
        <p>${overviewData.totalPayouts.toLocaleString()}</p>
      </div>
      <h1>Admin Overview</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    

      <h2 className="section-title">Top Agents</h2>
      <ul className="data-list">
        {overviewData.topAgents.map((agent, index) => (
          <li key={index}>
            <span>Name:</span> {agent.agentDetails?.name || 'Unknown'}<br />
            <span>Total Sales:</span> ${agent.totalSales.toLocaleString()}
          </li>
        ))}
      </ul>
      <style>
        {`
        body {
  font-family: 'Arial, sans-serif';
  background-color: #f5f7fa;
  margin: 0;
  padding: 0;
}

.dashboard-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  text-align: center;
  color: #2c3e50;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
}

.dashboard-stat {
  background-color: #e8f6f9;
  border: 1px solid #b3e5fc;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.dashboard-stat h3 {
  color: #007bff;
  font-size: 22px;
  margin: 0;
}

.dashboard-stat p {
  font-size: 26px;
  font-weight: bold;
  margin-top: 8px;
  color: #333;
}

.section-title {
  font-size: 24px;
  color: #2c3e50;
  margin-top: 30px;
  margin-bottom: 15px;
}

.data-list {
  list-style: none;
  padding: 0;
}

.data-list li {
  background-color: #f9f9f9;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.data-list li span {
  font-weight: bold;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 15px;
  }

  .dashboard-title {
    font-size: 28px;
  }

  .dashboard-stat h3 {
    font-size: 18px;
  }

  .dashboard-stat p {
    font-size: 22px;
  }

  .section-title {
    font-size: 20px;
  }
}
`}
      </style>
    </div>
  );
};

export default AdminOverview;
