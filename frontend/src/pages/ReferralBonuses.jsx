import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/ReferralBonuses.css"; // Import CSS

const ReferralBonuses = () => {
  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchReferralBonuses();
  }, []);

  const fetchReferralBonuses = async () => {
    try {
      const response = await axios.get("/api/referral-bonuses");
      setReferrals(response.data);
      setFilteredReferrals(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching referral bonuses:", error);
      setError("Failed to load referral bonuses.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = referrals;
    if (status) {
      filtered = filtered.filter(referral => referral.payoutStatus === status);
    }
    setFilteredReferrals(filtered);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Referral Bonuses Report", 20, 10);
    doc.autoTable({
      head: [["Date", "Referrer", "Referred User", "Bonus ($)", "Payout Status"]],
      body: filteredReferrals.map(referral => [
        referral.date, referral.referrer, referral.referredUser, referral.bonusAmount, referral.payoutStatus,
      ]),
    });
    doc.save("referral-bonuses.pdf");
  };

  return (
    <div className="referral-bonuses-container">
      <h2 className="text-primary mb-4">🎁 Referral Bonuses</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setStatus(e.target.value)}>
          <option value="">Filter by Payout Status</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      <div className="export-buttons">
        <CSVLink data={filteredReferrals} filename="referral-bonuses.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading referral bonuses...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Referrer</th>
              <th>Referred User</th>
              <th>Bonus ($)</th>
              <th>Payout Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReferrals.map((referral, index) => (
              <tr key={index}>
                <td>{new Date(referral.date).toLocaleString()}</td>
                <td>{referral.referrer}</td>
                <td>{referral.referredUser}</td>
                <td>{referral.bonusAmount}</td>
                <td>{referral.payoutStatus}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Referral Bonuses Styling */
.referral-bonuses-container {
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
  background-color: #f39c12;
  color: white;
}

.table tbody tr:hover {
  background-color: #e9ecef;
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

export default ReferralBonuses;
