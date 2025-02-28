import React, { useState } from "react";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = (isVisible) => {
    setShowDropdown(isVisible);
  };

  return (
    <header className="header">
      <h1>Commission Tracking System</h1>
      <nav>
        <ul>
          <li>
            <a href="/">Dashboard</a>
          </li>
          <li
            className="dropdown"
            onMouseEnter={() => toggleDropdown(true)}
            onMouseLeave={() => toggleDropdown(false)}
          >
            <a href="/agents">Agents</a>
            {showDropdown && (
              <ul className="dropdown-menu">
                <li>
                  <a href="/agents/all">All Agents</a>
                </li>
                <li>
                  <a href="/agents/top">Top Agents</a>
                </li>
                <li>
                  <a href="/agents/regions">Agents by Region</a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <a href="/transactions">Transactions</a>
          </li>
        </ul>
      </nav>

      <style>
        {`
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #232f3e;
            color: white;
            padding: 15px 20px;
            font-family: Arial, sans-serif;
          }

          .header h1 {
            margin: 0;
            font-size: 1.5rem;
            color: #ff9900;
          }

          .header nav ul {
            display: flex;
            gap: 20px;
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .header nav ul li {
            position: relative;
          }

          .header nav ul li a {
            color: white;
            text-decoration: none;
            font-weight: bold;
            padding: 8px 12px;
            display: block;
            border-radius: 4px;
          }

          .header nav ul li a:hover {
            background-color: #37475a;
          }

          .dropdown-menu {
            position: absolute;
            top: 100%;
            height:200px;
            left: 0;
            background-color:rgb(52, 78, 110);
            list-style: none;
            margin: 0;
            padding: 0;
            border-radius: 4px;
            min-width: 10px;
            box-shadow: 0 4px 8px rgba(53, 44, 44, 0.2);
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
          }

          .dropdown-menu li {
            padding: 0;
            
          }

          .dropdown-menu li a {
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            display: block;
            font-size: 0.95rem;
          }

          .dropdown-menu li a:hover {
            background-color:rgb(13, 103, 214);
          }

          /* Show the dropdown when hovering over the parent */
          .dropdown:hover .dropdown-menu {
            opacity: 1;
            visibility: visible;
          }
        `}
      </style>
    </header>
  );
};

export default Header;
