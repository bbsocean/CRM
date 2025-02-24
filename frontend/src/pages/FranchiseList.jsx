// src/pages/FranchiseList.jsx

import React, { useState, useEffect } from 'react';
// import FranchiseCard from '../components/FranchiseCard';

const FranchiseList = () => {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        const response = await fetch('/api/franchises');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFranchises(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFranchises();
  }, []);

  if (loading) {
    return <p>Loading franchises...</p>;
  }

  if (error) {
    return <p>Error loading franchises: {error}</p>;
  }

  return (
    <div className="franchise-list">
      {franchises.length > 0 ? (
        franchises.map((franchise) => (
          <FranchiseCard key={franchise._id} franchise={franchise} />
        ))
      ) : (
        <p>No franchises available.</p>
      )}
      <style>
        {`.franchise-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}
`}
      </style>
    </div>
  );
};

export default FranchiseList;
