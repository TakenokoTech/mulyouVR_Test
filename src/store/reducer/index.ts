import { StoreState, storeStateInit } from '../types';
import { Reducer } from 'redux';
import * as ACTION from '../constants';
import { BindAction } from '../action';

/**
 *
 * @param prevState
 * @param q
 */
const initState = (prevState: StoreState) => {
    return { ...prevState };
};

/**
 * Action Mapping
 */
const actionMapping: { [key: string]: (prevState: StoreState, action: any) => StoreState } = {
    [ACTION.INIT_STATE]: initState,
};

/**
 * 触るな危険！
 * @param prevState
 * @param action
 */
export const bindReducer: Reducer<StoreState, BindAction> = (prevState: StoreState | undefined = storeStateInit, action: BindAction): StoreState => {
    console.log('prevState', prevState, action);
    const newState = (() => {
        const func: ((prevState: StoreState, payload: any) => StoreState) | undefined = actionMapping[action.type];
        return func ? func(prevState, action.payload) : prevState;
    })();
    console.log('newState', newState, action);
    return newState;
};
