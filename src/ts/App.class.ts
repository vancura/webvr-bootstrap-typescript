class App {


    private static _instance: App = new App();

    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private controls: THREE.VRControls;
    private effect: THREE.VREffect;
    private lastRender: number;
    private cube: THREE.Mesh;
    private vrDisplay: any;


    // SINGLETON MANAGEMENT
    // --------------------


    public static getInstance(): App {
        return App._instance;
    }


    constructor() {
        if (App._instance)
            throw new Error("Error: Instantiation failed: Use App.getInstance() instead of new");

        App._instance = this;
    }


    /**
     * Initialization.
     */
    init(): void {
        console.log("TypeScript WebVR Bootstrap version %VERSION%");

        // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
        // Only enable it if you actually need to.
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

        // Append the canvas element created by the renderer to document body element.
        // noinspection XHTMLIncompatabilitiesJS
        document.body.appendChild(this.renderer.domElement);

        // Create a three.js scene.
        this.scene = new THREE.Scene();

        // Create a three.js camera.
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

        // Apply VR headset positional data to camera.
        this.controls = new THREE.VRControls(this.camera);

        // Apply VR stereo rendering to renderer.
        this.effect = new THREE.VREffect(this.renderer);
        this.effect.setSize(window.innerWidth, window.innerHeight);

        // Add a repeating grid as a skybox.
        var boxWidth: number = 5;
        var loader: THREE.TextureLoader = new THREE.TextureLoader();
        loader.load("assets/box.png", (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(boxWidth, boxWidth);

            var geometry: THREE.BoxGeometry = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
            var material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
                color: 0x01BE00,
                map: texture,
                side: THREE.BackSide,
            });

            var skybox: THREE.Mesh = new THREE.Mesh(geometry, material);
            this.scene.add(skybox);
        });

        // Get the VRDisplay and save it for later.
        this.vrDisplay = null;
        if(navigator.getVRDisplays) {
            navigator.getVRDisplays().then((displays) => {
                if (displays.length > 0) {
                    this.vrDisplay = displays[0];
                }
            });
        }

        // Create 3D objects.
        var geometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        var material: THREE.MeshNormalMaterial = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh(geometry, material);

        // Position cube mesh
        this.cube.position.z = -1;

        // Add cube mesh to your three.js scene
        this.scene.add(this.cube);

        // Request animation frame loop function
        this.lastRender = 0;

        // Resize the WebGL canvas when we resize and also when we change modes.
        window.addEventListener("resize", this.onResize);
        window.addEventListener("vrdisplaypresentchange", this.onVRDisplayPresentChange);
        document.addEventListener("touchmove", (e) => {
            e.preventDefault();
        });

        // Button click handlers.
        document.querySelector("button#fullscreen").addEventListener("click", () => {
            this.onEnterFullscreen(this.renderer.domElement);
        });

        document.querySelector("button#vr").addEventListener("click", () => {
            this.vrDisplay.requestPresent([{
                source: this.renderer.domElement,
            }]);
        });

        document.querySelector("button#reset").addEventListener("click", () => {
            this.vrDisplay.resetPose();
        });

        // Kick off animation loop.
        requestAnimationFrame(this.animate);
    }


    /**
     * Animation.
     * @param timestamp Timestamp
     */
    private animate = (timestamp: number): void => {
        var delta: number = Math.min(timestamp - this.lastRender, 500);
        this.lastRender = timestamp;

        // Apply rotation to cube mesh
        this.cube.rotation.y += delta * 0.0002;

        // Update VR headset position and apply to camera.
        this.controls.update();

        // Render the scene.
        this.effect.render(this.scene, this.camera);

        // Keep looping.
        requestAnimationFrame(this.animate);
    };


    /**
     * Resize handler.
     */
    private onResize = (): void => {
        console.log("Resizing to %s x %s.", window.innerWidth, window.innerHeight);

        this.effect.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    };


    /**
     * Display presentation change.
     */
    private onVRDisplayPresentChange = (): void => {
        console.log("onVRDisplayPresentChange");

        this.onResize();
    };


    /**
     * Enter fullscreen handler.
     * @param el Element
     */
    private onEnterFullscreen = (el: any): void => {
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }
    };


}
