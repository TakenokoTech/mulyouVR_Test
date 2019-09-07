import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';

const svgMap: { [key: string]: HTMLElement } = {};

export interface BaseSvgProps {
    color: string;
    image: HTMLImageElement;
}

export interface BaseSvgState {}

export default abstract class BaseSvgComponent<P extends BaseSvgProps, S extends BaseSvgState> extends React.Component<P, S> {
    componentDidMount() {
        this.onLoad();
    }

    componentDidUpdate?(nextProps: P, nextState: S, nextContext: any) {
        // console.log(this.state, this.props);
        this.onLoad();
        return true;
    }

    onLoad(intercept: (() => string) | null = null) {
        const svg = intercept ? intercept() : (this.refs.svg as Element).innerHTML;
        const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        this.props.image.src = uri;
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
                        ></div>
                        {/* <iframe
                            id="iframe"
                            xmlns="http://www.w3.org/1999/xhtml"
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/VdI6EiDuKfs"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
                            frameBorder="0"
                        ></iframe> */}
                    </foreignObject>
                </svg>
            </div>
        );
    }

    public static makeSVG(key: string, option: any = {}): Promise<{ el: HTMLCanvasElement; uri: string }> {
        return new Promise(resolve => {
            const id = `svg__${key}`;
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas') as HTMLCanvasElement;
                (canvas.getContext('2d') as CanvasRenderingContext2D).drawImage(image, 0, 0);
                resolve({ el: canvas, uri: image.src });
            };
            if (!svgMap[id]) {
                const children = document.createElement('div');
                children.id = id;
                svgMap[id] = children;
                const element = document.getElementById('temp') as Element;
                ReactDOM.render(<this image={image} color={`#F00`} {...option} />, element.appendChild(svgMap[id]));
            } else {
                const element = document.getElementById('temp') as Element;
                ReactDOM.render(<this image={image} color={`#FF0`} {...option} />, element.appendChild(svgMap[id]));
            }
        });
    }

    public static async canvasToTexture(key: string, option: any = {}): Promise<THREE.Texture> {
        return Promise.resolve(new THREE.TextureLoader().load((await this.makeSVG(key, option)).uri));
    }

    public static async makeTexture(key: string, option: any = {}): Promise<THREE.Texture> {
        const texture = new THREE.Texture((await this.makeSVG(key, option)).el);
        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        return Promise.resolve(texture);
    }
}

const makeSVGurl = (): string => {
    var canvas = document.createElement('canvas') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    var data =
        '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000">' +
        '<foreignObject width="100%" height="100%">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:72px;font-family:Pangolin;background-color:#F00;width:1000px;height:1000px;">' +
        'test' +
        '</div>' +
        '</foreignObject>' +
        '</svg>';
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(data)}`;
    return url;
};
