// import React, { useState } from 'react';
// import axios from 'axios';

// const SignupPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'Agent',  // Default role
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
//       alert(response.data.message);
//     } catch (error) {
//       alert('Error signing up: ' + error.response?.data?.message || 'Unknown error');
//     }
//   };

//   return (
//     <div>
//       <h1>Signup</h1>
//       <form onSubmit={handleSubmit}>
//         <label>Name:</label>
//         <input type="text" name="name" value={formData.name} onChange={handleChange} required />

//         <label>Email:</label>
//         <input type="email" name="email" value={formData.email} onChange={handleChange} required />

//         <label>Password:</label>
//         <input type="password" name="password" value={formData.password} onChange={handleChange} required />

//         <label>Role:</label>
//         <select name="role" value={formData.role} onChange={handleChange}>
//           <option value="Agent">Agent</option>
//           <option value="Franchise">Franchise</option>
//           <option value="TerritoryHead">Territory Head</option>
//           <option value="Vendor">Vendor</option>
//           <option value="CustomerVendor">Customer Vendor</option>
//         </select>

//         <button type="submit">Signup</button>
//       </form>
//     </div>
//   );
// };

// export default SignupPage;


import React, { useState } from "react";
import { signup } from "../../services/authService";
import { useRouter } from "next/router";

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await signup(formData.name, formData.email, formData.password, formData.role);
      router.push("/auth/login"); // Redirect to login page after successful signup
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium">Full Name</label>
            <input 
              type="text" name="name" value={formData.name} 
              onChange={handleChange} required 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Email</label>
            <input 
              type="email" name="email" value={formData.email} 
              onChange={handleChange} required 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Password</label>
            <input 
              type="password" name="password" value={formData.password} 
              onChange={handleChange} required 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Confirm Password</label>
            <input 
              type="password" name="confirmPassword" value={formData.confirmPassword} 
              onChange={handleChange} required 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="Admin">Admin</option>
              <option value="Franchise">Franchise</option>
              <option value="Agent">Agent</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <p className="text-sm text-center mt-3">
          Already have an account? <a href="/auth/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
