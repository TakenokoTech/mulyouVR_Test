import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';

const svgMap: { [key: string]: HTMLElement } = {};

interface BaseSvgProps {
    color: string;
    image: HTMLImageElement;
}

interface BaseSvgState {}

export default class BaseSvgComponent extends React.Component<BaseSvgProps, BaseSvgState> {
    componentDidMount() {
        console.log('componentDidMount');
        this.onLoad();
    }

    componentDidUpdate?(nextProps: BaseSvgProps, nextState: BaseSvgState, nextContext: any) {
        this.onLoad();
        return true;
    }

    onLoad() {
        const svg = (this.refs.svg as Element).innerHTML;
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
            var canvas = document.createElement('canvas') as HTMLCanvasElement;
            var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            var image = new Image();
            image.onload = () => {
                ctx.drawImage(image, 0, 0);
                resolve({ el: canvas, uri: image.src });
            };
            if (!svgMap[id]) {
                const element = document.getElementById('temp') as Element;
                const children = document.createElement('div');
                children.id = id;
                ReactDOM.render(<this image={image} color="#F00" {...option} />, element.appendChild(children));
                svgMap[id] = children;
            } else {
                const element = document.getElementById('temp') as Element;
                ReactDOM.render(<this image={image} color={`#FF0`} {...option} />, element.appendChild(svgMap[id]));
                /*
                const iframe = svgMap[id].getElementsByTagName('svg')[0].getElementById('iframe') as HTMLIFrameElement;
                try {
                    const svg = iframe.ownerDocument.getElementById('inframe').innerHTML;
                    const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
                    image.src = uri;
                    console.log(uri);
                    // const ownerDocument = iframe.contentWindow.document.body;
                    // console.log(iframe.contentWindow.document);
                } catch (e) {}
                */
            }
        });
    }

    public static async canvasToTexture(key: string): Promise<THREE.Texture> {
        return Promise.resolve(new THREE.TextureLoader().load((await this.makeSVG(key)).uri));
    }

    public static async makeTexture(key: string): Promise<THREE.Texture> {
        const texture = new THREE.Texture((await this.makeSVG(key)).el);
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
