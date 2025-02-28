import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/EscrowPayments.css"; // Importing CSS

const EscrowPayments = () => {
  const [escrowTransactions, setEscrowTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEscrowTransactions();
  }, []);

  const fetchEscrowTransactions = async () => {
    try {
      const response = await axios.get("/api/escrow-payments");
      setEscrowTransactions(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch escrow transactions.");
      setLoading(false);
    }
  };

  return (
    <div className="escrow-payments-container">
      <Sidebar />
      <Container fluid className="escrow-payments-content">
        <h2 className="escrow-payments-title">💳 Escrow Payments Management</h2>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <Table striped bordered hover responsive className="escrow-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Release</th>
              </tr>
            </thead>
            <tbody>
              {escrowTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.transactionId}</td>
                  <td>{transaction.buyer}</td>
                  <td>{transaction.seller}</td>
                  <td>${transaction.amount}</td>
                  <td>
                    <Badge bg={transaction.status === "Pending" ? "warning" : "success"}>
                      {transaction.status}
                    </Badge>
                  </td>
                  <td>
                    {transaction.status === "Pending" ? (
                      <Button variant="success" size="sm">Release</Button>
                    ) : (
                      <Badge bg="secondary">Completed</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .escrow-payments-container {
  display: flex;
  height: 100vh;
}

.escrow-payments-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.escrow-payments-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.escrow-table th {
  background-color: #f39c12;
  color: white;
  text-align: center;
}

.escrow-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default EscrowPayments;
