import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const FranchiseCreatePage = () => {
  const [name, setName] = useState('');
  const [territoryId, setTerritoryId] = useState('');
  const [commissionPercentage, setCommissionPercentage] = useState(5);
  const [inventory, setInventory] = useState([{ productId: '', stock: 0 }]);
  const [responseMessage, setResponseMessage] = useState('');

  const handleInventoryChange = (index, event) => {
    const values = [...inventory];
    values[index][event.target.name] = event.target.value;
    setInventory(values);
  };

  const handleAddInventory = () => {
    setInventory([...inventory, { productId: '', stock: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (commissionPercentage <= 0) {
      setResponseMessage('Commission percentage must be greater than 0.');
      return;
    }

    if (inventory.some(item => !item.productId || item.stock < 0)) {
      setResponseMessage('Please provide valid product IDs and stock.');
      return;
    }

    try {
      const { data } = await axiosInstance.post('/api/franchisees/create', {
        name,
        territoryId,
        commissionPercentage,
        inventory,
      });
      setResponseMessage('Franchise created successfully!');
      console.log(data);
    } catch (error) {
      console.error(error);
      setResponseMessage(error.response?.data?.message || 'Error creating franchise.');
    }
  };

  return (
    <div className="franchise-container">
      <h1>Create Franchise</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Territory ID:</label>
        <input type="text" value={territoryId} onChange={(e) => setTerritoryId(e.target.value)} required />

        <label>Commission Percentage:</label>
        <input type="number" value={commissionPercentage} onChange={(e) => setCommissionPercentage(e.target.value)} />

        <h3>Inventory</h3>
        {inventory.map((item, index) => (
          <div key={index} className="inventory-item">
            <label>Product ID:</label>
            <input
              type="text"
              name="productId"
              value={item.productId}
              onChange={(event) => handleInventoryChange(index, event)}
            />
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={item.stock}
              onChange={(event) => handleInventoryChange(index, event)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddInventory}>Add Inventory</button>
        <button type="submit">Create Franchise</button>
      </form>

      {responseMessage && (
        <p
          style={{
            color: responseMessage.includes('successfully') ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {responseMessage}
        </p>
      )}

      <style>
        {`
          .franchise-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .franchise-container h1 {
            text-align: center;
            color: #333;
          }

          .franchise-container form {
            display: flex;
            flex-direction: column;
          }

          .franchise-container label {
            margin: 10px 0 5px;
            font-weight: bold;
          }

          .franchise-container input {
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .franchise-container button {
            padding: 10px;
            margin-top: 10px;
            border: none;
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
          }

          .franchise-container button:hover {
            background-color: #45a049;
          }

          .inventory-item {
            margin-bottom: 10px;
          }

          .inventory-item label {
            display: block;
            margin-bottom: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default FranchiseCreatePage;
