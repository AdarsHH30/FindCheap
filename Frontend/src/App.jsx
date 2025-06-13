import React from "react";
import "./App.css";
import Api from "./components/api.jsx"; // Changed from { Api } to Api
import Search from "./components/search.jsx";
import { Hero } from "./components/Hero.jsx";

function App() {
  return (
    <div className="App">
      <Hero />
    </div>
  );
}

export default App;
