import './BaseThreeScene.css';

import React from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import WebVRPolyfill from 'webvr-polyfill';

import { getVRDisplays, GUIVR } from '../../extension';
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
    isFullscrren: boolean;
    visibleGui: boolean;
}

export default abstract class BaseThreeScene<P extends BaseThreeSceneProps, S extends BaseThreeSceneState> extends React.Component<P, S> {
    public scene = new THREE.Scene();
    public camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
    public renderer: CustomWebGLRenderer = new CustomWebGLRenderer();
    public controls: OrbitControls;

    protected time = 0;
    protected hierarchy: { [key: string]: THREE.Object3D[] } = {};
    private gui: THREE.Object3D = new THREE.Object3D();

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
                VRDisplays = [];
                nextState.VRDisplays = VRDisplays;
                if (VRDisplays.length > 0) {
                    this.renderer.vr.enabled = true;
                    this.createVrButton();
                } else {
                    this.renderer.vr.enabled = false;
                    this.controls = this.createControls();
                    this.makeGui();
                }
            });
            this.renderer.customSetSize(next.x, next.y, this.refs.divElement as HTMLDivElement, this.refs.cameraElement as HTMLDivElement);
            this.onCreate();
            this.renderer.setAnimationLoop(this.onUpdate);
        }
        this.gui.visible = nextState.visibleGui;
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
                <div id="menu">
                    <button id="fullscreen" onClick={this.fullscreen}>
                        {window.document.fullscreenElement ? 'WINDOW' : 'FULLSCREEN'}
                    </button>
                    <button id="gui" onClick={this.enableGui}>
                        GUI
                    </button>
                    {/* <button id="vrbutton">VR OFF</button> */}
                </div>
            </>
        );
    }

    private fullscreen = () => {
        if (!window.document.fullscreenElement) {
            const requestFullScreen = window.document.documentElement.requestFullscreen;
            requestFullScreen.call(window.document.documentElement);
            this.setState({ isFullscrren: true });
        } else {
            const cancelFullScreen = window.document.exitFullscreen;
            cancelFullScreen.call(window.document);
            this.setState({ isFullscrren: false });
        }
    };

    private enableGui = () => {
        this.setState({ visibleGui: !this.state.visibleGui });
    };

    private createVrButton = () => {
        const container = document.getElementById('container') as HTMLDivElement;
        container.appendChild(WEBVR.createButton(this.renderer));
    };

    private createCamera(x: number, y: number): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(45, x / y);
        const cameraContainer = new THREE.Object3D();
        cameraContainer.add(camera);
        this.scene.add(cameraContainer);
        cameraContainer.position.y = this.renderer.vr.enabled ? 20 : 100;
        cameraContainer.position.z = this.renderer.vr.enabled ? 80 : 0;
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

    makeGui = () => {
        console.log('makeGui');
        this.gui = new GUIVR.create('OrbitControls');
        GUIVR.enableMouse(this.camera);
        this.gui.position.set(0, 20, 0);
        this.gui.scale.set(30, 30, 30);
        this.gui.visible = this.state.visibleGui || false;
        this.scene.add(this.gui);
        //this.gui.add(this.camera, 'castShadow');
        this.gui
            .add(this.controls.target, 'x', -300, 300)
            .name('Orbit Target X')
            .listen();
        this.gui
            .add(this.controls.target, 'y', -300, 300)
            .name('Orbit Target Y')
            .listen();
        this.gui
            .add(this.controls.target, 'z', -300, 300)
            .name('Orbit Target Z')
            .listen();
        this.gui
            .add(this.camera.position, 'x', -300, 300)
            .name('Camera Position X')
            .listen();
        this.gui
            .add(this.camera.position, 'y', -300, 300)
            .name('Camera Position Y')
            .listen();
        this.gui
            .add(this.camera.position, 'z', -300, 300)
            .name('Camera Position Z')
            .listen();
        this.gui
            .add(this.camera.rotation, 'x', -Math.PI, Math.PI)
            .step(0.01)
            .name('Camera Rotation X')
            .listen();
        this.gui
            .add(this.camera.rotation, 'y', -Math.PI, Math.PI)
            .step(0.01)
            .name('Camera Rotation Y')
            .listen();
        this.gui
            .add(this.camera.rotation, 'z', -Math.PI, Math.PI)
            .step(0.01)
            .name('Camera Rotation Z')
            .listen();
    };
}
