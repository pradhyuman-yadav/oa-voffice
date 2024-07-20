import React, {useCallback, useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import CanvasContext from './CanvasContext';

import {loadCharacter} from './slices/statusSlice';
import { firebaseDatabase as database } from '../firebase/firebase'; // Import Firebase Realtime Database
import { ref, set, onValue} from 'firebase/database';

import {MOVE_DIRECTIONS, MAP_DIMENSIONS, TILE_SIZE} from './mapConstants';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import {checkMapCollision} from './utils';
import { update as updateAllCharactersData } from './slices/allCharactersSlice'; // import the update action


const GameLoop = ({children, allCharactersData, updateAllCharactersData}) => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    useEffect(() => {
        // frameCount used for re-rendering child components
        // console.log("initial setContext");
        setContext({canvas: canvasRef.current.getContext('2d'), frameCount: 0});
    }, [setContext]);

    // keeps the reference to the main rendering loop
    const loopRef = useRef();
    const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];

    const moveMyCharacter = useCallback((e) => {

        if (!mycharacterData) return;

        var currentPosition = mycharacterData.position;
        const key = e.key.toLowerCase();
        if (MOVE_DIRECTIONS[key]) {
            const [dx, dy] = MOVE_DIRECTIONS[key];
            const newPosition = {
                x: currentPosition.x + dx,
                y: currentPosition.y + dy,
            };

            // Check for collisions and map boundaries
            if (!checkMapCollision(newPosition.x, newPosition.y)) {
                const updatedCharacterData = {
                    ...mycharacterData,
                    position: newPosition
                };

                const users = { ...allCharactersData };
                const myId = MY_CHARACTER_INIT_CONFIG.id;
                users[myId] = updatedCharacterData;

                set(ref(database, `users/${myId}`), updatedCharacterData);
            }
        }

    }, [mycharacterData, allCharactersData, updateAllCharactersData]);

    const tick = useCallback(() => {
        if (context != null) {
            setContext({canvas: context.canvas, frameCount: (context.frameCount + 1) % 60});
        }
        loopRef.current = requestAnimationFrame(tick);
    }, [context]);

    useEffect(() => {   
        loopRef.current = requestAnimationFrame(tick);
        return () => {
            loopRef.current && cancelAnimationFrame(loopRef.current);
        }
    }, [loopRef, tick])

    useEffect(() => {
        document.addEventListener('keypress', moveMyCharacter);
        return () => {
            document.removeEventListener('keypress', moveMyCharacter);
        }
    }, [moveMyCharacter]);

    return (
        <CanvasContext.Provider value={context}>
            <canvas
                ref={canvasRef} 
                width={TILE_SIZE * MAP_DIMENSIONS.COLS}
                height={TILE_SIZE * MAP_DIMENSIONS.ROWS}
                class="main-canvas"
            />
            {children}
        </CanvasContext.Provider>
    );
};

const mapStateToProps = (state) => {
    return {allCharactersData: state.allCharacters.users};
};

const mapDispatch = {loadCharacter, updateAllCharactersData};

export default connect(mapStateToProps, mapDispatch)(GameLoop);
