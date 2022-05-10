import { combineReducers } from '@reduxjs/toolkit';

import dirDuck from './modules/dirDuck'

const rootReducer = combineReducers(
    { dir: dirDuck }
)

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;