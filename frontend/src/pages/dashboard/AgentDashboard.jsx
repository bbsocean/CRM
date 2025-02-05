import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AgentDashboard = () => {
  const { agentId } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/dashboard/agent/${agentId}`)
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching agent dashboard:', error));
  }, [agentId]);

  return (
    <div>
      <h1>Agent Dashboard</h1>
      <p>Total Sales: {data.totalSales}</p>
      <p>Total Commissions: {data.totalCommissions}</p>
      <p>Pending Commissions: {data.pendingCommissions}</p>
    </div>
  );
};

export default AgentDashboard;
