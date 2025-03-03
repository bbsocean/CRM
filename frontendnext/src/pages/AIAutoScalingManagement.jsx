import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AIAutoScalingManagement = () => {
  const [scalingData, setScalingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [autoScaling, setAutoScaling] = useState(false);

  useEffect(() => {
    fetchScalingData();
  }, []);

  const fetchScalingData = async () => {
    try {
      const response = await axios.get("/api/ai-auto-scaling");
      setScalingData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load auto-scaling data.");
      setLoading(false);
    }
  };

  const toggleAutoScaling = async () => {
    try {
      await axios.post("/api/ai-auto-scaling/toggle", { enabled: !autoScaling });
      setAutoScaling(!autoScaling);
    } catch (err) {
      console.error("Error toggling auto-scaling:", err);
    }
  };

  return (
    <div className="ai-auto-scaling-management-container">
      <Sidebar />
      <Container fluid className="ai-auto-scaling-management-content">
        <h2 className="ai-auto-scaling-management-title">⚙️ AI Auto Scaling Management</h2>

        <Button variant={autoScaling ? "danger" : "success"} className="mb-3" onClick={toggleAutoScaling}>
          {autoScaling ? "Disable Auto Scaling" : "Enable Auto Scaling"}
        </Button>

        {/* Auto Scaling Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="scaling-table mt-4">
            <thead>
              <tr>
                <th>Instance</th>
                <th>CPU Usage (%)</th>
                <th>Scaling Status</th>
              </tr>
            </thead>
            <tbody>
              {scalingData.map((data, index) => (
                <tr key={index}>
                  <td>{data.instanceId}</td>
                  <td>{data.cpuUsage}%</td>
                  <td>
                    <ProgressBar
                      now={data.optimizationScore}
                      label={`${data.optimizationScore}%`}
                      variant={data.optimizationScore > 80 ? "success" : data.optimizationScore > 50 ? "warning" : "danger"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-auto-scaling-management-container {
  display: flex;
  height: 100vh;
}

.ai-auto-scaling-management-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-auto-scaling-management-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.scaling-table th {
  background-color: #16a085;
  color: white;
  text-align: center;
}

.scaling-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIAutoScalingManagement;
