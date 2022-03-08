import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

export interface interestState {
    interestList: string[];
};

const initialState: interestState = {
    interestList: []
};

export const interestSlice = createSlice({
    name: 'interest',
    initialState,
    reducers: {
        setinterestList: (state, action: PayloadAction<string[]>) => {
            state.interestList = action.payload;
        }
    }
})

export const { setinterestList } = interestSlice.actions;
export const getinterestList = (state: RootState) => state.interest.interestList;
export default interestSlice.reducer;