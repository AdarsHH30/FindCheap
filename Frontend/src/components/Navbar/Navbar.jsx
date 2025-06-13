import React from "react";
import "../../style/Navbar.css"; // Assuming you have a CSS file for styling
export const Navbar = () => {
  return (
    <nav className="navbar ">
      <div className="navbar-brand">
        <img
          src="/shopping-cart-logo.svg"
          alt="Shopping Logo"
          className="navbar-logo"
        />
        <a href="/">MyApp</a>
      </div>
      <ul className="navbar-menu">
        <li>
          <a href="/home">Home</a>
        </li>
        <li>
          <a href="/about">Categories</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
        <li className="navbar-login flex gap-2">
          <a href="/login">Login</a>
        </li>
      </ul>
    </nav>
  );
};
