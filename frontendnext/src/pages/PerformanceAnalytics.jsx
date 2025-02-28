import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import "chart.js/auto";

const PerformanceAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchPerformanceAnalytics();
  }, []);

  const fetchPerformanceAnalytics = async () => {
    try {
      const response = await axios.get("/api/performance-analytics");
      setAnalyticsData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching performance analytics:", error);
      setError("Failed to load performance analytics.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = analyticsData;
    if (role) {
      filtered = filtered.filter(data => data.role === role);
    }
    if (timeframe === "Monthly") {
      filtered = filtered.filter(data => data.periodType === "Monthly");
    } else if (timeframe === "Quarterly") {
      filtered = filtered.filter(data => data.periodType === "Quarterly");
    } else if (timeframe === "Yearly") {
      filtered = filtered.filter(data => data.periodType === "Yearly");
    }
    setFilteredData(filtered);
  };

  const chartData = {
    labels: filteredData.map(data => data.date),
    datasets: [
      {
        label: "Performance Score",
        data: filteredData.map(data => data.performanceScore),
        backgroundColor: ["#3498db"],
        borderColor: ["#2980b9"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="performance-analytics-container">
      <h2 className="text-primary mb-4">📊 Performance Analytics</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Vendor">Vendor</option>
          <option value="Referral">Referral</option>
        </Form.Control>

        <Form.Control as="select" onChange={(e) => setTimeframe(e.target.value)}>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading analytics data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="charts">
          <div className="chart">
            <h5>Performance Over Time</h5>
            <Line data={chartData} />
          </div>
        </div>
      )}
      <style>
        {`
        /* Performance Analytics Styling */
.performance-analytics-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters select {
  width: 30%;
  padding: 10px;
  border-radius: 5px;
}

.chart {
  width: 100%;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  .filters select {
    width: 100%;
    margin-bottom: 10px;
  }
}
`}
      </style>
    </div>
  );
};

export default PerformanceAnalytics;
