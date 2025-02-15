import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import "../styles/SupportTickets.css"; // Import CSS

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [show, setShow] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "" });

  useEffect(() => {
    fetchSupportTickets();
  }, []);

  const fetchSupportTickets = async () => {
    try {
      const response = await axios.get("/api/support-tickets");
      setTickets(response.data);
      setFilteredTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      setError("Failed to load support tickets.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = tickets;
    if (status) {
      filtered = filtered.filter(ticket => ticket.status === status);
    }
    setFilteredTickets(filtered);
  };

  const handleAddTicket = async () => {
    try {
      await axios.post("/api/support-tickets/add", newTicket);
      alert("Support ticket submitted successfully!");
      setShow(false);
      fetchSupportTickets();
    } catch (error) {
      console.error("Error adding support ticket:", error);
      setError("Failed to submit ticket. Try again.");
    }
  };

  return (
    <div className="support-tickets-container">
      <h2 className="text-primary mb-4">📩 Support Tickets</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
        <Button variant="success" onClick={() => setShow(true)}>New Ticket</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading tickets...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket, index) => (
              <tr key={index}>
                <td>{new Date(ticket.date).toLocaleString()}</td>
                <td>{ticket.subject}</td>
                <td>{ticket.description}</td>
                <td>{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Support Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Subject</Form.Label>
              <Form.Control type="text" onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddTicket}>Submit</Button>
        </Modal.Footer>
      </Modal>
      <style>
        {`
        /* Support Tickets Styling */
.support-tickets-container {
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

export default SupportTickets;
