import React from "react";
import {Link} from "react-router-dom";

function Home() {
  return (
    <div className="homescreen">
      <h2>Home</h2>
      <Link to="/lobby"><span className="btn" >I have an emergency <span role="img" aria-label="screaming face emoji">😱️</span></span></Link>
      <Link to="/doclobby"><span className="btn" >I'm a Doctor <span role="img" aria-label="doctor emoji">👨‍⚕️</span></span></Link>
    </div>
  );
}

export default Home;