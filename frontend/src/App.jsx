// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import AdminDashboard from './pages/dashboard/AdminDashboard';
// import AgentDashboard from './pages/dashboard/AgentDashboard';
// import FranchiseeDashboard from './pages/dashboard/FranchiseeDashboard';
// import TerritoryHeadDashboard from './pages/dashboard/TerritoryHeadDashboard';
// import VendorDashboard from './pages/dashboard/VendorDashboard';
// import CustomerVendorDashboard from './pages/dashboard/CustomerVendorDashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AdminDashboard />} />
//         <Route path="/dashboard/agent/:agentId" element={<AgentDashboard />} />
//         <Route path="/dashboard/franchise/:franchiseId" element={<FranchiseeDashboard />} />
//         <Route path="/dashboard/territory/:territoryHeadId" element={<TerritoryHeadDashboard />} />
//         <Route path="/dashboard/vendor/:vendorId" element={<VendorDashboard />} />
//         <Route path="/dashboard/customer-vendor/:customerId" element={<CustomerVendorDashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AgentDashboard from './pages/dashboard/AgentDashboard';
import FranchiseeDashboard from './pages/dashboard/FranchiseeDashboard';
import TerritoryHeadDashboard from './pages/dashboard/TerritoryHeadDashboard';
import VendorDashboard from './pages/dashboard/VendorDashboard';
import CustomerVendorDashboard from './pages/dashboard/CustomerVendorDashboard';
//import Dashboard from './components/Dashboard';
// import FranchiseCreatePage from './components/FranchiseCreatePage';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Admin Dashboard</Link></li>
          <li><Link to="/dashboard/agent/1">Agent Dashboard</Link></li>
          <li><Link to="/dashboard/franchise/1">Franchisee Dashboard</Link></li>
          <li><Link to="/dashboard/territory/1">Territory Head Dashboard</Link></li>
          <li><Link to="/dashboard/vendor/1">Vendor Dashboard</Link></li>
          <li><Link to="/dashboard/customer-vendor/1">Customer Vendor Dashboard</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/dashboard/agent/:agentId" element={<AgentDashboard />} />
        <Route path="/dashboard/franchise/:franchiseId" element={<FranchiseeDashboard />} />
        <Route path="/dashboard/territory/:territoryHeadId" element={<TerritoryHeadDashboard />} />
        <Route path="/dashboard/vendor/:vendorId" element={<VendorDashboard />} />
        <Route path="/dashboard/customer-vendor/:customerId" element={<CustomerVendorDashboard />} />
        {/* <Route path="/" element={<Dashboard />} /> */}
        {/* <Route path="/FranchiseCreatePage" element={<FranchiseCreatePage />} /> */}
        <Route path="/CustomerVendorDashboard" element={<CustomerVendorDashboard />} />
        <Route path="/CustomerVendorDashboard" element={<CustomerVendorDashboard />} />
        <Route path="/CustomerVendorDashboard" element={<CustomerVendorDashboard />} />
        <Route path="/CustomerVendorDashboard" element={<CustomerVendorDashboard />} />
        <Route path="/CustomerVendorDashboard" element={<CustomerVendorDashboard />} />
        <Route path="/CustomerVendorDashboard" element={<CustomerVendorDashboard />} />
        <Route path="/CustomerVendorDashboard" element={<CustomerVendorDashboard />} />
        <Route path="/CustomerVendorDashboard" element={<CustomerVendorDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;


