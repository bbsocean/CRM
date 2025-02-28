import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import "../styles/CommissionBreakdown.css"; // Import CSS

const CommissionBreakdown = () => {
  const [commissions, setCommissions] = useState([]);
  const [filteredCommissions, setFilteredCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionType, setTransactionType] = useState("");

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const response = await axios.get("/api/commissions");
      setCommissions(response.data);
      setFilteredCommissions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching commissions:", error);
      setError("Failed to load commission data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = commissions;
    if (startDate && endDate) {
      filtered = filtered.filter(commission =>
        new Date(commission.date) >= new Date(startDate) &&
        new Date(commission.date) <= new Date(endDate)
      );
    }
    if (transactionType) {
      filtered = filtered.filter(commission => commission.type === transactionType);
    }
    setFilteredCommissions(filtered);
  };

  return (
    <div className="commission-breakdown-container">
      <h2 className="text-primary mb-4">💵 Commission Breakdown</h2>

      <div className="filters">
        <Form.Control type="date" onChange={(e) => setStartDate(e.target.value)} />
        <Form.Control type="date" onChange={(e) => setEndDate(e.target.value)} />
        <Form.Control as="select" onChange={(e) => setTransactionType(e.target.value)}>
          <option value="">Select Transaction Type</option>
          <option value="Sales">Sales</option>
          <option value="Referral">Referral</option>
          <option value="Vendor Commission">Vendor Commission</option>
        </Form.Control>
        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading commissions...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount ($)</th>
              <th>Transaction Type</th>
              <th>Hierarchy Level</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommissions.map((commission, index) => (
              <tr key={index}>
                <td>{new Date(commission.date).toLocaleDateString()}</td>
                <td>${commission.amount}</td>
                <td>{commission.type}</td>
                <td>{commission.hierarchyLevel}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Commission Breakdown Styling */
.commission-breakdown-container {
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
  background-color: #8e44ad;
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

export default CommissionBreakdown;
