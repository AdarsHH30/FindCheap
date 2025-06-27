import React from "react";
// import "./App.css";
import Api from "./components/api.jsx"; // Changed from { Api } to Api
import Search from "./components/search.jsx";
import { Navbar } from "./components/Navbar/Navbar.jsx";
import { Hero } from "./components/Hero.jsx";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="flex flex-col right-0 top-0">
        <Hero />
      </div>
    </div>
  );
}

export default App;
