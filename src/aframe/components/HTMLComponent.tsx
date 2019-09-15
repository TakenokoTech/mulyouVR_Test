import { Entity } from 'aframe-react';
import React, { Component } from 'react';

import { Vector3 } from '../util';

const transparent = '#F8F8F8';
const fps = 30;
const debug = '#debug';

interface HTMLCompornentProps {
    id: string;
    target: string;
    click: () => void;
}
interface HTMLCompornentState {}

export default class HTMLCompornent extends Component<HTMLCompornentProps, HTMLCompornentState> {
    get defaultState() {
        return {};
    }

    constructor(props: HTMLCompornentProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.setState(this.defaultState);
    }

    render() {
        console.log('render');
        const id = 'box-' + (this.props.id || '');
        const geometry = 'primitive: plane; width:10; height:0;';
        const design = {
            material: `shader: html; target: #${this.props.target}; fps:${fps}; ratio:width; debug: ${debug}; transparent:${transparent}; side: double; `,
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
        return <Entity id={id} geometry={geometry} {...design} {...animation} events={events} />;
    }
}
