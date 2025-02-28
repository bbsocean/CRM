import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AIBugDetection = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBugReports();
  }, []);

  const fetchBugReports = async () => {
    try {
      const response = await axios.get("/api/ai-bug-detection");
      setBugs(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load bug reports.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-bug-detection-container">
      <Sidebar />
      <Container fluid className="ai-bug-detection-content">
        <h2 className="ai-bug-detection-title">🐞 AI Bug Detection</h2>

        {/* Bug Reports Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="bug-table mt-4">
            <thead>
              <tr>
                <th>Bug ID</th>
                <th>Module</th>
                <th>Issue Type</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bugs.map((bug, index) => (
                <tr key={index}>
                  <td>{bug.bugId}</td>
                  <td>{bug.module}</td>
                  <td>{bug.issueType}</td>
                  <td>{bug.severity}</td>
                  <td>
                    <Button
                      variant={bug.status === "Resolved" ? "success" : "warning"}
                      disabled
                    >
                      {bug.status}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-bug-detection-container {
  display: flex;
  height: 100vh;
}

.ai-bug-detection-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-bug-detection-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.bug-table th {
  background-color: #c0392b;
  color: white;
  text-align: center;
}

.bug-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIBugDetection;
