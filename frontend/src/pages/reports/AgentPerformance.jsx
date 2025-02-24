import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const AgentPerformance = () => {
  const [agentData, setAgentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAgentPerformance();
  }, []);

  const fetchAgentPerformance = async () => {
    try {
      const response = await axios.get("/api/performance/agents");
      setAgentData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching performance:", error);
      setError("Failed to load data.");
      setLoading(false);
    }
  };

  return (
    <div className="performance-container">
      <h2 className="text-primary mb-4">📊 Agent Performance</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Card className="performance-card">
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Total Sales ($)</th>
                  <th>Commission Earned ($)</th>
                  <th>Conversion Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {agentData.map((agent, index) => (
                  <tr key={index}>
                    <td>{agent.name}</td>
                    <td>${agent.sales}</td>
                    <td>${agent.commission}</td>
                    <td>{agent.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      <style>
        {`
        .performance-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.performance-card {
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: white;
  border-radius: 10px;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle;
}

h2.text-primary {
  text-align: center;
}

        `}
      </style>
    </div>
  );
};

export default AgentPerformance;
