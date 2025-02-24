import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIAnomalyDetection.css"; // Importing CSS

const AIAnomalyDetection = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const fetchAnomalies = async () => {
    try {
      const response = await axios.get("/api/ai-anomaly-detection");
      setAnomalies(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load anomaly detection data.");
      setLoading(false);
    }
  };

  const resolveAnomaly = async (anomalyId) => {
    try {
      await axios.post("/api/ai-anomaly-detection/resolve", { id: anomalyId });
      alert("Anomaly resolution initiated successfully!");
      fetchAnomalies();
    } catch (err) {
      console.error("Error resolving anomaly:", err);
    }
  };

  return (
    <div className="ai-anomaly-detection-container">
      <Sidebar />
      <Container fluid className="ai-anomaly-detection-content">
        <h2 className="ai-anomaly-detection-title">🚨 AI Anomaly Detection System</h2>

        {/* Anomaly Detection Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="anomaly-table mt-4">
            <thead>
              <tr>
                <th>Anomaly Type</th>
                <th>Detected At</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((anomaly, index) => (
                <tr key={index}>
                  <td>{anomaly.type}</td>
                  <td>{new Date(anomaly.detectedAt).toLocaleString()}</td>
                  <td>
                    <ProgressBar
                      now={anomaly.riskLevel}
                      label={`${anomaly.riskLevel}%`}
                      variant={anomaly.riskLevel > 70 ? "danger" : anomaly.riskLevel > 40 ? "warning" : "success"}
                    />
                  </td>
                  <td>{anomaly.status}</td>
                  <td>
                    <Button variant="danger" onClick={() => resolveAnomaly(anomaly._id)} disabled={anomaly.status === "Resolved"}>
                      Resolve
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
        .ai-anomaly-detection-container {
  display: flex;
  height: 100vh;
}

.ai-anomaly-detection-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-anomaly-detection-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.anomaly-table th {
  background-color: #d35400;
  color: white;
  text-align: center;
}

.anomaly-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIAnomalyDetection;
