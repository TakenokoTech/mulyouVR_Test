import * as dat from 'dat.gui';
import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

import { asyncForeach, GUIVR } from '../../extension';
import BaseSvgComponent from '../components/BaseSvgComponent';
import YotubeSvgComponent from '../components/YoutubeSvgComponent';
import { Element3DObject } from '../render/CustomWebGLRenderer';
import BaseThreeScene, { BaseThreeSceneProps, BaseThreeSceneState } from './BaseThreeScene';

interface MainSceneProps extends BaseThreeSceneProps {}
interface MainSceneState extends BaseThreeSceneState {}

export default class MainScene extends BaseThreeScene<MainSceneProps, MainSceneState> {
    constructor(props: MainSceneProps) {
        super(props);
        this.state = { ...super.state };
    }

    componentDidMount() {
        super.componentDidMount();
    }

    shouldComponentUpdate(nextProps: MainSceneProps, nextState: MainSceneState, nextContext: any) {
        const s = super.shouldComponentUpdate(nextProps, nextState, nextContext);
        console.log(nextProps, nextState);

        const prev = this.props.store.screenSize;
        const next = nextProps.store.screenSize;
        if (prev.x != next.x || prev.y != next.y) {
            this.camera.position.y = -100;
            this.camera.position.z = 50;
        }

        this.makeStaticGui();
        return s;
    }

    protected onUpdate = () => {
        this.controls && this.controls.update();
        this.renderer.customRender(this.scene, this.camera);
        asyncForeach(4, 4, async (i, j) => {
            const name = `${i * 10 + j}`;
            const mesh = this.scene.getObjectByName(name) as THREE.Mesh;
            if (mesh && mesh.material) {
                const map = await BaseSvgComponent.makeTexture(name);
                mesh.material = new THREE.MeshStandardMaterial({ map: map, side: THREE.DoubleSide, roughness: 0.1, metalness: 0.5 });
                // (mesh.material as THREE.MeshBasicMaterial) = new THREE.MeshBasicMaterial({ map: map, side: THREE.DoubleSide });
                (mesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
            }
        });
    };

    protected onCreate = () => {
        {
            this.scene.add(new THREE.AxesHelper(30));
            this.scene.add(new THREE.GridHelper(1000, 100));
        }
        {
            // 光源を作成
            const spotLight = new THREE.SpotLight(0xffffff, 4, 2000, Math.PI / 5, 0.2, 1.5);
            spotLight.position.set(500, 300, 500);
            this.scene.add(spotLight);
        }
        {
            // 光源を作成
            const ambientLight = new THREE.AmbientLight(0x333333);
            this.scene.add(ambientLight);
        }
        {
            const videoId = 'EnN0r8G9oSM';
            const sheta = 0 * THREE.Math.DEG2RAD;
            const x = +300 * Math.cos(90 * (Math.PI / 180));
            const z = -300 * Math.sin(90 * (Math.PI / 180));
            const object = this.makeYoutubeObj(videoId, new THREE.Vector3(x, 0, z), new THREE.Euler(0, sheta, 0));
            this.scene.add(object);
            this.hierarchy[`youtube_${videoId}`] = [object];
        }
        {
            const videoId = 'v1fSB6C_Ps4';
            const sheta = -30 * THREE.Math.DEG2RAD;
            const x = +300 * Math.cos(60 * (Math.PI / 180));
            const z = -300 * Math.sin(60 * (Math.PI / 180));
            const object = this.makeYoutubeObj(videoId, new THREE.Vector3(x, 0, z), new THREE.Euler(0, sheta, 0));
            this.scene.add(object);
            this.hierarchy[`youtube_${videoId}`] = [object];
        }
        {
            const videoId = 'LatVcl7TkRo';
            const sheta = -60 * THREE.Math.DEG2RAD;
            const x = +300 * Math.cos(30 * (Math.PI / 180));
            const z = -300 * Math.sin(30 * (Math.PI / 180));
            const object = this.makeYoutubeObj(videoId, new THREE.Vector3(x, 0, z), new THREE.Euler(0, sheta, 0));
            this.scene.add(object);
            this.hierarchy[`youtube_${videoId}`] = [object];
        }

        {
            const videoId = 'N1A6iSEFqDA';
            const sheta = +30 * THREE.Math.DEG2RAD;
            const x = -300 * Math.cos(-60 * (Math.PI / 180));
            const z = +300 * Math.sin(-60 * (Math.PI / 180));
            const object = this.makeYoutubeObj(videoId, new THREE.Vector3(x, 0, z), new THREE.Euler(0, sheta, 0));
            this.scene.add(object);
            this.hierarchy[`youtube_${videoId}`] = [object];
        }
        {
            const videoId = 'BcM4jKW9pRQ';
            const sheta = +60 * THREE.Math.DEG2RAD;
            const x = -300 * Math.cos(-30 * (Math.PI / 180));
            const z = +300 * Math.sin(-30 * (Math.PI / 180));
            const object = this.makeYoutubeObj(videoId, new THREE.Vector3(x, 0, z), new THREE.Euler(0, sheta, 0));
            this.scene.add(object);
            this.hierarchy[`youtube_${videoId}`] = [object];
        }
    };

    makeYoutubeObj = (videoId: string, vec: THREE.Vector3, euler: THREE.Euler): Element3DObject => {
        const allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        const [width, height] = [500, (500 / 16) * 9];
        const dom = (
            <div style={{ width: width + 'px', textAlign: 'center' }}>
                <iframe width={width} height={height} src={`https://www.youtube.com/embed/${videoId}`} allow={allow} />
            </div>
        );
        const element = document.createElement('div') as HTMLDivElement;
        element.id = `youtube_${videoId}`;
        ReactDOM.render(dom, element);
        const object = new Element3DObject(element);
        object.scale.set(0.3, 0.3, 0.3);
        object.position.copy(vec);
        object.rotation.copy(euler);
        return object;
    };

    makeGui = () => {};

    datgui: dat.GUI | null = null;
    makeStaticGui = () => {
        // super.makeGui();
        // const gui = new GUIVR.create('OrbitControls');
        // if (this.datgui)
        return;
        this.datgui = new dat.GUI();
        //GUIVR.enableMouse(this.camera);
        //gui.position.set(0, 20, 0);
        //gui.scale.set(30, 30, 30);
        // gui.visible = this.state.visibleGui || false;
        //this.scene.add(gui);

        const videoId = 'v1fSB6C_Ps4';
        this.datgui
            .add(this.hierarchy[`youtube_${videoId}`][0].position, 'x', -300, 300)
            .step(0.01)
            .name('Camera Position X')
            .listen();
        this.datgui
            .add(this.hierarchy[`youtube_${videoId}`][0].position, 'y', -300, 300)
            .step(0.01)
            .name('Camera Position Y')
            .listen();
        this.datgui
            .add(this.hierarchy[`youtube_${videoId}`][0].position, 'z', -300, 300)
            .step(0.01)
            .name('Camera Position Z')
            .listen();
        this.datgui
            .add(this.hierarchy[`youtube_${videoId}`][0].rotation, 'x', -Math.PI, Math.PI)
            .step(0.01)
            .name('Camera Rotation X')
            .listen();
        this.datgui
            .add(this.hierarchy[`youtube_${videoId}`][0].rotation, 'y', -Math.PI, Math.PI)
            .step(0.01)
            .name('Camera Rotation Y')
            .listen();
        this.datgui
            .add(this.hierarchy[`youtube_${videoId}`][0].rotation, 'z', -Math.PI, Math.PI)
            .step(0.01)
            .name('Camera Rotation Z')
            .listen();
    };
}
