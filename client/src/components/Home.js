import React from "react";
import {Link} from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <Link to="/lobby">I have an emergency</Link>
    </div>
  );
}

export default Home;