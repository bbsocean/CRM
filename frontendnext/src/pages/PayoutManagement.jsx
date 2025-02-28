import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form, Modal } from "react-bootstrap";
import axios from "axios";
import "../styles/PayoutManagement.css"; // Import CSS

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const response = await axios.get("/api/payouts");
      setPayouts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payouts:", error);
      setError("Failed to load payout data.");
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    try {
      await axios.post("/api/payouts/request", {
        amount: payoutAmount,
        method: paymentMethod,
      });
      setShowModal(false);
      fetchPayouts();
    } catch (error) {
      console.error("Error requesting payout:", error);
      setError("Payout request failed.");
    }
  };

  return (
    <div className="payout-management-container">
      <h2 className="text-primary mb-4">💰 Payout Management</h2>

      <Button variant="success" onClick={() => setShowModal(true)}>Request Payout</Button>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading payouts...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount ($)</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout, index) => (
              <tr key={index}>
                <td>{new Date(payout.date).toLocaleDateString()}</td>
                <td>${payout.amount}</td>
                <td>{payout.method}</td>
                <td>
                  <span className={payout.status === "Completed" ? "status-completed" : "status-pending"}>
                    {payout.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Payout Request Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Payout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Amount ($)</Form.Label>
              <Form.Control type="number" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Payment Method</Form.Label>
              <Form.Control as="select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option>Bank Transfer</option>
                <option>Wallet</option>
                <option>PayPal</option>
              </Form.Control>
            </Form.Group>
            <Button variant="success" className="mt-3" onClick={handleRequestPayout}>Submit Request</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <style>
        {`
        /* Payout Management Styling */
.payout-management-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.table {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.table thead {
  background-color: #27ae60;
  color: white;
}

.table tbody tr:hover {
  background-color: #ecf0f1;
}

.status-pending {
  background-color: #f1c40f;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.status-completed {
  background-color: #2ecc71;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .payout-management-container {
    width: 100%;
    padding: 10px;
  }
}
`}
      </style>
    </div>
  );
};

export default PayoutManagement;
