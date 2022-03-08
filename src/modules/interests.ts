import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

export interface interestState {
    interestList: string[];
    selectedInterest: string;
};

const initialState: interestState = {
    interestList: [],
    selectedInterest: ''
};

export const interestSlice = createSlice({
    name: 'interest',
    initialState,
    reducers: {
        setinterestList: (state, action: PayloadAction<string[]>) => {
            state.interestList = action.payload;
        },
        setSelectedInterest: (state, action: PayloadAction<string>) => {
            state.selectedInterest = action.payload;
        }
    }
})

export const { setinterestList, setSelectedInterest } = interestSlice.actions;
export const getinterestList = (state: RootState) => state.interest.interestList;
export const getSelectedInterest = (state: RootState) => state.interest.selectedInterest;
export default interestSlice.reducer;