import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import "../styles/SelfServicePortal.css"; // Import CSS

const SelfServicePortal = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const response = await axios.get("/api/selfservice/commissions");
      setCommissions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching commission data:", error);
      setError("Failed to load commission details.");
      setLoading(false);
    }
  };

  return (
    <div className="self-service-container">
      <h2 className="text-primary mb-4">📈 Self-Service Commission Portal</h2>

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
              <th>User</th>
              <th>Role</th>
              <th>Total Earnings ($)</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((commission, index) => (
              <tr key={index}>
                <td>{commission.user}</td>
                <td>{commission.role}</td>
                <td>${commission.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        `}
      </style>
    </div>
  );
};

export default SelfServicePortal;
