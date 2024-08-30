import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import PeerTemplate from "./PeerTemplate";
import {MY_CHARACTER_INIT_CONFIG} from "../../../constances/characterConstants";
import {
    OFFER_SIGNAL,
    CONSOLE_FORMAT_SERVER2CLIENT,
} from '../../../constances/webRTCKeyConstances';
import VideoTemplate from "./VideoTemplate";

function VideoManager({myCharacter, otherCharacters, allCharacters, otherCharactersOrdered, webrtcSocket}) {
    const [myMediaStream, setMyMediaStream] = useState();
    const [offer, setOffer] = useState({});//key: socketId, value: offerSignal Data

    // ----------------- simple-peer: https://github.com/feross/simple-peer?tab=readme-ov-file#videovoice -----------------
    // var Peer = require('simple-peer')
    //
    // // get video/voice stream
    // navigator.mediaDevices.getUserMedia({
    //     video: true,
    //     audio: true
    // }).then(gotMedia).catch(() => {})
    //
    // function gotMedia (stream) {
    //     var peer1 = new Peer({ initiator: true, stream: stream })
    //     var peer2 = new Peer()
    //
    //     peer1.on('signal', data => {
    //         peer2.signal(data)
    //     })
    //
    //     peer2.on('signal', data => {
    //         peer1.signal(data)
    //     })
    //
    //     peer2.on('stream', stream => {
    //         // got remote video stream, now let's show it in a video tag
    //         var video = document.querySelector('video')
    //
    //         if ('srcObject' in video) {
    //             video.srcObject = stream
    //         } else {
    //             video.src = window.URL.createObjectURL(stream) // for older browsers
    //         }
    //
    //         // video.play()
    //     })
    // }
    // ----------------- simple-peer: https://github.com/feross/simple-peer?tab=readme-ov-file#videovoice -----------------

    // console.log('otherCharacters:', otherCharacters);

    useEffect(() => {
        const constraints = {video: true}

        navigator.mediaDevices.getUserMedia(constraints)
            .then((mediaStream) => {
                    console.log('Got MediaStream:', mediaStream);
                    setMyMediaStream(mediaStream);
                })
            .catch((err) => {
                console.error('Error accessing media devices:', err);
            });
    }, []);

    useEffect(() => {
        const receiveOfferSignalHandler = ({ sourceSocketId, data }) => {
            console.log(CONSOLE_FORMAT_SERVER2CLIENT, 'Received offer from:', sourceSocketId, ', Offer signal:', data);
            setOffer({...offer, [sourceSocketId]: data});
        }
        webrtcSocket?.on(OFFER_SIGNAL, receiveOfferSignalHandler);
        return () => {
            webrtcSocket?.off(OFFER_SIGNAL, receiveOfferSignalHandler);
        };
    }, [webrtcSocket]);

    // https://github.com/feross/simple-peer?tab=readme-ov-file#connecting-more-than-2-peers
    return <>{
        myCharacter && <div className="videos">
            <VideoTemplate mediaStream={myMediaStream} />

            {Object.keys(otherCharacters).map(id => {
                return <PeerTemplate
                    key = {id}
                    sourceSocketId={myCharacter.socketId}
                    targetSocketId={otherCharacters[id].socketId}
                    myMediaStream={myMediaStream}
                    webrtcSocket={webrtcSocket}
                    isInitiator={true}
                />
            })}

            {Object.keys(offer).map(socketId => {
                return <PeerTemplate
                    key = {socketId}
                    sourceSocketId={myCharacter.socketId}
                    myMediaStream={myMediaStream}
                    targetSocketId={socketId}
                    webrtcSocket={webrtcSocket}
                    isInitiator={false}
                    offerSignal={offer[socketId]}
                />
            })}
        </div>
    }</>
}

const mapStateToProps = (state) => {
    const allCharacters = state.allCharacters.users;// get all characters data from redux store (allCharactersSlice.js)
    const myCharacterId = MY_CHARACTER_INIT_CONFIG.id;
    const myCharacter = allCharacters[myCharacterId];
    const otherCharacters = Object.keys(allCharacters)
        .filter(id => id !== myCharacterId)
        .reduce((filterObj, key) => {
            filterObj[key] = allCharacters[key];
            return filterObj;
        }, {});
    const otherCharactersOrdered = Object.keys(otherCharacters)
        .filter(id => id >= myCharacterId)
        .reduce((filterObj, key) => {
            filterObj[key] = otherCharacters[key];
            return filterObj;
        }, {});
    return {myCharacter, otherCharacters, allCharacters, otherCharactersOrdered};
}

export default connect(mapStateToProps, {})(VideoManager);
