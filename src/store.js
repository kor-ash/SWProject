import { configureStore } from '@reduxjs/toolkit';
import CanvasReducer from './features/canvas/CanvasSlice';

const store = configureStore({
    reducer: {
        canvas: CanvasReducer,
    },
});

export default store;