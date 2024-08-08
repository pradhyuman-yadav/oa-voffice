import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { addClient, getClients } from '../../firebase/firebase';

const socket = io('http://localhost:8080'); // Replace with your server address

const InitiatedVideoCalls = () => {
    const localVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const clientIdRef = useRef(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localVideoRef.current.srcObject = stream;
                peerConnectionRef.current = createPeerConnection(stream);
                clientIdRef.current = socket.id;
                addClient(socket.id, { id: socket.id });
                handleNewClient();
            })
            .catch(error => {
                console.error('Error accessing media devices.', error);
            });
    }, []);

    const createPeerConnection = (stream) => {
        const peerConnection = new RTCPeerConnection();

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('candidate', event.candidate);
            }
        };

        stream.getTracks().forEach(track => {
            peerConnection.addTrack(track, stream);
        });

        peerConnection.createOffer()
            .then(offer => {
                return peerConnection.setLocalDescription(new RTCSessionDescription(offer));
            })
            .then(() => {
                const offer = peerConnection.localDescription;
                socket.emit('offer', offer);
            })
            .catch(error => {
                console.error('Error creating offer.', error);
            });

        return peerConnection;
    };

    const handleNewClient = () => {
        getClients(clients => {
            if (clients) {
                Object.keys(clients).forEach(clientId => {
                    if (clientId !== clientIdRef.current) {
                        sendOfferToClient(clientId);
                    }
                });
            }
        });
    };

    const sendOfferToClient = (clientId) => {
        const peerConnection = peerConnectionRef.current;
        peerConnection.createOffer()
            .then(offer => {
                return peerConnection.setLocalDescription(new RTCSessionDescription(offer));
            })
            .then(() => {
                const offer = peerConnection.localDescription;
                socket.emit('offer', { clientId, offer });
            })
            .catch(error => {
                console.error('Error creating offer.', error);
            });
    };

    return (
        <div>
            <h2>Initiated Video Calls</h2>
            <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }}></video>
        </div>
    );
};

export default InitiatedVideoCalls;
