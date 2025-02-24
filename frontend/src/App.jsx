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


// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import AdminDashboard from './pages/dashboard/AdminDashboard';
// import AgentDashboard from './pages/dashboard/AgentDashboard';
// import FranchiseeDashboard from './pages/dashboard/FranchiseeDashboard';
// import TerritoryHeadDashboard from './pages/dashboard/TerritoryHeadDashboard';
// import VendorDashboard from './pages/dashboard/VendorDashboard';
// import CustomerVendorDashboard from './pages/dashboard/CustomerVendorDashboard';
// import Dashboard from './components/Dashboard';
// import FranchiseCreatePage from './components/FranchiseCreatePage';
// import PrivateRoute from './components/PrivateRoute';

// function App() {
//   return (
//     <Router>
//       <nav>
//         <ul>
//           <li><Link to="/">Admin Dashboard</Link></li>
//           <li><Link to="/dashboard/agent/1">Agent Dashboard</Link></li>
//           <li><Link to="/dashboard/franchise/1">Franchisee Dashboard</Link></li>
//           <li><Link to="/dashboard/territory/1">Territory Head Dashboard</Link></li>
//           <li><Link to="/dashboard/vendor/1">Vendor Dashboard</Link></li>
//           <li><Link to="/dashboard/customer-vendor/1">Customer Vendor Dashboard</Link></li>
//           <li><Link to="/Dashboard">Dashboard</Link></li>

//         </ul>
//       </nav>

//       <Routes>
//         <Route path="/" element={<AdminDashboard />} />
//         <Route path="/dashboard/agent/:agentId" element={<AgentDashboard />} />
//         <Route path="/dashboard/franchise/:franchiseId" element={<FranchiseeDashboard />} />
//         <Route path="/dashboard/territory/:territoryHeadId" element={<TerritoryHeadDashboard />} />
//         <Route path="/dashboard/vendor/:vendorId" element={<VendorDashboard />} />
//         <Route path="/dashboard/customer-vendor/:customerId" element={<CustomerVendorDashboard />} />
//         <Route path="/Dashboard" element={<Dashboard />} />
//         <Route path="/FranchiseCreatePage" element={<FranchiseCreatePage />} />
//         <Route path="/CustomerVendorDashboard" element={<CustomerVendorDashboard />} />
//         <Route path="/PrivateRoute" element={<PrivateRoute />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AgentDashboard from './pages/dashboard/AgentDashboard';
import TerritoryHeadDashboard from './pages/dashboard/TerritoryHeadDashboard';
import VendorDashboard from './pages/dashboard/VendorDashboard';
import CustomerVendorDashboard from './pages/dashboard/CustomerVendorDashboard';
import Dashboard from './components/Dashboard';
import FranchiseCreatePage from './components/FranchiseCreatePage';
import Login from './pages/auth/Login';  // Login page for user authentication
import PrivateRoute from './components/PrivateRoute';  // Protect sensitive routes
import ReferralDashboard from './pages/ReferralDashboard';
import AdminOverview from './pages/dashboard/AdminOverview';
import CommissionCard from './components/CommissionCard';
import DashboardStats from './components/DashboardStats';
import CommissionList from './pages/CommissionList';
import CommissionDetails from './pages/CommissionDetails';
import AddCommission from './pages/AddCommission';
import FranchiseList from './pages/FranchiseList';
import TerritoryHeadList from './pages/TerritoryHeadList';
import Reports from './pages/Reports';
import Profile from './pages/users/Profile';
import TransactionCard from './components/TransactionCard';
import FranchiseDashboard from './pages/dashboard/FranchiseeDashboard'; // Check if this path is correct
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>

  <div className="app">
        <Header />
        {/* <Sidebar /> */}  
        <div className="content">  
      {/* <nav>
        <ul>
          <li><Link to="/">Admin Dashboard</Link></li>
          <li><Link to="/dashboard/agent/1">Agent Dashboard</Link></li>
          <li><Link to="/dashboard/franchise/1">Franchisee Dashboard</Link></li>
          <li><Link to="/dashboard/territory/1">Territory Head Dashboard</Link></li>
          <li><Link to="/dashboard/vendor/1">Vendor Dashboard</Link></li>
          <li><Link to="/dashboard/customer-vendor/1">Customer Vendor Dashboard</Link></li>
          <li><Link to="/Dashboard">Dashboard</Link></li>
        </ul>
      </nav> */}

      <Routes>
        {/* Login route (public) */}
        <Route path="/login" element={<Login />} />

        {/* Protect all dashboard routes using PrivateRoute */}
        <Route
          path="/AdminDashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/dashboard/agent" element={<AgentDashboard />} />
        <Route path="/dashboard/franchise" element={<FranchiseDashboard />} />

        {/* <Route
          path="/dashboard/agent/:agentId"
          element={
            <PrivateRoute>
              <AgentDashboard />
            </PrivateRoute>
          }
        /> */}
        {/* <Route
          path="/dashboard/franchise/:franchiseId"
          element={
            <PrivateRoute>
              <FranchiseeDashboard />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/dashboard/territory/:territoryHeadId"
          element={
            <PrivateRoute>
              <TerritoryHeadDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/vendor/:vendorId"
          element={
            <PrivateRoute>
              <VendorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/customer-vendor/:customerId"
          element={
            <PrivateRoute>
              <CustomerVendorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/FranchiseCreatePage"
          element={
            <PrivateRoute>
              <FranchiseCreatePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/ReferralDashboard"
          element={
            <PrivateRoute>
              <ReferralDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/AdminOverview"
          element={
            <PrivateRoute>
              <AdminOverview />
            </PrivateRoute>
          }
        />
        <Route
          path="/CommissionCard"
          element={
            <PrivateRoute>
              <CommissionCard />
            </PrivateRoute>
          }
        />
        <Route
          path="/DashboardStats"
          element={
            <PrivateRoute>
              <DashboardStats />
            </PrivateRoute>
          }
        />
         <Route
          path="/TransactionCard"
          element={
            <PrivateRoute>
              <TransactionCard />
            </PrivateRoute>
          }
        />
        <Route
          path="/CommissionList"
          element={
            <PrivateRoute>
              <CommissionList />
            </PrivateRoute>
          }
        />
        <Route
          path="/CommissionDetails"
          element={
            <PrivateRoute>
              <CommissionDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/AddCommission"
          element={
            <PrivateRoute>
              <AddCommission />
            </PrivateRoute>
          }
        />
        <Route
          path="/FranchiseList"
          element={
            <PrivateRoute>
              <FranchiseList />
            </PrivateRoute>
          }
        />
        <Route
          path="/TerritoryHeadList"
          element={
            <PrivateRoute>
              <TerritoryHeadList />
            </PrivateRoute>
          }
        />
        <Route
          path="/Reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/Profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
       
      </Routes>
      
      </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
