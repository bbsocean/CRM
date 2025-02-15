import React, { useState } from 'react';
import axios from 'axios';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Agent',  // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert(response.data.message);
    } catch (error) {
      alert('Error signing up: ' + error.response?.data?.message || 'Unknown error');
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="Agent">Agent</option>
          <option value="Franchise">Franchise</option>
          <option value="TerritoryHead">Territory Head</option>
          <option value="Vendor">Vendor</option>
          <option value="CustomerVendor">Customer Vendor</option>
        </select>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default SignupPage;
