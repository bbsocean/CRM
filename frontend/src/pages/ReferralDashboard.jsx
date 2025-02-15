import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ReferralDashboard = () => {
  const { userId } = useParams();
  const [dashboardData, setDashboardData] = useState({
    totalReferralBonus: 0,
    referredUsers: []
  });

  useEffect(() => {
    axiosInstance.get(`/dashboard/referral/${userId}`)
      .then(response => setDashboardData(response.data))
      .catch(error => console.error('Error fetching referral dashboard:', error));
  }, [userId]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Referral Dashboard</h1>

      <div className="dashboard-stat">
        <h3>Total Referral Bonus</h3>
        <p>{dashboardData.totalReferralBonus}</p>
      </div>

      <h2 className="section-title">Referred Users</h2>
      <ul className="data-list">
        {dashboardData.referredUsers.map((user, index) => (
          <li key={index}>
            <span>Name:</span> {user.name}, <span>Email:</span> {user.email}, <span>Role:</span> {user.role}
          </li>
        ))}
      </ul>
      <style>
        {`
        body {
  font-family: 'Arial, sans-serif';
  background-color: #f4f5f7;
  margin: 0;
  padding: 0;
}

.dashboard-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  text-align: center;
  color: #333;
  font-size: 28px;
  margin-bottom: 20px;
}

.dashboard-stat {
  background-color: #eaf8ff;
  border: 1px solid #b3d4fc;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.dashboard-stat h3 {
  color: #007bff;
  font-size: 20px;
  margin: 0;
}

.dashboard-stat p {
  font-size: 24px;
  font-weight: bold;
  margin-top: 5px;
  color: #333;
}

.section-title {
  font-size: 22px;
  color: #555;
  margin-bottom: 10px;
}

.data-list {
  list-style: none;
  padding: 0;
}

.data-list li {
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.data-list li span {
  font-weight: bold;
  color: #333;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 15px;
  }

  .dashboard-title {
    font-size: 24px;
  }

  .dashboard-stat h3 {
    font-size: 18px;
  }

  .dashboard-stat p {
    font-size: 20px;
  }

  .section-title {
    font-size: 20px;
  }
}
`}
      </style>
    </div>
  );
};

export default ReferralDashboard;
