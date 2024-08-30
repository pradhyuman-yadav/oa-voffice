import {createSlice} from '@reduxjs/toolkit';

const statusSlice = createSlice({
    name: 'status',
    initialState: {
        mapLoaded: false,
        characterLoaded: false,
        moveAllowed: false,
    },
    reducers: {
        loadMap(state, payload) {
            state.mapLoaded = payload;
        },
        loadCharacter(state, payload) {
            state.characterLoaded = payload;
        },
        allowMove(state, payload) {
            console.log('statusSlice allowMove payload', payload);
            state.moveAllowed = payload;
        },
    }
});

export const { loadMap, loadCharacter, allowMove } = statusSlice.actions;

export default statusSlice.reducer;
