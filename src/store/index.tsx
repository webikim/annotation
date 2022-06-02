import { combineReducers } from '@reduxjs/toolkit';

import comDuck from './comDuck'
import annoDuck from './anno/annoDuck';
import dirDuck from './anno/dirDuck';
import imageDuck from './anno/imageDuck';

const rootReducer = combineReducers(
    {
        com: comDuck,
        anno: annoDuck,
        dir: dirDuck,
        image: imageDuck
    }
)

export default rootReducer;