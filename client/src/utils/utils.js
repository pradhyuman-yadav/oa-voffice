import {LAYERS, MAP_DIMENSIONS, SOLID_TILES} from '../constances/mapConstants';

/**
 * Check if the given position is a solid tile
 *
 * @param x The new x position
 * @param y The new y position
 * @returns {boolean} true if the position is a solid tile, false otherwise
 */
export const isSolidTile = (x, y) => {
    console.debug(`isSolidTile: x=${x}, y=${y}`);
    for (let layer of LAYERS) {
        console.debug(`layer[${y}][${x}]=${layer[y][x]}`)
        if (SOLID_TILES.includes(layer[y][x])) {
            console.warn(`solid tile detected: x=${x}, y=${y}`);
            return true;
        }
    }
    return false;
};

/**
 * Check if the given position is at the edge of the map
 *
 * @param x The new x position
 * @param y The new y position
 * @returns {boolean} true if the position is at the edge of the map, false otherwise
 */
export const isMapEdge = (x, y) => {
    console.debug(`isMapEdge: x=${x}, y=${y}`)
    const {ROWS, COLS} = MAP_DIMENSIONS;
    const result = (x < 0 || x >= COLS || y < 0 || y >= ROWS)
    if (result) console.warn(`map edge detected: x=${x}, y=${y}`);
    return result;
};

/**
 * Check if the given position is a solid tile or at the edge of the map
 *
 * @param x The new x position
 * @param y The new y position
 * @returns {boolean} true if the position is a solid tile or at the edge of the map, false otherwise
 */
export const checkMapCollision = (x, y) => {
    return isMapEdge(x,y) || isSolidTile(x,y);
};
