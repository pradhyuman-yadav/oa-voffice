import React, {useEffect, useContext, useMemo, useCallback} from 'react';
import {connect} from 'react-redux';

import CanvasConext from './CanvasContext';
import {CHARACTER_IMAGE_SIZE, CHARACTER_CLASSES_MAP} from './characterConstants';
import {TILE_SIZE} from './mapConstants';
import {loadCharacter} from './slices/statusSlice';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import {update as updateAllCharactersData} from './slices/allCharactersSlice'

const AllCharacters = ({ allCharactersData, webrtcSocket, loadCharacter, updateAllCharactersData }) => {
    const context = useContext(CanvasConext);
    const defaultCharacterClass = 'ENGINEER';

    const drawCharacters = useCallback(() => {
        if (!context || !context.canvas) return;

        Object.keys(allCharactersData).forEach(characterId => {
            const character = allCharactersData[characterId];
            const characterImg = document.querySelector(`#character-sprite-img-${character.characterClass}`);
            const { sx, sy } = CHARACTER_CLASSES_MAP[character.characterClass].icon;

            context.canvas.drawImage(
                characterImg,
                sx,
                sy,
                CHARACTER_IMAGE_SIZE - 5,
                CHARACTER_IMAGE_SIZE - 5,
                character.position.x * TILE_SIZE,
                character.position.y * TILE_SIZE,
                CHARACTER_IMAGE_SIZE,
                CHARACTER_IMAGE_SIZE
            );
        });
    }, [context, allCharactersData]);

    useEffect(() => {
        drawCharacters();
        loadCharacter(true);
    }, [drawCharacters, loadCharacter]);

    return null;
}

const mapStateToProps = (state) => {
    return {allCharactersData: state.allCharacters.users};
};

const mapDispatch = {loadCharacter, updateAllCharactersData};

export default connect(mapStateToProps, mapDispatch)(AllCharacters);