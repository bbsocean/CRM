import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/BonusRewards.css"; // Import CSS

const BonusRewards = () => {
  const [bonusData, setBonusData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchBonusRewards();
  }, []);

  const fetchBonusRewards = async () => {
    try {
      const response = await axios.get("/api/bonus-rewards");
      setBonusData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bonus rewards:", error);
      setError("Failed to load bonus rewards data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = bonusData;
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
    labels: ["Performance Bonus", "Referral Rewards", "Sales Target Incentives"],
    datasets: [
      {
        label: "Bonus & Rewards ($)",
        data: [
          filteredData.reduce((sum, item) => sum + item.performanceBonus, 0),
          filteredData.reduce((sum, item) => sum + item.referralBonus, 0),
          filteredData.reduce((sum, item) => sum + item.salesIncentive, 0),
        ],
        backgroundColor: ["#2ecc71", "#f39c12", "#3498db"],
      },
    ],
  };

  return (
    <div className="bonus-rewards-container">
      <h2 className="text-primary mb-4">🏆 Bonus & Rewards</h2>

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
          <span className="visually-hidden">Loading bonus data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="charts">
          <div className="chart">
            <h5>Bonus & Rewards Breakdown</h5>
            <Pie data={chartData} />
          </div>
        </div>
      )}
      <style>
        {`
        /* Bonus & Rewards Styling */
.bonus-rewards-container {
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

export default BonusRewards;
