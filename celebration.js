import * as THREE from 'three';

export class Celebration {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.confetti = [];
        this.fireworks = [];
        this.isActive = false;
        this.time = 0;
    }

    start() {
        this.isActive = true;
        this.createConfetti();
        this.scheduleFireworks();
    }

    createConfetti() {
        const confettiCount = 1000;
        const colors = [0xff1493, 0xffb3ba, 0xffd700, 0x00ff00, 0x00bfff, 0xff69b4];
        
        for (let i = 0; i < confettiCount; i++) {
            const geometry = new THREE.PlaneGeometry(0.1, 0.15);
            const material = new THREE.MeshBasicMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                side: THREE.DoubleSide
            });
            
            const confetto = new THREE.Mesh(geometry, material);
            
            // Start position (above camera view)
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 8;
            confetto.position.set(
                Math.cos(angle) * radius,
                8 + Math.random() * 5,
                Math.sin(angle) * radius
            );
            
            // Random rotation
            confetto.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            // Velocity and physics
            confetto.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    -Math.random() * 2 - 1,
                    (Math.random() - 0.5) * 2
                ),
                angularVelocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 5,
                    (Math.random() - 0.5) * 5,
                    (Math.random() - 0.5) * 5
                ),
                lifetime: 0
            };
            
            this.scene.add(confetto);
            this.confetti.push(confetto);
        }
    }

    scheduleFireworks() {
        // Launch 4 fireworks with delays
        const delays = [0, 500, 1000, 1500];
        
        delays.forEach(delay => {
            setTimeout(() => {
                this.createFirework();
            }, delay);
        });
    }

    createFirework() {
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        const colors = [];
        
        // Random launch position
        const launchX = (Math.random() - 0.5) * 10;
        const launchY = 6 + Math.random() * 3;
        const launchZ = (Math.random() - 0.5) * 10;
        
        // Random color for this firework
        const fireworkColor = new THREE.Color();
        fireworkColor.setHSL(Math.random(), 1, 0.6);
        
        for (let i = 0; i < particleCount; i++) {
            // Explosion pattern (sphere)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const speed = 2 + Math.random() * 3;
            
            velocities.push({
                x: Math.sin(phi) * Math.cos(theta) * speed,
                y: Math.sin(phi) * Math.sin(theta) * speed,
                z: Math.cos(phi) * speed
            });
            
            positions[i * 3] = launchX;
            positions[i * 3 + 1] = launchY;
            positions[i * 3 + 2] = launchZ;
            
            colors.push(fireworkColor.r, fireworkColor.g, fireworkColor.b);
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.15,
            transparent: true,
            opacity: 1,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const firework = new THREE.Points(geometry, material);
        firework.userData = {
            velocities,
            lifetime: 0,
            maxLifetime: 2.0,
            gravity: -5
        };
        
        this.scene.add(firework);
        this.fireworks.push(firework);
    }

    update(delta) {
        if (!this.isActive) return;
        
        this.time += delta;
        
        // Update confetti
        this.confetti.forEach((confetto, index) => {
            if (!confetto.userData) return;
            
            confetto.userData.lifetime += delta;
            
            // Apply gravity
            confetto.userData.velocity.y -= 9.8 * delta;
            
            // Update position
            confetto.position.add(
                confetto.userData.velocity.clone().multiplyScalar(delta)
            );
            
            // Update rotation
            confetto.rotation.x += confetto.userData.angularVelocity.x * delta;
            confetto.rotation.y += confetto.userData.angularVelocity.y * delta;
            confetto.rotation.z += confetto.userData.angularVelocity.z * delta;
            
            // Remove if too old or fallen too far
            if (confetto.position.y < -5 || confetto.userData.lifetime > 10) {
                this.scene.remove(confetto);
                confetto.geometry.dispose();
                confetto.material.dispose();
                this.confetti.splice(index, 1);
            }
        });
        
        // Update fireworks
        this.fireworks.forEach((firework, index) => {
            firework.userData.lifetime += delta;
            
            const positions = firework.geometry.attributes.position.array;
            const velocities = firework.userData.velocities;
            
            for (let i = 0; i < positions.length / 3; i++) {
                // Apply gravity
                velocities[i].y += firework.userData.gravity * delta;
                
                // Update position
                positions[i * 3] += velocities[i].x * delta;
                positions[i * 3 + 1] += velocities[i].y * delta;
                positions[i * 3 + 2] += velocities[i].z * delta;
            }
            
            firework.geometry.attributes.position.needsUpdate = true;
            
            // Fade out
            const fadeProgress = firework.userData.lifetime / firework.userData.maxLifetime;
            firework.material.opacity = Math.max(0, 1 - fadeProgress);
            
            // Remove if expired
            if (firework.userData.lifetime >= firework.userData.maxLifetime) {
                this.scene.remove(firework);
                firework.geometry.dispose();
                firework.material.dispose();
                this.fireworks.splice(index, 1);
            }
        });
        
        // Create new fireworks periodically
        if (this.time > 2 && Math.random() < 0.02) {
            this.createFirework();
        }
    }
}
