import ReactDOM from 'react-dom';
import { ReactInstance } from 'react';

export function domSize(ref: ReactInstance) {
    const node = ReactDOM.findDOMNode(ref) as Element;
    const height = node.getBoundingClientRect().height;
    const width = node.getBoundingClientRect().width;
    return { height: height, width: width };
}

export function getVRDisplays(): Promise<VRDisplay[]> {
    return new Promise(resolve => {
        navigator
            .getVRDisplays()
            .then(VRDisplays => resolve(VRDisplays.length > 0 && VRDisplays[0].isConnected ? VRDisplays : []))
            .catch(e => resolve([]));
    });
}

export function asyncForeach(i: number, j: number, func: (i: number, j: number) => void) {
    for (let x1 = 0; x1 < i; x1++)
        for (let x2 = 0; x2 < j; x2++) {
            (async () => func(x1, x2))();
        }
}
