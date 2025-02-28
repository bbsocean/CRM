import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import "../styles/VendorMarketplace.css"; // Import CSS

const VendorMarketplace = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get("/api/vendors");
      setVendors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setError("Failed to load vendor data.");
      setLoading(false);
    }
  };

  return (
    <div className="marketplace-container">
      <h2 className="text-primary mb-4">🛍️ Vendor Marketplace</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading vendors...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor, index) => (
              <tr key={index}>
                <td>{vendor.name}</td>
                <td>{vendor.category}</td>
                <td>⭐ {vendor.rating}</td>
                <td>
                  <Button variant="primary">View Profile</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Vendor Marketplace Styling */
.marketplace-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle;
}

.marketplace-container h2 {
  text-align: center;
  font-weight: bold;
  color: #2c3e50;
}

.table {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.table thead {
  background-color: #2c3e50;
  color: white;
}

.table tbody tr:hover {
  background-color: #ecf0f1;
}

.button-container {
  text-align: center;
}

.button-container button {
  margin: 5px;
  padding: 10px 15px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .marketplace-container {
    width: 100%;
    padding: 10px;
  }
}
`}
      </style>
    </div>
  );
};

export default VendorMarketplace;
