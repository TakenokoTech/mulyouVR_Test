import _ from 'lodash';

/** */
export function Vector3(x: any, y: any, z: any) {
    return [x, y, z].join(' ');
}

/** */
export function flatteningObj(obj: any[], str = '') {
    _.each(obj, (v, k) => {
        str += k + ':' + v + '; ';
    });
    return str;
}
