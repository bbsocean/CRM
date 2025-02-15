import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AICloudCostOptimization.css"; // Importing CSS

const AICloudCostOptimization = () => {
  const [costData, setCostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCostData();
  }, []);

  const fetchCostData = async () => {
    try {
      const response = await axios.get("/api/ai-cloud-cost-optimization");
      setCostData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load cost optimization data.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-cloud-cost-optimization-container">
      <Sidebar />
      <Container fluid className="ai-cloud-cost-optimization-content">
        <h2 className="ai-cloud-cost-optimization-title">💰 AI Cloud Cost Optimization</h2>

        {/* Cost Optimization Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="cost-table mt-4">
            <thead>
              <tr>
                <th>Service</th>
                <th>Current Cost ($)</th>
                <th>Optimization Potential (%)</th>
                <th>AI Suggested Cost ($)</th>
              </tr>
            </thead>
            <tbody>
              {costData.map((data, index) => (
                <tr key={index}>
                  <td>{data.serviceName}</td>
                  <td>${data.currentCost}</td>
                  <td>
                    <ProgressBar
                      now={data.optimizationPotential}
                      label={`${data.optimizationPotential}%`}
                      variant={data.optimizationPotential > 50 ? "success" : "warning"}
                    />
                  </td>
                  <td>${data.suggestedCost}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-cloud-cost-optimization-container {
  display: flex;
  height: 100vh;
}

.ai-cloud-cost-optimization-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-cloud-cost-optimization-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.cost-table th {
  background-color: #d35400;
  color: white;
  text-align: center;
}

.cost-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AICloudCostOptimization;
