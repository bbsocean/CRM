import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RevenueTracking = () => {
  const [revenues, setRevenues] = useState([]);
  const [filteredRevenues, setFilteredRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const response = await axios.get("/api/revenue-tracking");
      setRevenues(response.data);
      setFilteredRevenues(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setError("Failed to load revenue data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = revenues;
    if (role) {
      filtered = filtered.filter(revenue => revenue.role === role);
    }
    if (timeframe === "Monthly") {
      filtered = filtered.filter(revenue => revenue.periodType === "Monthly");
    } else if (timeframe === "Quarterly") {
      filtered = filtered.filter(revenue => revenue.periodType === "Quarterly");
    } else if (timeframe === "Yearly") {
      filtered = filtered.filter(revenue => revenue.periodType === "Yearly");
    }
    setFilteredRevenues(filtered);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Revenue Tracking Report", 20, 10);
    doc.autoTable({
      head: [["Date", "User", "Role", "Revenue ($)"]],
      body: filteredRevenues.map(revenue => [revenue.date, revenue.name, revenue.role, revenue.revenueAmount]),
    });
    doc.save("revenue-tracking.pdf");
  };

  const chartData = {
    labels: filteredRevenues.map(revenue => revenue.date),
    datasets: [
      {
        label: "Revenue ($)",
        data: filteredRevenues.map(revenue => revenue.revenueAmount),
        backgroundColor: ["#27ae60"],
        borderColor: ["#1e8449"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="revenue-tracking-container">
      <h2 className="text-primary mb-4">💰 Revenue Tracking</h2>

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

      <div className="export-buttons">
        <CSVLink data={filteredRevenues} filename="revenue-tracking.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading revenue data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="charts">
          <Bar data={chartData} />
        </div>
      )}
      <style>
        {`
        /* Revenue Tracking Styling */
.revenue-tracking-container {
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

export default RevenueTracking;
