import {useEffect, useContext} from 'react';
import {connect} from 'react-redux';

import CanvasConext from '../../CanvasContext';
import {CHARACTER_IMAGE_SIZE, CHARACTER_CLASSES_MAP, MY_CHARACTER_INIT_CONFIG} from '../../../constances/characterConstants';
import {TILE_SIZE} from '../../../constances/mapConstants';
import {loadCharacter} from '../../slices/statusSlice';

function CharacterTemplate({ charactersData, loadCharacter }) {
    const context = useContext(CanvasConext);
    useEffect(() => {
        if (context == null || charactersData == null) {
            return;
        }
        const characterImg = document.querySelector(`#character-sprite-img-${MY_CHARACTER_INIT_CONFIG.characterClass}`);
        const { sx, sy } = CHARACTER_CLASSES_MAP[MY_CHARACTER_INIT_CONFIG.characterClass].icon;
        context.canvas.drawImage(
            characterImg,
            sx,
            sy,
            CHARACTER_IMAGE_SIZE - 5,
            CHARACTER_IMAGE_SIZE - 5,
            charactersData.position.x * TILE_SIZE,
            charactersData.position.y * TILE_SIZE,
            CHARACTER_IMAGE_SIZE,
            CHARACTER_IMAGE_SIZE
        );
        loadCharacter(true);
    }, [context, charactersData?.position.x, charactersData?.position.y, loadCharacter]);

    return null;
}

export default connect(null, {loadCharacter})(CharacterTemplate);
