import React, { useState, useEffect, useCallback, useRef } from "react";
import socketIOClient from "socket.io-client";
import VideoCall from './VideoCall';
import WaitingScreen from './WaitingScreen';

function Lobby() {
  const [roomName, setRoomName] =  useState(null);
  const [token, setToken] = useState(null);

  let socket = useRef(null);

  useEffect(() => {
    socket.current = socketIOClient();

    socket.current.emit("connectDoctor", {doctorName: 'Dr. Manhattan'});

    socket.current.on("connectDoctor", data => {
      setRoomName(data.roomName);
      setToken(data.token);
    });  
  }, []);


  const handleLogout = useCallback(event => {
    setToken("");
    socket.current.disconnect(true);
  }, []);

  return (
    <div>
      {token ? <VideoCall roomName={roomName} token={token} handleLogout={handleLogout} /> : <WaitingScreen />}
    </div>
  );
}

export default Lobby;