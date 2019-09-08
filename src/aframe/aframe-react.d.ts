declare module 'aframe-react' {
    const Entity: any;
    const Scene: any;
}

declare module JSX {
    interface IntrinsicElements {
        'a-scene': any;
        'a-entity': any;
        'a-assets': any;
        'a-asset-item': any;
        'a-gltf-model': any;
        'a-animation': any;
        'a-text': any;
    }
}
