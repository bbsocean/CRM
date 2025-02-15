import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Spinner, Form, Modal } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/CRMUserManagement.css"; // Importing CSS

const CRMUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Franchise" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users.");
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post("/api/users", newUser);
      setUsers([...users, response.data]);
      setShowModal(false);
      setNewUser({ name: "", email: "", role: "Franchise" });
    } catch (err) {
      setError("Failed to add user.");
    }
  };

  return (
    <div className="crm-user-management-container">
      <Sidebar />
      <Container fluid className="crm-user-management-content">
        <h2 className="crm-user-management-title">👥 CRM User Management</h2>

        <Button className="mb-3" onClick={() => setShowModal(true)}>➕ Add User</Button>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <Table striped bordered hover responsive className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button variant="danger" size="sm">Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      {/* Add User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="Franchise">Franchise</option>
                <option value="Territory Head">Territory Head</option>
                <option value="Agent">Agent</option>
                <option value="Vendor">Vendor</option>
                <option value="Customer">Customer</option>
                <option value="Referral">Referral</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={handleAddUser}>Add User</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <style>
        {`
        .crm-user-management-container {
  display: flex;
  height: 100vh;
}

.crm-user-management-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.crm-user-management-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.user-table th {
  background-color: #3498db;
  color: white;
  text-align: center;
}

.user-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default CRMUserManagement;
