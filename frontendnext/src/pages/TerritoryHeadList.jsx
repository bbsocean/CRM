// src/pages/TerritoryHeadList.jsx

import React, { useState, useEffect } from 'react';
// import TerritoryHeadCard from '../components/TerritoryHeadCard';

const TerritoryHeadList = () => {
  const [territoryHeads, setTerritoryHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerritoryHeads = async () => {
      try {
        const response = await fetch('/api/territory-heads');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTerritoryHeads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTerritoryHeads();
  }, []);

  if (loading) {
    return <p>Loading territory heads...</p>;
  }

  if (error) {
    return <p>Error loading territory heads: {error}</p>;
  }

  return (
    <div className="territory-head-list">
      {territoryHeads.length > 0 ? (
        territoryHeads.map((territoryHead) => (
          <TerritoryHeadCard key={territoryHead._id} territoryHead={territoryHead} />
        ))
      ) : (
        <p>No territory heads available.</p>
      )}
      <style>
        {`
        .territory-head-list {
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

export default TerritoryHeadList;
