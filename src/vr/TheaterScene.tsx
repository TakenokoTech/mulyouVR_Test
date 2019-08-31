import 'webvr-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';

import { getVRDisplays } from '../extension';
import { WEBVR } from '../utils/WebVR';
import { BaseThreeSceneProps, BaseThreeSceneState } from './BaseThreeScene';

interface TheaterProps extends BaseThreeSceneProps {}
interface TheaterState extends BaseThreeSceneState {}

export default class TheaterScene extends React.Component<TheaterProps, TheaterState> {
    camera: THREE.OrthographicCamera;
    controls: OrbitControls;
    scene: THREE.Scene = new THREE.Scene();
    scene2: THREE.Scene = new THREE.Scene();
    renderer: WebGLRenderer = new WebGLRenderer();
    renderer2: CSS3DRenderer = new CSS3DRenderer();

    constructor(props: TheaterProps) {
        super(props);
        this.state = { VRDisplays: [] };
    }

    componentDidMount() {
        const frustumSize = 500;
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera((frustumSize * aspect) / -2, (frustumSize * aspect) / 2, frustumSize / 2, frustumSize / -2, 1, 1000);
        this.camera.position.set(0, 20, 500);
        this.scene.background = new THREE.Color(0xf0f0f0);

        this.renderer = this.createWebGLRenderer();
        this.renderer2 = this.createCSS3DRenderer();

        const root = document.getElementById(this.props.id);
        if (root) {
            // root.appendChild(this.renderer.domElement);
            root.appendChild(this.renderer2.domElement);
        }

        /*
        const controls = new VRControls(this.camera);
        const effect = new VREffect(this.renderer2);
        effect.setSize(window.innerWidth, window.innerHeight);
        this.manager = new WebVRManager(this.renderer, effect);
        */

        this.onCreate();
        this.onUpdate();
    }

    shouldComponentUpdate(nextProps: TheaterProps, nextState: TheaterState, nextContext: any) {
        const prev = this.props.store.screenSize;
        const next = nextProps.store.screenSize;
        if (prev.x != next.x || prev.y != next.y) {
            getVRDisplays().then(VRDisplays => {
                nextState.VRDisplays = VRDisplays;
                if (VRDisplays.length > 0) {
                    this.renderer.vr.enabled = true;
                    this.createVrButton();
                } else {
                    this.renderer.vr.enabled = false;
                    this.controls = new OrbitControls(this.camera, this.renderer2.domElement);
                }
            });
        }
        return true;
    }

    render() {
        return <div id={this.props.id} />;
    }

    private createVrButton = () => {
        const container = document.getElementById('container') as HTMLDivElement;
        container.appendChild(WEBVR.createButton(this.renderer));
    };

    private createWebGLRenderer(): WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }

    private createCSS3DRenderer(): CSS3DRenderer {
        const renderer = new CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        return renderer;
    }

    protected onUpdate = () => {
        requestAnimationFrame(this.onUpdate);
        this.controls && this.controls.update();
        // this.renderer.render(this.scene, this.camera);
        this.renderer2.render(this.scene2, this.camera);
    };

    protected onCreate = () => {
        {
            [
                this.createPlane(100, 100, 'chocolate', new THREE.Vector3(-50, 0, 0), new THREE.Euler(0, -90 * THREE.Math.DEG2RAD, 0)),
                this.createPlane(100, 100, 'saddlebrown', new THREE.Vector3(0, 0, 50), new THREE.Euler(0, 0, 0)),
                this.createPlane(100, 100, 'yellowgreen', new THREE.Vector3(0, 50, 0), new THREE.Euler(-90 * THREE.Math.DEG2RAD, 0, 0)),
            ].forEach(([css, mesh]) => {
                this.scene.add(mesh);
                this.scene2.add(css);
            });
        }
        {
            this.createIframe();
        }
    };

    private createIframe = () => {
        const div = document.createElement('div');
        const dom = (
            <div>
                <iframe
                    width={1920 / 4}
                    height={1080 / 4}
                    src="https://www.youtube.com/embed/Wtn7RqAH5S8"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                />
                <iframe
                    width={1920 / 4}
                    height={1080 / 4}
                    src="https://www.youtube.com/embed/Wtn7RqAH5S8"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                />
                <iframe
                    width={1920 / 4}
                    height={1080 / 4}
                    src="https://www.youtube.com/embed/Wtn7RqAH5S8"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                />
                <iframe
                    width={1920 / 4}
                    height={1080 / 4}
                    src="https://www.youtube.com/embed/Wtn7RqAH5S8"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                />
            </div>
        );
        ReactDOM.render(dom, div);
        const object = new CSS3DObject(div);
        this.scene2.add(object);
    };

    private createPlane = (width: number, height: number, cssColor: string, pos: THREE.Vector3, rot: THREE.Euler): [CSS3DObject, THREE.Mesh] => {
        var element = document.createElement('div') as HTMLDivElement;
        element.style.width = width + 'px';
        element.style.height = height + 'px';
        element.style.opacity = '0.75';
        element.style.background = cssColor;

        var object = new CSS3DObject(element);
        object.position.copy(pos);
        object.rotation.copy(rot);

        var geometry = new THREE.PlaneBufferGeometry(width, height);
        var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(object.position);
        mesh.rotation.copy(object.rotation);

        return [object, mesh];
    };
}
