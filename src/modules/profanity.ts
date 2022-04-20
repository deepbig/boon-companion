import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'modules';

export interface ProfanityState {
    profanityList: string[];
}

const initialState: ProfanityState = {
    profanityList: []
};

export const profanitySlice = createSlice({
    name: 'profanity',
    initialState,
    reducers: {
        setProfanityList: (state, action: PayloadAction<string[]>) => {
            state.profanityList = action.payload;
        },
        reset: () => initialState,
    }
})

export const { setProfanityList, reset } = profanitySlice.actions;

export const getProfanityList = (state: RootState) => state.profanity.profanityList;

export default profanitySlice.reducer;