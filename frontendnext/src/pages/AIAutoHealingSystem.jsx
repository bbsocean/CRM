import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Alert, Button, Badge } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIAutoHealingSystem.css"; // Importing CSS

const AIAutoHealingSystem = () => {
  const [healingData, setHealingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHealingData();
  }, []);

  const fetchHealingData = async () => {
    try {
      const response = await axios.get("/api/ai-auto-healing");
      setHealingData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load auto-healing data.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-auto-healing-system-container">
      <Sidebar />
      <Container fluid className="ai-auto-healing-system-content">
        <h2 className="ai-auto-healing-system-title">🛠️ AI Auto-Healing System</h2>

        {/* Healing System Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="healing-table mt-4">
            <thead>
              <tr>
                <th>System Component</th>
                <th>Issue Detected</th>
                <th>Healing Status</th>
                <th>Resolved At</th>
              </tr>
            </thead>
            <tbody>
              {healingData.map((data, index) => (
                <tr key={index}>
                  <td>{data.component}</td>
                  <td>{data.issueDetected}</td>
                  <td>
                    <Badge bg={data.status === "Resolved" ? "success" : "warning"}>
                      {data.status}
                    </Badge>
                  </td>
                  <td>{data.resolvedAt || "In Progress"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-auto-healing-system-container {
  display: flex;
  height: 100vh;
}

.ai-auto-healing-system-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-auto-healing-system-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.healing-table th {
  background-color: #d35400;
  color: white;
  text-align: center;
}

.healing-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIAutoHealingSystem;
