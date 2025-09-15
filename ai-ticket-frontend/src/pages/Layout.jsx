// src/components/Layout.jsx
import React from "react";
import Navbar from "../components/Navbar";  

export default function Layout({ children }) {
  return (
    <div >
      <Navbar /> 
      <main className="container">{children}</main>
    </div>
  );
}
