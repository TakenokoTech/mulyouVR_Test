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
            const allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
            const dom = (
                <div style={{ width: 1920 / 2 + 'px', textAlign: 'center' }}>
                    <iframe width={1920 / 4} height={1080 / 4} src="https://www.youtube.com/embed/Wtn7RqAH5S8" allow={allow} />
                    <iframe width={1920 / 4} height={1080 / 4} src="https://www.youtube.com/embed/Wtn7RqAH5S8" allow={allow} />
                </div>
            );
            var element = document.createElement('div') as HTMLDivElement;
            element.id = '__youtube';
            ReactDOM.render(dom, element);
            const object = new Element3DObject(element);
            object.scale.set(0.3, 0.3, 0.3);
            object.position.copy(new THREE.Vector3(0, 0, -300));
            this.scene.add(object);
        }
        {
            const allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
            const dom = (
                <div style={{ width: 1920 / 2 + 'px', textAlign: 'center' }}>
                    <iframe width={1920 / 4} height={1080 / 4} src="https://www.youtube.com/embed/Wtn7RqAH5S8" allow={allow} />
                    <iframe width={1920 / 4} height={1080 / 4} src="https://www.youtube.com/embed/Wtn7RqAH5S8" allow={allow} />
                </div>
            );
            var element = document.createElement('div') as HTMLDivElement;
            element.id = '__youtube1';
            ReactDOM.render(dom, element);
            const object = new Element3DObject(element);
            object.scale.set(0.3, 0.3, 0.3);
            object.position.copy(new THREE.Vector3(250, 0, -200));
            object.rotation.copy(new THREE.Euler(0, -45 * THREE.Math.DEG2RAD, 0));
            this.scene.add(object);
            this.hierarchy[element.id] = [object];
        }
    };

    /*
    makeGui = () => {
        // super.makeGui();
        const gui = new GUIVR.create('OrbitControls');
        GUIVR.enableMouse(this.camera);
        gui.position.set(0, 20, 0);
        gui.scale.set(30, 30, 30);
        // gui.visible = this.state.visibleGui || false;
        this.scene.add(gui);
        gui.add(this.hierarchy['__youtube1'][0].position, 'x', -300, 300)
            .step(0.01)
            .name('Camera Position X')
            .listen();
        gui.add(this.hierarchy['__youtube1'][0].position, 'y', -300, 300)
            .step(0.01)
            .name('Camera Position Y')
            .listen();
        gui.add(this.hierarchy['__youtube1'][0].position, 'z', -300, 300)
            .step(0.01)
            .name('Camera Position Z')
            .listen();
        gui.add(this.hierarchy['__youtube1'][0].rotation, 'x', -Math.PI, Math.PI)
            .step(0.01)
            .name('Camera Rotation X')
            .listen();
        gui.add(this.hierarchy['__youtube1'][0].rotation, 'y', -Math.PI, Math.PI)
            .step(0.01)
            .name('Camera Rotation Y')
            .listen();
        gui.add(this.hierarchy['__youtube1'][0].rotation, 'z', -Math.PI, Math.PI)
            .step(0.01)
            .name('Camera Rotation Z')
            .listen();
    };
    */
}
