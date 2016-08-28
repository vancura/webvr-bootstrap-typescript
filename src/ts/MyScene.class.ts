class MyScene extends THREE.Scene {


    private cube: THREE.Mesh;


    /**
     * Constructor.
     */
    constructor() {
        var boxSize: number = 20;
        var loader: THREE.TextureLoader = new THREE.TextureLoader();

        super();

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

        this.add(this.cube);
    }


}
