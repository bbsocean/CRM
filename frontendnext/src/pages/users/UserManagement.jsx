import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());

    try {
      if (currentUser) {
        await axios.put(`/api/users/${currentUser._id}`, userData);
      } else {
        await axios.post("/api/users", userData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="user-management-container">
      <h2 className="text-primary mb-4">👥 User Management</h2>
      <Button variant="success" onClick={() => { setCurrentUser(null); setShowModal(true); }}>
        ➕ Add New User
      </Button>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading users...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="primary" onClick={() => { setCurrentUser(user); setShowModal(true); }}>✏ Edit</Button>{" "}
                  <Button variant="danger" onClick={() => handleDelete(user._id)}>🗑 Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={currentUser?.name} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" defaultValue={currentUser?.email} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" defaultValue={currentUser?.role} required>
                <option value="Franchise">Franchise</option>
                <option value="Agent">Agent</option>
                <option value="Vendor">Vendor</option>
                <option value="TerritoryHead">Territory Head</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="success">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <style>
        {`
        .user-management-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.table th,
.table td {
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

export default UserManagement;
