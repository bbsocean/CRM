import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const VendorSelfService = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await axios.get("/api/vendors/earnings");
      setEarnings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendor earnings:", error);
      setError("Failed to load earnings data.");
      setLoading(false);
    }
  };

  return (
    <div className="self-service-container">
      <h2 className="text-primary mb-4">💰 Vendor Self-Service Portal</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading earnings...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Total Sales ($)</th>
              <th>Commission Earned ($)</th>
              <th>Payout Status</th>
            </tr>
          </thead>
          <tbody>
            {earnings.map((vendor, index) => (
              <tr key={index}>
                <td>{vendor.name}</td>
                <td>${vendor.sales}</td>
                <td>${vendor.commission}</td>
                <td>{vendor.payoutStatus}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Vendor Self-Service Styling */
.self-service-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.self-service-container h2 {
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
  background-color: #16a085;
  color: white;
}

.table tbody tr:hover {
  background-color: #ecf0f1;
}

.payout-status-pending {
  background-color: #f39c12;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.payout-status-completed {
  background-color: #2ecc71;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .self-service-container {
    width: 100%;
    padding: 10px;
  }
}
`}
      </style>
    </div>
  );
};

export default VendorSelfService;
