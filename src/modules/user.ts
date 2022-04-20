import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { GroupData, UserData } from 'types/index';

export interface userState {
    user: UserData;
    joinedGroup: GroupData[];
};

const initialState: userState = {
    user: null,
    joinedGroup: [],
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserData>) => {
            state.user = action.payload;
        },
        setJoinedGroup: (state, action: PayloadAction<GroupData[]>) => {
            state.joinedGroup = action.payload;
        },
        reset: () => initialState
    }
})

export const { setUser, setJoinedGroup, reset } = userSlice.actions;
export const getUser = (state: RootState) => state.user.user;
export const getJoinedGroup = (state: RootState) => state.user.joinedGroup;
export default userSlice.reducer;