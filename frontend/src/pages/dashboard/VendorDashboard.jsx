import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const VendorDashboard = () => {
  const { vendorId } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/dashboard/vendor/${vendorId}`)
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching vendor dashboard:', error));
  }, [vendorId]);

  return (
    <div>
      <h1>Vendor Dashboard</h1>
      <p>Total Sales: {data.totalSales}</p>
      <p>Total Commissions: {data.totalCommissions}</p>
    </div>
  );
};

export default VendorDashboard;
