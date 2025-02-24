import React, { useEffect, useState } from "react";
import { Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/UserAnalytics.css"; // Import CSS

const UserAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");
  const [userType, setUserType] = useState("");

  useEffect(() => {
    fetchUserAnalytics();
  }, []);

  const fetchUserAnalytics = async () => {
    try {
      const response = await axios.get("/api/user-analytics");
      setAnalyticsData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      setError("Failed to load user analytics data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = analyticsData;
    if (userType) {
      filtered = filtered.filter(data => data.userType === userType);
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
    labels: filteredData.map(data => data.period),
    datasets: [
      {
        label: "Total Engagements",
        data: filteredData.map(data => data.engagements),
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.5)",
        fill: true,
      },
    ],
  };

  return (
    <div className="user-analytics-container">
      <h2 className="text-primary mb-4">📊 User Analytics</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setUserType(e.target.value)}>
          <option value="">Select User Type</option>
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
          <span className="visually-hidden">Loading analytics...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="charts">
          <div className="chart">
            <h5>Engagement Trends</h5>
            <Line data={chartData} />
          </div>
        </div>
      )}
      <style>
        {`
        /* User Analytics Styling */
.user-analytics-container {
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

.charts {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.chart {
  width: 48%;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .charts {
    flex-direction: column;
  }
  .chart {
    width: 100%;
    margin-bottom: 20px;
  }
}
`}
      </style>
    </div>
  );
};

export default UserAnalytics;
