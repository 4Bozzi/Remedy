import React, { useState, useEffect, useCallback, useRef } from "react";
import socketIOClient from "socket.io-client";
import VideoCall from './VideoCall';
import WaitingScreenDoc from './WaitingScreenDoc';

function DoctorLobby() {
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
    socket.current.disconnect(false);
  }, []);

  return (
    <div>
      {token ? <VideoCall roomName={roomName} token={token} handleLogout={handleLogout} /> : <WaitingScreenDoc />}
    </div>
  );
}

export default DoctorLobby;