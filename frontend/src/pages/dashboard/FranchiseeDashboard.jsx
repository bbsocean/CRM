import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FranchiseeDashboard = () => {
  const { franchiseId } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/dashboard/franchise/${franchiseId}`)
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching franchisee dashboard:', error));
  }, [franchiseId]);

  return (
    <div>
      <h1>Franchisee Dashboard</h1>
      <p>Total Sales: {data.totalSales}</p>
      <p>Total Commissions: {data.totalCommissions}</p>
    </div>
  );
};

export default FranchiseeDashboard;
