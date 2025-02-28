import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import "../styles/HierarchyPerformance.css"; // Import CSS

const HierarchyPerformance = () => {
  const [hierarchyData, setHierarchyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [minEarnings, setMinEarnings] = useState("");

  useEffect(() => {
    fetchHierarchyPerformance();
  }, []);

  const fetchHierarchyPerformance = async () => {
    try {
      const response = await axios.get("/api/hierarchy");
      setHierarchyData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching hierarchy data:", error);
      setError("Failed to load hierarchy performance data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = hierarchyData;
    if (role) {
      filtered = filtered.filter(item => item.role === role);
    }
    if (minEarnings) {
      filtered = filtered.filter(item => item.totalEarnings >= minEarnings);
    }
    setFilteredData(filtered);
  };

  return (
    <div className="hierarchy-performance-container">
      <h2 className="text-primary mb-4">📊 Hierarchy Performance</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Vendor">Vendor</option>
          <option value="Referral">Referral</option>
        </Form.Control>

        <Form.Control type="number" placeholder="Minimum Earnings ($)" onChange={(e) => setMinEarnings(e.target.value)} />

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading hierarchy performance...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Total Sales ($)</th>
              <th>Total Earnings ($)</th>
              <th>Conversion Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.role}</td>
                <td>${item.totalSales}</td>
                <td>${item.totalEarnings}</td>
                <td>{item.conversionRate}%</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Hierarchy Performance Styling */
.hierarchy-performance-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters select, .filters input {
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
  background-color: #e67e22;
  color: white;
}

.table tbody tr:hover {
  background-color: #ecf0f1;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  .filters select, .filters input {
    width: 100%;
    margin-bottom: 10px;
  }
}
`}
      </style>
    </div>
  );
};

export default HierarchyPerformance;
