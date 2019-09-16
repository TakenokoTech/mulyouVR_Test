import { Entity } from 'aframe-react';
import React, { Component } from 'react';
import shaka from 'shaka-player';
import videojs from 'video.js';

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
    id: string;
    videoId: string;
    canplaythrough: boolean;
    muted: boolean;
}

export default class VideoCompornent extends Component<VideoCompornentProps, VideoCompornentState> {
    get defaultState() {
        return {};
    }

    constructor(props: VideoCompornentProps) {
        super(props);
        const id = 'video-' + (this.props.id || '');
        const videoId = `assets-${id}`;
        this.state = {
            id,
            videoId,
            canplaythrough: false,
            muted: true,
        };
    }

    componentDidMount() {
        this.setState(this.defaultState);
        videojs(this.state.videoId).play();
    }

    componentDidUpdate() {
        const v = this.refs.v as HTMLVideoElement;
        v.addEventListener('canplaythrough', e => this.setState({ canplaythrough: true }));
        // const videoEvent = [/*'progress',*/ 'loadeddata', 'loadedmetadata', 'canplay', 'canplaythrough', 'error'];
        // videoEvent.forEach((l: string) => v.addEventListener(l, e => console.log(e)));
    }

    render() {
        const id = this.state.id;
        const videoId = this.state.videoId;
        const videoTagId = `#${videoId}_html5_api`;
        const design = {
            width: this.props.width,
            height: this.props.height,
            position: this.props.position || { x: 0, y: 1.6, z: -5 },
            rotation: this.props.rotation || Vector3(0, 0, 0),
            material: { color: this.state.muted ? '#999' : '#FFF' },
        };
        const animation = {};
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
                    <video id={videoId} ref="v" className="video-js" autoPlay={true} crossOrigin="anonymous" muted={true}>
                        <source src={this.props.src} type="application/x-mpegURL" />
                    </video>
                </Entity>
                {this.state.canplaythrough ? (
                    <Entity id={id} primitive="a-video" ref="a" src={videoTagId} {...design} {...animation} events={events} {...this.props.option} />
                ) : (
                    <Entity id={id} primitive="a-plane" material={{ color: '#333' }} {...design} {...animation} events={events} {...this.props.option} />
                )}
            </>
        );
    }
}
