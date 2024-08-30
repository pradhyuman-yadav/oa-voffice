import React, {useEffect, useRef} from 'react';

function VideoTemplate({mediaStream}) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!mediaStream || !videoRef.current) return;
        videoRef.current.srcObject = mediaStream;
    }, [mediaStream]);

    return <video width="200px" height="200px" ref={videoRef} autoPlay playsInline/>
}

export default VideoTemplate;
