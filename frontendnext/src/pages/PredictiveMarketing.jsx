import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Table, Badge, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/PredictiveMarketing.css"; // Importing CSS

const PredictiveMarketing = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPredictiveMarketingData();
  }, []);

  const fetchPredictiveMarketingData = async () => {
    try {
      const response = await axios.get("/api/predictive-marketing");
      setCampaigns(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch predictive marketing data.");
      setLoading(false);
    }
  };

  return (
    <div className="predictive-marketing-container">
      <Sidebar />
      <Container fluid className="predictive-marketing-content">
        <h2 className="predictive-marketing-title">📊 AI-Powered Predictive Marketing</h2>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <Table striped bordered hover responsive className="marketing-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Target Audience</th>
                <th>Engagement Rate</th>
                <th>Conversion Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <tr key={index}>
                  <td>{campaign.name}</td>
                  <td>{campaign.targetAudience}</td>
                  <td>{campaign.engagementRate}%</td>
                  <td>{campaign.conversionRate}%</td>
                  <td>
                    <Badge bg={campaign.status === "Active" ? "success" : "danger"}>
                      {campaign.status}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="info" size="sm">View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .predictive-marketing-container {
  display: flex;
  height: 100vh;
}

.predictive-marketing-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.predictive-marketing-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.marketing-table th {
  background-color: #f39c12;
  color: white;
  text-align: center;
}

.marketing-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default PredictiveMarketing;
