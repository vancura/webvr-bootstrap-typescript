class App {


    private static _instance: App = new App();

    private _scene: MyScene;
    private _camera: THREE.PerspectiveCamera;

    private renderer: THREE.WebGLRenderer;
    private controls: THREE.VRControls;
    private effect: THREE.VREffect;
    private lastRender: number;
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

        // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit
        // Only enable it if you actually need to
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

        // Append the canvas element created by the renderer to document body element
        // noinspection XHTMLIncompatabilitiesJS
        document.body.appendChild(this.renderer.domElement);

        this._scene = new MyScene();
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

        // Apply VR headset positional data to camera
        this.controls = new THREE.VRControls(this.camera);

        // Apply VR stereo rendering to renderer
        this.effect = new THREE.VREffect(this.renderer);
        this.effect.setSize(window.innerWidth, window.innerHeight);

        // Get the VRDisplay and save it for later
        this.vrDisplay = null;
        if (navigator.getVRDisplays) {
            navigator.getVRDisplays().then((displays) => {
                if (displays.length > 0) {
                    this.vrDisplay = displays[0];
                }
            });
        }

        // Request animation frame loop function
        this.lastRender = 0;

        // Resize the WebGL canvas when we resize and also when we change modes
        window.addEventListener("resize", this.onResize);
        window.addEventListener("vrdisplaypresentchange", this.onVRDisplayPresentChange);
        document.addEventListener("touchmove", (e) => {
            e.preventDefault();
        });

        // Button click handlers
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

        // Kick off animation loop
        requestAnimationFrame(this.animate);
    }


    /**
     * Animation.
     * @param timestamp Timestamp
     */
    private animate = (timestamp: number): void => {
        var delta: number = Math.min(timestamp - this.lastRender, 500);
        this.lastRender = timestamp;

        // Animate the scene
        this._scene.animate(delta);

        // Update VR headset position and apply to camera
        this.controls.update();

        // Render the scene
        this.effect.render(this._scene, this._camera);

        // Keep looping
        requestAnimationFrame(this.animate);
    };


    /**
     * Resize handler.
     */
    private onResize = (): void => {
        console.log("Resizing to %s x %s.", window.innerWidth, window.innerHeight);

        this.effect.setSize(window.innerWidth, window.innerHeight);
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
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


    // GETTERS & SETTERS
    // -----------------


    get camera(): THREE.PerspectiveCamera {
        return this._camera;
    }


    get scene(): THREE.Scene {
        return this._scene;
    }


}
