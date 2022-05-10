import { combineReducers } from '@reduxjs/toolkit';

import annoDuck from './modules/annoDuck';
import dirDuck from './modules/dirDuck';

const rootReducer = combineReducers(
    {
        anno: annoDuck,
        dir: dirDuck
    }
)

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;