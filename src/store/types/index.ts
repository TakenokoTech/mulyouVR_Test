import Point from '../../utils/Point';

export interface StoreState {
    screenSize: Point;
}

export const storeStateInit = {
    screenSize: new Point(0, 0),
};
