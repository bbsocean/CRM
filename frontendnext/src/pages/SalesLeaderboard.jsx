import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import "../styles/SalesLeaderboard.css"; // Import CSS

const SalesLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchSalesLeaderboard();
  }, []);

  const fetchSalesLeaderboard = async () => {
    try {
      const response = await axios.get("/api/sales-leaderboard");
      setLeaderboard(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError("Failed to load leaderboard data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = leaderboard;
    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }
    if (timeframe === "Monthly") {
      filtered = filtered.filter(user => user.periodType === "Monthly");
    } else if (timeframe === "Quarterly") {
      filtered = filtered.filter(user => user.periodType === "Quarterly");
    } else if (timeframe === "Yearly") {
      filtered = filtered.filter(user => user.periodType === "Yearly");
    }
    setFilteredData(filtered);
  };

  return (
    <div className="sales-leaderboard-container">
      <h2 className="text-primary mb-4">🏆 Sales Leaderboard</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Vendor">Vendor</option>
          <option value="Referral">Referral</option>
        </Form.Control>
        
        <Form.Control as="select" onChange={(e) => setTimeframe(e.target.value)}>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </Form.Control>
        
        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading leaderboard...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Role</th>
              <th>Total Sales ($)</th>
              <th>Total Earnings ($)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr key={index}>
                <td>#{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>${user.totalSales}</td>
                <td>${user.totalEarnings}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Sales Leaderboard Styling */
.sales-leaderboard-container {
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

export default SalesLeaderboard;
