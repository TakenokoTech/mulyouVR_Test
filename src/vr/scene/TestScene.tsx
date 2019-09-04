import * as THREE from 'three';

import BaseThreeScene, { BaseThreeSceneProps, BaseThreeSceneState } from './BaseThreeScene';

interface TestSceneProps extends BaseThreeSceneProps {}
interface TestSceneState extends BaseThreeSceneState {}

export default class TestScene extends BaseThreeScene<TestSceneProps, TestSceneState> {
    constructor(props: TestSceneProps) {
        super(props);
        this.state = { ...super.state };
    }

    componentDidMount() {
        super.componentDidMount();
    }

    shouldComponentUpdate(nextProps: TestSceneProps, nextState: TestSceneState, nextContext: any) {
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
        const length = this.hierarchy.boxList.length;
        for (let i = 0; i < length; i++) {
            this.hierarchy.boxList[i].position.y = 125 + 100 * Math.cos(this.time * 0.0005 * i + i / 10);
        }
        this.controls && this.controls.update();
        this.renderer.render(this.scene, this.camera);
    };

    protected onCreate = () => {
        {
            this.scene.add(new THREE.AxesHelper(30));
            this.scene.add(new THREE.GridHelper(1000, 100));
        }
        // 光源を作成
        {
            const spotLight = new THREE.SpotLight(0xffffff, 4, 2000, Math.PI / 5, 0.2, 1.5);
            spotLight.position.set(0, 1000, 200);
            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 2048;
            spotLight.shadow.mapSize.height = 2048;
            this.scene.add(spotLight);
        }
        {
            const ambientLight = new THREE.AmbientLight(0x333333);
            // ambientLight.castShadow = true;
            this.scene.add(ambientLight);
        }
        // 地面を作成
        {
            // 床のテクスチャー
            //const texture = new THREE.TextureLoader().load('imgs/floor.png');
            //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            //texture.repeat.set(10, 10);
            //texture.magFilter = THREE.NearestFilter;
            //const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.0, metalness: 0.6 });
            const floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshStandardMaterial());
            floor.rotation.x = -Math.PI / 2;
            floor.castShadow = true;
            floor.receiveShadow = true;
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
                const px = Math.round((Math.random() - 0.5) * 19) * 30 + 25;
                const pz = Math.round((Math.random() - 0.5) * 19) * 30 + 25;
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
                box.castShadow = true;
                this.scene.add(box);
                boxList.push(box);
            }
        }
        {
            /*
            // 立方体
            const boxList = [];
            const geometry = new THREE.BoxGeometry(10, 10, 10);
            // const geometry = new THREE.PlaneGeometry(6.4, 3.2, 10, 10);
            const num = 9;
            for (let i = 0; i < num; i++) {
                for (let j = 0; j < num; j++) {
                    const material = new THREE.MeshStandardMaterial({ color: 0x1000000 * Math.random(), roughness: 0.1, metalness: 0.5 });
                    // const material = new THREE.MeshBasicMaterial({ map: new THREE.Texture(this.makeSVG()), transparent: true });
                    // const material = new THREE.MeshBasicMaterial({ color: 0x6699ff });
                    const box = new THREE.Mesh(geometry, material);
                    box.position.x = 50 * (j - num / 2);
                    box.position.y = 5;
                    box.position.z = 50 * (i - num / 2);
                    this.scene.add(box);
                    boxList.push(box);
                }
            }
            this.hierarchy.boxList = boxList;
            */
        }
        {
            /*
            var loader = new SVGLoader();
            loader.load(
                // this.makeSVGurl(),
                'http://localhost:8080/assets/tiger.svg',
                data => {
                    var group = new THREE.Group();
                    for (var i = 0; i < data.paths.length; i++) {
                        var path = data.paths[i];
                        var material = new THREE.MeshBasicMaterial({ color: path.color, side: THREE.DoubleSide, depthWrite: false });
                        var shapes = path.toShapes(true, null);
                        for (var j = 0; j < shapes.length; j++) {
                            var shape = shapes[j];
                            var geometry = new THREE.ShapeBufferGeometry(shape);
                            var mesh = new THREE.Mesh(geometry, material);
                            group.add(mesh);
                        }
                    }
                    group.scale.multiplyScalar(0.25);
                    // group.position.x = -70;
                    group.position.y = 20;
                    group.position.z = 10;
                    group.scale.y *= -1 * 0.1;
                    group.scale.x *= 0.1;
                    group.scale.z *= 0.1;
                    this.scene.add(group);
                },
            );
            */
        }
        {
            /*
            // 立方体
            const geometry = new THREE.BoxGeometry(10, 10, 10);
            // const geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
            const num = 4;
            this.hierarchy.boxList = [];
            asyncForeach(num, num, async (i, j) => {
                const name = `${i * 10 + j}`;
                const map = await BaseSvgComponent.makeTexture(name);
                const material = new THREE.MeshStandardMaterial({ map: map, side: THREE.DoubleSide, roughness: 0.1, metalness: 0.5 });
                //const material = new THREE.MeshBasicMaterial({ map: map, side: THREE.DoubleSide });
                const box = new THREE.Mesh(geometry, material);
                box.name = name;
                box.position.x = 20 * (j - num / 2);
                box.position.y = 5;
                box.position.z = 20 * (i - num / 2);
                this.scene.add(box);
                this.hierarchy.boxList.push(box);
            });
            */
        }
        {
            /*
            // 立方体
            const geometry = new THREE.BoxGeometry(10, 10, 10);
            // const geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
            const num = 4;
            this.hierarchy.boxList = [];
            asyncForeach(num, num, async (i, j) => {
                const name = `youtube_${i * 10 + j}`;
                const map = await YotubeSvgComponent.makeTexture(name, { videoId: 'aaaaaa' });
                const material = new THREE.MeshStandardMaterial({ map: map, side: THREE.DoubleSide, roughness: 0.1, metalness: 0.5 });
                //const material = new THREE.MeshBasicMaterial({ map: map, side: THREE.DoubleSide });
                const box = new THREE.Mesh(geometry, material);
                box.name = name;
                box.position.x = 20 * (j - num / 2);
                box.position.y = 5;
                box.position.z = 20 * (i - num / 2);
                this.scene.add(box);
                this.hierarchy.boxList.push(box);
            });
            */
        }
        {
            /*
            var element = document.createElement('div') as HTMLDivElement;
            element.id = 'sample';
            element.style.width = 10 + 'px';
            element.style.height = 10 + 'px';
            element.style.opacity = '0.75';
            element.style.background = 'chocolate';

            var object = new Element3DObject(element);
            object.position.copy(new THREE.Vector3(0, 0, 0));
            object.rotation.copy(new THREE.Euler(45 * THREE.Math.DEG2RAD, 45 * THREE.Math.DEG2RAD, 0));
            this.scene.add(object);
            */
        }
        this.hierarchy.boxList = boxList;
    };
}
