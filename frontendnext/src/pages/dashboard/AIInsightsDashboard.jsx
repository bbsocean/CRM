import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

const AIInsightsDashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [commissionData, setCommissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/ai-insights/predictions");
      setSalesData(response.data.sales);
      setCommissionData(response.data.commissions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setError("Failed to load insights.");
      setLoading(false);
    }
  };

  // Sales Chart Data
  const salesChartData = {
    labels: salesData ? salesData.map((d) => d.month) : [],
    datasets: [
      {
        label: "Actual Sales ($)",
        data: salesData ? salesData.map((d) => d.actual) : [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Predicted Sales ($)",
        data: salesData ? salesData.map((d) => d.predicted) : [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Commission Chart Data
  const commissionChartData = {
    labels: commissionData ? commissionData.map((d) => d.month) : [],
    datasets: [
      {
        label: "Actual Commission ($)",
        data: commissionData ? commissionData.map((d) => d.actual) : [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.4,
      },
      {
        label: "Predicted Commission ($)",
        data: commissionData ? commissionData.map((d) => d.predicted) : [],
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="ai-insights-dashboard">
      <h2 className="text-primary mb-4">📈 AI Insights & Sales Forecast</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading AI predictions...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          <Col md={6}>
            <Card className="insight-card">
              <Card.Body>
                <Card.Title>📊 Sales Growth Prediction</Card.Title>
                <Bar data={salesChartData} />
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="insight-card">
              <Card.Body>
                <Card.Title>💰 Commission Forecast</Card.Title>
                <Line data={commissionChartData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      <style>
        {`
        .ai-insights-dashboard {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.insight-card {
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.chart-container {
  margin: 20px 0;
}
`}
      </style>
    </div>
  );
};

export default AIInsightsDashboard;
