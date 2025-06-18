import React from "react";
import "../../style/Navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img
          src="/shopping-cart-logo.svg"
          alt="Shopping Logo"
          className="navbar-logo"
        />
        <h2>FindCheap</h2>
      </div>
      <ul className="navbar-menu">
        <li className="navbar-categories">
          <button onClick={() => (window.location.href = "/categories")}>
            Categories
          </button>
        </li>
        <li className="navbar-home">
          <button onClick={() => (window.location.href = "/how-it-works")}>
            How it Works
          </button>
        </li>
        <li className="navbar-contact">
          <button onClick={() => (window.location.href = "/about")}>
            About
          </button>
        </li>
        <li>
          <button onClick={() => (window.location.href = "/signup")}>
            Sign Up
          </button>
        </li>
        <li className="navbar-login">
          <button onClick={() => (window.location.href = "/signup")}>
            Sign Up
          </button>
        </li>
      </ul>
    </nav>
  );
};
