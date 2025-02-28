// frontendnext/src/pages/UserManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, InputGroup, FormControl } from "react-bootstrap";
import "../../styles/UserManagement.scss";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Customer", status: true });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleShow = (user = null) => {
    setEditUser(user);
    setFormData(user || { name: "", email: "", role: "Customer", status: true });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.email) {
        alert("Name and Email are required!");
        return;
      }
      if (editUser) {
        await axios.put(`/api/users/update/${editUser._id}`, formData);
      } else {
        await axios.post("/api/users/create", formData);
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error("Error saving user", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/delete/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
      <Button variant="primary" onClick={() => handleShow()}>Add New User</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status ? "Active" : "Inactive"}</td>
              <td>
                <Button variant="warning" onClick={() => handleShow(user)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(user._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editUser ? "Edit User" : "Add New User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleChange}>
                <option value="Admin">Admin</option>
                <option value="Franchise">Franchise</option>
                <option value="Agent">Agent</option>
                <option value="Customer">Customer</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Check type="checkbox" label="Active" name="status" checked={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.checked })} />
            </Form.Group>
            <Button variant="primary" type="submit">Save User</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManagement;
