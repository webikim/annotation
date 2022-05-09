import { combineReducers } from '@reduxjs/toolkit';

import dirDuck from './modules/dirDuck'

export default combineReducers(
    { dir: dirDuck }
)