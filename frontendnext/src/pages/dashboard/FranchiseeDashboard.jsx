// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const FranchiseeDashboard = () => {
//   const { franchiseId } = useParams();
//   const [data, setData] = useState({});

//   useEffect(() => {
//     axios.get(`http://localhost:5000/api/dashboard/franchise/${franchiseId}`)
//       .then(response => setData(response.data))
//       .catch(error => console.error('Error fetching franchisee dashboard:', error));
//   }, [franchiseId]);

//   return (
//     <div>
//       <h1>Franchisee Dashboard</h1>
//       <p>Total Sales: {data.totalSales}</p>
//       <p>Total Commissions: {data.totalCommissions}</p>
//     </div>
//   );
// };

// export default FranchiseeDashboard;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const FranchiseDashboard = () => {
  const { franchiseId } = useParams();
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    franchiseDetails: {},
  });

  useEffect(() => {
    axiosInstance.get(`/dashboard/franchise/${franchiseId}`)
      .then(response => setDashboardData(response.data))
      .catch(error => console.error('Error fetching franchise dashboard:', error));
  }, [franchiseId]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Franchise Dashboard</h1>

      <div className="dashboard-stat">
        <h3>Total Sales</h3>
        <p>{dashboardData.totalSales}</p>
      </div>
      <div className="dashboard-stat">
        <h3>Total Commissions</h3>
        <p>{dashboardData.totalCommissions}</p>
      </div>

      <h2 className="section-title">Franchise Details</h2>
      <ul className="data-list">
        <li>
          <span>Name:</span> {dashboardData.franchiseDetails.name || 'N/A'}
        </li>
        <li>
          <span>Location:</span> {dashboardData.franchiseDetails.location || 'N/A'}
        </li>
      </ul>
      <style>
        {`
        .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Arial, sans-serif';
    color: #333;
}

.dashboard-title {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
}

.dashboard-stat {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
}

.dashboard-stat h3 {
    margin: 0;
    color: #2980b9;
    font-size: 18px;
}

.dashboard-stat p {
    font-size: 16px;
    color: #666;
}

.section-title {
    font-size: 22px;
    color: #34495e;
    margin-top: 30px;
    margin-bottom: 15px;
    border-bottom: 2px solid #ddd;
    padding-bottom: 5px;
}

.data-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.data-list li {
    background-color: #ffffff;
    padding: 10px 15px;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    transition: all 0.3s ease;
}

.data-list li:hover {
    background-color: #eaf2f8;
    border-color: #3498db;
}

.data-list span {
    font-weight: bold;
}

.dashboard-button {
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.dashboard-button:hover {
    background-color: #2980b9;
}

/* Responsive Design */
@media (max-width: 768px) {
    .dashboard-container {
        padding: 10px;
    }

    .dashboard-stat {
        flex-direction: column;
        text-align: center;
    }

    .dashboard-stat h3 {
        margin-bottom: 5px;
    }

    .dashboard-button {
        width: 100%;
        margin-top: 10px;
    }
}
`}
      </style>
    </div>
  );
};

export default FranchiseDashboard;
