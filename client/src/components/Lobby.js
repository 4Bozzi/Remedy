import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:3001/";

function Lobby() {
  const [response, setResponse] = useState(false);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    });
  }, []);

  return (
    <div>
      <h2>Lobby</h2>
      <p>
      {response ? `You've been connected to ${response}` : "There are no doctors currently available! Please wait while we connect you to a Doc."}
      </p>
    </div>
  );
}

export default Lobby;