import { Navbar } from "../components/Navbar/Navbar.jsx";
import React from "react";
export const Hero = () => {
  return (
    <div className="hero">
      <Navbar />
      <h1 className="hero-title">Welcome to Our Website</h1>
      <p className="hero-subtitle">
        Discover amazing content and connect with us!
      </p>
      <button className="hero-button">Get Started</button>
    </div>
  );
};
