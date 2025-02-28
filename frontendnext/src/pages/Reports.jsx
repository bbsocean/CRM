// src/pages/Reports.jsx

import React, { useState } from 'react';

const Reports = () => {
  const [reportType, setReportType] = useState('commissions');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    setReportData(null);
    setError(null);
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/reports/${reportType}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports">
      <h2>Generate Reports</h2>
      <div className="report-controls">
        <label htmlFor="reportType">Select Report Type:</label>
        <select
          id="reportType"
          value={reportType}
          onChange={handleReportTypeChange}
        >
          <option value="commissions">Commissions Report</option>
          <option value="transactions">Transactions Report</option>
          <option value="performance">Performance Report</option>
        </select>
        <button onClick={generateReport} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
      {error && <p className="error">Error: {error}</p>}
      {reportData && (
        <div className="report-results">
          {/* Render the report data here */}
          {/* This can be a table, chart, or any other format based on the reportType */}
          {/* For simplicity, we'll just JSON.stringify the data */}
          <pre>{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      )}
      <style>
        {`
        .reports {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.reports h2 {
  text-align: center;
  margin-bottom: 20px;
}

.report-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.report-controls label {
  font-weight: bold;
}

.report-controls select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.report-controls button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.report-controls button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.error {
  color: #f44336;
  text-align: center;
  margin-bottom: 15px;
}

.report-results {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}
`}
      </style>
    </div>
  );
};

export default Reports;
