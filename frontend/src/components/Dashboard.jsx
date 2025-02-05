import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [activeReport, setActiveReport] = useState(null);
  const [viewType, setViewType] = useState('sales');  // Default to 'sales'

  const reports = [
    { title: 'Franchise Report', id: 'franchise', color: '#17a2b8' },
    { title: 'Territory Head Report', id: 'territory', color: '#ffc107' },
    { title: 'Agent Report', id: 'agent', color: '#28a745' },
    { title: 'Customer Become Vendor', id: 'customerVendor', color: '#dc3545' },
    { title: 'Vendor Report', id: 'vendor', color: '#DC7835' },
  ];

  const chartData = {
    franchise: {
      labels: ['January', 'February', 'March', 'April', 'May','June','July','Augest','September','October','November','December'],
      datasets: [
        {
          label: 'Franchise Sales',
          data: [10, 11, 10, 25, 20, 25, 30, 27, 34, 33, 30, 36],
          backgroundColor: '#36A2EB', // Sales color
        },
        {
          label: 'Franchise Commission',
          data: [50, 100, 70, 180, 250,80, 150, 100, 280, 350,400,150],
          backgroundColor: '#FFCE56', // Commission color
        },
        {
          label: 'Franchise Profit',
          data: [50, 100, 70, 180, 250,400,500,80, 150, 100, 280, 350],
          backgroundColor: '#4BC0C0', // Profit color
        },
      ],
    },
    territory: {
      labels: ['January', 'February', 'March', 'April', 'May','June','July','Augest','September','October','November','December'],
      datasets: [
        {
          label: 'Territory Sales',
          data: [5, 6, 5, 12, 10, 12, 15, 13, 17, 16, 15, 18],
          backgroundColor: '#FF6384', // Sales color
        },
        {
          label: 'Territory Commission',
          data: [80, 150, 100, 280, 350,200,100, 200, 300, 400, 500,200],
          backgroundColor: '#FF9F40', // Commission color
        },
        {
          label: 'Territory Profit',
          data: [30, 80, 50, 100, 150,100, 200, 300, 400, 500,150,250],
          backgroundColor: '#FFCD56', // Profit color
        },
      ],
    },
    agent: {
      labels: ['January', 'February', 'March', 'April', 'May','June','July','Augest','September','October','November','December'],
      datasets: [
        {
          label: 'Agent Sales',
          data: [100, 200, 300, 400, 500,100, 200, 300, 400, 500,148,250],
          backgroundColor: '#FFCE56', // Sales color
        },
        {
          label: 'Agent Commission',
          data: [5, 6, 5, 12, 10, 12, 15, 13, 17, 16, 15, 18],
          backgroundColor: '#36A2EB', // Commission color
        },
        {
          label: 'Agent Profit',
          data: [20, 60, 40, 120, 160,100, 200, 300, 400, 500,400,250],
          backgroundColor: '#FF6384', // Profit color
        },
      ],
    },
    customerVendor: {
      labels: ['January', 'February', 'March', 'April', 'May','June','July','Augest','September','October','November','December'],
      datasets: [
        {
          label: 'Customer Become Vendor Sales',
          data: [250, 350, 150, 450, 650,100, 200, 300, 400, 500,300, 400,],
          backgroundColor: '#4BC0C0', // Sales color
        },
        {
          label: 'Customer Become Vendor Commission',
          data: [80, 120, 90, 240, 300,100, 200, 300, 400, 205,120, 90],
          backgroundColor: '#FF9F40', // Commission color
        },
        {
          label: 'Customer Become Vendor Profit',
          data: [30, 90, 60, 150, 200,100, 200, 300, 400, 500,150, 200],
          backgroundColor: '#FFCD56', // Profit color
        },
      ],
    },
    vendor: {
      labels: ['January', 'February', 'March', 'April', 'May','June','July','Augest','September','October','November','December'],
      datasets: [
        {
          label: 'Vendor Sales',
          data: [10, 11, 10, 25, 20, 25, 30, 27, 34, 33, 30, 36],
          backgroundColor: '#9966FF', // Sales color
        },
        {
          label: 'Vendor Commission',
          data: [150, 300, 200, 350, 400,80, 200, 100, 250, 300,200, 100],
          backgroundColor: '#FF6384', // Commission color
        },
        {
          label: 'Vendor Profit',
          data: [80, 200, 100, 250, 300,80, 200, 100, 250, 500,150, 300],
          backgroundColor: '#4BC0C0', // Profit color
        },
      ],
    },
  };

  const handleReportClick = (reportId) => {
    setActiveReport(reportId); // Set the active report on click
  };

  const getFilteredData = () => {
    const activeData = chartData[activeReport];
    return {
      labels: activeData.labels,
      datasets: activeData.datasets.filter(dataset => 
        dataset.label.toLowerCase().includes(viewType)  // Filter dataset based on viewType
      ),
    };
  };

  const getColorForView = (viewType) => {
    switch(viewType) {
        case 'Sales':
            return 'blue';
        case 'Commission':
            return 'green';
        case 'Profit':
            return 'purple';
        case 'Vendor':
            return 'orange'; // New view
        case 'Customer':
            return 'red';    // New view
        default:
            return 'gray';   // Default color
    }
};


  return (
    <div className="dashboard-container">
      {/* Dashboard Title */}
      <h1 className="dashboard-heading">Dashboard</h1>

      {/* Report Buttons */}
      <div className="dashboard-cards">
        {reports.map((report) => (
          <div
            key={report.id}
            className="dashboard-card"
            style={{ backgroundColor: report.color }}
            onClick={() => handleReportClick(report.id)}
          >
            <h3>{report.title}</h3>
            <p>Click to see chart</p>
          </div>
        ))}
      </div>

      {/* View Toggle Buttons */}
      <div className="view-toggle-buttons">
        <button onClick={() => setViewType('sales')}>Sales</button>
        <button onClick={() => setViewType('commission')}>Commission</button>
        <button onClick={() => setViewType('profit')}>Profit</button>
      </div>

      {/* Chart Section */}
      {activeReport && (
        <div className="dashboard-chart">
          <h3>{reports.find((report) => report.id === activeReport).title} - Monthly {viewType.charAt(0).toUpperCase() + viewType.slice(1)}</h3>
          <div className="chart-placeholder">
            <Bar data={getFilteredData()} options={{ responsive: true }} />
          </div>

          {/* Table Section */}
          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>{viewType.charAt(0).toUpperCase() + viewType.slice(1)}</th>
                </tr>
              </thead>
              <tbody>
                {chartData[activeReport].labels.map((month, index) => (
                  <tr key={month}>
                    <td>{month}</td>
                    <td
                      style={{
                        color: getColorForView(viewType),
                      }}
                    >
                      {chartData[activeReport].datasets.find(dataset => dataset.label.toLowerCase().includes(viewType)).data[index]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>
        {`
        /* Container and General Styling */
        .dashboard-container {
          padding: 10px;
          background-color: #f4f6f9;
          min-height: 100vh;
          box-sizing: border-box;
        }
        .dashboard-heading {
          font-size: 2rem;
          color: #333;
          margin-bottom: 20px;
          font-weight: bold;
        }

        /* Top Cards Section */
        .dashboard-cards {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }
        .dashboard-card {
          color: #fff;
          padding: 20px;
          border-radius: 19px;
          flex: 1;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .dashboard-card:hover {
          opacity: 0.8;
        }

        /* View Toggle Buttons */
        .view-toggle-buttons {
          margin-bottom: 20px;
        }
        .view-toggle-buttons button {
          padding: 10px 20px;
          margin-right: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .view-toggle-buttons button:hover {
          opacity: 0.8;
        }

        /* Chart Section */
        .dashboard-chart {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        .chart-placeholder {
          height: 250px;
          background-color: #eaeaea;
          border-radius: 4px;
          text-align: center;
          line-height: 250px;
          color: #888;
        }

        /* Table Section */
        .dashboard-table-container {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
        }
        .dashboard-table th,
        .dashboard-table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        .dashboard-table th {
          background-color: #2c3e50;
          color: #fff;
        }
        .dashboard-table td {
          color: #333;
        }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
