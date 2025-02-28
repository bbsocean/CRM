import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/HierarchyManagement.css"; // Import CSS

const HierarchyManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchHierarchyData();
  }, []);

  const fetchHierarchyData = async () => {
    try {
      const response = await axios.get("/api/hierarchy-management");
      setUsers(response.data);
      setFilteredUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching hierarchy data:", error);
      setError("Failed to load hierarchy data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = users;
    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }
    setFilteredUsers(filtered);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Hierarchy Management Report", 20, 10);
    doc.autoTable({
      head: [["User ID", "Name", "Role", "Parent ID"]],
      body: filteredUsers.map(user => [
        user.userId,
        user.name,
        user.role,
        user.parentId
      ]),
    });
    doc.save("hierarchy-management.pdf");
  };

  return (
    <div className="hierarchy-management-container">
      <h2 className="text-primary mb-4">🏗️ Hierarchy Management</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
          <option value="">Filter by Role</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Vendor">Vendor</option>
          <option value="CustomerBecomeAVendor">CustomerBecomeAVendor</option>
          <option value="Referral">Referral</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      <div className="export-buttons">
        <CSVLink data={filteredUsers} filename="hierarchy-management.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading hierarchy data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Parent ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.parentId}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Hierarchy Management Styling */
.hierarchy-management-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
  background-color: #f8f9fa;
  border-radius: 10px;
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
  margin: 20px 0;
}

.btn-success {
  background-color: #28a745;
  border: none;
}

.btn-danger {
  background-color: #dc3545;
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

export default HierarchyManagement;
