import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";

function Api() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/`)
      .then((res) => setMsg(res.data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>API Response</h1>
      <p>{msg}</p>
    </div>
  );
}
export default Api;
