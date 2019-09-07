import { ReactInstance } from 'react';
import {
    Camera, Matrix4, Object3D, OrthographicCamera, PerspectiveCamera, Renderer, REVISION, Scene,
    WebGLRenderer, WebGLRendererParameters
} from 'three';

import { epsilon } from '../../extension';

export class Element3DObject extends Object3D {
    element: Element;
    constructor(element: Element) {
        super();
        this.element = element;
        this.element.style.position = 'absolute';
        this.addEventListener('removed', () => {
            if (this.element.parentNode !== null) {
                this.element.parentNode.removeChild(this.element);
            }
        });
    }
}

export class Element3DSprite extends Element3DObject {
    constructor(element: Element) {
        super(element);
    }
}

export class CustomWebGLRenderer extends WebGLRenderer implements Renderer {
    _width: number = 0;
    _height: number = 0;
    cache = { camera: { fov: 0, style: '' }, objects: new WeakMap() };
    matrix = new Matrix4();
    _cameraElement: HTMLDivElement = document.createElement('div');
    _divElement: HTMLDivElement = document.createElement('div');

    private get _widthHalf() {
        return this._width / 2;
    }

    private get _heightHalf() {
        return this._height / 2;
    }

    customSetSize(width: number, height: number, divElement: HTMLDivElement, cameraElement: HTMLDivElement) {
        this._width = width;
        this._height = height;
        this._divElement = divElement;
        this._cameraElement = cameraElement;
        this._divElement.style.width = width + 'px';
        this._divElement.style.height = height + 'px';
        this._cameraElement.style.width = width + 'px';
        this._cameraElement.style.height = height + 'px';
    }

    customRender = (scene: Scene, camera: PerspectiveCamera | OrthographicCamera) => {
        this.render(scene, camera);

        var fov = camera.projectionMatrix.elements[5] * this._heightHalf;
        if (this.cache.camera.fov !== fov) {
            if (camera instanceof PerspectiveCamera) {
                this._divElement.style.webkitPerspective = fov + 'px';
                this._divElement.style.perspective = fov + 'px';
            }
            this.cache.camera.fov = fov;
        }
        scene.updateMatrixWorld();
        if (camera.parent === null) camera.updateMatrixWorld();

        const cameraCSSMatrix = ((): string => {
            if (camera instanceof OrthographicCamera) {
                const tx = -(camera.right + camera.left) / 2;
                const ty = (camera.top + camera.bottom) / 2;
                return `scale(${fov})` + 'translate(' + epsilon(tx) + 'px,' + epsilon(ty) + 'px)' + this.getCameraCSSMatrix(camera.matrixWorldInverse);
            } else {
                return 'translateZ(' + fov + 'px) ' + this.getCameraCSSMatrix(camera.matrixWorldInverse);
            }
        })();

        const style = cameraCSSMatrix + 'translate(' + this._widthHalf + 'px,' + this._heightHalf + 'px)';
        if (this.cache.camera.style !== style) {
            // cameraElement.style.webkitTransform = style;
            this._cameraElement.style.transform = style;
            this.cache.camera.style = style;
        }
        this.renderObject(scene, camera);
    };

    getCameraCSSMatrix = (matrix: Matrix4) => {
        var elements = matrix.elements;
        return (
            'matrix3d(' +
            `${epsilon(+elements[0])},` +
            `${epsilon(-elements[1])},` +
            `${epsilon(+elements[2])},` +
            `${epsilon(+elements[3])},` +
            `${epsilon(+elements[4])},` +
            `${epsilon(-elements[5])},` +
            `${epsilon(+elements[6])},` +
            `${epsilon(+elements[7])},` +
            `${epsilon(+elements[8])},` +
            `${epsilon(-elements[9])},` +
            `${epsilon(+elements[10])},` +
            `${epsilon(+elements[11])},` +
            `${epsilon(+elements[12])},` +
            `${epsilon(-elements[13])},` +
            `${epsilon(+elements[14])},` +
            `${epsilon(+elements[15])}` +
            ')'
        );
    };

    getObjectCSSMatrix = (matrix: Matrix4) => {
        var elements = matrix.elements;
        var matrix3d =
            'matrix3d(' +
            `${epsilon(+elements[0])},` +
            `${epsilon(+elements[1])},` +
            `${epsilon(+elements[2])},` +
            `${epsilon(+elements[3])},` +
            `${epsilon(-elements[4])},` +
            `${epsilon(-elements[5])},` +
            `${epsilon(-elements[6])},` +
            `${epsilon(-elements[7])},` +
            `${epsilon(+elements[8])},` +
            `${epsilon(+elements[9])},` +
            `${epsilon(+elements[10])},` +
            `${epsilon(+elements[11])},` +
            `${epsilon(+elements[12])},` +
            `${epsilon(+elements[13])},` +
            `${epsilon(+elements[14])},` +
            `${epsilon(+elements[15])}` +
            ')';
        return 'translate(-50%,-50%)' + matrix3d;
    };

    renderObject = (object: Object3D, camera: Camera) => {
        const matrix = this.matrix;
        if (object instanceof Element3DObject) {
            const style = (() => {
                if (object instanceof Element3DSprite) {
                    matrix.copy(camera.matrixWorldInverse);
                    matrix.transpose();
                    matrix.copyPosition(object.matrixWorld);
                    matrix.scale(object.scale);
                    matrix.elements[3] = 0;
                    matrix.elements[7] = 0;
                    matrix.elements[11] = 0;
                    matrix.elements[15] = 1;
                    return this.getObjectCSSMatrix(matrix);
                } else {
                    return this.getObjectCSSMatrix(object.matrixWorld);
                }
            })();
            const element = object.element;
            const cachedObject = this.cache.objects.get(object);
            if (cachedObject === undefined || cachedObject.style !== style) {
                element.style.WebkitTransform = style;
                element.style.transform = style;
                this.cache.objects.set(object, { style: style });
            }
            if (!this._cameraElement.querySelector(`#${element.id}`)) {
                this._cameraElement.appendChild(element);
            }
        }
        for (var i = 0, l = object.children.length; i < l; i++) {
            this.renderObject(object.children[i], camera);
        }
    };
}
