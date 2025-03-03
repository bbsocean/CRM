import React, { useEffect, useState } from "react";
import { Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/CommissionTrends.css"; // Import CSS

const CommissionTrends = () => {
  const [commissionData, setCommissionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");

  useEffect(() => {
    fetchCommissionTrends();
  }, []);

  const fetchCommissionTrends = async () => {
    try {
      const response = await axios.get("/api/commission-trends");
      setCommissionData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching commission trends:", error);
      setError("Failed to load commission trends data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = commissionData;
    if (timeframe === "Monthly") {
      filtered = commissionData.filter(trend => trend.periodType === "Monthly");
    } else if (timeframe === "Quarterly") {
      filtered = commissionData.filter(trend => trend.periodType === "Quarterly");
    } else if (timeframe === "Yearly") {
      filtered = commissionData.filter(trend => trend.periodType === "Yearly");
    }
    setFilteredData(filtered);
  };

  const chartData = {
    labels: filteredData.map(trend => trend.period),
    datasets: [
      {
        label: "Commission Earnings ($)",
        data: filteredData.map(trend => trend.amount),
        borderColor: "#2980b9",
        backgroundColor: "rgba(41, 128, 185, 0.5)",
        fill: true,
      },
    ],
  };

  return (
    <div className="commission-trends-container">
      <h2 className="text-primary mb-4">📈 Commission Trends</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setTimeframe(e.target.value)}>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </Form.Control>
        <Button variant="primary" onClick={handleFilter}>Apply Filter</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading trends...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="charts">
          <div className="chart">
            <h5>Line Chart</h5>
            <Line data={chartData} />
          </div>
          <div className="chart">
            <h5>Bar Chart</h5>
            <Bar data={chartData} />
          </div>
        </div>
      )}
      <style>
        {`
        /* Commission Trends Styling */
.commission-trends-container {
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

export default CommissionTrends;
