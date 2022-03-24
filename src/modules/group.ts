import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { GroupData } from 'types';

export interface GroupState {
    groupList: GroupData[];
}

const initialState: GroupState = {
    groupList: []
};

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setGroupList: (state, action: PayloadAction<GroupData[]>) => {
            state.groupList = action.payload;
        }
    }
})

export const { setGroupList } = groupSlice.actions;

export const getGroups = (state: RootState) => state.group.groupList;

export default groupSlice.reducer;