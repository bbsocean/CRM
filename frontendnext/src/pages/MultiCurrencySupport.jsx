import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/MultiCurrencySupport.css"; // Import CSS

const MultiCurrencySupport = () => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commissionData, setCommissionData] = useState([]);

  useEffect(() => {
    fetchCurrencies();
    fetchCommissionData();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get("/api/multi-currency");
      setCurrencies(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      setError("Failed to load currencies.");
      setLoading(false);
    }
  };

  const fetchCommissionData = async () => {
    try {
      const response = await axios.get(`/api/commission-data?currency=${selectedCurrency}`);
      setCommissionData(response.data);
    } catch (error) {
      console.error("Error fetching commission data:", error);
      setError("Failed to load commission data.");
    }
  };

  const handleCurrencyChange = async (e) => {
    setSelectedCurrency(e.target.value);
    const response = await axios.get(`/api/exchange-rate?currency=${e.target.value}`);
    setExchangeRate(response.data.rate);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Commission Report in ${selectedCurrency}`, 20, 10);
    doc.autoTable({
      head: [["Date", "User", "Commission Amount", "Converted Amount"]],
      body: commissionData.map(data => [
        data.date,
        data.user,
        `$${data.commissionAmount}`,
        `${(data.commissionAmount * exchangeRate).toFixed(2)} ${selectedCurrency}`
      ]),
    });
    doc.save(`commission-report-${selectedCurrency}.pdf`);
  };

  return (
    <div className="multi-currency-container">
      <h2 className="text-primary mb-4">💱 Multi-Currency Support</h2>

      <div className="filters">
        <Form.Control as="select" onChange={handleCurrencyChange}>
          {currencies.map((currency, index) => (
            <option key={index} value={currency.code}>{currency.name} ({currency.code})</option>
          ))}
        </Form.Control>

        <Button variant="primary" onClick={fetchCommissionData}>Fetch Data</Button>
      </div>

      <div className="export-buttons">
        <CSVLink data={commissionData} filename={`commission-data-${selectedCurrency}.csv`} className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading currency data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Commission ($)</th>
              <th>Converted Amount ({selectedCurrency})</th>
            </tr>
          </thead>
          <tbody>
            {commissionData.map((data, index) => (
              <tr key={index}>
                <td>{new Date(data.date).toLocaleString()}</td>
                <td>{data.user}</td>
                <td>${data.commissionAmount}</td>
                <td>{(data.commissionAmount * exchangeRate).toFixed(2)} {selectedCurrency}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Multi-Currency Support Styling */
.multi-currency-container {
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

export default MultiCurrencySupport;
