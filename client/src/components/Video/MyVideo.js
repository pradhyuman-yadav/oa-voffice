import React, { useRef, useEffect } from 'react';
// import './MyVideo.css'; // Import the CSS file for MyVideo

const MyVideo = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
            })
            .catch(error => {
                console.error('Error accessing media devices.', error);
            });
    }, []);

    return (
        <div className="my-video">
            <video ref={videoRef} autoPlay muted></video>
        </div>
    );
};

export default MyVideo;
