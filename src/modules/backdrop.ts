import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index'; 

export interface backdropState {
    backdrop: boolean;
}

const initialState: backdropState = {
    backdrop: false
}

export const backdropSlice = createSlice({
    name: 'backdrop',
    initialState,
    reducers: {
        setBackdrop: (state, action: PayloadAction<boolean>) => {
            state.backdrop = action.payload;
        }
    }
})

export const { setBackdrop } = backdropSlice.actions;
export const getBackdrop = (state: RootState) => state.backdrop.backdrop;
export default backdropSlice.reducer;