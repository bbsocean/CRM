import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import "../styles/UserFeedback.css"; // Import CSS

const UserFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [show, setShow] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ category: "", message: "" });

  useEffect(() => {
    fetchUserFeedback();
  }, []);

  const fetchUserFeedback = async () => {
    try {
      const response = await axios.get("/api/user-feedback");
      setFeedbacks(response.data);
      setFilteredFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user feedback:", error);
      setError("Failed to load user feedback.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = feedbacks;
    if (status) {
      filtered = filtered.filter(feedback => feedback.status === status);
    }
    setFilteredFeedbacks(filtered);
  };

  const handleAddFeedback = async () => {
    try {
      await axios.post("/api/user-feedback/add", newFeedback);
      alert("Feedback submitted successfully!");
      setShow(false);
      fetchUserFeedback();
    } catch (error) {
      console.error("Error adding feedback:", error);
      setError("Failed to submit feedback. Try again.");
    }
  };

  return (
    <div className="user-feedback-container">
      <h2 className="text-primary mb-4">📝 User Feedback</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
        <Button variant="success" onClick={() => setShow(true)}>Submit Feedback</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading feedback...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.map((feedback, index) => (
              <tr key={index}>
                <td>{new Date(feedback.date).toLocaleString()}</td>
                <td>{feedback.category}</td>
                <td>{feedback.message}</td>
                <td>{feedback.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" onChange={(e) => setNewFeedback({ ...newFeedback, category: e.target.value })}>
                <option value="">Select Category</option>
                <option value="Commission">Commission</option>
                <option value="Payout">Payout</option>
                <option value="System">System Issue</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={3} onChange={(e) => setNewFeedback({ ...newFeedback, message: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddFeedback}>Submit</Button>
        </Modal.Footer>
      </Modal>
      <style>
        {`
        /* User Feedback Styling */
.user-feedback-container {
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
  background-color: #f1c40f;
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

export default UserFeedback;
