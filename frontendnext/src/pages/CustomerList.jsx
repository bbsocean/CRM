import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/customers')  // API endpoint to fetch customers
      .then(response => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Customers List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            .
            <th>Email</th>
            <th>Agent</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.agentName}</td>
              <td>{customer.status}</td>
              <td>
                {/* Link to customer's transaction history */}
                <a href={`/customer/${customer.id}/transactions`}>View Transactions</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <style>
        {`/* CustomerList.css */

/* General container styling */
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Header styling */
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Table styling */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

/* Table headers */
th {
  background-color: #f4f4f4;
  padding: 12px;
  text-align: left;
}

/* Table data */
td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

/* Actions (View Transactions link) */
a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Loading indicator */
.loading {
  font-size: 18px;
  color: #555;
}
        `}
      </style>
    </div>
  );
};

export default CustomerList;
