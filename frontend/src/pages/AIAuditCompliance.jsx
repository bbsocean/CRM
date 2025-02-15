import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Badge, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIAuditCompliance.css"; // Importing CSS

const AIAuditCompliance = () => {
  const [auditReports, setAuditReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAuditReports();
  }, []);

  const fetchAuditReports = async () => {
    try {
      const response = await axios.get("/api/ai-audit-compliance");
      setAuditReports(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load audit compliance reports.");
      setLoading(false);
    }
  };

  const initiateAudit = async () => {
    try {
      await axios.post("/api/ai-audit-compliance/initiate");
      alert("AI Audit & Compliance Check initiated successfully!");
      fetchAuditReports();
    } catch (err) {
      console.error("Error initiating audit:", err);
    }
  };

  return (
    <div className="ai-audit-compliance-container">
      <Sidebar />
      <Container fluid className="ai-audit-compliance-content">
        <h2 className="ai-audit-compliance-title">📊 AI Audit & Compliance</h2>

        <Button variant="primary" className="mb-3" onClick={initiateAudit}>
          Initiate AI Audit & Compliance Check
        </Button>

        {/* Audit Compliance Reports Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="audit-table mt-4">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Compliance Area</th>
                <th>Risk Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {auditReports.map((report, index) => (
                <tr key={index}>
                  <td>{report.timestamp}</td>
                  <td>{report.area}</td>
                  <td>
                    <Badge bg={report.riskLevel === "High" ? "danger" : report.riskLevel === "Medium" ? "warning" : "success"}>
                      {report.riskLevel}
                    </Badge>
                  </td>
                  <td>{report.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-audit-compliance-container {
  display: flex;
  height: 100vh;
}

.ai-audit-compliance-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-audit-compliance-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.audit-table th {
  background-color: #2980b9;
  color: white;
  text-align: center;
}

.audit-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIAuditCompliance;
