import * as ACTION from '../constants';

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

export type BindAction = InitState;
