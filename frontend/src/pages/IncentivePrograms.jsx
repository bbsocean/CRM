import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import "../styles/IncentivePrograms.css"; // Import CSS

const IncentivePrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [show, setShow] = useState(false);
  const [newProgram, setNewProgram] = useState({ title: "", description: "", eligibility: "", reward: "" });

  useEffect(() => {
    fetchIncentivePrograms();
  }, []);

  const fetchIncentivePrograms = async () => {
    try {
      const response = await axios.get("/api/incentive-programs");
      setPrograms(response.data);
      setFilteredPrograms(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching incentive programs:", error);
      setError("Failed to load incentive programs.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = programs;
    if (role) {
      filtered = filtered.filter(program => program.eligibility === role);
    }
    setFilteredPrograms(filtered);
  };

  const handleAddProgram = async () => {
    try {
      await axios.post("/api/incentive-programs/add", newProgram);
      alert("New incentive program added successfully!");
      setShow(false);
      fetchIncentivePrograms();
    } catch (error) {
      console.error("Error adding incentive program:", error);
      setError("Failed to add program. Try again.");
    }
  };

  return (
    <div className="incentive-programs-container">
      <h2 className="text-primary mb-4">🎯 Incentive Programs</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
          <option value="">Filter by Eligibility</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Vendor">Vendor</option>
          <option value="Referral">Referral</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
        <Button variant="success" onClick={() => setShow(true)}>New Incentive</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading incentive programs...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Eligibility</th>
              <th>Reward</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.map((program, index) => (
              <tr key={index}>
                <td>{program.title}</td>
                <td>{program.description}</td>
                <td>{program.eligibility}</td>
                <td>{program.reward}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Incentive Program</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Eligibility</Form.Label>
              <Form.Control type="text" onChange={(e) => setNewProgram({ ...newProgram, eligibility: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Reward</Form.Label>
              <Form.Control type="text" onChange={(e) => setNewProgram({ ...newProgram, reward: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddProgram}>Submit</Button>
        </Modal.Footer>
      </Modal>
      <style>
        {`
        /* Incentive Programs Styling */
.incentive-programs-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
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
  border: 1px solid #ccc;
}

.table {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.table thead {
  background-color: #007bff;
  color: white;
}

.table tbody tr:hover {
  background-color: #e9ecef;
}

.modal-content {
  border-radius: 10px;
}

.modal-header {
  background-color: #007bff;
  color: white;
  border-radius: 10px 10px 0 0;
}

.modal-footer {
  background-color: #f1f1f1;
}

.btn-success {
  background-color: #28a745;
  border: none;
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

export default IncentivePrograms;
