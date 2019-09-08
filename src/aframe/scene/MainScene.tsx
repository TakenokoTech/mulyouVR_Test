import 'aframe';
import 'aframe-html-shader';
import 'aframe-particle-system-component';
import 'aframe-physics-components';
import 'aframe-physics-system';

import { Entity, Scene } from 'aframe-react';
import React from 'react';

import BoxCompornent from '../../components/BoxCompornent';
import HTMLCompornent from '../../components/HTMLComponent';
import { StoreState } from '../../store/types';

interface MainSceneProps {
    id: string;
    store: StoreState;
    resize: () => void;
}

interface MainSceneState {
    html: boolean;
}

export default class MainScene extends React.Component<MainSceneProps, MainSceneState> {
    constructor(props: MainSceneProps) {
        super(props);
        this.state = { ...super.state };
        this.state = { html: false };
    }

    componentDidMount() {
        window.addEventListener('resize', this.props.resize);
        console.log(this.refs.scene.el);
        this.setState({ html: true });
    }

    shouldComponentUpdate(nextProps: MainSceneProps, nextState: MainSceneState, nextContext: any) {
        console.log(nextProps, nextState);

        const prev = this.props.store.screenSize;
        const next = nextProps.store.screenSize;
        if (prev.x != next.x || prev.y != next.y) {
            this.onCreate();
        }

        return true;
    }

    render() {
        return (
            <>
                <Scene ref="scene" id="scene" physics="debug: false">
                    {/* <Scene ref="scene" id="scene" physics="debug: false" stats> */}
                    {/* <BoxCompornent id="____" click={() => {}} /> */}
                    {this.state.html ? <HTMLCompornent id="_____" target="htmlElement" click={() => {}} /> : null}
                </Scene>
                <div
                    style={{ width: '100%', height: '100%', position: 'fixed', left: '0', top: '0', overflow: 'hidden', backgroundColor: '#FFF', zIndex: -1 }}
                />
                <div
                    style={{ width: '100%', height: '120px', position: 'fixed', left: '0', top: '0', overflow: 'hidden', backgroundColor: '#FFF', zIndex: -2 }}
                >
                    <div id="htmlElement" style={{ background: '#F8F8F8', color: '#333', fontSize: '48px', padding: '16px' }}>
                        Hello, HTML!　
                        {/* <iframe id="htmlElement" height="80" src="https://www.youtube.com/embed/4JD8AeI_0Uo?autoplay=1"></iframe> */}
                    </div>
                </div>
            </>
        );
    }

    protected onUpdate = () => {};

    protected onCreate = () => {};
}
