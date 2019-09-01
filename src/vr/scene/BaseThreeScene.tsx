import React from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import WebVRPolyfill from 'webvr-polyfill';

import { getVRDisplays } from '../../extension';
import { StoreState } from '../../store/types';
import { WEBVR } from '../../utils/WebVR';
import { CustomWebGLRenderer } from '../render/CustomWebGLRenderer';

export interface BaseThreeSceneProps {
    id: string;
    store: StoreState;
    resize: () => void;
}

export interface BaseThreeSceneState {
    VRDisplays: VRDisplay[];
}

export default abstract class BaseThreeScene<P extends BaseThreeSceneProps, S extends BaseThreeSceneState> extends React.Component<P, S> {
    public scene = new THREE.Scene();
    public camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
    public renderer: CustomWebGLRenderer = new CustomWebGLRenderer();
    public controls: OrbitControls;

    protected time = 0;
    protected hierarchy: { [key: string]: THREE.Object3D[] } = {};

    constructor(props: P) {
        super(props);
        const polyfill = new WebVRPolyfill();

        this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        console.log('componentDidMount');
        window.addEventListener('resize', this.props.resize);
        setInterval(() => (this.time += 5), 30);
    }

    shouldComponentUpdate(nextProps: P, nextState: S, nextContext: any) {
        const prev = this.props.store.screenSize;
        const next = nextProps.store.screenSize;
        if (prev.x != next.x || prev.y != next.y) {
            this.scene = new THREE.Scene();
            this.camera = this.createCamera(next.x, next.y);
            this.renderer = this.createRenderer(next.x, next.y);
            getVRDisplays().then(VRDisplays => {
                nextState.VRDisplays = VRDisplays;
                if (VRDisplays.length > 0) {
                    this.renderer.vr.enabled = true;
                    this.createVrButton();
                } else {
                    this.renderer.vr.enabled = false;
                    this.controls = this.createControls();
                }
            });
            this.renderer.customSetSize(next.x, next.y, this.refs.divElement as HTMLDivElement, this.refs.cameraElement as HTMLDivElement);
            this.onCreate();
            this.renderer.setAnimationLoop(this.onUpdate);
        }
        return true;
    }

    render() {
        return (
            <>
                <canvas id={this.props.id} width="1000" height="1000" />
                <div id="element" ref="element" style={{ position: 'fixed', top: '0px' }} />
                <div id={this.props.id + '_div'} ref="div3D" style={{ position: 'fixed', top: '0px', left: '0px' }}>
                    <div ref="divElement" style={{ overflow: 'hidden' }}>
                        <div ref="cameraElement" style={{ transformStyle: 'preserve-3d' }}></div>
                    </div>
                </div>
            </>
        );
    }

    private createVrButton = () => {
        const container = document.getElementById('container') as HTMLDivElement;
        container.appendChild(WEBVR.createButton(this.renderer));
    };

    private createCamera(x: number, y: number): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(45, x / y);
        const cameraContainer = new THREE.Object3D();
        cameraContainer.add(camera);
        this.scene.add(cameraContainer);
        cameraContainer.position.y = 30;
        cameraContainer.position.z = 80; //100;
        cameraContainer.rotation.x = -15 * THREE.Math.DEG2RAD;
        return camera;
    }

    private createControls(): OrbitControls {
        const controls = new OrbitControls(this.camera);
        controls.target.set(0, 0, 0);
        //controls.enableKeys = false;
        return controls;
    }

    private createRenderer(x: number, y: number): CustomWebGLRenderer {
        const canvas = document.querySelector('#' + this.props.id) as HTMLCanvasElement;
        const renderer = new CustomWebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(x, y);
        renderer.setClearColor(0x0005, 1);
        // renderer.setPixelRatio(1);
        // renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        return renderer;
    }

    protected abstract onUpdate(): void;
    protected abstract onCreate(): void;
}
