import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CustomerVendorDashboard = () => {
  const { customerId } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/dashboard/customer-vendor/${customerId}`)
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching customer vendor dashboard:', error));
  }, [customerId]);

  return (
    <div>
      <h1>Customer Become Vendor Dashboard</h1>
      <p>Total Sales: {data.totalSales}</p>
      <p>Total Commissions: {data.totalCommissions}</p>
    </div>
  );
};

export default CustomerVendorDashboard;
