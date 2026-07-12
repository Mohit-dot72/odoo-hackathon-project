import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Landing from '../pages/Landing/Landing';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import RoleSelection from '../pages/RoleSelection/RoleSelection';
import NotFound from '../pages/NotFound/NotFound';

// Protected dashboard views
import Dashboard from '../pages/Dashboard/Dashboard';
import Vehicles from '../pages/Vehicles/Vehicles';
import Drivers from '../pages/Drivers/Drivers';
import Trips from '../pages/Trips/Trips';
import Maintenance from '../pages/Maintenance/Maintenance';
import FuelExpenses from '../pages/FuelExpenses/FuelExpenses';
import Reports from '../pages/Reports/Reports';
import Alerts from '../pages/Alerts/Alerts';
import Documents from '../pages/Documents/Documents';
import Profile from '../pages/Profile/Profile';
import Settings from '../pages/Settings/Settings';

// Layout & Protected Route Wrapper
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/roles" element={<RoleSelection />} />

      {/* Protected dashboard routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Vehicles CRUD restricted to Admin, Fleet Manager, Safety Officer, Financial Analyst (view only for some) */}
        <Route path="vehicles" element={<Vehicles />} />
        
        {/* Drivers CRUD */}
        <Route path="drivers" element={<Drivers />} />
        
        {/* Trips CRUD */}
        <Route path="trips" element={<Trips />} />
        
        {/* Maintenance CRUD */}
        <Route path="maintenance" element={<Maintenance />} />
        
        {/* Fuel & Expenses CRUD (accessible by Analyst, Manager, Admin, Driver log) */}
        <Route path="fuel-expenses" element={<FuelExpenses />} />
        
        {/* Reports generating page */}
        <Route path="reports" element={<Reports />} />
        
        {/* System alerts notifications board */}
        <Route path="alerts" element={<Alerts />} />
        
        {/* Document verification uploads board */}
        <Route path="documents" element={<Documents />} />
        
        {/* Account views */}
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 handler */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
