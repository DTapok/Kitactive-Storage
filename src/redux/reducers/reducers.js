import { combineReducers } from 'redux';
import authReducer from './authReducer.js';
import filesReducer from './filesReducer.js';

const rootReducer = combineReducers({
    auth: authReducer,
    files: filesReducer
});

export default rootReducer;
