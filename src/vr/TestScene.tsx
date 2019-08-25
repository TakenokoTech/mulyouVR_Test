import React from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import WebVRPolyfill from 'webvr-polyfill';
import { WEBVR } from '../utils/WebVR';
import { StoreState } from '../store/types';
import { resolve } from 'dns';
import { getVRDisplays } from '../extension';
import BaseThreeScene, { BaseThreeSceneProps, BaseThreeSceneState } from './BaseThreeScene';

interface TestSceneProps extends BaseThreeSceneProps {}
interface TestSceneState extends BaseThreeSceneState {}

export default class TestScene extends BaseThreeScene<TestSceneProps, TestSceneState> {
    constructor(props: TestSceneProps) {
        super(props);
        this.state = { VRDisplays: [] };
    }

    componentDidMount() {
        super.componentDidMount();
    }

    shouldComponentUpdate(nextProps: TestSceneProps, nextState: TestSceneState, nextContext: any) {
        const s = super.shouldComponentUpdate(nextProps, nextState, nextContext);
        console.log(nextProps, nextState);
        return s;
    }

    protected update = () => {
        const length = this.hierarchy.boxList.length;
        for (let i = 0; i < length; i++) {
            this.hierarchy.boxList[i].position.y = 125 + 100 * Math.cos(this.time * 0.0005 * i + i / 10);
        }
        this.controls && this.controls.update();
        this.renderer.render(this.scene, this.camera);
    };

    protected setupObj = () => {
        // 光源を作成
        {
            const spotLight = new THREE.SpotLight(0xffffff, 4, 2000, Math.PI / 5, 0.2, 1.5);
            spotLight.position.set(500, 300, 500);
            this.scene.add(spotLight);
        }
        {
            const ambientLight = new THREE.AmbientLight(0x333333);
            this.scene.add(ambientLight);
        }
        // 地面を作成
        {
            // 床のテクスチャー
            const texture = new THREE.TextureLoader().load('imgs/floor.png');
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping; // リピート可能に
            texture.repeat.set(10, 10); // 10x10マスに設定
            texture.magFilter = THREE.NearestFilter;
            const floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshStandardMaterial({ map: texture, roughness: 0.0, metalness: 0.6 }));
            floor.rotation.x = -Math.PI / 2;
            this.scene.add(floor);
        }
        const boxList = [];
        // 立方体を作成
        {
            // 立方体のジオメトリを作成
            const geometry = new THREE.BoxGeometry(45, 45, 45);
            // 立方体を複数作成しランダムに配置
            const num = 60;
            loop: for (let i = 0; i < num; i++) {
                const px = Math.round((Math.random() - 0.5) * 19) * 50 + 25;
                const pz = Math.round((Math.random() - 0.5) * 19) * 50 + 25;
                for (let j = 0; j < i; j++) {
                    const box2 = boxList[j];
                    if (box2.position.x === px && box2.position.z === pz) {
                        i -= 1;
                        continue loop;
                    }
                }
                // 立方体のマテリアルを作成
                const material = new THREE.MeshStandardMaterial({ color: 0x1000000 * Math.random(), roughness: 0.1, metalness: 0.5 });
                const box = new THREE.Mesh(geometry, material);
                box.position.x = px;
                box.position.y = 25;
                box.position.z = pz;
                this.scene.add(box);
                boxList.push(box);
            }
        }
        this.hierarchy.boxList = boxList;
    };
}
