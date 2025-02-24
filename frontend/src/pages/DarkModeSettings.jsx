import React, { useState } from "react";
import { Button } from "react-bootstrap";

const DarkModeSettings = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <div className="dark-mode-container">
      <h2>🎨 Theme Settings</h2>
      <Button variant="dark" onClick={toggleTheme}>
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </Button>
      <style>
        {`
        .dark-mode-container {
  text-align: center;
  padding: 20px;
}

.dark-mode {
  background-color: #121212;
  color: #fff;
}
`}
      </style>
    </div>
  );
};

export default DarkModeSettings;
