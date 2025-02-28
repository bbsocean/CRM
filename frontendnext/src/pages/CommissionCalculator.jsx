import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Alert } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import "../styles/CommissionCalculator.css"; // Importing CSS
import axios from "axios";

const CommissionCalculator = () => {
  const [salesAmount, setSalesAmount] = useState("");
  const [role, setRole] = useState("Agent");
  const [commission, setCommission] = useState(null);
  const [error, setError] = useState("");

  const calculateCommission = async () => {
    try {
      const response = await axios.post("/api/commission-calculator", { salesAmount, role });
      setCommission(response.data);
    } catch (err) {
      setError("Failed to calculate commission.");
    }
  };

  return (
    <div className="commission-calculator-container">
      <Sidebar />
      <Container fluid className="commission-calculator-content">
        <h2 className="commission-calculator-title">🧮 Commission Calculator</h2>

        <Row>
          <Col md={6}>
            <Card className="calculator-card">
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Sales Amount ($)</Form.Label>
                    <Form.Control
                      type="number"
                      value={salesAmount}
                      onChange={(e) => setSalesAmount(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Select Role</Form.Label>
                    <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="Franchise">Franchise</option>
                      <option value="Territory Head">Territory Head</option>
                      <option value="Agent">Agent</option>
                      <option value="Vendor">Vendor</option>
                      <option value="CustomerBecomeAVendor">Customer Become A Vendor</option>
                      <option value="Referral">Referral</option>
                    </Form.Control>
                  </Form.Group>

                  <Button className="mt-3" variant="primary" onClick={calculateCommission}>
                    Calculate Commission
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            {commission && (
              <Card className="result-card">
                <Card.Body>
                  <h5>Commission Breakdown</h5>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>Commission (%)</th>
                        <th>Amount Earned ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{role}</td>
                        <td>{commission.percentage}%</td>
                        <td>${commission.amount}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
          </Col>
        </Row>
      </Container>
      <style>
        {`
        .commission-calculator-container {
  display: flex;
  height: 100vh;
}

.commission-calculator-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.commission-calculator-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.calculator-card, .result-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
`}
      </style>
    </div>
  );
};

export default CommissionCalculator;
