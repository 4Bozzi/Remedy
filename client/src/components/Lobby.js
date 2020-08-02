import React, { useState, useEffect, useCallback } from "react";
import socketIOClient from "socket.io-client";
import VideoCall from './VideoCall';
import WaitingScreen from './WaitingScreen';

const ENDPOINT = "http://127.0.0.1:3001/";

function Lobby() {

  const [roomName, setRoomName] = useState('TEST');
  const [token, setToken] = useState(null);
  const [response, setResponse] = useState(false);
  const [username, setUsername] = useState('YOU');

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit("FromAPI", {
      identity: username,
      room: roomName
    });

    socket.on("FromAPI", data => {
      setToken(data.token);
      setResponse(data.doctor);
    });
  }, []);

  const handleLogout = useCallback(event => {
    setToken(null);
  }, []);

  return (
    <div>
      {response ? <VideoCall roomName={roomName} token={token} handleLogout={handleLogout} /> : <WaitingScreen />}
    </div>
  );
}

export default Lobby;