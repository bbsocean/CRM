import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIAutomatedTaxCalculation.css"; // Importing CSS

const AIAutomatedTaxCalculation = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taxType, setTaxType] = useState("GST");

  useEffect(() => {
    fetchTaxCalculations();
  }, [taxType]);

  const fetchTaxCalculations = async () => {
    try {
      const response = await axios.get(`/api/ai-tax-calculation?taxType=${taxType}`);
      setTransactions(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load tax calculations.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-tax-calculation-container">
      <Sidebar />
      <Container fluid className="ai-tax-calculation-content">
        <h2 className="ai-tax-calculation-title">📊 AI Automated Tax Calculation</h2>

        <Form className="mb-4">
          <Form.Group>
            <Form.Label>Select Tax Type</Form.Label>
            <Form.Select value={taxType} onChange={(e) => setTaxType(e.target.value)}>
              <option value="GST">GST</option>
              <option value="VAT">VAT</option>
              <option value="Service Tax">Service Tax</option>
            </Form.Select>
          </Form.Group>
        </Form>

        {/* Tax Calculation Data Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="tax-table mt-4">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount ($)</th>
                <th>Tax Type</th>
                <th>Tax (%)</th>
                <th>Calculated Tax ($)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((data, index) => (
                <tr key={index}>
                  <td>{data.transactionId}</td>
                  <td>{data.amount}</td>
                  <td>{data.taxType}</td>
                  <td>{data.taxPercentage}%</td>
                  <td>{data.calculatedTax}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-tax-calculation-container {
  display: flex;
  height: 100vh;
}

.ai-tax-calculation-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-tax-calculation-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.tax-table th {
  background-color: #f39c12;
  color: white;
  text-align: center;
}

.tax-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIAutomatedTaxCalculation;
