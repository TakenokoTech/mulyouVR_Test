import './AppContainer.css';

import { ParsedQuery } from 'query-string';
import React from 'react';

import MainScene from '../aframe/scene/MainScene';
import YoutubeScene from '../aframe/scene/YoutubeScene';
import { domSize } from '../extension';
import { StoreState } from '../store/types';
// import MainScene from '../three/scene/MainScene';
// import TestScene from '../three/scene/TestScene';
import Point from '../utils/Point';
import { MapDispatchProps } from './BindingAppContainer';

interface AppContainerProps extends MapDispatchProps, StoreState {
    query: ParsedQuery<string>;
}

interface AppContainerState {}

export class AppContainer extends React.Component<AppContainerProps, AppContainerState> {
    constructor(props: AppContainerProps) {
        super(props);
    }

    componentDidMount() {
        console.log('app.componentDidMount');
        this.props.initState();
        this.resize();
    }

    shouldComponentUpdate(nextProps: AppContainerProps, nextState: AppContainerState, nextContext: any) {
        console.log('shouldComponentUpdate', nextProps, nextState);
        return true;
    }

    render() {
        return (
            <div id="container" className="app-container" ref="frame" style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* <MainScene id="vr-canvas-theater" store={this.props} resize={this.resize} /> */}
                <YoutubeScene id="vr-canvas-theater" store={this.props} resize={this.resize} />
                {/* <TestScene id="vr-canvas-test" store={this.props} resize={this.resize} /> */}
                {/* <div id="vr-overlay" style={{ position: 'relative' }} /> */}
            </div>
        );
    }

    private resize = () => {
        console.log('resize');
        const { width: width, height: height } = domSize(this.refs.frame);
        this.props.setScreenSize(new Point(width, height));
    };
}
