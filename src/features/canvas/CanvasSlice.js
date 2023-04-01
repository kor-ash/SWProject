import { createSlice } from '@reduxjs/toolkit';
const CanvasSlice = createSlice({
    name: 'canvas',
    initialState: {
        selectedVector: [],
        selectedCircle: [],
        allObject: []
        //compositeObject: new CompositeObject(),
    },
    reducers: {
        updateSelectedVector(state, action) {
            state.selectedVector = action.payload;
        },
        updateSelectedCircle(state, action) {
            state.selectedCircle = action.payload;
        },
        updateAllObject(state, action) {
            state.object = action.payload;
        }
        /*
        updateCompositeObject(state, action) {
            state.compositeObject = action.payload;
        },
        */
        // Add other reducer functions here
    },
});

export const { updateSelectedVector, updateSelectedCircle, updateAllObject } = CanvasSlice.actions;

export default CanvasSlice.reducer;