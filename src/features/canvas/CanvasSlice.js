import { createSlice } from '@reduxjs/toolkit';
const CanvasSlice = createSlice({
    name: 'canvas',
    initialState: {
        savedVector: [],
        savedCircle: [],
        allObject: []
        //compositeObject: new CompositeObject(),
    },
    reducers: {
        updateSelectedVector(state, action) {
            state.savedVector = action.payload;
        },
        updateSelectedCircle(state, action) {
            state.savedCircle = action.payload;
        },
        updateAllObject(state, action) {
            state.allObject = action.payload;
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