import * as ACTION from '../constants';
import Point from '../../utils/Point';

/**
 *
 */
interface InitState {
    type: ACTION.INIT_STATE;
    payload: null;
}
export const initState = (): InitState => {
    return { type: ACTION.INIT_STATE, payload: null };
};

/**
 *
 */
interface SetScreenSize {
    type: ACTION.SET_SCREEN_SIZE;
    payload: Point;
}
export const setScreenSize = (point: Point): SetScreenSize => {
    return { type: ACTION.SET_SCREEN_SIZE, payload: point };
};

export type BindAction = InitState | SetScreenSize;
