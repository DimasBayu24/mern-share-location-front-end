import { combineReducers } from 'redux';
import placeReducers from './place';

const reducers = combineReducers({
  place: placeReducers,
});

export default reducers;
