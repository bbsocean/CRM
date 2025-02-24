import React, { useState } from 'react';

import a3 from '../components/Images/a3.png';
import a4 from '../components/Images/a4.png';
import a5 from '../components/Images/a5.jpg';



const CustomerJewelInfoPage = () => {
    const [search, setSearch] = useState('');
    
    // Sample data (replace with actual data from API or state)
    const transactions = [
        { id: 'T001', name: 'Emma Watson', date: '2024-12-01', agent: 'John', image: a4, grams: 10, rate: 500, tax: 50, discount: 20, totalPrice: 530 },
        { id: 'T002', name: 'Emma Watson', date: '2024-12-02', agent: 'John', image: a3, grams: 12, rate: 600, tax: 60, discount: 30, totalPrice: 630 },
        { id: 'T003', name: 'Emma Watson', date: '2024-12-03', agent: 'John', image: a5, grams: 8, rate: 700, tax: 70, discount: 35, totalPrice: 735 },
        { id: 'T004', name: 'Emma Watson', date: '2024-12-04', agent: 'John', image: a4, grams: 15, rate: 400, tax: 40, discount: 10, totalPrice: 430 },
        { id: 'T005', name: 'Emma Watson', date: '2024-12-05', agent: 'John', image: a3, grams: 20, rate: 1000, tax: 100, discount: 50, totalPrice: 1050 },
    ];

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredTransactions = transactions.filter(transaction =>
        transaction.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="customer-jewel-info-page">
            {/* Search Bar Section */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by customer name"
                    value={search}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Transaction List Section */}
            <div className="transaction-list">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                        <div key={transaction.id} className="transaction-item">
                            <div className="transaction-header">
                                <div className="transaction-id">ID: {transaction.id}</div>
                                <div className="transaction-date">{transaction.date}</div>
                            </div>
                            <div className="transaction-details">
                                <div className="transaction-name">{transaction.name}</div>
                                <div className="transaction-agent">Agent: {transaction.agent}</div>
                                <img src={transaction.image} alt="Jewel" className="transaction-image" />
                                <div className="transaction-info">
                                    <div>Grams: {transaction.grams}g</div>
                                    <div>Rate: ${transaction.rate}</div>
                                    <div>Tax: ${transaction.tax}</div>
                                    <div>Discount: ${transaction.discount}</div>
                                    <div>Total: ${transaction.totalPrice}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No transactions found</div>
                )}
            </div>

            <style>
                {`
                .customer-jewel-info-page {
    padding: 20px;
    font-family: Arial, sans-serif;
}

.search-bar {
    text-align: center;
    margin-bottom: 20px;
}

.search-bar input {
    padding: 10px;
    width: 80%;
    max-width: 500px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.transaction-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.transaction-item {
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.transaction-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #555;
}

.transaction-id {
    font-weight: bold;
}

.transaction-details {
    display: flex;
    gap: 15px;
    margin-top: 10px;
}

.transaction-name {
    font-size: 18px;
    font-weight: bold;
}

.transaction-agent {
    color: #888;
}

.transaction-image {
    max-width: 100px;
    border-radius: 5px;
}

.transaction-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: #555;
}

.transaction-info div {
    font-size: 14px;
}

                `}
            </style>
        </div>
    );
};

export default CustomerJewelInfoPage;
