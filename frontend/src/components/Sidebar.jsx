import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isAgentListOpen, setIsAgentListOpen] = useState(false);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false); // New state for Customer Details dropdown
  const [isFranchiseDropdownOpen, setIsFranchiseDropdownOpen] = useState(false); // Franchise dropdown state
  const [isTerritoryDropdownOpen, setIsTerritoryDropdownOpen] = useState(false); // Territory dropdown state

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleAgentListDropdown = () => {
    setIsAgentListOpen(!isAgentListOpen);
  };

  const toggleCustomerDetailsDropdown = () => {
    setIsCustomerDetailsOpen(!isCustomerDetailsOpen); // Toggle Customer Details dropdown
  };

  const toggleFranchiseDropdown = () => {
    setIsFranchiseDropdownOpen(!isFranchiseDropdownOpen);
  };

  const toggleTerritoryDropdown = () => {
    setIsTerritoryDropdownOpen(!isTerritoryDropdownOpen);
  };

  return (
    <div style={{ ...styles.sidebar, width: isOpen ? '290px' : '60px' }}>
      {/* Hamburger Menu */}
      <div style={styles.hamburger} onClick={toggleSidebar}>
        <div style={styles.line}></div>
        <div style={styles.line}></div>
        <div style={styles.line}></div>
      </div>

      {/* Menu */}
      <ul style={styles.menu}>
        <li>
          <Link to="/" style={styles.link}>{isOpen ? '📊 Dashboard' : '📊'}</Link>
        </li>
        <li>
          <div style={styles.dropdownContainer}>
            {/* Franchise Dropdown */}
            <div style={styles.dropdownToggle} onClick={toggleFranchiseDropdown}>
              {isOpen ? '💰 FranchiseCreatePage' : '💰'}
              {isOpen && (
                <span style={{ marginLeft: 'auto' }}>
                  {isFranchiseDropdownOpen ? '▲' : '▼'}
                </span>
              )}
            </div>
            {isFranchiseDropdownOpen && (
              <ul style={styles.dropdownMenu}>
                <li>
                  <Link to="/customerlogin" style={styles.dropdownLink}>Franchise List</Link>
                </li>
                <li>
                  <Link to="/FranchiseReport" style={styles.dropdownLink}>Reports</Link>
                </li>
                <li>
                  <Link to="/FranchisePerformance" style={styles.dropdownLink}>Performance</Link>
                </li>
              </ul>
            )}
          </div>
        </li>

        <li>
          <div style={styles.dropdownContainer}>
            {/* Territory Dropdown */}
            <div style={styles.dropdownToggle} onClick={toggleTerritoryDropdown}>
              {isOpen ? '👔 TerritoryHeadPage' : '👔'}
              {isOpen && (
                <span style={{ marginLeft: 'auto' }}>
                  {isTerritoryDropdownOpen ? '▲' : '▼'}
                </span>
              )}
            </div>
            {isTerritoryDropdownOpen && (
              <ul style={styles.dropdownMenu}>
                <li>
                  <Link to="/TerritoryAgents" style={styles.dropdownLink}>Agent List</Link>
                </li>
                <li>
                  <Link to="/TerritoryPerformance" style={styles.dropdownLink}>Performance</Link>
                </li>
                <li>
                  <Link to="/TerritoryReports" style={styles.dropdownLink}>Reports</Link>
                </li>
              </ul>
            )}
          </div>
        </li> 
        <li>
          <div style={styles.dropdownContainer}>
            {/* Dropdown Toggle */}
            <div style={styles.dropdownToggle} onClick={toggleAgentListDropdown}>
              {isOpen ? '👥 AgentList' : '👥'}
              {isOpen && (
                <span style={{ marginLeft: 'auto' }}>
                  {isAgentListOpen ? '▲' : '▼'}
                </span>
              )}
            </div>
            {/* Dropdown Menu */}
            {isAgentListOpen && (
              <ul style={styles.dropdownMenu}>
                <li>
                  <Link to="/AgentList" style={styles.dropdownLink}>Registration form</Link>
                </li>
                <li>
                  <Link to="/TopPerformers" style={styles.dropdownLink}>Agent wise TH</Link>
                </li>
                <li>
                  <Link to="/CustomerTransactions" style={styles.dropdownLink}>Customer Transactions</Link>
                </li>
              </ul>
            )}
          </div>
        </li>
        <li>
          <div style={styles.dropdownContainer}>
            {/* Customer Details Dropdown */}
            <div style={styles.dropdownToggle} onClick={toggleCustomerDetailsDropdown}>
              {isOpen ? '🛍️ Customer Details' : '🛍️'}
              {isOpen && (
                <span style={{ marginLeft: 'auto' }}>
                  {isCustomerDetailsOpen ? '▲' : '▼'}
                </span>
              )}
            </div>
            {/* Customer Details Dropdown Menu */}
            {isCustomerDetailsOpen && (
              <ul style={styles.dropdownMenu}>
                <li>
                  <Link to="/CustomerOnlineOrder" style={styles.dropdownLink}>Customer Jewel purchase</Link>
                </li>
                <li>
                  <Link to="/CustomerPurchased" style={styles.dropdownLink}>Customer Information</Link>
                </li>
                <li>
                  <Link to="/CustomerTransactions" style={styles.dropdownLink}>Customer Transactions</Link>
                </li>
              </ul>
            )}
          </div>
        </li>
        <li>
          <Link to="/Items" style={styles.link}>{isOpen ? '📦 Items' : '📦'}</Link>
        </li>
        <li>
          <Link to="/Reports" style={styles.link}>{isOpen ? '📈 Reports' : '📈'}</Link>
        </li>
        <li>
          <Link to="/Users" style={styles.link}>{isOpen ? '👤 Users' : '👤'}</Link>
        </li>
        <li>
          <Link to="/Login" style={styles.link}>{isOpen ? '⚙️ Login' : '⚙️'}</Link>
        </li>
      </ul>
    </div>
  );
};
// #311746  #d9e2ef  #133f4a  #2c7f77
const styles = {
  sidebar: {
    height: '90vh',
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '20px',
    transition: 'width 0.3s ease',
    boxSizing: 'border-box',
  },
  hamburger: {
    cursor: 'pointer',
    marginBottom: '20px',
  },
  line: {
    width: '30px',
    height: '4px',
    backgroundColor: '#fff',
    margin: '5px 0',
    borderRadius: '2px',
  },
  menu: {
    listStyle: 'none',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    fontSize: '16px',
    transition: 'color 0.2s',
  },
  dropdownContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  dropdownToggle: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#fff',
  },
  dropdownMenu: {
    listStyle: 'none',
    padding: '10px 0 10px 15px',
    margin: '5px 0',
    backgroundColor: '#34495e',
    borderRadius: '5px',
  },
  dropdownLink: {
    textDecoration: 'none',
    color: '#fff',
    fontSize: '14px',
    padding: '5px 0',
    display: 'block',
  },
};

export default Sidebar;
