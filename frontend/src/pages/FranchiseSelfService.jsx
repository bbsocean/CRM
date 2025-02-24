import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/FranchiseSelfService.css"; // Import CSS

const FranchiseSelfService = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/franchise-transactions");
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions.");
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Franchise Earnings Report", 20, 10);
    doc.autoTable({
      head: [["Date", "Agent", "Customer", "Sales Amount", "Commission"]],
      body: transactions.map(txn => [
        txn.date,
        txn.agent,
        txn.customer,
        `$${txn.salesAmount}`,
        `$${txn.commission}`,
      ]),
    });
    doc.save("franchise-earnings.pdf");
  };

  return (
    <div className="franchise-selfservice-container">
      <h2 className="text-primary mb-4">🏢 Franchise Self-Service Portal</h2>

      <div className="export-buttons">
        <CSVLink data={transactions} filename="franchise-earnings.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading transactions...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Agent</th>
              <th>Customer</th>
              <th>Sales Amount</th>
              <th>Commission</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index}>
                <td>{new Date(txn.date).toLocaleString()}</td>
                <td>{txn.agent}</td>
                <td>{txn.customer}</td>
                <td>${txn.salesAmount}</td>
                <td>${txn.commission}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Franchise Self-Service Styling */
.franchise-selfservice-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
  background-color: #f8f9fa;
  border-radius: 10px;
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
  .export-buttons {
    flex-direction: column;
  }
}
`}
      </style>
    </div>
  );
};

export default FranchiseSelfService;
