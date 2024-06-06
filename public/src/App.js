import React, { lazy, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from './mainLayout';
import AuthLayout from './authLayout';

const Chat = lazy(() => import("./pages/Chat"));
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
          <Route path="/" element={<Chat />} />
          <Route path="/dashboard" element={<Chat />} />
          <Route path="/setting" element={<Chat />} />
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
