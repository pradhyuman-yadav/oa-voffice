import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080'); // Replace with your server address

const VideoChat = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);

    useEffect(() => {
        // Get local media stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localVideoRef.current.srcObject = stream;
                localStreamRef.current = stream;
                socket.emit('join', 'room-id'); // Replace 'room-id' with your room identifier
            })
            .catch(error => {
                console.error('Error accessing media devices.', error);
            });

        // Handle incoming signaling messages
        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('candidate', handleCandidate);

        return () => {
            socket.off('offer', handleOffer);
            socket.off('answer', handleAnswer);
            socket.off('candidate', handleCandidate);
        };
    }, []);

    const createPeerConnection = () => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        });

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('candidate', event.candidate);
            }
        };

        peerConnection.ontrack = event => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        localStreamRef.current.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStreamRef.current);
        });

        return peerConnection;
    };

    const handleOffer = async (offer) => {
        const peerConnection = createPeerConnection();
        peerConnectionRef.current = peerConnection;

        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

        socket.emit('answer', answer);
    };

    const handleAnswer = async (answer) => {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleCandidate = async (candidate) => {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    };

    const call = async () => {
        const peerConnection = createPeerConnection();
        peerConnectionRef.current = peerConnection;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

        socket.emit('offer', offer);
    };

    return (
        <div>
            <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }}></video>
            <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }}></video>
            <button onClick={call}>Call</button>
        </div>
    );
};

export default VideoChat;
