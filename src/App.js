import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login          from './pages/Login';
import Signup         from './pages/Signup';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard  from './pages/BuyerDashboard';
import LandDetails     from './pages/LandDetails';

function Guard({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader-wrap"><div className="loader-big"/><p>Loading...</p></div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'seller' ? '/seller' : '/buyer'} replace />;
  return children;
}

function Root() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'seller' ? '/seller' : '/buyer'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<Root />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/signup"  element={<Signup />} />
          <Route path="/seller"  element={<Guard role="seller"><SellerDashboard /></Guard>} />
          <Route path="/buyer"   element={<Guard role="buyer"><BuyerDashboard /></Guard>} />
          <Route path="/land/:id" element={<Guard role="buyer"><LandDetails /></Guard>} />
          <Route path="*"        element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
