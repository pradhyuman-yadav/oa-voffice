import React, { useState, useEffect } from 'react';

import GameLoop from './components/GameLoop';
import Office from './components/Office';
import FirebaseConnection from './components/FirebaseConnection';

import './App.css';
import { io } from 'socket.io-client';
import AllCharacters from './components/AllCharacters';

const WEBRTC_SOCKET = io('http://localhost:8080');

function App() {
  const [socketConnected, setSocketConnected] = useState(false);
  WEBRTC_SOCKET.on('connect', () => {
    setSocketConnected(true);
  });

  useEffect(() => {
    document.title = "Office App - Game Loop";
  }, []);

  return (
    <>
        <header className="App-header">
          <h1 className='App-header-h1'>OFFICE APP</h1>
        </header>
        {socketConnected &&
          <main class="content">
              <GameLoop>
                <Office webrtcSocket={WEBRTC_SOCKET}/>
              </GameLoop>
              <FirebaseConnection />
          </main>
        }
        <footer>
        </footer>
    </>
  );
}

export default App;