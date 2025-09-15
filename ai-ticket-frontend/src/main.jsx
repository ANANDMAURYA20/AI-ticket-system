import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheckAuth from "./components/Check-auth.jsx";
import Tickets from "./pages/Tickets.jsx";
import TicketDetailsPage from "./pages/Ticket.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Admin from "./pages/Admin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Layout from "./pages/Layout.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Layout />
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth protectedRoute={true}>
              <Tickets />
            </CheckAuth>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <CheckAuth protectedRoute={true}>
              <TicketDetailsPage />
            </CheckAuth>
          }
        />
        <Route
          path="/login"
          element={
            <CheckAuth protectedRoute={false}>
              <Login />
            </CheckAuth>
          }
        />
        <Route
          path="/signup"
          element={
            <CheckAuth protectedRoute={false}>
              <Signup />
            </CheckAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <CheckAuth protectedRoute={true}>
              <Admin />
            </CheckAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <CheckAuth protectedRoute={true}>
              <Dashboard />
            </CheckAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
