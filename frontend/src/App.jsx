  // // // frontend/src/App.js
  // // import React from 'react';
  // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  // // import { Toaster } from 'react-hot-toast';
  // // import { ThemeProvider } from './contexts/ThemeContext';
  // // import { AuthProvider } from './contexts/AuthContext';
  // // import { useAuth } from './contexts/AuthContext';
  // // import Landing from './pages/Landing';
  // // import MainLayout from './components/Layout/MainLayout';
  // // import Login from './pages/auth/Login';
  // // import Register from './pages/auth/Register';
  // // import ProducerDashboard from './pages/producer/Dashboard';
  // // import ProducerAnalytics from './pages/producer/Analytics';
  // // import CertifierDashboard from './pages/certifier/Dashboard';
  // // import BuyerDashboard from './pages/buyer/Dashboard';
  // // import AuditorDashboard from './pages/auditor/Dashboard';
  // // import Marketplace from './pages/Marketplace';

  // // // Protected Route Component
  // // const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // //   const { user, loading } = useAuth();

  // //   if (loading) {
  // //     return (
  // //       <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
  // //         <div className="text-center">
  // //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
  // //           <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
  // //         </div>
  // //       </div>
  // //     );
  // //   }

  // //   if (!user) {
  // //     return <Navigate to="/login" replace />;
  // //   }

  // //   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
  // //     return <Navigate to="/unauthorized" replace />;
  // //   }

  // //   return children;
  // // };

  // // // App Routes Component
  // // const AppRoutes = () => {
  // //   const { user } = useAuth();

  // //   return (
  // //     <Routes>
  // //       {/* Public Routes */}
  // //       <Route path="/" element={<Landing />} />
  // //       <Route path="/login" element={<Login />} />
  // //       <Route path="/register" element={<Register />} />
        
  // //       {/* Protected Routes */}
  // //       <Route path="/dashboard" element={
  // //         <ProtectedRoute>
  // //           <MainLayout />
  // //         </ProtectedRoute>
  // //       }>
  // //         {/* Default redirect based on user role */}
  // //         <Route index element={
  // //           user ? <Navigate to={`/${user.role}`} replace /> : <Navigate to="/login" replace />
  // //         } />
          
  // //         {/* Producer Routes */}
  // //         <Route path="/producer" element={
  // //           <ProtectedRoute allowedRoles={['producer']}>
  // //             <ProducerDashboard />
  // //           </ProtectedRoute>
  // //         } />
  // //         <Route path="/producer/analytics" element={
  // //           <ProtectedRoute allowedRoles={['producer']}>
  // //             <ProducerAnalytics />
  // //           </ProtectedRoute>
  // //         } />
          
  // //         {/* Certifier Routes */}
  // //         <Route path="/certifier" element={
  // //           <ProtectedRoute allowedRoles={['certifier']}>
  // //             <CertifierDashboard />
  // //           </ProtectedRoute>
  // //         } />
          
  // //         {/* Buyer Routes */}
  // //         <Route path="/buyer" element={
  // //           <ProtectedRoute allowedRoles={['buyer']}>
  // //             <BuyerDashboard />
  // //           </ProtectedRoute>
  // //         } />
          
  // //         {/* Auditor Routes */}
  // //         <Route path="/auditor" element={
  // //           <ProtectedRoute allowedRoles={['auditor']}>
  // //             <AuditorDashboard />
  // //           </ProtectedRoute>
  // //         } />
          
  // //         {/* Marketplace - accessible to all authenticated users */}
  // //         <Route path="/marketplace" element={
  // //           <ProtectedRoute>
  // //             <Marketplace />
  // //           </ProtectedRoute>
  // //         } />
  // //       </Route>
        
  // //       {/* Catch all route */}
  // //       <Route path="*" element={<Navigate to="/" replace />} />
  // //     </Routes>
  // //   );
  // // };

  // // // Main App Component
  // // function App() {
  // //   return (
  // //     <ThemeProvider>
  // //       <AuthProvider>
  // //         <Router>
  // //           <div className="App">
  // //             <AppRoutes />
  // //             <Toaster
  // //               position="top-right"
  // //               toastOptions={{
  // //                 duration: 4000,
  // //                 style: {
  // //                   background: 'var(--toast-bg)',
  // //                   color: 'var(--toast-color)',
  // //                 },
  // //                 success: {
  // //                   iconTheme: {
  // //                     primary: '#22c55e',
  // //                     secondary: '#ffffff',
  // //                   },
  // //                 },
  // //                 error: {
  // //                   iconTheme: {
  // //                     primary: '#ef4444',
  // //                     secondary: '#ffffff',
  // //                   },
  // //                 },
  // //               }}
  // //             />
  // //           </div>
  // //         </Router>
  // //       </AuthProvider>
  // //     </ThemeProvider>
  // //   );
  // // }

  // // export default App;
  // // frontend/src/App.js
  // import React from 'react';
  // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  // import { Toaster } from 'react-hot-toast';
  // import { ThemeProvider } from './contexts/ThemeContext';
  // import { AuthProvider, useAuth } from './contexts/AuthContext';

  // import Landing from './pages/Landing';
  // import MainLayout from './components/Layout/MainLayout';
  // import Login from './pages/auth/Login';
  // import Register from './pages/auth/Register';

  // import ProducerDashboard from './pages/producer/Dashboard';
  // import ProducerAnalytics from './pages/producer/Analytics';
  // import CertifierDashboard from './pages/certifier/Dashboard';
  // import BuyerDashboard from './pages/buyer/Dashboard';
  // import AuditorDashboard from './pages/auditor/Dashboard';
  // import Marketplace from './pages/Marketplace';

  // // Protected Route Component
  // const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  //   const { user, loading } = useAuth();

  //   if (loading) {
  //     return (
  //       <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
  //           <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (!user) {
  //     return <Navigate to="/login" replace />;
  //   }

  //   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }

  //   return children;
  // };

  // // App Routes Component
  // const AppRoutes = () => {
  //   const { user } = useAuth();

  //   return (
  //     <Routes>
  //       {/* Public Routes */}
  //       <Route path="/" element={<Landing />} />
  //       <Route path="/login" element={<Login />} />
  //       <Route path="/register" element={<Register />} />

  //       {/* Protected Routes with MainLayout */}
  //       <Route
  //         path="/dashboard"
  //         element={
  //           <ProtectedRoute>
  //             <MainLayout />
  //           </ProtectedRoute>
  //         }
  //       >
  //         {/* Default redirect based on user role */}
  //         <Route
  //           index
  //           element={
  //             user
  //               ? <Navigate to={`/dashboard/${user.role}`} replace />
  //               : <Navigate to="/login" replace />
  //           }
  //         />

  //         {/* Producer Routes */}
  //         <Route
  //           path="producer"
  //           element={
  //             <ProtectedRoute allowedRoles={['producer']}>
  //               <ProducerDashboard />
  //             </ProtectedRoute>
  //           }
  //         />
  //         <Route
  //           path="producer/analytics"
  //           element={
  //             <ProtectedRoute allowedRoles={['producer']}>
  //               <ProducerAnalytics />
  //             </ProtectedRoute>
  //           }
  //         />

  //         {/* Certifier Routes */}
  //         <Route
  //           path="certifier"
  //           element={
  //             <ProtectedRoute allowedRoles={['certifier']}>
  //               <CertifierDashboard />
  //             </ProtectedRoute>
  //           }
  //         />

  //         {/* Buyer Routes */}
  //         <Route
  //           path="buyer"
  //           element={
  //             <ProtectedRoute allowedRoles={['buyer']}>
  //               <BuyerDashboard />
  //             </ProtectedRoute>
  //           }
  //         />

  //         {/* Auditor Routes */}
  //         <Route
  //           path="auditor"
  //           element={
  //             <ProtectedRoute allowedRoles={['auditor']}>
  //               <AuditorDashboard />
  //             </ProtectedRoute>
  //           }
  //         />

  //         {/* Marketplace - accessible to all authenticated users */}
  //         <Route
  //           path="marketplace"
  //           element={
  //             <ProtectedRoute>
  //               <Marketplace />
  //             </ProtectedRoute>
  //           }
  //         />
  //       </Route>

  //       {/* Catch-all route */}
  //       <Route path="*" element={<Navigate to="/" replace />} />
  //     </Routes>
  //   );
  // };

  // // Main App Component
  // function App() {
  //   return (
  //     <ThemeProvider>
  //       <AuthProvider>
  //         <Router>
  //           <div className="App">
  //             <AppRoutes />
  //             <Toaster
  //               position="top-right"
  //               toastOptions={{
  //                 duration: 4000,
  //                 style: {
  //                   background: 'var(--toast-bg)',
  //                   color: 'var(--toast-color)',
  //                 },
  //                 success: {
  //                   iconTheme: { primary: '#22c55e', secondary: '#ffffff' },
  //                 },
  //                 error: {
  //                   iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
  //                 },
  //               }}
  //             />
  //           </div>
  //         </Router>
  //       </AuthProvider>
  //     </ThemeProvider>
  //   );
  // }

  // export default App;

  // frontend/src/App.jsx
// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Landing from './pages/Landing';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Producer pages
import ProducerDashboard from './pages/producer/Dashboard';
import ProducerAnalytics from './pages/producer/Analytics';
import RequestCredits from './pages/producer/RequestCredits';
import MyCredits from './pages/producer/MyCredits';

// Certifier pages
import CertifierDashboard from './pages/certifier/Dashboard';
import PendingRequests from './pages/certifier/PendingRequests';
import ApprovedCredits from './pages/certifier/ApprovedCredits';
import CertifierAnalytics from './pages/certifier/Analytics';

// Buyer pages
import BuyerDashboard from './pages/buyer/Dashboard';
import BuyerMyCredits from './pages/buyer/MyCredits';
import RetireCredits from './pages/buyer/RetireCredits';
import BuyerAnalytics from './pages/buyer/Analytics';

// Auditor pages
import AuditorDashboard from './pages/auditor/Dashboard';
import AllTransactions from './pages/auditor/AllTransactions';
import FraudDetection from './pages/auditor/FraudDetection';
import AuditorAnalytics from './pages/auditor/Analytics';

import Marketplace from './pages/Marketplace';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Redirect role-mismatch users back to dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// App Routes
const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Wait until user data is loaded
  if (loading) return null;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/auth/login"
        element={user ? <Navigate to={`/dashboard/${user.role}`} replace /> : <Login />}
      />
      <Route
        path="/auth/register"
        element={user ? <Navigate to={`/dashboard/${user.role}`} replace /> : <Register />}
      />
      {/* Legacy routes for compatibility */}
      <Route
        path="/login"
        element={<Navigate to="/auth/login" replace />}
      />
      <Route
        path="/register"
        element={<Navigate to="/auth/register" replace />}
      />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect based on role */}
        <Route
          index
          element={<Navigate to={`/dashboard/${user?.role}`} replace />}
        />

        {/* Producer Routes */}
        <Route path="producer" element={<ProducerDashboard />} />
        <Route path="producer/analytics" element={<ProducerAnalytics />} />
        <Route path="producer/request" element={<RequestCredits />} />
        <Route path="producer/credits" element={<MyCredits />} />
        
        {/* Certifier Routes */}
        <Route path="certifier" element={<CertifierDashboard />} />
        <Route path="certifier/requests" element={<PendingRequests />} />
        <Route path="certifier/approved" element={<ApprovedCredits />} />
        <Route path="certifier/analytics" element={<CertifierAnalytics />} />
        
        {/* Buyer Routes */}
        <Route path="buyer" element={<BuyerDashboard />} />
        <Route path="buyer/credits" element={<BuyerMyCredits />} />
        <Route path="buyer/retire" element={<RetireCredits />} />
        <Route path="buyer/analytics" element={<BuyerAnalytics />} />
        
        {/* Auditor Routes */}
        <Route path="auditor" element={<AuditorDashboard />} />
        <Route path="auditor/transactions" element={<AllTransactions />} />
        <Route path="auditor/fraud" element={<FraudDetection />} />
        <Route path="auditor/analytics" element={<AuditorAnalytics />} />
      </Route>

      {/* Marketplace accessible to all authenticated users */}
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <Marketplace />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { background: 'var(--toast-bg)', color: 'var(--toast-color)' },
                success: { iconTheme: { primary: '#22c55e', secondary: '#ffffff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

