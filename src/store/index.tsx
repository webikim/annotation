import { combineReducers } from '@reduxjs/toolkit';

import annoDuck from './anno/annoDuck';
import dirDuck from './anno/dirDuck';
import imageDuck from './anno/imageDuck';

const rootReducer = combineReducers(
    {
        anno: annoDuck,
        dir: dirDuck,
        image: imageDuck
    }
)

export default rootReducer;