import { Entity } from 'aframe-react';
import React, { Component } from 'react';

import { Vec } from '../aframe-react';
import { Vector3 } from '../util';

interface VideoCompornentProps {
    id: string;
    src: string;
    width?: number;
    height?: number;
    position?: Vec;
    rotation?: Vec;
    option?: {};
    click?: () => void;
}

interface VideoCompornentState {
    canplaythrough: boolean;
    muted: boolean;
}

export default class VideoCompornent extends Component<VideoCompornentProps, VideoCompornentState> {
    get defaultState() {
        return {};
    }

    constructor(props: VideoCompornentProps) {
        super(props);
        this.state = { canplaythrough: false, muted: true };
    }

    componentDidMount() {
        this.setState(this.defaultState);
    }

    componentDidUpdate() {
        const v = this.refs.v as HTMLVideoElement;
        v.addEventListener('canplaythrough', e => this.setState({ canplaythrough: true }));

        const videoEvent = [/*'progress',*/ 'loadeddata', 'loadedmetadata', 'canplay', 'canplaythrough', 'error'];
        videoEvent.forEach((l: string) => v.addEventListener(l, e => console.log(e)));
    }

    render() {
        const id = 'video-' + (this.props.id || '');
        const videoId = `assets-${id}`;
        const design = {
            width: this.props.width,
            height: this.props.height,
            position: this.props.position || { x: 0, y: 1.6, z: -5 },
            rotation: this.props.rotation || Vector3(0, 0, 0),
            color: this.state.muted ? '#999' : '#FFF',
        };
        const animation = {
            // animation__rotate: { property: 'rotation', dur: 5000, loop: true, to: '315 315 315' },
            // animation__scale: { property: 'scale', dir: 'alternate', dur: 1000, loop: true, to: '1.1 1.1 1.1' },
        };
        const events = {
            click: () => {
                const v = this.refs.v as HTMLVideoElement;
                v.play();
                v.muted = !v.muted;
                this.props.click && this.props.click();
                this.setState({ muted: v.muted });
            },
        };
        return (
            <>
                <Entity primitive="a-assets" timeout={'10000'} loaded={e => console.log('loaded', e)}>
                    <video id={videoId} ref="v" src={this.props.src} autoPlay={true} crossOrigin="anonymous" muted={true} />
                </Entity>
                {this.state.canplaythrough ? (
                    <Entity id={id} primitive="a-video" ref="a" src={`#${videoId}`} {...design} {...animation} events={events} {...this.props.option} />
                ) : (
                    <Entity id={id} primitive="a-plane" material={{ color: '#333' }} {...design} {...animation} events={events} {...this.props.option} />
                )}
            </>
        );
    }
}
