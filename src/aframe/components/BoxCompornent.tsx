import { Entity } from 'aframe-react';
import React, { Component } from 'react';

import { Vector3 } from '../util';

interface BoxCompornentProps {
    id: string;
    click: () => void;
}
interface BoxCompornentState {}

export default class BoxCompornent extends Component<BoxCompornentProps, BoxCompornentState> {
    get defaultState() {
        return {};
    }

    constructor(props: BoxCompornentProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.setState(this.defaultState);
    }

    render() {
        const id = 'box-' + (this.props.id || '');
        const design = {
            material: { color: 'red' },
            position: { x: 0, y: 1.6, z: -5 },
            rotation: Vector3(-45, -45, -45),
        };
        const animation = {
            animation__rotate: { property: 'rotation', dur: 5000, loop: true, to: '315 315 315' },
            animation__scale: { property: 'scale', dir: 'alternate', dur: 1000, loop: true, to: '1.1 1.1 1.1' },
        };
        const events = {
            click: this.props.click,
        };
        return <Entity id={id} geometry={{ primitive: 'box' }} {...design} {...animation} events={events} />;
    }
}
