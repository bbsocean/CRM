import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/CommissionReports.css"; // Import CSS

const CommissionReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchCommissionReports();
  }, []);

  const fetchCommissionReports = async () => {
    try {
      const response = await axios.get("/api/commission-reports");
      setReports(response.data);
      setFilteredReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching commission reports:", error);
      setError("Failed to load commission report data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = reports;
    if (role) {
      filtered = filtered.filter(report => report.role === role);
    }
    if (timeframe === "Monthly") {
      filtered = filtered.filter(report => report.periodType === "Monthly");
    } else if (timeframe === "Quarterly") {
      filtered = filtered.filter(report => report.periodType === "Quarterly");
    } else if (timeframe === "Yearly") {
      filtered = filtered.filter(report => report.periodType === "Yearly");
    }
    setFilteredReports(filtered);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Commission Reports", 20, 10);
    doc.autoTable({
      head: [["Date", "User", "Role", "Commission ($)"]],
      body: filteredReports.map(report => [report.date, report.name, report.role, report.commission]),
    });
    doc.save("commission-reports.pdf");
  };

  return (
    <div className="commission-reports-container">
      <h2 className="text-primary mb-4">📊 Commission Reports</h2>

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
        <CSVLink data={filteredReports} filename="commission-reports.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading commission reports...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Role</th>
              <th>Commission ($)</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={index}>
                <td>{new Date(report.date).toLocaleDateString()}</td>
                <td>{report.name}</td>
                <td>{report.role}</td>
                <td>${report.commission}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Commission Reports Styling */
.commission-reports-container {
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

.export-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.table thead {
  background-color: #3498db;
  color: white;
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

export default CommissionReports;
