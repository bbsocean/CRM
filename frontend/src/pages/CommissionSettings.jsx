import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import "../styles/CommissionSettings.css"; // Import CSS

const CommissionSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedSettings, setUpdatedSettings] = useState({});

  useEffect(() => {
    fetchCommissionSettings();
  }, []);

  const fetchCommissionSettings = async () => {
    try {
      const response = await axios.get("/api/commission-settings");
      setSettings(response.data);
      setUpdatedSettings(response.data.reduce((acc, curr) => {
        acc[curr.role] = curr.commissionRate;
        return acc;
      }, {}));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching commission settings:", error);
      setError("Failed to load commission settings.");
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put("/api/commission-settings/update", updatedSettings);
      alert("Commission settings updated successfully!");
      fetchCommissionSettings();
    } catch (error) {
      console.error("Error updating commission settings:", error);
      setError("Update failed. Try again.");
    }
  };

  return (
    <div className="commission-settings-container">
      <h2 className="text-primary mb-4">⚙️ Commission Settings</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading settings...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Role</th>
              <th>Commission Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting, index) => (
              <tr key={index}>
                <td>{setting.role}</td>
                <td>
                  <Form.Control
                    type="number"
                    value={updatedSettings[setting.role]}
                    onChange={(e) =>
                      setUpdatedSettings({ ...updatedSettings, [setting.role]: e.target.value })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Button variant="success" className="mt-3" onClick={handleUpdate}>Save Changes</Button>
      <style>
        {`
        /* Commission Settings Styling */
.commission-settings-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.table {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.table thead {
  background-color: #16a085;
  color: white;
}

.table tbody tr:hover {
  background-color: #ecf0f1;
}

button {
  display: block;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .commission-settings-container {
    width: 100%;
    padding: 10px;
  }
}
`}
      </style>
    </div>
  );
};

export default CommissionSettings;
