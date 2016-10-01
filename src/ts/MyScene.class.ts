///<reference path="./ColladaLoader.d.ts"/>


class MyScene extends THREE.Scene {


    private cube: THREE.Mesh;


    /**
     * Constructor.
     */
    constructor() {
        super();

        let boxSize: number = 20;
        let loader: THREE.TextureLoader = new THREE.TextureLoader();

        // Create the skybox
        loader.load("assets/box.png", (texture) => {
            let geometry: THREE.BoxGeometry;
            let material: THREE.MeshBasicMaterial;
            let skybox: THREE.Mesh;

            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(boxSize, boxSize);

            geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
            material = new THREE.MeshBasicMaterial({ color: 0x01BE00, map: texture, side: THREE.BackSide });
            skybox = new THREE.Mesh(geometry, material);

            this.add(skybox);
        });

        this.createWorld();
        this.createModel();
    }


    /**
     * Animate.
     * @param delta Time delta
     */
    animate(delta: number): void {
        this.cube.rotation.y += delta * 0.0002;
    }


    // PRIVATE
    // -------


    /**
     * Create the world.
     */
    private createWorld(): void {
        let geometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        let material: THREE.MeshNormalMaterial = new THREE.MeshNormalMaterial();

        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.z = -1;

        // this.add(this.cube);

        // Lights
        this.add(new THREE.AmbientLight(0xcccccc));
        let directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xeeeeee);
        directionalLight.position.x = Math.random() - 0.5;
        directionalLight.position.y = Math.random();
        directionalLight.position.z = Math.random() - 0.5;
        directionalLight.position.normalize();
        this.add(directionalLight);
    }


    /**
     * Create model.
     */
    private createModel(): void {
        let loader: THREE.ColladaLoader = new THREE.ColladaLoader();

        loader.load("assets/deer.dae", (object: any) => {
            // object.scale.multiplyScalar(0.1);

            let x: any = this.add(object.scene);
            let y: THREE.Texture = x.children[2].children[0].children[0].material.map;

            y.magFilter = THREE.NearestFilter;
            y.minFilter = THREE.NearestFilter;
        }, this.onProgress);
    }


    private onProgress = (xhr: any): void => {
        if (xhr.lengthComputable) {
            let percentComplete: number = xhr.loaded / xhr.total * 100;
            console.log(percentComplete + "% downloaded");
        }
    };


}
