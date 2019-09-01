import React from 'react';
import YouTube from 'react-youtube';

import Point from '../../utils/Point';
import BaseSvgComponent, { BaseSvgProps, BaseSvgState } from './BaseSvgComponent';

interface YotubeSvgProps extends BaseSvgProps {
    height: number;
    width: number;
    videoId: string;
    onEnd: () => void;
}
interface YotubeSvgState extends BaseSvgState {}

export default class YotubeSvgComponent extends BaseSvgComponent<YotubeSvgProps, YotubeSvgState> {
    onLoad() {
        super.onLoad(/*() => {
            // const iframe = this.refs.svg.getElementById('iframe') as HTMLIFrameElement;
            try {
                // const svg = iframe.ownerDocument.getElementById('inframe').innerHTML;
                const svg = this.refs.m.container;
                const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
                console.log(uri);
                return uri;
                // const ownerDocument = iframe.contentWindow.document.body;
                // console.log(iframe.contentWindow.document);
            } catch (e) {}
            return null
        }*/);
    }

    render() {
        return (
            <div ref="svg">
                <svg xmlns="http://www.w3.org/2000/svg" width="512" height="256">
                    <foreignObject width="512" height="256">
                        <div
                            xmlns="http://www.w3.org/1999/xhtml"
                            style={{
                                fontSize: '72px',
                                fontFamily: 'Pangolin',
                                backgroundColor: this.props.color,
                                width: '1000px',
                                height: '1000px',
                            }}
                        >
                            <YouTube
                                className="iframe-child"
                                ref="m"
                                containerClassName={this.props.videoId}
                                videoId={this.props.videoId}
                                opts={{
                                    width: `${this.props.width}`,
                                    height: `${this.props.height}`,
                                    playerVars: {
                                        autoplay: 1,
                                    },
                                }}
                                onReady={this.onReady}
                                onPlay={this.onPlay}
                                onPause={this.onPause}
                                onEnd={this.onEnd}
                                onError={this.onError}
                                onStateChange={this.onStateChange}
                            />
                        </div>
                    </foreignObject>
                </svg>
            </div>
        );
    }

    private onReady = (event: { target: any }) => {
        console.log('onReady');
        const svg = this.refs.m as YouTube;
        // const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        // console.log(uri);
        // return uri;

        // const div = document.getElementsByClassName(this.props.videoId).item(0) as Element;
        // console.log(div.getElementsByTagName('iframe')[0].contentWindow.document);
        // console.log(div.getElementsByClassName('video-stream'));

        // console.log(svg.container.contentWindow);
        // const stream = $('.iframe-child')
        //     .contents()
        //     .find('video-stream');
        // console.log(stream);
        this.yout();
    };

    private onPlay = (event: { target: any; data: number }) => {
        console.log('onPlay');
    };

    private onPause = (event: { target: any; data: number }) => {
        console.log('onPause', event.target, event.data);
    };

    private onEnd = (event: { target: any; data: number }) => {
        console.log('onEnd', event.target, event.data);
        this.props.onEnd();
    };

    private onError = (event: { target: any; data: number }) => {
        console.log('onError', event.target, event.data);
    };

    private onStateChange = (event: { target: any; data: number }) => {
        // console.log('onStateChange', event.target, event.data);
    };

    yout = async () => {
        // const svg = this.refs.m as YouTube;
        // const iframe = await svg.internalPlayer.getIframe();
        // console.log(iframe.contentWindow.document);
        /*
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0] as HTMLScriptElement;
        (firstScriptTag.parentNode as Node).insertBefore(tag, firstScriptTag);
        var player;

        /*
        var done = false;
        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.PLAYING && !done) {
                setTimeout(() => player.stopVideo()), 6000);
                done = true;
            }
        }
        */
    };
}

function onYouTubeIframeAPIReady() {
    console.log('onYouTubeIframeAPIReady');
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: 'M7lc1UVf-VE',
        events: {
            onReady: e => e.target.playVideo(),
            // onStateChange: onPlayerStateChange,
        },
    });
}
