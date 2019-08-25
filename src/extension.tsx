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
