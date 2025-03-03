import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import "../styles/TransactionHistory.css"; // Import CSS

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transactions");
      setTransactions(response.data);
      setFilteredTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transaction data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = transactions;
    if (status) {
      filtered = filtered.filter(txn => txn.status === status);
    }
    if (date) {
      filtered = filtered.filter(txn => new Date(txn.date).toISOString().split("T")[0] === date);
    }
    setFilteredTransactions(filtered);
  };

  const handleDownloadCSV = () => {
    const csvData = filteredTransactions.map(txn => ({
      Date: new Date(txn.date).toLocaleDateString(),
      Amount: txn.amount,
      Status: txn.status,
    }));
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Date,Amount,Status", ...csvData.map(row => Object.values(row).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "TransactionHistory.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="transaction-history-container">
      <h2 className="text-primary mb-4">📜 Transaction History</h2>

      <div className="filters">
        <Form.Control type="date" onChange={(e) => setDate(e.target.value)} />
        <Form.Control as="select" onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </Form.Control>
        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
        <Button variant="success" onClick={handleDownloadCSV}>Download CSV</Button>
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
              <th>Amount ($)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn, index) => (
              <tr key={index}>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>${txn.amount}</td>
                <td>
                  <span className={txn.status === "Completed" ? "status-completed" : "status-pending"}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Transaction History Styling */
.transaction-history-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters select, .filters input {
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
  background-color: #2980b9;
  color: white;
}

.table tbody tr:hover {
  background-color: #ecf0f1;
}

.status-pending {
  background-color: #f1c40f;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.status-completed {
  background-color: #2ecc71;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  .filters select, .filters input {
    width: 100%;
    margin-bottom: 10px;
  }
}
`}
      </style>
    </div>
  );
};

export default TransactionHistory;
