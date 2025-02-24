import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Badge, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Doughnut, Bar } from "react-chartjs-2";
import "../styles/AIAutomatedExpenseTracking.css"; // Importing CSS

const AIAutomatedExpenseTracking = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExpenseData();
  }, []);

  const fetchExpenseData = async () => {
    try {
      const response = await axios.get("/api/ai-expense-tracking");
      setExpenses(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch expense data.");
      setLoading(false);
    }
  };

  const chartData = {
    labels: expenses.map((data) => data.category),
    datasets: [
      {
        label: "Expense Amount ($)",
        data: expenses.map((data) => data.amount),
        backgroundColor: ["#e74c3c", "#f1c40f", "#3498db", "#9b59b6", "#2ecc71"],
      },
    ],
  };

  return (
    <div className="ai-expense-tracking-container">
      <Sidebar />
      <Container fluid className="ai-expense-tracking-content">
        <h2 className="ai-expense-tracking-title">📉 AI-Powered Expense Tracking</h2>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <>
            {/* Expense Breakdown Charts */}
            <Row>
              <Col md={6}>
                <Card className="chart-card">
                  <Card.Body>
                    <h5>Expense Distribution</h5>
                    <Doughnut data={chartData} />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="chart-card">
                  <Card.Body>
                    <h5>Monthly Expense Trend</h5>
                    <Bar data={chartData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Expense Breakdown Table */}
            <Table striped bordered hover responsive className="expense-table mt-4">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount ($)</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((data, index) => (
                  <tr key={index}>
                    <td>{data.category}</td>
                    <td>${data.amount}</td>
                    <td>
                      <Badge bg="info">{data.percentage}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
      <style>
        {`
        .ai-expense-tracking-container {
  display: flex;
  height: 100vh;
}

.ai-expense-tracking-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-expense-tracking-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.expense-table th {
  background-color: #e74c3c;
  color: white;
  text-align: center;
}

.expense-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIAutomatedExpenseTracking;
