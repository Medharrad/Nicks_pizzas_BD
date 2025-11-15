import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Story } from './story.js';
import { Cake } from './cake.js';
import { Candles } from './candles.js';
import { Audio } from './audio.js';
import { Celebration } from './celebration.js';

class BirthdayCakeApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.cake = null;
        this.candles = null;
        this.audio = null;
        this.celebration = null;
        this.story = null;
        
        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 3, 8);
        this.camera.lookAt(0, 2, 0);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // Setup OrbitControls for 3D interaction
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 15;
        this.controls.maxPolarAngle = Math.PI / 1.5;
        this.controls.target.set(0, 2, 0);

        // Add lights
        this.setupLights();

        // Initialize components
        this.cake = new Cake(this.scene);
        this.candles = new Candles(this.scene, this.cake.position);
        this.audio = new Audio();
        this.celebration = new Celebration(this.scene, this.camera);
        this.story = new Story(() => this.onStoryComplete());

        // Start story sequence
        this.story.start();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Animation loop
        this.animate();
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        // Main directional light
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(5, 10, 5);
        dirLight.castShadow = true;
        dirLight.shadow.camera.left = -10;
        dirLight.shadow.camera.right = 10;
        dirLight.shadow.camera.top = 10;
        dirLight.shadow.camera.bottom = -10;
        this.scene.add(dirLight);

        // Soft fill light
        const fillLight = new THREE.DirectionalLight(0x764ba2, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // Spotlight for dramatic effect
        const spotLight = new THREE.SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 10, 0);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.3;
        spotLight.castShadow = true;
        this.scene.add(spotLight);
    }

    onStoryComplete() {
        // Story finished, show microphone permission
        this.audio.requestMicrophonePermission((hasPermission) => {
            if (hasPermission) {
                // Show blow instruction
                document.getElementById('blow-instruction').classList.remove('hidden');
                
                // Start monitoring microphone
                this.audio.onBlow(() => this.handleBlow());
            } else {
                // Show blow button as fallback
                document.getElementById('blow-button-container').classList.remove('hidden');
            }
            
            // Setup blow button click handler
            document.getElementById('blow-button').addEventListener('click', () => {
                this.handleBlow();
            });
            
            // Setup music control buttons
            document.getElementById('stop-music').addEventListener('click', () => {
                this.audio.stop();
                document.getElementById('music-controls').classList.add('hidden');
            });
            
            document.getElementById('repeat-experience').addEventListener('click', () => {
                window.location.reload();
            });
            
            // Start music and show controls
            this.audio.playMusic();
            document.getElementById('music-controls').classList.remove('hidden');
        });
    }

    handleBlow() {
        // Extinguish one candle
        const allOut = this.candles.extinguishNext();
        
        if (allOut) {
            // All candles are out - trigger celebration!
            document.getElementById('blow-instruction').classList.add('hidden');
            document.getElementById('blow-button-container').classList.add('hidden');
            this.celebration.start();
            
            // Show celebration message
            const celebMsg = document.getElementById('celebration-message');
            celebMsg.classList.add('show');
            
            // Show repeat button after 3 seconds
            setTimeout(() => {
                document.getElementById('repeat-button-container').classList.remove('hidden');
            }, 3000);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Auto-rotate cake slowly
        if (this.cake && this.cake.group) {
            this.cake.group.rotation.y += 0.003;
        }

        // Update components
        const delta = 0.016; // Approximate 60fps
        this.candles.update(delta);
        this.celebration.update(delta);
        
        // Update blow meter visualization
        if (this.audio.isMonitoring) {
            const volume = this.audio.getCurrentVolume();
            const blowLevel = document.getElementById('blow-level');
            if (blowLevel) {
                blowLevel.style.width = `${Math.min(volume * 100, 100)}%`;
            }
        }

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Start the application
new BirthdayCakeApp();
