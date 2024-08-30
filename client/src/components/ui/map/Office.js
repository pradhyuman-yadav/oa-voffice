import React, {useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import Grid from './Grid';
import ImagesBuffer from './ImagesBuffer';
import Map from './Map';
import CanvasContext from '../../CanvasContext';
import MyCharacter from '../character/MyCharacter';
import DatabaseCharacter from "../character/DatabaseCharacter";
import {MAP_DIMENSIONS, TILE_SIZE, MAP_TILE_IMAGES} from '../../../constances/mapConstants';

const Office = ({mapImagesLoaded, gameStatus, webrtcSocket}) => {
    const width = MAP_DIMENSIONS.COLS * TILE_SIZE;
    const height = MAP_DIMENSIONS.ROWS * TILE_SIZE;
    const context = useContext(CanvasContext);

    useEffect(() => {
        return () => {
            context && context.canvas.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }
    }, [context])

    return (
        <>
            <ImagesBuffer />
            {Object.keys(mapImagesLoaded).length === Object.keys(MAP_TILE_IMAGES).length &&
                <>
                    <Grid width={width} height={height}>
                        <Map />
                    </Grid>
                </>
            }
            {/*TODO: Loading Order? How to control exectue ordering here */}
            {gameStatus.mapLoaded && <MyCharacter webrtcSocket={webrtcSocket}/>}
            {gameStatus.characterLoaded && <DatabaseCharacter />}
        </>
    );
};

const mapStateToProps = ({mapImagesLoaded, gameStatus}) => ({mapImagesLoaded, gameStatus});

export default connect(mapStateToProps)(Office);
