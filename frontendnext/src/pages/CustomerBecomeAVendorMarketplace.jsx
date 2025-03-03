import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import "../styles/CustomerBecomeAVendorMarketplace.css"; // Import CSS

const CustomerBecomeAVendorMarketplace = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get("/api/customerbecomeavendor/vendors");
      setVendors(response.data);
      setFilteredVendors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setError("Failed to load vendor data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = vendors;
    if (category) {
      filtered = filtered.filter(vendor => vendor.category === category);
    }
    if (region) {
      filtered = filtered.filter(vendor => vendor.region === region);
    }
    setFilteredVendors(filtered);
  };

  return (
    <div className="customer-vendor-marketplace-container">
      <h2 className="text-primary mb-4">🛍️ Customer Become A Vendor Marketplace</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Jewelry">Jewelry</option>
          <option value="Luxury Watches">Luxury Watches</option>
          <option value="Silverware">Silverware</option>
        </Form.Control>

        <Form.Control as="select" onChange={(e) => setRegion(e.target.value)}>
          <option value="">Select Region</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

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
              <th>Vendor</th>
              <th>Category</th>
              <th>Region</th>
              <th>Products</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor, index) => (
              <tr key={index}>
                <td>{vendor.name}</td>
                <td>{vendor.category}</td>
                <td>{vendor.region}</td>
                <td>{vendor.products.length}</td>
                <td>
                  <Button variant="success">View Products</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Customer Become A Vendor Marketplace Styling */
.customer-vendor-marketplace-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters select {
  width: 30%;
  padding: 10px;
  border-radius: 5px;
}

.table {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.table thead {
  background-color: #f39c12;
  color: white;
}

.table tbody tr:hover {
  background-color: #ecf0f1;
}

.button-container {
  text-align: center;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  .filters select {
    width: 100%;
    margin-bottom: 10px;
  }
}
`}
      </style>
    </div>
  );
};

export default CustomerBecomeAVendorMarketplace;
