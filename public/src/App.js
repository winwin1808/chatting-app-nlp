import React, { lazy, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from './mainLayout';
import AuthLayout from './authLayout';

const UserChat = lazy(() => import("./pages/userChat"));
const CustomerChat = lazy(() => import("./pages/customerChat"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import('./pages/Register'));
const SetAvatar = lazy(() => import("./pages/setAvatar"));

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout collapsed={collapsed} handleCollapsedChange={handleCollapsedChange} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/userChat" element={<UserChat />} />
          <Route path="/customerChat" element={<CustomerChat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
