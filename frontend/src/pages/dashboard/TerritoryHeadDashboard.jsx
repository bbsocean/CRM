import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TerritoryHeadDashboard = () => {
  const { territoryHeadId } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/dashboard/territory/${territoryHeadId}`)
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching territory head dashboard:', error));
  }, [territoryHeadId]);

  return (
    <div>
      <h1>Territory Head Dashboard</h1>
      <p>Total Sales: {data.totalSales}</p>
      <p>Total Commissions: {data.totalCommissions}</p>
    </div>
  );
};

export default TerritoryHeadDashboard;
