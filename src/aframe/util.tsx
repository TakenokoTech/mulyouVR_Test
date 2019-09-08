import lodash from 'lodash';

/** */
export function Vector3(x, y, z) {
    return [x, y, z].join(' ');
}

/** */
export function flatteningObj(obj, str = '') {
    _.each(obj, (v, k) => {
        str += k + ':' + v + '; ';
    });
    return str;
}
