import React, { useState, useEffect } from 'react';

const CustomerTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRange, setFilterRange] = useState('');
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const mockData = [
    { transactionId: "TXN001", customerName: "John Doe", purchaseDate: "2024-12-10", amount: 5000, status: "Completed", productName: "Gold Chain", productDescription: "24k gold chain" },
    { transactionId: "TXN002", customerName: "Emmy Davis", purchaseDate: "2024-12-12", amount: 1500, status: "Pending", productName: "Diamond Earrings", productDescription: "2-carat diamond earrings" },
    { transactionId: "TXN003", customerName: "Michael Smith", purchaseDate: "2024-12-15", amount: 3500, status: "Completed", productName: "Gold Ring", productDescription: "18k gold ring" },
    { transactionId: "TXN004", customerName: "Alice Johnson", purchaseDate: "2024-12-11", amount: 8000, status: "Shipped", productName: "Gold Necklace", productDescription: "22k gold necklace" },
    { transactionId: "TXN005", customerName: "Robert Brown", purchaseDate: "2024-12-14", amount: 2500, status: "Completed", productName: "Gold Bracelet", productDescription: "14k gold bracelet" },
    { transactionId: "TXN006", customerName: "Jessica Lee", purchaseDate: "2024-12-09", amount: 1200, status: "Pending", productName: "Silver Necklace", productDescription: "Sterling silver necklace" },
    { transactionId: "TXN007", customerName: "William Harris", purchaseDate: "2024-12-13", amount: 5500, status: "Completed", productName: "Gold Watch", productDescription: "Gold-plated luxury watch" },
    { transactionId: "TXN008", customerName: "Sophia Wilson", purchaseDate: "2024-12-10", amount: 4500, status: "Shipped", productName: "Gold Pendant", productDescription: "18k gold pendant" },
    { transactionId: "TXN009", customerName: "David Garcia", purchaseDate: "2024-12-15", amount: 3000, status: "Completed", productName: "Diamond Necklace", productDescription: "1-carat diamond necklace" },
    { transactionId: "TXN010", customerName: "Olivia Martinez", purchaseDate: "2024-12-11", amount: 6000, status: "Completed", productName: "Gold Earrings", productDescription: "22k gold earrings" },
    { transactionId: "TXN011", customerName: "John Doe", purchaseDate: "2024-12-10", amount: 5000, status: "Completed", productName: "Gold Chain", productDescription: "24k gold chain" },
    { transactionId: "TXN012", customerName: "Emmy Davis", purchaseDate: "2024-12-12", amount: 1500, status: "Pending", productName: "Diamond Earrings", productDescription: "2-carat diamond earrings" },
    { transactionId: "TXN013", customerName: "Michael Smith", purchaseDate: "2024-12-15", amount: 3500, status: "Completed", productName: "Gold Ring", productDescription: "18k gold ring" },
    { transactionId: "TXN014", customerName: "Alice Johnson", purchaseDate: "2024-12-11", amount: 8000, status: "Shipped", productName: "Gold Necklace", productDescription: "22k gold necklace" },
    { transactionId: "TXN015", customerName: "Robert Brown", purchaseDate: "2024-12-14", amount: 2500, status: "Completed", productName: "Gold Bracelet", productDescription: "14k gold bracelet" },
    { transactionId: "TXN016", customerName: "Jessica Lee", purchaseDate: "2024-12-09", amount: 1200, status: "Pending", productName: "Silver Necklace", productDescription: "Sterling silver necklace" },
    { transactionId: "TXN017", customerName: "William Harris", purchaseDate: "2024-12-13", amount: 5500, status: "Completed", productName: "Gold Watch", productDescription: "Gold-plated luxury watch" },
    { transactionId: "TXN018", customerName: "Sophia Wilson", purchaseDate: "2024-12-10", amount: 4500, status: "Shipped", productName: "Gold Pendant", productDescription: "18k gold pendant" },
    { transactionId: "TXN019", customerName: "David Garcia", purchaseDate: "2024-12-15", amount: 3000, status: "Completed", productName: "Diamond Necklace", productDescription: "1-carat diamond necklace" },
    { transactionId: "TXN020", customerName: "Olivia Martinez", purchaseDate: "2024-12-11", amount: 6000, status: "Completed", productName: "Gold Earrings", productDescription: "22k gold earrings" },

  ];

  useEffect(() => {
    setTransactions(mockData);
    setLoading(false);
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterRange = (event) => {
    setFilterRange(event.target.value);
  };

  const handleCustomDateChange = (field, value) => {
    setCustomDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="transactions-container">
      <header className="transactions-header">
        <div className="filter-section">
          <select onChange={handleFilterRange} value={filterRange}>
            <option value="">Select Filter</option>
            <option value="day">Per Day View</option>
            <option value="week">Per Week View</option>
            <option value="month">Per Month View</option>
          </select>
          <div className="custom-date">
            <label>From:</label>
            <input
              type="date"
              value={customDateRange.from}
              onChange={(e) => handleCustomDateChange('from', e.target.value)}
            />
            <label>To:</label>
            <input
              type="date"
              value={customDateRange.to}
              onChange={(e) => handleCustomDateChange('to', e.target.value)}
            />
          </div>
        </div>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by customer name"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </header>
      <div className="transactions-content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer Name</th>
                <th>Purchase Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Product Name</th>
                <th>Product Description</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td>{transaction.transactionId}</td>
                  <td>{transaction.customerName}</td>
                  <td>{transaction.purchaseDate}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.status}</td>
                  <td>{transaction.productName}</td>
                  <td>{transaction.productDescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev * itemsPerPage < filteredTransactions.length ? prev + 1 : prev
              )
            }
            disabled={
              currentPage * itemsPerPage >= filteredTransactions.length
            }
          >
            Next
          </button>
        </div>
      </div>

      <style>
        {`
        .transactions-container {
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
        }

        .transactions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .filter-section {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .filter-section select,
        .filter-section input {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .search-section input {
          padding: 10px;
          width: 220px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .transactions-table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          border: 1px solid #ccc;
        }

        .transactions-table th,
        .transactions-table td {
          padding: 10px;
          text-align: left;
          border: 1px solid #ccc;
        }

        .transactions-table thead {
          background-color: #007bff;
          color: white;
        }

        .transactions-table tbody tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .pagination button {
          padding: 10px 20px;
          margin: 0 5px;
          border: none;
          background-color: #007bff;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }

        .pagination button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .pagination span {
          padding: 10px;
        }
        `}
      </style>
    </div>
  );
};

export default CustomerTransactions;
