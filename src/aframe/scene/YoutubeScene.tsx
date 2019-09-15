import 'aframe';
import 'aframe-html-shader';
import 'aframe-particle-system-component';
import 'aframe-physics-components';
import 'aframe-physics-system';

import { Scene } from 'aframe-react';
import React from 'react';
import uuidv1 from 'uuid/v1';

import { DownloadResult } from '../../../server/src/GetDownload';
import { StoreState } from '../../store/types';
import { Vec } from '../aframe-react';
import CameraCompornent from '../components/CameraCompornent';
import SkyCompornent from '../components/SkyCompornent';
import VideoCompornent from '../components/VideoCompornent';

const POLLLING_INVERVAL = 10000; // 10s
const uuid = uuidv1();

interface YoutubeDLProps {
    id: string;
    store: StoreState;
    resize: () => void;
}

interface YoutubeDLState {
    html: boolean;
    video: DownloadResult[];
}

export default class YoutubeScene extends React.Component<YoutubeDLProps, YoutubeDLState> {
    constructor(props: YoutubeDLProps) {
        super(props);
        this.state = { html: false, video: [] };
    }

    componentDidMount() {
        window.addEventListener('resize', this.props.resize);
        this.onCreate();
        this.setState({ html: true });
    }

    shouldComponentUpdate(nextProps: YoutubeDLProps, nextState: YoutubeDLState, nextContext: any) {
        console.log(nextProps, nextState);
        const prev = this.props.store.screenSize;
        const next = nextProps.store.screenSize;
        if (prev.x != next.x || prev.y != next.y) {
            // this.onCreate();
        }
        return true;
    }

    render() {
        return (
            <>
                <Scene ref="scene" id="scene" physics="debug: false">
                    {/* <BoxCompornent id="____" click={this.onClick} /> */}
                    {this.state.video.map((v, i) => {
                        return <VideoCompornent id={v.id} key={i} ref={`y_${i}`} src={v.url} click={this.onClick} {...this.calcPos(i, v)} />;
                    })}
                    <CameraCompornent id="___camera" />
                    <SkyCompornent id="____sky" color={'#000'} />
                </Scene>
            </>
        );
    }

    calcPos(i: number, v: DownloadResult): { width: number; height: number; position: Vec; rotation: Vec } {
        const maxWidth = 20;
        const width = (16 / v.width) * v.width;
        const height = (16 / v.width) * v.height;
        const l = { [-2]: 4, [-1]: 6, [+0]: 8, [+1]: 6, [+2]: 4 };
        const shetaX = { [-2]: +90, [-1]: +60, [+0]: 45, [+1]: 60, [+2]: 90 };
        const shetaY = { [-2]: -60, [-1]: -30, [+0]: +0, [+1]: 30, [+2]: 60 };
        const floor = (i: number) => (i < l[0] ? 0 : i < l[0] + l[1] ? 1 : i < l[0] + l[1] + l[-1] ? -1 : i < l[0] + l[1] + l[-1] + l[2] ? 2 : -2);
        const RAD = Math.PI / 180;
        const layoutX = (i % 2 == 0 ? 1 : -1) * Math.ceil((i % l[floor(i)]) / 2);
        const layoutY = floor(i);

        const posX = +(maxWidth - Math.abs(layoutY) * 4) * Math.cos((90 - shetaX[layoutY] * layoutX) * RAD);
        const posY = +(height * layoutY);
        const posZ = -(maxWidth - Math.abs(layoutY) * 4) * Math.sin((90 - shetaX[layoutY] * layoutX) * RAD);
        const rotX = +shetaY[layoutY];
        const rotY = +layoutX * -shetaX[layoutY];

        return {
            width,
            height,
            position: { x: posX, y: posY, z: posZ },
            rotation: { x: rotX, y: rotY, z: 0 },
        };
    }

    protected onUpdate = () => {};

    protected onCreate = async () => {
        const _list = [
            'g1oyJi4vD84',
            'hDf4HBxfESQ',
            '_R8xW5mmoy0',
            't2gktD1r-7w',
            'rqWbGZ_srXE',
            'Lwr8AKMaN9Q',
            'W33QM9VGkCc',
            'c1wvibT43WI',
            'MjmU-GTWpqg',
            'n6d6yhhz2pY',
            'cRkfuL3QtVc',
            '1E2uZQx96YI',
            'xN1ldNFECJo',
            'CPSVydGivAE',
            'xsBdp8ucgf4',
            'MEFCNKjT5k8',
            'gtj0hN7HoRM',
            'oGCgtrPuH_s',
            'fm3WxmZXsqc',
            'ujx-czBUd_Y',
            // 'lrVCnwJQnGg',
            // 'JJxSpusdY0g',
            // '8d6CI98hOwU',
            // 'LfXRi2dZ-mA',
            // '5jx6U6KMB0c',
            // '3bt5FnQxuqI',
            // 'KJpVlP61Y6Q',
            // 'cPT2IZdn4nc',
        ];

        const list = [
            'AZWYH8nfZrI',
            'H3tpUA45v7w',
            'H3tpUA45v7w',
            'AZWYH8nfZrI',
            'AZWYH8nfZrI',
            'H3tpUA45v7w',
            'H3tpUA45v7w',
            'AZWYH8nfZrI',
            'AZWYH8nfZrI',
            'H3tpUA45v7w',
            'AZWYH8nfZrI',
            'H3tpUA45v7w',
            'AZWYH8nfZrI',
            'H3tpUA45v7w',
            'AZWYH8nfZrI',
            'H3tpUA45v7w',
            'AZWYH8nfZrI',
            'H3tpUA45v7w',
            'AZWYH8nfZrI',
            'H3tpUA45v7w',
            'AZWYH8nfZrI',
            'H3tpUA45v7w',
            'AZWYH8nfZrI',
            'H3tpUA45v7w',
            'AZWYH8nfZrI',
            'H3tpUA45v7w',
            'AZWYH8nfZrI',
            'H3tpUA45v7w',
            'AZWYH8nfZrI',
        ];

        const promise: Promise<DownloadResult>[] = [];
        for (const v of list) promise.push(this.loadVideo(v));
        Promise.all(promise).then(values => {
            console.log('all...');
            this.setState({ video: values });
        });

        setTimeout(this.polling, POLLLING_INVERVAL);
    };

    private async loadVideo(v: string): Promise<DownloadResult> {
        // console.log(`loadVideo start. ${v}`);
        return fetch(`http://${document.domain}:3000/download?uuid=${uuid}&v=${v}`)
            .then(result => {
                return result.json();
            })
            .then(v => {
                // this.setState({ video: this.state.video.concat([v]) });
                // console.log(`loadVideo end. `, v);
                return v as DownloadResult;
            });
    }

    private async polling() {
        // console.log(result.status);
        setTimeout(this.polling, POLLLING_INVERVAL);
    }

    private onClick = () => {
        console.log('onClick');
    };
}
