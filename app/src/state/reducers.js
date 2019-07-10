import { combineReducers } from 'redux';

export const userInfo = (state, action) => {
    if (action.type === 'USER_UPDATE') {
        return action.payload;
    }
    return state || {};
};

export const reducers = combineReducers({
    userInfo
});
