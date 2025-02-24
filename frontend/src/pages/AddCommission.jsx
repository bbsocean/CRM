// src/pages/AddCommission.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCommission = () => {
  const [formData, setFormData] = useState({
    amount: '',
    agentName: '',
    franchiseName: '',
    date: '',
    status: 'Pending',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/commissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      navigate('/commissions');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-commission">
      <h2>Add New Commission</h2>
      {error && <p className="error">Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount (₹):</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="agentName">Agent Name:</label>
          <input
            type="text"
            id="agentName"
            name="agentName"
            value={formData.agentName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="franchiseName">Franchise Name:</label>
          <input
            type="text"
            id="franchiseName"
            name="franchiseName"
            value={formData.franchiseName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        <button type="submit">Add Commission</button>
      </form>
      <style>
        {`
        .add-commission {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.add-commission h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error {
  color: #f44336;
  text-align: center;
  margin-bottom: 15px;
}
`}
      </style>
    </div>
  );
};

export default AddCommission;
