import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Badge, Button, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIAutomationSuite.css"; // Importing CSS

const AIAutomationSuite = () => {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    type: "Workflow",
    status: "Inactive",
  });

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      const response = await axios.get("/api/ai-automation-suite");
      setAutomations(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load automation processes.");
      setLoading(false);
    }
  };

  const handleCreateAutomation = async () => {
    try {
      await axios.post("/api/ai-automation-suite", newAutomation);
      alert("New AI Automation Process Created Successfully!");
      fetchAutomations();
    } catch (err) {
      console.error("Error creating automation:", err);
    }
  };

  return (
    <div className="ai-automation-suite-container">
      <Sidebar />
      <Container fluid className="ai-automation-suite-content">
        <h2 className="ai-automation-suite-title">🤖 AI Automation Suite</h2>

        <Form className="mb-4">
          <Form.Group>
            <Form.Label>Automation Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter automation name"
              value={newAutomation.name}
              onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Automation Type</Form.Label>
            <Form.Select
              value={newAutomation.type}
              onChange={(e) => setNewAutomation({ ...newAutomation, type: e.target.value })}
            >
              <option value="Workflow">Workflow</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
            </Form.Select>
          </Form.Group>

          <Button variant="success" className="mt-2" onClick={handleCreateAutomation}>
            Create Automation
          </Button>
        </Form>

        {/* Automations Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="automation-table mt-4">
            <thead>
              <tr>
                <th>Automation Name</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {automations.map((automation, index) => (
                <tr key={index}>
                  <td>{automation.name}</td>
                  <td>{automation.type}</td>
                  <td>
                    <Badge bg={automation.status === "Active" ? "success" : "secondary"}>
                      {automation.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-automation-suite-container {
  display: flex;
  height: 100vh;
}

.ai-automation-suite-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-automation-suite-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.automation-table th {
  background-color: #2ecc71;
  color: white;
  text-align: center;
}

.automation-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIAutomationSuite;
