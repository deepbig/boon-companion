import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { PeerRatingData } from 'types';

export interface peerRatingState {
    peerRatingList: PeerRatingData[];
}

const initialState: peerRatingState = {
    peerRatingList: []
};

export const peerRatingSlice = createSlice({
    name: 'peerRating',
    initialState,
    reducers: {
        setPeerRatingList: (state, action: PayloadAction<PeerRatingData[]>) => {
            state.peerRatingList = action.payload;
        },
        reset: () => initialState,
    }
})

export const { setPeerRatingList, reset } = peerRatingSlice.actions;

export const getPeerRatings = (state: RootState) => state.peerRating.peerRatingList;

export default peerRatingSlice.reducer;