import { Entity } from 'aframe-react';
import React, { Component } from 'react';
import shaka from 'shaka-player';
import videojs from 'video.js';

import { Vec } from '../aframe-react';
import { Vector3 } from '../util';

export const POLLLING_INVERVAL = 10000; // 10s

interface VideoCompornentProps {
    id: string;
    videoId: string;
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
    sourceId: string;
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
        const sourceId = `source-${id}`;
        this.state = {
            id,
            videoId,
            sourceId,
            canplaythrough: false,
            muted: true,
        };
    }

    componentDidMount() {
        this.setState(this.defaultState);
        this.check();
    }

    componentDidUpdate() {
        const v = this.refs.v as HTMLVideoElement;
        v.addEventListener('canplaythrough', e => this.setState({ canplaythrough: true }));
        // const videoEvent = [/*'progress', 'loadeddata', 'loadedmetadata', 'canplay',*/ 'canplaythrough', 'error'];
        // videoEvent.forEach((l: string) => v.addEventListener(l, e => console.log(e)));

        if (this.refs.a) {
            this.refs.a.el.addEventListener('mouseenter', () => {
                v.muted = false;
                this.setState({ muted: v.muted });
            });
            this.refs.a.el.addEventListener('mouseleave', () => {
                v.muted = true;
                this.setState({ muted: v.muted });
            });
        }
    }

    check = async () => {
        const response = await fetch(`http://${document.domain}:3000/check?v=${this.props.videoId}`);
        const json = await response.json();
        if (!json.ready) setTimeout(this.check, POLLLING_INVERVAL);
        else videojs(this.state.videoId).play();
        // console.log('check', +response.status);
    };

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
            // click: () => {
            //     const v = this.refs.v as HTMLVideoElement;
            //     v.play();
            //     v.muted = !v.muted;
            //     this.props.click && this.props.click();
            //     this.setState({ muted: v.muted });
            // },
        };
        return (
            <>
                <Entity primitive="a-assets" timeout={'10000'} loaded={e => console.log('loaded', e)}>
                    <video id={videoId} ref="v" className="video-js" autoPlay={true} crossOrigin="anonymous" muted={true}>
                        <source id={this.state.sourceId} src={this.props.src} type="application/x-mpegURL" />
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
