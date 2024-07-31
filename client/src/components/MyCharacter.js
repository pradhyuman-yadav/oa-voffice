import React, {useEffect, useContext} from 'react';
import {connect} from 'react-redux';

import CanvasConext from './CanvasContext';
import {CHARACTER_IMAGE_SIZE, CHARACTER_CLASSES_MAP} from './characterConstants';
import {TILE_SIZE} from './mapConstants';
import {loadCharacter} from './slices/statusSlice';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import {update as updateAllCharactersData} from './slices/allCharactersSlice'

import { firebaseDatabase as database } from '../firebase/firebase'; // Import Firebase Realtime Database
import { ref, set, onValue} from 'firebase/database';


function MyCharacter({ myCharactersData, loadCharacter, updateAllCharactersData, webrtcSocket }) {
    const context = useContext(CanvasConext);
    useEffect(() => {
        const myInitData = {
            ...MY_CHARACTER_INIT_CONFIG,
            socketId: webrtcSocket.id,
        };

        const users = {};
        const myId = MY_CHARACTER_INIT_CONFIG.id;
        users[myId] = myInitData;
        updateAllCharactersData(users);
        set(ref(database, `users/${myId}`), myInitData);

    }, [webrtcSocket]);

    return null;
}

const mapStateToProps = (state) => {
    return {myCharactersData: state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id]};
};

const mapDispatch = {loadCharacter, updateAllCharactersData};

export default connect(mapStateToProps, mapDispatch)(MyCharacter);