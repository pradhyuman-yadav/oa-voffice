import React, { useState, useEffect } from 'react';

import GameLoop from './components/ui/game/GameLoop';
import Office from './components/ui/map/Office';
import VideoManager from "./components/ui/video/VideoManager";
import ChatRoom from "./components/ui/chat/ChatRoom";
import Register from "./components/ui/game/Register";

import './App.css';
import { io } from 'socket.io-client';
import { ChakraProvider } from '@chakra-ui/react'

const WEBRTC_SOCKET = io('http://localhost:8080');

function App() {
  const [socketConnected, setSocketConnected] = useState(false);
  WEBRTC_SOCKET.on('connect', () => {
    setSocketConnected(true);
  });

  const [blockKeyPress, setBlockKeyPress] = useState(false);
    const handleKeyPress = (event) => {
        if (blockKeyPress) {
            event.stopPropagation();
        }
    };

  useEffect(() => {
    document.title = "Office App - Game Loop";
  }, []);

  return (
    <>
      <ChakraProvider>
        <header>
        </header>
        {socketConnected &&
          <main className="content">
            <div className="main-container">
              <GameLoop>
                <Office webrtcSocket={WEBRTC_SOCKET}/>
              </GameLoop>
              <Register blockKeyPress={blockKeyPress} setBlockKeyPress={setBlockKeyPress}  />
            </div>
            <div className="video-container">
              <VideoManager webrtcSocket={WEBRTC_SOCKET} />
            </div>
          </main>
        }
        <footer>
        </footer>
        </ChakraProvider>
    </>
  );
}

export default App;