import { Entity } from 'aframe-react';
import React, { Component } from 'react';

import { Vector3 } from '../util';

interface CameraCompornentProps {
    id: string;
}
interface CameraCompornentState {}

export default class CameraCompornent extends Component<CameraCompornentProps, CameraCompornentState> {
    get defaultState() {
        return {};
    }

    constructor(props: CameraCompornentProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.setState(this.defaultState);
    }

    render() {
        const id = 'box-' + (this.props.id || '');
        const design = {
            // material: { color: 'red' },
            // position: { x: 0, y: 1.6, z: -5 },
            // rotation: Vector3(-45, -45, -45),
        };
        const animation = {
            // animation__rotate: { property: 'rotation', dur: 5000, loop: true, to: '315 315 315' },
            // animation__scale: { property: 'scale', dir: 'alternate', dur: 1000, loop: true, to: '1.1 1.1 1.1' },
        };
        return (
            <Entity id={id} primitive="a-camera" {...design} {...animation}>
                <Entity
                    primitive="a-cursor"
                    geometry={{ primitive: 'ring' }}
                    // cursor={{ fuse: true, fuseTimeout: 3000 }}
                    // raycaster={{ objects: '.foo' }}
                    material={{ color: '#CCC', shader: 'flat' }}
                />
            </Entity>
        );
    }
}
