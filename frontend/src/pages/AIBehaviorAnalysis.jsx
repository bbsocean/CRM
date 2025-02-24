import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIBehaviorAnalysis.css"; // Importing CSS

const AIBehaviorAnalysis = () => {
  const [behaviorData, setBehaviorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analysisType, setAnalysisType] = useState("Browsing Pattern");

  useEffect(() => {
    fetchBehaviorData();
  }, [analysisType]);

  const fetchBehaviorData = async () => {
    try {
      const response = await axios.get(`/api/ai-behavior-analysis?type=${analysisType}`);
      setBehaviorData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load customer behavior analysis.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-behavior-analysis-container">
      <Sidebar />
      <Container fluid className="ai-behavior-analysis-content">
        <h2 className="ai-behavior-analysis-title">🧐 AI Behavior Analysis</h2>

        <Form className="mb-4">
          <Form.Group>
            <Form.Label>Select Analysis Type</Form.Label>
            <Form.Select value={analysisType} onChange={(e) => setAnalysisType(e.target.value)}>
              <option value="Browsing Pattern">Browsing Pattern</option>
              <option value="Purchase History">Purchase History</option>
              <option value="Product Interest">Product Interest</option>
            </Form.Select>
          </Form.Group>
        </Form>

        {/* Behavior Data Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="behavior-table mt-4">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Behavior Type</th>
                <th>Engagement Level</th>
                <th>Most Viewed Product</th>
                <th>Predicted Next Action</th>
              </tr>
            </thead>
            <tbody>
              {behaviorData.map((data, index) => (
                <tr key={index}>
                  <td>{data.customerName}</td>
                  <td>{data.behaviorType}</td>
                  <td>{data.engagementLevel}</td>
                  <td>{data.mostViewedProduct}</td>
                  <td>{data.predictedNextAction}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-behavior-analysis-container {
  display: flex;
  height: 100vh;
}

.ai-behavior-analysis-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-behavior-analysis-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.behavior-table th {
  background-color: #e67e22;
  color: white;
  text-align: center;
}

.behavior-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIBehaviorAnalysis;
