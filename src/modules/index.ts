import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import activityReducer from './activity';
import profanityReducer from './profanity';
import interestReducer from './interests';
import groupReducer from './group';
import backdropReducer from './backdrop';
import peerRatingReducer from './peerRating';

export const store = configureStore({
    reducer: {
        user: userReducer,
        activity: activityReducer,
        profanity: profanityReducer,
        interest: interestReducer,
        group: groupReducer,
        backdrop: backdropReducer,
        peerRating: peerRatingReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;