///<reference path="./ColladaLoader.d.ts"/>


class MyScene extends THREE.Scene {


    private cube: THREE.Mesh;


    /**
     * Constructor.
     */
    constructor() {
        super();

        var boxSize: number = 20;
        var loader: THREE.TextureLoader = new THREE.TextureLoader();

        // Create the skybox
        loader.load("assets/box.png", (texture) => {
            var geometry: THREE.BoxGeometry;
            var material: THREE.MeshBasicMaterial;
            var skybox: THREE.Mesh;

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
        var geometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        var material: THREE.MeshNormalMaterial = new THREE.MeshNormalMaterial();

        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.z = -1;

        // this.add(this.cube);

        // Lights
        this.add(new THREE.AmbientLight(0xcccccc));
        var directionalLight:THREE.DirectionalLight = new THREE.DirectionalLight(0xeeeeee);
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
        // var loader: THREE.ColladaLoader = new THREE.ColladaLoader();
        var loader: THREE.AssimpJSONLoader = new THREE.AssimpJSONLoader();

        loader.load("assets/deer.json", this.onLoaded, this.onProgress, this.onError);
    }


    private onError = (xhr: any): void => {
        console.error("ERROR");
    };


    private onProgress = (xhr: any): void => {
        if (xhr.lengthComputable) {
            var percentComplete: number = xhr.loaded / xhr.total * 100;
            console.log(percentComplete + "% downloaded");
        }
    };


    private onLoaded = (object: THREE.Object3D): void => {
        object.scale.multiplyScalar(0.1);
        console.log(object);
        this.add(object);
    };


}
