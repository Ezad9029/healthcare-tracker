import React from 'react';
import { Routes, Route,Navigate } from 'react-router-dom';
import Dashboard from '../src/DashBoard/DashBoard';

const AllRoutes = () => {
  return (
    <Routes>
       <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default AllRoutes;