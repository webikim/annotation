import { combineReducers } from '@reduxjs/toolkit';

import annoDuck from './modules/annoDuck';
import dirDuck from './modules/dirDuck';
import imageDuck from './modules/imageDuck';

const rootReducer = combineReducers(
    {
        anno: annoDuck,
        dir: dirDuck,
        image: imageDuck
    }
)

export default rootReducer;