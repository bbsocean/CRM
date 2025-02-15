import React, { useState } from "react";
import { Container, Card, Button, Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AICRMFinalTesting.css"; // Importing CSS

const AICRMFinalTesting = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startFinalTesting = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/api/ai-crm-final-testing");
      setTestResults(response.data.tests);
    } catch (err) {
      setError("Failed to run final testing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-crm-final-testing-container">
      <Sidebar />
      <Container fluid className="ai-crm-final-testing-content">
        <h2 className="ai-crm-final-testing-title">✅ AI CRM Final Testing</h2>

        <Card className="crm-testing-card">
          <Card.Body>
            <Button variant="primary" onClick={startFinalTesting}>
              Start Final Testing
            </Button>
            {loading && <Spinner animation="border" className="testing-spinner" />}
            {error && <Alert variant="danger">{error}</Alert>}
          </Card.Body>
        </Card>

        {testResults.length > 0 && (
          <Table striped bordered hover className="testing-table mt-4">
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Component</th>
                <th>Status</th>
                <th>Issues Detected</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((test, index) => (
                <tr key={index}>
                  <td>{test.id}</td>
                  <td>{test.component}</td>
                  <td>{test.status}</td>
                  <td>{test.issues}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-crm-final-testing-container {
  display: flex;
  height: 100vh;
}

.ai-crm-final-testing-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-crm-final-testing-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.crm-testing-card {
  max-width: 600px;
  margin: auto;
  text-align: center;
}

.testing-spinner {
  margin-top: 10px;
}

.testing-table th {
  background-color: #3498db;
  color: white;
  text-align: center;
}

.testing-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AICRMFinalTesting;
